import { SecurityCheck, ThreatCategory, RiskLevel } from "@/types/firewall";
import { NormalizationResult } from "./normalizer";

// Heuristic pattern definitions
interface ThreatPattern {
  name: string;
  category: ThreatCategory;
  severity: RiskLevel;
  pattern: RegExp;
  description: string;
}

const PROMPT_INJECTION_PATTERNS: ThreatPattern[] = [
  {
    name: "direct_instruction_override",
    category: "PROMPT_INJECTION",
    severity: "CRITICAL",
    pattern: /\b(?:ignore|disregard|forget|override|bypass|neglect)\s+(?:all\s+)?(?:prior|previous|preceding|above|former|earlier)?\s*(?:instructions|rules|prompts|guidelines|constraints|protocols|filters)\b/i,
    description: "Detected attempt to override or cancel preceding security instructions.",
  },
  {
    name: "safety_guideline_bypass",
    category: "PROMPT_INJECTION",
    severity: "CRITICAL",
    pattern: /\b(?:do not follow|stop adhering to|drop|suspend)\s+(?:safety|banking|security|policy|compliance)\s*(?:rules|filters|checks|guardrails)\b/i,
    description: "Detected explicit directive to suspend banking compliance guardrails.",
  },
  {
    name: "context_switch_directive",
    category: "PROMPT_INJECTION",
    severity: "HIGH",
    pattern: /\b(?:new\s+system\s+prompt|new\s+instruction|your\s+new\s+role\s+is|operating\s+mode\s+changed|system\s+update:)\b/i,
    description: "Detected simulated context switch or artificial system prompt injection.",
  },
];

const JAILBREAK_PATTERNS: ThreatPattern[] = [
  {
    name: "admin_authority_impersonation",
    category: "JAILBREAK",
    severity: "CRITICAL",
    pattern: /\b(?:i\s+am|acting\s+as)\s+(?:the\s+)?(?:system\s+admin(?:istrator)?|bank\s+auditor|chief\s+security\s+officer|compliance\s+director|root\s+user|superadmin)\b/i,
    description: "Detected unauthorized claim of administrative, auditor, or privileged bank authority.",
  },
  {
    name: "sudo_dan_roleplay",
    category: "JAILBREAK",
    severity: "CRITICAL",
    pattern: /\b(?:sudo\s+mode|dan\s+mode|developer\s+mode|unrestricted\s+mode|god\s+mode|jailbreak|jailbroken)\b/i,
    description: "Detected classic jailbreak persona or simulated privileged operational mode.",
  },
  {
    name: "hypothetical_simulation_exploit",
    category: "JAILBREAK",
    severity: "HIGH",
    pattern: /\b(?:in\s+a\s+fictional\s+world|for\s+educational\s+purposes\s+only|pretend\s+you\s+have\s+no\s+rules|in\s+hypothetical\s+mode)\b/i,
    description: "Detected roleplay framing designed to evade financial safety boundaries.",
  },
  {
    name: "emergency_override_bypass",
    category: "JAILBREAK",
    severity: "CRITICAL",
    pattern: /\b(?:emergency\s+authorization\s+code|override\s+code\s+99|bypass\s+two\s*factor|skip\s+verification|executive\s+privilege)\b/i,
    description: "Detected spoofed emergency override or verification bypass attempt.",
  },
];

const SYSTEM_PROMPT_PATTERNS: ThreatPattern[] = [
  {
    name: "system_prompt_exfiltration",
    category: "SYSTEM_PROMPT_EXTRACTION",
    severity: "HIGH",
    pattern: /\b(?:repeat(?:\s+back)?|reveal|show|display|print|output|dump)\b.*?\b(?:initial|hidden|system|confidential|developer|secret)?\s*(?:prompt|prompts|instructions|directives|rules|system\s+message)\b/i,
    description: "Detected request to disclose hidden firewall or application system prompts.",
  },
  {
    name: "internal_architecture_probing",
    category: "SYSTEM_PROMPT_EXTRACTION",
    severity: "HIGH",
    pattern: /\b(?:what\s+are\s+your\s+(?:exact\s+)?instructions|tell\s+me\s+what\s+you\s+were\s+told\s+to\s+do|what\s+is\s+written\s+above)\b/i,
    description: "Detected probing of internal guardrail instructions and meta-prompts.",
  },
];

const DATA_EXFILTRATION_PATTERNS: ThreatPattern[] = [
  {
    name: "database_or_pii_harvesting",
    category: "DATA_EXFILTRATION",
    severity: "CRITICAL",
    pattern: /\b(?:dump\s+database|show\s+all\s+(?:users|customers|passwords|ssn|social\s+security)|extract\s+credentials|select\s+\*\s+from\s+users)\b/i,
    description: "Detected attempt to dump sensitive banking records or customer PII.",
  },
  {
    name: "unauthorized_account_probing",
    category: "DATA_EXFILTRATION",
    severity: "HIGH",
    pattern: /\b(?:reveal|list|show)\s+(?:other\s+users'|vip|executive|all)\s*(?:balances|accounts|credit\s+cards|pins)\b/i,
    description: "Detected horizontal privilege violation attempting to inspect unauthorized accounts.",
  },
];

const MEMO_INJECTION_PATTERNS: ThreatPattern[] = [
  {
    name: "instruction_inside_memo",
    category: "MEMO_INJECTION",
    severity: "CRITICAL",
    pattern: /\b(?:ignore|override|bypass|authorize|skip|approve|system_exec|transfer\s+immediately|send\s+without\s+otp)\b/i,
    description: "Payment memo contains executable instructions or policy bypass commands.",
  },
  {
    name: "script_or_command_in_memo",
    category: "MEMO_INJECTION",
    severity: "CRITICAL",
    pattern: /<script|javascript:|;\s*drop\s+table|exec\s*\(|cmd\.exe|--|\/\*/i,
    description: "Payment memo contains embedded script tags or SQL command sequences.",
  },
];

export interface ThreatAnalysisResult {
  hasThreat: boolean;
  primaryCategory: ThreatCategory;
  highestSeverity: RiskLevel;
  checks: SecurityCheck[];
  threatCount: number;
}

export function detectThreats(
  promptNorm: NormalizationResult,
  memoNorm?: NormalizationResult
): ThreatAnalysisResult {
  const checks: SecurityCheck[] = [];
  let primaryCategory: ThreatCategory = "NONE";
  let highestSeverity: RiskLevel = "LOW";
  let threatCount = 0;

  const severityWeight: Record<RiskLevel, number> = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    CRITICAL: 4,
  };

  const updateSeverity = (cat: ThreatCategory, sev: RiskLevel) => {
    if (severityWeight[sev] > severityWeight[highestSeverity]) {
      highestSeverity = sev;
      primaryCategory = cat;
    } else if (severityWeight[sev] === severityWeight[highestSeverity] && primaryCategory === "NONE") {
      primaryCategory = cat;
    }
  };

  // 1. Obfuscation check from normalizer
  if (promptNorm.obfuscationDetected || (memoNorm && memoNorm.obfuscationDetected)) {
    const details = [
      ...promptNorm.obfuscationTypes,
      ...(memoNorm ? memoNorm.obfuscationTypes : []),
    ].join("; ");

    const hasUnderlyingOverride = /ignore|override|bypass|admin|sudo/i.test(promptNorm.normalized);
    const obfSeverity: RiskLevel = hasUnderlyingOverride ? "CRITICAL" : "HIGH";

    checks.push({
      name: "obfuscation_analysis",
      status: "FAIL",
      severity: obfSeverity,
      reason: "Suspicious encoding or homoglyph camouflage detected.",
      details,
    });
    highestSeverity = obfSeverity;
    primaryCategory = "OBFUSCATION";
    threatCount++;
  } else {
    checks.push({
      name: "obfuscation_analysis",
      status: "PASS",
      severity: "LOW",
      reason: "Input passed normalization with standard encoding and no hidden characters.",
    });
  }

  // 2. Prompt injection checks on prompt (both normalized and original)
  const fullPromptText = `${promptNorm.original} ${promptNorm.normalized} ${promptNorm.decodedPayloads.join(" ")}`;
  let injectionDetected = false;

  for (const rule of PROMPT_INJECTION_PATTERNS) {
    if (rule.pattern.test(fullPromptText)) {
      injectionDetected = true;
      checks.push({
        name: rule.name,
        status: "FAIL",
        severity: rule.severity,
        reason: rule.description,
      });
      if (primaryCategory !== "OBFUSCATION") {
        updateSeverity(rule.category, rule.severity);
      }
      threatCount++;
    }
  }

  if (!injectionDetected) {
    checks.push({
      name: "prompt_injection_check",
      status: "PASS",
      severity: "LOW",
      reason: "No prompt injection or instruction override patterns detected.",
    });
  }

  // 3. Jailbreak & roleplay authority claims
  let jailbreakDetected = false;
  for (const rule of JAILBREAK_PATTERNS) {
    if (rule.pattern.test(fullPromptText)) {
      jailbreakDetected = true;
      checks.push({
        name: rule.name,
        status: "FAIL",
        severity: rule.severity,
        reason: rule.description,
      });
      updateSeverity(rule.category, rule.severity);
      threatCount++;
    }
  }

  if (!jailbreakDetected) {
    checks.push({
      name: "jailbreak_authority_check",
      status: "PASS",
      severity: "LOW",
      reason: "No unauthorized roleplay, privilege escalation, or sudo commands found.",
    });
  }

  // 4. System prompt extraction
  let sysPromptDetected = false;
  for (const rule of SYSTEM_PROMPT_PATTERNS) {
    if (rule.pattern.test(fullPromptText)) {
      sysPromptDetected = true;
      checks.push({
        name: rule.name,
        status: "FAIL",
        severity: rule.severity,
        reason: rule.description,
      });
      updateSeverity(rule.category, rule.severity);
      threatCount++;
    }
  }

  if (!sysPromptDetected) {
    checks.push({
      name: "system_prompt_leak_check",
      status: "PASS",
      severity: "LOW",
      reason: "No requests to leak hidden system instructions or internal configurations.",
    });
  }

  // 5. Data exfiltration / PII probe
  let exfilDetected = false;
  for (const rule of DATA_EXFILTRATION_PATTERNS) {
    if (rule.pattern.test(fullPromptText)) {
      exfilDetected = true;
      checks.push({
        name: rule.name,
        status: "FAIL",
        severity: rule.severity,
        reason: rule.description,
      });
      updateSeverity(rule.category, rule.severity);
      threatCount++;
    }
  }

  if (!exfilDetected) {
    checks.push({
      name: "data_exfiltration_check",
      status: "PASS",
      severity: "LOW",
      reason: "No bulk credential dumping or customer PII harvesting signatures found.",
    });
  }

  // 6. Payment Memo Untrusted Inspection
  if (memoNorm && memoNorm.original.trim().length > 0) {
    const fullMemoText = `${memoNorm.original} ${memoNorm.normalized} ${memoNorm.decodedPayloads.join(" ")}`;
    let memoThreatFound = false;

    for (const rule of MEMO_INJECTION_PATTERNS) {
      if (rule.pattern.test(fullMemoText)) {
        memoThreatFound = true;
        checks.push({
          name: rule.name,
          status: "FAIL",
          severity: rule.severity,
          reason: rule.description,
          details: `Payload found in payment memo field: "${memoNorm.original.substring(0, 50)}"`,
        });
        updateSeverity("MEMO_INJECTION", rule.severity);
        threatCount++;
      }
    }

    if (!memoThreatFound) {
      checks.push({
        name: "memo_integrity_check",
        status: "PASS",
        severity: "LOW",
        reason: "Payment memo verified as benign passive text without executable instructions.",
      });
    }
  }

  return {
    hasThreat: threatCount > 0,
    primaryCategory,
    highestSeverity,
    checks,
    threatCount,
  };
}
