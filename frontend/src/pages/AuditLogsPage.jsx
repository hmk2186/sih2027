import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Download, 
  RefreshCw, 
  Filter, 
  Radio, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { api } from '../api';
import StatusBadge from '../components/StatusBadge';

export default function AuditLogsPage({ onToast }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [exporting, setExporting] = useState(false);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await api.getAuditLogs(actionFilter, resourceFilter, 100);
      setLogs(data);
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [actionFilter, resourceFilter]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const exportData = await api.exportAuditTrail();
      const blob = new Blob([exportData.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NTRO_ACTIS_Audit_Trail_${new Date().toISOString().slice(0,10)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      onToast?.({
        type: 'success',
        title: 'Audit Trail Exported',
        message: `Successfully downloaded ${exportData.record_count} immutable log entries.`
      });
    } catch (err) {
      onToast?.({
        type: 'error',
        title: 'Export Failed',
        message: err.message
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-defense-900 border border-defense-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-rose-500/15 text-rose-400 px-2.5 py-0.5 rounded border border-rose-500/30">
                TAMPER-EVIDENT COMPLIANCE
              </span>
              <span className="text-xs font-mono text-slate-400">NTRO CYBER SECURITY DIRECTIVE</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Security & Operational Audit Logs
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Immutable chronological record of all system events, source ingestions, AI generations, and clearance decisions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="bg-defense-950 hover:bg-defense-800 border border-defense-700 text-slate-200 px-4 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-tactical-cyan" />
              <span>{exporting ? 'Exporting...' : 'Export Audit Log'}</span>
            </button>
            <button
              onClick={loadLogs}
              className="p-2 rounded-lg bg-defense-950 hover:bg-defense-800 border border-defense-700 text-slate-300 transition"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-defense-900 border border-defense-800 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-mono text-slate-400">Resource:</span>
            <select
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
              className="bg-defense-950 border border-defense-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-tactical-cyan font-mono"
            >
              <option value="">All Resources</option>
              <option value="SOURCE">SOURCE</option>
              <option value="JOB">JOB</option>
              <option value="OUTPUT">OUTPUT</option>
              <option value="AUTH">AUTH</option>
              <option value="SYSTEM">SYSTEM</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Action:</span>
            <input
              type="text"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              placeholder="e.g. REVIEW_APPROVE"
              className="bg-defense-950 border border-defense-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-tactical-cyan font-mono"
            />
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          Showing {logs.length} logged events
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-defense-900 border border-defense-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-defense-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-defense-800">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Clearance</th>
                <th className="py-3 px-4">Details & Forensics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-defense-800/60">
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-defense-850/40 transition">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toISOString().replace('T', ' ').slice(0, 19)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action.includes('APPROVE')
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : log.action.includes('REVISE') || log.action.includes('REQUEST')
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-tactical-cyan/15 text-tactical-cyan border border-tactical-cyan/30'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-white font-medium">{log.actor_name}</div>
                      <div className="text-[10px] text-slate-500">{log.role}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-slate-300 font-bold">{log.resource_type}</span>
                      {log.resource_id && <span className="text-slate-500"> #{log.resource_id}</span>}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={log.clearance_level} type="clearance" />
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-md">
                      <div className="line-clamp-2">{log.details}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">IP: {log.ip_address}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No audit records match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
