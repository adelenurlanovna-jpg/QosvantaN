# Qosvanta

A global marketplace and directory of payment providers across fiat, crypto, high-risk and local payment rails. Merchants describe what they need to an AI consultant ("Damir"), Damir submits an application, managers follow up via Telegram.

Live: [qosvanta.vercel.app](https://qosvanta.vercel.app)

## Stack

- **Web** — Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4
- **Database & Auth** — Supabase (PostgreSQL + Google OAuth + Magic Link)
- **AI consultant** — Anthropic Claude (`/api/chat`)
- **Notifications** — Telegram Bot API (manager group)
- **Telegram bot** — Python + aiogram (`telegram_bot/`, separate runtime)
- **Auto-scraper** — Gemini API + Google Search grounding (`scripts/scrape_processors.py`, daily cron)
- **Hosting** — Vercel (web) + Railway (Telegram bot)

## Project layout

```
app/                   Next.js App Router pages and API routes
  api/
    chat/              AI consultant endpoint
    contact/           Contact form → Telegram
    match/             "Get matched" form → Telegram
    partners/          Provider listing application → Telegram
    admin/review/      Admin approval queue (RLS-protected)
  auth/callback/       Supabase OAuth callback
  search/              Provider catalog with URL-param filters
components/            React components (Header, Footer, ChatWidget, forms)
lib/
  supabase/            Server and client Supabase factories
  security/            Rate limit, CSRF (same-origin check), audit log, honeypot
supabase/migrations/   SQL migrations (run via run_migrations.mjs)
telegram_bot/          Independent Python bot (aiogram + SQLite)
scripts/               Python auto-scraper for payment processors
public/                Static assets (logos, og-image, favicon)
```

## Local development

### Prerequisites

- Node 20+ and npm
- A Supabase project (free tier works)
- Anthropic API key
- Telegram bot token + manager chat ID

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in your keys
cp .env.example .env.local

# 3. Run database migrations
node run_migrations.mjs

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

### Telegram bot (optional, runs separately)

```bash
cd telegram_bot
cp .env.example .env
# Fill in BOT_TOKEN, ANTHROPIC_API_KEY, MANAGER_CHAT_ID
pip install -r requirements.txt  # or use uv
python main.py
```

### Auto-scraper (optional, scheduled via GitHub Actions)

The daily scraper in `scripts/scrape_processors.py` enriches the database with new payment providers using Gemini + Google Search grounding. Configure `GEMINI_API_KEY` and `SUPABASE_SERVICE_KEY` as GitHub Actions secrets — see `.github/workflows/scrape-processors.yml`.

## Environment variables

See [`.env.example`](.env.example) for the full list. In short:

| Variable | Required for |
|----------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` | All Supabase access |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin operations |
| `ANTHROPIC_API_KEY` | `/api/chat` (Damir) |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Notification routes |
| `GEMINI_API_KEY` | Auto-scraper only |

## Security notes

- All form endpoints use a same-origin CSRF check, honeypot field, and per-IP rate limiting.
- Admin endpoints verify Supabase session and `profiles.is_admin` flag, with audit logging.
- The in-memory rate limiter is per-serverless-instance — a hardened deployment should swap it for Upstash KV.
- `robots.txt` blocks `/api/`, `/auth/`, `/login` from indexing.

## License

MIT — see [LICENSE](LICENSE).
