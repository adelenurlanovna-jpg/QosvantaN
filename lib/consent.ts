// Cookie / tracking consent helpers. Client-side only.
//
// Categories:
//   - essential: always on (auth cookies, CSRF). Not asked.
//   - analytics: opt-in. Required before Vercel Analytics is mounted.
//
// Storage: localStorage. Versioned so we can re-ask if the schema changes.

export type Consent = {
  v: 1;
  analytics: boolean;
  ts: string;
};

const STORAGE_KEY = "qosvanta_consent_v1";
export const CONSENT_EVENT = "qosvanta:consent-change";

export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    if (parsed?.v !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setConsent(next: Omit<Consent, "v" | "ts">): void {
  if (typeof window === "undefined") return;
  const payload: Consent = { v: 1, analytics: !!next.analytics, ts: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: payload }));
  } catch {
    /* ignore */
  }
}
