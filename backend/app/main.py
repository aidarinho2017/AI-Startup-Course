import asyncio
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, chat, dashboard, instructor, modules, profile, submissions, telegram
from app.services.reminders import run_deadline_reminder_loop
from app.services.telegram_service import configure_webhook


@asynccontextmanager
async def lifespan(app: FastAPI):
    reminder_task: asyncio.Task | None = None
    await configure_webhook()
    if settings.TELEGRAM_BOT_TOKEN:
        reminder_task = asyncio.create_task(run_deadline_reminder_loop())
    try:
        yield
    finally:
        if reminder_task:
            reminder_task.cancel()
            with suppress(asyncio.CancelledError):
                await reminder_task


app = FastAPI(title="AI Startup Course", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(modules.router, prefix="/modules", tags=["modules"])
app.include_router(submissions.router, prefix="/modules", tags=["submissions"])
app.include_router(chat.router, prefix="/modules", tags=["chat"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
app.include_router(instructor.router, prefix="/instructor", tags=["instructor"])
app.include_router(profile.router, tags=["profile"])
app.include_router(telegram.router, prefix="/telegram", tags=["telegram"])
