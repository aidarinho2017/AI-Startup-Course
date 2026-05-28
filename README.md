# AI Startup Course

A full-stack interactive course platform for aspiring founders. Students watch curated YC videos, chat with a module-specific AI mentor, and submit homework assignments per module.

## Tech stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, SQLAlchemy (async), PostgreSQL, Alembic |
| AI | OpenAI API (streaming chat via SSE) |
| Frontend | Next.js 15, React Query, Tailwind CSS |
| Auth | JWT (python-jose) |

## Project structure

```
.
├── backend/
│   ├── app/
│   │   ├── content/modules_seed.py   # module & video definitions
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   ├── routers/                  # FastAPI route handlers
│   │   ├── schemas/                  # Pydantic schemas
│   │   ├── services/                 # chat, OpenAI client
│   │   └── seed.py                   # idempotent DB seeder
│   ├── alembic/                      # DB migrations
│   ├── requirements.txt
│   └── .env.example                  # copy to .env and fill in
├── frontend/
│   ├── app/                          # Next.js app router pages
│   ├── components/                   # React components
│   ├── lib/                          # API client, types, utilities
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
cp .env.example .env          # fill in DATABASE_URL, JWT_SECRET, OPENAI_API_KEY
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

## Adding or editing module content

Edit `backend/app/content/modules_seed.py`, then re-run the seeder:

```bash
cd backend && python -m app.seed
```

The seeder is idempotent — it adds new videos and removes ones no longer in the spec without touching user data.

## Environment variables

### backend/.env

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL async DSN (`postgresql+asyncpg://...`) |
| `JWT_SECRET` | Random secret for signing JWTs — generate with `python -c "import secrets; print(secrets.token_urlsafe(48))"` |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `OPENAI_MODEL` | Model name, e.g. `gpt-4o-mini` |
| `CORS_ORIGINS` | Comma-separated allowed origins, e.g. `http://localhost:3000` |

### frontend/.env.local

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL, e.g. `http://localhost:8000` |
