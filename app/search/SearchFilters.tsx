"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const segments = [
  { slug: "business", label: "Business", color: "#5B8FEF" },
  { slug: "high_risk_fiat", label: "High-Risk Fiat", color: "#B8860B" },
  { slug: "high_risk_crypto", label: "High-Risk Crypto", color: "#7C6BD4" },
  { slug: "alternative_dark", label: "Alternative", color: "#059669" },
];

const methodTypes = [
  { value: "fiat", label: "Fiat / Cards" },
  { value: "crypto", label: "Crypto" },
  { value: "local", label: "Local" },
  { value: "bank", label: "Bank" },
];

const kycLevels = [
  { value: "none", label: "No KYC" },
  { value: "basic", label: "Basic" },
  { value: "standard", label: "Standard" },
  { value: "full", label: "Full" },
];

const volumeBuckets = [
  { value: "small", label: "Small", hint: "$0 – $100k / mo" },
  { value: "medium", label: "Medium", hint: "$100k – $1M / mo" },
  { value: "enterprise", label: "Enterprise", hint: "$1M+ / mo" },
];

const statusOptions = [
  { value: "", label: "All" },
  { value: "true", label: "Verified" },
  { value: "featured", label: "Featured" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: "#9CA3AF" }}>
      {children}
    </p>
  );
}

function FilterBtn({ active, color, onClick, children }: {
  active: boolean; color?: string; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
      style={
        active
          ? {
              background: color ? `${color}12` : "rgba(201,168,76,0.10)",
              color: color ?? "#B8860B",
              border: `1px solid ${color ?? "#C9A84C"}30`,
              fontWeight: 500,
            }
          : { color: "#6B7280", border: "1px solid transparent" }
      }
    >
      {children}
    </button>
  );
}

type Country = { code: string; name: string; region: string | null };

function FiltersContent({
  cur,
  update,
  countries,
  onAfterPick,
}: {
  cur: (key: string) => string;
  update: (key: string, value: string) => void;
  countries: Country[];
  onAfterPick?: () => void;
}) {
  const pick = (key: string, value: string) => {
    update(key, value);
    onAfterPick?.();
  };

  const countriesByRegion = countries.reduce<Record<string, Country[]>>((acc, c) => {
    const r = c.region ?? "Other";
    (acc[r] ||= []).push(c);
    return acc;
  }, {});
  const regions = Object.keys(countriesByRegion).sort();

  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Country</SectionLabel>
        <select
          value={cur("country")}
          onChange={(e) => pick("country", e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(15,23,42,0.10)",
            color: cur("country") ? "#0D0F1E" : "#6B7280",
          }}
        >
          <option value="">All countries</option>
          {regions.map((r) => (
            <optgroup key={r} label={r}>
              {countriesByRegion[r].map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <SectionLabel>Segment</SectionLabel>
        <div className="space-y-0.5">
          <FilterBtn active={!cur("segment")} color="#B8860B" onClick={() => pick("segment", "")}>
            All segments
          </FilterBtn>
          {segments.map((s) => (
            <FilterBtn key={s.slug} active={cur("segment") === s.slug} color={s.color} onClick={() => pick("segment", s.slug)}>
              {s.label}
            </FilterBtn>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Payment method</SectionLabel>
        <div className="space-y-0.5">
          <FilterBtn active={!cur("method")} onClick={() => pick("method", "")}>All methods</FilterBtn>
          {methodTypes.map((m) => (
            <FilterBtn key={m.value} active={cur("method") === m.value} onClick={() => pick("method", m.value)}>
              {m.label}
            </FilterBtn>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Monthly volume</SectionLabel>
        <div className="space-y-0.5">
          <FilterBtn active={!cur("volume")} onClick={() => pick("volume", "")}>Any volume</FilterBtn>
          {volumeBuckets.map((v) => (
            <FilterBtn key={v.value} active={cur("volume") === v.value} onClick={() => pick("volume", v.value)}>
              <span className="block">{v.label}</span>
              <span className="block text-[11px] mt-0.5" style={{ color: cur("volume") === v.value ? "inherit" : "#9CA3AF", opacity: cur("volume") === v.value ? 0.75 : 1 }}>
                {v.hint}
              </span>
            </FilterBtn>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>KYC</SectionLabel>
        <div className="space-y-0.5">
          <FilterBtn active={!cur("kyc")} onClick={() => pick("kyc", "")}>Any</FilterBtn>
          {kycLevels.map((k) => (
            <FilterBtn key={k.value} active={cur("kyc") === k.value} onClick={() => pick("kyc", k.value)}>
              {k.label}
            </FilterBtn>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Status</SectionLabel>
        <div className="space-y-0.5">
          {statusOptions.map((s) => (
            <FilterBtn key={s.value} active={cur("verified") === s.value} onClick={() => pick("verified", s.value)}>
              {s.label}
            </FilterBtn>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchFilters({ countries }: { countries: Country[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(params.toString());
      value ? p.set(key, value) : p.delete(key);
      p.delete("page");
      router.push(`/search?${p.toString()}`);
    },
    [params, router]
  );

  const cur = useCallback((key: string) => params.get(key) ?? "", [params]);

  const activeCount =
    (cur("country") ? 1 : 0) +
    (cur("segment") ? 1 : 0) +
    (cur("method") ? 1 : 0) +
    (cur("volume") ? 1 : 0) +
    (cur("kyc") ? 1 : 0) +
    (cur("verified") ? 1 : 0);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium"
        style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.10)", color: "#0D0F1E" }}
      >
        <span className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="7" y1="12" x2="20" y2="12" />
            <line x1="10" y1="18" x2="20" y2="18" />
          </svg>
          Filters
          {activeCount > 0 && (
            <span
              className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold"
              style={{ background: "#0D0F1E", color: "#FFFFFF" }}
            >
              {activeCount}
            </span>
          )}
        </span>
        <span className="text-xs" style={{ color: "#9CA3AF" }}>Tap to open</span>
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(15,23,42,0.5)" }}>
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileOpen(false)}
            className="flex-1"
          />
          <div
            className="rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto"
            style={{ background: "#FFFFFF" }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold" style={{ color: "#0D0F1E" }}>Filters</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 -mr-2 rounded-lg"
                style={{ color: "#6B7280" }}
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <FiltersContent cur={cur} update={update} countries={countries} onAfterPick={() => setMobileOpen(false)} />

            <div className="mt-6 flex gap-2">
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    router.push("/search");
                    setMobileOpen(false);
                  }}
                  className="flex-1 py-3 rounded-lg text-sm font-medium"
                  style={{ background: "#F3F4F6", color: "#6B7280" }}
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex-1 py-3 rounded-lg text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #C9A84C, #E2C97E)", color: "#07081C" }}
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-52 shrink-0">
        <FiltersContent cur={cur} update={update} countries={countries} />

        {activeCount > 0 && (
          <button
            onClick={() => router.push("/search")}
            className="w-full text-center text-xs py-1.5 mt-6 transition-colors hover:text-red-500"
            style={{ color: "#9CA3AF" }}
          >
            Reset filters
          </button>
        )}
      </aside>
    </>
  );
}
