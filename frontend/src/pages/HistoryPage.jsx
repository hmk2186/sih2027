import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Search, 
  Filter, 
  ArrowRight, 
  Trash2, 
  Layers, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { api } from '../api';
import StatusBadge from '../components/StatusBadge';

export default function HistoryPage({ onToast }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await api.getGenerationJobs();
      setJobs(data);
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.target_audience.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.objective.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-defense-900 border border-defense-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-tactical-cyan/15 text-tactical-cyan px-2.5 py-0.5 rounded border border-tactical-cyan/30">
                TRANSFORMATION ARCHIVE
              </span>
              <span className="text-xs font-mono text-slate-400">HISTORICAL DATABASE</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Intelligence Transformation History
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Search and inspect all previous multi-format synthesis jobs and verified outputs.
            </p>
          </div>

          <button
            onClick={loadJobs}
            className="p-2.5 rounded-lg bg-defense-950 hover:bg-defense-850 border border-defense-700 text-slate-300 transition self-start sm:self-auto"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-defense-900 border border-defense-800 p-4 rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, audience, or objective..."
            className="w-full bg-defense-950 border border-defense-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-tactical-cyan font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-defense-950 border border-defense-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-tactical-cyan font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PROCESSING">Processing</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-defense-900 border border-defense-800 rounded-2xl overflow-hidden shadow-xl">
        {loading && jobs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs font-mono">
            <div className="w-6 h-6 border-2 border-tactical-cyan border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading transformation history...
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="divide-y divide-defense-800">
            {filteredJobs.map((job) => {
              let formats = [];
              try {
                formats = JSON.parse(job.requested_formats);
              } catch (e) {
                formats = [];
              }

              return (
                <div
                  key={job.id}
                  className="p-4 hover:bg-defense-850/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-mono text-tactical-cyan font-bold">
                        JOB #{job.id}
                      </span>
                      <h3 className="text-sm font-bold text-white hover:text-tactical-cyan transition cursor-pointer"
                          onClick={() => navigate(`/results/${job.id}`)}>
                        {job.title}
                      </h3>
                      <StatusBadge status={job.status} type="status" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                      <span>Audience: <strong className="text-slate-300">{job.target_audience}</strong></span>
                      <span>•</span>
                      <span>Tone: <strong className="text-slate-300">{job.tone}</strong></span>
                      <span>•</span>
                      <span>Objective: <strong className="text-slate-300">{job.objective}</strong></span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {formats.map((fmt) => (
                        <StatusBadge key={fmt} status={fmt} type="format" />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center font-mono text-xs">
                    <div className="text-right text-slate-500 text-[11px] hidden lg:block">
                      <div>{new Date(job.created_at).toLocaleDateString()}</div>
                      <div>{new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>

                    <button
                      onClick={() => navigate(`/results/${job.id}`)}
                      className="bg-tactical-cyan/15 hover:bg-tactical-cyan/25 text-tactical-cyan border border-tactical-cyan/40 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <span>View Results</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 text-xs font-mono">
            No transformation records matched your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
