import { NextRequest, NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/ratelimit";

const MAX_FIELD = 500;

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rl = rateLimit(req, "match:1m", 3, 60);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }
  const rlDay = rateLimit(req, "match:1d", 20, 86400);
  if (!rlDay.ok) {
    return NextResponse.json(
      { error: "Daily limit reached" },
      { status: 429, headers: { "Retry-After": String(rlDay.retryAfter) } },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // Honeypot — silently accept to avoid signaling bots that we filter
  const honeypot = String(body.hp_company ?? "").trim();
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const business_type = String(body.business_type ?? "").trim();
  const target_geo = String(body.target_geo ?? "").trim();
  const monthly_volume = String(body.monthly_volume ?? "").trim();
  const payment_types = String(body.payment_types ?? "").trim();
  const contact_email = String(body.contact_email ?? "").trim();

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!contact_email || !EMAIL_RE.test(contact_email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  for (const v of [business_type, target_geo, monthly_volume, payment_types, contact_email]) {
    if (v.length > MAX_FIELD) {
      return NextResponse.json({ error: "Field too long" }, { status: 413 });
    }
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const line = (label: string, value: string) =>
      value ? `\n${label} <b>${esc(value)}</b>` : "";

    const text =
      `🎯 <b>New match request</b>\n` +
      `\n📧 <b>Email:</b> ${esc(contact_email)}` +
      line("🏢 Business:", business_type) +
      line("🌍 Geo:", target_geo) +
      line("💰 Volume:", monthly_volume) +
      line("💳 Methods:", payment_types);

    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });
      if (!tgRes.ok && process.env.NODE_ENV !== "production") {
        console.error("Telegram sendMessage failed:", tgRes.status);
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Telegram sendMessage threw:", (e as Error)?.message);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
