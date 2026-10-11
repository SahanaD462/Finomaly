export type RequestType = 
  | "balance_inquiry" 
  | "transaction_history" 
  | "transfer" 
  | "general_banking";

export type Verdict = "APPROVED" | "BLOCKED" | "REVIEW";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ThreatCategory = 
  | "NONE" 
  | "PROMPT_INJECTION" 
  | "JAILBREAK" 
  | "MEMO_INJECTION" 
  | "DATA_EXFILTRATION" 
  | "OBFUSCATION" 
  | "INVALID_PARAMETERS" 
  | "AMBIGUOUS_REQUEST" 
  | "SYSTEM_PROMPT_EXTRACTION"
  | "UNAUTHORIZED_OVERRIDE";

export type CheckStatus = "PASS" | "FAIL" | "WARN";

export interface SecurityCheck {
  name: string;
  status: CheckStatus;
  reason: string;
  details?: string;
  severity?: RiskLevel;
}

export interface FirewallRequest {
  id: string;
  timestamp: string;
  requestType: RequestType;
  userPrompt: string;
  paymentMemo?: string;
  amount?: number;
  recipient?: string;
}

export interface SimulatedActionGate {
  eligible_for_simulation: boolean;
  reasons: string[];
  action_type: string;
  parameters_verified: boolean;
  guardrail_notes: string;
}

export interface FirewallVerdict {
  request_id: string;
  timestamp: string;
  verdict: Verdict;
  risk_level: RiskLevel;
  threat_category: ThreatCategory;
  intent: string;
  checks: SecurityCheck[];
  rationale: string;
  execution_permitted: false; // ALWAYS FALSE - strictly enforced
  action_gate: SimulatedActionGate;
  normalized_input: {
    prompt: string;
    memo?: string;
    obfuscation_detected: boolean;
  };
  policy_metadata: {
    policy_version: string;
    engine: "DETERMINISTIC_RULES_ENGINE_V2";
    llm_advisory?: {
      invoked: boolean;
      model?: string;
      risk_suggestion?: string;
      reason?: string;
      overruled_by_policy: boolean;
    };
  };
}

export interface AttackScenario {
  id: string;
  name: string;
  category: ThreatCategory;
  description: string;
  request: {
    requestType: RequestType;
    userPrompt: string;
    paymentMemo?: string;
    amount?: number;
    recipient?: string;
  };
  expectedVerdict: Verdict;
  expectedRisk: RiskLevel;
  expectedThreatCategory: ThreatCategory;
  explanation: string;
}
