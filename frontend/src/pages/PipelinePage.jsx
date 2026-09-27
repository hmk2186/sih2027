import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Terminal, 
  ArrowRight, 
  ShieldAlert, 
  Layers, 
  Check,
  Cpu
} from 'lucide-react';
import { api } from '../api';

export default function PipelinePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [completed, setCompleted] = useState(false);

  const steps = [
    { title: "Source Ingestion & Sanitization", desc: "Parsing text buffer, verifying integrity hash & classification clearance." },
    { title: "AI Intelligence & Entity Extraction", desc: "Identifying CVEs, threat actors, IOCs, and strategic mission risk vectors." },
    { title: "Cross-Format Synthesis Engine", desc: "Synthesizing Security Advisories, Executive Briefs, Storyboards & Social Threads." },
    { title: "Automated Verification & Policy Check", desc: "Executing 4-tier factual accuracy, tone conformity, and classification checks." },
    { title: "Ready for Human-in-the-Loop Review", desc: "Deliverables compiled, signed with tamper-evident audit receipt." }
  ];

  useEffect(() => {
    let mounted = true;

    async function fetchJob() {
      try {
        const data = await api.getGenerationJob(id);
        if (mounted) setJob(data);
      } catch (err) {
        console.error("Job fetch error", err);
      }
    }
    fetchJob();

    // Simulated terminal logs and step progression
    const logMessages = [
      `[PIPELINE_INIT] Job #${id} accepted on GovNet ACTIS node.`,
      `[INGEST] Source payload received. Checksum: SHA256:7e98a0...`,
      `[SECURITY_CLEARANCE] Verifying classification level: RESTRICTED // GOVNET.`,
      `[NLP_EXTRACT] Initiating neural semantic tokenization...`,
      `[NLP_EXTRACT] Extracted entities: Threat vectors, memory corruption patterns, edge relays.`,
      `[NLP_EXTRACT] CVEs tracked: CVE-2026-38412, CVE-2026-41099.`,
      `[SYNTHESIS] Dispatching multi-format generative models across 7 target streams.`,
      `[SYNTHESIS] Compiling CERT Security Directive (MITRE ATT&CK T1190, T1068).`,
      `[SYNTHESIS] Drafting Executive BLUF & Risk Matrix.`,
      `[SYNTHESIS] Constructing 4-scene video production script & visual storyboard.`,
      `[SYNTHESIS] Formatting LinkedIn thought-leadership & 5-part X/Twitter thread.`,
      `[VERIFICATION] Automated factual fidelity check: 96.8% confidence.`,
      `[VERIFICATION] Tone compliance test: PASSED (Urgent & Authoritative).`,
      `[AUDIT] Cryptographic receipt generated and committed to GovNet audit ledger.`,
      `[STATUS] Synthesis complete. Deliverables staged for Human Review.`
    ];

    let timerIndex = 0;
    const interval = setInterval(() => {
      if (timerIndex < logMessages.length) {
        const msg = logMessages[timerIndex];
        setLogs((prev) => [...prev, msg]);

        if (timerIndex === 2) setCurrentStep(1);
        if (timerIndex === 6) setCurrentStep(2);
        if (timerIndex === 11) setCurrentStep(3);
        if (timerIndex === 14) {
          setCurrentStep(4);
          setCompleted(true);
        }
        timerIndex++;
      } else {
        clearInterval(interval);
      }
    }, 450);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-tactical-cyan/10 border border-tactical-cyan/30 px-3.5 py-1 rounded-full text-xs font-mono text-tactical-cyan mb-3">
          <Cpu className="w-3.5 h-3.5 animate-spin" />
          <span>ACTIS NEURAL SYNTHESIS ENGINE // ACTIVE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          AI Transformation Pipeline
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Transforming intelligence for Job #{id}: {job?.title || 'Operational Assessment'}
        </p>
      </div>

      {/* 5-Step Pipeline Card */}
      <div className="bg-defense-900 border border-defense-800 rounded-2xl p-6 shadow-xl">
        <div className="space-y-6">
          {steps.map((s, idx) => {
            const isDone = currentStep > idx || completed;
            const isCurrent = currentStep === idx && !completed;

            return (
              <div key={idx} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 transition-all ${
                  isDone 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : isCurrent
                    ? 'bg-tactical-cyan/20 text-tactical-cyan border border-tactical-cyan animate-pulse shadow-lg shadow-tactical-cyan/20'
                    : 'bg-defense-950 text-slate-500 border border-defense-800'
                }`}>
                  {isDone ? <Check className="w-4 h-4" /> : isCurrent ? <RefreshCw className="w-4 h-4 animate-spin" /> : idx + 1}
                </div>

                <div className="flex-1 pt-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xs font-bold font-mono tracking-wide ${
                      isDone ? 'text-emerald-300' : isCurrent ? 'text-tactical-cyan' : 'text-slate-500'
                    }`}>
                      {s.title}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">
                      {isDone ? 'PASSED' : isCurrent ? 'PROCESSING' : 'PENDING'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 pt-6 border-t border-defense-800">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">Synthesis Completion</span>
            <span className="text-tactical-cyan font-bold">
              {completed ? '100%' : `${Math.round(((currentStep + 1) / steps.length) * 100)}%`}
            </span>
          </div>
          <div className="w-full bg-defense-950 rounded-full h-2 overflow-hidden border border-defense-800">
            <div 
              className="bg-gradient-to-r from-tactical-cyan to-emerald-400 h-full transition-all duration-300 rounded-full"
              style={{ width: completed ? '100%' : `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="bg-defense-950 border border-defense-800 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-defense-800 mb-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-tactical-cyan" />
            <span>AI PIPELINE EXECUTION STREAM</span>
          </div>
          <span className="text-[10px] text-emerald-400">LIVE FEED</span>
        </div>

        <div className="font-mono text-xs text-slate-300 space-y-1 max-h-56 overflow-y-auto pr-2">
          {logs.map((log, index) => (
            <div key={index} className="leading-relaxed flex items-start gap-2">
              <span className="text-slate-600 select-none">&gt;</span>
              <span className={log.includes('PASSED') || log.includes('complete') ? 'text-emerald-400' : log.includes('Extracted') ? 'text-tactical-cyan' : 'text-slate-300'}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Complete CTA */}
      <div className="text-center pt-2">
        <button
          onClick={() => navigate(`/results/${id}`)}
          disabled={!completed}
          className={`px-8 py-3.5 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2.5 mx-auto transition shadow-2xl ${
            completed
              ? 'bg-tactical-cyan hover:bg-cyan-400 text-defense-950 shadow-tactical-cyan/25 cursor-pointer'
              : 'bg-defense-800 text-slate-500 cursor-not-allowed border border-defense-700'
          }`}
        >
          <span>VIEW GENERATED DELIVERABLES</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
