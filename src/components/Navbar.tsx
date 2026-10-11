"use client";

import React from "react";
import { Shield, ShieldAlert, Cpu, Activity, History, Info, Terminal } from "lucide-react";

export type TabType = "landing" | "dashboard" | "firewall" | "attack_lab" | "history" | "system_info";

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  historyCount: number;
}

export function Navbar({ currentTab, onSelectTab, historyCount }: NavbarProps) {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "landing", label: "Home", icon: <Shield className="w-4 h-4" /> },
    { id: "dashboard", label: "Security Dashboard", icon: <Activity className="w-4 h-4" /> },
    { id: "firewall", label: "Request Firewall", icon: <Cpu className="w-4 h-4" /> },
    { id: "attack_lab", label: "Attack Lab", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: "history", label: "Verdict History", icon: <History className="w-4 h-4" />, badge: historyCount },
    { id: "system_info", label: "Architecture & Defense", icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#070B14]/90 backdrop-blur-md">
      {/* Top Banner Notice */}
      <div className="bg-[#0B1324] border-b border-slate-800/80 px-4 py-1 text-center text-[11px] text-slate-400 font-mono flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
          <Terminal className="w-3 h-3" />
          SIMULATED BANKING FIREWALL DEMO
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="hidden sm:inline text-slate-400">
          Non-custodial zero-trust security pipeline. Never connect real credentials or real bank accounts.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark */}
          <button
            onClick={() => onSelectTab("landing")}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-glow">
              <div className="w-full h-full bg-[#070B14] rounded-[7px] flex items-center justify-center group-hover:bg-[#070B14]/80 transition-colors">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white font-mono">
                  FINOMALY<span className="text-cyan-400">.</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                  v2026.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">AI Banking Firewall</p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    active
                      ? "bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-700 text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Firewall Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1527] border border-slate-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline">
                FIREWALL ENFORCING
              </span>
            </div>

            <button
              onClick={() => onSelectTab("firewall")}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-cyan-500 hover:bg-cyan-400 text-black font-mono transition shadow-glow"
            >
              Analyze Request
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-2 border-t border-slate-800/80 -mx-4 px-4 scrollbar-none">
          {navItems.map((item) => {
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium ${
                  active
                    ? "bg-slate-800 text-cyan-300 border border-slate-700"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-700 text-slate-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
