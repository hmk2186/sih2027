import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  FileText, 
  Share2, 
  Hash, 
  Layout, 
  Presentation, 
  Video, 
  Copy, 
  Edit3, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  CheckSquare, 
  Check, 
  AlertCircle,
  Save,
  X,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { api } from '../api';
import StatusBadge from '../components/StatusBadge';

export default function ResultsPage({ onToast }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const loadJob = async () => {
    try {
      setLoading(true);
      const data = await api.getGenerationJob(id);
      setJob(data);
      if (data.outputs?.length > 0) {
        setEditedContent(data.outputs[activeTab]?.content_markdown || '');
      }
      setError('');
    } catch (err) {
      setError('Unable to load transformation deliverables: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  const activeOutput = job?.outputs?.[activeTab];

  useEffect(() => {
    if (activeOutput) {
      setEditedContent(activeOutput.content_markdown);
      setIsEditing(false);
    }
  }, [activeTab, activeOutput]);

  const handleCopy = () => {
    if (!activeOutput) return;
    navigator.clipboard.writeText(activeOutput.content_markdown);
    onToast?.({
      type: 'success',
      title: 'Copied',
      message: `${activeOutput.format_type} copied to clipboard.`
    });
  };

  const handleSaveEdit = async () => {
    if (!activeOutput) return;
    try {
      setSavingEdit(true);
      const updated = await api.updateOutput(activeOutput.id, {
        content_markdown: editedContent
      });
      // Update local state
      const updatedOutputs = [...job.outputs];
      updatedOutputs[activeTab] = updated;
      setJob({ ...job, outputs: updatedOutputs });
      setIsEditing(false);
      onToast?.({
        type: 'success',
        title: 'Changes Saved',
        message: `Version ${updated.version} updated successfully.`
      });
    } catch (err) {
      onToast?.({
        type: 'error',
        title: 'Save Failed',
        message: err.message
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleRegenerate = async () => {
    if (!activeOutput) return;
    try {
      setRegenerating(true);
      const regenerated = await api.regenerateOutput(activeOutput.id);
      const updatedOutputs = [...job.outputs];
      updatedOutputs[activeTab] = regenerated;
      setJob({ ...job, outputs: updatedOutputs });
      setEditedContent(regenerated.content_markdown);
      onToast?.({
        type: 'success',
        title: 'Regenerated',
        message: `${activeOutput.format_type} successfully resynthesized.`
      });
    } catch (err) {
      onToast?.({
        type: 'error',
        title: 'Regeneration Error',
        message: err.message
      });
    } finally {
      setRegenerating(false);
    }
  };

  const handleExport = (format = 'txt') => {
    if (!activeOutput) return;
    let dataToExport = activeOutput.content_markdown;
    let filename = `${activeOutput.format_type}_Job_${job.id}.${format}`;
    let mimeType = 'text/plain';

    if (format === 'json') {
      dataToExport = JSON.stringify(activeOutput, null, 2);
      mimeType = 'application/json';
    }

    const blob = new Blob([dataToExport], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    onToast?.({
      type: 'info',
      title: 'Export Complete',
      message: `Downloaded ${filename}`
    });
  };

  if (loading && !job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-tactical-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-mono text-slate-400">RETRIEVING DELIVERABLES FOR JOB #{id}...</p>
      </div>
    );
  }

  if (error || !job || !job.outputs?.length) {
    return (
      <div className="p-8 bg-defense-900 border border-defense-800 rounded-2xl text-center max-w-xl mx-auto space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Deliverables Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'No deliverables recorded for this transformation job.'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-tactical-cyan text-defense-950 px-4 py-2 rounded-lg text-xs font-mono font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-defense-900 border border-defense-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate('/history')}
                className="text-slate-400 hover:text-white transition flex items-center gap-1 text-xs font-mono"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Jobs</span>
              </button>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-mono text-tactical-cyan bg-tactical-cyan/15 px-2 py-0.5 rounded border border-tactical-cyan/30">
                JOB #{job.id}
              </span>
              <StatusBadge status={job.status} type="status" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono mt-1">
              <span>Audience: <strong className="text-slate-200">{job.target_audience}</strong></span>
              <span>•</span>
              <span>Tone: <strong className="text-slate-200">{job.tone}</strong></span>
              <span>•</span>
              <span>Language: <strong className="text-slate-200">{job.language}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{job.outputs.length} Formats Synthesized</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/review/${activeOutput?.id}`)}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold px-4 py-2.5 rounded-lg text-xs font-mono flex items-center gap-2 transition shadow-lg shadow-amber-500/10"
            >
              <CheckSquare className="w-4 h-4" />
              <span>REVIEW & CLEARANCE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deliverables Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-defense-800">
        {job.outputs.map((out, idx) => (
          <button
            key={out.id}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-mono font-medium flex items-center gap-2 transition whitespace-nowrap border-t border-x ${
              activeTab === idx
                ? 'bg-defense-900 text-tactical-cyan border-defense-700 font-bold'
                : 'bg-defense-950 text-slate-400 hover:text-slate-200 border-transparent hover:border-defense-800'
            }`}
          >
            <StatusBadge status={out.format_type} type="format" />
            <span className={`w-2 h-2 rounded-full ${
              out.status === 'APPROVED' ? 'bg-emerald-400' : 'bg-amber-400'
            }`}></span>
          </button>
        ))}
      </div>

      {/* Active Deliverable Workspace */}
      {activeOutput && (
        <div className="bg-defense-900 border border-defense-800 rounded-b-2xl rounded-tr-2xl p-6 shadow-xl space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-defense-800">
            <div className="flex items-center gap-3">
              <StatusBadge status={activeOutput.status} type="status" />
              <span className="text-[11px] font-mono text-slate-400">
                Version {activeOutput.version} • Updated {new Date(activeOutput.updated_at).toLocaleTimeString()}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopy}
                className="bg-defense-950 hover:bg-defense-850 border border-defense-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
                title="Copy markdown text"
              >
                <Copy className="w-3.5 h-3.5 text-tactical-cyan" />
                <span>Copy</span>
              </button>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-defense-950 hover:bg-defense-850 border border-defense-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>In-line Edit</span>
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleSaveEdit}
                    disabled={savingEdit}
                    className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition font-bold"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingEdit ? 'Saving...' : 'Save Edit'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditedContent(activeOutput.content_markdown);
                      setIsEditing(false);
                    }}
                    className="bg-defense-950 border border-defense-700 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-mono"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="bg-defense-950 hover:bg-defense-850 border border-defense-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
                title="Regenerate this specific deliverable with AI"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-tactical-cyan ${regenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>

              {/* Export Dropdown / Buttons */}
              <div className="flex items-center bg-defense-950 rounded-lg border border-defense-700 text-xs font-mono overflow-hidden">
                <button
                  onClick={() => handleExport('md')}
                  className="px-2.5 py-1.5 hover:bg-defense-850 text-slate-300 transition"
                  title="Export as Markdown"
                >
                  .MD
                </button>
                <span className="text-defense-700">|</span>
                <button
                  onClick={() => handleExport('txt')}
                  className="px-2.5 py-1.5 hover:bg-defense-850 text-slate-300 transition"
                  title="Export as Plain Text"
                >
                  .TXT
                </button>
                <span className="text-defense-700">|</span>
                <button
                  onClick={() => handleExport('json')}
                  className="px-2.5 py-1.5 hover:bg-defense-850 text-slate-300 transition"
                  title="Export as JSON"
                >
                  .JSON
                </button>
              </div>
            </div>
          </div>

          {/* Verification Scorecard strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-defense-950 p-3.5 rounded-xl border border-defense-800">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Fact Accuracy Score</div>
              <div className="text-base font-black text-emerald-400 font-mono">
                {activeOutput.factual_score}%
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Tone Alignment</div>
              <div className="text-base font-black text-tactical-cyan font-mono">
                {activeOutput.tone_score}%
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Policy & Safety Check</div>
              <div className="text-base font-black text-emerald-400 font-mono">
                {activeOutput.safety_score}%
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Overall Quality Index</div>
              <div className="text-base font-black text-white font-mono flex items-center gap-1.5">
                <span>{activeOutput.overall_score}%</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Output Content Body */}
          {isEditing ? (
            <div>
              <label className="block text-xs font-mono text-amber-400 mb-2 font-bold">
                EDITING ACTIVE ARTIFACT // CHANGES WILL BE STAGED IN AUDIT LEDGER
              </label>
              <textarea
                rows={16}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full bg-defense-950 border border-amber-500/50 rounded-xl p-4 text-xs font-mono text-slate-100 focus:outline-none leading-relaxed"
              />
            </div>
          ) : (
            <div className="bg-defense-950 border border-defense-800 rounded-xl p-6 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-tactical-cyan/20">
              {activeOutput.content_markdown}
            </div>
          )}

          {/* Reviewer remarks if any */}
          {activeOutput.reviewer_notes && (
            <div className="p-3.5 bg-defense-950 border border-defense-800 rounded-xl text-xs flex items-start gap-2.5">
              <CheckSquare className="w-4 h-4 text-tactical-cyan flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white font-mono">Reviewer Remark:</span>{' '}
                <span className="text-slate-300">{activeOutput.reviewer_notes}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
