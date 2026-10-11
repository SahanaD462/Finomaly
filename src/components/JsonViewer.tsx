"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal, ShieldCheck } from "lucide-react";

interface JsonViewerProps {
  data: unknown;
  title?: string;
}

export function JsonViewer({ data, title = "Structured JSON Verdict" }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-[#090E1A] overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D1527] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>{title}</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
            <ShieldCheck className="w-2.5 h-2.5" />
            Verified Schema
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-mono"
          title="Copy formatted JSON payload"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy JSON</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto max-h-[380px] text-xs font-mono leading-relaxed">
        <pre className="text-slate-300">
          {jsonString.split("\n").map((line, idx) => {
            // Light syntax highlighting for JSON keys and values
            const isKey = line.includes('":');
            const isStringVal = /:\s*"[^"]*"/.test(line);
            const isBooleanOrNull = /:\s*(true|false|null)/.test(line);
            const isNumber = /:\s*[-0-9.]+/.test(line);

            let lineClass = "text-slate-300";
            if (line.includes('"verdict": "APPROVED"')) {
              lineClass = "text-emerald-400 font-bold";
            } else if (line.includes('"verdict": "BLOCKED"')) {
              lineClass = "text-red-400 font-bold";
            } else if (line.includes('"execution_permitted": false')) {
              lineClass = "text-cyan-400 font-semibold";
            } else if (isBooleanOrNull) {
              lineClass = "text-amber-400";
            } else if (isNumber) {
              lineClass = "text-sky-300";
            } else if (isStringVal) {
              lineClass = "text-slate-200";
            } else if (isKey) {
              lineClass = "text-cyan-300";
            }

            return (
              <div key={idx} className={`${lineClass} hover:bg-slate-800/40 px-1 -mx-1 rounded`}>
                {line}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
