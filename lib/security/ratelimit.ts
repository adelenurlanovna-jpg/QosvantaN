import { NextRequest } from "next/server";

// In-memory sliding-window rate limiter. Per-instance only — on Vercel
// serverless each warm instance keeps its own state, which is acceptable as a
// first line of defense against scripted abuse. For stronger guarantees move
// to Upstash/Vercel KV.

type Bucket = { times: number[] };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

function getIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "anon";
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfter: number };

export function rateLimit(
  req: NextRequest,
  scope: string,
  limit: number,
  windowSeconds: number,
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const key = `${scope}:${getIp(req)}`;

  // Lazy GC: if map overflows, drop oldest half. Cheap protection against
  // unbounded memory growth from spray attacks across many IPs.
  if (buckets.size > MAX_BUCKETS) {
    const keys = Array.from(buckets.keys()).slice(0, Math.floor(MAX_BUCKETS / 2));
    for (const k of keys) buckets.delete(k);
  }

  const bucket = buckets.get(key) ?? { times: [] };
  bucket.times = bucket.times.filter((t) => now - t < windowMs);

  if (bucket.times.length >= limit) {
    const oldest = bucket.times[0]!;
    const retryAfter = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    buckets.set(key, bucket);
    return { ok: false, retryAfter };
  }

  bucket.times.push(now);
  buckets.set(key, bucket);
  return { ok: true };
}
