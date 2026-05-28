#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "==> AI Startup Course — booting backend + frontend"
echo "    Root: $ROOT"

# --- Backend -----------------------------------------------------------------
cd "$ROOT/backend"

if [ ! -d .venv ]; then
  echo "==> Creating Python virtualenv"
  python3 -m venv .venv
fi

# shellcheck disable=SC1091
source .venv/bin/activate

echo "==> Installing backend deps"
pip install -q --upgrade pip
pip install -q -r requirements.txt

if [ ! -f .env ]; then
  echo "==> Copying backend .env.example -> .env (edit it before continuing)"
  cp .env.example .env
fi

echo "==> Running migrations"
alembic upgrade head

echo "==> Seeding modules"
python -m app.seed

echo "==> Starting FastAPI on :8000"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACK_PID=$!

cleanup() {
  echo
  echo "==> Stopping backend (pid $BACK_PID)"
  kill "$BACK_PID" 2>/dev/null || true
  wait "$BACK_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# --- Frontend ----------------------------------------------------------------
cd "$ROOT/frontend"

if [ ! -f .env.local ]; then
  echo "==> Copying frontend .env.local.example -> .env.local"
  cp .env.local.example .env.local
fi

if [ ! -d node_modules ]; then
  echo "==> Installing frontend deps"
  # React 19 RC + @tanstack/react-query needs legacy-peer-deps
  npm install --legacy-peer-deps
fi

echo "==> Starting Next.js on :3000"
npm run dev
