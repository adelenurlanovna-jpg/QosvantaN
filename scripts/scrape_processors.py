"""
Auto-scraper for payment processors across all countries in DB.

Daily cron: full pass over every country, but smart-skips countries whose
processors were already scraped within the last 20 hours (idempotent —
re-runs are safe). Uses Gemini 2.5 Flash with Google Search grounding for
discovery + structured extraction in a single API call.

Storage: upserts into `processors` with status='pending_review', is_verified=false.
All changes logged to `data_change_log` with source='scraper'.

Usage:
    uv run python scripts/scrape_processors.py              # daily cron (skips fresh)
    uv run python scripts/scrape_processors.py --force      # full pass, no skip
    uv run python scripts/scrape_processors.py --country DE # single country (always)
    uv run python scripts/scrape_processors.py --dry-run    # don't write to DB

Required env:
    GEMINI_API_KEY            — https://aistudio.google.com/apikey
    SUPABASE_URL              — Supabase project URL
    SUPABASE_SERVICE_KEY      — service_role key (NOT anon)
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
import time
from pathlib import Path
from typing import Any

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env.local")

GEMINI_API_KEYS = [
    k for k in [os.environ.get("GEMINI_API_KEY"), os.environ.get("GEMINI_API_KEY_2")] if k
]
SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get(
    "SUPABASE_SERVICE_ROLE_KEY"
)

GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_ENDPOINT = (
    f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
)

# Track per-key state across calls: if a key returns 429, mark it exhausted
# and stop trying it for the rest of the run.
_key_exhausted: dict[str, bool] = {}
_call_counter = {"n": 0}


def _next_key() -> str | None:
    """Round-robin across non-exhausted keys."""
    available = [k for k in GEMINI_API_KEYS if not _key_exhausted.get(k)]
    if not available:
        return None
    key = available[_call_counter["n"] % len(available)]
    _call_counter["n"] += 1
    return key

REQUEST_DELAY_SECONDS = 5
MAX_RETRIES = 3
SEGMENTS = ["business", "high_risk_fiat", "high_risk_crypto", "alternative_dark", "wallets"]


# ============================================================
# Gemini extraction
# ============================================================

EXTRACTION_PROMPT = """You are a payment-industry research assistant. Find payment processors,
acquirers, gateways, and wallets that serve merchants in {country_name} ({country_code}).

Focus on the segment: {segment_desc}

Use Google Search to find current providers. For each provider, return ONLY structured JSON.

Return a JSON object with this shape (no markdown, no explanation):
{{
  "providers": [
    {{
      "name": "Stripe",
      "website": "https://stripe.com",
      "description": "One-sentence description of what they do and their target merchants.",
      "segment": "business",
      "kyc_level": "standard",
      "onboarding_days_min": 1,
      "onboarding_days_max": 7,
      "supports_country": true,
      "payment_methods": ["Visa / Mastercard", "ACH / Bank Transfer"],
      "licensed_in": ["US", "GB"],
      "source_urls": ["https://stripe.com/global"]
    }}
  ]
}}

Rules:
- segment must be one of: business, high_risk_fiat, high_risk_crypto, alternative_dark, wallets
- kyc_level must be one of: none, basic, standard, full
- Only include providers that clearly support merchants in {country_name}
- Aim for 5-10 providers per country. Quality over quantity.
- Skip providers you're not confident exist.
- DO NOT invent providers. If you can't find good results, return an empty array.
"""

SEGMENT_DESCRIPTIONS = {
    "business": "Mainstream licensed processors for e-commerce, SaaS, marketplaces (Stripe, Adyen tier).",
    "high_risk_fiat": "High-risk acquirers accepting cards for gambling, forex, adult, nutra, CBD.",
    "high_risk_crypto": "Crypto payment gateways for iGaming, p2p, crypto-forex, casinos.",
    "alternative_dark": "Offshore, low-KYC, anonymous-friendly processors.",
    "wallets": "Self-custodial and custodial crypto wallets used for direct merchant settlement.",
}


def call_gemini(country_code: str, country_name: str, segment: str) -> dict[str, Any] | None:
    """Single API call to Gemini Flash with Google Search grounding.

    Rotates across GEMINI_API_KEYS. On 429 marks the key exhausted for the
    rest of the run and retries with the next key. Short backoff on transient
    429s when only one key is configured.
    """
    if not GEMINI_API_KEYS:
        print(f"  [skip] No GEMINI_API_KEY(s) set", file=sys.stderr)
        return None

    prompt = EXTRACTION_PROMPT.format(
        country_name=country_name,
        country_code=country_code,
        segment_desc=SEGMENT_DESCRIPTIONS[segment],
    )

    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "tools": [{"google_search": {}}],
        "generationConfig": {"temperature": 0.2},
    }

    resp = None
    for attempt in range(MAX_RETRIES):
        key = _next_key()
        if key is None:
            print(f"  [error] All Gemini keys exhausted for today", file=sys.stderr)
            return None

        try:
            resp = requests.post(
                GEMINI_ENDPOINT,
                params={"key": key},
                json=body,
                timeout=120,
            )
        except Exception as e:
            print(f"  [error] Gemini call failed: {e}", file=sys.stderr)
            return None

        if resp.status_code == 429:
            key_id = key[-6:]
            _key_exhausted[key] = True
            print(f"  [quota] key ...{key_id} exhausted, trying next", file=sys.stderr)
            if attempt < MAX_RETRIES - 1:
                continue
        break

    if resp is None or resp.status_code != 200:
        code = resp.status_code if resp is not None else "n/a"
        body_preview = resp.text[:300] if resp is not None else ""
        print(f"  [error] Gemini HTTP {code}: {body_preview}", file=sys.stderr)
        return None

    try:
        data = resp.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        # Strip markdown fences if Gemini wraps JSON despite instructions
        text = text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text
            text = text.rsplit("```", 1)[0]
        return json.loads(text)
    except (KeyError, json.JSONDecodeError, IndexError) as e:
        print(f"  [error] Bad Gemini response: {e}", file=sys.stderr)
        return None


# ============================================================
# Supabase REST client (minimal — no external SDK)
# ============================================================


class Supabase:
    def __init__(self, url: str, key: str):
        self.url = url.rstrip("/")
        self.key = key
        self.headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

    def _request(self, method: str, path: str, body: Any = None, params: dict | None = None) -> Any:
        try:
            resp = requests.request(
                method,
                f"{self.url}/rest/v1{path}",
                params=params,
                json=body,
                headers=self.headers,
                timeout=30,
            )
        except Exception as e:
            print(f"  [supabase] {method} {path} network error: {e}", file=sys.stderr)
            return None

        if resp.status_code >= 400:
            print(f"  [supabase] {method} {path} → {resp.status_code}: {resp.text[:200]}",
                  file=sys.stderr)
            return None

        try:
            return resp.json() if resp.content else None
        except json.JSONDecodeError:
            return None

    def select(self, table: str, params: dict | None = None) -> list[dict]:
        return self._request("GET", f"/{table}", params=params) or []

    def upsert(self, table: str, body: list[dict], on_conflict: str = "slug") -> list[dict]:
        return self._request("POST", f"/{table}",
                             body=body,
                             params={"on_conflict": on_conflict}) or []

    def insert(self, table: str, body: list[dict]) -> list[dict]:
        return self._request("POST", f"/{table}", body=body) or []


# ============================================================
# Pipeline
# ============================================================


def slugify(name: str) -> str:
    import re
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s[:64] or "unknown"


SKIP_IF_SCRAPED_WITHIN_HOURS = 20


def filter_countries_needing_scrape(sb: "Supabase", all_countries: list[dict]) -> list[dict]:
    """Skip countries with fresh processors and order the rest oldest-first.

    Returns countries that either have no scraped processors yet, or whose
    most-recent processor was scraped more than SKIP_IF_SCRAPED_WITHIN_HOURS ago.
    Sorted by latest scrape ascending (never-scraped countries first), so a daily
    cron with --max-countries always works on the most stale data.
    """
    cutoff = dt.datetime.now(dt.UTC) - dt.timedelta(hours=SKIP_IF_SCRAPED_WITHIN_HOURS)
    cutoff_iso = cutoff.isoformat()

    enriched = []
    for c in all_countries:
        rows = sb.select("processor_countries", {
            "select": "processors(last_scraped_at)",
            "country_id": f"eq.{c['id']}",
            "role": "eq.client_geo",
            "order": "processors(last_scraped_at).desc.nullslast",
            "limit": "1",
        }) or []
        latest = None
        if rows and rows[0].get("processors"):
            latest = rows[0]["processors"].get("last_scraped_at")

        if latest is None or latest < cutoff_iso:
            enriched.append({**c, "_latest": latest or ""})

    # Oldest first (empty string = never scraped → highest priority)
    enriched.sort(key=lambda c: c["_latest"])
    return enriched


def process_country(sb: Supabase, country: dict, segments_map: dict[str, str],
                    countries_map: dict[str, str], dry_run: bool) -> int:
    """Run all segments for one country. Returns count of new/updated processors."""
    code = country["code"]
    name = country["name"]
    print(f"\n→ {name} ({code})")

    total_upserted = 0

    for segment_slug in SEGMENTS:
        print(f"  · segment={segment_slug}")
        result = call_gemini(code, name, segment_slug)
        time.sleep(REQUEST_DELAY_SECONDS)

        if not result or "providers" not in result:
            continue

        providers = result["providers"]
        print(f"    found {len(providers)} candidates")

        for prov in providers:
            try:
                processor_row = {
                    "name": prov["name"][:200],
                    "slug": slugify(prov["name"]),
                    "segment_id": segments_map[prov.get("segment", segment_slug)],
                    "description": (prov.get("description") or "")[:1000],
                    "website_url": prov.get("website"),
                    "scraper_url": prov.get("website"),
                    "kyc_level": prov.get("kyc_level", "standard"),
                    "onboarding_days_min": prov.get("onboarding_days_min"),
                    "onboarding_days_max": prov.get("onboarding_days_max"),
                    "is_verified": False,
                    "status": "pending_review",
                    "last_scraped_at": dt.datetime.utcnow().isoformat() + "Z",
                }
            except (KeyError, TypeError) as e:
                print(f"    [skip] malformed provider: {e}", file=sys.stderr)
                continue

            if dry_run:
                print(f"    [dry] would upsert {processor_row['slug']}")
                total_upserted += 1
                continue

            upserted = sb.upsert("processors", [processor_row], on_conflict="slug")
            if not upserted:
                continue
            processor_id = upserted[0]["id"]
            total_upserted += 1

            # Link to country (client_geo role)
            country_id = countries_map.get(code)
            if country_id:
                sb.upsert(
                    "processor_countries",
                    [{
                        "processor_id": processor_id,
                        "country_id": country_id,
                        "role": "client_geo",
                        "is_supported": prov.get("supports_country", True),
                    }],
                    on_conflict="processor_id,country_id,role",
                )

            # Audit log
            sb.insert("data_change_log", [{
                "processor_id": processor_id,
                "table_name": "processors",
                "field_name": "auto_scrape",
                "new_value": json.dumps({"country": code, "segment": segment_slug,
                                         "sources": prov.get("source_urls", [])})[:2000],
                "source": "scraper",
                "change_type": "create",
            }])

    print(f"  ✓ upserted {total_upserted} processors")
    return total_upserted


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--country", help="Process a single country by ISO code (e.g. DE)")
    parser.add_argument("--all", action="store_true",
                        help="Process all countries unconditionally (ignore freshness skip)")
    parser.add_argument("--dry-run", action="store_true", help="Don't write to Supabase")
    parser.add_argument("--force", action="store_true",
                        help="Bypass smart-skip and re-scrape even fresh countries")
    parser.add_argument("--max-countries", type=int, default=None,
                        help="Hard cap: process at most N countries per run (oldest first). "
                             "Recommended for free-tier cron: 90 (= 450 grounding calls).")
    args = parser.parse_args()

    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("[fatal] SUPABASE_URL and SUPABASE_SERVICE_KEY required", file=sys.stderr)
        sys.exit(1)

    sb = Supabase(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    segments = sb.select("segments", {"select": "id,slug"})
    countries = sb.select("countries", {"select": "id,code,name"})
    if not segments or not countries:
        print("[fatal] Could not load segments/countries from Supabase", file=sys.stderr)
        sys.exit(1)

    segments_map = {s["slug"]: s["id"] for s in segments}
    countries_map = {c["code"]: c["id"] for c in countries}

    if args.country:
        target = [c for c in countries if c["code"] == args.country.upper()]
    elif args.all or args.force:
        target = countries
    else:
        # Default cron behavior: oldest-first with smart-skip
        target = filter_countries_needing_scrape(sb, countries)

    capped = False
    if args.max_countries and len(target) > args.max_countries:
        target = target[:args.max_countries]
        capped = True

    skipped = len(countries) - len(target) if not args.country else 0
    print(f"Loaded {len(GEMINI_API_KEYS)} Gemini API key(s)")
    cap_note = f", capped at {args.max_countries}" if capped else ""
    print(f"Processing {len(target)} countries (skipped {skipped} fresh{cap_note}, dry_run={args.dry_run})")

    grand_total = 0
    for country in target:
        grand_total += process_country(sb, country, segments_map, countries_map, args.dry_run)

    print(f"\n=== Done. Total upserts: {grand_total} ===")


if __name__ == "__main__":
    main()
