from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.settings import router as settings_router
from app.db.init import init_db
import os

app = FastAPI(
    title="Settings Management API",
    description="API for managing arbitrary JSON configuration data",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(settings_router, prefix="/api", tags=["settings"])

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Settings Management API",
        "docs": "/docs",
        "health": "/health"
    }