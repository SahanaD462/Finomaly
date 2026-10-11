"use client";

import React, { useState } from "react";
import {
  History,
  Trash2,
  Filter,
  Search,
  ExternalLink,
  Shield,
  AlertOctagon,
} from "lucide-react";
import { LoggedEvent } from "@/lib/storage/mock-data";
import { VerdictBadge, RiskBadge, ThreatCategoryBadge } from "./VerdictBadge";
import { FirewallVerdict } from "@/types/firewall";

interface HistorySectionProps {
  events: LoggedEvent[];
  onClearHistory: () => void;
  onInspectVerdict: (verdict: FirewallVerdict) => void;
}

export function HistorySection({
  events,
  onClearHistory,
  onInspectVerdict,
}: HistorySectionProps) {
  const [filter, setFilter] = useState<"ALL" | "APPROVED" | "BLOCKED" | "REVIEW">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  // Filter events
  const filteredEvents = events.filter((e) => {
    if (filter === "APPROVED" && e.verdict !== "APPROVED") return false;
    if (filter === "BLOCKED" && e.verdict !== "BLOCKED") return false;
    if (filter === "REVIEW" && e.verdict !== "REVIEW") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.requestSummary.toLowerCase().includes(q) ||
        e.threatCategory.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
              Verdict Session History
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/40">
              {events.length} Total Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Audit trail of prompts and decisions analyzed during this session. Only non-sensitive simulated payloads are stored.
          </p>
        </div>

        {/* Clear History with Confirmation */}
        <div>
          {confirmClear ? (
            <div className="flex items-center gap-2 bg-red-950/60 p-1.5 rounded-lg border border-red-800/50">
              <span className="text-xs text-red-300 font-mono">Clear all session records?</span>
              <button
                onClick={() => {
                  onClearHistory();
                  setConfirmClear(false);
                }}
                className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-mono"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              disabled={events.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/40 hover:text-red-300 hover:border-red-800/50 text-slate-400 text-xs font-mono border border-slate-700 transition disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-slate-800 bg-[#0B1120]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-2">
            <Filter className="w-3 h-3 text-cyan-400" /> Filter:
          </span>
          {(["ALL", "APPROVED", "BLOCKED", "REVIEW"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-3 py-1 rounded text-xs font-mono transition ${
                filter === opt
                  ? "bg-slate-700 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {opt === "ALL" ? "All Requests" : opt}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompt, category..."
            className="w-full sm:w-60 bg-[#070B14] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* History Table or Empty State */}
      {filteredEvents.length > 0 ? (
        <div className="rounded-xl border border-slate-800 bg-[#0B1120] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono bg-[#0D1527]">
                  <th className="py-3 px-4">Request ID &amp; Time</th>
                  <th className="py-3 px-4">Prompt Summary</th>
                  <th className="py-3 px-4">Intent</th>
                  <th className="py-3 px-4">Threat Category</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4 text-right">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      <div className="font-semibold text-slate-300">{evt.id}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        {evt.isLive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        )}
                        {evt.timestamp}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-200 max-w-sm truncate font-sans">
                      {evt.requestSummary}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {evt.intent}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <ThreatCategoryBadge category={evt.threatCategory} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <RiskBadge risk={evt.riskLevel} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <VerdictBadge verdict={evt.verdict} />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {evt.verdictData ? (
                        <button
                          onClick={() => onInspectVerdict(evt.verdictData!)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-xs font-mono inline-flex items-center gap-1 border border-slate-700"
                        >
                          <span>Inspect JSON</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-slate-600 text-xs">Baseline Data</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-xl border border-dashed border-slate-800 bg-[#0B1120]/40 text-center space-y-2">
          <AlertOctagon className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-mono text-white font-semibold">No Matching Records</h3>
          <p className="text-xs text-slate-400">
            No session events matched your active filter or search query.
          </p>
        </div>
      )}
    </div>
  );
}
