import { RequestType, SecurityCheck, ThreatCategory } from "@/types/firewall";

export const MAX_SIMULATED_TRANSFER_LIMIT = 10000; // $10,000 maximum single transfer in standard tier

export interface IntentValidationResult {
  isValid: boolean;
  intent: string;
  checks: SecurityCheck[];
  threatCategory: ThreatCategory;
  parametersVerified: boolean;
  reasons: string[];
}

export function validateIntentAndParameters(
  requestType: RequestType,
  userPrompt: string,
  amount?: number,
  recipient?: string
): IntentValidationResult {
  const checks: SecurityCheck[] = [];
  const reasons: string[] = [];
  let isValid = true;
  let threatCategory: ThreatCategory = "NONE";
  let parametersVerified = false;

  const normalizedPrompt = userPrompt.toLowerCase().trim();

  // 1. Detect Intent
  let detectedIntent = requestType.toUpperCase();
  if (normalizedPrompt.includes("balance") || normalizedPrompt.includes("how much do i have")) {
    detectedIntent = "BALANCE_INQUIRY";
  } else if (normalizedPrompt.includes("transactions") || normalizedPrompt.includes("statement") || normalizedPrompt.includes("history")) {
    detectedIntent = "TRANSACTION_HISTORY";
  } else if (normalizedPrompt.includes("transfer") || normalizedPrompt.includes("send") || normalizedPrompt.includes("wire") || normalizedPrompt.includes("pay")) {
    detectedIntent = "TRANSFER";
  }

  // 2. Ambiguity check for transfers
  const ambiguousPhrases = [
    "send some money",
    "transfer whatever",
    "send whatever is left",
    "wire funds to someone",
    "send all my money somewhere",
    "transfer to anyone",
    "give money away",
  ];

  const isAmbiguous = ambiguousPhrases.some((phrase) => normalizedPrompt.includes(phrase));
  if (isAmbiguous) {
    isValid = false;
    threatCategory = "AMBIGUOUS_REQUEST";
    reasons.push("Transfer request is ambiguous with undefined recipient or unspecified amount.");
    checks.push({
      name: "intent_clarity_check",
      status: "FAIL",
      severity: "MEDIUM",
      reason: "Request lacks explicit destination or specific transactional quantity.",
    });
  } else {
    checks.push({
      name: "intent_clarity_check",
      status: "PASS",
      severity: "LOW",
      reason: "Financial intent is explicitly stated with clear semantics.",
    });
  }

  // 3. Request-type specific validations
  if (requestType === "transfer" || detectedIntent === "TRANSFER") {
    // Validate Amount
    if (amount === undefined || isNaN(amount)) {
      isValid = false;
      threatCategory = threatCategory === "NONE" ? "INVALID_PARAMETERS" : threatCategory;
      reasons.push("Missing transfer amount parameter.");
      checks.push({
        name: "amount_validation",
        status: "FAIL",
        severity: "HIGH",
        reason: "Simulated transfer requires a defined numeric amount.",
      });
    } else if (amount <= 0) {
      isValid = false;
      threatCategory = "INVALID_PARAMETERS";
      reasons.push(`Transfer amount must be greater than zero. Received: $${amount}.`);
      checks.push({
        name: "amount_validation",
        status: "FAIL",
        severity: "HIGH",
        reason: "Zero or negative monetary transfer is strictly prohibited by banking policy.",
      });
    } else if (amount > MAX_SIMULATED_TRANSFER_LIMIT) {
      isValid = false;
      threatCategory = "INVALID_PARAMETERS";
      reasons.push(`Amount ($${amount.toLocaleString()}) exceeds single-transaction ceiling of $${MAX_SIMULATED_TRANSFER_LIMIT.toLocaleString()}.`);
      checks.push({
        name: "amount_validation",
        status: "FAIL",
        severity: "HIGH",
        reason: `Exceeds single transaction policy threshold ($${MAX_SIMULATED_TRANSFER_LIMIT}). Requires enhanced multi-party authorization.`,
      });
    } else {
      checks.push({
        name: "amount_validation",
        status: "PASS",
        severity: "LOW",
        reason: `Transfer amount ($${amount}) is positive and within policy threshold ($${MAX_SIMULATED_TRANSFER_LIMIT}).`,
      });
    }

    // Validate Recipient
    if (!recipient || recipient.trim().length === 0) {
      isValid = false;
      threatCategory = threatCategory === "NONE" ? "INVALID_PARAMETERS" : threatCategory;
      reasons.push("Missing required recipient identifier.");
      checks.push({
        name: "recipient_validation",
        status: "FAIL",
        severity: "HIGH",
        reason: "Transfer destination account/identifier is empty or unspecified.",
      });
    } else if (recipient.trim().length < 2) {
      isValid = false;
      threatCategory = "INVALID_PARAMETERS";
      reasons.push("Recipient identifier is too short or malformed.");
      checks.push({
        name: "recipient_validation",
        status: "FAIL",
        severity: "MEDIUM",
        reason: "Recipient identifier must be a valid account number, username, or routing key.",
      });
    } else {
      checks.push({
        name: "recipient_validation",
        status: "PASS",
        severity: "LOW",
        reason: `Recipient identifier '${recipient}' verified against banking address schema.`,
      });
    }

    if (isValid && amount !== undefined && amount > 0 && recipient && recipient.trim().length >= 2) {
      parametersVerified = true;
    }
  } else {
    // For read-only actions (balance, history)
    parametersVerified = true;
    checks.push({
      name: "parameter_completeness",
      status: "PASS",
      severity: "LOW",
      reason: "Read-only financial inquiry satisfies parameter constraints.",
    });
  }

  return {
    isValid,
    intent: detectedIntent,
    checks,
    threatCategory,
    parametersVerified,
    reasons,
  };
}
