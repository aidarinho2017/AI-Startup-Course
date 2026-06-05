import logging
from time import perf_counter

from fastapi import APIRouter, HTTPException, status
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from sqlalchemy import select

from app.config import settings
from app.deps import CurrentUser, DbSession
from app.models import User
from app.schemas.auth import (
    GoogleAuthRequest,
    LoginRequest,
    SignupRequest,
    TokenResponse,
    UserOut,
)
from app.services.security import create_access_token, hash_password, verify_password

router = APIRouter()
logger = logging.getLogger("uvicorn.error")


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(body: SignupRequest, db: DbSession) -> TokenResponse:
    existing = await db.scalar(select(User).where(User.email == body.email.lower()))
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )
    user = User(
        email=body.email.lower(),
        password_hash=hash_password(body.password),
        name=body.name,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: DbSession) -> TokenResponse:
    total_start = perf_counter()
    db_start = perf_counter()
    user = await db.scalar(select(User).where(User.email == body.email.lower()))
    db_seconds = perf_counter() - db_start

    verify_seconds = 0.0
    password_ok = False
    if user is not None and user.password_hash:
        verify_start = perf_counter()
        password_ok = verify_password(body.password, user.password_hash)
        verify_seconds = perf_counter() - verify_start

    logger.info(
        "auth.login timing db_lookup_seconds=%.3f password_verify_seconds=%.3f total_seconds=%.3f user_found=%s",
        db_seconds,
        verify_seconds,
        perf_counter() - total_start,
        user is not None,
    )

    if user is None or not user.password_hash or not password_ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )
    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/google", response_model=TokenResponse)
async def google_auth(body: GoogleAuthRequest, db: DbSession) -> TokenResponse:
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=501, detail="Google login is not configured")
    try:
        idinfo = id_token.verify_oauth2_token(
            body.credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token")

    google_id = idinfo["sub"]
    email = idinfo["email"].lower()
    name = idinfo.get("name") or email.split("@")[0]

    user = await db.scalar(select(User).where(User.google_id == google_id))
    if user is None:
        user = await db.scalar(select(User).where(User.email == email))
        if user is not None:
            user.google_id = google_id
        else:
            user = User(email=email, name=name, google_id=google_id)
            db.add(user)

    await db.commit()
    await db.refresh(user)
    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
async def me(user: CurrentUser) -> UserOut:
    return UserOut.model_validate(user)
