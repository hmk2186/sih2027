from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str
    full_name: str
    role: str = "Analyst"
    department: str = "Cyber Threat Intelligence Wing"
    clearance_level: str = "CONFIDENTIAL"

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Source Schemas
class SourceCreate(BaseModel):
    title: str
    source_type: str = "DOCUMENT"
    raw_content: str
    metadata_info: Optional[Dict[str, Any]] = None
    file_name: Optional[str] = None
    file_size_kb: Optional[float] = 0.0

class SourceResponse(BaseModel):
    id: int
    title: str
    source_type: str
    raw_content: str
    summary: Optional[str] = None
    metadata_info: str
    file_name: Optional[str] = None
    file_size_kb: float
    author_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Output Schemas
class GeneratedOutputResponse(BaseModel):
    id: int
    job_id: int
    format_type: str
    title: str
    content_markdown: str
    structured_data: str  # JSON string
    factual_score: float
    tone_score: float
    safety_score: float
    overall_score: float
    status: str
    reviewer_notes: Optional[str] = None
    version: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class OutputUpdate(BaseModel):
    title: Optional[str] = None
    content_markdown: Optional[str] = None
    structured_data: Optional[str] = None

# Job Schemas
class GenerationJobCreate(BaseModel):
    title: str
    source_id: Optional[int] = None
    raw_content: Optional[str] = None
    source_type: Optional[str] = "TEXT"
    
    # Transformation parameters
    target_audience: str = "Technical CERT / Defense"
    tone: str = "Urgent & Authoritative"
    language: str = "English"
    detail_level: str = "Detailed Technical"
    objective: str = "Threat Mitigation & Alert"
    content_style: str = "NTRO Standard Directive"
    
    requested_formats: List[str] = Field(default_factory=lambda: [
        "SECURITY_ADVISORY", 
        "EXECUTIVE_SUMMARY", 
        "LINKEDIN_POST", 
        "TWITTER_THREAD",
        "INFOGRAPHIC",
        "PRESENTATION",
        "VIDEO_PACKAGE"
    ])

class GenerationJobResponse(BaseModel):
    id: int
    title: str
    source_id: int
    status: str
    target_audience: str
    tone: str
    language: str
    detail_level: str
    objective: str
    content_style: str
    requested_formats: str
    progress: int
    current_stage: str
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    outputs: List[GeneratedOutputResponse] = []

    class Config:
        from_attributes = True

# Review Schemas
class ReviewCreate(BaseModel):
    action: str = "APPROVE"  # APPROVE, REQUEST_CHANGES, EDIT
    factual_check_passed: bool = True
    tone_check_passed: bool = True
    safety_check_passed: bool = True
    feedback_text: Optional[str] = None
    modified_content: Optional[str] = None

class ReviewRecordResponse(BaseModel):
    id: int
    output_id: int
    reviewer_id: Optional[int] = None
    action: str
    factual_check_passed: bool
    tone_check_passed: bool
    safety_check_passed: bool
    feedback_text: Optional[str] = None
    reviewed_at: datetime

    class Config:
        from_attributes = True

# Audit Log Schemas
class AuditLogResponse(BaseModel):
    id: int
    action: str
    actor_name: str
    role: str
    resource_type: str
    resource_id: Optional[str] = None
    details: str
    ip_address: str
    clearance_level: str
    timestamp: datetime

    class Config:
        from_attributes = True

# Dashboard Stats Schemas
class DashboardStats(BaseModel):
    total_sources: int
    total_generations: int
    pending_reviews: int
    approved_outputs: int
    total_outputs: int
    average_verification_score: float
    recent_jobs: List[GenerationJobResponse]
    recent_activities: List[AuditLogResponse]
