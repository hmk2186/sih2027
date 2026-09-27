import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import engine, Base
from seed_data import init_db_and_seed

from routers.auth import router as auth_router
from routers.sources import router as sources_router
from routers.generations import router as generations_router
from routers.reviews import router as reviews_router
from routers.audit import router as audit_router
from routers.stats import router as stats_router

# Create DB tables & seed initial data
Base.metadata.create_all(bind=engine)
try:
    init_db_and_seed()
except Exception as e:
    print(f"[STARTUP] Seeding check: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ACTIS Backend API - Automated Content Transformation & Intelligence System for NTRO (SIH 2026 PS 26154)",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development & hackathon demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(sources_router, prefix=settings.API_V1_STR)
app.include_router(generations_router, prefix=settings.API_V1_STR)
app.include_router(reviews_router, prefix=settings.API_V1_STR)
app.include_router(audit_router, prefix=settings.API_V1_STR)
app.include_router(stats_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "system": "ACTIS - Automated Content Transformation & Intelligence System",
        "organization": settings.ORGANIZATION,
        "problem_statement": settings.PROJECT_CODE,
        "status": "OPERATIONAL",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "database": "CONNECTED",
        "ai_engine": "ACTIVE"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
