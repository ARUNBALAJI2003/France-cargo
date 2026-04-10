from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import init_db
from auth.router import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup."""
    await init_db()
    print("✅ Database tables created")
    yield
    print("👋 Shutting down")


app = FastAPI(
    title="France Cargo API",
    version="1.0.0",
    description="Backend API for France Cargo logistics platform",
    lifespan=lifespan,
)

# CORS — allow your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",       # React (CRA)
        "http://localhost:5173",       # React (Vite)
        settings.FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount authentication routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])


@app.get("/")
async def root():
    return {"message": "France Cargo API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "france-cargo-api"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
