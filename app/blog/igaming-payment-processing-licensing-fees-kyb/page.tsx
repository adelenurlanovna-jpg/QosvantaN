import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/BlogArticle";
import { SITE_URL } from "@/lib/site-url";
import { ARTICLES } from "../articles";

const meta = ARTICLES.find((a) => a.slug === "igaming-payment-processing-licensing-fees-kyb")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/blog/${meta.slug}` },
  openGraph: { title: meta.title, description: meta.description, type: "article", publishedTime: meta.publishedAt, url: `${SITE_URL}/blog/${meta.slug}` },
};

export default function Article() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.publishedAt,
    dateModified: meta.updatedAt ?? meta.publishedAt,
    author: { "@type": "Organization", name: "Qosvanta" },
    publisher: { "@type": "Organization", name: "Qosvanta", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
    mainEntityOfPage: `${SITE_URL}/blog/${meta.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <BlogArticle
        meta={meta}
        related={[
          { label: "High-risk payment providers directory", href: "/solutions/high-risk-payment-providers" },
          { label: "Complete guide to high-risk payment providers", href: "/blog/high-risk-payment-providers-guide" },
          { label: "Payment providers in Malta (MGA-friendly)", href: "/payment-providers/malta" },
          { label: "Payment providers in Curaçao", href: "/payment-providers/curacao" },
        ]}
      >
        <p>
          Payment processing is the single hardest operational problem for online gambling operators. Card networks classify iGaming as the highest-risk MCC. Most banks refuse to underwrite it. The acquirers that do approve gambling charge premium fees, hold significant reserves and apply enhanced compliance scrutiny — all of which scales with the regulatory standing of your license. A UKGC-licensed operator pays different rates and faces different requirements than a Curaçao licensee, even if their products are identical.
        </p>
        <p>
          This guide unpacks how iGaming payment processing actually works in 2026 — license types and how they affect your options, typical fee structures and reserves, the KYB documentation you'll be asked for, and how to structure a payment stack that survives chargeback monitoring, regulator scrutiny and seasonal volume spikes.
        </p>

        <div className="callout">
          <strong>TL;DR</strong>
          iGaming payment processing requires specialized acquirers that understand the vertical. License jurisdiction drives most of the variation: UKGC and MGA licensees access mainstream EU acquirers at 2.5–4% rates with low reserves; Curaçao and offshore licensees pay 4.5–7% with reserves of 10–15% held for 6 months. Expect 4–8 weeks of KYB onboarding with extensive documentation — licensing, beneficial ownership, AML policy, responsible gambling controls. Build a multi-acquirer stack from day one — single-acquirer iGaming operations don't survive volume spikes or chargeback events.
        </div>

        <h2>License jurisdictions and what they mean for payments</h2>
        <p>
          Your iGaming license is the single biggest variable in your payment processing options. Banks and acquirers maintain internal scoring of license jurisdictions — well-regulated, well-supervised licenses unlock better acquirers, while permissive offshore licenses limit you to a smaller pool of specialized high-risk providers.
        </p>

        <h3>UK Gambling Commission (UKGC)</h3>
        <p>
          The UKGC is the strictest globally. UKGC-licensed operators must meet rigorous responsible gambling, AML, anti-fraud and player protection standards, including enhanced due diligence on high-spending customers, mandatory affordability checks above certain thresholds and strict marketing rules. The compliance burden is significant — but UKGC licensure unlocks the broadest range of UK and EU acquirers, with rates closer to standard high-risk (3.5–5%) and lower reserves (5–10%).
        </p>

        <h3>Malta Gaming Authority (MGA)</h3>
        <p>
          MGA is the most widely respected international iGaming license. Several thousand operators hold MGA licenses, and the license is recognized in many EU jurisdictions for B2B activities. MGA holds operators to high compliance standards (AML, RG, technical certifications). For payments, MGA license unlocks broad EU acquirer access at rates similar to UKGC. Many specialized iGaming acquirers explicitly state MGA-friendliness in their marketing.
        </p>

        <h3>Curaçao eGaming</h3>
        <p>
          Curaçao licenses are faster to obtain and significantly cheaper than UKGC/MGA — popular among newer operators and offshore brands. The trade-off: payment processing is harder. Many mainstream EU acquirers won't touch Curaçao licensees regardless of the operator's actual compliance practices. Specialized high-risk acquirers serve this segment at higher rates (5–7%) with larger reserves (10–15% for 180 days).
        </p>
        <p>
          A reform of the Curaçao licensing framework was rolled out in 2024–2025, replacing the master/sub-license model with direct licensing under the new Curaçao Gaming Authority (CGA). Operators with the newer CGA license generally have an easier time with payments than those grandfathered under the old master-license system.
        </p>

        <h3>Other key licenses</h3>
        <ul>
          <li><strong>ANJ (France)</strong> — required for operating in the French market. Specific products only (sports betting, poker, horse racing). Closed market with strict requirements.</li>
          <li><strong>DGOJ (Spain)</strong> — required for Spain. Comparable strictness to UKGC.</li>
          <li><strong>AAMS/ADM (Italy)</strong> — required for Italy. Closed market.</li>
          <li><strong>AGCO (Ontario, Canada)</strong> — required for the Ontario regulated market.</li>
          <li><strong>State licenses (US)</strong> — required state by state for online gambling in the US (NJ, PA, MI, NV and others). Each state has its own framework.</li>
          <li><strong>Isle of Man, Gibraltar, Alderney</strong> — respected B2C and B2B licenses, popular among European operators.</li>
          <li><strong>Kahnawake (Canada)</strong> — older offshore-style license, declining in popularity.</li>
          <li><strong>Anjouan, Vanuatu, Costa Rica</strong> — minimal-oversight offshore licenses, lowest acquirer acceptance.</li>
        </ul>

        <h2>Pricing: what to expect</h2>

        <table>
          <thead>
            <tr>
              <th>License tier</th>
              <th>Examples</th>
              <th>Typical rate</th>
              <th>Reserve</th>
              <th>Settlement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tier 1 (premium)</td>
              <td>UKGC, MGA, AGCO, US state licenses</td>
              <td>3.0–4.5%</td>
              <td>5–10%, released 90–180 days</td>
              <td>T+3 to T+7</td>
            </tr>
            <tr>
              <td>Tier 2 (recognized offshore)</td>
              <td>Isle of Man, Gibraltar, Alderney, CGA</td>
              <td>4.0–5.5%</td>
              <td>8–12%, released 180 days</td>
              <td>T+7 to T+14</td>
            </tr>
            <tr>
              <td>Tier 3 (general offshore)</td>
              <td>Curaçao (old master), Kahnawake</td>
              <td>5.0–7.0%</td>
              <td>10–15%, released 180 days</td>
              <td>T+14 to T+30</td>
            </tr>
            <tr>
              <td>Tier 4 (minimal-oversight)</td>
              <td>Anjouan, Vanuatu</td>
              <td>6.5–8.5%</td>
              <td>15%+, released 180–365 days</td>
              <td>T+21 to T+45</td>
            </tr>
          </tbody>
        </table>

        <p>
          These are approximate ranges before negotiation. Actual rates depend on processing history, vertical (sportsbook vs casino vs poker have different risk profiles), expected volume, geographic mix and the operator's chargeback track record. Card type also matters — credit cards typically pay more than debit; international cards more than local; commercial cards more than consumer.
        </p>

        <h3>Why the reserves are so high</h3>
        <p>
          iGaming exposure to chargebacks is structurally elevated. Common dispute scenarios:
        </p>
        <ul>
          <li>Player loses, claims the transaction was unauthorized ("friendly fraud")</li>
          <li>Family member uses the cardholder's account without permission</li>
          <li>Player's spouse files dispute claiming "compulsive gambling"</li>
          <li>Genuine card fraud (stolen card used to fund gambling account)</li>
          <li>Account-related disputes (locked account, slow withdrawals)</li>
        </ul>
        <p>
          Chargeback ratios in iGaming routinely run 1.5–3% versus 0.3–0.6% for e-commerce. Visa's CB monitoring threshold is 0.9%. When operators exceed it, the acquirer faces fines and program scrutiny — hence the rolling reserves, which protect the acquirer from being left holding losses if the operator can't pay.
        </p>

        <h2>KYB: the iGaming version</h2>
        <p>
          Onboarding for iGaming acquirers is more involved than for any other vertical. Expect 4–8 weeks from application to live processing, sometimes longer. The documentation package typically includes:
        </p>

        <h3>Company and licensing</h3>
        <ul>
          <li>Certificate of incorporation, articles of association, current corporate structure chart (often back to ultimate beneficial owners)</li>
          <li>Operating gambling license(s) — certified copies, validity period, scope of authorized products</li>
          <li>Verification with the issuing regulator (the acquirer will independently confirm with UKGC, MGA, CGA, etc)</li>
          <li>Any prior licenses surrendered, declined or revoked — disclose proactively</li>
          <li>For multi-license operators: clear documentation of which entity operates in which market</li>
        </ul>

        <h3>Beneficial ownership</h3>
        <ul>
          <li>UBO disclosure to 10% threshold (sometimes 5%)</li>
          <li>Government ID and proof of address for all UBOs</li>
          <li>Source of wealth declarations</li>
          <li>PEP (politically exposed person) screening</li>
          <li>Adverse media screening on UBOs and directors</li>
        </ul>

        <h3>Operational controls</h3>
        <ul>
          <li>AML policy (often required at the level expected by your license jurisdiction)</li>
          <li>Responsible gambling policy — self-exclusion, deposit limits, affordability checks</li>
          <li>KYC/CDD procedures — what documents you collect from players, at what thresholds</li>
          <li>Transaction monitoring rules</li>
          <li>Fraud prevention controls</li>
          <li>Chargeback management procedures — how you handle disputes, prevention tooling, representment process</li>
          <li>Player fund segregation arrangements (where required by license)</li>
        </ul>

        <h3>Financial</h3>
        <ul>
          <li>Audited financial statements (3 years for established operators) or business plan and projections (for newer)</li>
          <li>Processing history from previous acquirers — 6–12 months of statements showing volume, refunds, chargeback ratio</li>
          <li>Settlement bank account verification (the bank must be willing to receive iGaming-related settlements — itself a non-trivial requirement)</li>
        </ul>

        <h3>Technical</h3>
        <ul>
          <li>Website / platform technical security overview</li>
          <li>Player platform certifications (where applicable: ISO 27001, eCOGRA, iTech Labs)</li>
          <li>3DS2 implementation details</li>
          <li>PCI DSS attestation</li>
        </ul>

        <div className="callout">
          <strong>Practical reality</strong>
          Most iGaming operators underestimate the document preparation effort. Building the full data room — organized, indexed, with clear cross-references — typically takes 3–4 weeks of focused work for a serious operator. Operators that rush this stage face longer onboarding (acquirers send back gap requests, each round adds 1–2 weeks) and often worse initial pricing (acquirers price uncertainty into the rate).
        </div>

        <h2>Player payment methods: what your stack should cover</h2>
        <p>
          Card processing is necessary but not sufficient for iGaming in most markets. A complete player payment stack typically includes:
        </p>
        <ul>
          <li>
            <strong>Cards (Visa, Mastercard).</strong> Universal acceptance, but many issuers in regulated markets (UK, Australia) restrict gambling transactions. Auth rates can be 70–85% rather than 95%+ for standard e-commerce.
          </li>
          <li>
            <strong>E-wallets.</strong> Skrill, Neteller, PayPal (where allowed), MuchBetter, ecoPayz. Critical for iGaming — many players prefer wallets specifically because card issuers block gambling deposits.
          </li>
          <li>
            <strong>Bank transfers.</strong> SEPA, local instant rails (UK Faster Payments, Brazil PIX, India UPI). Often the cheapest method and high conversion for trusted brands.
          </li>
          <li>
            <strong>Local methods.</strong> Country-specific: <Link href="/payment-providers/brazil">PIX in Brazil</Link>, <Link href="/payment-providers/india">UPI in India</Link>, iDEAL in Netherlands, BLIK in Poland, Trustly in Nordics.
          </li>
          <li>
            <strong>Crypto.</strong> USDT, BTC and ETH acceptance is increasingly standard for offshore operators. Lower fees, no chargebacks, instant settlement. See our <Link href="/blog/accept-usdt-payments-guide">USDT payments guide</Link>.
          </li>
          <li>
            <strong>Prepaid and voucher.</strong> Paysafecard, gift cards. Important for player-protection segments who prefer not to use bank rails.
          </li>
        </ul>

        <h2>Architecting a resilient payment stack</h2>

        <h3>Multi-acquirer routing</h3>
        <p>
          Single-acquirer iGaming operations are fragile. Acquirers occasionally exit verticals, get acquired, hit internal volume limits or change risk appetite. A serious operator runs 2–4 acquirers concurrently, with routing rules based on:
        </p>
        <ul>
          <li>Customer geography (acquirer A is strongest in EU, B in LATAM, C in Asia)</li>
          <li>Card BIN (test which acquirer authorizes specific issuers best)</li>
          <li>Transaction size (different fee structures favor different tiers)</li>
          <li>Real-time success rates (route away from declining acquirers automatically)</li>
        </ul>
        <p>
          Payment orchestration platforms (Spreedly, Primer, Gr4vy, IXOPAY) handle this. For operators above $5–10M monthly processing, the auth rate improvement from intelligent routing (typically 2–5%) more than justifies the orchestration cost.
        </p>

        <h3>Chargeback management</h3>
        <p>
          Chargeback prevention and representment is a critical capability — often the difference between an operator surviving a bad month and being terminated by their acquirer.
        </p>
        <ul>
          <li><strong>Prevention tools.</strong> Ethoca Alerts, Verifi RDR, Order Insight — these let you refund disputes before they become chargebacks, typically resolving 30–50% of potential disputes.</li>
          <li><strong>3DS2 SCA.</strong> Strong Customer Authentication shifts liability for fraud chargebacks to the issuer. Use it on every card transaction where supported.</li>
          <li><strong>Representment.</strong> When chargebacks do occur, fight them with proper documentation. Established representment recovery rates are 20–40%. Many specialized iGaming acquirers offer representment-as-a-service.</li>
        </ul>

        <h3>Withdrawal infrastructure</h3>
        <p>
          Player withdrawals are operationally as critical as deposits — slow or failed withdrawals destroy retention faster than any other issue. Plan your stack with withdrawal in mind from day one:
        </p>
        <ul>
          <li>Mass payouts via card refunds, OCT (Original Credit Transactions), SEPA, bank transfer, e-wallets, crypto</li>
          <li>Automation to prevent manual processing bottlenecks during volume spikes</li>
          <li>Funds segregation so player balances are always covered</li>
          <li>SLA monitoring on withdrawal turnaround time</li>
        </ul>

        <h2>Regulatory considerations beyond payments</h2>
        <p>
          The acquirer assesses you partly on how you handle the regulatory landscape on the player side. Strong responsible gambling controls, robust AML/KYC for players, and clean affordability and self-exclusion frameworks all reduce your effective risk profile and improve your payment terms.
        </p>
        <ul>
          <li><strong>Affordability checks.</strong> Required by UKGC and increasingly by other major regulators. Verify players can afford their losses through documentation or open banking insights.</li>
          <li><strong>Self-exclusion.</strong> National schemes (GAMSTOP UK, ROFUS Denmark, OASIS Germany) — must be integrated and enforced.</li>
          <li><strong>Deposit limits.</strong> Player-set or operator-imposed limits per session, day, week, month.</li>
          <li><strong>Source of funds.</strong> Required for high-spending players. Builds the AML defense.</li>
          <li><strong>Marketing rules.</strong> Affiliate compliance, content standards, prohibition of targeting vulnerable groups.</li>
        </ul>

        <h2>Common operator mistakes</h2>
        <ol>
          <li>
            <strong>Treating payments as a vendor relationship rather than a strategic partnership.</strong> Acquirer churn is expensive — every change adds onboarding time, requires reintegration and disrupts player experience. Pick fewer, deeper partnerships.
          </li>
          <li>
            <strong>Underinvesting in chargeback prevention.</strong> A 0.3% reduction in chargeback ratio can save 6 figures annually in fees and protect your acquirer relationship.
          </li>
          <li>
            <strong>Ignoring withdrawal experience.</strong> Players who can't withdraw don't return. Spend on withdrawal infrastructure proportionally to deposit infrastructure.
          </li>
          <li>
            <strong>Letting AML/KYC become a friction-only feature.</strong> Best-in-class operators use AML data to power VIP programs, personalization and responsible gambling — turning compliance investment into product value.
          </li>
          <li>
            <strong>Single-acquirer dependence.</strong> A surprise termination can mean weeks of lost revenue. Diversify from day one.
          </li>
          <li>
            <strong>Optimizing for headline rate.</strong> A 4.5% acquirer with 90% auth and excellent dispute handling is significantly better than a 3.5% acquirer with 75% auth and pass-through chargebacks.
          </li>
        </ol>

        <h2>Getting started: a structured approach</h2>
        <ol>
          <li>
            <strong>Clarify your license stack and target markets.</strong> Different acquirers fit different combinations.
          </li>
          <li>
            <strong>Prepare the KYB data room.</strong> Single source of truth, version-controlled, organized.
          </li>
          <li>
            <strong>Shortlist 6–10 specialized iGaming acquirers</strong> covering your license, markets and product (sportsbook, casino, poker). Browse our <Link href="/solutions/high-risk-payment-providers">high-risk payment providers directory</Link> for vetted options.
          </li>
          <li>
            <strong>Run a structured RFP.</strong> Same questions to each — vertical experience, geographic coverage, fee structure, reserve mechanics, chargeback handling, technical capability, support model.
          </li>
          <li>
            <strong>Sign with two acquirers minimum.</strong> Test live volume on both; gather real auth-rate and dispute data before scaling.
          </li>
          <li>
            <strong>Plan the orchestration layer and chargeback prevention tooling</strong> — these are not optional at any meaningful scale.
          </li>
          <li>
            <strong>Build operating cadence.</strong> Monthly acquirer reviews, quarterly stack assessment, annual full RFP refresh.
          </li>
        </ol>

        <hr />

        <p>
          For a curated comparison of iGaming-friendly payment processors across license tiers, browse our <Link href="/solutions/high-risk-payment-providers">high-risk payment providers</Link> directory. License-specific guides: <Link href="/payment-providers/malta">Malta (MGA)</Link>, <Link href="/payment-providers/united-kingdom">UK (UKGC)</Link>, <Link href="/payment-providers/curacao">Curaçao</Link>, <Link href="/payment-providers/cyprus">Cyprus</Link>.
        </p>

        <p>
          <em>This guide is editorial reference and not legal, financial or compliance advice. iGaming licensing and payment regulation are highly jurisdiction-specific — always work with qualified counsel for your specific operation and target markets.</em>
        </p>
      </BlogArticle>
    </>
  );
}
