# AI Startup Course

A full-stack interactive course platform for aspiring founders. Students follow course missions, chat with a mission-specific AI mentor, and submit artifact links for review.

## Tech stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, SQLAlchemy (async), PostgreSQL, Alembic |
| AI | Gemini API (streaming chat via SSE) |
| Frontend | Next.js 15, React Query, Tailwind CSS |
| Auth | JWT (python-jose) |

## Project structure

```
.
├── backend/
│   ├── app/
│   │   ├── content/modules_seed.py   # active mission tracking definitions
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   ├── routers/                  # FastAPI route handlers
│   │   ├── schemas/                  # Pydantic schemas
│   │   ├── services/                 # chat, Gemini client
│   │   └── seed.py                   # idempotent DB seeder
│   ├── alembic/                      # DB migrations
│   ├── requirements.txt
│   └── .env.example                  # copy to .env and fill in
├── frontend/
│   ├── app/                          # Next.js app router pages
│   ├── components/                   # React components
│   ├── lib/                          # API client, course content, types, utilities
│   └── .env.local.example            # copy to .env.local and fill in
└── start.sh                          # boots backend + frontend
```

## Local setup

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL running locally

### 1. Backend

```bash
cd backend
cp .env.example .env          # fill in DATABASE_URL, JWT_SECRET, GEMINI_API_KEY
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python -m app.seed
```

### 2. Frontend

```bash
cd frontend
cp .env.local.example .env.local    # set NEXT_PUBLIC_API_URL if needed
npm install
```

### 3. Run everything

```bash
# from the repo root
bash start.sh
```

Backend runs on `http://localhost:8000`, frontend on `http://localhost:3000`.

## Adding or editing course content

Edit display content such as section copy, resource links, YouTube IDs, and artifact labels in `frontend/lib/course.ts`.

Edit backend tracking definitions such as active mission slugs and submission field validation in `backend/app/content/modules_seed.py`, then re-run the seeder:

```bash
cd backend && python -m app.seed
```

The seeder is idempotent for active missions and does not delete archived module rows or user data. Add an optional `due_at` datetime to a mission spec to enable Telegram deadline reminders for that mission.

## Telegram setup

1. Create a bot with BotFather and set `TELEGRAM_BOT_TOKEN`.
2. Set `TELEGRAM_BOT_USERNAME` to the bot username without `@` so the dashboard can open the bot link.
3. Set `TELEGRAM_WEBHOOK_SECRET` to a random secret.
4. Set `TELEGRAM_WEBHOOK_URL` to your public backend URL plus `/telegram/webhook`.
5. Fill module `due_at` values when you are ready for reminders. Null deadlines do not send reminders.

## Environment variables

### backend/.env

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL async DSN (`postgresql+asyncpg://...`) |
| `JWT_SECRET` | Random secret for signing JWTs — generate with `python -c "import secrets; print(secrets.token_urlsafe(48))"` |
| `GEMINI_API_KEY` | Your Gemini API key |
| `GEMINI_MODEL` | Model name, default `gemini-3.5-flash-lite` |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot API token from BotFather |
| `TELEGRAM_BOT_USERNAME` | Bot username without `@`, used for dashboard deep links |
| `TELEGRAM_WEBHOOK_SECRET` | Secret checked against Telegram webhook requests |
| `TELEGRAM_WEBHOOK_URL` | Public webhook URL, e.g. `https://api.example.com/telegram/webhook` |
| `TELEGRAM_LINK_CODE_TTL_MINUTES` | Link-code lifetime in minutes, default `15` |
| `TELEGRAM_REMINDER_INTERVAL_SECONDS` | Reminder loop interval, default `300` |
| `CORS_ORIGINS` | Comma-separated allowed origins, e.g. `http://localhost:3000` |

### frontend/.env.local

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL, e.g. `http://localhost:8000` |
