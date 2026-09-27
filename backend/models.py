import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(50), default="Analyst")  # Analyst, Reviewer, Admin, Communications Officer
    department = Column(String(100), default="Cyber Threat Intelligence Wing")
    clearance_level = Column(String(50), default="CONFIDENTIAL")  # PUBLIC, CONFIDENTIAL, SECRET, TOP SECRET
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    sources = relationship("Source", back_populates="creator")
    generation_jobs = relationship("GenerationJob", back_populates="creator")
    reviews = relationship("ReviewRecord", back_populates="reviewer")

class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    source_type = Column(String(50), default="DOCUMENT")  # TEXT, DOCUMENT, ARTICLE, ADVISORY, PROMPT, MEDIA_CONTEXT
    raw_content = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    metadata_info = Column(Text, default="{}")  # JSON string
    file_name = Column(String(255), nullable=True)
    file_size_kb = Column(Float, default=0.0)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    creator = relationship("User", back_populates="sources")
    jobs = relationship("GenerationJob", back_populates="source", cascade="all, delete-orphan")

class GenerationJob(Base):
    __tablename__ = "generation_jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False)
    status = Column(String(50), default="QUEUED")  # QUEUED, PROCESSING, COMPLETED, FAILED
    
    # Transformation Parameters
    target_audience = Column(String(100), default="Technical CERT / Defense")
    tone = Column(String(100), default="Urgent & Authoritative")
    language = Column(String(50), default="English")
    detail_level = Column(String(50), default="Detailed Technical")
    objective = Column(String(255), default="Threat Mitigation & Alert")
    content_style = Column(String(100), default="NTRO Standard Directive")
    
    requested_formats = Column(Text, default="[]")  # JSON array e.g. ["SECURITY_ADVISORY", "EXECUTIVE_SUMMARY"]
    progress = Column(Integer, default=0)
    current_stage = Column(String(100), default="Initialized")
    error_message = Column(Text, nullable=True)
    
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    creator = relationship("User", back_populates="generation_jobs")
    source = relationship("Source", back_populates="jobs")
    outputs = relationship("GeneratedOutput", back_populates="job", cascade="all, delete-orphan")

class GeneratedOutput(Base):
    __tablename__ = "generated_outputs"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("generation_jobs.id"), nullable=False)
    format_type = Column(String(50), nullable=False)  
    # SECURITY_ADVISORY, EXECUTIVE_SUMMARY, LINKEDIN_POST, TWITTER_THREAD, INFOGRAPHIC, PRESENTATION, VIDEO_PACKAGE
    
    title = Column(String(255), nullable=False)
    content_markdown = Column(Text, nullable=False)
    structured_data = Column(Text, default="{}")  # JSON string with format-specific details
    
    # Automated Verification Scores (0 - 100)
    factual_score = Column(Float, default=95.0)
    tone_score = Column(Float, default=92.0)
    safety_score = Column(Float, default=98.0)
    overall_score = Column(Float, default=95.0)
    
    # Human Review Status
    status = Column(String(50), default="PENDING_REVIEW")  # DRAFT, PENDING_REVIEW, APPROVED, CHANGES_REQUESTED
    reviewer_notes = Column(Text, nullable=True)
    version = Column(Integer, default=1)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    job = relationship("GenerationJob", back_populates="outputs")
    reviews = relationship("ReviewRecord", back_populates="output", cascade="all, delete-orphan")

class ReviewRecord(Base):
    __tablename__ = "review_records"

    id = Column(Integer, primary_key=True, index=True)
    output_id = Column(Integer, ForeignKey("generated_outputs.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(50), nullable=False)  # APPROVE, REQUEST_CHANGES, EDIT
    
    factual_check_passed = Column(Boolean, default=True)
    tone_check_passed = Column(Boolean, default=True)
    safety_check_passed = Column(Boolean, default=True)
    
    feedback_text = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, default=datetime.datetime.utcnow)

    output = relationship("GeneratedOutput", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(100), nullable=False)
    actor_id = Column(Integer, nullable=True)
    actor_name = Column(String(100), default="System")
    role = Column(String(50), default="Analyst")
    resource_type = Column(String(50), nullable=False)  # SOURCE, JOB, OUTPUT, REVIEW, AUTH, SYSTEM
    resource_id = Column(String(50), nullable=True)
    details = Column(Text, default="{}")
    ip_address = Column(String(50), default="10.14.0.24 (GovNet)")
    clearance_level = Column(String(50), default="CONFIDENTIAL")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
