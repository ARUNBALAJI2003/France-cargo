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


async def register_user(
    db: AsyncSession, name: str, email: str, password: str
) -> AuthResponse:
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == email))
    if result.scalar_one_or_none():
        raise Exception("Email already registered")

    user = User(
        email=email,
        name=name,
        hashed_password=hash_password(password),
        auth_provider="email",
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
            auth_provider="email",
        ),
    )


async def login_user(
    db: AsyncSession, email: str, password: str
) -> AuthResponse:
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
            auth_provider=user.auth_provider,
        ),
    )


async def google_auth_user(
    db: AsyncSession, google_user: dict
) -> AuthResponse:
    """
    Find or create a user from Google profile data.
    If a user with the same email exists (registered via email/password),
    link the Google account to that existing user.
    """
    google_id = google_user["id"]
    email = google_user["email"]
    name = google_user.get("name", email.split("@")[0])
    picture = google_user.get("picture")

    # Check if user exists by google_id first
    result = await db.execute(select(User).where(User.google_id == google_id))
    user = result.scalar_one_or_none()

    if not user:
        # Check by email (user may have registered with email/password earlier)
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if user:
            # Link Google to existing account
            user.google_id = google_id
            user.picture = picture
            user.auth_provider = "google"
        else:
            # Brand new user
            user = User(
                email=email,
                name=name,
                google_id=google_id,
                picture=picture,
                auth_provider="google",
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
            auth_provider=user.auth_provider,
        ),
    )