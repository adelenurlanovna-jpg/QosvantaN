import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { isSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/ratelimit";

type SegmentSlug = "business" | "high_risk_fiat" | "high_risk_crypto" | "alternative_dark";

const SEGMENT_LABELS: Record<SegmentSlug, string> = {
  business: "Business",
  high_risk_fiat: "High Risk Fiat",
  high_risk_crypto: "High Risk Crypto",
  alternative_dark: "Alternative / Dark",
};

const MAX_SHORT = 500;
const MAX_DESC = 4000;

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rl = rateLimit(req, "partners:1m", 3, 60);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }
  const rlDay = rateLimit(req, "partners:1d", 10, 86400);
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

  // Honeypot
  const honeypot = String((body as Record<string, unknown>).hp_company ?? "").trim();
  if (honeypot) {
    return NextResponse.json({ ok: true, id: null });
  }

  const company_name = String(body.company_name ?? "").trim();
  const website_url = String(body.website_url ?? "").trim();
  const segment_slug = (body.segment_slug ?? null) as SegmentSlug | null;
  const contact_name = String(body.contact_name ?? "").trim() || null;
  const contact_email = String(body.contact_email ?? "").trim();
  const contact_telegram = String(body.contact_telegram ?? "").trim() || null;
  const description = String(body.description ?? "").trim() || null;

  if (!company_name || !website_url || !contact_email) {
    return NextResponse.json(
      { error: "Please fill in company name, website and email" },
      { status: 400 }
    );
  }

  if (segment_slug && !(segment_slug in SEGMENT_LABELS)) {
    return NextResponse.json({ error: "Unknown segment" }, { status: 400 });
  }

  for (const v of [company_name, website_url, contact_email, contact_name, contact_telegram]) {
    if (v && v.length > MAX_SHORT) {
      return NextResponse.json({ error: "Field too long" }, { status: 413 });
    }
  }
  if (description && description.length > MAX_DESC) {
    return NextResponse.json({ error: "Description too long" }, { status: 413 });
  }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
  const { data, error } = await supabase
    .from("provider_applications")
    .insert({
      company_name,
      website_url,
      segment_slug,
      contact_name,
      contact_email,
      contact_telegram,
      description,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not save your application" }, { status: 500 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const segmentLine = segment_slug ? `\n🏷 <b>Segment:</b> ${esc(SEGMENT_LABELS[segment_slug])}` : "";
    const tgLine = contact_telegram ? `\n💬 <b>Telegram:</b> ${esc(contact_telegram)}` : "";
    const nameLine = contact_name ? `\n👤 <b>Contact:</b> ${esc(contact_name)}` : "";
    const descLine = description ? `\n\n📝 <b>About:</b>\n${esc(description)}` : "";

    const text =
      `🤝 <b>New provider application</b>\n\n` +
      `🏢 <b>Company:</b> ${esc(company_name)}\n` +
      `🌐 <b>Website:</b> ${esc(website_url)}` +
      segmentLine +
      nameLine +
      `\n📧 <b>Email:</b> ${esc(contact_email)}` +
      tgLine +
      descLine;

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

  return NextResponse.json({ ok: true, id: data.id });
}
