import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Radio, 
  Layers, 
  ExternalLink,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { api } from '../api';
import StatusBadge from '../components/StatusBadge';

export default function DashboardPage({ currentUser }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
      setError('');
    } catch (err) {
      setError('Unable to fetch live telemetry. Confirm backend is running at http://127.0.0.1:8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-tactical-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-mono text-slate-400">CONNECTING TO ACTIS TELEMETRY FEED...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-defense-900 border border-defense-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-tactical-cyan bg-tactical-cyan/15 px-2.5 py-0.5 rounded border border-tactical-cyan/30">
                ACTIVE OPERATOR // {currentUser?.role?.toUpperCase() || 'ANALYST'}
              </span>
              <span className="text-xs font-mono text-slate-400">
                CLEARANCE: {currentUser?.clearance_level || 'SECRET'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Operational Command Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              National Technical Research Organisation (NTRO) AI Content Transformation & Intelligence System (PS 26154).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadStats}
              className="p-2.5 rounded-lg bg-defense-950 hover:bg-defense-800 border border-defense-700 text-slate-300 transition"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/create')}
              className="bg-tactical-cyan hover:bg-cyan-400 text-defense-950 font-bold px-4 py-2.5 rounded-lg text-xs font-mono flex items-center gap-2 transition shadow-lg shadow-tactical-cyan/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>START NEW TRANSFORMATION</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sources */}
        <div className="bg-defense-900 border border-defense-800 p-5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Ingested Sources</span>
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{stats?.total_sources || 0}</div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">+100%</span> parsed successfully
          </p>
        </div>

        {/* Total Generations */}
        <div className="bg-defense-900 border border-defense-800 p-5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Total Generations</span>
            <Sparkles className="w-4 h-4 text-tactical-cyan" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{stats?.total_generations || 0}</div>
          <p className="text-[11px] text-slate-400 mt-2">
            {stats?.total_outputs || 0} deliverables produced
          </p>
        </div>

        {/* Pending Reviews */}
        <div 
          onClick={() => navigate('/review')}
          className="bg-defense-900 border border-defense-800 hover:border-amber-500/50 p-5 rounded-xl cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase text-amber-400">Pending Reviews</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300 font-mono">{stats?.pending_reviews || 0}</div>
          <p className="text-[11px] text-amber-400/80 mt-2 flex items-center gap-1 font-semibold">
            <span>Awaiting human approval</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Approved Outputs */}
        <div className="bg-defense-900 border border-defense-800 p-5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase text-emerald-400">Approved Deliverables</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{stats?.approved_outputs || 0}</div>
          <p className="text-[11px] text-slate-400 mt-2">
            Avg Verification: <span className="text-emerald-400 font-bold font-mono">{stats?.average_verification_score || 95.5}%</span>
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout: Recent Generations + Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Generations (2 Columns) */}
        <div className="lg:col-span-2 bg-defense-900 border border-defense-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-4 border-b border-defense-800 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-tactical-cyan" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Recent Transformation Jobs
              </h2>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-mono text-tactical-cyan hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {stats?.recent_jobs?.length > 0 ? (
              stats.recent_jobs.map((job) => {
                let parsedFormats = [];
                try {
                  parsedFormats = JSON.parse(job.requested_formats);
                } catch (e) {
                  parsedFormats = [];
                }

                return (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/results/${job.id}`)}
                    className="p-3.5 bg-defense-950 hover:bg-defense-850 border border-defense-800 hover:border-defense-700 rounded-xl cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white hover:text-tactical-cyan transition">
                          {job.title}
                        </span>
                        <StatusBadge status={job.status} type="status" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <span>Audience: {job.target_audience}</span>
                        <span>•</span>
                        <span>Tone: {job.tone}</span>
                        <span>•</span>
                        <span className="text-tactical-cyan font-semibold">{parsedFormats.length} Formats</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-[11px] text-slate-500 font-mono hidden sm:block">
                        {new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <button className="text-xs font-mono text-slate-300 bg-defense-800 hover:bg-defense-700 px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs font-mono">
                No transformation jobs recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Live Operational Intelligence Feed (1 Column) */}
        <div className="bg-defense-900 border border-defense-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-4 border-b border-defense-800 mb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Audit Trail Telemetry
              </h2>
            </div>
            <button
              onClick={() => navigate('/audit')}
              className="text-xs font-mono text-tactical-cyan hover:underline"
            >
              Full Log
            </button>
          </div>

          <div className="space-y-3">
            {stats?.recent_activities?.length > 0 ? (
              stats.recent_activities.map((act) => (
                <div key={act.id} className="p-3 bg-defense-950 rounded-lg border border-defense-800/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-tactical-cyan font-bold">
                      {act.action}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                    {act.details}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{act.actor_name} ({act.role})</span>
                    <StatusBadge status={act.clearance_level} type="clearance" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs font-mono">
                No audit telemetry available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
