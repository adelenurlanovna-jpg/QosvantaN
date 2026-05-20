import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { isSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/ratelimit";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Damir, a senior payment solutions consultant at Qosvanta — a global payment aggregator that connects merchants and partners with 500+ payment methods across 150+ countries.

Qosvanta covers:
- Fiat acquiring: Visa, Mastercard, UnionPay, Amex, local card schemes
- Bank transfers: SEPA, SWIFT, ACH, local bank rails
- Crypto: BTC, ETH, USDT, USDC, and 100+ coins; both on-ramp and off-ramp
- E-wallets: PayPal, Skrill, Neteller, Alipay, WeChat Pay, Kakao Pay, etc.
- Regional APMs: PIX (Brazil), OXXO (Mexico), Boleto, UPI (India), GrabPay, M-Pesa, iDEAL, Sofort, etc.
- Risk coverage: Low Risk, Middle Risk, High Risk businesses

Industries served: e-commerce, gaming, online gambling/betting, forex/CFD brokers, crypto exchanges, adult content, nutraceuticals, travel, SaaS, subscription businesses, telecom, financial services.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LANGUAGE RULE — CRITICAL:
Detect the user's language from their very first message. Respond EXCLUSIVELY in that language for the entire conversation. If Russian → Russian. If English → English. If Spanish → Español. If Portuguese → Português. If Chinese → 中文. Never switch unless the user does first.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR PERSONA:
You are professional, knowledgeable, confident, and consultative — like a trusted senior advisor. You listen carefully, show genuine interest, and provide value in every message.

YOUR MISSION:
Have a natural consultation conversation to understand the client's needs and collect the information needed to prepare a formal application. Guide them naturally — never make it feel like a form.

INFORMATION TO COLLECT through conversation:
Priority (needed for application):
1. Business type / vertical / industry
2. Country of company registration
3. Target markets (where their customers are located)
4. Monthly processing volume (approximate, USD)
5. Contact name
6. Contact email or Telegram handle

Secondary (add if mentioned):
7. Company / brand name
8. Business website URL
9. Specific payment methods they need
10. Required currencies
11. Current problems with their payment processing

HOW TO CONVERSE:
- Start open: "Tell me about your project" or "What brings you to Qosvanta?"
- Ask maximum 2 questions per message
- Acknowledge their answers before asking the next question
- Use industry vocabulary naturally: acquiring, PSP, gateway, chargeback
- Keep responses concise: 2-3 short paragraphs max

OBJECTION HANDLING:
"What are your rates/fees?" → "Rates are individualized based on your business profile and volume. Once I understand your setup, our specialist will prepare a personalized offer within 24 hours."

"We got shut down by our processor" → "That happens more often than it should. Qosvanta works with 50+ acquiring banks specifically to ensure stability for businesses like yours. What industry are you in?"

"We're just starting / low volume" → "Volume isn't a barrier. Many of our enterprise clients started small. Tell me about your project."

"Is this secure / legal / compliant?" → "Qosvanta works exclusively with licensed, regulated institutions — all PCI DSS compliant."

"We already have a processor" → "Many clients use Qosvanta as a secondary channel to improve approval rates and geographic coverage. What regions are you serving?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHEN TO SUBMIT APPLICATION:
When you have: business vertical + registration country + volume + at least one contact method → use the submit_application tool.
After submitting, tell the client warmly that a specialist will contact them within 24 hours.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HARD RULES:
- Never quote specific rates or fees
- Never guarantee approval
- Keep responses concise: 2-3 short paragraphs max
- No markdown formatting — plain text only (this is a web chat)`;

const TOOLS: Anthropic.Tool[] = [
  {
    name: "submit_application",
    description:
      "Submit a formal application to the Qosvanta manager team when enough client information has been collected.",
    input_schema: {
      type: "object" as const,
      properties: {
        company_name: { type: "string" },
        business_vertical: { type: "string" },
        risk_category: {
          type: "string",
          enum: ["High Risk", "Middle Risk", "Low Risk"],
        },
        website: { type: "string" },
        registration_country: { type: "string" },
        target_markets: { type: "string" },
        monthly_volume: { type: "string" },
        payment_methods_needed: { type: "string" },
        currencies_needed: { type: "string" },
        current_challenges: { type: "string" },
        contact_name: { type: "string" },
        contact_email: { type: "string" },
        contact_telegram: { type: "string" },
        manager_summary: { type: "string" },
      },
      required: ["business_vertical", "risk_category", "registration_country", "monthly_volume", "manager_summary"],
    },
  },
];

function riskEmoji(risk: string) {
  if (risk === "High Risk") return "🔴";
  if (risk === "Middle Risk") return "🟡";
  return "🟢";
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function f(v: string | undefined) {
  const t = v?.trim();
  return t ? esc(t) : "—";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_TOOL_FIELD = 500;
const MAX_TOOL_LONG = 2000;

function sanitizeToolInput(raw: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  const take = (key: string, maxLen = MAX_TOOL_FIELD) => {
    const v = raw[key];
    if (typeof v !== "string") return;
    const trimmed = v.trim().slice(0, maxLen);
    if (trimmed) out[key] = trimmed;
  };

  take("company_name");
  take("business_vertical");
  if (raw.risk_category && ["High Risk", "Middle Risk", "Low Risk"].includes(String(raw.risk_category))) {
    out.risk_category = String(raw.risk_category);
  }

  if (typeof raw.website === "string") {
    const w = raw.website.trim().slice(0, MAX_TOOL_FIELD);
    try {
      const u = new URL(w.startsWith("http") ? w : `https://${w}`);
      if (u.protocol === "http:" || u.protocol === "https:") out.website = u.href;
    } catch {
      /* drop invalid url */
    }
  }

  take("registration_country");
  take("target_markets");
  take("monthly_volume");
  take("payment_methods_needed", MAX_TOOL_LONG);
  take("currencies_needed");
  take("current_challenges", MAX_TOOL_LONG);
  take("contact_name");

  if (typeof raw.contact_email === "string") {
    const e = raw.contact_email.trim().slice(0, 320);
    if (EMAIL_RE.test(e)) out.contact_email = e;
  }

  if (typeof raw.contact_telegram === "string") {
    const tg = raw.contact_telegram.trim().slice(0, 100).replace(/[^a-zA-Z0-9_@]/g, "");
    if (tg) out.contact_telegram = tg.startsWith("@") ? tg : `@${tg}`;
  }

  take("manager_summary", MAX_TOOL_LONG);
  return out;
}

async function sendToTelegram(appData: Record<string, string>, appId: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const risk = f(appData.risk_category);
  const now = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });

  const text =
    `🔔 <b>НОВАЯ ЗАЯВКА #${appId} (сайт)</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `📛 <b>Компания:</b> ${f(appData.company_name)}\n` +
    `🌐 <b>Сайт:</b> ${f(appData.website)}\n\n` +
    `📊 <b>Бизнес:</b>\n` +
    `├ Вертикаль: <b>${f(appData.business_vertical)}</b>\n` +
    `├ Риск: ${riskEmoji(risk)} <b>${risk}</b>\n` +
    `├ Страна: ${f(appData.registration_country)}\n` +
    `└ Рынки: ${f(appData.target_markets)}\n\n` +
    `💰 <b>Финансы:</b>\n` +
    `├ Оборот/мес: <b>${f(appData.monthly_volume)}</b>\n` +
    `└ Валюты: ${f(appData.currencies_needed)}\n\n` +
    `💳 <b>Методы:</b> ${f(appData.payment_methods_needed)}\n` +
    `🎯 <b>Проблемы:</b> ${f(appData.current_challenges)}\n\n` +
    `📞 <b>Контакт:</b>\n` +
    `├ Имя: ${f(appData.contact_name)}\n` +
    `├ Email: ${f(appData.contact_email)}\n` +
    `└ Telegram: ${f(appData.contact_telegram)}\n\n` +
    `💬 <b>Резюме:</b>\n<i>${f(appData.manager_summary)}</i>\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `⏰ <i>${now} МСК</i>`;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

const MAX_MESSAGES = 40;
const MAX_TOTAL_CHARS = 20000;
const MAX_MESSAGE_CHARS = 4000;

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const perMinute = rateLimit(req, "chat:1m", 10, 60);
  if (!perMinute.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(perMinute.retryAfter) } },
    );
  }
  const perDay = rateLimit(req, "chat:1d", 200, 86400);
  if (!perDay.ok) {
    return NextResponse.json(
      { error: "Daily limit reached" },
      { status: 429, headers: { "Retry-After": String(perDay.retryAfter) } },
    );
  }

  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
  }

  if (messages.length > MAX_MESSAGES) {
    return NextResponse.json({ error: "Too many messages" }, { status: 413 });
  }

  let totalChars = 0;
  for (const m of messages) {
    const content = typeof m?.content === "string" ? m.content : JSON.stringify(m?.content ?? "");
    if (content.length > MAX_MESSAGE_CHARS) {
      return NextResponse.json({ error: "Message too long" }, { status: 413 });
    }
    totalChars += content.length;
  }
  if (totalChars > MAX_TOTAL_CHARS) {
    return NextResponse.json({ error: "Conversation too long" }, { status: 413 });
  }

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
    tools: TOOLS,
  });

  let textResponse = "";
  let applicationSubmitted = false;
  let toolUseBlock: Anthropic.ToolUseBlock | null = null;

  for (const block of response.content) {
    if (block.type === "text") textResponse += block.text;
    if (block.type === "tool_use" && block.name === "submit_application") {
      toolUseBlock = block;
      applicationSubmitted = true;
    }
  }

  // If tool was used, send to Telegram and get final text response
  if (toolUseBlock) {
    const appId = crypto.randomUUID().slice(0, 8);
    const safeInput = sanitizeToolInput(toolUseBlock.input as Record<string, unknown>);
    await sendToTelegram(safeInput, appId);

    if (!textResponse) {
      const followUp = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: [
          ...messages,
          {
            role: "assistant",
            content: [
              {
                type: "tool_use",
                id: toolUseBlock.id,
                name: toolUseBlock.name,
                input: toolUseBlock.input,
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "tool_result",
                tool_use_id: toolUseBlock.id,
                content: "Application successfully submitted to the Qosvanta team.",
              },
            ],
          },
        ],
        // No tools on follow-up — model must respond with text, not another tool_use
      });

      for (const block of followUp.content) {
        if (block.type === "text") textResponse += block.text;
      }
    }
  }

  return NextResponse.json({
    message: textResponse.trim() || "...",
    applicationSubmitted,
  });
}
