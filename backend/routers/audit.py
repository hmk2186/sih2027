from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models import AuditLog
from schemas import AuditLogResponse
from typing import List, Optional

router = APIRouter(prefix="/audit", tags=["Audit Logs"])

@router.get("/", response_model=List[AuditLogResponse])
def get_audit_logs(
    action: Optional[str] = None,
    resource_type: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    query = db.query(AuditLog)
    if action:
        query = query.filter(AuditLog.action.ilike(f"%{action}%"))
    if resource_type:
        query = query.filter(AuditLog.resource_type == resource_type)

    return query.order_by(AuditLog.timestamp.desc()).limit(limit).all()

@router.get("/export")
def export_audit_trail(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()
    output_lines = [
        "================================================================================",
        "NATIONAL TECHNICAL RESEARCH ORGANISATION (NTRO) - ACTIS AUDIT TRAIL EXPORT",
        "SYSTEM: ACTIS PS 26154 | CLASSIFICATION: OFFICIAL USE ONLY // AUDIT EVIDENCE",
        "================================================================================",
        ""
    ]
    for log in logs:
        ts = log.timestamp.strftime("%Y-%m-%d %H:%M:%S UTC")
        output_lines.append(f"[{ts}] [{log.clearance_level}] ACTOR: {log.actor_name} ({log.role}) | ACTION: {log.action} | RESOURCE: {log.resource_type}#{log.resource_id} | IP: {log.ip_address}")
        output_lines.append(f"   DETAILS: {log.details}")
        output_lines.append("--------------------------------------------------------------------------------")
    
    return {
        "export_format": "PLAIN_TEXT",
        "record_count": len(logs),
        "content": "\n".join(output_lines)
    }
