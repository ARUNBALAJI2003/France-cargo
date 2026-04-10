from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import User, get_db
from auth.schemas import (
    UserRegister,
    UserLogin,
    GoogleAuthCallback,
    AuthResponse,
)
from auth.service import register_user, login_user, google_auth_user
from auth.google_oauth import exchange_code_for_tokens, get_google_user_info
from auth.jwt_handler import get_current_user

router = APIRouter()


@router.post("/register", response_model=AuthResponse)
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    """Register a new user with name, email and password."""
    try:
        return await register_user(db, data.name, data.email, data.password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=AuthResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate with email and password."""
    try:
        return await login_user(db, data.email, data.password)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/google/callback", response_model=AuthResponse)
async def google_callback(
    data: GoogleAuthCallback, db: AsyncSession = Depends(get_db)
):
    """
    Google OAuth 2.0 callback.

    Receives the authorization code from the frontend popup,
    exchanges it for tokens server-side (keeping client_secret safe),
    fetches the user's Google profile, and returns a JWT.
    """
    try:
        # Step 1: Exchange authorization code for tokens
        tokens = await exchange_code_for_tokens(data.code, data.redirect_uri)

        # Step 2: Fetch user info from Google using the access token
        google_user = await get_google_user_info(tokens["access_token"])

        # Step 3: Find or create user in our database, return JWT
        return await google_auth_user(db, google_user)

    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Google authentication failed: {str(e)}"
        )


@router.get("/me")
async def get_me(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the currently authenticated user's profile."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
        "picture": user.picture,
        "auth_provider": user.auth_provider,
    }
