#!/usr/bin/env bash
# Daily cron entrypoint for the auto-scraper.
# Schedule on Railway: "0 4 * * *" (4 AM UTC daily).
# Cap of 70 countries × 5 segments = 350 Gemini grounding calls — 70% of the
# free-tier 500/day budget. The 30% margin covers ad-hoc test runs during the
# day, retry storms, and future country additions. Smart-skip orders
# oldest-first, so the full world (~156 countries) covers in roughly 3 days.
set -euo pipefail
cd "$(dirname "$0")/.."
uv run python scripts/scrape_processors.py --max-countries 70
