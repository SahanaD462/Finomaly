import { FirewallRequest, FirewallVerdict } from "@/types/firewall";
import { normalizeInput } from "./normalizer";
import { detectThreats } from "./threat-detector";
import { validateIntentAndParameters } from "./intent-validator";
import { evaluateDeterministicPolicy } from "./policy-engine";
import { getOptionalLLMAdvisory } from "./llm-provider";

export async function processFirewallRequest(
  request: FirewallRequest,
  enableLLMAdvisory: boolean = false
): Promise<FirewallVerdict> {
  // Step 1: Normalization
  const promptNorm = normalizeInput(request.userPrompt);
  const memoNorm = request.paymentMemo ? normalizeInput(request.paymentMemo) : undefined;

  // Step 2: Threat Detection
  const threatResult = detectThreats(promptNorm, memoNorm);

  // Step 3: Intent and Parameter Validation
  const intentResult = validateIntentAndParameters(
    request.requestType,
    promptNorm.normalized,
    request.amount,
    request.recipient
  );

  // Step 4: Optional LLM Advisory (only if requested, non-blocking fallback)
  let llmAdvisory = undefined;
  if (enableLLMAdvisory) {
    try {
      llmAdvisory = await getOptionalLLMAdvisory(promptNorm.normalized, memoNorm?.normalized);
    } catch {
      llmAdvisory = { invoked: false };
    }
  }

  // Step 5 & 6: Deterministic Policy Engine & Verdict Generation
  const verdict = evaluateDeterministicPolicy({
    requestId: request.id,
    promptNorm,
    memoNorm,
    threatResult,
    intentResult,
    llmAdvisory,
  });

  return verdict;
}
