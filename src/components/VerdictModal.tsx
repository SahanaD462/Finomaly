"use client";

import React from "react";
import { X, Shield, Terminal } from "lucide-react";
import { FirewallVerdict } from "@/types/firewall";
import { JsonViewer } from "./JsonViewer";
import { VerdictBadge, RiskBadge, ThreatCategoryBadge } from "./VerdictBadge";

interface VerdictModalProps {
  verdict: FirewallVerdict | null;
  onClose: () => void;
}

export function VerdictModal({ verdict, onClose }: VerdictModalProps) {
  if (!verdict) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-slate-800 bg-[#0B1120] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#0D1527]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-sm font-semibold text-white">
              Inspection Dossier: {verdict.request_id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Quick Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-[#070B14] border border-slate-800">
            <div className="flex items-center gap-2">
              <VerdictBadge verdict={verdict.verdict} />
              <RiskBadge risk={verdict.risk_level} />
              <ThreatCategoryBadge category={verdict.threat_category} />
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {new Date(verdict.timestamp).toLocaleTimeString()}
            </span>
          </div>

          {/* Rationale */}
          <div className="space-y-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Decision Rationale:
            </div>
            <p className="text-xs text-slate-200 font-mono bg-[#070B14] p-3 rounded-lg border border-slate-800/80 leading-relaxed">
              {verdict.rationale}
            </p>
          </div>

          {/* JSON Viewer */}
          <JsonViewer data={verdict} title={`Verdict Payload (${verdict.request_id})`} />
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#0D1527] flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">execution_permitted: false</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
