import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  FileCheck, 
  Zap, 
  Eye, 
  Lock, 
  Cpu, 
  Terminal, 
  FileText, 
  Video, 
  Share2, 
  Hash, 
  Layout, 
  Presentation 
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [selectedDemoTab, setSelectedDemoTab] = useState('ADVISORY');

  const demoOutputs = {
    ADVISORY: {
      title: "CERT / NTRO Security Directive",
      badge: "CRITICAL // CVSS 9.8",
      content: `[NTRO-CYBER-ADV-2026-09] CRITICAL SECURITY DIRECTIVE
VULNERABILITIES: CVE-2026-38412, CVE-2026-41099
AFFECTED: GridSense Edge Gateway 4.2.x, SCADA Routing Relays
ATTRIBUTION: Advanced Persistent Threat (UNC3886)
ACTION REQUIRED: Isolate port 8443, apply kernel patch 2026-R4 within 4 hours.
IOCs: SHA256 4a9f1c7e..., C2 Relay 185.220.101.44:8443`
    },
    EXEC: {
      title: "Executive Strategic BLUF",
      badge: "CONFIDENTIAL // STRATEGIC",
      content: `BOTTOM LINE UP FRONT (BLUF):
Zero-day boundary flaw identified in municipal telemetry edge nodes. 
Adversaries can execute arbitrary code without credentials.
EXECUTIVE DECISION REQUIRED:
1. Authorize 30-min scheduled patch window for Tier-1 Core Nodes.
2. Activate NTRO-CERT-In inter-agency coordination taskforce.
3. Sanction release of sanitized alert to critical infrastructure operators.`
    },
    VIDEO: {
      title: "90-Second Video Package & Storyboard",
      badge: "1080p // 60fps BROADCAST",
      content: `SCENE 1 (0:00 - 0:15): THE ALERT
[Visual]: Digital globe with red threat vectors over regional nodes. Camera zooms to server telemetry.
[Narration]: "In the modern digital battlespace, seconds define the boundary between security and compromise."
[On-Screen Lower Third]: ALERT LEVEL: HIGH // NTRO CYBER DESK

SCENE 2 (0:15 - 0:40): THREAT ANATOMY
[Visual]: 3D schematic of router memory stack overflowing under unauthenticated payload.
[Narration]: "Adversaries are targeting unauthenticated boundary flaws in edge gateways..."`
    },
    SOCIAL: {
      title: "LinkedIn & X / Twitter Synthesis",
      badge: "MULTI-CHANNEL CAMPAIGN",
      content: `🛡️ Defending Critical Infrastructure: Strategic Analysis
Adversaries are weaponizing vulnerabilities in zero-day infrastructure within hours.
4 Key Directives for Defense Leadership:
1. Shrinking exploitation windows demand automated containment
2. Cross-domain telemetry stops lateral OT/IT movement
3. Zero-Trust continuous hardware attestation
#CyberSecurity #NationalDefense #NTRO #GovNet #ThreatIntel`
    }
  };

  return (
    <div className="min-h-screen bg-defense-950 text-slate-100 selection:bg-tactical-cyan/30">
      {/* Top Bar */}
      <header className="border-b border-defense-800/80 bg-defense-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-tactical-cyan/15 border border-tactical-cyan/40 flex items-center justify-center text-tactical-cyan shadow-lg shadow-tactical-cyan/10">
              <Shield className="w-6 h-6 text-tactical-cyan" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-xl font-mono text-white">ACTIS</span>
                <span className="text-[10px] bg-tactical-cyan/20 text-tactical-cyan px-2 py-0.5 rounded font-mono border border-tactical-cyan/30">
                  SIH 2026 PS 26154
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">National Technical Research Organisation (NTRO)</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-mono text-slate-300 hover:text-tactical-cyan transition px-3 py-1.5"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-tactical-cyan text-defense-950 hover:bg-cyan-400 font-bold px-4 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition shadow-lg shadow-tactical-cyan/20"
            >
              <span>ENTER OPERATOR PORTAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-6 border-b border-defense-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-defense-900 border border-tactical-cyan/30 px-3.5 py-1.5 rounded-full text-xs font-mono text-tactical-cyan mb-6 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SIH 2026 OFFICIAL SOLUTION FOR NTRO (PS 26154)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            One Common Source of Intel. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tactical-cyan via-blue-400 to-emerald-400">
              Seven Mission-Ready Deliverables.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            ACTIS ingests unstructured reports, zero-day threat advisories, policy whitepapers, or prompts, 
            extracts tactical intelligence, and transforms them into verified Security Advisories, Executive Briefs, 
            Video Storyboards, Slide Decks, and Social Threads—enforcing strict human-in-the-loop verification.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/create')}
              className="bg-tactical-cyan hover:bg-cyan-400 text-defense-950 font-extrabold px-6 py-3 rounded-xl text-sm font-mono flex items-center gap-2.5 transition shadow-xl shadow-tactical-cyan/25"
            >
              <Zap className="w-4 h-4" />
              <span>LAUNCH TRANSFORMATION PIPELINE</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="bg-defense-900 hover:bg-defense-800 text-slate-200 border border-defense-700 font-semibold px-6 py-3 rounded-xl text-sm font-mono flex items-center gap-2 transition"
            >
              <Terminal className="w-4 h-4 text-tactical-cyan" />
              <span>EXPLORE DASHBOARD</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Transformation Showcase */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Multi-Domain Cross-Format Synthesis
          </h2>
          <p className="text-sm text-slate-400">
            Select a format below to inspect how ACTIS transforms raw telemetry into verified operational artifacts:
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => setSelectedDemoTab('ADVISORY')}
            className={`px-4 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition ${
              selectedDemoTab === 'ADVISORY'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                : 'bg-defense-900 text-slate-400 hover:text-white border border-defense-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            <span>Security Advisory</span>
          </button>
          <button
            onClick={() => setSelectedDemoTab('EXEC')}
            className={`px-4 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition ${
              selectedDemoTab === 'EXEC'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
                : 'bg-defense-900 text-slate-400 hover:text-white border border-defense-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Executive BLUF</span>
          </button>
          <button
            onClick={() => setSelectedDemoTab('VIDEO')}
            className={`px-4 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition ${
              selectedDemoTab === 'VIDEO'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'bg-defense-900 text-slate-400 hover:text-white border border-defense-800'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-emerald-400" />
            <span>Video Package</span>
          </button>
          <button
            onClick={() => setSelectedDemoTab('SOCIAL')}
            className={`px-4 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition ${
              selectedDemoTab === 'SOCIAL'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'bg-defense-900 text-slate-400 hover:text-white border border-defense-800'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Social & X Threads</span>
          </button>
        </div>

        {/* Preview Card */}
        <div className="bg-defense-900 border border-defense-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-defense-800 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-mono text-slate-400 ml-2">
                {demoOutputs[selectedDemoTab].title}
              </span>
            </div>
            <span className="text-[10px] font-mono bg-defense-950 text-tactical-cyan border border-tactical-cyan/30 px-2.5 py-1 rounded">
              {demoOutputs[selectedDemoTab].badge}
            </span>
          </div>

          <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-defense-950 p-4 rounded-xl border border-defense-800/80 max-h-80 overflow-y-auto">
            {demoOutputs[selectedDemoTab].content}
          </pre>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Automated Verification Passed (Score: 96.8%)</span>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="text-tactical-cyan hover:underline font-mono flex items-center gap-1 font-semibold"
            >
              Generate this with your source &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* 6 Key Architectural Pillars */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-defense-800/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-defense-900/60 border border-defense-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-tactical-cyan/15 text-tactical-cyan flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Universal Ingestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Handles unstructured raw text, PDF/DOCX threat advisories, policy briefs, and contextual media descriptors seamlessly.
            </p>
          </div>

          <div className="bg-defense-900/60 border border-defense-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-tactical-emerald/15 text-tactical-emerald flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Human-In-The-Loop Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enforces four-point verification checks: Fact accuracy, Tone alignment, Policy/Safety clearance, and Direct inline editing before approval.
            </p>
          </div>

          <div className="bg-defense-900/60 border border-defense-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-tactical-amber/15 text-tactical-amber flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Tamper-Evident Audit Logging</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every ingestion, AI generation, review decision, and clearance downgrade is cryptographically tracked in immutable audit logs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-defense-800/80 bg-defense-900 py-8 px-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-300">ACTIS</span> // Smart India Hackathon 2026 // NTRO PS 26154
          </div>
          <div>National Technical Research Organisation (NTRO)</div>
          <div className="text-emerald-400">STATUS: OPERATIONAL</div>
        </div>
      </footer>
    </div>
  );
}
