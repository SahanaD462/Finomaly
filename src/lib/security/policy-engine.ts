import {
  FirewallVerdict,
  Verdict,
  RiskLevel,
  ThreatCategory,
  SecurityCheck,
} from "@/types/firewall";
import { NormalizationResult } from "./normalizer";
import { ThreatAnalysisResult } from "./threat-detector";
import { IntentValidationResult } from "./intent-validator";

export interface PolicyEvaluationInput {
  requestId: string;
  promptNorm: NormalizationResult;
  memoNorm?: NormalizationResult;
  threatResult: ThreatAnalysisResult;
  intentResult: IntentValidationResult;
  llmAdvisory?: {
    invoked: boolean;
    model?: string;
    risk_suggestion?: string;
    reason?: string;
  };
}

export function evaluateDeterministicPolicy(input: PolicyEvaluationInput): FirewallVerdict {
  const {
    requestId,
    promptNorm,
    memoNorm,
    threatResult,
    intentResult,
    llmAdvisory,
  } = input;

  const checks: SecurityCheck[] = [
    ...threatResult.checks,
    ...intentResult.checks,
  ];

  let verdict: Verdict = "APPROVED";
  let riskLevel: RiskLevel = "LOW";
  let threatCategory: ThreatCategory = "NONE";
  const rationaleParts: string[] = [];
  let eligibleForSimulation = false;
  let guardrailNotes = "";

  // 1. Critical Threat Gate
  if (threatResult.hasThreat) {
    verdict = "BLOCKED";
    riskLevel = threatResult.highestSeverity;
    threatCategory = threatResult.primaryCategory;

    const failedChecks = threatResult.checks.filter((c) => c.status === "FAIL");
    const reasons = failedChecks.map((c) => c.reason).join("; ");
    rationaleParts.push(`Deterministic threat rule triggered: ${reasons}`);
    guardrailNotes = "Blocked by core deterministic filter before parsing any execution logic.";
  }
  // 2. Intent and Parameter Gate
  else if (!intentResult.isValid) {
    threatCategory = intentResult.threatCategory;
    if (threatCategory === "AMBIGUOUS_REQUEST") {
      verdict = "REVIEW";
      riskLevel = "MEDIUM";
      rationaleParts.push(`Ambiguous intent detected: ${intentResult.reasons.join("; ")}`);
      guardrailNotes = "Request requires user clarification before financial evaluation.";
    } else {
      verdict = "BLOCKED";
      riskLevel = "HIGH";
      rationaleParts.push(`Parameter validation failed: ${intentResult.reasons.join("; ")}`);
      guardrailNotes = "Deterministic banking policy rejected request due to invalid or out-of-bounds parameters.";
    }
  }
  // 3. Approved Path
  else {
    verdict = "APPROVED";
    riskLevel = "LOW";
    threatCategory = "NONE";
    rationaleParts.push("Request is benign and satisfies all deterministic banking security rules and parameter bounds.");
    eligibleForSimulation = true;
    guardrailNotes = "Approved for simulation only. Real execution is permanently disabled by architecture.";
  }

  // 4. Overrule Check: If an LLM advisory exists and suggests 'safe' while deterministic rules flagged a threat,
  // the deterministic policy STRICTLY OVERRULES the LLM!
  let overruledByPolicy = false;
  if (llmAdvisory?.invoked) {
    if (threatResult.hasThreat && llmAdvisory.risk_suggestion === "LOW") {
      overruledByPolicy = true;
      rationaleParts.push("[SECURITY NOTICE] Advisory LLM suggested safe, but deterministic firewall strictly overruled it to enforce fail-closed policy.");
    }
  }

  // 5. Fail-closed safeguard
  // Ensure that no error state can result in APPROVED
  if (verdict === "APPROVED" && (!intentResult.parametersVerified || threatResult.hasThreat)) {
    verdict = "BLOCKED";
    riskLevel = "CRITICAL";
    threatCategory = "UNAUTHORIZED_OVERRIDE";
    eligibleForSimulation = false;
    rationaleParts.push("Fail-closed tripwire activated: Inconsistent state detected.");
  }

  return {
    request_id: requestId,
    timestamp: new Date().toISOString(),
    verdict,
    risk_level: riskLevel,
    threat_category: threatCategory,
    intent: intentResult.intent,
    checks,
    rationale: rationaleParts.join(" "),
    execution_permitted: false, // MANDATORY: Strictly false on every request
    action_gate: {
      eligible_for_simulation: eligibleForSimulation,
      reasons: intentResult.reasons.length > 0 ? intentResult.reasons : [guardrailNotes],
      action_type: intentResult.intent,
      parameters_verified: intentResult.parametersVerified,
      guardrail_notes: guardrailNotes,
    },
    normalized_input: {
      prompt: promptNorm.normalized,
      memo: memoNorm?.normalized,
      obfuscation_detected: promptNorm.obfuscationDetected || (memoNorm?.obfuscationDetected ?? false),
    },
    policy_metadata: {
      policy_version: "2026.04-FINOMALY-CORE",
      engine: "DETERMINISTIC_RULES_ENGINE_V2",
      llm_advisory: llmAdvisory
        ? {
            invoked: llmAdvisory.invoked,
            model: llmAdvisory.model,
            risk_suggestion: llmAdvisory.risk_suggestion,
            reason: llmAdvisory.reason,
            overruled_by_policy: overruledByPolicy,
          }
        : undefined,
    },
  };
}
