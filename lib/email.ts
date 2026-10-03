import "server-only";
import { Resend } from "resend";

/**
 * Outbound email through Resend. Server only: reads RESEND_API_KEY.
 *
 * Without a verified domain, Resend only delivers from onboarding@resend.dev,
 * and only to the Resend account owner's own address.
 */

const DEFAULT_FROM = "Abeyance <onboarding@resend.dev>";

export const emailFrom = () => process.env.EMAIL_FROM?.trim() || DEFAULT_FROM;

/** Team addresses that receive lead notifications (ABEYANCE_LEADS_TO, comma-separated). */
export const leadRecipients = () =>
  (process.env.ABEYANCE_LEADS_TO ?? "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

/** True when sending from Resend's sandbox domain, which only delivers to the account owner. */
export function isSandboxSender() {
  const from = emailFrom();
  const address = from.match(/<([^>]+)>/)?.[1] ?? from;
  const domain = address.split("@")[1]?.trim().toLowerCase() ?? "";
  return domain === "resend.dev" || domain.endsWith(".resend.dev");
}

export type SendResult = { ok: true; id: string } | { ok: false; error: string };

let client: Resend | null = null;

export async function sendEmail({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.error("[email] RESEND_API_KEY is not set; email not sent");
    return { ok: false, error: "not_configured" };
  }
  client ??= new Resend(key);

  try {
    const { data, error } = await client.emails.send({ from: emailFrom(), to, subject, text, html, replyTo });
    if (error || !data) return { ok: false, error: error?.message ?? "unknown_error" };
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "unknown_error" };
  }
}
