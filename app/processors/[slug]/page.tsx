import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProviderIntroButton from "@/components/ProviderIntroButton";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site-url";

const segmentColors: Record<string, string> = {
  business: "#5B8FEF",
  high_risk_fiat: "#B8860B",
  high_risk_crypto: "#7C6BD4",
  alternative_dark: "#059669",
};

const kycLabels: Record<string, string> = {
  none: "No KYC",
  basic: "Basic",
  standard: "Standard",
  full: "Full",
};

const methodIcons: Record<string, string> = {
  fiat: "💳",
  crypto: "₿",
  local: "🏦",
  bank: "🏛",
};

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("processors")
    .select("name, description, kyc_level, segments(display_name)")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Provider not found — Qosvanta" };

  const p = data as any;
  const segName = p.segments?.display_name;
  const title = segName
    ? `${p.name} — ${segName} payment provider | Qosvanta`
    : `${p.name} — payment provider | Qosvanta`;
  const description =
    p.description ??
    `${p.name} payment provider details on Qosvanta: fees, KYC, supported countries, settlement and onboarding terms.`;

  return {
    title,
    description: description.slice(0, 160),
    openGraph: {
      title,
      description: description.slice(0, 160),
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description: description.slice(0, 160),
    },
  };
}

export default async function ProcessorPage({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: processor } = await supabase
    .from("processors")
    .select(`
      *,
      segments ( slug, display_name, description ),
      volume_tiers ( * ),
      processor_payment_methods ( payment_methods ( * ) ),
      processor_verticals ( approval_likelihood, verticals ( name, display_name, risk_level ) ),
      processor_countries ( role, is_supported, countries ( code, name, name_ru, region ) )
    `)
    .eq("slug", slug)
    .single();

  if (!processor) notFound();

  const p = processor as any;
  const seg = p.segments;
  const color = segmentColors[seg?.slug ?? "business"] ?? "#5B8FEF";
  const tiers: any[] = p.volume_tiers ?? [];
  const methods: any[] = p.processor_payment_methods ?? [];
  const verticals: any[] = p.processor_verticals ?? [];
  const countries: any[] = p.processor_countries ?? [];

  const clientCountries = countries.filter((c: any) => c.role === "client_geo" && c.is_supported);
  const licenseJurisdictions = countries.filter((c: any) => c.role === "license_jurisdiction");

  const daysSinceVerified = p.last_verified_at
    ? Math.floor((Date.now() - new Date(p.last_verified_at).getTime()) / 86400000)
    : null;

  const cardStyle = {
    background: "#FFFFFF",
    border: "1px solid rgba(15,23,42,0.08)",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.04)",
  };

  const innerCardStyle = {
    background: "rgba(248,249,255,0.7)",
    border: "1px solid rgba(15,23,42,0.07)",
    borderRadius: "0.75rem",
    padding: "1rem",
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: p.name,
    description: p.description ?? `${p.name} payment provider — fees, KYC, supported countries and settlement terms.`,
    provider: { "@type": "Organization", name: p.name },
    serviceType: seg?.display_name ?? "Payment processing",
    areaServed: clientCountries.slice(0, 20).map((c: any) => c.countries?.name).filter(Boolean),
    offers: p.fee_pct != null ? { "@type": "Offer", priceCurrency: "USD", description: `From ${p.fee_pct}% per transaction` } : undefined,
    url: `${SITE_URL}/processors/${slug}`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Catalog", item: `${SITE_URL}/search` },
      ...(seg?.slug ? [{ "@type": "ListItem", position: 3, name: seg.display_name, item: `${SITE_URL}/search?segment=${seg.slug}` }] : []),
      { "@type": "ListItem", position: seg?.slug ? 4 : 3, name: p.name, item: `${SITE_URL}/processors/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAFBFF" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header />

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "#9CA3AF" }}>
          <Link href="/search" className="hover:text-gray-700 transition-colors">Catalog</Link>
          <span>/</span>
          <Link href={`/search?segment=${seg?.slug}`} className="hover:text-gray-700 transition-colors font-medium" style={{ color }}>
            {seg?.display_name}
          </Link>
          <span>/</span>
          <span style={{ color: "#0D0F1E" }}>{p.name}</span>
        </nav>

        {/* Featured banner */}
        {p.is_featured && (
          <div
            className="mb-5 rounded-2xl p-4 sm:p-5 flex items-center gap-4"
            style={{
              background: "linear-gradient(135deg, #08111F 0%, #1a1d35 100%)",
              border: "1px solid rgba(201,168,76,0.3)",
              boxShadow: "0 8px 32px rgba(201,168,76,0.10)",
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E2C97E)", color: "#07081C" }}
            >
              ★
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#C9A84C" }}>
                Featured Partner
              </p>
              <p className="text-sm leading-snug" style={{ color: "#F1F5F9" }}>
                Hand-picked by Qosvanta editors — top of its segment, verified track record, dedicated onboarding support.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">

            {/* Header card */}
            <div
              style={
                p.is_featured
                  ? {
                      ...cardStyle,
                      border: "2px solid rgba(201,168,76,0.4)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 8px 32px rgba(201,168,76,0.08)",
                    }
                  : cardStyle
              }
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shrink-0"
                  style={{ background: `${color}12`, color }}
                >
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold" style={{ color: "#0D0F1E" }}>{p.name}</h1>
                    {p.is_verified && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "rgba(5,150,105,0.08)", color: "#059669", border: "1px solid rgba(5,150,105,0.2)" }}
                      >
                        ✓ Verified
                      </span>
                    )}
                    {p.is_featured && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "rgba(184,134,11,0.08)", color: "#B8860B", border: "1px solid rgba(184,134,11,0.2)" }}
                      >
                        ★ Featured
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium mt-0.5 block" style={{ color }}>
                    {seg?.display_name}
                  </span>
                  {p.description && (
                    <p className="mt-3 leading-relaxed text-sm" style={{ color: "#6B7280" }}>{p.description}</p>
                  )}
                </div>
              </div>

              {methods.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {methods.map((pm: any) => (
                    <span
                      key={pm.payment_methods?.name}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium"
                      style={{
                        background: "rgba(15,23,42,0.04)",
                        color: "#6B7280",
                        border: "1px solid rgba(15,23,42,0.08)",
                      }}
                    >
                      {methodIcons[pm.payment_methods?.type] ?? "💰"} {pm.payment_methods?.name}
                    </span>
                  ))}
                </div>
              )}

              <div
                className="flex flex-wrap gap-3 mt-5 pt-5"
                style={{ borderTop: "1px solid rgba(15,23,42,0.07)" }}
              >
                {p.website_url && (
                  <a
                    href={p.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
                    style={{ background: color, color: "#FFFFFF" }}
                  >
                    Visit website →
                  </a>
                )}
                <div className="flex items-center gap-4 text-sm" style={{ color: "#9CA3AF" }}>
                  {daysSinceVerified !== null && <span>Updated {daysSinceVerified} days ago</span>}
                  <span>KYC: {kycLabels[p.kyc_level] ?? p.kyc_level}</span>
                  {p.api_quality_score && (
                    <span>API: {"★".repeat(p.api_quality_score)}{"☆".repeat(5 - p.api_quality_score)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Volume tiers */}
            {tiers.length > 0 && (
              <div style={cardStyle}>
                <h2 className="font-semibold mb-4 text-sm" style={{ color: "#0D0F1E" }}>Volume tiers</h2>
                <div className="space-y-3">
                  {tiers.map((tier: any, i: number) => (
                    <div key={i} style={innerCardStyle}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium" style={{ color: "#6B7280" }}>
                          {tier.volume_min_usd === 0 && !tier.volume_max_usd
                            ? "All volumes"
                            : tier.volume_max_usd
                            ? `$${(tier.volume_min_usd / 1000).toFixed(0)}k – $${(tier.volume_max_usd / 1000).toFixed(0)}k / mo`
                            : `$${(tier.volume_min_usd / 1000).toFixed(0)}k+ / mo`}
                        </span>
                        {tier.fee_percentage != null && (
                          <span className="text-lg font-bold" style={{ color: "#0D0F1E" }}>{tier.fee_percentage}%</span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs" style={{ color: "#6B7280" }}>
                        {tier.fee_fixed_usd != null && (
                          <div><span style={{ color: "#9CA3AF" }}>+ fixed:</span> ${tier.fee_fixed_usd}</div>
                        )}
                        {tier.rolling_reserve_percentage != null && (
                          <div style={{ color: "#B8860B" }}>
                            Rolling: {tier.rolling_reserve_percentage}% / {tier.rolling_reserve_days} days
                          </div>
                        )}
                        {tier.chargeback_limit_percentage != null && (
                          <div><span style={{ color: "#9CA3AF" }}>Chargeback:</span> {tier.chargeback_limit_percentage}%</div>
                        )}
                        {tier.settlement_days_min != null && (
                          <div>
                            <span style={{ color: "#9CA3AF" }}>Settlement:</span>{" "}
                            {tier.settlement_days_min}{tier.settlement_days_max ? `–${tier.settlement_days_max}` : "+"} days
                          </div>
                        )}
                        {tier.settlement_currency?.length > 0 && (
                          <div><span style={{ color: "#9CA3AF" }}>Currency:</span> {tier.settlement_currency.join(", ")}</div>
                        )}
                        {tier.transaction_limit_usd != null && (
                          <div><span style={{ color: "#9CA3AF" }}>Limit:</span> ${tier.transaction_limit_usd.toLocaleString()}</div>
                        )}
                      </div>
                      {tier.notes && (
                        <p className="text-xs mt-2 italic" style={{ color: "#9CA3AF" }}>{tier.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verticals */}
            {verticals.length > 0 && (
              <div style={cardStyle}>
                <h2 className="font-semibold mb-4 text-sm" style={{ color: "#0D0F1E" }}>Supported verticals</h2>
                <div className="flex flex-wrap gap-2">
                  {verticals.map((pv: any) => {
                    const likelihood = pv.approval_likelihood;
                    const badge: Record<string, { bg: string; color: string }> = {
                      confirmed: { bg: "rgba(5,150,105,0.08)", color: "#059669" },
                      high: { bg: "rgba(91,143,239,0.08)", color: "#5B8FEF" },
                      medium: { bg: "rgba(15,23,42,0.04)", color: "#6B7280" },
                      low: { bg: "rgba(220,38,38,0.06)", color: "#DC2626" },
                    };
                    const style = badge[likelihood as keyof typeof badge] ?? badge.medium;
                    return (
                      <span
                        key={pv.verticals?.name}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background: style.bg, color: style.color, border: `1px solid ${style.color}25` }}
                      >
                        {pv.verticals?.display_name}
                        {likelihood === "confirmed" && " ✓"}
                      </span>
                    );
                  })}
                </div>
                <p className="text-xs mt-3" style={{ color: "#9CA3AF" }}>
                  ✓ Confirmed · blue — high chance · grey — medium · red — low
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick stats */}
            <div style={cardStyle}>
              <h3 className="font-semibold mb-4 text-sm" style={{ color: "#0D0F1E" }}>Quick stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span style={{ color: "#9CA3AF" }}>KYC</span>
                  <span className="font-medium" style={{ color: "#0D0F1E" }}>{kycLabels[p.kyc_level]}</span>
                </div>
                {p.onboarding_days_min != null && (
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#9CA3AF" }}>Onboarding</span>
                    <span className="font-medium" style={{ color: "#0D0F1E" }}>
                      {p.onboarding_days_min}{p.onboarding_days_max ? `–${p.onboarding_days_max}` : "+"} days
                    </span>
                  </div>
                )}
                {tiers[0]?.fee_percentage != null && (
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#9CA3AF" }}>Fee from</span>
                    <span className="font-bold text-base" style={{ color: "#0D0F1E" }}>{tiers[0].fee_percentage}%</span>
                  </div>
                )}
                {tiers[0]?.rolling_reserve_percentage != null && (
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#9CA3AF" }}>Rolling reserve</span>
                    <span className="font-medium" style={{ color: "#B8860B" }}>
                      {tiers[0].rolling_reserve_percentage}% / {tiers[0].rolling_reserve_days} days
                    </span>
                  </div>
                )}
                {p.api_quality_score && (
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#9CA3AF" }}>API quality</span>
                    <span className="font-medium" style={{ color: "#B8860B" }}>
                      {"★".repeat(p.api_quality_score)}{"☆".repeat(5 - p.api_quality_score)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Client geographies */}
            {clientCountries.length > 0 && (
              <div style={cardStyle}>
                <h3 className="font-semibold mb-3 text-sm" style={{ color: "#0D0F1E" }}>
                  Accepts from ({clientCountries.length})
                </h3>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                  {clientCountries.slice(0, 30).map((pc: any) => (
                    <span
                      key={pc.countries?.code}
                      className="text-xs px-2 py-1 rounded-lg font-medium"
                      style={{
                        background: "rgba(15,23,42,0.04)",
                        color: "#6B7280",
                        border: "1px solid rgba(15,23,42,0.07)",
                      }}
                      title={pc.countries?.name}
                    >
                      {pc.countries?.code}
                    </span>
                  ))}
                  {clientCountries.length > 30 && (
                    <span className="text-xs px-2 py-1" style={{ color: "#9CA3AF" }}>
                      +{clientCountries.length - 30} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* License jurisdictions */}
            {licenseJurisdictions.length > 0 && (
              <div style={cardStyle}>
                <h3 className="font-semibold mb-3 text-sm" style={{ color: "#0D0F1E" }}>License jurisdictions</h3>
                <div className="space-y-1.5">
                  {licenseJurisdictions.map((pc: any) => (
                    <div key={pc.countries?.code} className="flex items-center gap-2 text-sm">
                      <span className="font-medium" style={{ color: "#0D0F1E" }}>{pc.countries?.code}</span>
                      <span style={{ color: "#9CA3AF" }}>{pc.countries?.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <ProviderIntroButton
              providerName={p.name}
              segmentName={seg?.display_name}
              accentColor={color}
            />
            <p className="text-xs text-center -mt-2" style={{ color: "#9CA3AF" }}>
              Get a warm intro and onboarding help from our team
            </p>
            {p.website_url && (
              <a
                href={p.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3.5 rounded-xl font-medium text-sm transition-all hover:bg-black/[0.05]"
                style={{ border: "1px solid rgba(15,23,42,0.12)", color: "#374151", background: "#FFFFFF" }}
              >
                Visit website →
              </a>
            )}
            <Link
              href="/search"
              className="block w-full text-center py-3 text-sm transition-colors hover:text-gray-900"
              style={{ color: "#9CA3AF" }}
            >
              ← Back to catalog
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
