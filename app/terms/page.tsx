import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Use — Qosvanta",
  description: "Terms and conditions for using the Qosvanta payment provider marketplace.",
};

export default function TermsPage() {
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
              Terms of Use
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
            <Section title="1. Acceptance of Terms">
              <p>
                By accessing or using the Qosvanta platform at qosvanta.com ("Platform"), you agree to be
                bound by these Terms of Use ("Terms"). If you do not agree to these Terms, please do not use
                the Platform.
              </p>
              <p>
                These Terms apply to all visitors, registered users, and businesses ("Users") who access or
                use any part of the Platform.
              </p>
            </Section>

            <Section title="2. Description of Service">
              <p>
                Qosvanta is a global payment provider directory and marketplace. We provide tools and
                information to help businesses discover, research, compare, and connect with payment solution
                providers, including fiat payment processors, crypto rails, local payment methods, and related
                financial technology services.
              </p>
              <p>
                Qosvanta acts as a neutral information and connection intermediary. We are not a payment
                processor, financial institution, or licensed payment service provider. We do not process
                payments, hold funds, or provide regulated financial services.
              </p>
            </Section>

            <Section title="3. Eligibility">
              <p>To use the Platform, you must:</p>
              <ul>
                <li>Be at least 18 years of age.</li>
                <li>
                  Represent a legitimate business entity or operate as an individual entrepreneur in a
                  jurisdiction where such use is lawful.
                </li>
                <li>
                  Have the authority to accept these Terms on behalf of your organisation, if registering as a
                  company.
                </li>
                <li>Not be prohibited from using the Platform under applicable law.</li>
              </ul>
            </Section>

            <Section title="4. Account Registration">
              <p>
                Certain features of the Platform require account registration. You agree to provide accurate,
                complete, and up-to-date information and to keep your account credentials confidential. You
                are responsible for all activity that occurs under your account.
              </p>
              <p>
                We reserve the right to suspend or terminate accounts that provide false information or
                violate these Terms.
              </p>
            </Section>

            <Section title="5. Use of the Platform">
              <p>You may use the Platform only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul>
                <li>
                  Use the Platform for any fraudulent, deceptive, or illegal activity, including money
                  laundering, terrorist financing, or sanctions evasion.
                </li>
                <li>
                  Attempt to circumvent our verification or compliance processes.
                </li>
                <li>
                  Scrape, crawl, or systematically extract data from the Platform without written permission.
                </li>
                <li>
                  Interfere with the integrity or performance of the Platform or its infrastructure.
                </li>
                <li>
                  Misrepresent your identity, business type, or processing volumes.
                </li>
                <li>
                  Use information obtained from the Platform to spam, harass, or contact providers in an
                  unsolicited manner outside the platform's intended flow.
                </li>
              </ul>
            </Section>

            <Section title="6. No Financial or Legal Advice">
              <p>
                All information provided on the Platform — including provider listings, fee data, compliance
                notes, and market reports — is for informational and research purposes only.
              </p>
              <p>
                Nothing on the Platform constitutes financial, legal, investment, or regulatory advice.
                Provider information may not be complete, current, or applicable to your specific situation.
                You should conduct your own due diligence and consult qualified professionals before entering
                into any agreements with payment providers.
              </p>
              <p>
                Qosvanta does not endorse, recommend, or guarantee any payment provider listed on the
                Platform.
              </p>
            </Section>

            <Section title="7. Provider Listings and Accuracy">
              <p>
                Provider information is collected from public sources, provider submissions, and our research
                team. While we make reasonable efforts to keep information accurate and up to date, we do not
                warrant the completeness, accuracy, or timeliness of any listing.
              </p>
              <p>
                Fee rates, supported currencies, coverage areas, and compliance requirements are subject to
                change. Always verify current terms directly with the provider before committing to any
                arrangement.
              </p>
            </Section>

            <Section title="8. Provider Matching Service">
              <p>
                Our provider matching service is offered as a facilitation tool. We connect businesses with
                potentially relevant providers based on stated requirements. We make no guarantees regarding
                the suitability, availability, or approval of any provider for your specific business. Final
                terms are always negotiated directly between you and the provider.
              </p>
            </Section>

            <Section title="9. Intellectual Property">
              <p>
                All content on the Platform — including text, graphics, logos, data compilations, and
                software — is owned by or licensed to Qosvanta and is protected by intellectual property
                laws.
              </p>
              <p>
                You may use Platform content for personal, non-commercial research purposes. Any reproduction,
                redistribution, or commercial use without our written consent is prohibited.
              </p>
            </Section>

            <Section title="10. Third-Party Links">
              <p>
                The Platform may contain links to third-party websites, including payment provider websites.
                We have no control over, and accept no responsibility for, the content, privacy practices, or
                conduct of third-party sites. Accessing third-party links is at your own risk.
              </p>
            </Section>

            <Section title="11. Limitation of Liability">
              <p>
                To the maximum extent permitted by applicable law, Qosvanta and its team members shall not be
                liable for any indirect, incidental, special, consequential, or punitive damages arising from
                your use of, or inability to use, the Platform — including damages resulting from reliance on
                provider information, failed transactions, or business losses.
              </p>
              <p>
                Our total liability to you for any claim shall not exceed the amount you paid to us in the
                12 months preceding the claim, or USD 100 if no payment was made.
              </p>
            </Section>

            <Section title="12. Disclaimer of Warranties">
              <p>
                The Platform is provided "as is" and "as available" without warranties of any kind, either
                express or implied, including but not limited to warranties of merchantability, fitness for a
                particular purpose, or non-infringement.
              </p>
              <p>
                We do not warrant that the Platform will be uninterrupted, error-free, or free of harmful
                components.
              </p>
            </Section>

            <Section title="13. Termination">
              <p>
                We reserve the right to suspend or terminate your access to the Platform at any time, with or
                without notice, if you violate these Terms or if we determine that continued access poses a
                risk to other users or our platform.
              </p>
              <p>
                You may close your account at any time by contacting us. Upon termination, your right to use
                the Platform ceases immediately.
              </p>
            </Section>

            <Section title="14. Governing Law">
              <p>
                These Terms are governed by and construed in accordance with applicable law. Any disputes
                arising from these Terms or your use of the Platform shall be resolved through good-faith
                negotiation. If resolution is not possible, disputes shall be submitted to competent courts of
                the jurisdiction in which Qosvanta is established.
              </p>
            </Section>

            <Section title="15. Changes to Terms">
              <p>
                We may update these Terms from time to time. We will notify registered users of material
                changes. Continued use of the Platform after the updated Terms become effective constitutes
                your acceptance of the new Terms.
              </p>
            </Section>

            <Section title="16. Contact Us">
              <p>If you have questions about these Terms, please contact us:</p>
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
