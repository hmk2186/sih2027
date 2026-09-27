import json
import datetime
from database import engine, SessionLocal, Base
from models import User, Source, GenerationJob, GeneratedOutput, ReviewRecord, AuditLog
from ai_service import AITransformationService
from routers.sources import PRESET_SOURCES

def init_db_and_seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(User).count() > 0:
        print("[ACTIS SEED] Database already seeded.")
        db.close()
        return

    print("[ACTIS SEED] Seeding initial users...")
    users = [
        User(
            username="analyst",
            email="v.sethi@ntro.gov.in",
            hashed_password="hashed_secure_password_analyst",
            full_name="Dr. Vikram Sethi",
            role="Analyst",
            department="Cyber Threat Intelligence Wing",
            clearance_level="SECRET"
        ),
        User(
            username="reviewer",
            email="a.nair@ntro.gov.in",
            hashed_password="hashed_secure_password_reviewer",
            full_name="Col. Anita Nair",
            role="Reviewer",
            department="Strategic Operations Directorate",
            clearance_level="TOP SECRET"
        ),
        User(
            username="comms",
            email="m.sen@ntro.gov.in",
            hashed_password="hashed_secure_password_comms",
            full_name="Meera Sen",
            role="Communications Officer",
            department="Public Information & Inter-Agency Coordination",
            clearance_level="CONFIDENTIAL"
        ),
        User(
            username="admin",
            email="r.sharma@ntro.gov.in",
            hashed_password="hashed_secure_password_admin",
            full_name="Rajesh Sharma",
            role="Admin",
            department="NTRO Systems Architecture Desk",
            clearance_level="TOP SECRET"
        )
    ]
    for u in users:
        db.add(u)
    db.commit()

    print("[ACTIS SEED] Seeding initial intelligence sources...")
    saved_sources = []
    for preset in PRESET_SOURCES:
        src = Source(
            title=preset["title"],
            source_type=preset["source_type"],
            raw_content=preset["content"],
            summary=preset["summary"],
            metadata_info=json.dumps({"category": preset["category"], "classification": "RESTRICTED"}),
            file_name=f"{preset['id']}.pdf",
            file_size_kb=round(len(preset["content"].encode('utf-8')) / 1024.0, 1),
            author_id=1
        )
        db.add(src)
        saved_sources.append(src)
    db.commit()

    print("[ACTIS SEED] Generating initial demonstration jobs and outputs...")
    # Job 1: SCADA Advisory
    src1 = saved_sources[0]
    formats1 = ["SECURITY_ADVISORY", "EXECUTIVE_SUMMARY", "LINKEDIN_POST", "TWITTER_THREAD", "INFOGRAPHIC", "PRESENTATION", "VIDEO_PACKAGE"]
    
    job1 = GenerationJob(
        title=f"Transformation: {src1.title[:65]}",
        source_id=src1.id,
        status="COMPLETED",
        target_audience="Technical CERT / Defense",
        tone="Urgent & Authoritative",
        language="English",
        detail_level="Detailed Technical",
        objective="Threat Mitigation & Alert",
        content_style="NTRO Standard Directive",
        requested_formats=json.dumps(formats1),
        progress=100,
        current_stage="Generated & Automated Verification Passed",
        created_by_id=1,
        completed_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2)
    )
    db.add(job1)
    db.commit()
    db.refresh(job1)

    # Generate deliverables for Job 1
    deliverables1 = AITransformationService.generate_all_formats(
        content=src1.raw_content,
        requested_formats=formats1,
        audience=job1.target_audience,
        tone=job1.tone,
        language=job1.language,
        detail_level=job1.detail_level,
        objective=job1.objective,
        style=job1.content_style
    )

    outputs = []
    for i, d in enumerate(deliverables1):
        status = "APPROVED" if i < 3 else "PENDING_REVIEW"
        out = GeneratedOutput(
            job_id=job1.id,
            format_type=d["format_type"],
            title=d["title"],
            content_markdown=d["content_markdown"],
            structured_data=d.get("structured_data", "{}"),
            factual_score=d.get("factual_score", 96.2),
            tone_score=d.get("tone_score", 94.5),
            safety_score=d.get("safety_score", 98.8),
            overall_score=d.get("overall_score", 96.5),
            status=status,
            reviewer_notes="Verified against GovNet intelligence feeds." if status == "APPROVED" else None
        )
        db.add(out)
        outputs.append(out)
    db.commit()

    # Record review for the approved ones
    for out in outputs[:3]:
        rev = ReviewRecord(
            output_id=out.id,
            reviewer_id=2,
            action="APPROVE",
            factual_check_passed=True,
            tone_check_passed=True,
            safety_check_passed=True,
            feedback_text="Cleared by Col. Anita Nair for sovereign distribution."
        )
        db.add(rev)

    # Job 2: Quantum Roadmap
    src2 = saved_sources[2]
    formats2 = ["EXECUTIVE_SUMMARY", "LINKEDIN_POST", "PRESENTATION"]
    job2 = GenerationJob(
        title=f"Transformation: {src2.title[:65]}",
        source_id=src2.id,
        status="COMPLETED",
        target_audience="Executive Leadership & CISOs",
        tone="Strategic & Forward-Looking",
        language="English",
        detail_level="Executive Briefing",
        objective="Policy Dissemination",
        content_style="Government Whitepaper",
        requested_formats=json.dumps(formats2),
        progress=100,
        current_stage="Generated & Automated Verification Passed",
        created_by_id=3,
        completed_at=datetime.datetime.utcnow() - datetime.timedelta(hours=5)
    )
    db.add(job2)
    db.commit()
    db.refresh(job2)

    deliverables2 = AITransformationService.generate_all_formats(
        content=src2.raw_content,
        requested_formats=formats2,
        audience=job2.target_audience,
        tone=job2.tone,
        language=job2.language,
        detail_level=job2.detail_level,
        objective=job2.objective,
        style=job2.content_style
    )

    for d in deliverables2:
        out = GeneratedOutput(
            job_id=job2.id,
            format_type=d["format_type"],
            title=d["title"],
            content_markdown=d["content_markdown"],
            structured_data=d.get("structured_data", "{}"),
            factual_score=d.get("factual_score", 97.4),
            tone_score=d.get("tone_score", 95.1),
            safety_score=d.get("safety_score", 99.2),
            overall_score=d.get("overall_score", 97.2),
            status="APPROVED",
            reviewer_notes="Approved for inter-agency circulation."
        )
        db.add(out)
    db.commit()

    # Seed realistic Audit Trail
    audit_events = [
        AuditLog(
            action="SYSTEM_INITIALIZED",
            actor_id=4,
            actor_name="Rajesh Sharma",
            role="Admin",
            resource_type="SYSTEM",
            resource_id="CORE",
            details="ACTIS PS 26154 system kernel initialized with secure cryptographic hashes.",
            ip_address="10.14.0.1 (GovNet Gateway)",
            clearance_level="TOP SECRET",
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(hours=6)
        ),
        AuditLog(
            action="SOURCE_INGESTED",
            actor_id=1,
            actor_name="Dr. Vikram Sethi",
            role="Analyst",
            resource_type="SOURCE",
            resource_id="1",
            details="Ingested SCADA Zero-Day Advisory (2.4 KB telemetry payload).",
            ip_address="10.14.0.24 (GovNet Terminal)",
            clearance_level="SECRET",
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(hours=3)
        ),
        AuditLog(
            action="JOB_COMPLETED",
            actor_id=1,
            actor_name="Dr. Vikram Sethi",
            role="Analyst",
            resource_type="JOB",
            resource_id="1",
            details="Multi-format synthesis completed: 7 deliverables produced with 96.5% avg verification score.",
            ip_address="10.14.0.24 (GovNet Terminal)",
            clearance_level="SECRET",
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(hours=2)
        ),
        AuditLog(
            action="REVIEW_APPROVE",
            actor_id=2,
            actor_name="Col. Anita Nair",
            role="Reviewer",
            resource_type="OUTPUT",
            resource_id="1",
            details="Approved Security Advisory for urgent release under NTRO Operational Directive 2026-09.",
            ip_address="10.14.0.12 (GovNet Secure Room)",
            clearance_level="TOP SECRET",
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(hours=1)
        )
    ]
    for ev in audit_events:
        db.add(ev)
    db.commit()
    db.close()
    print("[ACTIS SEED] Database seeding successfully completed!")

if __name__ == "__main__":
    init_db_and_seed()
