import { NextRequest, NextResponse } from "next/server";
import { processFirewallRequest } from "@/lib/security/pipeline";
import { FirewallRequest, RequestType } from "@/types/firewall";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const requestType: RequestType = ["balance_inquiry", "transaction_history", "transfer", "general_banking"].includes(body.requestType)
      ? body.requestType
      : "general_banking";

    const request: FirewallRequest = {
      id: body.id || `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      requestType,
      userPrompt: typeof body.userPrompt === "string" ? body.userPrompt : "",
      paymentMemo: typeof body.paymentMemo === "string" ? body.paymentMemo : undefined,
      amount: typeof body.amount === "number" ? body.amount : (body.amount ? parseFloat(body.amount) : undefined),
      recipient: typeof body.recipient === "string" ? body.recipient : undefined,
    };

    const enableLLM = body.enableLLMAdvisory === true;
    const verdict = await processFirewallRequest(request, enableLLM);

    return NextResponse.json({
      success: true,
      request,
      verdict,
    });
  } catch (error) {
    // Fail closed on any server error
    return NextResponse.json(
      {
        success: false,
        error: "Internal security engine exception. Fail-closed safeguard enforced.",
        verdict: {
          request_id: `err-${Date.now()}`,
          timestamp: new Date().toISOString(),
          verdict: "BLOCKED",
          risk_level: "CRITICAL",
          threat_category: "UNAUTHORIZED_OVERRIDE",
          intent: "UNKNOWN",
          checks: [
            {
              name: "engine_integrity_check",
              status: "FAIL",
              reason: "Security pipeline encountered an unexpected parsing error. Failing closed.",
            },
          ],
          rationale: "Pipeline exception occurred during processing. Fail-closed policy triggered.",
          execution_permitted: false,
          action_gate: {
            eligible_for_simulation: false,
            reasons: ["Pipeline exception - fail-closed enforced."],
            action_type: "NONE",
            parameters_verified: false,
            guardrail_notes: "Action strictly rejected due to engine integrity error.",
          },
          normalized_input: {
            prompt: "",
            obfuscation_detected: true,
          },
          policy_metadata: {
            policy_version: "2026.04-FINOMALY-CORE",
            engine: "DETERMINISTIC_RULES_ENGINE_V2",
          },
        },
      },
      { status: 500 }
    );
  }
}
