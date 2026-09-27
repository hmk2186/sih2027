from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, AuditLog
from schemas import UserLogin, UserResponse, Token
import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user:
        # Check if user exists by email
        user = db.query(User).filter(User.email == payload.username).first()
    
    if not user:
        # For seamless hackathon demo experience, create the user if not exists or fallback to analyst
        user = db.query(User).first()
        if not user:
            raise HTTPException(status_code=400, detail="No users configured in database.")

    # Record audit log
    audit = AuditLog(
        action="USER_AUTHENTICATED",
        actor_id=user.id,
        actor_name=user.full_name,
        role=user.role,
        resource_type="AUTH",
        resource_id=str(user.id),
        details=f"User {user.username} logged into ACTIS portal with {user.clearance_level} clearance.",
        ip_address="10.14.0.24 (GovNet Terminal)",
        clearance_level=user.clearance_level
    )
    db.add(audit)
    db.commit()

    return {
        "access_token": f"actis-token-{user.username}-session",
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/switch-role", response_model=UserResponse)
def switch_role(role_name: str, db: Session = Depends(get_db)):
    """Allows rapid switching between Analyst, Reviewer, Admin, Communications Officer for demo."""
    user = db.query(User).filter(User.role == role_name).first()
    if not user:
        # Create or update current user
        user = db.query(User).first()
        if user:
            user.role = role_name
            db.commit()
            db.refresh(user)
    
    audit = AuditLog(
        action="ROLE_SWITCHED",
        actor_id=user.id if user else None,
        actor_name=user.full_name if user else "Operator",
        role=role_name,
        resource_type="AUTH",
        resource_id=str(user.id if user else 0),
        details=f"Active operator session switched role to: {role_name}",
        ip_address="10.14.0.24 (GovNet Terminal)",
        clearance_level=user.clearance_level if user else "CONFIDENTIAL"
    )
    db.add(audit)
    db.commit()

    return user

@router.get("/users", response_model=list[UserResponse])
def list_available_users(db: Session = Depends(get_db)):
    return db.query(User).all()
