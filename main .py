"""
France Cargo - FastAPI Backend with Google OAuth 2.0
====================================================

PROJECT STRUCTURE:
    france-cargo-backend/
    ├── main.py                 ← THIS FILE (entry point)
    ├── config.py               ← Settings & environment vars
    ├── database.py             ← Database connection & models
    ├── auth/
    │   ├── __init__.py
    │   ├── router.py           ← Auth endpoints
    │   ├── schemas.py          ← Pydantic models
    │   ├── service.py          ← Business logic
    │   ├── google_oauth.py     ← Google OAuth 2.0 handler
    │   └── jwt_handler.py      ← JWT token creation/verification
    ├── requirements.txt
    ├── .env.example
    └── alembic/ (optional)     ← DB migrations

SETUP:
    1. pip install -r requirements.txt
    2. Copy .env.example → .env and fill in values
    3. uvicorn main:app --reload --port 8000
"""

# ──────────────────────────────────────────────────────────
# main.py
# ──────────────────────────────────────────────────────────
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# In production, import from separate modules:
# from auth.router import router as auth_router
# from config import settings
# from database import engine, Base

app = FastAPI(
    title="France Cargo API",
    version="1.0.0",
    description="Backend API for France Cargo logistics platform"
)

# CORS — allow your React frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",    # React dev server
        "http://localhost:5173",    # Vite dev server
        "https://francecargo.com", # Production domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount auth routes
# app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "france-cargo-api"}


# ──────────────────────────────────────────────────────────
# config.py
# ──────────────────────────────────────────────────────────
"""
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost:5432/francecargo"

    # JWT
    JWT_SECRET_KEY: str = "your-super-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Google OAuth 2.0
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    # App
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

settings = Settings()
"""


# ──────────────────────────────────────────────────────────
# database.py
# ──────────────────────────────────────────────────────────
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

# User model
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=True)  # Null for OAuth-only users
    picture = Column(String, nullable=True)
    auth_provider = Column(String, default="email")   # "email" or "google"
    google_id = Column(String, unique=True, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

async def get_db():
    async with async_session() as session:
        yield session

# Create tables on startup
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
"""


# ──────────────────────────────────────────────────────────
# auth/schemas.py
# ──────────────────────────────────────────────────────────
"""
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthCallback(BaseModel):
    code: str
    redirect_uri: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    auth_provider: str = "email"

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
"""


# ──────────────────────────────────────────────────────────
# auth/jwt_handler.py
# ──────────────────────────────────────────────────────────
"""
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config import settings

security = HTTPBearer()

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    return user_id
"""


# ──────────────────────────────────────────────────────────
# auth/google_oauth.py
# ──────────────────────────────────────────────────────────
"""
import httpx
from config import settings

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

async def exchange_code_for_tokens(code: str, redirect_uri: str) -> dict:
    '''
    Step 1: Exchange the authorization code for access & refresh tokens.
    This is the server-side part of the OAuth 2.0 Authorization Code flow.
    '''
    async with httpx.AsyncClient() as client:
        response = await client.post(GOOGLE_TOKEN_URL, data={
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        })

        if response.status_code != 200:
            raise Exception(f"Google token exchange failed: {response.text}")

        return response.json()
        # Returns: { access_token, refresh_token, id_token, expires_in, ... }

async def get_google_user_info(access_token: str) -> dict:
    '''
    Step 2: Use the access token to fetch the user's Google profile.
    '''
    async with httpx.AsyncClient() as client:
        response = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"}
        )

        if response.status_code != 200:
            raise Exception("Failed to fetch Google user info")

        return response.json()
        # Returns: { id, email, name, picture, verified_email, ... }
"""


# ──────────────────────────────────────────────────────────
# auth/service.py
# ──────────────────────────────────────────────────────────
"""
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import User
from auth.jwt_handler import create_access_token
from auth.schemas import UserResponse, AuthResponse

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

async def register_user(db: AsyncSession, name: str, email: str, password: str) -> AuthResponse:
    # Check if user exists
    existing = await db.execute(select(User).where(User.email == email))
    if existing.scalar_one_or_none():
        raise Exception("Email already registered")

    user = User(
        email=email,
        name=name,
        hashed_password=hash_password(password),
        auth_provider="email"
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email})

    return AuthResponse(
        access_token=token,
        user=UserResponse(
            id=str(user.id),
            email=user.email,
            name=user.name,
            auth_provider="email"
        )
    )

async def login_user(db: AsyncSession, email: str, password: str) -> AuthResponse:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user or not user.hashed_password:
        raise Exception("Invalid email or password")
    if not verify_password(password, user.hashed_password):
        raise Exception("Invalid email or password")

    token = create_access_token({"sub": str(user.id), "email": user.email})

    return AuthResponse(
        access_token=token,
        user=UserResponse(
            id=str(user.id),
            email=user.email,
            name=user.name,
            picture=user.picture,
            auth_provider=user.auth_provider
        )
    )

async def google_auth_user(db: AsyncSession, google_user: dict) -> AuthResponse:
    '''
    Find or create a user from Google profile data.
    If user exists with same email but signed up via email/password,
    link the Google account to that user.
    '''
    google_id = google_user["id"]
    email = google_user["email"]
    name = google_user.get("name", email.split("@")[0])
    picture = google_user.get("picture")

    # Check if user exists by google_id
    result = await db.execute(select(User).where(User.google_id == google_id))
    user = result.scalar_one_or_none()

    if not user:
        # Check by email (user may have registered with email first)
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if user:
            # Link Google account to existing user
            user.google_id = google_id
            user.picture = picture
            user.auth_provider = "google"
        else:
            # Create new user
            user = User(
                email=email,
                name=name,
                google_id=google_id,
                picture=picture,
                auth_provider="google"
            )
            db.add(user)

    await db.commit()
    await db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email})

    return AuthResponse(
        access_token=token,
        user=UserResponse(
            id=str(user.id),
            email=user.email,
            name=user.name,
            picture=user.picture,
            auth_provider=user.auth_provider
        )
    )
"""


# ──────────────────────────────────────────────────────────
# auth/router.py
# ──────────────────────────────────────────────────────────
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from auth.schemas import UserRegister, UserLogin, GoogleAuthCallback, AuthResponse
from auth.service import register_user, login_user, google_auth_user
from auth.google_oauth import exchange_code_for_tokens, get_google_user_info
from auth.jwt_handler import get_current_user

router = APIRouter()

@router.post("/register", response_model=AuthResponse)
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    try:
        return await register_user(db, data.name, data.email, data.password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=AuthResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    try:
        return await login_user(db, data.email, data.password)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/google/callback", response_model=AuthResponse)
async def google_callback(data: GoogleAuthCallback, db: AsyncSession = Depends(get_db)):
    '''
    Receives the authorization code from the frontend,
    exchanges it for tokens, fetches user info, and returns a JWT.
    '''
    try:
        # Step 1: Exchange code for tokens
        tokens = await exchange_code_for_tokens(data.code, data.redirect_uri)

        # Step 2: Get user info from Google
        google_user = await get_google_user_info(tokens["access_token"])

        # Step 3: Find or create user in our database
        return await google_auth_user(db, google_user)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Google auth failed: {str(e)}")

@router.get("/me")
async def get_me(user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    from database import User
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
        "picture": user.picture,
        "auth_provider": user.auth_provider
    }
"""


# ──────────────────────────────────────────────────────────
# OAuth callback page (served by frontend)
# Save as: public/auth/google/callback.html
# ──────────────────────────────────────────────────────────
OAUTH_CALLBACK_HTML = """
<!DOCTYPE html>
<html>
<head><title>Authenticating...</title></head>
<body>
<p>Signing you in...</p>
<script>
  // Extract the authorization code from the URL
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');

  if (code && window.opener) {
    // Send the code back to the parent window (your React app)
    window.opener.postMessage(
      { type: 'google-oauth-callback', code, state },
      window.location.origin
    );
    window.close();
  } else {
    document.body.innerHTML = '<p>Authentication failed. Please close this window and try again.</p>';
  }
</script>
</body>
</html>
"""


# ──────────────────────────────────────────────────────────
# requirements.txt
# ──────────────────────────────────────────────────────────
REQUIREMENTS = """
fastapi==0.115.0
uvicorn[standard]==0.30.0
sqlalchemy[asyncio]==2.0.35
asyncpg==0.30.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
httpx==0.27.0
pydantic[email]==2.9.0
pydantic-settings==2.5.0
python-dotenv==1.0.1
alembic==1.13.0
"""


# ──────────────────────────────────────────────────────────
# .env.example
# ──────────────────────────────────────────────────────────
ENV_EXAMPLE = """
# Database
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/francecargo

# JWT Secret (generate with: openssl rand -hex 32)
JWT_SECRET_KEY=change-this-to-a-random-64-char-hex-string
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Google OAuth 2.0 (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Frontend
FRONTEND_URL=http://localhost:3000
"""


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
