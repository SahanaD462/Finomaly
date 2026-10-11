# Finomaly# Finomaly — AI Firewall for Secure Financial Intelligence

**Chosen Vertical:** AI Security & FinTech
**Project Type:** AI-powered banking security prototype

## 1. Project Overview

Finomaly is an AI banking firewall designed to identify malicious prompts, prompt injection attacks, jailbreak attempts, and suspicious payment instructions before they can influence a financial action.

As banking systems increasingly incorporate AI-powered assistants and automated workflows, untrusted user inputs can become a security risk. Attackers may attempt to override system rules, manipulate payment instructions, access sensitive information, or bypass required validation.

Finomaly addresses this challenge through a layered security pipeline that combines threat detection, input validation, and deterministic policy enforcement. It provides explainable security verdicts through an interactive dashboard, allowing users to understand why a request is approved, blocked, or flagged for review.

**Core principle:** AI can assist with understanding a request, but deterministic security rules remain the final authority.

## 2. Chosen Vertical

### AI Security & FinTech

Finomaly operates at the intersection of artificial intelligence, cybersecurity, and financial technology.

The project focuses on securing AI-assisted banking workflows against threats such as:

* **Prompt injection:** Instructions designed to override established security rules.
* **Jailbreak attempts:** Attempts to bypass restrictions by impersonating an administrator or using roleplay.
* **Payment memo injection:** Malicious instructions embedded in transaction descriptions or payment memos.
* **Sensitive-data exposure:** Attempts to obtain confidential customer information or hidden system instructions.
* **Parameter manipulation:** Invalid amounts, missing recipients, ambiguous requests, or attempts to bypass transaction limits.
* **Obfuscated attacks:** Suspicious instructions disguised through encoding or unusual text patterns.

This vertical was chosen because financial workflows require strong authorization, reliable validation, and clear accountability. Finomaly demonstrates how a dedicated security layer can help protect these workflows before an action is permitted.

## 3. Approach and Logic

Finomaly follows a **defense-in-depth approach**, using multiple checks rather than relying on a single keyword, an AI classification, or a language model's judgment.

### Security pipeline

`Untrusted Input → Normalization → Threat Detection → Intent and Parameter Validation → Deterministic Policy Engine → JSON Verdict → Simulated Action Gate`

**Step 1 — Input normalization**

The system receives a banking request and, where applicable, a payment memo, transfer amount, and recipient. Input is normalized to help identify suspicious patterns and inconsistent formatting.

**Step 2 — Threat detection**

The request and payment memo are inspected for suspicious instructions, policy overrides, jailbreak attempts, requests for hidden instructions, potential data-exfiltration attempts, and relevant obfuscation patterns.

Payment memos are treated as untrusted data, not as instructions that can change the application's security policies.

**Step 3 — Intent and parameter validation**

The system identifies the request type, such as a balance inquiry, transaction-history request, simulated transfer, or general banking request.

For transfers, validation checks include:

* A valid positive amount.
* A recipient being provided.
* Supported request parameters.
* Applicable configured transfer limits.
* Sufficiently clear information to evaluate the request.

Incomplete, ambiguous, or invalid requests must not proceed to the simulated action stage.

**Step 4 — Deterministic policy enforcement**

A deterministic policy engine evaluates the threat findings and validation results. This engine is the final decision-making authority.

A request that violates a security rule is blocked even if an optional AI component considers it safe. If a required security check fails or cannot be completed, the system is designed to fail closed rather than assume the request is safe.

**Step 5 — Explainable JSON verdict**

The system generates a structured verdict containing information such as:

* Request identifier.
* Security verdict and risk level.
* Threat category and detected intent.
* Individual security-check results.
* Explanation for the decision.
* Execution permission status.

The verdict schema uses the following categories:

| Field           | Possible values                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Verdict         | `APPROVED`, `BLOCKED`, `REVIEW`                                                                                                          |
| Risk level      | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`                                                                                                      |
| Threat category | `NONE`, `PROMPT_INJECTION`, `JAILBREAK`, `MEMO_INJECTION`, `DATA_EXFILTRATION`, `OBFUSCATION`, `INVALID_PARAMETERS`, `AMBIGUOUS_REQUEST` |

**Step 6 — Simulated action gate**

The final gate separates security evaluation from action execution. A request can be considered eligible for a simulated workflow only after the required checks pass.

The prototype never executes real financial transactions. The public verdict must keep `execution_permitted` set to `false` for every request.

## 4. How the Solution Works

Finomaly provides an interactive web interface for examining banking requests and observing the security decisions made by the firewall.

### A. Landing Page

Introduces the product, its purpose, and its security capabilities. Users can navigate to the Security Console or Attack Lab.

### B. Security Dashboard

Displays security statistics, including requests inspected, approved, blocked, and classified as high risk. It also provides recent security events, threat-category breakdowns, and request history.

Dashboard statistics are based on the prototype's demo data and analyzed requests, not live banking activity.

### C. Request Firewall

Users enter a banking request and optionally provide payment details or a memo. After selecting **Analyze Request**, the system evaluates the input through the security pipeline and presents an explainable verdict alongside its structured JSON representation.

The dashboard statistics and session history are updated to reflect the analysis.

### D. Attack Lab

Provides benign and adversarial test scenarios to demonstrate how the firewall responds to different inputs. Scenarios include normal banking requests, legitimate simulated transfers, prompt injection, jailbreaks, malicious payment memos, sensitive-data requests, obfuscated instructions, and incomplete transfers.

Individual scenarios can be tested, and results can be compared with their expected security outcomes.

### E. Verdict History

Allows users to review requests analyzed during the current session, filter results by security status, and inspect individual JSON verdicts.

Only non-sensitive demonstration data should be retained.

### F. System Information

Explains the security architecture, the role of deterministic rules, the simulated action boundary, and the limitations of the detection approach.

## 5. Assumptions and Scope

The prototype is built around the following assumptions:

1. **Simulated banking environment:** All banking requests and transactions are demonstrations. No real bank accounts, money transfers, or banking credentials are involved.

2. **Untrusted input:** User requests, payment memos, and any model-generated interpretations are treated as potentially untrusted.

3. **Deterministic rules take priority:** An AI model, if used, can help interpret language but cannot override security policies or independently authorize a financial action.

4. **Validation is required:** Transfer parameters must satisfy the configured validation and policy requirements before a request can qualify for a simulated action.

5. **Fail-closed behavior:** Requests that fail required checks, contain invalid parameters, or cannot be safely evaluated should not be allowed to proceed.

6. **Prototype data:** Dashboard figures and scenario results represent demonstration or session-level activity, not production banking telemetry.

7. **No assumption of perfect detection:** The system aims to identify relevant attack patterns but cannot guarantee detection of every possible attack or eliminate all false positives and false negatives.

8. **Optional AI integration:** The core security logic should function without requiring a paid AI API. If an external model is integrated, its output must be validated and treated as untrusted.

## 6. Security Limitations and Future Scope

Finomaly demonstrates a security architecture rather than a production-ready banking firewall.

Potential limitations include:

* Previously unseen or sophisticated prompt injection techniques.
* False positives involving legitimate requests.
* False negatives involving novel or heavily obfuscated attacks.
* The need for stronger testing against a broader set of attack patterns.
* The need for independent security review before any real-world deployment.

Future improvements could include expanded adversarial testing, continuously maintained threat patterns, stronger audit logging, integration with authenticated banking services in a controlled environment, and independent security assessments.

Any production integration would require additional authorization controls, monitoring, privacy protections, and compliance review.

## 7. Expected Outcome

Finomaly demonstrates how AI-assisted banking workflows can be protected by placing a dedicated security layer between untrusted input and a potential financial action.

By combining threat detection, deterministic validation, explainable verdicts, and a simulated action gate, the project illustrates a practical principle for secure financial AI:

**Understand the request, verify it against policy, and never let untrusted instructions override security controls.**
