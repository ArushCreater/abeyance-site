import { emailFrom, isSandboxSender, leadRecipients, sendEmail } from "@/lib/email";
import { validatePartner, type PartnerRequest } from "@/lib/partners";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;

/* Rate limit ------------------------------------------------------------ */

// Best-effort only: this map lives in one serverless instance's memory, so
// limits reset on cold starts and are not shared between instances.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
  const entry = hits.get(ip);
  if (!entry || entry.reset <= now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= MAX_REQUESTS) return { ok: false, retryAfter: Math.ceil((entry.reset - now) / 1000) };
  entry.count++;
  return { ok: true };
}

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip")?.trim() || "unknown"
  );
}

/* Body ------------------------------------------------------------------ */

/** Reads the body as text, giving up once it passes the limit. */
async function readBody(req: Request): Promise<string | null> {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return null;
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}

const json = (body: unknown, init?: ResponseInit) => Response.json(body, init);

/* Handler --------------------------------------------------------------- */

export async function POST(req: Request) {
  const limit = rateLimit(clientIp(req));
  if (!limit.ok) {
    return json({ ok: false, error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }

  if (!req.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return json({ ok: false, error: "unsupported_media_type" }, { status: 415 });
  }

  const raw = await readBody(req);
  if (raw === null) return json({ ok: false, error: "payload_too_large" }, { status: 413 });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const input = body as Record<string, unknown>;

  // Honeypot: people never see the website field. Pretend it worked.
  if (typeof input.website === "string" && input.website.trim()) return json({ ok: true });

  const result = validatePartner(input);
  if (!result.ok) return json({ ok: false, errors: result.errors }, { status: 400 });
  const lead = result.value;

  const receivedAt = new Date().toISOString();
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  const to = leadRecipients();
  if (!to.length) {
    console.error("[partners] ABEYANCE_LEADS_TO is not set; lead not sent", JSON.stringify({ ...lead, receivedAt }));
    return json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const sent = await sendEmail({
    to,
    subject: `Design partner request: ${lead.company}`,
    text: teamText(lead, receivedAt, userAgent),
    replyTo: lead.email,
  });
  if (!sent.ok) {
    // Keep the lead in the logs so it isn't lost.
    console.error(`[partners] lead notification failed (${sent.error})`, JSON.stringify({ ...lead, receivedAt, userAgent }));
    return sent.error === "not_configured"
      ? json({ ok: false, error: "not_configured" }, { status: 503 })
      : json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  // Resend's sandbox only delivers to the account owner, so skip confirmations there.
  if (!isSandboxSender()) {
    const confirm = await sendEmail({
      to: lead.email,
      subject: "We have your request",
      text: confirmText(lead),
      html: confirmHtml(lead),
    });
    if (!confirm.ok) console.error(`[partners] confirmation to submitter failed (${confirm.error}) from ${emailFrom()}`);
  }

  return json({ ok: true });
}

/* Email bodies ---------------------------------------------------------- */

function teamText(lead: PartnerRequest, receivedAt: string, userAgent: string) {
  return [
    "New design partner request.",
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Company: ${lead.company}`,
    `Team: ${lead.team ?? "-"}`,
    `Stage: ${lead.stage ?? "-"}`,
    "",
    "Never without asking:",
    lead.never ?? "-",
    "",
    `Received: ${receivedAt}`,
    `User agent: ${userAgent}`,
    "",
    "Reply to this email to write back to them.",
  ].join("\n");
}

const firstName = (name: string) => name.split(" ")[0];

function confirmText(lead: PartnerRequest) {
  return [
    `Thanks, ${firstName(lead.name)}.`,
    "",
    `We have your design partner request for ${lead.company}. One of the founders will write back within two working days.`,
    "",
    "Abeyance",
  ].join("\n");
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function confirmHtml(lead: PartnerRequest) {
  const name = escapeHtml(firstName(lead.name));
  const company = escapeHtml(lead.company);
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0b0b0c;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0c;">
      <tr>
        <td style="padding:48px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#ece8e1;">
            <tr><td style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#eba43f;padding-bottom:20px;">Received</td></tr>
            <tr><td style="font-size:28px;font-weight:300;line-height:1.2;padding-bottom:20px;">Held for a person.</td></tr>
            <tr><td style="font-size:16px;line-height:1.6;color:#b5b2ab;padding-bottom:28px;">Thanks, ${name}. We have your design partner request for ${company}. One of the founders will write back within two working days.</td></tr>
            <tr><td style="border-top:1px solid #26262a;padding-top:20px;font-size:13px;color:#77746e;">Abeyance</td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
