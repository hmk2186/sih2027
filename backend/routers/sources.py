import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from models import Source, AuditLog, User
from schemas import SourceCreate, SourceResponse
from typing import List, Optional

router = APIRouter(prefix="/sources", tags=["Sources"])

PRESET_SOURCES = [
    {
        "id": "preset-scada",
        "title": "Advisory: Critical Zero-Day Vulnerability in Industrial SCADA Infrastructure",
        "source_type": "ADVISORY",
        "category": "Critical Infrastructure",
        "summary": "Urgent technical telemetry regarding unauthenticated remote execution flaw in edge control relays.",
        "content": """NATIONAL CYBER THREAT ASSESSMENT (CONFIDENTIAL)
SUBJECT: Unauthenticated Remote Buffer Corruption in Regional SCADA Gateway Controllers
SEVERITY: CRITICAL (CVSSv3: 9.8)
TRACKED IDENTIFIERS: CVE-2026-38412, CVE-2026-41099
AFFECTED SYSTEMS: GridSense Edge Gateway 4.2.x, TelemetryRouter OS 6.1.4, Enterprise Modbus Encoders

INCIDENT OVERVIEW:
During routine perimeter auditing on GovNet Sector 4, anomalous TCP connections on port 8443 were detected targeting municipal power distribution telemetry bridges. Deep packet inspection revealed payload weaponization attempting to trigger state-space memory corruption. 

If successfully exploited, the adversary achieves root privilege daemon persistence, enabling spoofed telemetry signals, sensor blindness, and coordinated relay shutdown.

INDICATORS OF COMPROMISE:
- C2 Relay IP: 185.220.101.44 (Forwarded TLS tunnel)
- Auxiliary Beacon: 194.26.29.112:443
- Malicious ELF binary hash (SHA256): 4a9f1c7e928d3bf0a87612c3e5d7a8b9e0f123456789abcdef0123456789abcd
- Threat Signature: NTRO_APT_PERSIST_2026_V1

RECOMMENDED MITIGATION:
1. Immediately restrict external routing to port 8443 on all sub-station gateways.
2. Deploy emergency hotfix build NTRO-GridSense-Patch-2026.4.
3. Invalidate cryptographic operational keys generated prior to September 1, 2026."""
    },
    {
        "id": "preset-apt-espionage",
        "title": "Intelligence Brief: State-Sponsored Cyber Espionage Targeting Defense Research",
        "source_type": "ARTICLE",
        "category": "Espionage / Defense",
        "summary": "Forensic analysis of targeted spear-phishing campaign deploying custom memory-only loaders.",
        "content": """SPECIAL DEFENSE TELEMETRY BRIEFING
SUBJECT: Operation IronWeave: Targeted Espionage Campaign Against Defense Aeronautics Laboratories
ACTOR PROFILE: UNC3886 / Advanced Persistent Threat Nexus
CLASSIFICATION: SECRET // RESTRICTED ACCESS

BACKGROUND:
Over the past 21 days, targeted defense contractors and aeronautical research bodies received tailored PDF documents masquerading as bilateral technical symposium invitations. Opening the document triggered an unpatched sandbox evasion vulnerability executing a memory-resident reflective DLL loader.

EXFILTRATION PATHWAY:
The malware establishes encrypted tunnels disguised as legitimate Cloudflare DNS-over-HTTPS queries to bypass perimeter proxies. Telemetry shows attempts to exfiltrate CAD blueprints for next-generation unmanned aerial surveillance propulsion systems.

DEFENSIVE DIRECTIVE:
All defense ecosystem endpoints must execute full-disk YARA scans and monitor anomalous outbound DNS queries exceeding 512 bytes. Mandate multi-factor hardware key attestation for all engineering workstations."""
    },
    {
        "id": "preset-quantum-roadmap",
        "title": "Policy Document: National Quantum-Safe Cryptography Transition Framework",
        "source_type": "DOCUMENT",
        "category": "National Policy",
        "summary": "Mandatory transition roadmap for government and defense networks to Post-Quantum Cryptography (PQC).",
        "content": """NATIONAL QUANTUM MISSION DIRECTIVE
DOCUMENT REF: NTRO-POL-2026-QC08
SUBJECT: National Strategy for Migration to Post-Quantum Cryptographic Standards (2026-2030)
TARGET AUDIENCE: Chief Information Security Officers, Critical Infrastructure Owners, Defense Heads

EXECUTIVE STATEMENT:
The imminent advancement of cryptanalytically relevant quantum computers (CRQC) poses a foundational threat to standard asymmetric encryption algorithms including RSA-2048, ECDSA, and Diffie-Hellman key exchange. Historical adversary doctrine includes 'Harvest Now, Decrypt Later' (HNDL) attacks against sovereign data repositories.

STRATEGIC MANDATES:
1. Inventory Phase (Months 1-6): Complete cryptographic asset inventory across all classified systems.
2. Hybrid Key Exchange (Months 6-18): Mandate dual-layer encapsulation combining Classical X25519 with ML-KEM (Kyber-768).
3. Digital Signature Upgrade (Months 18-36): Transition PKI infrastructure to ML-DSA (Dilithium) and SLH-DSA (SPHINCS+).
4. Full Sunset of Legacy RSA: Strict deadline set for December 31, 2029 across all Category-1 national infrastructure."""
    }
]

@router.get("/presets/all")
def get_presets():
    return PRESET_SOURCES

@router.post("/", response_model=SourceResponse)
def create_source(payload: SourceCreate, db: Session = Depends(get_db)):
    first_user = db.query(User).first()
    author_id = first_user.id if first_user else None

    # Calculate concise summary
    lines = [l.strip() for l in payload.raw_content.split("\n") if len(l.strip()) > 20]
    summary = lines[0][:200] if lines else payload.title

    source = Source(
        title=payload.title,
        source_type=payload.source_type,
        raw_content=payload.raw_content,
        summary=summary,
        metadata_info=json.dumps(payload.metadata_info or {}),
        file_name=payload.file_name,
        file_size_kb=payload.file_size_kb or (len(payload.raw_content.encode('utf-8')) / 1024.0),
        author_id=author_id
    )
    db.add(source)
    db.commit()
    db.refresh(source)

    # Log audit
    audit = AuditLog(
        action="SOURCE_INGESTED",
        actor_id=author_id,
        actor_name=first_user.full_name if first_user else "System",
        role=first_user.role if first_user else "Analyst",
        resource_type="SOURCE",
        resource_id=str(source.id),
        details=f"Ingested new source '{source.title}' ({source.source_type}, {round(source.file_size_kb, 1)} KB).",
        ip_address="10.14.0.24 (GovNet Terminal)",
        clearance_level="CONFIDENTIAL"
    )
    db.add(audit)
    db.commit()

    return source

@router.post("/upload", response_model=SourceResponse)
async def upload_source_file(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    source_type: Optional[str] = Form("DOCUMENT"),
    db: Session = Depends(get_db)
):
    content_bytes = await file.read()
    try:
        raw_text = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        raw_text = f"Binary content ingested from {file.filename}. Simulated extracted text content from document header and embedded strings for parsing."

    file_title = title or file.filename.rsplit(".", 1)[0].replace("_", " ").replace("-", " ").title()
    file_size_kb = len(content_bytes) / 1024.0

    source = Source(
        title=file_title,
        source_type=source_type or "DOCUMENT",
        raw_content=raw_text,
        summary=f"Ingested file: {file.filename} ({round(file_size_kb, 1)} KB)",
        metadata_info=json.dumps({"filename": file.filename, "content_type": file.content_type}),
        file_name=file.filename,
        file_size_kb=file_size_kb,
        author_id=1
    )
    db.add(source)
    db.commit()
    db.refresh(source)

    return source

@router.get("/", response_model=List[SourceResponse])
def list_sources(db: Session = Depends(get_db)):
    return db.query(Source).order_by(Source.created_at.desc()).all()

@router.get("/{source_id}", response_model=SourceResponse)
def get_source(source_id: int, db: Session = Depends(get_db)):
    source = db.query(Source).filter(Source.id == source_id).first()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    return source

@router.delete("/{source_id}")
def delete_source(source_id: int, db: Session = Depends(get_db)):
    source = db.query(Source).filter(Source.id == source_id).first()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    
    db.delete(source)
    db.commit()
    return {"message": f"Source {source_id} deleted successfully"}
