import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import SearchFilters from "./SearchFilters";

type MetaCopy = { title: string; description: string };

const segmentMeta: Record<string, MetaCopy> = {
  business: {
    title: "Business Payment Providers — E-commerce, SaaS & Platforms",
    description:
      "Compare standard payment processors for e-commerce, SaaS and online platforms. Card processing, ACH, SEPA, wallets and bank transfers — vetted providers with transparent fees.",
  },
  high_risk_fiat: {
    title: "High-Risk Payment Providers for iGaming, Forex & Regulated Verticals",
    description:
      "Curated directory of high-risk fiat payment processors. iGaming, forex, adult, gambling and regulated industries — compare KYB requirements, settlement times and rolling reserves.",
  },
  high_risk_crypto: {
    title: "High-Risk Crypto Payment Gateways — USDT, BTC, ETH",
    description:
      "Crypto-native payment infrastructure for high-risk and crypto-first businesses. USDT, BTC, ETH and stablecoin gateways with on-chain settlement, custody and off-ramp options.",
  },
  alternative_dark: {
    title: "Alternative Payment Rails — Non-Standard Payment Methods",
    description:
      "Specialized payment rails for non-standard verticals. Alternative settlement, cash-based, voucher and emerging market payment methods with deep regional coverage.",
  },
};

const methodMeta: Record<string, MetaCopy> = {
  crypto: {
    title: "Crypto Payment Gateways — Compare USDT, BTC & Stablecoin Processors",
    description:
      "Compare crypto payment gateways for online businesses. USDT, BTC, ETH and stablecoin processing with auto-conversion, custody and global on/off-ramp coverage.",
  },
  fiat: {
    title: "Fiat & Card Payment Processors — Compare Acquirers Worldwide",
    description:
      "Compare fiat card acquirers, alternative payment methods and bank transfer providers across 190+ countries. Find the right merchant account for your industry and volume.",
  },
  local: {
    title: "Local Payment Methods — PIX, UPI, M-Pesa, QRIS & More",
    description:
      "Discover local payment providers in emerging markets: Brazil PIX, India UPI, Kenya M-Pesa, Indonesia QRIS, Mexico SPEI. Country-by-country coverage for global merchants.",
  },
  bank: {
    title: "Bank Transfer Providers — SWIFT, SEPA & Local Bank Rails",
    description:
      "Compare bank transfer payment providers covering SWIFT, SEPA, ACH, Faster Payments and local bank rails. B2B-friendly settlement with full audit trail.",
  },
};

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await searchParams;
  const segment = params.segment;
  const method = params.method;

  const meta: MetaCopy = (segment && segmentMeta[segment]) ||
    (method && methodMeta[method]) || {
      title: "Browse Payment Providers — Compare 200+ Processors",
      description:
        "Browse and filter our directory of 200+ payment providers by segment, method, country, KYC requirements and fees. Find the right provider for your business in minutes.",
    };

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: segment ? `/search?segment=${segment}` : method ? `/search?method=${method}` : "/search" },
    openGraph: { title: meta.title, description: meta.description, type: "website" },
  };
}


const segmentColors: Record<string, string> = {
  business: "#5B8FEF",
  high_risk_fiat: "#B8860B",
  high_risk_crypto: "#7C6BD4",
  alternative_dark: "#059669",
};

const kycLabels: Record<string, string> = {
  none: "No KYC",
  basic: "Basic KYC",
  standard: "Standard KYC",
  full: "Full KYC",
};

type SearchParams = Promise<{ [key: string]: string | undefined }>;

const PAGE_SIZE = 24;

async function getProcessors(searchParams: Awaited<SearchParams>, page: number) {
  const supabase = await createClient();

  let query = supabase
    .from("processors")
    .select(`
      id, name, slug, description, website_url, kyc_level,
      onboarding_days_min, onboarding_days_max, api_quality_score,
      is_verified, is_featured, status, last_verified_at,
      segments ( slug, display_name ),
      volume_tiers ( fee_percentage, fee_fixed_usd, settlement_currency, rolling_reserve_percentage, rolling_reserve_days ),
      processor_payment_methods ( payment_methods ( type, name ) )
    `, { count: "exact" })
    .in("status", ["active", "pending_review"])
    .order("is_featured", { ascending: false })
    .order("is_verified", { ascending: false });

  if (searchParams.segment) {
    const { data: seg } = await supabase
      .from("segments").select("id").eq("slug", searchParams.segment).single();
    if (seg) query = query.eq("segment_id", (seg as any).id);
  }
  if (searchParams.country) {
    const { data: countryRow } = await supabase
      .from("countries").select("id").eq("code", searchParams.country.toUpperCase()).single();
    if (countryRow) {
      const { data: pcLinks } = await supabase
        .from("processor_countries").select("processor_id")
        .eq("country_id", (countryRow as any).id)
        .eq("role", "client_geo")
        .eq("is_supported", true);
      const pIds = [...new Set((pcLinks ?? []).map((l: any) => l.processor_id as string))];
      if (pIds.length > 0) query = query.in("id", pIds);
      else return { data: [], total: 0 };
    }
  }
  if (searchParams.method) {
    const { data: methods } = await supabase
      .from("payment_methods").select("id").eq("type", searchParams.method);
    const methodIds = (methods ?? []).map((m: any) => m.id);
    if (methodIds.length > 0) {
      const { data: links } = await supabase
        .from("processor_payment_methods").select("processor_id").in("payment_method_id", methodIds);
      const pIds = [...new Set((links ?? []).map((l: any) => l.processor_id as string))];
      if (pIds.length > 0) query = query.in("id", pIds);
      else return { data: [], total: 0 };
    }
  }
  if (searchParams.volume) {
    const probes: Record<string, number> = {
      small: 50_000,
      medium: 500_000,
      enterprise: 5_000_000,
    };
    const probe = probes[searchParams.volume];
    if (probe != null) {
      const { data: tiers } = await supabase
        .from("volume_tiers")
        .select("processor_id")
        .lte("volume_min_usd", probe)
        .or(`volume_max_usd.gte.${probe},volume_max_usd.is.null`);
      const pIds = [...new Set((tiers ?? []).map((t: any) => t.processor_id as string))];
      if (pIds.length > 0) query = query.in("id", pIds);
      else return { data: [], total: 0 };
    }
  }
  if (searchParams.kyc) query = query.eq("kyc_level", searchParams.kyc);
  if (searchParams.verified === "true") query = query.eq("is_verified", true);
  else if (searchParams.verified === "featured") query = query.eq("is_featured", true);
  if (searchParams.q) query = query.ilike("name", `%${searchParams.q}%`);

  const offset = (page - 1) * PAGE_SIZE;
  query = query.range(offset, offset + PAGE_SIZE - 1);

  const { data, count } = await query;
  return { data: data ?? [], total: count ?? 0 };
}

async function getCountries() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("countries")
    .select("code, name, region")
    .order("name", { ascending: true });
  return data ?? [];
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const [{ data: processors, total }, countries] = await Promise.all([
    getProcessors(params, page),
    getCountries(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildPageHref = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (k !== "page" && v) sp.set(k, v);
    });
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `/search?${qs}` : "/search";
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAFBFF" }}>
      <Header />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-2 transition-opacity hover:opacity-70" style={{ color: "#9CA3AF" }}>
              ← Back
            </Link>
            <h1 className="text-xl font-bold" style={{ color: "#0D0F1E" }}>
              {params.country
                ? `Local Methods — ${params.country.toUpperCase()}`
                : params.segment
                ? processors[0] ? `${(processors[0] as any).segments?.display_name}` : "Catalog"
                : params.method
                ? `${params.method.charAt(0).toUpperCase() + params.method.slice(1)} Providers`
                : "All providers"}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#9CA3AF" }}>
              {total === 0
                ? "No providers found"
                : total <= PAGE_SIZE
                ? `${total} provider${total === 1 ? "" : "s"} found`
                : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total}`}
            </p>
          </div>

          <form action="/search" method="get" className="flex gap-2 w-full sm:w-auto">
            {params.segment && <input type="hidden" name="segment" value={params.segment} />}
            <input
              name="q"
              type="text"
              defaultValue={params.q ?? ""}
              placeholder="Search by name..."
              className="flex-1 sm:flex-none sm:w-52 px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(15,23,42,0.12)",
                color: "#0D0F1E",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-85"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E2C97E)", color: "#07081C" }}
            >
              Search
            </button>
          </form>
        </div>


        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <Suspense fallback={null}>
            <SearchFilters countries={countries as { code: string; name: string; region: string | null }[]} />
          </Suspense>

          <div className="flex-1 min-w-0">
            {processors.length === 0 ? (
              <div className="text-center py-20 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.06)" }}>
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-medium text-base" style={{ color: "#374151" }}>No providers match these filters</p>
                <p className="text-sm mt-1 mb-6" style={{ color: "#9CA3AF" }}>
                  Try loosening the filters — or let Damir find a custom match for your case.
                </p>
                <a
                  href="#open-chat"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}
                >
                  💬 Ask Damir
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {processors.map((p: any) => {
                  const segSlug = p.segments?.slug ?? "business";
                  const color = segmentColors[segSlug] ?? "#B8860B";
                  const tier = p.volume_tiers?.[0];
                  const methods: string[] = [
                    ...new Set<string>(
                      (p.processor_payment_methods ?? [])
                        .map((pm: any) => pm.payment_methods?.type as string)
                        .filter(Boolean)
                    ),
                  ];

                  return (
                    <Link
                      key={p.id}
                      href={`/processors/${p.slug}`}
                      className="group block rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden"
                      style={
                        p.is_featured
                          ? {
                              background: "#FFFFFF",
                              border: "1px solid rgba(201,168,76,0.45)",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 8px 28px rgba(201,168,76,0.15)",
                            }
                          : {
                              background: "#FFFFFF",
                              border: "1px solid rgba(15,23,42,0.08)",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.03)",
                            }
                      }
                    >
                      {p.is_featured && (
                        <div
                          className="absolute left-0 top-0 bottom-0"
                          style={{
                            width: 3,
                            background: "linear-gradient(180deg, #C9A84C, #E2C97E)",
                          }}
                        />
                      )}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                            style={{ background: `${color}12`, color }}
                          >
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm" style={{ color: "#0D0F1E" }}>{p.name}</span>
                              {p.is_featured && (
                                <span
                                  className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold uppercase tracking-wider"
                                  style={{
                                    background: "linear-gradient(135deg, #C9A84C, #E2C97E)",
                                    color: "#07081C",
                                  }}
                                >★ Featured</span>
                              )}
                              {p.is_verified ? (
                                <span
                                  className="text-xs px-1.5 py-0.5 rounded-md font-semibold"
                                  style={{ background: "rgba(5,150,105,0.10)", color: "#059669", border: "1px solid rgba(5,150,105,0.25)" }}
                                  title="Verified by Qosvanta"
                                >✓ Verified</span>
                              ) : (
                                <span
                                  className="text-xs px-1.5 py-0.5 rounded-md font-semibold"
                                  style={{ background: "rgba(234,179,8,0.10)", color: "#A16207", border: "1px solid rgba(234,179,8,0.30)" }}
                                  title="Auto-scraped, not yet manually verified"
                                >⚠ Unverified</span>
                              )}
                            </div>
                            <span className="text-xs font-medium" style={{ color }}>{p.segments?.display_name}</span>
                          </div>
                        </div>

                        {tier?.fee_percentage != null && (
                          <div className="text-right shrink-0">
                            <div className="text-base font-bold" style={{ color: "#0D0F1E" }}>{tier.fee_percentage}%</div>
                            <div className="text-xs" style={{ color: "#9CA3AF" }}>fee</div>
                          </div>
                        )}
                      </div>

                      {p.description && (
                        <p className="text-xs mb-3 line-clamp-2 leading-relaxed" style={{ color: "#6B7280" }}>
                          {p.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1.5 text-xs">
                        <span
                          className="px-2 py-1 rounded-lg"
                          style={{ background: "rgba(15,23,42,0.04)", color: "#6B7280", border: "1px solid rgba(15,23,42,0.07)" }}
                        >
                          {kycLabels[p.kyc_level] ?? p.kyc_level}
                        </span>
                        {p.onboarding_days_min != null && (
                          <span
                            className="px-2 py-1 rounded-lg"
                            style={{ background: "rgba(15,23,42,0.04)", color: "#6B7280", border: "1px solid rgba(15,23,42,0.07)" }}
                          >
                            {p.onboarding_days_min}{p.onboarding_days_max ? `–${p.onboarding_days_max}` : "+"} days
                          </span>
                        )}
                        {tier?.rolling_reserve_percentage != null && (
                          <span
                            className="px-2 py-1 rounded-lg"
                            style={{ background: "rgba(184,134,11,0.08)", color: "#B8860B", border: "1px solid rgba(184,134,11,0.15)" }}
                          >
                            Rolling {tier.rolling_reserve_percentage}%
                          </span>
                        )}
                        {methods.map((m) => (
                          <span
                            key={m}
                            className="px-2 py-1 rounded-lg"
                            style={{ background: `${color}0D`, color, border: `1px solid ${color}25` }}
                          >
                            {m === "fiat" ? "💳" : m === "crypto" ? "₿" : m === "local" ? "🏦" : "🏛"} {m}
                          </span>
                        ))}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-8">
                {page > 1 && (
                  <Link
                    href={buildPageHref(page - 1)}
                    className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white"
                    style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.10)", color: "#374151" }}
                  >
                    ← Prev
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, i, arr) => (
                    <span key={p} className="flex items-center gap-1.5">
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span className="px-1" style={{ color: "#9CA3AF" }}>…</span>
                      )}
                      <Link
                        href={buildPageHref(p)}
                        className="min-w-[36px] text-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={
                          p === page
                            ? {
                                background: "linear-gradient(135deg, #C9A84C, #E2C97E)",
                                color: "#07081C",
                                fontWeight: 600,
                              }
                            : { background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.10)", color: "#374151" }
                        }
                      >
                        {p}
                      </Link>
                    </span>
                  ))}
                {page < totalPages && (
                  <Link
                    href={buildPageHref(page + 1)}
                    className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white"
                    style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.10)", color: "#374151" }}
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
