import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PartnerForm from "@/components/PartnerForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "List your solution — Qosvanta for Payment Providers",
  description:
    "Get in front of merchants actively looking for payment infrastructure. Free listing, verified profiles, and featured placement for sponsored partners.",
};

export default async function PartnersPage() {
  const supabase = await createClient();

  const [{ count: processorCount }, { count: countryCount }, { count: methodCount }, { count: segmentCount }] =
    await Promise.all([
      supabase.from("processors").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("countries").select("*", { count: "exact", head: true }),
      supabase.from("payment_methods").select("*", { count: "exact", head: true }),
      supabase.from("segments").select("*", { count: "exact", head: true }),
    ]);

  const stats = [
    { value: `${processorCount ?? 0}+`, label: "Active providers listed" },
    { value: `${countryCount ?? 0}+`, label: "Countries covered" },
    { value: `${methodCount ?? 0}+`, label: "Payment methods" },
    { value: `${segmentCount ?? 0}`, label: "Risk segments" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1" style={{ background: "#F7F9FC" }}>
        {/* Hero */}
        <div style={{ background: "linear-gradient(160deg, #08111F 0%, #0D1728 100%)" }}>
          <div className="max-w-[1100px] mx-auto px-6 lg:px-8 py-16 lg:py-24">
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em] mb-4"
              style={{ color: "#C9A84C" }}
            >
              For Payment Providers
            </p>
            <h1
              className="text-3xl sm:text-5xl font-bold mb-5 leading-[1.1]"
              style={{ color: "#F1F5F9", letterSpacing: "-0.02em" }}
            >
              Get in front of merchants <br className="hidden sm:block" />
              <span style={{ color: "#C9A84C" }}>actively shopping</span> for payments.
            </h1>
            <p className="text-base sm:text-lg leading-relaxed max-w-[640px]" style={{ color: "#94A3B8" }}>
              Qosvanta is where high-intent merchants — e-commerce, crypto businesses, iGaming, forex and
              alternative verticals — discover and compare payment providers. List your solution, get
              qualified leads, scale with featured placement.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="#apply"
                className="px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #C9A84C, #E2C97E)", color: "#07081C" }}
              >
                Apply for listing →
              </a>
              <a
                href="#pricing"
                className="px-6 py-3 rounded-full text-sm font-medium transition-colors hover:bg-white/5"
                style={{ color: "#F1F5F9", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                See plans
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-[1100px] mx-auto px-6 lg:px-8 -mt-10">
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 rounded-2xl p-6 lg:p-8"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
            }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl lg:text-3xl font-bold" style={{ color: "#0D0F1E" }}>
                  {s.value}
                </div>
                <div className="text-xs lg:text-sm mt-1" style={{ color: "#6B7280" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value props */}
        <section className="max-w-[1100px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#3B82F6" }}>
              Why Qosvanta
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#0D0F1E", letterSpacing: "-0.02em" }}>
              We send you merchants who are ready to integrate.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "🎯",
                title: "Pre-qualified leads",
                desc: "Merchants reach you through our AI consultant Damir, who has already collected business type, volumes, geography and risk level.",
              },
              {
                icon: "🌍",
                title: "Global high-intent audience",
                desc: "Buyers actively comparing providers across fiat, crypto and local rails — not casual browsers.",
              },
              {
                icon: "🛡️",
                title: "Compliance-first matching",
                desc: "We segment by KYC level, vertical and risk so you only see merchants that fit your appetite.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="rounded-2xl p-6"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(15,23,42,0.08)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-semibold mb-2" style={{ color: "#0D0F1E" }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing tiers */}
        <section id="pricing" className="py-16 lg:py-20" style={{ background: "#FFFFFF", borderTop: "1px solid rgba(15,23,42,0.06)", borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
          <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#C9A84C" }}>
                Listing Plans
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#0D0F1E", letterSpacing: "-0.02em" }}>
                Choose how you want to grow.
              </h2>
              <p className="text-sm mt-3" style={{ color: "#6B7280" }}>
                Pricing is finalizing — early-stage partners lock in founder rates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Free */}
              <div
                className="rounded-2xl p-6 flex flex-col"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(15,23,42,0.10)",
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#6B7280" }}>
                  Starter
                </p>
                <h3 className="text-xl font-bold mb-1" style={{ color: "#0D0F1E" }}>Free Listing</h3>
                <div className="flex items-baseline gap-1 mt-3 mb-5">
                  <span className="text-3xl font-bold" style={{ color: "#0D0F1E" }}>$0</span>
                  <span className="text-sm" style={{ color: "#9CA3AF" }}>/ forever</span>
                </div>
                <p className="text-sm mb-5" style={{ color: "#6B7280" }}>
                  Get discoverable in our public catalog. Reach merchants browsing by segment, country and method.
                </p>
                <ul className="space-y-2.5 text-sm mb-6 flex-1" style={{ color: "#374151" }}>
                  <li className="flex gap-2"><span style={{ color: "#059669" }}>✓</span> Public profile in /search</li>
                  <li className="flex gap-2"><span style={{ color: "#059669" }}>✓</span> Up to 2 segments</li>
                  <li className="flex gap-2"><span style={{ color: "#059669" }}>✓</span> Basic fee & KYC info</li>
                  <li className="flex gap-2"><span style={{ color: "#059669" }}>✓</span> Inbound merchant requests via Damir</li>
                  <li className="flex gap-2"><span style={{ color: "#9CA3AF" }}>—</span> Standard search ranking</li>
                </ul>
                <a
                  href="#apply"
                  className="block text-center py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-slate-50"
                  style={{ border: "1px solid rgba(15,23,42,0.12)", color: "#0D0F1E" }}
                >
                  Apply for free →
                </a>
              </div>

              {/* Verified — popular */}
              <div
                className="rounded-2xl p-6 flex flex-col relative"
                style={{
                  background: "#FFFFFF",
                  border: "2px solid #3B82F6",
                  boxShadow: "0 12px 40px rgba(59,130,246,0.15)",
                }}
              >
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-white"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}
                >
                  Most Popular
                </span>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#3B82F6" }}>
                  Growth
                </p>
                <h3 className="text-xl font-bold mb-1" style={{ color: "#0D0F1E" }}>Verified Partner</h3>
                <div className="flex items-baseline gap-1 mt-3 mb-1">
                  <span className="text-2xl font-bold" style={{ color: "#0D0F1E" }}>Coming soon</span>
                </div>
                <p className="text-xs mb-5" style={{ color: "#9CA3AF" }}>Founder pricing — talk to us</p>
                <p className="text-sm mb-5" style={{ color: "#6B7280" }}>
                  Build trust with merchants. Verified badge, priority ranking, deeper profile and direct chat handoffs.
                </p>
                <ul className="space-y-2.5 text-sm mb-6 flex-1" style={{ color: "#374151" }}>
                  <li className="flex gap-2"><span style={{ color: "#059669" }}>✓</span> Everything in Starter</li>
                  <li className="flex gap-2"><span style={{ color: "#059669" }}>✓</span> <strong>✓ Verified</strong> badge across the site</li>
                  <li className="flex gap-2"><span style={{ color: "#059669" }}>✓</span> Priority placement above non-verified</li>
                  <li className="flex gap-2"><span style={{ color: "#059669" }}>✓</span> Unlimited segments & verticals</li>
                  <li className="flex gap-2"><span style={{ color: "#059669" }}>✓</span> Extended profile (volume tiers, settlement, reserves)</li>
                  <li className="flex gap-2"><span style={{ color: "#059669" }}>✓</span> Warm intros from Damir AI</li>
                  <li className="flex gap-2"><span style={{ color: "#059669" }}>✓</span> Monthly lead report</li>
                </ul>
                <a
                  href="#apply"
                  className="block text-center py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}
                >
                  Get verified →
                </a>
              </div>

              {/* Featured */}
              <div
                className="rounded-2xl p-6 flex flex-col"
                style={{
                  background: "linear-gradient(160deg, #08111F 0%, #1a1d35 100%)",
                  border: "1px solid rgba(201,168,76,0.35)",
                  boxShadow: "0 12px 40px rgba(201,168,76,0.12)",
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C9A84C" }}>
                  Premium
                </p>
                <h3 className="text-xl font-bold mb-1" style={{ color: "#F1F5F9" }}>★ Featured Partner</h3>
                <div className="flex items-baseline gap-1 mt-3 mb-1">
                  <span className="text-2xl font-bold" style={{ color: "#E2C97E" }}>Coming soon</span>
                </div>
                <p className="text-xs mb-5" style={{ color: "#94A3B8" }}>Limited spots per segment</p>
                <p className="text-sm mb-5" style={{ color: "#94A3B8" }}>
                  Top of every relevant search. Featured badge, hero placements, sponsored slots and dedicated account manager.
                </p>
                <ul className="space-y-2.5 text-sm mb-6 flex-1" style={{ color: "#CBD5E1" }}>
                  <li className="flex gap-2"><span style={{ color: "#C9A84C" }}>★</span> Everything in Verified</li>
                  <li className="flex gap-2"><span style={{ color: "#C9A84C" }}>★</span> <strong>★ Featured</strong> placement — always top of segment</li>
                  <li className="flex gap-2"><span style={{ color: "#C9A84C" }}>★</span> Homepage & category banner slots</li>
                  <li className="flex gap-2"><span style={{ color: "#C9A84C" }}>★</span> Sponsored popup notifications</li>
                  <li className="flex gap-2"><span style={{ color: "#C9A84C" }}>★</span> Damir recommends you first in matching</li>
                  <li className="flex gap-2"><span style={{ color: "#C9A84C" }}>★</span> Dedicated account manager</li>
                  <li className="flex gap-2"><span style={{ color: "#C9A84C" }}>★</span> Co-marketing & case-study features</li>
                </ul>
                <a
                  href="#apply"
                  className="block text-center py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #E2C97E)", color: "#07081C" }}
                >
                  Apply for featured →
                </a>
              </div>
            </div>

            <p className="text-center text-xs mt-8" style={{ color: "#9CA3AF" }}>
              Custom add-ons available: dedicated banners, sponsored newsletter, performance-based revshare. Ask us.
            </p>
          </div>
        </section>

        {/* Comparison table */}
        <section className="max-w-[1100px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#3B82F6" }}>
              Compare Plans
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#0D0F1E", letterSpacing: "-0.02em" }}>
              What you get at each level.
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}>
            <table className="w-full text-sm" style={{ minWidth: 680 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(15,23,42,0.08)" }}>
                  <th className="text-left px-5 py-4 font-semibold" style={{ color: "#0D0F1E" }}>Feature</th>
                  <th className="text-center px-4 py-4 font-semibold" style={{ color: "#6B7280" }}>Starter</th>
                  <th className="text-center px-4 py-4 font-semibold" style={{ color: "#3B82F6" }}>Verified</th>
                  <th className="text-center px-4 py-4 font-semibold" style={{ color: "#C9A84C" }}>★ Featured</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Public profile in catalog", "✓", "✓", "✓"],
                  ["Inbound merchant requests", "✓", "✓", "✓"],
                  ["Verified badge (✓)", "—", "✓", "✓"],
                  ["Featured badge (★)", "—", "—", "✓"],
                  ["Priority search ranking", "—", "Above non-verified", "Always #1"],
                  ["Damir AI recommendation priority", "—", "Mentioned", "Recommended first"],
                  ["Homepage banner slot", "—", "—", "✓"],
                  ["Category sponsored slots", "—", "—", "✓"],
                  ["Popup / notification promo", "—", "—", "✓"],
                  ["Extended profile (tiers, reserves, currencies)", "Basic", "Full", "Full"],
                  ["Verticals / segments", "Up to 2", "Unlimited", "Unlimited"],
                  ["Monthly lead report", "—", "✓", "✓"],
                  ["Dedicated account manager", "—", "—", "✓"],
                  ["Co-marketing & case studies", "—", "—", "✓"],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(15,23,42,0.05)" }}>
                    <td className="px-5 py-3.5" style={{ color: "#374151" }}>{row[0]}</td>
                    <td className="text-center px-4 py-3.5" style={{ color: row[1] === "—" ? "#CBD5E1" : "#0D0F1E" }}>{row[1]}</td>
                    <td className="text-center px-4 py-3.5" style={{ color: row[2] === "—" ? "#CBD5E1" : "#0D0F1E" }}>{row[2]}</td>
                    <td className="text-center px-4 py-3.5 font-medium" style={{ color: row[3] === "—" ? "#CBD5E1" : "#0D0F1E", background: "rgba(201,168,76,0.04)" }}>{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Case studies */}
        <section className="py-16 lg:py-20" style={{ background: "#08111F" }}>
          <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#C9A84C" }}>
                Illustrative Outcomes
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#F1F5F9", letterSpacing: "-0.02em" }}>
                What partners can expect on Qosvanta.
              </h2>
              <p className="text-sm mt-3 max-w-[640px] mx-auto" style={{ color: "#94A3B8" }}>
                These illustrate typical lead patterns by segment. Verified partner case studies with named brands are
                published as we onboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  segment: "High-Risk Fiat",
                  segColor: "#B8860B",
                  badge: "★ Featured",
                  title: "iGaming-friendly PSP, LATAM",
                  metric: "12–20",
                  metricLabel: "qualified inquiries / month",
                  bullets: [
                    "Targeting Brazil, Mexico, Colombia",
                    "Casino, sports betting, forex merchants",
                    "Average merchant monthly volume $150k+",
                  ],
                },
                {
                  segment: "High-Risk Crypto",
                  segColor: "#7C6BD4",
                  badge: "✓ Verified",
                  title: "Crypto on/off-ramp for exchanges",
                  metric: "6–10",
                  metricLabel: "qualified inquiries / month",
                  bullets: [
                    "Web3 wallets and CEX integrators",
                    "USDT / USDC settlement",
                    "Lower onboarding friction = higher conversion",
                  ],
                },
                {
                  segment: "Business Standard",
                  segColor: "#5B8FEF",
                  badge: "✓ Verified",
                  title: "Local APM aggregator, SE Asia",
                  metric: "8–14",
                  metricLabel: "qualified inquiries / month",
                  bullets: [
                    "PIX, QRIS, GCash, FPX",
                    "E-commerce, SaaS, subscriptions",
                    "Localized payouts in 12 currencies",
                  ],
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl p-6 flex flex-col"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-[11px] px-2 py-1 rounded-md font-semibold uppercase tracking-wider"
                      style={{ background: `${c.segColor}22`, color: c.segColor }}
                    >
                      {c.segment}
                    </span>
                    <span
                      className="text-[11px] px-2 py-1 rounded-md font-semibold"
                      style={{
                        background: c.badge.startsWith("★") ? "rgba(201,168,76,0.15)" : "rgba(59,130,246,0.15)",
                        color: c.badge.startsWith("★") ? "#E2C97E" : "#93C5FD",
                      }}
                    >
                      {c.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-4" style={{ color: "#F1F5F9" }}>{c.title}</h3>
                  <div className="mb-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="text-3xl font-bold" style={{ color: "#C9A84C" }}>{c.metric}</div>
                    <div className="text-xs mt-1" style={{ color: "#94A3B8" }}>{c.metricLabel}</div>
                  </div>
                  <ul className="space-y-2 text-sm flex-1" style={{ color: "#CBD5E1" }}>
                    {c.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span style={{ color: "#C9A84C" }}>→</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="text-center text-xs mt-10" style={{ color: "#64748B" }}>
              Numbers are projected based on early traffic patterns. Actual results depend on segment, pricing competitiveness and approval rates.
            </p>
          </div>
        </section>

        {/* Form */}
        <section id="apply" className="py-16 lg:py-20">
          <div className="max-w-[760px] mx-auto px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#3B82F6" }}>
                Apply
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "#0D0F1E", letterSpacing: "-0.02em" }}>
                Tell us about your solution.
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                We&apos;ll get back within 1–2 business days with listing terms and onboarding details.
              </p>
            </div>

            <PartnerForm />

            <p className="mt-6 text-xs text-center" style={{ color: "#64748B" }}>
              By submitting this form, you agree to our{" "}
              <a href="/terms" style={{ color: "#3B82F6" }}>
                Terms of Use
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
