import React, { useState } from 'react';
import { Shield, User, ChevronDown, CheckCircle2, AlertTriangle, Radio, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ currentUser, onSwitchRole, onLogout }) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const navigate = useNavigate();

  const roles = [
    { role: 'Analyst', label: 'Dr. Vikram Sethi (Analyst)', level: 'SECRET' },
    { role: 'Reviewer', label: 'Col. Anita Nair (Reviewer / Approver)', level: 'TOP SECRET' },
    { role: 'Communications Officer', label: 'Meera Sen (Comms Lead)', level: 'CONFIDENTIAL' },
    { role: 'Admin', label: 'Rajesh Sharma (Sys Admin)', level: 'TOP SECRET' },
  ];

  return (
    <header className="bg-defense-900 border-b border-defense-800 sticky top-0 z-40 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left branding */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-tactical-cyan/20 to-blue-600/30 border border-tactical-cyan/50 flex items-center justify-center text-tactical-cyan shadow-lg shadow-tactical-cyan/10">
            <Shield className="w-6 h-6 animate-pulse text-tactical-cyan" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-lg text-white font-mono">ACTIS</span>
              <span className="text-[10px] bg-tactical-cyan/15 text-tactical-cyan px-2 py-0.5 rounded font-mono border border-tactical-cyan/30">
                PS 26154
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono hidden sm:inline">
                NTRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Automated Content Transformation & Intelligence System</p>
          </div>
        </div>

        {/* Center Live Network Badge */}
        <div className="hidden md:flex items-center gap-2 bg-defense-950 px-3 py-1.5 rounded-full border border-defense-800 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" />
          <span className="text-slate-400">STATUS:</span>
          <span className="text-emerald-400 font-semibold">GOVNET ACTIVE</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">NODE 10.14.0.24</span>
        </div>

        {/* Right Role Switcher & User Profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 bg-defense-950 hover:bg-defense-850 px-3 py-1.5 rounded-lg border border-defense-700 transition text-xs font-mono"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <div className="text-left">
                <div className="text-slate-200 font-medium leading-none">{currentUser?.full_name || 'Operator'}</div>
                <div className="text-[10px] text-tactical-cyan mt-0.5 font-bold uppercase tracking-wider">{currentUser?.role || 'Analyst'}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-defense-900 border border-defense-700 rounded-lg shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-defense-800 mb-1">
                  <p className="text-[11px] font-mono text-slate-400">SWITCH OPERATIONAL CLEARANCE</p>
                  <p className="text-xs text-slate-300 mt-0.5">Quickly change roles for SIH Hackathon Demo</p>
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      onSwitchRole(r.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs flex items-center justify-between transition ${
                      currentUser?.role === r.role ? 'bg-tactical-cyan/15 text-tactical-cyan border border-tactical-cyan/30' : 'hover:bg-defense-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{r.label}</div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Clearance: {r.level}</span>
                    </div>
                    {currentUser?.role === r.role && <CheckCircle2 className="w-4 h-4 text-tactical-cyan" />}
                  </button>
                ))}
                <div className="border-t border-defense-800 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
