"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { CONSENT_EVENT, getConsent, type Consent } from "@/lib/consent";

export default function AnalyticsConsentGate() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!!getConsent()?.analytics);
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<Consent>).detail;
      setEnabled(!!detail?.analytics);
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!enabled) return null;
  return <Analytics />;
}
