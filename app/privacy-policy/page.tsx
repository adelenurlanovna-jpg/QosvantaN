import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy — Qosvanta",
  description: "How Qosvanta collects, uses and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1" style={{ background: "#F7F9FC" }}>
        {/* Hero */}
        <div style={{ background: "linear-gradient(160deg, #08111F 0%, #0D1728 100%)" }}>
          <div className="max-w-[860px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: "#3B82F6" }}>
              Legal
            </p>
            <h1
              className="text-3xl sm:text-4xl font-bold mb-4 leading-tight"
              style={{ color: "#F1F5F9", letterSpacing: "-0.02em" }}
            >
              Privacy Policy
            </h1>
            <p className="text-sm" style={{ color: "#475569" }}>
              Last updated: May 2026
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[860px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <div
            className="rounded-2xl p-8 lg:p-12 space-y-10"
            style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
          >
            <Section title="1. Who We Are">
              <p>
                Qosvanta ("we", "us", "our") operates qosvanta.com — a global payment provider directory and
                marketplace. We help businesses discover, compare, and connect with payment solution providers
                worldwide.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, store and protect personal data when you use
                our website, platform, or services.
              </p>
            </Section>

            <Section title="2. Data We Collect">
              <p>We may collect the following categories of personal data:</p>
              <ul>
                <li>
                  <strong>Account information</strong> — name, email address, company name, job title, and
                  password when you register an account.
                </li>
                <li>
                  <strong>Business information</strong> — company type, industry, target markets, monthly
                  processing volume, and other details you provide when requesting provider matching.
                </li>
                <li>
                  <strong>Communication data</strong> — messages you send via our chat assistant, contact
                  forms, or email.
                </li>
                <li>
                  <strong>Usage data</strong> — pages visited, search queries, filters applied, session
                  duration, browser type, IP address, and device identifiers.
                </li>
                <li>
                  <strong>Verification data</strong> — company registration documents, beneficial owner
                  information, and other KYB/KYC materials submitted for platform verification.
                </li>
              </ul>
            </Section>

            <Section title="3. How We Use Your Data">
              <p>We process your personal data for the following purposes:</p>
              <ul>
                <li>To create and manage your account and provide access to our marketplace.</li>
                <li>
                  To match you with relevant payment providers based on your business profile and
                  requirements.
                </li>
                <li>To verify your company identity and assess eligibility for provider access tiers.</li>
                <li>To respond to your inquiries and provide support.</li>
                <li>To improve the platform, conduct analytics, and develop new features.</li>
                <li>To send service notifications, updates, and (with your consent) marketing communications.</li>
                <li>To comply with legal obligations, prevent fraud, and enforce our Terms of Use.</li>
              </ul>
            </Section>

            <Section title="4. Legal Basis for Processing">
              <p>Depending on the context, we process your data on the following legal grounds:</p>
              <ul>
                <li>
                  <strong>Contract performance</strong> — to provide the services you have requested.
                </li>
                <li>
                  <strong>Legitimate interests</strong> — to operate and improve our platform, prevent fraud,
                  and communicate service updates.
                </li>
                <li>
                  <strong>Consent</strong> — for optional communications such as newsletters or marketing
                  emails.
                </li>
                <li>
                  <strong>Legal obligation</strong> — to comply with applicable laws and regulations.
                </li>
              </ul>
            </Section>

            <Section title="5. Data Sharing">
              <p>We do not sell your personal data. We may share it in the following circumstances:</p>
              <ul>
                <li>
                  <strong>Payment providers</strong> — when you explicitly request a connection or matching
                  introduction, we share relevant business information with the selected provider.
                </li>
                <li>
                  <strong>Service providers</strong> — we use third-party tools for hosting, analytics,
                  customer support, and communications. These vendors process data only on our behalf and under
                  confidentiality obligations.
                </li>
                <li>
                  <strong>Legal requirements</strong> — we may disclose data if required by law, court order,
                  or governmental authority.
                </li>
                <li>
                  <strong>Business transfers</strong> — in the event of a merger, acquisition, or sale, your
                  data may be transferred to the successor entity.
                </li>
              </ul>
            </Section>

            <Section title="6. Cookies and Tracking">
              <p>We use cookies and similar technologies to:</p>
              <ul>
                <li>Keep you logged in and remember your preferences.</li>
                <li>Analyse platform usage and improve user experience.</li>
                <li>Measure the effectiveness of our communications.</li>
              </ul>
              <p>
                You can control cookie settings through your browser. Disabling certain cookies may affect
                platform functionality.
              </p>
            </Section>

            <Section title="7. Data Retention">
              <p>
                We retain personal data for as long as necessary to provide our services and comply with legal
                obligations. Account data is retained while your account is active. Verification documents may
                be retained for up to 5 years in accordance with anti-money laundering regulations. You may
                request deletion of your data at any time (subject to legal retention requirements).
              </p>
            </Section>

            <Section title="8. Your Rights">
              <p>Depending on your jurisdiction, you may have the following rights:</p>
              <ul>
                <li>
                  <strong>Access</strong> — request a copy of the personal data we hold about you.
                </li>
                <li>
                  <strong>Correction</strong> — request correction of inaccurate or incomplete data.
                </li>
                <li>
                  <strong>Deletion</strong> — request erasure of your data, subject to legal retention
                  obligations.
                </li>
                <li>
                  <strong>Portability</strong> — receive your data in a structured, machine-readable format.
                </li>
                <li>
                  <strong>Objection</strong> — object to processing based on legitimate interests.
                </li>
                <li>
                  <strong>Withdraw consent</strong> — withdraw consent for optional processing at any time.
                </li>
              </ul>
              <p>
                To exercise your rights, contact us at{" "}
                <a href="mailto:hello@qosvanta.com" style={{ color: "#3B82F6" }}>
                  hello@qosvanta.com
                </a>
                .
              </p>
            </Section>

            <Section title="9. Security">
              <p>
                We implement appropriate technical and organisational measures to protect your data against
                unauthorised access, loss, or disclosure. These include encrypted data transmission (TLS),
                access controls, and regular security reviews. However, no system is entirely secure, and we
                cannot guarantee absolute security.
              </p>
            </Section>

            <Section title="10. International Transfers">
              <p>
                Your data may be processed in countries outside your jurisdiction. Where data is transferred
                internationally, we ensure appropriate safeguards are in place, such as standard contractual
                clauses or adequacy decisions.
              </p>
            </Section>

            <Section title="11. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. We will notify registered users of
                material changes via email or platform notification. The updated policy will be effective upon
                posting with a revised "Last updated" date.
              </p>
            </Section>

            <Section title="12. Contact Us">
              <p>If you have any questions or requests regarding this Privacy Policy, please contact us:</p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:hello@qosvanta.com" style={{ color: "#3B82F6" }}>
                  hello@qosvanta.com
                </a>
                <br />
                <strong>Telegram:</strong>{" "}
                <a
                  href="https://t.me/damir_qosvantabot"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#3B82F6" }}
                >
                  @damir_qosvantabot
                </a>
              </p>
            </Section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="text-lg font-bold mb-4"
        style={{ color: "#0F172A", letterSpacing: "-0.01em" }}
      >
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5" style={{ color: "#475569" }}>
        {children}
      </div>
    </div>
  );
}
