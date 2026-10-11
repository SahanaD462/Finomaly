"use client";

import React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Clock,
  ExternalLink,
} from "lucide-react";
import { LoggedEvent } from "@/lib/storage/mock-data";
import { VerdictBadge, RiskBadge, ThreatCategoryBadge } from "./VerdictBadge";
import { TabType } from "./Navbar";
import { FirewallVerdict } from "@/types/firewall";

interface DashboardSectionProps {
  events: LoggedEvent[];
  onNavigate: (tab: TabType) => void;
  onInspectVerdict: (verdict: FirewallVerdict) => void;
}

export function DashboardSection({
  events,
  onNavigate,
  onInspectVerdict,
}: DashboardSectionProps) {
  // Compute dynamic stats based on base mock data + session events
  const totalBase = 1482;
  const approvedBase = 1298;
  const blockedBase = 156;
  const highRiskBase = 28;

  const liveEvents = events.filter((e) => e.isLive);
  const liveApproved = liveEvents.filter((e) => e.verdict === "APPROVED").length;
  const liveBlocked = liveEvents.filter((e) => e.verdict === "BLOCKED").length;
  const liveReview = liveEvents.filter((e) => e.verdict === "REVIEW").length;

  const totalCount = totalBase + liveEvents.length;
  const approvedCount = approvedBase + liveApproved;
  const blockedCount = blockedBase + liveBlocked;
  const reviewCount = highRiskBase + liveReview;

  const approvalRate = ((approvedCount / totalCount) * 100).toFixed(1);
  const blockedRate = ((blockedCount / totalCount) * 100).toFixed(1);

  // Category counts
  const threatCategories = [
    { label: "Prompt Injection", count: 78 + liveEvents.filter((e) => e.threatCategory === "PROMPT_INJECTION").length, color: "bg-red-500" },
    { label: "Memo Injection", count: 32 + liveEvents.filter((e) => e.threatCategory === "MEMO_INJECTION").length, color: "bg-orange-500" },
    { label: "Jailbreaks & Roleplay", count: 24 + liveEvents.filter((e) => e.threatCategory === "JAILBREAK").length, color: "bg-pink-500" },
    { label: "Obfuscated Payloads", count: 18 + liveEvents.filter((e) => e.threatCategory === "OBFUSCATION").length, color: "bg-cyan-500" },
    { label: "Invalid Parameters", count: 16 + liveEvents.filter((e) => e.threatCategory === "INVALID_PARAMETERS").length, color: "bg-amber-500" },
    { label: "Ambiguous Requests", count: 14 + liveEvents.filter((e) => e.threatCategory === "AMBIGUOUS_REQUEST").length, color: "bg-blue-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
              Security Telemetry &amp; Intelligence
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time inspection telemetry across simulated financial endpoints. Baseline figures update dynamically upon analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("firewall")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold font-mono transition"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Analyze Request</span>
          </button>
          <button
            onClick={() => onNavigate("attack_lab")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold font-mono transition"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            <span>Attack Lab</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inspected */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#0B1120] relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Requests Inspected</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-white">
            {totalCount.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-emerald-400 font-mono">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>100% evaluated via deterministic engine</span>
          </div>
        </div>

        {/* Approved */}
        <div className="p-4 rounded-xl border border-emerald-900/30 bg-[#0A161C] relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Requests Approved</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
            {approvedCount.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-slate-400 font-mono">
            <span>{approvalRate}% approval rate</span>
          </div>
        </div>

        {/* Blocked */}
        <div className="p-4 rounded-xl border border-red-900/30 bg-[#170C12] relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Requests Blocked</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-red-400">
            {blockedCount.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-red-400 font-mono">
            <span>{blockedRate}% intercepted &amp; neutralized</span>
          </div>
        </div>

        {/* Review / High Risk */}
        <div className="p-4 rounded-xl border border-amber-900/30 bg-[#16120B] relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>High-Risk / Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-amber-400">
            {reviewCount.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-amber-400/90 font-mono">
            <span>Ambiguous parameters or threshold</span>
          </div>
        </div>
      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Category Breakdown */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-800 bg-[#0B1120] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                Threat Category Distribution
              </h2>
              <p className="text-xs text-slate-400">Neutralized adversary vectors categorized by security rules</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Cumulative Telemetry</span>
          </div>

          <div className="space-y-3 pt-2">
            {threatCategories.map((cat, idx) => {
              const maxVal = 100;
              const widthPct = Math.min(100, Math.max(12, (cat.count / maxVal) * 100));
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">{cat.label}</span>
                    <span className="text-slate-400 font-bold">{cat.count} events</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.color}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verdict Ratio & Security Health */}
        <div className="p-5 rounded-xl border border-slate-800 bg-[#0B1120] space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Enforcement Ratio
            </h2>
            <p className="text-xs text-slate-400">Deterministic verdict proportions</p>

            <div className="my-6 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40">
                <span className="text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Approved Requests
                </span>
                <span className="font-bold text-emerald-400">{approvalRate}%</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-red-950/20 border border-red-900/40">
                <span className="text-red-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  Blocked Threats
                </span>
                <span className="font-bold text-red-400">{blockedRate}%</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40">
                <span className="text-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Review / Warning
                </span>
                <span className="font-bold text-amber-400">
                  {((reviewCount / totalCount) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#070B14] border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
            <div className="text-cyan-400 font-semibold flex items-center gap-1">
              <span>●</span> Fail-Closed Status: 100% Operational
            </div>
            <div>Action Gate: execution_permitted is strictly false.</div>
          </div>
        </div>
      </div>

      {/* Recent Security Requests Table */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#0B1120] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Recent Security Events Log
            </h2>
            <p className="text-xs text-slate-400">
              Latest financial prompts inspected by the firewall. Click Inspect to review raw audit decisions.
            </p>
          </div>
          <button
            onClick={() => onNavigate("history")}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
          >
            <span>View Full Verdict History</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Request Summary</th>
                <th className="py-2.5 px-3">Threat Category</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Verdict</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {events.slice(0, 7).map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                    {evt.isLive && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5 animate-pulse" />
                    )}
                    {evt.timestamp}
                  </td>
                  <td className="py-3 px-3 text-slate-200 max-w-xs truncate font-sans">
                    {evt.requestSummary}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <ThreatCategoryBadge category={evt.threatCategory} />
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <RiskBadge risk={evt.riskLevel} />
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <VerdictBadge verdict={evt.verdict} />
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    {evt.verdictData ? (
                      <button
                        onClick={() => onInspectVerdict(evt.verdictData!)}
                        className="p-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-[11px] font-mono inline-flex items-center gap-1"
                        title="View JSON Verdict"
                      >
                        <span>JSON</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    ) : (
                      <span className="text-slate-600 text-[11px]">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
