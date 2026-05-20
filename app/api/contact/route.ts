import { NextRequest, NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/ratelimit";

const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_MESSAGE = 4000;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rl = rateLimit(req, "contact:1m", 3, 60);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }
  const rlDay = rateLimit(req, "contact:1d", 20, 86400);
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
  const honeypot = String(body.hp_company ?? "").trim();
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
  }

  if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: "Слишком длинный ввод" }, { status: 413 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({ error: "Бот не настроен" }, { status: 500 });
  }

  const text =
    `📬 <b>Новая заявка с PayMap</b>\n\n` +
    `👤 <b>Имя:</b> ${esc(name)}\n` +
    `📧 <b>Email:</b> ${esc(email)}\n\n` +
    `💬 <b>Сообщение:</b>\n${esc(message)}`;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Ошибка отправки" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
