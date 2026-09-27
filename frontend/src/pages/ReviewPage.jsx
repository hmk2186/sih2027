import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Eye, 
  Layers, 
  Lock,
  ThumbsUp,
  RotateCcw,
  Edit3
} from 'lucide-react';
import { api } from '../api';
import StatusBadge from '../components/StatusBadge';

export default function ReviewPage({ currentUser, onToast }) {
  const { id: routeOutputId } = useParams();
  const navigate = useNavigate();

  const [pendingOutputs, setPendingOutputs] = useState([]);
  const [selectedOutput, setSelectedOutput] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Review Form Criteria Checkboxes
  const [factualCheck, setFactualCheck] = useState(true);
  const [toneCheck, setToneCheck] = useState(true);
  const [safetyCheck, setSafetyCheck] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');
  const [modifiedText, setModifiedText] = useState('');

  const loadPending = async () => {
    try {
      setLoading(true);
      const data = await api.getPendingReviews();
      setPendingOutputs(data);
      if (routeOutputId) {
        // If route specified an ID, find it or fetch it
        const target = data.find((o) => o.id === parseInt(routeOutputId));
        if (target) {
          selectOutput(target);
        } else {
          // If not in pending list, fetch directly
          const single = await fetch(`https://sih2027-2.onrender.com/api/generations/output/${routeOutputId}`).then(r => r.json());
          selectOutput(single);
        }
      } else if (data.length > 0) {
        selectOutput(data[0]);
      }
    } catch (err) {
      console.error("Failed to load review items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, [routeOutputId]);

  const selectOutput = (out) => {
    setSelectedOutput(out);
    setModifiedText(out?.content_markdown || '');
    setFeedbackText('');
    setFactualCheck(true);
    setToneCheck(true);
    setSafetyCheck(true);
  };

  const handleReviewAction = async (action) => {
    if (!selectedOutput) return;

    try {
      setSubmitting(true);
      const payload = {
        action: action,
        factual_check_passed: factualCheck,
        tone_check_passed: toneCheck,
        safety_check_passed: safetyCheck,
        feedback_text: feedbackText || (action === 'APPROVE' ? 'Approved for official sovereign dissemination.' : 'Changes requested by review authority.'),
        modified_content: action === 'EDIT' ? modifiedText : null
      };

      const result = await api.submitReview(selectedOutput.id, payload);

      onToast?.({
        type: action === 'APPROVE' ? 'success' : action === 'REQUEST_CHANGES' ? 'warning' : 'info',
        title: `Review Decision: ${action}`,
        message: `Output #${selectedOutput.id} marked as ${result.status}. Audit receipt recorded.`
      });

      // Reload pending list
      loadPending();
      if (pendingOutputs.length > 1) {
        setSelectedOutput(pendingOutputs.find(p => p.id !== selectedOutput.id) || null);
      }
    } catch (err) {
      onToast?.({
        type: 'error',
        title: 'Review Submission Failed',
        message: err.message
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-defense-900 border border-defense-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-amber-500/15 text-amber-400 px-2.5 py-0.5 rounded border border-amber-500/30">
                HUMAN-IN-THE-LOOP QUALITY GATE
              </span>
              <span className="text-xs font-mono text-slate-400">
                CLEARANCE LEVEL: {currentUser?.clearance_level || 'TOP SECRET'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Review & Clearance Station
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Multi-dimensional evaluation: fact accuracy, tone conformity, and classification safety clearance.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Review Queue:</span>
            <span className="bg-amber-500/20 text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-500/30">
              {pendingOutputs.length} Pending
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Review Layout: Queue List (Left) + Evaluation Stage (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pending Queue */}
        <div className="bg-defense-900 border border-defense-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-defense-800">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Pending Verification Items
            </h2>
            <span className="text-[10px] font-mono text-slate-500">{pendingOutputs.length} Items</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {pendingOutputs.length > 0 ? (
              pendingOutputs.map((item) => (
                <div
                  key={item.id}
                  onClick={() => selectOutput(item)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    selectedOutput?.id === item.id
                      ? 'bg-tactical-cyan/15 border-tactical-cyan/60 text-white'
                      : 'bg-defense-950 border-defense-800 text-slate-300 hover:border-defense-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <StatusBadge status={item.format_type} type="format" />
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {item.overall_score}% Auto
                    </span>
                  </div>
                  <div className="text-xs font-bold truncate mt-1">{item.title}</div>
                  <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-slate-500">
                    <span>Job #{item.job_id}</span>
                    <StatusBadge status={item.status} type="status" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs font-mono">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
                <span>All deliverables have been verified and cleared!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Item Evaluation (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedOutput ? (
            <div className="bg-defense-900 border border-defense-800 rounded-2xl p-6 space-y-6 shadow-xl">
              {/* Item Details Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-defense-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={selectedOutput.format_type} type="format" />
                    <span className="text-xs font-mono text-slate-400">Output ID #{selectedOutput.id}</span>
                    <StatusBadge status={selectedOutput.status} type="status" />
                  </div>
                  <h2 className="text-base font-bold text-white leading-tight">
                    {selectedOutput.title}
                  </h2>
                </div>

                <button
                  onClick={() => navigate(`/results/${selectedOutput.job_id}`)}
                  className="text-xs font-mono text-tactical-cyan hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>View All in Job #{selectedOutput.job_id}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Automated Heuristic Verification Breakdown */}
              <div className="grid grid-cols-3 gap-3 bg-defense-950 p-3.5 rounded-xl border border-defense-800 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Fact Score</span>
                  <span className="text-sm font-bold text-emerald-400">{selectedOutput.factual_score}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Tone Compliance</span>
                  <span className="text-sm font-bold text-tactical-cyan">{selectedOutput.tone_score}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Policy Clearance</span>
                  <span className="text-sm font-bold text-emerald-400">{selectedOutput.safety_score}%</span>
                </div>
              </div>

              {/* Artifact Markdown Content Viewer */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase font-medium">
                  Deliverable Content:
                </label>
                <div className="bg-defense-950 border border-defense-800 rounded-xl p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
                  {selectedOutput.content_markdown}
                </div>
              </div>

              {/* HUMAN VERIFICATION CHECKLIST (4 Criteria) */}
              <div className="bg-defense-950 p-4 rounded-xl border border-defense-800 space-y-3">
                <div className="text-xs font-bold text-tactical-cyan uppercase font-mono tracking-wider">
                  Human Approver Verification Criteria:
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 rounded-lg bg-defense-900 border border-defense-800 hover:border-defense-700 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={factualCheck}
                      onChange={(e) => setFactualCheck(e.target.checked)}
                      className="w-4 h-4 rounded text-tactical-cyan focus:ring-tactical-cyan bg-defense-950 border-defense-700"
                    />
                    <div>
                      <span className="font-bold text-slate-200">Fact Verification:</span>
                      <span className="text-slate-400 ml-1">Content accurately reflects source intelligence without hallucinations.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2 rounded-lg bg-defense-900 border border-defense-800 hover:border-defense-700 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={toneCheck}
                      onChange={(e) => setToneCheck(e.target.checked)}
                      className="w-4 h-4 rounded text-tactical-cyan focus:ring-tactical-cyan bg-defense-950 border-defense-700"
                    />
                    <div>
                      <span className="font-bold text-slate-200">Tone & Objective Alignment:</span>
                      <span className="text-slate-400 ml-1">Calibrated appropriately for target audience directive.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2 rounded-lg bg-defense-900 border border-defense-800 hover:border-defense-700 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={safetyCheck}
                      onChange={(e) => setSafetyCheck(e.target.checked)}
                      className="w-4 h-4 rounded text-tactical-cyan focus:ring-tactical-cyan bg-defense-950 border-defense-700"
                    />
                    <div>
                      <span className="font-bold text-slate-200">Policy, Safety & Clearance:</span>
                      <span className="text-slate-400 ml-1">Sanitized against unauthorized classified disclosures or private credentials.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Feedback remarks input */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Approval Notes / Change Directive Remarks:
                </label>
                <textarea
                  rows={2}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Optional review remarks recorded into immutable audit log..."
                  className="w-full bg-defense-950 border border-defense-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-tactical-cyan font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-defense-800">
                <div className="text-[11px] font-mono text-slate-400">
                  Reviewer: <strong className="text-white">{currentUser?.full_name}</strong>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleReviewAction('REQUEST_CHANGES')}
                    disabled={submitting}
                    className="bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Request Changes</span>
                  </button>

                  <button
                    onClick={() => handleReviewAction('APPROVE')}
                    disabled={submitting || !factualCheck || !safetyCheck}
                    className="bg-emerald-500 hover:bg-emerald-400 text-defense-950 px-5 py-2 rounded-lg text-xs font-mono font-black flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20 disabled:opacity-40"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>APPROVE DELIVERABLE</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-defense-900 border border-defense-800 rounded-2xl p-12 text-center text-slate-500 text-xs font-mono">
              Select an item from the pending queue to begin evaluation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
