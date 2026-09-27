import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, KeyRound, Lock, UserCheck, AlertCircle, Radio } from 'lucide-react';
import { api } from '../api';

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('analyst');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    { username: 'analyst', label: 'Dr. Vikram Sethi', role: 'Analyst', clearance: 'SECRET', desc: 'Creates sources & generates deliverables' },
    { username: 'reviewer', label: 'Col. Anita Nair', role: 'Reviewer / Approver', clearance: 'TOP SECRET', desc: 'Conducts verification & clearance approval' },
    { username: 'comms', label: 'Meera Sen', role: 'Communications Officer', clearance: 'CONFIDENTIAL', desc: 'Prepares public advisories & social threads' },
    { username: 'admin', label: 'Rajesh Sharma', role: 'System Admin', clearance: 'TOP SECRET', desc: 'System configuration & audit trail' },
  ];

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.login(username, password);
      onLoginSuccess(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Authentication failed. Ensure backend server is active at https://sih2027-2.onrender.com.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-defense-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Emblem & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-tactical-cyan/15 border border-tactical-cyan/40 flex items-center justify-center text-tactical-cyan mx-auto mb-4 shadow-xl shadow-tactical-cyan/10">
            <Shield className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-black tracking-wider text-white font-mono">ACTIS PORTAL</h1>
          <p className="text-xs text-tactical-cyan font-mono mt-1">NATIONAL TECHNICAL RESEARCH ORGANISATION</p>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-defense-900 border border-defense-800 px-3 py-1 rounded-full text-[11px] font-mono text-slate-400">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>GovNet Secure Terminal // PS 26154</span>
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-defense-900 border border-defense-800 rounded-2xl p-6 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Demo Profiles */}
          <div className="mb-6">
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-2">
              SELECT DEMO OPERATOR PROFILE:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => {
                    setUsername(acc.username);
                    setPassword('demo123');
                  }}
                  className={`p-2.5 rounded-lg border text-left transition ${
                    username === acc.username
                      ? 'bg-tactical-cyan/15 border-tactical-cyan/50 text-tactical-cyan'
                      : 'bg-defense-950 border-defense-800 text-slate-400 hover:text-slate-200 hover:border-defense-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-white leading-tight truncate">{acc.label}</div>
                  <div className="text-[10px] font-mono text-tactical-cyan">{acc.role}</div>
                  <div className="text-[9px] font-mono text-slate-500 mt-1 uppercase">{acc.clearance}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
                Operator Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-defense-950 border border-defense-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tactical-cyan font-mono"
                  placeholder="e.g. analyst"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
                Passcode / Token
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-defense-950 border border-defense-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tactical-cyan font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-tactical-cyan hover:bg-cyan-400 text-defense-950 font-bold py-2.5 px-4 rounded-lg text-xs font-mono transition flex items-center justify-center gap-2 shadow-lg shadow-tactical-cyan/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-defense-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>AUTHENTICATING WITH GOVNET...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>SECURE SIGN IN</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-6 font-mono">
          ACTIS PS 26154 // National Technical Research Organisation
        </p>
      </div>
    </div>
  );
}
