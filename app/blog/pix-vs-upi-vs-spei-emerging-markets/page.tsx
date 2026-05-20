import type { Metadata } from "next";
import Link from "next/link";
import BlogArticle from "@/components/BlogArticle";
import { SITE_URL } from "@/lib/site-url";
import { ARTICLES } from "../articles";

const meta = ARTICLES.find((a) => a.slug === "pix-vs-upi-vs-spei-emerging-markets")!;

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
          { label: "Payment providers in Brazil", href: "/payment-providers/brazil" },
          { label: "Payment providers in India", href: "/payment-providers/india" },
          { label: "Payment providers in Mexico", href: "/payment-providers/mexico" },
        ]}
      >
        <p>
          Over the past six years, three central-bank-operated instant payment systems have rewritten how billions of people transact in their daily lives. Brazil's PIX, India's UPI and Mexico's SPEI each transformed payment economics in their countries — slashing fees, reaching the underbanked and pulling significant share away from card networks. For merchants entering or expanding in these markets, ignoring these rails is no longer an option. Cards alone will leave 30–70% of conversions on the table.
        </p>
        <p>
          This guide compares the three systems on adoption, technology, fees, regulation and the practical mechanics of accepting each as a merchant.
        </p>

        <div className="callout">
          <strong>TL;DR</strong>
          UPI processes the highest volume by a wide margin (10B+ transactions per month), PIX is the most merchant-friendly with broad e-commerce integration (~40% of online checkouts in Brazil), and SPEI is the most enterprise-style — used heavily for B2B and high-ticket purchases in Mexico. All three are dramatically cheaper than card processing (0.2–1.0% vs 2.5–4% for cards) but require local infrastructure or local payment partners to integrate.
        </div>

        <h2>At a glance</h2>

        <table>
          <thead>
            <tr>
              <th>System</th>
              <th>Country</th>
              <th>Launched</th>
              <th>Monthly volume (2026 est.)</th>
              <th>Typical merchant fee</th>
              <th>Settlement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PIX</td>
              <td>Brazil</td>
              <td>Nov 2020</td>
              <td>~5B transactions</td>
              <td>0.2–0.5%</td>
              <td>Instant, 24/7</td>
            </tr>
            <tr>
              <td>UPI</td>
              <td>India</td>
              <td>Apr 2016</td>
              <td>10–13B transactions</td>
              <td>0% (small merchants) — 0.4%</td>
              <td>Instant, 24/7</td>
            </tr>
            <tr>
              <td>SPEI</td>
              <td>Mexico</td>
              <td>2004 (consumer access expanded 2010s)</td>
              <td>~150M transactions</td>
              <td>0.5–1.5%</td>
              <td>Instant during banking hours, batched off-hours</td>
            </tr>
          </tbody>
        </table>

        <h2>PIX: Brazil's payments revolution</h2>

        <p>
          PIX is the youngest of the three systems but the most aggressive in its impact. Launched in November 2020 by the Central Bank of Brazil, it reached 100 million active users within 12 months. By 2026 it processes more transactions per month than every card network combined in Brazil, and accounts for roughly 40% of e-commerce checkout volume.
        </p>

        <h3>How PIX works</h3>
        <p>
          PIX runs on a central-bank-operated rail (the SPI — Sistema de Pagamentos Instantâneos) that all Brazilian banks and payment institutions must connect to. Participants are required by regulation to offer PIX to their customers at no charge for individuals.
        </p>
        <p>
          Customers pay via four addressing methods:
        </p>
        <ul>
          <li><strong>Phone number, email, CPF/CNPJ</strong> — registered "PIX keys" tied to a bank account</li>
          <li><strong>Random key</strong> — a UUID issued by the bank, used for higher privacy</li>
          <li><strong>QR code (static)</strong> — printed or displayed by the merchant; same code for all transactions</li>
          <li><strong>QR code (dynamic)</strong> — generated per transaction, includes amount and order ID</li>
        </ul>
        <p>
          For e-commerce, dynamic QR (or its URL-based equivalent, "PIX Copia e Cola") is dominant — the merchant generates a unique code with the order amount embedded, and the customer scans or pastes it into their banking app to confirm.
        </p>

        <h3>PIX for merchants</h3>
        <p>
          Brazilian merchants pay 0.2–0.5% per PIX transaction — dramatically lower than the 3–7% effective rate for card processing (which includes the prevalent <strong>parcelado</strong> installments). Settlement is instant; funds appear in the merchant's account in seconds.
        </p>
        <p>
          The flip side: PIX is irrevocable. There is no chargeback mechanism. Refunds must be initiated by the merchant as a new PIX transaction back to the customer. This makes PIX an excellent fraud profile for merchants but transfers risk from acquirers to buyers — explaining why PIX adoption is strongest in lower-trust verticals and increasingly used as a primary checkout method.
        </p>

        <h3>Accepting PIX</h3>
        <p>
          To accept PIX as a merchant, you need either a Brazilian bank account or a payment partner that holds one. Foreign sellers typically work with PSPs that offer PIX as part of a cross-border package — settling in USD/EUR after FX conversion. See <Link href="/payment-providers/brazil">payment providers in Brazil</Link> for a curated list of processors that support PIX.
        </p>

        <h2>UPI: India's payments behemoth</h2>

        <p>
          The Unified Payments Interface (UPI) is the largest instant payment system in the world by transaction count. Launched in April 2016 by NPCI (the National Payments Corporation of India), it processed roughly 13 billion transactions in a single month in late 2025. Adoption among Indian smartphone users is essentially total.
        </p>

        <h3>How UPI works</h3>
        <p>
          UPI is not run directly by the Reserve Bank of India; it's operated by NPCI, a not-for-profit consortium owned by Indian banks. UPI sits on top of bank accounts — every transaction debits and credits real bank accounts in real time. Users access UPI through their bank's app, or through third-party apps (PhonePe, Google Pay, Paytm, BHIM) that integrate with their bank via PSP partnerships.
        </p>
        <p>
          UPI transactions use a Virtual Payment Address (VPA) — a human-readable identifier like <code>yourname@bankname</code> — or scan a QR code that encodes the merchant's VPA and amount.
        </p>

        <h3>UPI for merchants</h3>
        <p>
          Here UPI diverges sharply from PIX. The Indian government mandates that small-merchant UPI transactions (<strong>P2M</strong>, or Person-to-Merchant) are free — zero merchant discount rate (MDR). For larger merchants and certain transaction types, MDR is permitted, typically 0.3–0.5%.
        </p>
        <p>
          This zero-fee policy is politically driven — it's a deliberate subsidy by the Indian government to drive digital payment adoption. It's also why card payments lost most of the low-ticket retail market in India over the past five years. Why pay 1.5–2% to accept cards when UPI is free?
        </p>

        <h3>Accepting UPI</h3>
        <p>
          Domestic Indian merchants integrate UPI through a payment aggregator with PA/PSP licensing from the RBI. The aggregator handles bank connectivity, settlement and reconciliation; the merchant gets a single API. Major aggregators include Razorpay, PhonePe, Paytm, Cashfree.
        </p>
        <p>
          Cross-border merchants face more friction. UPI settlement is INR-only — foreign sellers either need a local entity, a Merchant of Record arrangement, or use international PSPs that handle UPI acceptance with USD/EUR settlement (typically at a 1–2% FX spread on top of the UPI fee). Browse <Link href="/payment-providers/india">payment providers in India</Link> for processors that support both domestic and cross-border UPI.
        </p>

        <h2>SPEI: Mexico's enterprise rail</h2>

        <p>
          SPEI (Sistema de Pagos Electrónicos Interbancarios) is operated by Banco de México. Unlike PIX and UPI, SPEI predates the smartphone-payments boom — it launched in 2004 as an interbank transfer system. Over the past decade, consumer access expanded to make it usable for retail and online payments.
        </p>

        <h3>How SPEI works</h3>
        <p>
          SPEI is a real-time gross settlement (RTGS) system. Each transaction settles individually and immediately between participating banks. Transactions are addressed using:
        </p>
        <ul>
          <li><strong>CLABE</strong> — the 18-digit Mexican standard account number</li>
          <li><strong>Phone number</strong> — linked to a CLABE via the bank</li>
          <li><strong>Email or "Celular"</strong> — increasingly common</li>
        </ul>
        <p>
          A subset of banks operate SPEI 24/7, but the system as a whole is most reliable during banking hours. Off-hours transactions may queue and settle the next business day. For e-commerce, this means SPEI is generally treated as "instant during the day, near-instant overnight."
        </p>

        <h3>SPEI for merchants</h3>
        <p>
          SPEI is heavily used for higher-ticket B2C and B2B in Mexico. It is the de facto standard for invoicing, payroll, rent, B2B settlements and any transaction where the parties already know each other and can exchange CLABEs. For e-commerce, SPEI competes with cards (which are dominant for everyday purchases) and OXXO cash (which serves the underbanked).
        </p>
        <p>
          Merchant fees for SPEI typically range from 0.5–1.5% depending on volume and PSP. Settlement is instant for the customer-to-merchant leg; the merchant's PSP then settles to the merchant's bank account on the agreed cycle (often T+1 to T+2 for batched processing, instant on-demand for higher-tier accounts).
        </p>

        <h3>Accepting SPEI</h3>
        <p>
          Domestic merchants integrate SPEI through Mexican PSPs that hold the necessary banking partnerships. Major players include Conekta, Openpay, MercadoPago, Stripe Mexico. Cross-border sellers typically use international PSPs with Mexican local entities or partner banks. See <Link href="/payment-providers/mexico">payment providers in Mexico</Link> for options.
        </p>

        <h2>Comparison: what these systems share and where they differ</h2>

        <h3>What they share</h3>
        <p>All three are real-time, central-bank-operated (or in UPI's case, central-bank-mandated and aligned), and dramatically cheaper than the card networks they compete with. All three are addressable by phone number or QR code in addition to bank account number. All three are mandatory offerings for participating banks — meaning consumer adoption is nearly universal within their countries.</p>
        <p>
          All three also share an important property: they're <strong>account-to-account</strong> systems. Money moves directly between bank accounts, not through card-network rails or wallet intermediaries. This eliminates interchange fees but also eliminates the chargeback infrastructure of card networks.
        </p>

        <h3>Where they differ</h3>
        <ul>
          <li><strong>Fee model.</strong> UPI is essentially free by government mandate. PIX has a low merchant fee. SPEI has a moderate merchant fee that varies by PSP.</li>
          <li><strong>Refund/dispute mechanics.</strong> PIX has no chargebacks (refunds are merchant-initiated). UPI has limited dispute resolution via NPCI. SPEI has no native disputes but the consumer can pursue resolution via their bank.</li>
          <li><strong>Cross-border integration.</strong> SPEI is the easiest for cross-border PSPs because the rail itself is straightforward. PIX is moderately integrated by international processors. UPI cross-border is hardest due to FX and Indian regulatory constraints.</li>
          <li><strong>E-commerce dominance.</strong> PIX has the strongest e-commerce checkout adoption (~40% share in Brazil online). UPI is universal in India but small-ticket retail is its sweet spot. SPEI is strongest in mid- and high-ticket Mexican e-commerce.</li>
          <li><strong>Mobile vs desktop.</strong> All three originated mobile-first. PIX and SPEI have decent desktop checkout flows (QR code or copy-paste address). UPI is essentially mobile-only — the customer needs their phone with their banking app to complete a payment.</li>
        </ul>

        <h2>Practical implications for merchants</h2>

        <h3>If you're entering Brazil</h3>
        <p>
          PIX support is non-negotiable. Plan for it on day one. Many merchants entering Brazil find that PIX overtakes cards within 6–12 months — partly because consumers prefer it, partly because the fee differential lets the merchant offer better pricing. Combine PIX with card-with-installments (parcelado) for higher-ticket items. Boleto can be added for the 10–15% of Brazilians without easy card access.
        </p>

        <h3>If you're entering India</h3>
        <p>
          UPI must be in your checkout from launch. Cards are now secondary in Indian e-commerce; the price difference (free UPI vs 2% cards) drives consumer choice. Net banking remains useful for higher-ticket and as fallback. Plan settlement and FX carefully — INR is not freely convertible, and cross-border flows are scrutinized.
        </p>

        <h3>If you're entering Mexico</h3>
        <p>
          Cards remain primary for everyday e-commerce in Mexico. SPEI fills the higher-ticket niche and B2B. OXXO covers the ~50% of Mexicans who are underbanked. A complete Mexican payment stack is: Visa/Mastercard (with parcialidades or MSI — Meses Sin Intereses installments), SPEI, and OXXO. Without all three, you're leaving meaningful conversion on the table.
        </p>

        <h2>Where this is going</h2>
        <p>
          By 2030, similar instant-payment systems will be live in most major economies. The EU has TIPS and the SEPA Instant Payments mandate (which will require all EU banks to offer instant transfers by late 2025). The US has FedNow (launched 2023). The UK has Faster Payments. Australia has NPP/Osko. Thailand has PromptPay. Singapore has PayNow. Saudi Arabia has Sarie. The Philippines has InstaPay.
        </p>
        <p>
          These rails will keep pulling volume away from card networks for the same reasons PIX, UPI and SPEI did — they're faster, cheaper, and consumer-friendly. Merchants who built their payment stack around card-only acceptance will increasingly lose conversion to competitors who support local rails.
        </p>
        <p>
          The practical advice: <strong>treat local instant payment rails as a primary checkout option, not as an afterthought.</strong> The processors and PSPs that integrate these rails well will be the winners of the next five years.
        </p>

        <hr />

        <p>
          To find payment providers that support PIX, UPI, SPEI and other local rails, browse our <Link href="/search?method=local">local payment methods directory</Link> or jump straight to country-specific listings: <Link href="/payment-providers/brazil">Brazil</Link>, <Link href="/payment-providers/india">India</Link>, <Link href="/payment-providers/mexico">Mexico</Link> and 30+ other markets.
        </p>
      </BlogArticle>
    </>
  );
}
