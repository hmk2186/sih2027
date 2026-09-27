import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  CheckSquare, 
  Clock, 
  ShieldAlert, 
  Settings, 
  FileText,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ pendingCount = 0 }) {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/create', label: 'New Transformation', icon: Sparkles, highlight: true },
    { to: '/review', label: 'Review & Approvals', icon: CheckSquare, badge: pendingCount > 0 ? pendingCount : null },
    { to: '/history', label: 'Transform History', icon: Clock },
    { to: '/audit', label: 'Security Audit Logs', icon: ShieldAlert },
    { to: '/settings', label: 'System & Clearance', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-defense-900 border-r border-defense-800 flex flex-col justify-between p-4 min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-mono tracking-wider text-slate-500 uppercase px-3 mb-2">
            OPERATIONAL MODULES
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-tactical-cyan/15 text-tactical-cyan border border-tactical-cyan/40 font-semibold'
                        : item.highlight
                        ? 'bg-defense-800 text-tactical-cyan hover:bg-defense-700/80 border border-tactical-cyan/20'
                        : 'text-slate-300 hover:bg-defense-800/80 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Intelligence Sources Summary Card */}
        <div className="bg-defense-950 p-3.5 rounded-xl border border-defense-800">
          <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold mb-1">
            <Layers className="w-4 h-4 text-tactical-cyan" />
            <span>Supported Deliverables</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Synthesizes raw intelligence into 7 cross-domain operational formats instantly.
          </p>
          <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
            <span className="bg-defense-800 text-slate-300 px-2 py-0.5 rounded">Advisories</span>
            <span className="bg-defense-800 text-slate-300 px-2 py-0.5 rounded">Exec Briefs</span>
            <span className="bg-defense-800 text-slate-300 px-2 py-0.5 rounded">Video Scripts</span>
            <span className="bg-defense-800 text-slate-300 px-2 py-0.5 rounded">Infographics</span>
            <span className="bg-defense-800 text-slate-300 px-2 py-0.5 rounded">Socials</span>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="pt-4 border-t border-defense-800 text-[11px] text-slate-400 flex flex-col gap-1 font-mono">
        <div className="flex items-center justify-between">
          <span>NTRO / SIH 2026</span>
          <span className="text-emerald-400">v1.0-STABLE</span>
        </div>
        <p className="text-[10px] text-slate-400">Secured with Human-in-the-Loop</p>
      </div>
    </aside>
  );
}
