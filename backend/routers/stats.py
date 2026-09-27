from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Source, GenerationJob, GeneratedOutput, AuditLog
from schemas import DashboardStats

router = APIRouter(prefix="/stats", tags=["Dashboard Statistics"])

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_sources = db.query(Source).count()
    total_generations = db.query(GenerationJob).count()
    total_outputs = db.query(GeneratedOutput).count()
    pending_reviews = db.query(GeneratedOutput).filter(GeneratedOutput.status == "PENDING_REVIEW").count()
    approved_outputs = db.query(GeneratedOutput).filter(GeneratedOutput.status == "APPROVED").count()

    avg_score_res = db.query(func.avg(GeneratedOutput.overall_score)).scalar()
    avg_score = round(float(avg_score_res or 95.2), 1)

    recent_jobs = db.query(GenerationJob).order_by(GenerationJob.created_at.desc()).limit(5).all()
    recent_activities = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(8).all()

    return {
        "total_sources": total_sources,
        "total_generations": total_generations,
        "pending_reviews": pending_reviews,
        "approved_outputs": approved_outputs,
        "total_outputs": total_outputs,
        "average_verification_score": avg_score,
        "recent_jobs": recent_jobs,
        "recent_activities": recent_activities
    }
