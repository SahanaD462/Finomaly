"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Check,
  AlertTriangle,
  Info,
  Terminal,
} from "lucide-react";
import { ATTACK_SCENARIOS } from "@/lib/security/scenarios";
import { processFirewallRequest } from "@/lib/security/pipeline";
import { AttackScenario, FirewallVerdict, FirewallRequest } from "@/types/firewall";
import { VerdictBadge, RiskBadge, ThreatCategoryBadge } from "./VerdictBadge";

interface AttackLabSectionProps {
  onRecordAnalyzed: (request: FirewallRequest, verdict: FirewallVerdict) => void;
  onInspectVerdict: (verdict: FirewallVerdict) => void;
}

interface TestRunResult {
  actualVerdict: FirewallVerdict;
  passed: boolean;
  runAt: string;
}

export function AttackLabSection({
  onRecordAnalyzed,
  onInspectVerdict,
}: AttackLabSectionProps) {
  const [results, setResults] = useState<Record<string, TestRunResult>>({});
  const [runningAll, setRunningAll] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);

  const runSingleScenario = async (scenario: AttackScenario) => {
    setRunningId(scenario.id);
    try {
      const request: FirewallRequest = {
        id: `lab-${scenario.id}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...scenario.request,
      };

      const verdict = await processFirewallRequest(request);

      // Strict validation: Passed ONLY IF verdict === expectedVerdict AND threat_category === expectedThreatCategory
      const passed =
        verdict.verdict === scenario.expectedVerdict &&
        verdict.threat_category === scenario.expectedThreatCategory;

      setResults((prev) => ({
        ...prev,
        [scenario.id]: {
          actualVerdict: verdict,
          passed,
          runAt: new Date().toLocaleTimeString(),
        },
      }));

      onRecordAnalyzed(request, verdict);
    } finally {
      setRunningId(null);
    }
  };

  const runAllScenarios = async () => {
    setRunningAll(true);
    for (const scenario of ATTACK_SCENARIOS) {
      await runSingleScenario(scenario);
      // Small delay for UI smoothness
      await new Promise((res) => setTimeout(res, 60));
    }
    setRunningAll(false);
  };

  const handleResetResults = () => {
    setResults({});
  };

  // Metrics computation
  const totalScenarios = ATTACK_SCENARIOS.length;
  const executedCount = Object.keys(results).length;
  const passedCount = Object.values(results).filter((r) => r.passed).length;
  const failedCount = executedCount - passedCount;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
              Adversarial Attack Lab
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-950 text-purple-300 border border-purple-800/40">
              {totalScenarios} Automated Scenarios
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Validate the firewall against prompt injection, authority jailbreaks, memo injections, homoglyph obfuscation, and parameter violations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {executedCount > 0 && (
            <button
              onClick={handleResetResults}
              disabled={runningAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Results</span>
            </button>
          )}

          <button
            onClick={runAllScenarios}
            disabled={runningAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold text-xs font-mono transition shadow-glow"
          >
            {runningAll ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Running Suite ({executedCount}/{totalScenarios})...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Run All {totalScenarios} Tests</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Lab Telemetry / Pass-Fail Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-xl border border-slate-800 bg-[#0B1120]">
          <div className="text-[11px] font-mono text-slate-400">Total Scenarios</div>
          <div className="text-xl font-mono font-bold text-white mt-1">{totalScenarios}</div>
          <div className="text-[10px] text-slate-500 font-mono">10 required + 2 edge cases</div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-[#0B1120]">
          <div className="text-[11px] font-mono text-slate-400">Executed in Session</div>
          <div className="text-xl font-mono font-bold text-cyan-400 mt-1">
            {executedCount} / {totalScenarios}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {executedCount === totalScenarios ? "Full test suite executed" : "Partial suite run"}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-900/30 bg-[#0A161C]">
          <div className="text-[11px] font-mono text-slate-400">Security Tests Passed</div>
          <div className="text-xl font-mono font-bold text-emerald-400 mt-1">{passedCount}</div>
          <div className="text-[10px] text-emerald-400 font-mono">
            {executedCount > 0 ? `${((passedCount / executedCount) * 100).toFixed(0)}% accuracy rate` : "Awaiting execution"}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-red-900/30 bg-[#170C12]">
          <div className="text-[11px] font-mono text-slate-400">Discrepancies / Failed</div>
          <div className="text-xl font-mono font-bold text-red-400 mt-1">{failedCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">
            {failedCount === 0 ? "Zero false classifications" : "Requires tuning"}
          </div>
        </div>
      </div>

      {/* Scenarios List */}
      <div className="space-y-3">
        {ATTACK_SCENARIOS.map((scenario, idx) => {
          const res = results[scenario.id];
          const isRunning = runningId === scenario.id;

          return (
            <div
              key={scenario.id}
              className={`p-4 rounded-xl border transition ${
                res
                  ? res.passed
                    ? "border-emerald-500/40 bg-[#0A161C]"
                    : "border-red-500/50 bg-[#170C12]"
                  : "border-slate-800 bg-[#0B1120] hover:border-slate-700"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Scenario details */}
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 font-bold">
                      #{idx + 1}
                    </span>
                    <h2 className="text-sm font-semibold text-white font-mono">
                      {scenario.name}
                    </h2>
                    <ThreatCategoryBadge category={scenario.category} />
                    <span className="text-[11px] font-mono text-slate-400">
                      Expected: <strong className="text-slate-200">{scenario.expectedVerdict}</strong> ({scenario.expectedRisk})
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    {scenario.description}
                  </p>

                  <div className="p-2 rounded bg-[#070B14] border border-slate-800/80 font-mono text-[11px] text-slate-300">
                    <span className="text-cyan-400">&gt; Prompt: </span>
                    "{scenario.request.userPrompt}"
                    {scenario.request.paymentMemo && (
                      <div className="text-amber-300 mt-0.5">
                        &gt; Memo: "{scenario.request.paymentMemo}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Outcome & Action */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                  {res ? (
                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono text-xs space-y-0.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-slate-400 text-[11px]">Actual:</span>
                          <VerdictBadge verdict={res.actualVerdict.verdict} />
                        </div>
                        <div className="flex items-center justify-end gap-1 text-[11px]">
                          {res.passed ? (
                            <span className="flex items-center gap-1 text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              TEST PASSED
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-400 font-bold">
                              <XCircle className="w-3.5 h-3.5" />
                              TEST FAILED
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onInspectVerdict(res.actualVerdict)}
                        className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono border border-slate-700"
                        title="View JSON Verdict"
                      >
                        Inspect JSON
                      </button>
                    </div>
                  ) : null}

                  <button
                    onClick={() => runSingleScenario(scenario)}
                    disabled={isRunning || runningAll}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-mono border border-slate-700 transition"
                  >
                    {isRunning ? (
                      <>
                        <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-cyan-400 fill-current" />
                        <span>Run Test</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded explanation */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-start gap-1.5">
                <Info className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                <span>Security Engine Rule: {scenario.explanation}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
