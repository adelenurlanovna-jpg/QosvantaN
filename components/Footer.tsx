import Link from "next/link";

const cols = [
  {
    title: "Marketplace",
    links: [
      { label: "All providers", href: "/search" },
      { label: "Card acquiring", href: "/search?method=card_acquiring" },
      { label: "Crypto rails", href: "/search?segment=high_risk_crypto" },
      { label: "Local methods", href: "/search?method=local_apm" },
      { label: "Bank transfers", href: "/search?method=bank_transfer" },
      { label: "High-risk solutions", href: "/search?segment=high_risk_fiat" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "For merchants", href: "/search" },
      { label: "High-risk businesses", href: "/solutions/high-risk-payment-providers" },
      { label: "Crypto gateways", href: "/solutions/crypto-payment-gateways" },
      { label: "Business providers", href: "/solutions/business-payment-providers" },
      { label: "Alternative methods", href: "/solutions/alternative-payment-methods" },
      { label: "For providers", href: "/partners" },
    ],
  },
  {
    title: "Get in touch",
    links: [
      { label: "Talk to Damir", href: "#open-chat" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Partners", href: "/partners" },
      { label: "Legal", href: "/legal" },
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms of use", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "rgba(15,23,42,0.08)", background: "#08111F" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4" aria-label="Qosvanta — home">
              <img
                src="/logo-icon.png"
                alt="Qosvanta"
                width={512}
                height={512}
                style={{ width: "44px", height: "44px", display: "block", borderRadius: "10px" }}
              />
              <span className="flex flex-col leading-tight">
                <span className="font-semibold text-base" style={{ color: "#F1F5F9" }}>Qosvanta</span>
                <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#5B6E89" }}>
                  One platform. Every option.
                </span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed mb-6 max-w-[180px]" style={{ color: "#475569" }}>
              Global payment provider directory. Find, compare and connect with the right payment solutions.
            </p>
            <div className="flex gap-2">
              <a
                href="mailto:hello@qosvanta.com"
                className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:text-white"
                style={{ background: "rgba(255,255,255,0.05)", color: "#475569", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                Email
              </a>
              <a
                href="https://t.me/damir_qosvantabot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:text-white"
                style={{ background: "rgba(255,255,255,0.05)", color: "#475569", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                Telegram
              </a>
            </div>
          </div>

          {/* Nav cols */}
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#334155" }}>
                {col.title}
              </p>
              <ul className="space-y-1 sm:space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs transition-colors hover:text-white inline-block py-1.5 sm:py-0"
                      style={{ color: "#475569" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-14 pt-6 border-t text-xs"
          style={{ borderColor: "rgba(255,255,255,0.06)", color: "#334155" }}
        >
          <p>© {new Date().getFullYear()} Qosvanta. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/legal" className="hover:text-white transition-colors">Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
