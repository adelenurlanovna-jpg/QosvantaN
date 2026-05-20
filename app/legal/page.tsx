import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Legal Notices — Qosvanta",
  description: "Legal disclaimers and notices for the Qosvanta payment provider marketplace.",
};

export default function LegalPage() {
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
              Legal Notices
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
            <Section title="General Disclaimer">
              <p>
                Qosvanta operates as a payment provider directory and marketplace. We aggregate and present
                information about payment solution providers to help businesses with their research and
                discovery process.
              </p>
              <p>
                All content, listings, and information published on qosvanta.com are provided for
                informational purposes only. Qosvanta does not provide payment processing services, financial
                intermediation, or regulated financial services of any kind.
              </p>
            </Section>

            <Section title="Not Financial or Regulatory Advice">
              <p>
                Nothing on this Platform should be construed as financial, legal, investment, compliance, or
                regulatory advice. Provider listings, fee comparisons, compliance notes, and market data are
                published solely to assist businesses in their research.
              </p>
              <p>
                Payment regulations, licensing requirements, and provider terms vary significantly by
                jurisdiction and business type. You are solely responsible for assessing whether a payment
                provider is appropriate and lawful for your specific use case, geography, and industry.
                Qosvanta strongly recommends consulting qualified legal and financial advisors before entering
                into any payment arrangements.
              </p>
            </Section>

            <Section title="No Endorsement of Listed Providers">
              <p>
                The presence of a payment provider on Qosvanta's platform does not constitute an endorsement,
                recommendation, or guarantee by Qosvanta. Providers are listed based on available information
                and may include providers that are not suitable for all business types.
              </p>
              <p>
                Verification badges indicate that a provider has submitted documentation for our review
                process. This does not constitute regulatory approval, licensing confirmation, or a guarantee
                of service quality, reliability, or financial stability.
              </p>
              <p>
                You should independently verify all provider information, including licensing status,
                regulatory standing, fee structures, and service terms before entering into any commercial
                relationship.
              </p>
            </Section>

            <Section title="Accuracy of Information">
              <p>
                While we endeavour to keep provider information accurate and up to date, Qosvanta makes no
                representations or warranties regarding the completeness, accuracy, reliability, or
                currentness of any information on the Platform.
              </p>
              <p>
                Fee rates, supported markets, accepted industries, settlement timelines, and currency
                coverage are subject to change at any time without notice. Provider details are maintained on
                a best-efforts basis and may not reflect the most recent terms offered by any individual
                provider.
              </p>
            </Section>

            <Section title="Limitation of Liability">
              <p>
                To the fullest extent permitted by applicable law, Qosvanta, its team, affiliates, and
                service providers shall not be liable for any loss, damage, or harm arising from:
              </p>
              <ul>
                <li>Reliance on any information published on the Platform.</li>
                <li>Decisions made based on provider listings, comparisons, or matching results.</li>
                <li>
                  Any transaction, agreement, or commercial relationship entered into with a payment provider
                  discovered through the Platform.
                </li>
                <li>Interruptions, errors, or unavailability of the Platform.</li>
                <li>Unauthorised access to or alteration of your data.</li>
              </ul>
              <p>
                This limitation applies to all types of damages — direct, indirect, incidental,
                consequential, or punitive — regardless of the theory of liability.
              </p>
            </Section>

            <Section title="Third-Party Providers and External Links">
              <p>
                The Platform contains information about, and links to, third-party payment providers and
                external websites. Qosvanta has no control over, and accepts no responsibility for, the
                accuracy, content, policies, or practices of any third party.
              </p>
              <p>
                Any interaction with a payment provider — including onboarding, contract signing, data
                submission, and payment processing — occurs directly between you and the provider. Qosvanta
                is not a party to any such arrangement and bears no liability for outcomes.
              </p>
            </Section>

            <Section title="Compliance and Regulatory Responsibility">
              <p>
                Users of the Qosvanta Platform are solely responsible for ensuring that their use of payment
                providers complies with all applicable laws and regulations in their jurisdiction, including
                but not limited to anti-money laundering (AML) regulations, know-your-customer (KYC)
                requirements, data protection laws, and financial services licensing requirements.
              </p>
              <p>
                Qosvanta's compliance review process and access tiers are designed to support responsible use
                of the Platform. They do not substitute for independent legal and regulatory assessments.
              </p>
            </Section>

            <Section title="Intellectual Property">
              <p>
                All content, trademarks, logos, data compilations, and proprietary methodologies on the
                Platform are the intellectual property of Qosvanta or its licensors. Unauthorised
                reproduction, distribution, or commercial use of Platform content is strictly prohibited.
              </p>
            </Section>

            <Section title="Governing Law and Jurisdiction">
              <p>
                These legal notices and your use of the Platform are governed by applicable law. Any disputes
                shall be addressed in accordance with our Terms of Use.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                For legal inquiries, please contact us at:
              </p>
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
