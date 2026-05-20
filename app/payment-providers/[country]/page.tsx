import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site-url";

type Landing = {
  code: string;
  name: string;
  flag: string;
  localMethods: { code: string; name: string; desc: string }[];
  intro: string;
  highlights: string[];
  faq: { q: string; a: string }[];
};

const C: Record<string, Landing> = {
  "united-states": {
    code: "US", name: "United States", flag: "🇺🇸",
    localMethods: [
      { code: "ach", name: "ACH", desc: "Bank transfer rails, T+1 to T+3 settlement" },
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Dominant card networks for US merchants" },
      { code: "paypal", name: "PayPal & Venmo", desc: "Widely adopted alternative checkout" },
    ],
    intro:
      "The US is the world's largest payments market and the most competitive — with strict KYC/AML rules, sophisticated fraud controls and high interchange fees. Most established processors serve US merchants; the choice usually comes down to vertical fit, pricing tiers and chargeback handling. We list dozens of providers covering e-commerce, SaaS, marketplaces, high-risk and crypto verticals.",
    highlights: [
      "Visa, Mastercard, Amex, Discover acceptance",
      "ACH and instant payouts via RTP/FedNow",
      "PCI DSS compliance and Level 1 acquiring",
      "Specialized acquirers for high-risk and crypto",
    ],
    faq: [
      { q: "What are typical payment processing fees in the US?", a: "Standard US merchants pay 2.6-2.9% + $0.30 per transaction. SaaS and recurring billing often get 1.4-1.8% with volume. High-risk verticals (iGaming, adult, CBD) pay 3.5-6% plus rolling reserves." },
      { q: "Do I need to be a US entity to accept US payments?", a: "Not always. Stripe, Adyen and several other processors onboard non-US entities for US card acceptance, though some require US tax ID (EIN) and US bank account for settlement. Some providers offer Merchant of Record (MoR) services for foreign sellers." },
      { q: "What's the difference between ACH and card payments?", a: "ACH costs 0.1-0.8% per transaction (much cheaper than cards) but takes 1-3 business days to settle. Best for high-ticket B2B and recurring billing where speed isn't critical. Cards settle in 1-2 days and support instant authorization." },
      { q: "Which US processor is best for high-risk?", a: "It depends on your vertical. Our directory includes specialized high-risk acquirers that approve iGaming, adult, nutraceuticals and CBD merchants — compare KYB requirements, reserves and fees side by side." },
    ],
  },
  "united-kingdom": {
    code: "GB", name: "United Kingdom", flag: "🇬🇧",
    localMethods: [
      { code: "faster_payments", name: "Faster Payments", desc: "Instant 24/7 GBP transfers" },
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Universal card acceptance" },
      { code: "open_banking", name: "Open Banking (PIS)", desc: "Account-to-account checkout, low fees" },
    ],
    intro:
      "The UK has one of the most mature open banking ecosystems globally, alongside strong card acceptance and the Faster Payments rail. Post-Brexit, UK processing is separate from SEPA — UK merchants need UK-licensed acquirers or PSPs with UK passporting. We list UK-friendly providers across all verticals including iGaming and crypto.",
    highlights: [
      "FCA-regulated PSPs and acquirers",
      "Open Banking PIS for low-fee A2A payments",
      "Faster Payments instant GBP settlement",
      "iGaming-friendly providers for UKGC-licensed operators",
    ],
    faq: [
      { q: "What is Open Banking and should UK merchants use it?", a: "Open Banking lets customers pay directly from their bank account using PSD2 APIs (PIS). Fees are 0.1-0.5% vs 1.5-2.5% for cards. Best for higher-ticket purchases and recurring billing where customer trust is established." },
      { q: "Are SEPA payments available in the UK?", a: "Post-Brexit, the UK is no longer in SEPA. However, many UK processors still support GBP and EUR settlement separately. For pan-European reach you'll typically need both UK and EU PSPs, or a provider with passporting in both." },
      { q: "Which UK processors accept iGaming merchants?", a: "Several UK acquirers and PSPs license iGaming operators with UKGC licenses. Browse our high-risk fiat segment to compare options — typical requirements include UKGC license verification, AML policies and chargeback monitoring." },
      { q: "What's Faster Payments and how does it differ from BACS?", a: "Faster Payments is instant 24/7 GBP transfer (≤£1M per transaction in most banks). BACS takes 3 working days. Faster Payments is the de facto standard for online instant settlement in the UK." },
    ],
  },
  "germany": {
    code: "DE", name: "Germany", flag: "🇩🇪",
    localMethods: [
      { code: "sepa", name: "SEPA Direct Debit", desc: "Trusted bank debit, dominant for subscriptions" },
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Growing share but less dominant than other EU markets" },
      { code: "giropay_sofort", name: "giropay & Sofort", desc: "Bank-redirect online checkout methods" },
    ],
    intro:
      "Germany is the largest payments market in continental Europe with unique consumer preferences — Germans heavily favor bank transfers (SEPA), invoice payment (Kauf auf Rechnung) and bank-redirect methods over cards. Successful merchants in Germany must support 4-5 local methods. We list providers with strong DACH coverage.",
    highlights: [
      "SEPA Direct Debit and SEPA Credit Transfer",
      "giropay, Sofort and Klarna bank redirects",
      "Invoice payment (Rechnungskauf) infrastructure",
      "BaFin-regulated PSPs and acquirers",
    ],
    faq: [
      { q: "Why is card share so low in Germany?", a: "Historically Germans preferred direct bank rails (SEPA, invoice) due to lower fees, no fraud liability and cultural trust in banks. Card use is growing for e-commerce but still trails SEPA-based methods for many verticals." },
      { q: "What is Kauf auf Rechnung (buy-now-pay-later by invoice)?", a: "Invoice payment is hugely popular in Germany — customer receives goods, gets an invoice, pays within 14-30 days. Klarna, Billpay (a Klarna company) and others provide the infrastructure with merchant payment guarantees." },
      { q: "Do I need a German entity to process in Germany?", a: "Not strictly — EU-licensed processors can passport into Germany under PSD2. But for invoice payment, local infrastructure (Klarna, RatePAY) typically requires merchant-of-record arrangements or German entity." },
      { q: "What's the standard fee in Germany?", a: "SEPA Direct Debit: €0.20-0.50 flat per transaction. Cards: 1.5-2.5%. Invoice (BNPL): 2-4% + fixed fee. Local bank redirects (Sofort/giropay): ~1-1.5% flat." },
    ],
  },
  "france": {
    code: "FR", name: "France", flag: "🇫🇷",
    localMethods: [
      { code: "cb", name: "Cartes Bancaires (CB)", desc: "National card scheme, ~70% of French card payments" },
      { code: "sepa", name: "SEPA", desc: "Bank transfers and direct debit" },
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Co-branded with CB on most cards" },
    ],
    intro:
      "France has a unique domestic card scheme — Cartes Bancaires (CB) — co-branded on virtually all French cards. Processing CB is cheaper than international Visa/Mastercard routes. To serve French merchants well, your processor must support CB routing. SEPA is also strong for subscriptions and B2B.",
    highlights: [
      "Cartes Bancaires (CB) domestic card scheme",
      "SEPA Direct Debit and Credit Transfer",
      "ACPR/Banque de France regulation",
      "Strong support for iGaming under ANJ license",
    ],
    faq: [
      { q: "What is Cartes Bancaires and why does it matter?", a: "CB is France's national card scheme. About 70% of French card transactions are routed via CB (cheaper) rather than Visa/Mastercard rails. Processors that support CB routing save merchants 0.3-0.6% per transaction." },
      { q: "Can I accept payments in France from outside the EU?", a: "Yes, but you'll need either a French entity, an EU-licensed PSP with French passporting, or a Merchant of Record service. Cross-border interchange can be higher than domestic processing." },
      { q: "What about iGaming in France?", a: "Online gambling in France is regulated by ANJ. Specific products (sports betting, poker, horse racing) require ANJ licenses. Several payment providers support ANJ-licensed operators — check our high-risk fiat segment." },
    ],
  },
  "brazil": {
    code: "BR", name: "Brazil", flag: "🇧🇷",
    localMethods: [
      { code: "pix", name: "PIX", desc: "Brazil's instant payment system, ~40% of online checkouts" },
      { code: "boleto", name: "Boleto Bancário", desc: "Cash voucher paid at banks or convenience stores" },
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "With local installment plans (parcelado)" },
    ],
    intro:
      "Brazil is one of the world's fastest-growing payments markets, transformed by PIX — the instant payment system launched by the Central Bank in 2020. Today PIX accounts for ~40% of online payment volume in Brazil. Cards are dominant but with unique Brazilian features (installment payments are standard). Boleto remains relevant for the underbanked. Local processing fees are dramatically lower than international routing.",
    highlights: [
      "PIX instant payments (24/7, free for individuals)",
      "Boleto Bancário cash voucher network",
      "Card installments (parcelado) up to 12x",
      "Brazilian Real (BRL) settlement",
    ],
    faq: [
      { q: "What is PIX and why is it so popular?", a: "PIX is Brazil's central-bank-operated instant payment rail, free for individuals and very cheap for businesses (~0.2-0.5%). It works 24/7, settles in seconds, and works via QR code, phone number, email or random key. For merchants it's dramatically cheaper than card processing." },
      { q: "How do card installments (parcelado) work in Brazil?", a: "Brazilian consumers expect to split card payments into 2-12 monthly installments at checkout. The merchant receives one upfront payment minus a higher fee (3-7%), and the processor/acquirer handles the installment collection from the cardholder." },
      { q: "Do I need a Brazilian entity to accept payments in Brazil?", a: "Officially yes for direct local processing — you need a Brazilian CNPJ and bank account. However, many international PSPs offer Brazilian local acquiring via Merchant of Record or local entity partnerships, letting foreign companies sell to Brazilian customers without setting up locally." },
      { q: "What are typical fees for Brazilian e-commerce?", a: "PIX: 0.2-0.5%. Cards (1x): 2.5-4.5%. Cards parcelado (installments): 3.5-7% effective rate. Boleto: BRL 1-3 fixed fee. Settlement in 30 days is standard for cards; PIX settles instantly." },
    ],
  },
  "india": {
    code: "IN", name: "India", flag: "🇮🇳",
    localMethods: [
      { code: "upi", name: "UPI", desc: "Unified Payments Interface — ~70% of digital transactions" },
      { code: "rupay", name: "RuPay", desc: "Domestic card network" },
      { code: "netbanking", name: "Net Banking", desc: "Bank-redirect online checkout" },
    ],
    intro:
      "India runs on UPI — the National Payments Corporation's instant payment system that processes over 10 billion transactions per month. For Indian merchants, UPI acceptance is non-negotiable; it's free or near-free, instant, and used by every smartphone user. Cards (RuPay domestic, Visa/Mastercard international) and net banking complete the typical Indian checkout stack.",
    highlights: [
      "UPI instant payments (24/7, near-zero merchant fees)",
      "RuPay domestic card network",
      "Net banking for ~30 major Indian banks",
      "Wallets: Paytm, PhonePe, Google Pay (UPI-based)",
    ],
    faq: [
      { q: "Why is UPI so dominant in India?", a: "UPI launched in 2016 with strong government backing and zero merchant fees for small merchants. It runs on a real-time interbank rail, works via QR code or phone number, and is integrated into every major Indian app. For merchants, accepting UPI costs almost nothing compared to 1.5-2% for cards." },
      { q: "Do I need an Indian entity to process payments in India?", a: "Yes, RBI regulations require domestic payment processing through Indian-licensed entities. Foreign sellers typically use payment aggregators with PA/PSP licenses or partner with Indian merchant-of-record services. Cross-border imports are also allowed via specific RBI-approved channels." },
      { q: "What about settling in INR vs USD?", a: "Domestic Indian merchants settle in INR. Cross-border sellers typically settle in USD/EUR via SWIFT after FX conversion (1-2% spread). RBI has restrictions on holding foreign currency in Indian accounts, which affects how cross-border processors structure settlement." },
      { q: "What are typical fees for Indian e-commerce?", a: "UPI: 0% for small merchants, 0.4% for larger. RuPay: 0.5-0.9%. International cards: 1.8-2.5%. Net banking: 0.5-1.5%. Settlement is T+1 to T+3 depending on processor." },
    ],
  },
  "mexico": {
    code: "MX", name: "Mexico", flag: "🇲🇽",
    localMethods: [
      { code: "spei", name: "SPEI", desc: "Mexico's interbank instant payment system" },
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Dominant card networks with high penetration" },
      { code: "oxxo", name: "OXXO Cash", desc: "Pay-by-cash at OXXO convenience stores" },
    ],
    intro:
      "Mexico's payment landscape combines strong card adoption with two unique local methods: SPEI (instant bank transfers, similar to Brazil's PIX) and OXXO cash vouchers (used by the ~50% of Mexicans who are underbanked). E-commerce merchants serving Mexico must support all three to capture the full market.",
    highlights: [
      "SPEI instant bank transfers",
      "OXXO cash voucher network (15,000+ stores)",
      "Visa, Mastercard, Carnet domestic scheme",
      "MXN settlement and FX management",
    ],
    faq: [
      { q: "What is SPEI and how does it work?", a: "SPEI (Sistema de Pagos Electrónicos Interbancarios) is Mexico's instant interbank payment system run by Banco de México. It settles in seconds and is widely used for e-commerce, B2B and high-ticket purchases — fees are typically 0.5-1% vs 3-4% for cards." },
      { q: "Why is OXXO so important for Mexican e-commerce?", a: "Around 50% of Mexican adults are underbanked. OXXO is Latin America's largest convenience store chain — customers complete online checkout, receive a voucher, pay cash at any OXXO. Conversion can be 15-30% of orders depending on category and demographic." },
      { q: "Do I need a Mexican entity to process payments in Mexico?", a: "Domestic processing typically requires a Mexican entity (RFC) and MXN bank account. However, many international PSPs offer Mexico local acquiring through partnerships or Merchant of Record services for foreign sellers." },
      { q: "What's the standard fee for Mexican e-commerce?", a: "Cards: 2.5-3.9% + fixed. SPEI: 0.5-1.5%. OXXO: 1.5-2.5% + fixed fee per voucher. Settlement is T+1 to T+3 for cards, instant for SPEI." },
    ],
  },
  "kazakhstan": {
    code: "KZ", name: "Kazakhstan", flag: "🇰🇿",
    localMethods: [
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Dominant card networks" },
      { code: "kaspi", name: "Kaspi.kz", desc: "Super-app and QR payments, dominant in retail" },
      { code: "sbp", name: "QR / Instant payments", desc: "Bank-driven instant payment systems" },
    ],
    intro:
      "Kazakhstan has one of Central Asia's most digitized payment markets, dominated by Kaspi.kz — a super-app that combines banking, e-commerce and payments. Foreign merchants serving Kazakhstani customers benefit from card acceptance plus Kaspi QR integration. Lower regulatory friction than Russia makes Kazakhstan a popular gateway for CIS-focused merchants.",
    highlights: [
      "Visa, Mastercard, UnionPay acceptance",
      "Kaspi.kz QR payments (dominant local method)",
      "KZT settlement and FX management",
      "Lighter regulatory burden than Russia",
    ],
    faq: [
      { q: "What is Kaspi.kz and why does it matter?", a: "Kaspi is Kazakhstan's dominant super-app with banking, payments, BNPL, marketplace and bills. Its QR payment system is accepted virtually everywhere and is the de facto local payment standard. Merchants serving Kazakhstan should integrate Kaspi QR for maximum conversion." },
      { q: "Do I need a Kazakhstani entity to accept KZT?", a: "Cross-border processors can serve Kazakhstani customers without local entity, typically settling in USD/EUR. For full local market access (Kaspi, B2B billing, KZT direct settlement), a Kazakhstani entity or local partner is typically needed." },
      { q: "Is Kazakhstan affected by Russia sanctions?", a: "Kazakhstan is generally unaffected by direct Russia sanctions for international payment processing. However, processors apply enhanced due diligence given cross-border traffic with Russia, and certain banks may decline transactions tied to sanctioned parties." },
    ],
  },
  "spain": {
    code: "ES", name: "Spain", flag: "🇪🇸",
    localMethods: [
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Dominant for e-commerce" },
      { code: "sepa", name: "SEPA", desc: "Direct debit and credit transfers" },
      { code: "bizum", name: "Bizum", desc: "Mobile P2P/P2M payment system used by 22+ Spanish banks" },
    ],
    intro:
      "Spain combines strong card adoption with Bizum — a unified mobile payment system used across all major Spanish banks. For Spanish e-commerce, supporting Bizum significantly boosts conversion among younger consumers. SEPA covers subscriptions and B2B, while iGaming is regulated under DGOJ for specific verticals.",
    highlights: [
      "Bizum mobile payments (banks-led, ~30M users)",
      "SEPA Direct Debit and Credit Transfer",
      "iGaming under DGOJ license",
      "EUR settlement, EU PSD2 regulation",
    ],
    faq: [
      { q: "What is Bizum?", a: "Bizum is a mobile payment system jointly developed by Spanish banks. It lets users pay merchants via phone number, instantly debiting their bank account. It's used by ~30M Spaniards (60%+ adoption) and is increasingly common at online checkouts." },
      { q: "How do iGaming payments work in Spain?", a: "Online gambling in Spain is regulated by DGOJ. Operators need DGOJ licenses and must use payment processors that comply with player verification, deposit limits and self-exclusion lists. Several PSPs in our high-risk fiat segment support DGOJ-licensed operators." },
    ],
  },
  "netherlands": {
    code: "NL", name: "Netherlands", flag: "🇳🇱",
    localMethods: [
      { code: "ideal", name: "iDEAL", desc: "Bank-redirect, dominates Dutch e-commerce (~60% share)" },
      { code: "sepa", name: "SEPA", desc: "Direct debit standard for subscriptions" },
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Secondary to iDEAL for online" },
    ],
    intro:
      "iDEAL dominates Dutch e-commerce — it processes ~60% of online payments in the Netherlands. Any merchant serious about Dutch market must support iDEAL alongside cards. SEPA covers subscriptions. The Dutch market is sophisticated, with high consumer expectations around UX, security and speed.",
    highlights: [
      "iDEAL bank-redirect (60%+ of NL e-commerce)",
      "SEPA Direct Debit for subscriptions",
      "DNB regulation, EU PSD2 compliance",
      "Strong fraud prevention infrastructure",
    ],
    faq: [
      { q: "What is iDEAL and why is it dominant?", a: "iDEAL is a bank-redirect payment method jointly operated by Dutch banks. Customer selects bank at checkout, gets redirected to their bank's app/portal, confirms payment, and returns to merchant. Settlement is instant, fraud is virtually zero (bank-authenticated), and fees are low (1-2%)." },
      { q: "Do I need a Dutch entity to support iDEAL?", a: "No, iDEAL is offered by all major PSPs (Stripe, Adyen, Mollie, Buckaroo, etc) and many can onboard non-NL merchants. EU PSD2 passporting works fine. Adyen is itself a Dutch company with deepest iDEAL integration." },
    ],
  },
  "switzerland": {
    code: "CH", name: "Switzerland", flag: "🇨🇭",
    localMethods: [
      { code: "twint", name: "TWINT", desc: "Swiss mobile payment app, ~5M users" },
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Dominant for online" },
      { code: "postfinance", name: "PostFinance", desc: "Swiss postal bank, key for older demographics" },
    ],
    intro:
      "Switzerland has TWINT — its national mobile payment app used by ~5M Swiss residents. For Swiss e-commerce, TWINT acceptance is essential alongside cards. CHF settlement, FINMA regulation and strong banking secrecy make Switzerland a unique market — many crypto-friendly processors are licensed here.",
    highlights: [
      "TWINT mobile payments (~5M users)",
      "FINMA-regulated PSPs and acquirers",
      "CHF settlement and FX management",
      "Crypto-friendly: many Swiss-licensed crypto PSPs",
    ],
    faq: [
      { q: "What is TWINT?", a: "TWINT is Switzerland's national mobile payment app, owned jointly by Swiss banks. It enables P2P and P2M payments via phone number or QR code. Adoption is very high — ~5M active users in a country of 8.7M." },
      { q: "Why is Switzerland crypto-friendly?", a: "FINMA (Swiss financial regulator) was an early mover on clear crypto rules. Zug's 'Crypto Valley' hosts many blockchain companies. Several payment processors licensed in Switzerland offer crypto-fiat conversion, custody and merchant services with clear regulatory standing." },
    ],
  },
  "indonesia": {
    code: "ID", name: "Indonesia", flag: "🇮🇩",
    localMethods: [
      { code: "qris", name: "QRIS", desc: "National QR code payment standard" },
      { code: "gopay", name: "GoPay", desc: "Gojek super-app wallet" },
      { code: "ovo", name: "OVO", desc: "Grab/Tokopedia-affiliated wallet" },
    ],
    intro:
      "Indonesia's payment market is dominated by digital wallets — GoPay (Gojek), OVO (Grab) and DANA — and QRIS, the national QR standard that unifies all wallets and bank apps. Cards are minor for e-commerce. Bank transfers via Indonesian retail banks remain important. Cash on delivery is still 20-30% of e-commerce volume.",
    highlights: [
      "QRIS unified QR code (all wallets + banks)",
      "GoPay, OVO, DANA, ShopeePay wallets",
      "Cash on Delivery (COD) infrastructure",
      "IDR settlement, Bank Indonesia regulation",
    ],
    faq: [
      { q: "What is QRIS and why does it matter?", a: "QRIS (Quick Response Code Indonesian Standard) is the national QR payment standard introduced by Bank Indonesia. A single QR code is readable by every Indonesian wallet and banking app, making merchant integration vastly simpler. Adoption is rapidly growing." },
      { q: "Should I support cash on delivery in Indonesia?", a: "Yes if you're targeting mass market or outside major cities. COD is 20-30% of Indonesian e-commerce volume, particularly for first-time buyers and lower-income segments. It comes with higher fraud and return risks — work with PSPs that offer COD reconciliation." },
    ],
  },
  "philippines": {
    code: "PH", name: "Philippines", flag: "🇵🇭",
    localMethods: [
      { code: "gcash", name: "GCash", desc: "Largest Philippine e-wallet, ~80M users" },
      { code: "paymaya", name: "Maya (PayMaya)", desc: "Second-largest e-wallet, banking license" },
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Growing but secondary to wallets" },
    ],
    intro:
      "The Philippines is wallet-first — GCash alone has ~80M users (75% of the population). E-commerce checkouts must include GCash and Maya for any meaningful conversion. Cards are growing among the urban middle class. Cash on delivery is still ~20% of e-commerce volume.",
    highlights: [
      "GCash and Maya digital wallets",
      "BSP-regulated payment landscape",
      "PHP settlement and FX management",
      "Cash on Delivery (COD) infrastructure",
    ],
    faq: [
      { q: "Why are wallets dominant in the Philippines?", a: "Card and bank penetration historically lagged. GCash launched in 2004 and Maya followed; together they captured the digital payment opportunity well before banks digitized. Today most Filipinos transact via wallet, even for utility bills and government services." },
      { q: "Do I need a Philippine entity to process payments?", a: "BSP licensing is needed for full domestic processing. International PSPs serve cross-border merchants without local entity but with FX conversion. For deep local integration (GCash direct, peso settlement) a local entity or Merchant of Record is typical." },
    ],
  },
  "malaysia": {
    code: "MY", name: "Malaysia", flag: "🇲🇾",
    localMethods: [
      { code: "duitnow", name: "DuitNow QR", desc: "National QR payment standard" },
      { code: "fpx", name: "FPX", desc: "Bank-to-bank online transfer system" },
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Standard card networks" },
    ],
    intro:
      "Malaysia combines DuitNow QR (national QR standard), FPX bank transfers and cards. FPX is particularly important — it's a real-time bank-to-bank transfer used widely for online checkout. E-wallets like Touch 'n Go and GrabPay are also significant. The market is BNM-regulated with clear rules.",
    highlights: [
      "DuitNow QR national payment standard",
      "FPX bank-to-bank online transfers",
      "Touch 'n Go and GrabPay e-wallets",
      "MYR settlement, BNM regulation",
    ],
    faq: [
      { q: "What is FPX?", a: "FPX (Financial Process Exchange) is Malaysia's real-time bank-to-bank online payment system. It lets customers pay merchants from their bank account in real time during e-commerce checkout. Adoption is high (~70% of Malaysian banking users) and fees are low (~1-1.5%)." },
      { q: "What's DuitNow QR?", a: "DuitNow QR is Malaysia's unified QR payment standard set by Bank Negara Malaysia. A single QR code is accepted by all major Malaysian wallets and bank apps, simplifying merchant integration vs maintaining separate codes for each wallet." },
    ],
  },
  "thailand": {
    code: "TH", name: "Thailand", flag: "🇹🇭",
    localMethods: [
      { code: "promptpay", name: "PromptPay", desc: "National instant payment + QR" },
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Card payments for mid-to-high tickets" },
      { code: "truemoney", name: "TrueMoney", desc: "Largest Thai e-wallet" },
    ],
    intro:
      "Thailand's payment market is led by PromptPay — the Bank of Thailand's instant payment + QR code system. PromptPay is virtually universal among Thai banking customers, with near-zero fees and instant settlement. Cards remain important for mid-to-high-ticket e-commerce, and TrueMoney leads the wallet space.",
    highlights: [
      "PromptPay national instant payments + QR",
      "TrueMoney, LINE Pay, ShopeePay wallets",
      "BOT-regulated PSP landscape",
      "THB settlement and FX management",
    ],
    faq: [
      { q: "What is PromptPay?", a: "PromptPay is Thailand's central-bank-operated instant payment system, similar to UPI (India) or PIX (Brazil). It works via phone number, national ID, or QR code. Settlement is instant, 24/7, and fees for merchants are minimal (0.2-0.5%)." },
      { q: "Do I need a Thai entity to process payments?", a: "Domestic processing under BOT rules typically requires Thai entity. Cross-border processors can serve Thailand from outside, though FX and settlement constraints apply. For full PromptPay integration, partnerships with Thai PSPs are common." },
    ],
  },
  "japan": {
    code: "JP", name: "Japan", flag: "🇯🇵",
    localMethods: [
      { code: "visa_mastercard", name: "Visa, Mastercard, JCB", desc: "Cards including domestic JCB" },
      { code: "konbini", name: "Konbini", desc: "Pay-at-convenience-store voucher system" },
      { code: "paypay", name: "PayPay", desc: "Dominant mobile QR wallet" },
    ],
    intro:
      "Japan's payment culture remained cash-heavy until recently. The market is now rapidly digitizing — PayPay leads QR/wallet adoption, cards (with JCB as a major domestic network) are growing, and konbini (convenience-store cash voucher) remains popular for B2C. Card fees are notably high vs other developed markets.",
    highlights: [
      "JCB domestic card network (plus Visa, Mastercard)",
      "PayPay, LINE Pay, Rakuten Pay wallets",
      "Konbini cash voucher infrastructure",
      "JPY settlement, FSA-regulated PSPs",
    ],
    faq: [
      { q: "What is konbini payment?", a: "Konbini payment lets customers complete e-commerce checkout and then pay cash at any major Japanese convenience store chain (7-Eleven, FamilyMart, Lawson). It's used by ~10-15% of Japanese e-commerce buyers, especially for younger and older demographics." },
      { q: "Why are card fees higher in Japan?", a: "Japanese interchange has been higher than EU or US for historical reasons, though it has come down. Typical merchant fees are 2.5-4% — higher than the US (2.6-2.9%) and EU (1.4-2%). JCB routing can sometimes be cheaper for domestic transactions." },
    ],
  },
  "singapore": {
    code: "SG", name: "Singapore", flag: "🇸🇬",
    localMethods: [
      { code: "paynow", name: "PayNow", desc: "Singapore's instant payment system" },
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Universal card acceptance" },
      { code: "grabpay", name: "GrabPay", desc: "Super-app wallet" },
    ],
    intro:
      "Singapore is a regional payment hub with sophisticated infrastructure: PayNow instant payments, broad card acceptance, and active fintech ecosystem. MAS-licensed PSPs serve both local and pan-APAC merchants. Singapore is also a crypto-friendly jurisdiction with clear MAS rules around digital asset services.",
    highlights: [
      "PayNow instant interbank payments",
      "Visa, Mastercard, NETS domestic scheme",
      "MAS-regulated PSPs (PSL/MPI licenses)",
      "Crypto-friendly regulatory framework",
    ],
    faq: [
      { q: "Why is Singapore good for payment processors?", a: "MAS provides clear PSP regulation (Payment Services Act 2019) covering account issuance, e-money, digital tokens and merchant acquiring. Many regional payment hubs operate from Singapore for APAC routing. Time zone, language and regulatory clarity attract fintech." },
      { q: "What is PayNow?", a: "PayNow is Singapore's instant interbank payment system run by ABS. It supports payments via NRIC, phone number, or VPA, with instant settlement and near-zero fees. Widely used for P2P and increasingly for P2M (merchant) payments." },
    ],
  },
  "uae": {
    code: "AE", name: "UAE", flag: "🇦🇪",
    localMethods: [
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Universal card acceptance" },
      { code: "aps", name: "Apple Pay & Google Pay", desc: "High adoption among Gulf consumers" },
      { code: "crypto", name: "Crypto", desc: "Regulated under VARA in Dubai" },
    ],
    intro:
      "The UAE — and Dubai specifically — is a payments innovation hub. The market is card-dominant with very high digital wallet adoption (Apple/Google Pay). Dubai's VARA framework provides regulatory clarity for crypto businesses. The UAE is a popular base for MENA-focused payment processors and a strategic gateway between Asia, Africa and Europe.",
    highlights: [
      "Visa, Mastercard, Mada (Saudi cross-routing)",
      "Apple Pay, Google Pay, Samsung Pay",
      "Crypto-friendly under VARA (Dubai)",
      "AED settlement, multi-currency support",
    ],
    faq: [
      { q: "Why is Dubai/UAE attractive for payment companies?", a: "Strong regulatory clarity (DFSA, VARA, CBUAE), tax incentives, strategic location bridging Asia/Africa/Europe, high banking quality, and crypto-friendly stance. Many global PSPs run regional headquarters from DIFC or ADGM." },
      { q: "Is crypto legal in the UAE?", a: "Yes, with regulation. Dubai's VARA (Virtual Asset Regulatory Authority) provides licensing for crypto activities. ADGM also licenses crypto businesses. Several crypto payment processors are UAE-licensed and serve global merchants." },
    ],
  },
  "turkey": {
    code: "TR", name: "Turkey", flag: "🇹🇷",
    localMethods: [
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "With local installment plans" },
      { code: "troy", name: "Troy", desc: "Turkish domestic card scheme" },
      { code: "havale", name: "Havale / EFT", desc: "Bank transfers, widely used" },
    ],
    intro:
      "Turkey has high card penetration with a unique local feature — card installments (taksit) are standard for higher-ticket purchases, similar to Brazil's parcelado. Troy is the domestic card scheme. Bank transfers (Havale/EFT) cover B2B and high-ticket. The Turkish lira's volatility makes FX management critical for cross-border merchants.",
    highlights: [
      "Card installments (taksit) up to 12x",
      "Troy domestic card scheme",
      "Havale/EFT bank transfer rails",
      "TRY settlement with FX management",
    ],
    faq: [
      { q: "What are card installments (taksit) in Turkey?", a: "Turkish consumers commonly split card payments into 3-12 monthly installments at checkout. The acquirer handles installment collection from the cardholder, paying the merchant upfront (minus a higher fee). Without taksit support, conversion drops significantly for purchases above TRY 1000." },
      { q: "Do I need a Turkish entity to process payments?", a: "For full domestic processing — yes, BDDK licensing through a Turkish-licensed PSP/bank. Cross-border merchants can sell to Turkish customers via international PSPs with FX conversion, but lose access to local installments and lower-cost routing." },
    ],
  },
  "poland": {
    code: "PL", name: "Poland", flag: "🇵🇱",
    localMethods: [
      { code: "blik", name: "BLIK", desc: "National mobile payment standard, ~14M users" },
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Standard card networks" },
      { code: "sepa", name: "SEPA", desc: "Direct debit and credit transfer" },
    ],
    intro:
      "Poland's payment scene is led by BLIK — a unified mobile payment system supported by all major Polish banks and used by ~14M Poles. BLIK lets customers pay with a 6-digit code generated in their banking app. For Polish e-commerce, BLIK support is essential alongside cards. Poland is also a strong target for SaaS and B2B given EU/SEPA membership.",
    highlights: [
      "BLIK mobile payments (14M+ users)",
      "Visa, Mastercard standard cards",
      "SEPA Direct Debit and Credit Transfer",
      "PLN settlement, KNF regulation",
    ],
    faq: [
      { q: "What is BLIK?", a: "BLIK is Poland's unified mobile payment system, owned jointly by Polish banks. Customers generate a 6-digit code in their banking app and enter it at checkout. Settlement is instant. It's used by ~14M Poles and processes >1B transactions per year." },
    ],
  },
  "nigeria": {
    code: "NG", name: "Nigeria", flag: "🇳🇬",
    localMethods: [
      { code: "verve", name: "Verve", desc: "Nigerian domestic card scheme" },
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "International card networks" },
      { code: "crypto", name: "Crypto", desc: "Significant grassroots adoption" },
    ],
    intro:
      "Nigeria is Africa's largest economy and a fast-growing payments market. Cards (Verve domestic + Visa/Mastercard), bank transfers (NIBSS Instant Payments) and increasingly crypto drive the digital economy. NGN volatility and capital controls make FX management critical. Many fintechs (Flutterwave, Paystack) emerged here.",
    highlights: [
      "Verve domestic card scheme",
      "NIBSS Instant Payment (NIP) transfers",
      "Strong crypto adoption (grassroots)",
      "NGN settlement, CBN regulation",
    ],
    faq: [
      { q: "Why is crypto adoption so strong in Nigeria?", a: "Nigeria has currency controls and high NGN inflation. Crypto (especially USDT) serves as a hedge and remittance channel. P2P trading volumes are among the world's highest per capita. Crypto payment gateways serving Nigeria have grown rapidly." },
      { q: "Do I need a Nigerian entity to process payments?", a: "Domestic processing requires CBN-licensed entities. Cross-border PSPs can serve Nigeria from outside but face FX constraints. Many merchants use Nigerian-licensed PSPs like Paystack or Flutterwave for full local integration." },
    ],
  },
  "kenya": {
    code: "KE", name: "Kenya", flag: "🇰🇪",
    localMethods: [
      { code: "m_pesa", name: "M-Pesa", desc: "Mobile money pioneer, ~30M users" },
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Urban e-commerce" },
      { code: "airtel_money", name: "Airtel Money", desc: "Second-largest mobile money" },
    ],
    intro:
      "Kenya is the birthplace of mobile money — M-Pesa launched here in 2007 and now serves ~30M Kenyans. Any merchant serving Kenya must integrate M-Pesa. Cards are urban-only. Mobile money is the de facto payment infrastructure for both urban and rural Kenya, B2C and B2B.",
    highlights: [
      "M-Pesa mobile money (~30M users)",
      "Airtel Money and T-Kash",
      "Cards for urban e-commerce",
      "KES settlement, CBK regulation",
    ],
    faq: [
      { q: "What is M-Pesa?", a: "M-Pesa is a mobile money service run by Safaricom (Vodacom-owned). Users transfer money via SMS or USSD using their phone number — no smartphone needed. Adoption is near-universal in Kenya and merchant integration is critical for any local-facing business." },
    ],
  },
  "south-africa": {
    code: "ZA", name: "South Africa", flag: "🇿🇦",
    localMethods: [
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Strong card penetration" },
      { code: "eft", name: "EFT", desc: "Electronic funds transfer (bank-to-bank)" },
      { code: "snapscan", name: "SnapScan & Zapper", desc: "Mobile QR payments" },
    ],
    intro:
      "South Africa has the most mature payment infrastructure on the continent — high card penetration, robust banking, EFT for B2B, and growing mobile/QR adoption (SnapScan, Zapper). The ZAR is freely convertible but volatile. SARB regulates PSPs. Many pan-African payment processors operate from South Africa.",
    highlights: [
      "Strong card acceptance (Visa, Mastercard)",
      "EFT (Electronic Funds Transfer) bank rails",
      "SnapScan, Zapper QR payments",
      "ZAR settlement, SARB regulation",
    ],
    faq: [
      { q: "Why is South Africa important for African e-commerce?", a: "Most mature banking and payment infrastructure on the continent. Strong card penetration. Many pan-African PSPs base out of South Africa due to regulatory clarity and skilled fintech labor. ZAR is freely convertible (unlike many African currencies)." },
    ],
  },
  "ireland": {
    code: "IE", name: "Ireland", flag: "🇮🇪",
    localMethods: [
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Dominant for e-commerce" },
      { code: "sepa", name: "SEPA", desc: "Direct debit and credit transfer" },
    ],
    intro:
      "Ireland is a major EU fintech hub — home to European HQs for Stripe, PayPal, and many global payment companies. Card-dominant for e-commerce, SEPA for subscriptions, EUR settlement. Ireland-based EU-licensed processors typically passport across the EU for pan-European reach.",
    highlights: [
      "Cards (Visa, Mastercard) dominant",
      "SEPA Direct Debit and Credit Transfer",
      "EUR settlement, CBI regulation",
      "Many EU-licensed PSPs based here",
    ],
    faq: [
      { q: "Why are so many payment companies based in Ireland?", a: "EU member with English language, common law, business-friendly tax regime, strong fintech talent pool, and CBI (Central Bank of Ireland) reputation for clear PSP regulation. Stripe, PayPal, Square and others have major Irish operations." },
    ],
  },
  "malta": {
    code: "MT", name: "Malta", flag: "🇲🇹",
    localMethods: [
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Standard cards" },
      { code: "sepa", name: "SEPA", desc: "EU bank transfer rails" },
    ],
    intro:
      "Malta is a small EU member state with a disproportionate footprint in iGaming and crypto. The Malta Gaming Authority (MGA) licenses online gambling operators worldwide, and many high-risk payment processors are MGA-friendly. The Virtual Financial Assets Act (2018) was an early crypto-specific framework.",
    highlights: [
      "MGA licenses for iGaming operators",
      "Crypto-friendly via VFA Act 2018",
      "MFSA-regulated PSPs",
      "EUR settlement, EU PSD2 passporting",
    ],
    faq: [
      { q: "Why is Malta important for iGaming?", a: "The Malta Gaming Authority (MGA) is a globally respected iGaming regulator. Many online casinos, sportsbooks and poker rooms hold MGA licenses. Specialized payment processors familiar with MGA compliance serve this segment — see our high-risk fiat segment." },
    ],
  },
  "cyprus": {
    code: "CY", name: "Cyprus", flag: "🇨🇾",
    localMethods: [
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Standard cards" },
      { code: "sepa", name: "SEPA", desc: "EU bank rails" },
    ],
    intro:
      "Cyprus is a small EU member with significant forex and high-risk payment industry. CySEC regulates investment firms and CIFs, making Cyprus a base for many forex/CFD brokers. Many high-risk payment processors are familiar with CySEC requirements and serve Cyprus-licensed operators.",
    highlights: [
      "CySEC-regulated forex/CFD firms",
      "EU PSD2 passporting for PSPs",
      "EUR settlement, MiFID II coverage",
      "iGaming and high-risk-friendly providers",
    ],
    faq: [
      { q: "Why is Cyprus relevant for forex/high-risk payments?", a: "CySEC was an early EU regulator of forex/CFD brokers; many high-risk-adjacent businesses incorporated here. Payment processors familiar with CySEC compliance and forex/CFD vertical risk are common, often offering rolling reserves and specialized chargeback handling." },
    ],
  },
  "curacao": {
    code: "CW", name: "Curaçao", flag: "🇨🇼",
    localMethods: [
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Standard cards" },
    ],
    intro:
      "Curaçao is a Caribbean jurisdiction known for licensing online gambling operators worldwide. The Curaçao eGaming license is widely held in the iGaming industry. Payment processors familiar with Curaçao-licensed operators serve this segment — typically requiring stricter KYB and reserves.",
    highlights: [
      "Curaçao eGaming licensing",
      "High-risk-friendly payment processors",
      "Crypto payment infrastructure",
      "USD/EUR settlement",
    ],
    faq: [
      { q: "What is the Curaçao gaming license?", a: "Curaçao issues online gambling licenses recognized by many international jurisdictions. The licensing process is faster and less expensive than Malta or UK, making it popular for startups. However, banking and payments for Curaçao-licensed operators require specialized PSPs that understand the vertical." },
    ],
  },
  "ukraine": {
    code: "UA", name: "Ukraine", flag: "🇺🇦",
    localMethods: [
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Standard cards" },
      { code: "crypto", name: "Crypto", desc: "High grassroots adoption" },
    ],
    intro:
      "Ukraine has a sophisticated fintech market — even under wartime conditions, online banking and card payments work robustly. Crypto adoption is exceptionally high (per-capita among world leaders). UAH settlement, NBU regulation. Several payment processors specialize in Ukraine market access despite geopolitical complexity.",
    highlights: [
      "Visa, Mastercard, ProstirCard domestic",
      "Strong crypto adoption (P2P, USDT)",
      "Mobile banking (Monobank, Privat24)",
      "UAH settlement, NBU regulation",
    ],
    faq: [
      { q: "Is it possible to process payments in Ukraine despite the war?", a: "Yes — Ukrainian fintech infrastructure remained operational throughout the conflict. Card payments, online banking and crypto all work. International PSPs may apply enhanced due diligence but processing for Ukrainian merchants continues." },
    ],
  },
  "hong-kong": {
    code: "HK", name: "Hong Kong", flag: "🇭🇰",
    localMethods: [
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Universal card acceptance" },
      { code: "fps", name: "FPS", desc: "Faster Payment System (HKMA)" },
      { code: "octopus", name: "Octopus", desc: "Stored-value contactless card" },
    ],
    intro:
      "Hong Kong is a major Asian payment hub with universal card acceptance, the HKMA's FPS instant payment system, and the iconic Octopus card. HKD settlement, HKMA regulation. Hong Kong is a major base for cross-border China-facing fintechs and crypto-friendly under the recent licensing regime.",
    highlights: [
      "FPS instant interbank payments",
      "Visa, Mastercard, UnionPay",
      "Octopus contactless stored value",
      "Crypto-licensed under HKMA framework",
    ],
    faq: [
      { q: "What is FPS in Hong Kong?", a: "Faster Payment System (FPS) is HKMA's real-time interbank payment system. It supports HKD and CNY, works via phone number, email, or FPS ID, and is integrated into all major Hong Kong banks and wallets. Settlement is instant 24/7." },
    ],
  },
  "taiwan": {
    code: "TW", name: "Taiwan", flag: "🇹🇼",
    localMethods: [
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Standard cards" },
      { code: "linepay", name: "LINE Pay", desc: "Dominant Taiwanese e-wallet" },
      { code: "atm_transfer", name: "ATM Transfer", desc: "Popular for cash-preferring buyers" },
    ],
    intro:
      "Taiwan combines strong card adoption with the dominant LINE Pay e-wallet and ATM-based bank transfers (still significant for cash-preferring buyers). FSC regulates PSPs. Taiwan is a high-trust market with sophisticated e-commerce behavior.",
    highlights: [
      "LINE Pay dominant e-wallet",
      "Visa, Mastercard, JCB",
      "ATM virtual account transfers",
      "TWD settlement, FSC regulation",
    ],
    faq: [
      { q: "What's special about Taiwan payments?", a: "ATM virtual account transfers — uncommon elsewhere — are still significant in Taiwan, especially for older demographics. Merchants generate a virtual account number; customer transfers from any Taiwanese bank ATM. LINE Pay dominates mobile checkout." },
    ],
  },
  "canada": {
    code: "CA", name: "Canada", flag: "🇨🇦",
    localMethods: [
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Universal acceptance" },
      { code: "interac", name: "Interac e-Transfer", desc: "Bank-to-bank, dominant for P2P/P2M" },
      { code: "ach", name: "ACH / EFT", desc: "Bank transfers for B2B" },
    ],
    intro:
      "Canada has high card penetration plus Interac e-Transfer — a dominant bank-to-bank rail used for P2P, P2M and B2B. Most Canadians have Interac wired into their banking app. CAD settlement, OSFI regulation for federally regulated processors. Strong fintech market with clear PSP rules.",
    highlights: [
      "Interac e-Transfer (dominant local rail)",
      "Visa, Mastercard, Amex acceptance",
      "ACH/EFT for B2B and recurring",
      "CAD settlement, OSFI regulation",
    ],
    faq: [
      { q: "What is Interac e-Transfer?", a: "Interac e-Transfer is Canada's dominant interbank payment system. Customers send money via email or phone number, and it pulls from their bank account directly. Settlement is typically instant; fees are very low. Wide consumer adoption — most Canadians use it daily." },
    ],
  },
  "australia": {
    code: "AU", name: "Australia", flag: "🇦🇺",
    localMethods: [
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Universal acceptance" },
      { code: "osko", name: "Osko (NPP)", desc: "Real-time bank payments" },
      { code: "bpay", name: "BPAY", desc: "Bill payment infrastructure" },
    ],
    intro:
      "Australia has high card penetration, the NPP/Osko instant payment rail, and BPAY for bill payments. PayID lets customers send via email/phone number on top of NPP. Apple Pay and Google Pay have very high adoption. RBA regulates payments; APRA covers banks. Strong fintech sector.",
    highlights: [
      "Osko/NPP real-time bank payments",
      "BPAY bill payment network",
      "Visa, Mastercard, Eftpos",
      "AUD settlement, RBA-regulated",
    ],
    faq: [
      { q: "What is Osko and how does it differ from BPAY?", a: "Osko runs on Australia's New Payments Platform (NPP) — instant bank-to-bank payments, settling in seconds 24/7. BPAY is the older batch-based bill payment network, primarily for utility bills and B2B. Both coexist; Osko is growing rapidly for online checkout." },
    ],
  },
  "italy": {
    code: "IT", name: "Italy", flag: "🇮🇹",
    localMethods: [
      { code: "visa_mastercard", name: "Visa & Mastercard", desc: "Standard cards" },
      { code: "sepa", name: "SEPA", desc: "Direct debit and credit transfer" },
      { code: "satispay", name: "Satispay", desc: "Italian mobile payment, growing share" },
    ],
    intro:
      "Italy combines standard EU card processing with Satispay — a growing Italian mobile payment app. SEPA covers subscriptions and B2B. Bank of Italy regulates PSPs. Italian consumers historically lagged in e-commerce adoption but the market has grown rapidly post-pandemic.",
    highlights: [
      "Visa, Mastercard, PagoBANCOMAT domestic",
      "Satispay mobile payments (growing)",
      "SEPA Direct Debit and Credit Transfer",
      "EUR settlement, Bank of Italy regulation",
    ],
    faq: [
      { q: "What is Satispay?", a: "Satispay is an Italian mobile payment app that lets users pay merchants from their bank account using just phone number. It's gaining significant share for in-person and online payments in Italy, with low fees and good fraud profile." },
    ],
  },
};

const slugs = Object.keys(C);

export function generateStaticParams() {
  return slugs.map((country) => ({ country }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const c = C[country];
  if (!c) return {};
  const title = `Payment Providers in ${c.name} — Compare ${c.name} Payment Gateways`;
  const description = `Compare payment providers serving merchants in ${c.name}. ${c.localMethods.map((m) => m.name).slice(0, 3).join(", ")} and major card networks — fees, KYC, settlement and onboarding terms in one place.`;
  return {
    title,
    description,
    alternates: { canonical: `/payment-providers/${country}` },
    openGraph: { title, description, type: "website", url: `${SITE_URL}/payment-providers/${country}` },
  };
}

export default async function CountryLandingPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const c = C[country];
  if (!c) notFound();

  const supabase = await createClient();

  const { data: countryRow } = await supabase
    .from("countries")
    .select("id")
    .eq("code", c.code)
    .single();

  const { data: providers } = countryRow
    ? await supabase
        .from("processor_countries")
        .select("processors ( name, slug, is_verified, is_featured, segments ( slug, display_name ) )")
        .eq("country_id", (countryRow as any).id)
        .eq("role", "client_geo")
        .eq("is_supported", true)
        .limit(20)
    : { data: [] };

  const providerList = (providers ?? [])
    .map((row: any) => row.processors)
    .filter(Boolean)
    .sort((a: any, b: any) => Number(b?.is_featured) - Number(a?.is_featured) || Number(b?.is_verified) - Number(a?.is_verified));

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Payment Providers in ${c.name}`,
    description: `Curated list of payment providers serving merchants in ${c.name}.`,
    itemListElement: providerList.slice(0, 10).map((p: any, idx: number) => ({
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
      { "@type": "ListItem", position: 2, name: "Payment Providers", item: `${SITE_URL}/search` },
      { "@type": "ListItem", position: 3, name: c.name, item: `${SITE_URL}/payment-providers/${country}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((f) => ({
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
            <Link href="/search" className="hover:text-slate-900">Payment Providers</Link>
            <span className="mx-2">/</span>
            <span style={{ color: "#0F172A" }}>{c.name}</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-5xl">{c.flag}</span>
            <h1 className="text-[2rem] sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05]" style={{ color: "#0F172A", letterSpacing: "-0.025em" }}>
              Payment Providers in {c.name}
            </h1>
          </div>

          <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: "#334155" }}>
            {c.intro}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              href={`/search?country=${c.code}`}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}
            >
              See {providerList.length}+ providers in {c.name} →
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
            {c.highlights.map((h) => (
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

      <section className="py-16" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>
            Key payment methods in {c.name}
          </h2>
          <p className="text-base mb-8" style={{ color: "#64748B" }}>The local rails merchants must support to convert {c.name} customers.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {c.localMethods.map((m) => (
              <div key={m.code} className="p-5 rounded-xl" style={{ background: "#F8FAFC", border: "1px solid rgba(15,23,42,0.06)" }}>
                <div className="text-base font-semibold mb-1" style={{ color: "#0F172A" }}>{m.name}</div>
                <div className="text-sm leading-relaxed" style={{ color: "#475569" }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {providerList.length > 0 && (
        <section className="py-16" style={{ background: "#F8FAFC" }}>
          <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 tracking-tight" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>
              Providers supporting {c.name}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {providerList.slice(0, 12).map((p: any) => (
                <Link
                  key={p.slug}
                  href={`/processors/${p.slug}`}
                  className="group p-5 rounded-xl transition-all hover:border-slate-300 hover:shadow-md"
                  style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.10)" }}
                >
                  <div className="text-base font-semibold mb-1" style={{ color: "#0F172A" }}>{p.name}</div>
                  {p.segments?.display_name && (
                    <div className="text-xs" style={{ color: "#64748B" }}>{p.segments.display_name}</div>
                  )}
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href={`/search?country=${c.code}`}
                className="inline-flex items-center gap-1 text-sm font-semibold"
                style={{ color: "#3B82F6" }}
              >
                See all {c.name} providers →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-16" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[800px] mx-auto px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 tracking-tight" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>
            About payments in {c.name}
          </h2>
          <div className="space-y-3">
            {c.faq.map((f) => (
              <details key={f.q} className="group p-5 rounded-xl" style={{ background: "#F8FAFC", border: "1px solid rgba(15,23,42,0.08)" }}>
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
