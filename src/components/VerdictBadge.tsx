"use client";

import React from "react";
import { Verdict, RiskLevel, ThreatCategory } from "@/types/firewall";

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  switch (verdict) {
    case "APPROVED":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
          APPROVED
        </span>
      );
    case "BLOCKED":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5" />
          BLOCKED
        </span>
      );
    case "REVIEW":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5" />
          REVIEW
        </span>
      );
    default:
      return null;
  }
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  switch (risk) {
    case "LOW":
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
          LOW RISK
        </span>
      );
    case "MEDIUM":
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950/60 text-amber-300 border border-amber-700/50">
          MEDIUM RISK
        </span>
      );
    case "HIGH":
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-orange-950/70 text-orange-300 border border-orange-700/50">
          HIGH RISK
        </span>
      );
    case "CRITICAL":
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-950/80 text-red-300 border border-red-700/60 font-mono">
          CRITICAL
        </span>
      );
    default:
      return null;
  }
}

export function ThreatCategoryBadge({ category }: { category: ThreatCategory }) {
  if (category === "NONE") {
    return (
      <span className="text-xs text-slate-400 font-mono">NONE</span>
    );
  }

  return (
    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/50 text-cyan-300 border border-cyan-800/40">
      {category}
    </span>
  );
}
