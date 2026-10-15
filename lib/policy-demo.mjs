/** A deliberately local illustration of the starter YAML, never an execution API. */
export function demoDecision(action, amount = 600, external = true, environment = "production") {
  if (action === "file.delete" && environment === "production") return { outcome: "BLOCK", rule: "production_delete", reason: "Deletes in production are blocked." };
  if (action === "email.send" && external) return { outcome: "HOLD", rule: "external_email", reason: "An email leaving your organisation needs approval." };
  if (action === "payment.send" && amount > 500) return { outcome: "HOLD", rule: "large_payment", reason: `$${amount.toLocaleString("en-US")} exceeds your $500 approval limit.` };
  return { outcome: "ALLOW", rule: "default", reason: "No hold or block rule matched. This action can run." };
}
export const DEMO_POLICY = `version: 1
default: ALLOW
scoring: shadow
rules:
  - id: large_payment
    action: payment.send
    when: { amount: { gt: 500 } }
    outcome: HOLD
    timeout: 900
  - id: production_delete
    action: file.delete
    when: { environment: production }
    outcome: BLOCK
  - id: external_email
    action: email.send
    when: { external: true }
    outcome: HOLD`;
