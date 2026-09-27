import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ACTIS - Automated Content Transformation & Intelligence System"
    PROJECT_CODE: str = "PS 26154"
    ORGANIZATION: str = "National Technical Research Organisation (NTRO)"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "actis-ntro-sih2026-supersecret-auth-key-secure-token")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Defaults to SQLite locally; can be switched to PostgreSQL with DATABASE_URL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./actis.db"
    )
    
    # AI Engine settings
    AI_MODE: str = os.getenv("AI_MODE", "mock_high_fidelity")  # "mock_high_fidelity" or "gemini" / "openai"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
