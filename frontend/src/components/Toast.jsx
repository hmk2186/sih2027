import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
          error: <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />,
          info: <Info className="w-4 h-4 text-tactical-cyan flex-shrink-0" />
        };
        const borders = {
          success: 'border-emerald-500/40 bg-defense-900',
          warning: 'border-amber-500/40 bg-defense-900',
          error: 'border-rose-500/40 bg-defense-900',
          info: 'border-tactical-cyan/40 bg-defense-900'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-lg border shadow-xl flex items-start justify-between gap-3 text-xs ${borders[toast.type || 'info']} transition-all animate-in fade-in slide-in-from-bottom-2`}
          >
            <div className="flex items-start gap-2.5">
              {icons[toast.type || 'info']}
              <div>
                {toast.title && <div className="font-semibold text-white mb-0.5">{toast.title}</div>}
                <div className="text-slate-300 leading-relaxed">{toast.message}</div>
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
