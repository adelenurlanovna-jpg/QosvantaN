import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoutingLines from "@/components/RoutingLines";
import GetMatchedForm from "@/components/GetMatchedForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Payment Solutions Marketplace — Crypto, High-Risk & iGaming Providers",
  description:
    "Discover and compare 200+ payment providers across fiat, crypto and local rails. Curated directory for high-risk merchants, iGaming operators, crypto businesses and global e-commerce.",
  alternates: { canonical: "/" },
};

type Stats = { providers: number; countries: number; methods: number };

function formatStat(n: number): string {
  if (n >= 100) return `${Math.floor(n / 10) * 10}+`;
  if (n >= 10) return `${n}+`;
  return `${n}`;
}

/* ─── Shared UI ──────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: "#3B82F6" }}>
      {children}
    </p>
  );
}

function SectionTitle({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2
      className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.1]"
      style={{ color: light ? "#FFFFFF" : "#0F172A", letterSpacing: "-0.02em" }}
    >
      {children}
    </h2>
  );
}

/* ─── Hero ──────────────────────────────────────────── */

function HeroSection({ stats }: { stats: Stats }) {
  return (
    <section className="relative overflow-hidden hero-bg">
      <RoutingLines />

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-8 py-12 sm:py-16 lg:py-28">
        <div className="grid lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-center">

          {/* Left */}
          <div>
            <div className="badge badge-blue mb-6">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#3B82F6" }} />
              Global payment provider directory
            </div>

            <h1
              className="text-[2rem] sm:text-4xl lg:text-[3.5rem] font-bold leading-[1.05] mb-6"
              style={{ color: "#0F172A", letterSpacing: "-0.025em" }}
            >
              Payment Solutions Marketplace{" "}
              <span className="text-brand">for every business.</span>
            </h1>

            <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: "#1E293B" }}>
              Compare 200+ payment providers across fiat, crypto and local methods. Curated catalog covering high-risk processors, iGaming acquirers, crypto gateways and standard e-commerce rails — in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)", boxShadow: "0 4px 20px rgba(59,130,246,0.3)" }}
              >
                Explore providers →
              </Link>
              <Link
                href="#get-matched"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:bg-slate-100"
                style={{ border: "1px solid rgba(15,23,42,0.22)", color: "#0F172A" }}
              >
                Get matched
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {["Fiat", "Crypto", "Local methods", "High-risk", "Global coverage"].map((tag) => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(59,130,246,0.06)", color: "#64748B", border: "1px solid rgba(59,130,246,0.12)" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Marketplace mockup */}
          <div className="relative hidden lg:block">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#F7F9FC",
                border: "1px solid rgba(15,23,42,0.09)",
                boxShadow: "0 24px 80px rgba(59,130,246,0.12), 0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              {/* Top bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background: "#FFFFFF", borderColor: "rgba(15,23,42,0.07)" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#EF4444" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#F59E0B" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#10B981" }} />
                </div>
                <div className="flex-1 mx-3 px-3 py-1 rounded-md text-xs" style={{ background: "#F1F5F9", color: "#64748B" }}>
                  qosvanta.com/search
                </div>
              </div>

              <div className="p-5">
                {/* Filters row */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {[
                    { label: "Country: Brazil", color: "#3B82F6" },
                    { label: "Type: All", color: "#6366F1" },
                    { label: "Fee: <5%", color: "#7C3AED" },
                    { label: "Crypto: Yes", color: "#06B6D4" },
                  ].map((f) => (
                    <span
                      key={f.label}
                      className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{ background: `${f.color}12`, color: f.color, border: `1px solid ${f.color}30` }}
                    >
                      {f.label} ▾
                    </span>
                  ))}
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { v: formatStat(stats.providers), l: "Providers" },
                    { v: formatStat(stats.countries), l: "Countries" },
                    { v: formatStat(stats.methods), l: "Methods" },
                    { v: "Free", l: "To browse" },
                  ].map((s) => (
                    <div key={s.l} className="p-3 rounded-xl text-center" style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.07)" }}>
                      <p className="text-sm font-bold text-brand">{s.v}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>{s.l}</p>
                    </div>
                  ))}
                </div>

                {/* Provider cards */}
                <div className="space-y-2.5">
                  {[
                    { name: "AtlasPay LATAM", type: "Local methods · Bank transfer", geo: "Brazil, Mexico, Colombia", fee: "3.2–5.5%", settle: "T+1 / T+3 · BRL, USD, USDT", tags: ["Fiat", "Local Method"] },
                    { name: "CryptoRails Global", type: "Crypto · Stablecoin settlement", geo: "180 countries", fee: "0.5%", settle: "Instant · USDT, USDC, BTC", tags: ["Crypto", "No KYB"] },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="p-4 rounded-xl"
                      style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}>
                            {p.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>{p.name}</p>
                            <p className="text-xs" style={{ color: "#94A3B8" }}>{p.type}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold" style={{ color: "#0F172A" }}>{p.fee}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1.5">
                          {p.tags.map((t) => <span key={t} className="badge badge-blue text-[10px] py-0.5">{t}</span>)}
                        </div>
                        <span className="text-[11px] px-2.5 py-1 rounded-lg" style={{ background: "#F7F9FC", color: "#64748B", border: "1px solid rgba(15,23,42,0.1)" }}>
                          View details →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div
              className="absolute -right-4 top-12 px-3 py-2 rounded-xl text-xs font-medium"
              style={{ background: "#FFFFFF", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: "1px solid rgba(15,23,42,0.08)", color: "#059669" }}
            >
              ✓ {formatStat(stats.providers)} verified providers
            </div>
            <div
              className="absolute -left-4 bottom-16 px-3 py-2 rounded-xl text-xs font-medium"
              style={{ background: "#FFFFFF", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: "1px solid rgba(15,23,42,0.08)", color: "#7C3AED" }}
            >
              Crypto · Fiat · Local methods
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Trust bar ──────────────────────────────────────── */

function TrustBar({ stats }: { stats: Stats }) {
  return (
    <div className="border-y" style={{ borderColor: "rgba(15,23,42,0.07)", background: "#FFFFFF" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-5">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-8 sm:gap-12">
            {[
              { value: formatStat(stats.providers), label: "Payment providers" },
              { value: formatStat(stats.countries), label: "Countries covered" },
              { value: formatStat(stats.methods), label: "Payment methods" },
              { value: "Free", label: "To explore" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold text-brand">{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {["Fiat · Crypto · Local", "Compliance-reviewed", "Global coverage"].map((tag) => (
              <span key={tag} className="text-xs px-3 py-1.5 rounded-full" style={{ background: "#F7F9FC", color: "#64748B", border: "1px solid rgba(15,23,42,0.08)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Marketplace Section ────────────────────────────── */

function MarketplaceSection() {
  const filters = [
    "Country / Region", "Payment type", "Currency", "Settlement", "Industry", "Monthly volume", "Fee range", "Risk level",
  ];
  const providers = [
    { name: "Stripe", type: "Card acquiring", geo: "195 countries", fee: "2.9% + $0.30", settle: "T+2 · USD, EUR, GBP", verified: true, tags: ["API Ready", "Fast Launch"] },
    { name: "NOWPayments", type: "Crypto rails", geo: "180+ countries", fee: "0.5%", settle: "Instant · USDT, BTC, ETH", verified: true, tags: ["Crypto Settlement"] },
    { name: "Adyen", type: "Card acquiring · Local", geo: "EU, APAC, NA", fee: "0.3% + €0.10", settle: "T+2 · Multi-currency", verified: true, tags: ["High Volume"] },
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24 section-lighter dot-bg">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <SectionLabel>Marketplace</SectionLabel>
          <SectionTitle>Explore payment providers by market, method and business model.</SectionTitle>
          <p className="text-base mt-4 max-w-2xl mx-auto" style={{ color: "#64748B" }}>
            Search across fiat, crypto, cards, wallets, bank transfers, local payment methods and payout solutions from one interface.
          </p>
        </div>

        {/* Big mockup */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.09)", boxShadow: "0 16px 60px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)" }}
        >
          {/* Browser bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ background: "#F7F9FC", borderColor: "rgba(15,23,42,0.07)" }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#EF4444" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#F59E0B" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#10B981" }} />
            </div>
            <div className="mx-3 px-3 py-1 rounded text-xs" style={{ background: "#FFFFFF", color: "#64748B", border: "1px solid rgba(15,23,42,0.08)" }}>
              qosvanta.com/search
            </div>
          </div>

          <div className="grid lg:grid-cols-[260px_1fr]">
            {/* Filter sidebar */}
            <div className="p-5 border-r hidden lg:block" style={{ borderColor: "rgba(15,23,42,0.07)", background: "#FAFBFF" }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: "#94A3B8" }}>Filters</p>
              <div className="space-y-2">
                {filters.map((f, i) => (
                  <div
                    key={f}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs cursor-pointer"
                    style={{
                      background: i === 0 ? "rgba(59,130,246,0.07)" : "transparent",
                      color: i === 0 ? "#2563EB" : "#475569",
                      border: i === 0 ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                    }}
                  >
                    <span>{f}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Provider list */}
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium" style={{ color: "#0F172A" }}>214 providers found</p>
                <select className="text-xs px-3 py-1.5 rounded-lg" style={{ border: "1px solid rgba(15,23,42,0.12)", color: "#64748B" }}>
                  <option>Sort: Relevance</option>
                </select>
              </div>
              {providers.map((p) => (
                <div
                  key={p.name}
                  className="p-4 rounded-xl hover-lift"
                  style={{ background: "#F7F9FC", border: "1px solid rgba(15,23,42,0.07)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}>
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>{p.name}</p>
                          {p.verified && <span className="badge badge-emerald text-[10px]">✓ Verified</span>}
                        </div>
                        <p className="text-xs" style={{ color: "#94A3B8" }}>{p.type} · {p.geo}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold" style={{ color: "#0F172A" }}>{p.fee}</p>
                      <p className="text-[11px]" style={{ color: "#94A3B8" }}>{p.settle}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-1.5">{p.tags.map((t) => <span key={t} className="badge badge-blue text-[10px] py-0.5">{t}</span>)}</div>
                    <div className="flex gap-2">
                      {["View details", "Compare"].map((btn) => (
                        <button key={btn} className="text-[11px] px-2.5 py-1 rounded-lg" style={{ background: "#FFFFFF", color: "#64748B", border: "1px solid rgba(15,23,42,0.1)" }}>
                          {btn}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/search" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}>
            Open full marketplace →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Fiat + Crypto Section ──────────────────────────── */

function FiatCryptoSection() {
  const cards = [
    {
      title: "Fiat payments",
      color: "#3B82F6",
      icon: "💳",
      items: ["Cards · Visa / Mastercard / Amex", "Bank transfers · SEPA, SWIFT, ACH", "Local bank redirects", "E-wallets · PayPal, Klarna", "Cash vouchers", "Open banking methods"],
    },
    {
      title: "Crypto rails",
      color: "#06B6D4",
      icon: "⛓",
      items: ["USDT · TRC-20 / ERC-20", "USDC · Stablecoin", "Bitcoin · BTC", "Ethereum · ETH", "On-chain flows", "Off-chain settlement"],
    },
    {
      title: "Local & alternative",
      color: "#7C3AED",
      icon: "🌍",
      items: ["PIX · Brazil", "UPI · India", "M-Pesa · Africa", "iDEAL · Netherlands", "Local vouchers & cash", "Regional wallets"],
    },
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <SectionLabel>Payment rails</SectionLabel>
          <SectionTitle>Fiat, crypto and local providers — all in one directory.</SectionTitle>
          <p className="text-base mt-4 max-w-2xl mx-auto" style={{ color: "#64748B" }}>
            Find providers for card acquiring, local payments, bank transfers, wallets, stablecoin settlement and crypto checkout — and go directly to their websites.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((c) => (
            <div
              key={c.title}
              className="p-6 rounded-2xl hover-lift"
              style={{ background: `${c.color}06`, border: `1px solid ${c.color}20` }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-5" style={{ background: `${c.color}12` }}>
                {c.icon}
              </div>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#0F172A" }}>{c.title}</h3>
              <ul className="space-y-2.5">
                {c.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#475569" }}>
                    <span className="mt-0.5 shrink-0" style={{ color: c.color }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Get Matched Section ────────────────────────────── */

function GetMatchedSection() {
  return (
    <section id="get-matched" className="py-14 sm:py-20 lg:py-24 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #08111F 0%, #0D1728 100%)" }}>
      <RoutingLines dark />
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left text */}
          <div>
            <SectionLabel>Get matched</SectionLabel>
            <SectionTitle light>Tell us what you need — we'll shortlist the right providers.</SectionTitle>
            <p className="text-base mt-6 mb-8 leading-relaxed" style={{ color: "#94A3B8" }}>
              Skip weeks of research. Describe your business, geography and volume — we manually review and send you a curated list of 3–5 providers that fit.
            </p>
            <div className="space-y-3">
              {[
                "Save weeks of provider research",
                "Get providers matched to your exact geo and industry",
                "Receive honest compliance notes and risk flags",
                "Free for merchants — providers pay for qualified leads",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm" style={{ color: "#CBD5E1" }}>
                  <span style={{ color: "#10B981" }}>✓</span> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right — form card */}
          <GetMatchedForm />
        </div>
      </div>
    </section>
  );
}

/* ─── Solutions by Business Type ─────────────────────── */

function SolutionsSection() {
  const solutions = [
    {
      title: "For merchants",
      icon: "🏪",
      desc: "For companies that need to accept payments across markets.",
      features: ["Provider search", "Country & industry filters", "Fee comparison", "Expert matching"],
      cta: "Find providers",
      href: "/search",
    },
    {
      title: "For platforms",
      icon: "⚡",
      desc: "For platforms and marketplaces researching payment infrastructure.",
      features: ["Multi-market research", "Provider marketplace", "Custom provider matching", "Expert introduction"],
      cta: "Explore platform solutions",
      href: "#open-chat",
    },
    {
      title: "For crypto businesses",
      icon: "₿",
      desc: "For Web3 companies, wallets, exchanges and crypto-friendly fintech.",
      features: ["Crypto checkout providers", "Stablecoin settlement", "Fiat on/off-ramp", "Hybrid flows"],
      cta: "Explore crypto rails",
      href: "#open-chat",
    },
    {
      title: "For complex industries",
      icon: "🔐",
      desc: "Access payment providers through a controlled, compliance-reviewed process.",
      features: ["Private matching", "Risk scoring", "Compliance review", "Custom strategy"],
      cta: "Request private matching",
      href: "#open-chat",
    },
    {
      title: "For payment providers",
      icon: "📋",
      desc: "For payment companies that want to list their solution and receive qualified leads.",
      features: ["Provider profile", "GEO targeting", "Receive requests", "Analytics"],
      cta: "List your solution",
      href: "/partners",
    },
    {
      title: "For enterprise",
      icon: "🏢",
      desc: "For large companies that need a dedicated payment strategy consultant.",
      features: ["Custom provider strategy", "Private provider access", "Dedicated payment expert", "SLA"],
      cta: "Contact sales",
      href: "#open-chat",
    },
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24 section-lighter dot-bg">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <SectionLabel>Solutions</SectionLabel>
          <SectionTitle>Payment solutions for every business model.</SectionTitle>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map((s) => (
            <div key={s.title} className="bg-white rounded-2xl p-6 hover-lift" style={{ border: "1px solid rgba(15,23,42,0.08)", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-5" style={{ background: "rgba(59,130,246,0.06)" }}>
                {s.icon}
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: "#0F172A" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#64748B" }}>{s.desc}</p>
              <ul className="space-y-1.5 mb-6">
                {s.features.map((f) => (
                  <li key={f} className="text-xs flex items-center gap-2" style={{ color: "#475569" }}>
                    <span style={{ color: "#3B82F6" }}>→</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={s.href} className="text-sm font-semibold flex items-center gap-1 transition-all hover:gap-2" style={{ color: "#3B82F6" }}>
                {s.cta} <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Compliance Section ─────────────────────────────── */

function ComplianceSection() {
  const levels = [
    { label: "Public", color: "#94A3B8", desc: "Browse categories and provider descriptions" },
    { label: "Registered", color: "#3B82F6", desc: "Extended marketplace access" },
    { label: "Verified Company", color: "#6366F1", desc: "Full provider details + contact info" },
    { label: "Approved Partner", color: "#7C3AED", desc: "Private provider network" },
    { label: "Enterprise", color: "#06B6D4", desc: "Dedicated expert + custom matching" },
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #08111F 0%, #0D1728 100%)" }}>
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel>Compliance-first access</SectionLabel>
            <SectionTitle light>Compliance-reviewed access to global payment providers.</SectionTitle>
            <p className="text-base mt-6 mb-8 leading-relaxed" style={{ color: "#94A3B8" }}>
              Qosvanta helps businesses discover payment providers through structured onboarding, verification and risk review — so you only see providers that are actually relevant for your business.
            </p>
            <div className="space-y-2">
              {["Company verification · KYB / KYC review", "UBO documents · Website review", "Jurisdiction checks · Industry review", "Provider eligibility · Risk scoring", "Compliance notes by market"].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm" style={{ color: "#CBD5E1" }}>
                  <span style={{ color: "#10B981" }}>✓</span> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide mb-5" style={{ color: "#475569" }}>Access levels</p>
            {levels.map((level, i) => (
              <div
                key={level.label}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{
                  background: i === 2 ? `${level.color}12` : "rgba(255,255,255,0.04)",
                  border: i === 2 ? `1px solid ${level.color}30` : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: `${level.color}20`, color: level.color }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>{level.label}</p>
                  <p className="text-xs" style={{ color: "#64748B" }}>{level.desc}</p>
                </div>
                {i === 2 && <span className="ml-auto badge badge-emerald text-[10px]">Current</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Provider Listing Section ───────────────────────── */

function ProviderListingSection() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel>For payment providers</SectionLabel>
            <SectionTitle>List your payment solution in Qosvanta.</SectionTitle>
            <p className="text-base mt-6 mb-8 leading-relaxed" style={{ color: "#64748B" }}>
              Reach qualified merchants, platforms and global businesses looking for payment solutions in your markets.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                { icon: "🎯", label: "Receive qualified leads", desc: "Merchants filtered by your GEOs, industries and volume range" },
                { icon: "📊", label: "Control your visibility", desc: "Manage which segments and access tiers see your profile" },
                { icon: "✓", label: "Get verified", desc: "Earn a Verified badge through our compliance review" },
                { icon: "📥", label: "Manage requests", desc: "Receive, review and respond to merchant connection requests" },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: "rgba(59,130,246,0.07)" }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-0.5" style={{ color: "#0F172A" }}>{item.label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <Link href="/partners" className="px-7 py-3.5 rounded-full text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}>
                Become a provider →
              </Link>
              <Link href="#open-chat" className="px-7 py-3.5 rounded-full text-sm font-medium" style={{ border: "1px solid rgba(15,23,42,0.15)", color: "#334155" }}>
                Talk to us
              </Link>
            </div>
          </div>

          {/* Provider dashboard mockup */}
          <div className="p-6 rounded-2xl" style={{ background: "#F7F9FC", border: "1px solid rgba(15,23,42,0.08)" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold" style={{ color: "#0F172A" }}>Provider Dashboard</p>
              <span className="badge badge-emerald text-[11px]">✓ Verified</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[{ l: "Profile views", v: "1,240" }, { l: "New leads", v: "28" }, { l: "Active markets", v: "14" }, { l: "Avg response", v: "4h" }].map((s) => (
                <div key={s.l} className="p-3 rounded-xl" style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.07)" }}>
                  <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "#94A3B8" }}>{s.l}</p>
                  <p className="text-base font-bold text-brand">{s.v}</p>
                </div>
              ))}
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-wide mb-3" style={{ color: "#94A3B8" }}>Recent requests</p>
            <div className="space-y-2">
              {[
                { co: "TechPay Ltd", geo: "Brazil · Cards", status: "New", color: "#3B82F6" },
                { co: "CasinoGroup EU", geo: "Malta · Crypto", status: "In review", color: "#F59E0B" },
                { co: "NutraShop Inc", geo: "US · High-risk", status: "Pending docs", color: "#7C3AED" },
              ].map((req) => (
                <div key={req.co} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.06)" }}>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "#0F172A" }}>{req.co}</p>
                    <p className="text-[10px]" style={{ color: "#94A3B8" }}>{req.geo}</p>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: `${req.color}12`, color: req.color }}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ───────────────────────────────────── */

function HowItWorksSection() {
  const steps = [
    { n: "01", title: "Create your company profile", desc: "Register and describe your business type, industry and target markets." },
    { n: "02", title: "Explore the marketplace", desc: "Browse providers filtered by country, fee, volume, currency and risk profile." },
    { n: "03", title: "Compare providers", desc: "Evaluate fees, settlement terms, currencies and compliance requirements side by side." },
    { n: "04", title: "Get matched to providers", desc: "Submit your requirements and receive a curated shortlist of relevant providers from our team." },
    { n: "05", title: "Complete verification", desc: "Submit KYB/KYC documents to unlock access to private provider profiles." },
    { n: "06", title: "Connect directly", desc: "Reach out to providers directly or request a warm introduction from the Qosvanta team." },
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24 section-lighter">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <SectionLabel>How it works</SectionLabel>
          <SectionTitle>How Qosvanta works.</SectionTitle>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="relative p-6 rounded-2xl bg-white hover-lift" style={{ border: "1px solid rgba(15,23,42,0.08)" }}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-5"
                style={{ background: "rgba(59,130,246,0.08)", color: "#3B82F6", border: "1px solid rgba(59,130,246,0.18)" }}
              >
                {s.n}
              </div>
              <h3 className="text-sm font-bold mb-2" style={{ color: "#0F172A" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing Section ────────────────────────────────── */

function PricingSection() {
  const plans = [
    {
      name: "Starter",
      desc: "For companies getting started with provider research.",
      features: ["Basic marketplace access", "Limited provider details", "Basic comparison", "Standard support"],
      cta: "Start browsing",
      href: "/search",
      highlight: false,
    },
    {
      name: "Growth",
      desc: "For growing companies ready to connect with providers.",
      features: ["Extended provider access", "Full provider details", "Expert matching request", "Compliance review", "Priority support"],
      cta: "Request access",
      href: "#open-chat",
      highlight: true,
    },
    {
      name: "Platform",
      desc: "For platforms and marketplaces managing multiple merchants.",
      features: ["Multi-merchant research", "Provider marketplace", "Custom provider matching", "Market reports"],
      cta: "Talk to sales",
      href: "#open-chat",
      highlight: false,
    },
    {
      name: "Enterprise",
      desc: "For large companies with complex payment infrastructure needs.",
      features: ["Custom provider strategy", "Private provider network", "Dedicated payment expert", "SLA", "Compliance support"],
      cta: "Contact sales",
      href: "#open-chat",
      highlight: false,
    },
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <SectionLabel>Pricing</SectionLabel>
          <SectionTitle>Simple, structured access.</SectionTitle>
          <p className="text-base mt-4 max-w-xl mx-auto" style={{ color: "#64748B" }}>
            From basic marketplace exploration to enterprise-grade provider matching with a dedicated expert.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((p) => (
            <div
              key={p.name}
              className="p-6 rounded-2xl flex flex-col hover-lift"
              style={{
                background: p.highlight ? "linear-gradient(160deg, #0D1728, #1E2D4A)" : "#FFFFFF",
                border: p.highlight ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(15,23,42,0.08)",
                boxShadow: p.highlight ? "0 8px 40px rgba(59,130,246,0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <h3 className="text-base font-bold mb-2" style={{ color: p.highlight ? "#F1F5F9" : "#0F172A" }}>{p.name}</h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: p.highlight ? "#94A3B8" : "#64748B" }}>{p.desc}</p>
              <ul className="space-y-2.5 flex-1 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="text-xs flex items-start gap-2" style={{ color: p.highlight ? "#CBD5E1" : "#475569" }}>
                    <span style={{ color: p.highlight ? "#3B82F6" : "#10B981", marginTop: "1px" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className="block text-center py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                style={{
                  background: p.highlight ? "linear-gradient(135deg, #3B82F6, #7C3AED)" : "#F7F9FC",
                  color: p.highlight ? "#FFFFFF" : "#334155",
                  border: p.highlight ? "none" : "1px solid rgba(15,23,42,0.12)",
                }}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ──────────────────────────────────────── */

function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden py-28"
      style={{ background: "linear-gradient(160deg, #050A14 0%, #0D1728 60%, #08111F 100%)" }}
    >
      <RoutingLines dark />
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="badge badge-blue mb-8 mx-auto" style={{ display: "inline-flex" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#3B82F6" }} />
            Global payment provider directory
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-[1.07]"
            style={{ color: "#FFFFFF", letterSpacing: "-0.025em" }}
          >
            Your payment stack, built from a marketplace.
          </h2>
          <p className="text-lg leading-relaxed mb-10" style={{ color: "#CBD5E1" }}>
            Browse, compare and connect with payment providers across crypto rails, high-risk verticals, iGaming, local methods and bank transfers — free to explore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="px-8 py-4 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-2xl"
              style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)", boxShadow: "0 8px 32px rgba(59,130,246,0.35)" }}
            >
              Explore providers →
            </Link>
            <Link
              href="#get-matched"
              className="px-8 py-4 rounded-full text-sm font-semibold transition-all"
              style={{ color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.25)" }}
            >
              Get matched
            </Link>
            <Link
              href="/partners"
              className="px-8 py-4 rounded-full text-sm font-medium transition-all"
              style={{ color: "#94A3B8" }}
            >
              List your solution
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────── */

export default async function HomePage() {
  const supabase = await createClient();
  const [providersRes, countriesRes, methodsRes] = await Promise.all([
    supabase.from("processors").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("countries").select("*", { count: "exact", head: true }),
    supabase.from("payment_methods").select("*", { count: "exact", head: true }),
  ]);
  const stats: Stats = {
    providers: providersRes.count ?? 0,
    countries: countriesRes.count ?? 0,
    methods: methodsRes.count ?? 0,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection stats={stats} />
      <TrustBar stats={stats} />
      <MarketplaceSection />
      <FiatCryptoSection />
      <GetMatchedSection />
      <SolutionsSection />
      <ComplianceSection />
      <ProviderListingSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}
