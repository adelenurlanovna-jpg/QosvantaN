"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/consent";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  const acceptAll = () => {
    setConsent({ analytics: true });
    setVisible(false);
  };

  const rejectAll = () => {
    setConsent({ analytics: false });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-50 rounded-2xl p-4 sm:p-5"
      style={{
        background: "linear-gradient(135deg, #0D0F1E, #1a1d35)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      }}
    >
      <div className="flex items-start gap-3">
        <div className="text-xl shrink-0">🍪</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold mb-1.5" style={{ color: "#F1F5F9" }}>
            Cookies & privacy
          </p>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "#94A3B8" }}>
            We use <b>essential cookies</b> for sign-in and security. With your permission, we also
            use privacy-friendly <b>analytics</b> (Vercel Analytics) to understand how the site is
            used. No ads, no third-party tracking. See our{" "}
            <a href="/privacy-policy" className="underline" style={{ color: "#C9A84C" }}>
              Privacy Policy
            </a>
            .
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={acceptAll}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E2C97E)", color: "#07081C" }}
            >
              Accept all
            </button>
            <button
              onClick={rejectAll}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
              style={{ color: "#CBD5E1", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              Reject non-essential
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
