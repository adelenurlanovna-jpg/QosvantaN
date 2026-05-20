import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site-url";

type SegmentSlug = "business" | "high_risk_fiat" | "high_risk_crypto" | "alternative_dark";

type Landing = {
  segment: SegmentSlug;
  title: string;
  description: string;
  h1: string;
  intro: string;
  highlights: string[];
  faq: { q: string; a: string }[];
};

const LANDINGS: Record<string, Landing> = {
  "high-risk-payment-providers": {
    segment: "high_risk_fiat",
    title: "High-Risk Payment Providers — iGaming, Forex, Regulated 2026",
    description:
      "Compare high-risk payment processors for iGaming, forex, adult and regulated industries. Vetted acquirers with transparent fees, KYB requirements and rolling reserves.",
    h1: "High-Risk Payment Providers",
    intro:
      "Curated directory of payment processors that support high-risk verticals — iGaming, forex, adult, gambling, nutraceuticals and regulated industries. Compare KYB requirements, settlement times, rolling reserves and chargeback handling across 40+ specialized acquirers.",
    highlights: [
      "Acquirers that accept iGaming, forex, adult, gambling and regulated MCCs",
      "Transparent KYB requirements and onboarding timelines",
      "Compare rolling reserves, settlement cycles and chargeback policies",
      "Global coverage with strong EU, LATAM, Asia and Africa reach",
    ],
    faq: [
      {
        q: "What is a high-risk payment provider?",
        a: "A high-risk payment provider (or high-risk merchant acquirer) is a payment processor that accepts merchants in industries with elevated chargeback rates, regulatory complexity or fraud exposure — including iGaming, forex, adult, CBD, nutraceuticals and gambling.",
      },
      {
        q: "How do fees differ for high-risk merchants?",
        a: "High-risk processors typically charge higher per-transaction fees (3-7% vs 1-3% for standard merchants), require rolling reserves of 5-15% and may apply longer settlement cycles (T+7 to T+30). Pricing depends on volume, vertical and chargeback history.",
      },
      {
        q: "What KYB documents are required?",
        a: "Most high-risk acquirers require company registration, beneficial ownership disclosure, gambling/regulatory licenses (where applicable), financial statements, processing history, website compliance review and AML/KYC policies.",
      },
      {
        q: "How long does onboarding take?",
        a: "High-risk merchant onboarding typically takes 1-4 weeks depending on vertical complexity, license verification and risk review. Pre-vetted providers in our directory often offer expedited tracks for established merchants.",
      },
    ],
  },
  "crypto-payment-gateways": {
    segment: "high_risk_crypto",
    title: "Crypto Payment Gateways — USDT, BTC, ETH & Stablecoin Processors",
    description:
      "Compare crypto payment gateways for businesses. USDT, BTC, ETH and stablecoin acceptance with custody, off-ramp and auto-conversion options across global markets.",
    h1: "Crypto Payment Gateways",
    intro:
      "Compare crypto payment gateways that let businesses accept USDT, BTC, ETH and stablecoins from customers worldwide. Find providers with custodial or non-custodial flows, auto-conversion to fiat, on-chain settlement and global off-ramp coverage.",
    highlights: [
      "Accept USDT (TRC-20, ERC-20), BTC, ETH, USDC and 50+ tokens",
      "Custodial, non-custodial and self-custody flows",
      "Auto-conversion to USD/EUR/local fiat at settlement",
      "Global off-ramp partners in 100+ countries",
    ],
    faq: [
      {
        q: "What is a crypto payment gateway?",
        a: "A crypto payment gateway is infrastructure that lets businesses accept cryptocurrency payments from customers. It handles wallet generation, transaction monitoring, optional fiat conversion and settlement to the merchant — similar to Stripe but for blockchain assets.",
      },
      {
        q: "Which cryptocurrencies should I accept?",
        a: "Most crypto-native businesses start with USDT (Tether) on TRON or Ethereum for low fees and price stability, then add BTC, ETH and USDC. The optimal mix depends on your customer base — emerging markets favor USDT, while DeFi/Web3 audiences prefer ETH and USDC.",
      },
      {
        q: "What fees do crypto gateways charge?",
        a: "Crypto payment gateway fees typically range from 0.5% to 1.5% per transaction — significantly lower than card processing. Additional costs include network gas fees (paid by customer or merchant) and off-ramp/conversion spreads (0.1-0.5%).",
      },
      {
        q: "Are crypto payments legal for my business?",
        a: "Regulation varies by jurisdiction. In the EU (MiCA), US (state-level), UK, Singapore and most major markets, crypto payment acceptance is legal with proper AML/KYC controls. Always verify local requirements — many providers handle compliance for you.",
      },
    ],
  },
  "business-payment-providers": {
    segment: "business",
    title: "Business Payment Providers — Standard E-commerce, SaaS & Platforms",
    description:
      "Compare standard business payment providers for e-commerce, SaaS and online platforms. Card processing, ACH, SEPA, wallets and bank transfers with transparent pricing.",
    h1: "Business Payment Providers",
    intro:
      "Browse vetted payment processors for standard business verticals: e-commerce stores, SaaS subscriptions, online marketplaces and digital platforms. Compare card acceptance, alternative payment methods, wallet support and recurring billing capabilities.",
    highlights: [
      "Major card networks: Visa, Mastercard, Amex, JCB, Discover",
      "Subscription billing, recurring payments and dunning",
      "Marketplace and split-payment infrastructure",
      "Apple Pay, Google Pay, PayPal and digital wallets",
    ],
    faq: [
      {
        q: "What is a business payment provider?",
        a: "A business payment provider (or merchant acquirer / PSP) is the company that lets your business accept card and digital payments from customers. They handle authorization, settlement, compliance and chargeback management.",
      },
      {
        q: "What are typical fees for standard businesses?",
        a: "Standard e-commerce merchants pay 1.4-2.9% + fixed fee per transaction. SaaS businesses with recurring billing often get better rates (1.0-1.8%). Volume discounts kick in above $50K/month processing.",
      },
      {
        q: "How fast is settlement?",
        a: "Standard settlement cycles are T+1 to T+2 (one to two business days). Some processors offer instant payouts for an additional fee. Marketplace and split-payment providers may use longer cycles for compliance.",
      },
      {
        q: "Which payment methods should I support beyond cards?",
        a: "Add Apple Pay and Google Pay (covers 80% of mobile checkout demand), PayPal, and 2-3 local methods relevant to your top markets (e.g. PIX for Brazil, UPI for India, iDEAL for Netherlands).",
      },
    ],
  },
  "alternative-payment-methods": {
    segment: "alternative_dark",
    title: "Alternative Payment Methods — Non-Standard Settlement Rails",
    description:
      "Specialized payment rails for non-standard verticals: alternative settlement, cash-based, voucher and emerging market methods with deep regional coverage.",
    h1: "Alternative Payment Methods",
    intro:
      "Discover payment providers for non-standard verticals and use cases — cash-based settlement, voucher systems, emerging-market rails and specialized alternative methods. Ideal when traditional card acquirers aren't a fit.",
    highlights: [
      "Voucher and cash-based payment networks",
      "Emerging-market settlement infrastructure",
      "Niche regional rails and aggregators",
      "Hybrid fiat/crypto settlement flows",
    ],
    faq: [
      {
        q: "When should I use alternative payment methods?",
        a: "Alternative payment methods make sense when your vertical isn't well-served by standard card processors, you target markets with low card penetration, or you need to reach unbanked customers via cash-based or voucher rails.",
      },
      {
        q: "Are alternative payment rails regulated?",
        a: "Most alternative payment providers operate under specific regional licenses (e-money, PSD2 agent, money transmitter, etc). Always verify the provider's regulatory standing for your target markets.",
      },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(LANDINGS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const landing = LANDINGS[slug];
  if (!landing) return {};
  return {
    title: landing.title,
    description: landing.description,
    alternates: { canonical: `/solutions/${slug}` },
    openGraph: { title: landing.title, description: landing.description, type: "website", url: `${SITE_URL}/solutions/${slug}` },
  };
}

export default async function SolutionLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const landing = LANDINGS[slug];
  if (!landing) notFound();

  const supabase = await createClient();
  const { data: segRow } = await supabase
    .from("segments")
    .select("id")
    .eq("slug", landing.segment)
    .single();

  const { data: providersRaw } = segRow
    ? await supabase
        .from("processors")
        .select("name, slug, volume_tiers ( fee_percentage )")
        .eq("segment_id", (segRow as any).id)
        .eq("status", "active")
        .order("is_verified", { ascending: false })
        .order("name", { ascending: true })
        .limit(8)
    : { data: [] };

  const providers = (providersRaw ?? []).map((p: any) => ({
    name: p.name as string,
    slug: p.slug as string,
    fee_pct: p.volume_tiers?.[0]?.fee_percentage ?? null,
  }));

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: landing.h1,
    description: landing.description,
    itemListElement: (providers ?? []).map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_URL}/processors/${p.slug}`,
      name: p.name,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/solutions` },
      { "@type": "ListItem", position: 3, name: landing.h1, item: `${SITE_URL}/solutions/${slug}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: landing.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Header />

      <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <nav className="text-xs mb-6" style={{ color: "#64748B" }}>
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/search" className="hover:text-slate-900">Solutions</Link>
            <span className="mx-2">/</span>
            <span style={{ color: "#0F172A" }}>{landing.h1}</span>
          </nav>

          <h1 className="text-[2.25rem] sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] mb-6 max-w-3xl" style={{ color: "#0F172A", letterSpacing: "-0.025em" }}>
            {landing.h1}
          </h1>
          <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: "#334155" }}>
            {landing.intro}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              href={`/search?segment=${landing.segment}`}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}
            >
              Browse {providers?.length ? `${providers.length}+` : ""} providers →
            </Link>
            <Link
              href="/#get-matched"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:bg-slate-100"
              style={{ border: "1px solid rgba(15,23,42,0.22)", color: "#0F172A" }}
            >
              Get matched
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
            {landing.highlights.map((h) => (
              <div key={h} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-sm" style={{ color: "#0F172A" }}>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {providers && providers.length > 0 && (
        <section className="py-16" style={{ background: "#FFFFFF" }}>
          <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 tracking-tight" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>
              Featured providers
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {providers.map((p) => (
                <Link
                  key={p.slug}
                  href={`/processors/${p.slug}`}
                  className="group p-5 rounded-xl transition-all hover:border-slate-300 hover:shadow-md"
                  style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.10)" }}
                >
                  <div className="text-base font-semibold mb-1" style={{ color: "#0F172A" }}>{p.name}</div>
                  {p.fee_pct != null && (
                    <div className="text-xs" style={{ color: "#64748B" }}>From {p.fee_pct}% per transaction</div>
                  )}
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href={`/search?segment=${landing.segment}`}
                className="inline-flex items-center gap-1 text-sm font-semibold"
                style={{ color: "#3B82F6" }}
              >
                See all providers →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-16" style={{ background: "#F8FAFC" }}>
        <div className="max-w-[800px] mx-auto px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 tracking-tight" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>
            Frequently asked
          </h2>
          <div className="space-y-3">
            {landing.faq.map((f) => (
              <details key={f.q} className="group p-5 rounded-xl" style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}>
                <summary className="text-base font-semibold cursor-pointer list-none flex items-center justify-between" style={{ color: "#0F172A" }}>
                  {f.q}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform group-open:rotate-180" style={{ color: "#94A3B8" }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "#334155" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
