import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import CookieNotice from "@/components/CookieNotice";
import AnalyticsConsentGate from "@/components/AnalyticsConsentGate";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Qosvanta — Payment Solutions Marketplace for Crypto, High-Risk & iGaming",
    template: "%s | Qosvanta",
  },
  description:
    "Compare 200+ payment providers across fiat, crypto and local methods. Curated catalog for high-risk merchants, iGaming, crypto businesses and standard e-commerce. Find your payment stack in minutes.",
  keywords: [
    "payment solutions",
    "payment provider marketplace",
    "high-risk payment providers",
    "iGaming payment gateway",
    "crypto payment gateway",
    "payment service provider directory",
    "compare payment processors",
    "high-risk crypto payment gateway",
    "local payment methods",
    "alternative payment rails",
  ],
  icons: { icon: "/logo-icon.png", apple: "/logo-icon.png" },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Qosvanta — Payment Solutions Marketplace",
    description:
      "Compare 200+ payment providers: crypto gateways, high-risk processors, iGaming acquirers, local methods (PIX, UPI, M-Pesa) and bank rails.",
    type: "website",
    url: SITE_URL,
    siteName: "Qosvanta",
    images: [{ url: "/logo-icon.png", width: 512, height: 512, alt: "Qosvanta — One platform. Every option." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qosvanta — Payment Solutions Marketplace",
    description:
      "Compare 200+ payment providers across crypto, high-risk, iGaming and local rails.",
    images: ["/logo-icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    google: "OgcgWzHR9o8a6rc_MMLeLHSt3dqkggDYRcfdGrGIk50",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Qosvanta",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-icon.png`,
  description:
    "Global marketplace and directory of payment providers across fiat, crypto, high-risk and local payment methods.",
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Qosvanta",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Suspense fallback={null}>{children}</Suspense>
        <ChatWidget />
        <CookieNotice />
        <AnalyticsConsentGate />
      </body>
    </html>
  );
}
