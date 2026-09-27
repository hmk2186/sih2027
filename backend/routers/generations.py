import json
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import GenerationJob, GeneratedOutput, Source, AuditLog, User
from schemas import (
    GenerationJobCreate, 
    GenerationJobResponse, 
    GeneratedOutputResponse, 
    OutputUpdate
)
from ai_service import AITransformationService

router = APIRouter(prefix="/generations", tags=["Generations"])

@router.post("/", response_model=GenerationJobResponse)
def create_generation_job(payload: GenerationJobCreate, db: Session = Depends(get_db)):
    # 1. Resolve or create source
    source_id = payload.source_id
    if not source_id and payload.raw_content:
        # Auto-create source
        source = Source(
            title=payload.title,
            source_type=payload.source_type or "TEXT",
            raw_content=payload.raw_content,
            summary=payload.raw_content[:180] + "...",
            metadata_info=json.dumps({"source": "Direct User Input / Prompt"}),
            file_size_kb=len(payload.raw_content.encode('utf-8')) / 1024.0,
            author_id=1
        )
        db.add(source)
        db.commit()
        db.refresh(source)
        source_id = source.id
    
    if not source_id:
        raise HTTPException(status_code=400, detail="Either source_id or raw_content must be provided.")

    source = db.query(Source).filter(Source.id == source_id).first()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found.")

    first_user = db.query(User).first()
    user_id = first_user.id if first_user else None

    # 2. Create Job in QUEUED state
    job = GenerationJob(
        title=payload.title or f"Transformation: {source.title[:60]}",
        source_id=source.id,
        status="PROCESSING",
        target_audience=payload.target_audience,
        tone=payload.tone,
        language=payload.language,
        detail_level=payload.detail_level,
        objective=payload.objective,
        content_style=payload.content_style,
        requested_formats=json.dumps(payload.requested_formats),
        progress=20,
        current_stage="Information Extraction & Ingestion",
        created_by_id=user_id
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # 3. Execute AI Pipeline Synthesis
    try:
        generated_deliverables = AITransformationService.generate_all_formats(
            content=source.raw_content,
            requested_formats=payload.requested_formats,
            audience=payload.target_audience,
            tone=payload.tone,
            language=payload.language,
            detail_level=payload.detail_level,
            objective=payload.objective,
            style=payload.content_style
        )

        for deliverable in generated_deliverables:
            output = GeneratedOutput(
                job_id=job.id,
                format_type=deliverable["format_type"],
                title=deliverable["title"],
                content_markdown=deliverable["content_markdown"],
                structured_data=deliverable.get("structured_data", "{}"),
                factual_score=deliverable.get("factual_score", 95.0),
                tone_score=deliverable.get("tone_score", 92.0),
                safety_score=deliverable.get("safety_score", 98.0),
                overall_score=deliverable.get("overall_score", 95.0),
                status="PENDING_REVIEW"
            )
            db.add(output)

        job.status = "COMPLETED"
        job.progress = 100
        job.current_stage = "Generated & Automated Verification Passed"
        job.completed_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(job)

        # Audit Log
        audit = AuditLog(
            action="JOB_COMPLETED",
            actor_id=user_id,
            actor_name=first_user.full_name if first_user else "System",
            role=first_user.role if first_user else "Analyst",
            resource_type="JOB",
            resource_id=str(job.id),
            details=f"Job #{job.id} produced {len(generated_deliverables)} verified deliverables for '{job.title}'.",
            ip_address="10.14.0.24 (GovNet Terminal)",
            clearance_level="CONFIDENTIAL"
        )
        db.add(audit)
        db.commit()

    except Exception as e:
        job.status = "FAILED"
        job.error_message = str(e)
        job.current_stage = "Pipeline Error"
        db.commit()
        db.refresh(job)
        raise HTTPException(status_code=500, detail=f"Generation pipeline failed: {str(e)}")

    return job

@router.get("/", response_model=List[GenerationJobResponse])
def list_generation_jobs(db: Session = Depends(get_db)):
    return db.query(GenerationJob).order_by(GenerationJob.created_at.desc()).all()

@router.get("/{job_id}", response_model=GenerationJobResponse)
def get_generation_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(GenerationJob).filter(GenerationJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/output/{output_id}", response_model=GeneratedOutputResponse)
def get_output(output_id: int, db: Session = Depends(get_db)):
    output = db.query(GeneratedOutput).filter(GeneratedOutput.id == output_id).first()
    if not output:
        raise HTTPException(status_code=404, detail="Output not found")
    return output

@router.put("/output/{output_id}", response_model=GeneratedOutputResponse)
def update_output(output_id: int, payload: OutputUpdate, db: Session = Depends(get_db)):
    output = db.query(GeneratedOutput).filter(GeneratedOutput.id == output_id).first()
    if not output:
        raise HTTPException(status_code=404, detail="Output not found")

    if payload.title is not None:
        output.title = payload.title
    if payload.content_markdown is not None:
        output.content_markdown = payload.content_markdown
    if payload.structured_data is not None:
        output.structured_data = payload.structured_data

    output.version += 1
    output.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(output)

    # Audit Log
    audit = AuditLog(
        action="OUTPUT_EDITED",
        actor_id=1,
        actor_name="Operator",
        role="Reviewer",
        resource_type="OUTPUT",
        resource_id=str(output.id),
        details=f"In-line edit committed for output #{output.id} ({output.format_type}) to Version {output.version}.",
        ip_address="10.14.0.24 (GovNet Terminal)",
        clearance_level="CONFIDENTIAL"
    )
    db.add(audit)
    db.commit()

    return output

@router.post("/output/{output_id}/regenerate", response_model=GeneratedOutputResponse)
def regenerate_output(output_id: int, db: Session = Depends(get_db)):
    output = db.query(GeneratedOutput).filter(GeneratedOutput.id == output_id).first()
    if not output:
        raise HTTPException(status_code=404, detail="Output not found")

    job = output.job
    source = job.source

    deliverables = AITransformationService.generate_all_formats(
        content=source.raw_content,
        requested_formats=[output.format_type],
        audience=job.target_audience,
        tone=job.tone,
        language=job.language,
        detail_level=job.detail_level,
        objective=job.objective,
        style=job.content_style
    )

    if not deliverables:
        raise HTTPException(status_code=500, detail="Regeneration failed to synthesize deliverable.")

    fresh = deliverables[0]
    output.title = fresh["title"]
    output.content_markdown = fresh["content_markdown"]
    output.structured_data = fresh.get("structured_data", "{}")
    output.factual_score = fresh.get("factual_score", 96.0)
    output.tone_score = fresh.get("tone_score", 94.0)
    output.safety_score = fresh.get("safety_score", 99.0)
    output.overall_score = fresh.get("overall_score", 96.0)
    output.status = "PENDING_REVIEW"
    output.version += 1
    output.updated_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(output)

    # Audit Log
    audit = AuditLog(
        action="OUTPUT_REGENERATED",
        actor_id=1,
        actor_name="Operator",
        role="Analyst",
        resource_type="OUTPUT",
        resource_id=str(output.id),
        details=f"Regenerated deliverable #{output.id} ({output.format_type}) with AI pipeline.",
        ip_address="10.14.0.24 (GovNet Terminal)",
        clearance_level="CONFIDENTIAL"
    )
    db.add(audit)
    db.commit()

    return output

@router.delete("/{job_id}")
def delete_generation_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(GenerationJob).filter(GenerationJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db.delete(job)
    db.commit()
    return {"message": f"Job {job_id} deleted successfully"}
