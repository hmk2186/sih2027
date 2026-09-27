# ACTIS — Automated Content Transformation & Intelligence System
### Smart India Hackathon 2026 | Problem Statement ID: PS 26154
**Organization:** National Technical Research Organisation (NTRO)  
**Category:** Software | **Domain:** Cybersecurity & Intelligence Transformation  

---

## 🛡️ Executive Summary & Solution

Organizations and intelligence agencies frequently need to convert multi-source information (threat advisories, technical reports, policy documents, raw incident logs, or operator prompts) into specific, verified communication artefacts.

**ACTIS** takes a single common source of information and transforms it into **7 operational deliverables** simultaneously:
1. **Security Advisory:** CERT-In / NTRO compliant technical directive with CVEs, CVSS scores, Indicators of Compromise (IOCs), and MITRE ATT&CK TTP mitigations.
2. **Executive Summary:** High-level strategic BLUF (Bottom Line Up Front), Risk Matrix, and leadership action items.
3. **Video Package:** 90-second 4-scene video script, storyboard, visual concepts, narration voiceover, and subtitles.
4. **LinkedIn Post:** Strategic thought leadership article with key takeaways, hashtag taxonomy, and engagement questions.
5. **X / Twitter Thread:** 5-tweet punchy numbered sequence with alert graphics and action steps.
6. **Infographic Blueprint:** Visual layout specification with 4 primary quantitative metric cards and threat kill-chain flowcharts.
7. **Presentation Deck:** 5-slide deck outline with visual concepts and detailed speaker notes for briefing directors.

---

## ⚙️ Core Architecture & Workflow

```
[ SOURCE INGESTION ]
(Text / PDF / Reports / Presets)
         ↓
[ AI INFORMATION EXTRACTION ]
(CVEs, Threat Actors, IOCs, Strategic Takeaways)
         ↓
[ MULTI-FORMAT GENERATION ]
(Advisories, Exec BLUF, Video, Infographic, Slides, Social)
         ↓
[ AUTOMATED VERIFICATION LAYER ]
(Factual Fidelity, Tone Alignment, Policy & Safety Clearance)
         ↓
[ HUMAN-IN-THE-LOOP REVIEW ]
(Fact Check, Tone Check, Safety Clearance, In-line Correction)
         ↓
[ IMMUTABLE AUDIT TRAIL & EXPORT ]
(JSON, Markdown, Plain Text, Signed Receipts)
```

---

## 🚀 Quick Start Instructions

### Prerequisites
- Python 3.10+
- Node.js v18+ and npm

### 1. Start the Backend API
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- **API Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **API Health Check:** [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

### 2. Start the Frontend Web Application
```bash
cd frontend
npm install
npm run dev
```
- **Application URL:** [http://127.0.0.1:5173](http://127.0.0.1:5173)

---

## 👥 Demo Operator Profiles

Quick 1-click profiles configured for SIH evaluation:
| Username | Operator | Role | Clearance Level | Primary Function |
| :--- | :--- | :--- | :--- | :--- |
| `analyst` | Dr. Vikram Sethi | Intelligence Analyst | **SECRET** | Ingestion & Deliverable Generation |
| `reviewer` | Col. Anita Nair | Senior Reviewer / Approver | **TOP SECRET** | 3-Point Clearance & Approvals |
| `comms` | Meera Sen | Communications Officer | **CONFIDENTIAL** | Social Threads & Public Advisories |
| `admin` | Rajesh Sharma | System Administrator | **TOP SECRET** | System Governance & Audit Ledger |

*(Default passcode for all accounts: `password123` or click any profile on the login screen).*

---

## 🖥️ Application Features & Pages

1. **Landing Page (`/`)**: NTRO intelligence showcase, format switcher, architecture diagrams, and quick-launch CTA.
2. **Login Portal (`/login`)**: GovNet secure login with instant operator persona switching.
3. **Operational Command Dashboard (`/dashboard`)**: Live metrics (Sources, Generations, Pending Reviews, Approved Deliverables), recent transformations, and real-time audit feed.
4. **Create Transformation (`/create`)**:
   - 3 Ingestion Modes: 1-Click Intelligence Scenarios, Raw Text/Prompt, and Document Upload.
   - 7 Format Checkboxes with Select All capability.
   - Multi-parameter settings: Target Audience, Tone, Language, Detail Level, Objective, and Style.
5. **AI Processing Pipeline (`/pipeline/:id`)**: 5-stage animated neural pipeline with live terminal log stream.
6. **Generated Results Interface (`/results/:id`)**:
   - Multi-tab deliverable viewer.
   - Real-time in-line markdown editing with version incrementing.
   - Copy to clipboard & Section regeneration.
   - Multi-format exports (.MD, .TXT, .JSON).
   - Automated verification scores (Factual, Tone, Safety, Overall).
7. **Human Review & Approval (`/review`)**: Side-by-side verification gate with Fact, Tone, and Safety checkboxes, feedback remarks, and Approve / Request Changes actions.
8. **Transformation History (`/history`)**: Searchable archive filterable by keyword and status.
9. **Security Audit Logs (`/audit`)**: Tamper-evident ledger tracking actor, action, resource, timestamp, and GovNet IP address with one-click TXT export.
10. **System & Clearance Settings (`/settings`)**: Profile inspector, AI Model Engine selector (Local High-Fidelity Mock vs. Gemini API), and verification guardrail sliders.

---

## 🔒 Security & Verification Features
- **Human-In-The-Loop (HITL):** Enforces human review before deliverables are cleared for public or sovereign distribution.
- **Zero-Dependency Local Mode:** Operates 100% offline without external API keys, ensuring zero demo failure risk.
- **Pluggable Cloud LLM:** Optional Gemini API key override in settings or `.env`.
- **Tamper-Evident Audit Logging:** All critical actions are recorded with timestamps, clearance tiers, and operator IDs.
