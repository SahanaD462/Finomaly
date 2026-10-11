"use client";

import React from "react";
import {
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  AlertTriangle,
  Lock,
  GitBranch,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";

export function SystemInfoSection() {
  const pipelineStages = [
    {
      step: "01",
      name: "Untrusted Input",
      desc: "Raw user NL prompt, payment memo, and financial parameters.",
      badge: "Ingestion",
      color: "border-slate-700 text-slate-300",
    },
    {
      step: "02",
      name: "Normalization",
      desc: "Homoglyph resolution, zero-width stripping, hex & base64 unmasking.",
      badge: "De-obfuscation",
      color: "border-cyan-800 text-cyan-300",
    },
    {
      step: "03",
      name: "Threat Detection",
      desc: "Prompt overrides, roleplay jailbreaks, system prompt extraction, exfil.",
      badge: "Heuristics",
      color: "border-red-800 text-red-300",
    },
    {
      step: "04",
      name: "Intent & Bounds Validation",
      desc: "Recipient verification, positive amounts, $10,000 threshold ceiling.",
      badge: "Parameter Gate",
      color: "border-amber-800 text-amber-300",
    },
    {
      step: "05",
      name: "Deterministic Policy Engine",
      desc: "Final immutable authority. Overrules advisory LLMs. Fails closed.",
      badge: "Core Authority",
      color: "border-emerald-800 text-emerald-300",
    },
    {
      step: "06",
      name: "Structured JSON Verdict",
      desc: "Deterministic verdict, risk score, granular checks breakdown.",
      badge: "Audit Schema",
      color: "border-blue-800 text-blue-300",
    },
    {
      step: "07",
      name: "Simulated Action Gate",
      desc: "Execution permitted is strictly false. Decoupled from execution.",
      badge: "Safe Boundary",
      color: "border-purple-800 text-purple-300",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
            System Architecture &amp; Defensive Design
          </h1>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/40">
            Defense-in-Depth Specification
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Technical specifications, policy engine invariants, and why deterministic rules must govern probabilistic AI in financial systems.
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="p-6 rounded-xl border border-slate-800 bg-[#0B1120] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
            Visual Defense Pipeline Flow
          </h2>
          <span className="text-xs font-mono text-emerald-400">Strictly Sequential • Fail-Closed</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 pt-2">
          {pipelineStages.map((stage, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border bg-[#070B14] flex flex-col justify-between space-y-2 relative ${stage.color}`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono opacity-80 mb-1">
                  <span>STEP {stage.step}</span>
                  <span className="px-1 rounded bg-slate-900 border border-slate-800">
                    {stage.badge}
                  </span>
                </div>
                <div className="text-xs font-bold font-mono text-white leading-tight">
                  {stage.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {stage.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Principle Comparison: LLM vs Deterministic Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Why LLMs Alone Cannot Authorize Transactions */}
        <div className="p-5 rounded-xl border border-slate-800 bg-[#0B1120] space-y-3">
          <div className="flex items-center gap-2 text-red-400">
            <XCircle className="w-4 h-4" />
            <h2 className="text-sm font-bold font-mono uppercase">
              The Fallacy of Probabilistic LLM Security
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Large Language Models are probabilistic next-token predictors. Even fine-tuned safety models suffer from:
          </p>
          <ul className="text-xs text-slate-400 space-y-2 font-mono list-disc list-inside">
            <li>
              <strong>Adversarial token bypass:</strong> Novel homoglyphs or multi-lingual jailbreaks can fool embedding spaces.
            </li>
            <li>
              <strong>Hallucination:</strong> An LLM can falsely believe an admin override token is valid or that a $500,000 transfer is permitted.
            </li>
            <li>
              <strong>Inconsistent boundaries:</strong> Temperature fluctuations can lead to different decisions for identical attack payloads.
            </li>
          </ul>
        </div>

        {/* Why Deterministic Policy Rules Are Non-Negotiable */}
        <div className="p-5 rounded-xl border border-emerald-900/40 bg-[#0A161C] space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h2 className="text-sm font-bold font-mono uppercase">
              The Finomaly Deterministic Policy Invariant
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In Finomaly, an AI model is only permitted to offer advisory intent classifications. The deterministic policy engine retains immutable authority:
          </p>
          <ul className="text-xs text-slate-300 space-y-2 font-mono list-disc list-inside">
            <li>
              <strong>Strict Overrule:</strong> If an LLM labels a prompt "SAFE" but deterministic checks detect an override pattern, the firewall immediately overrules the LLM and blocks the request.
            </li>
            <li>
              <strong>Hard Parameter Bounds:</strong> Monetary amounts must be strictly positive and under $10,000 ceiling.
            </li>
            <li>
              <strong>Untrusted Memos:</strong> Payment memos are strictly parsed as passive text, never as instructions.
            </li>
          </ul>
        </div>
      </div>

      {/* Fail-Closed & Known Limitations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fail-Closed Architecture */}
        <div className="p-5 rounded-xl border border-slate-800 bg-[#0B1120] space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
            <Lock className="w-4 h-4" />
            <span>Fail-Closed Resilience Principle</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            If any internal pipeline stage experiences an unexpected runtime error, memory limit, or regex timeout, Finomaly trips an automated circuit breaker.
          </p>
          <div className="p-3 rounded-lg bg-[#070B14] border border-slate-800 font-mono text-xs text-cyan-300">
            Default State: BLOCKED (Risk: CRITICAL)
            <br />
            Verdict: UNAUTHORIZED_OVERRIDE
            <br />
            Simulated Action: Rejected
          </div>
          <p className="text-[11px] text-slate-500">
            A secure banking system must always fail closed; an unhandled exception must never default to permissive execution.
          </p>
        </div>

        {/* Honest Limitations & Threat Boundaries */}
        <div className="p-5 rounded-xl border border-slate-800 bg-[#0B1120] space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-sm font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Documented Limitations &amp; Trade-offs</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            No firewall provides 100% heuristic coverage. Finomaly documents these architectural boundaries:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 font-mono list-disc list-inside">
            <li>
              <strong>Novel multi-step social engineering:</strong> Conversational context spanning multiple sessions requires stateful conversational memory.
            </li>
            <li>
              <strong>False positives on legitimate technical memos:</strong> If a developer transfers money with memo "Fixing script bug", regex heuristics may trigger review.
            </li>
            <li>
              <strong>Non-custodial simulation:</strong> This system does not handle private keys, customer PINs, or real ACH clearing houses.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
