import React from 'react';
import { CheckCircle2, Clock, AlertCircle, RefreshCw, Shield, FileText, Video, Share2, Hash, Layout, Presentation } from 'lucide-react';

export default function StatusBadge({ status, type = "status" }) {
  if (type === "status") {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-medium font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-medium font-mono">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
      case 'CHANGES_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-500/15 text-rose-400 border border-rose-500/30 px-2.5 py-0.5 rounded-full text-xs font-medium font-mono">
            <AlertCircle className="w-3.5 h-3.5" />
            Changes Requested
          </span>
        );
      case 'PROCESSING':
      case 'QUEUED':
        return (
          <span className="inline-flex items-center gap-1 bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full text-xs font-medium font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Processing
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-medium font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full text-xs font-medium font-mono">
            {status}
          </span>
        );
    }
  }

  if (type === "format") {
    const config = {
      SECURITY_ADVISORY: { label: "Security Advisory", color: "text-rose-400 bg-rose-500/10 border-rose-500/30", icon: Shield },
      EXECUTIVE_SUMMARY: { label: "Executive Summary", color: "text-blue-400 bg-blue-500/10 border-blue-500/30", icon: FileText },
      LINKEDIN_POST: { label: "LinkedIn Post", color: "text-sky-400 bg-sky-500/10 border-sky-500/30", icon: Share2 },
      TWITTER_THREAD: { label: "X / Twitter Thread", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30", icon: Hash },
      INFOGRAPHIC: { label: "Infographic Blueprint", color: "text-amber-400 bg-amber-500/10 border-amber-500/30", icon: Layout },
      PRESENTATION: { label: "Presentation Deck", color: "text-purple-400 bg-purple-500/10 border-purple-500/30", icon: Presentation },
      VIDEO_PACKAGE: { label: "Video Package", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", icon: Video },
    };

    const item = config[status] || { label: status, color: "text-slate-300 bg-slate-800 border-slate-700", icon: FileText };
    const Icon = item.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${item.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {item.label}
      </span>
    );
  }

  if (type === "clearance") {
    const colors = {
      "TOP SECRET": "bg-red-500/20 text-red-300 border-red-500/40",
      "SECRET": "bg-amber-500/20 text-amber-300 border-amber-500/40",
      "CONFIDENTIAL": "bg-blue-500/20 text-blue-300 border-blue-500/40",
      "PUBLIC": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${colors[status] || "bg-slate-800 text-slate-300"}`}>
        {status}
      </span>
    );
  }

  return <span>{status}</span>;
}
