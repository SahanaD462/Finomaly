"use client";

import React, { useState } from "react";
import { Navbar, TabType } from "@/components/Navbar";
import { LandingSection } from "@/components/LandingSection";
import { DashboardSection } from "@/components/DashboardSection";
import { FirewallSection } from "@/components/FirewallSection";
import { AttackLabSection } from "@/components/AttackLabSection";
import { HistorySection } from "@/components/HistorySection";
import { SystemInfoSection } from "@/components/SystemInfoSection";
import { VerdictModal } from "@/components/VerdictModal";
import { INITIAL_DEMO_EVENTS, LoggedEvent } from "@/lib/storage/mock-data";
import { FirewallRequest, FirewallVerdict } from "@/types/firewall";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<TabType>("landing");
  const [events, setEvents] = useState<LoggedEvent[]>(INITIAL_DEMO_EVENTS);
  const [inspectingVerdict, setInspectingVerdict] = useState<FirewallVerdict | null>(null);

  const handleRecordAnalyzed = (request: FirewallRequest, verdict: FirewallVerdict) => {
    const summary = request.requestType === "transfer" && request.amount
      ? `Transfer $${request.amount} to ${request.recipient || "unknown"}`
      : request.userPrompt.substring(0, 48) + (request.userPrompt.length > 48 ? "..." : "");

    const newEvent: LoggedEvent = {
      id: verdict.request_id,
      timestamp: "Just now",
      requestSummary: summary,
      verdict: verdict.verdict,
      riskLevel: verdict.risk_level,
      threatCategory: verdict.threat_category,
      intent: verdict.intent,
      verdictData: verdict,
      isLive: true,
    };

    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleClearHistory = () => {
    setEvents([]);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Cybersecurity Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        historyCount={events.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === "landing" && (
          <LandingSection onNavigate={setCurrentTab} />
        )}

        {currentTab === "dashboard" && (
          <DashboardSection
            events={events}
            onNavigate={setCurrentTab}
            onInspectVerdict={setInspectingVerdict}
          />
        )}

        {currentTab === "firewall" && (
          <FirewallSection onRecordAnalyzed={handleRecordAnalyzed} />
        )}

        {currentTab === "attack_lab" && (
          <AttackLabSection
            onRecordAnalyzed={handleRecordAnalyzed}
            onInspectVerdict={setInspectingVerdict}
          />
        )}

        {currentTab === "history" && (
          <HistorySection
            events={events}
            onClearHistory={handleClearHistory}
            onInspectVerdict={setInspectingVerdict}
          />
        )}

        {currentTab === "system_info" && (
          <SystemInfoSection />
        )}
      </main>

      {/* Structured Verdict Inspection Modal */}
      <VerdictModal
        verdict={inspectingVerdict}
        onClose={() => setInspectingVerdict(null)}
      />
    </div>
  );
}
