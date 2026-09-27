from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import GeneratedOutput, ReviewRecord, AuditLog, User
from schemas import ReviewCreate, ReviewRecordResponse, GeneratedOutputResponse
from typing import List
import datetime

router = APIRouter(prefix="/reviews", tags=["Human Review & Approval"])

@router.get("/pending", response_model=List[GeneratedOutputResponse])
def get_pending_reviews(db: Session = Depends(get_db)):
    return db.query(GeneratedOutput).filter(GeneratedOutput.status == "PENDING_REVIEW").order_by(GeneratedOutput.created_at.desc()).all()

@router.post("/{output_id}", response_model=GeneratedOutputResponse)
def submit_review(output_id: int, payload: ReviewCreate, db: Session = Depends(get_db)):
    output = db.query(GeneratedOutput).filter(GeneratedOutput.id == output_id).first()
    if not output:
        raise HTTPException(status_code=404, detail="Output not found")

    first_user = db.query(User).filter(User.role.in_(["Reviewer", "Admin"])).first() or db.query(User).first()
    reviewer_id = first_user.id if first_user else 1
    reviewer_name = first_user.full_name if first_user else "Senior Approver"

    # Process action
    if payload.action == "APPROVE":
        output.status = "APPROVED"
        output.reviewer_notes = payload.feedback_text or "Verified and approved for distribution."
    elif payload.action == "REQUEST_CHANGES":
        output.status = "CHANGES_REQUESTED"
        output.reviewer_notes = payload.feedback_text or "Revisions requested by reviewer."
    elif payload.action == "EDIT":
        if payload.modified_content:
            output.content_markdown = payload.modified_content
            output.version += 1
        output.status = "APPROVED"
        output.reviewer_notes = payload.feedback_text or "Edited and approved by reviewer."

    output.updated_at = datetime.datetime.utcnow()

    # Record review log
    review = ReviewRecord(
        output_id=output.id,
        reviewer_id=reviewer_id,
        action=payload.action,
        factual_check_passed=payload.factual_check_passed,
        tone_check_passed=payload.tone_check_passed,
        safety_check_passed=payload.safety_check_passed,
        feedback_text=payload.feedback_text
    )
    db.add(review)

    # Record Audit Log
    audit = AuditLog(
        action=f"REVIEW_{payload.action}",
        actor_id=reviewer_id,
        actor_name=reviewer_name,
        role="Senior Reviewer",
        resource_type="OUTPUT",
        resource_id=str(output.id),
        details=f"Output #{output.id} ({output.format_type}) reviewed with action {payload.action}. Score checks: Fact={payload.factual_check_passed}, Tone={payload.tone_check_passed}, Safety={payload.safety_check_passed}.",
        ip_address="10.14.0.24 (GovNet Terminal)",
        clearance_level="TOP SECRET" if payload.action == "APPROVE" else "SECRET"
    )
    db.add(audit)

    db.commit()
    db.refresh(output)

    return output

@router.get("/output/{output_id}", response_model=List[ReviewRecordResponse])
def get_output_reviews(output_id: int, db: Session = Depends(get_db)):
    return db.query(ReviewRecord).filter(ReviewRecord.output_id == output_id).order_by(ReviewRecord.reviewed_at.desc()).all()
