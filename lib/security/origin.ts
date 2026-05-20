import { NextRequest } from "next/server";

const ALLOWED_HOSTS = new Set<string>([
  "qosvanta.vercel.app",
  "qosvanta.com",
  "www.qosvanta.com",
  "localhost:3000",
  "127.0.0.1:3000",
]);

function extendWithEnv(set: Set<string>) {
  const fromEnv = process.env.ALLOWED_ORIGIN_HOSTS;
  if (fromEnv) {
    for (const h of fromEnv.split(",").map((s) => s.trim()).filter(Boolean)) {
      set.add(h);
    }
  }
  return set;
}

/**
 * Same-origin / CSRF guard. Returns true if the request appears to come from
 * a trusted origin. Strategy:
 *   - Origin or Referer must be present and its host must match the request
 *     host (or be in the allow-list). Requests with neither header are denied
 *     because they bypass browser-side CSRF protections (curl, scripts).
 *   - Server-to-server callers must authenticate via a dedicated mechanism
 *     (e.g. X-Internal-Token), not by omitting CSRF headers.
 */
export function isSameOrigin(req: NextRequest): boolean {
  const allowed = extendWithEnv(new Set(ALLOWED_HOSTS));
  const host = req.headers.get("host");
  if (host) allowed.add(host);

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  if (!origin && !referer) return false;

  const hostFromUrl = (raw: string | null) => {
    if (!raw) return null;
    try {
      return new URL(raw).host;
    } catch {
      return null;
    }
  };

  const oHost = hostFromUrl(origin);
  const rHost = hostFromUrl(referer);

  if (oHost && allowed.has(oHost)) return true;
  if (rHost && allowed.has(rHost)) return true;
  return false;
}
