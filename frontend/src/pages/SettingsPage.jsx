import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Cpu, 
  Key, 
  Save, 
  CheckCircle2, 
  Radio, 
  Server,
  Lock
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function SettingsPage({ currentUser, onToast }) {
  const [aiMode, setAiMode] = useState('mock_high_fidelity');
  const [geminiKey, setGeminiKey] = useState('');
  const [factThreshold, setFactThreshold] = useState(90);
  const [safetyThreshold, setSafetyThreshold] = useState(95);
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onToast?.({
        type: 'success',
        title: 'Settings Saved',
        message: 'Operational parameters & AI engine settings committed to GovNet node.'
      });
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono bg-tactical-cyan/15 text-tactical-cyan px-2.5 py-0.5 rounded border border-tactical-cyan/30">
            SYSTEM CONFIGURATION
          </span>
          <span className="text-xs font-mono text-slate-400">NTRO PS 26154</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Operator Profile & Security Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage operational clearance, AI synthesis engines, and automated verification thresholds.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-defense-900 border border-defense-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-defense-800 mb-6">
            <div className="w-8 h-8 rounded-lg bg-tactical-cyan/15 text-tactical-cyan border border-tactical-cyan/30 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Operator Identity & Clearance
              </h2>
              <p className="text-[11px] text-slate-400">Active session credentials on GovNet node.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1 text-[11px]">Full Name</label>
              <input
                type="text"
                disabled
                value={currentUser?.full_name || 'Dr. Vikram Sethi'}
                className="w-full bg-defense-950 border border-defense-700 rounded-lg px-3 py-2 text-slate-300 font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 text-[11px]">Department</label>
              <input
                type="text"
                disabled
                value={currentUser?.department || 'Cyber Threat Intelligence Wing'}
                className="w-full bg-defense-950 border border-defense-700 rounded-lg px-3 py-2 text-slate-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 text-[11px]">Operational Role</label>
              <input
                type="text"
                disabled
                value={currentUser?.role || 'Analyst'}
                className="w-full bg-defense-950 border border-defense-700 rounded-lg px-3 py-2 text-tactical-cyan font-bold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 text-[11px]">Assigned Clearance Level</label>
              <div className="pt-1">
                <StatusBadge status={currentUser?.clearance_level || 'SECRET'} type="clearance" />
              </div>
            </div>
          </div>
        </div>

        {/* AI Synthesis Engine Provider */}
        <div className="bg-defense-900 border border-defense-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-defense-800 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                AI Synthesis Engine Provider
              </h2>
              <p className="text-[11px] text-slate-400">Select local air-gapped models or external LLM APIs.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label
                onClick={() => setAiMode('mock_high_fidelity')}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  aiMode === 'mock_high_fidelity'
                    ? 'bg-tactical-cyan/15 border-tactical-cyan text-white'
                    : 'bg-defense-950 border-defense-800 text-slate-400 hover:border-defense-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-mono text-xs font-bold">
                  <span className="text-white">Local Air-Gapped Intelligence Engine</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">DEFAULT / ZERO-DEPENDENCY</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1 font-sans">
                  High-fidelity deterministic cybersecurity synthesis. Works 100% offline without external keys. Ideal for Hackathon judging.
                </p>
              </label>

              <label
                onClick={() => setAiMode('gemini')}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  aiMode === 'gemini'
                    ? 'bg-tactical-cyan/15 border-tactical-cyan text-white'
                    : 'bg-defense-950 border-defense-800 text-slate-400 hover:border-defense-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-mono text-xs font-bold">
                  <span className="text-white">Google Gemini 1.5 Pro API</span>
                  <span className="text-[10px] text-tactical-cyan bg-tactical-cyan/10 px-2 py-0.5 rounded border border-tactical-cyan/30">CLOUD LLM</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1 font-sans">
                  Direct API connection using Google Gemini API key. Seamless fallback to local engine if key is absent.
                </p>
              </label>
            </div>

            {aiMode === 'gemini' && (
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Gemini API Key (Optional Override)
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-defense-950 border border-defense-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-tactical-cyan"
                />
              </div>
            )}
          </div>
        </div>

        {/* Verification Guardrails & Thresholds */}
        <div className="bg-defense-900 border border-defense-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-defense-800 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Verification Guardrails & Quality Thresholds
              </h2>
              <p className="text-[11px] text-slate-400">Automated gate parameters before routing to human reviewer.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex items-center justify-between mb-1 text-slate-300">
                <span>Minimum Factual Accuracy Confidence</span>
                <span className="text-emerald-400 font-bold">{factThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={factThreshold}
                onChange={(e) => setFactThreshold(e.target.value)}
                className="w-full accent-tactical-cyan bg-defense-950"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 text-slate-300">
                <span>Minimum Policy & Safety Clearance Score</span>
                <span className="text-tactical-cyan font-bold">{safetyThreshold}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="100"
                value={safetyThreshold}
                onChange={(e) => setSafetyThreshold(e.target.value)}
                className="w-full accent-tactical-cyan bg-defense-950"
              />
            </div>

            <label className="flex items-center gap-3 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoQuarantine}
                onChange={(e) => setAutoQuarantine(e.target.checked)}
                className="w-4 h-4 rounded text-tactical-cyan bg-defense-950 border-defense-700"
              />
              <span className="text-slate-300">
                Automatically flag and quarantine any deliverable scoring below thresholds.
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-tactical-cyan hover:bg-cyan-400 text-defense-950 font-black px-6 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2 transition shadow-lg shadow-tactical-cyan/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SAVING CONFIGURATION...' : 'SAVE SETTINGS'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
