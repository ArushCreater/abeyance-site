/**
 * The design-partner request: allowed values, limits and validation.
 * Shared by the form and the /api/partners route so the two cannot drift.
 */

export const TEAMS = ["AI / CoE", "Security", "Platform", "Operations", "Other"] as const;
export const STAGES = ["Exploring", "Piloting", "In production"] as const;

export const LIMITS = { name: 120, email: 254, company: 160, never: 2000 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PartnerField = "name" | "email" | "company" | "team" | "stage" | "never";
export type PartnerErrors = Partial<Record<PartnerField, string>>;

export type PartnerRequest = {
  name: string;
  email: string;
  company: string;
  team?: string;
  stage?: string;
  never?: string;
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
// One line only: names and companies end up in subjects and greetings.
const line = (v: unknown) => str(v).replace(/\s+/g, " ");

export function validatePartner(
  input: Record<string, unknown>,
): { ok: true; value: PartnerRequest } | { ok: false; errors: PartnerErrors } {
  const name = line(input.name);
  const email = str(input.email);
  const company = line(input.company);
  const team = str(input.team);
  const stage = str(input.stage);
  const never = str(input.never);

  const e: PartnerErrors = {};
  if (!name) e.name = "Tell us who we’re talking to.";
  else if (name.length > LIMITS.name) e.name = `Keep this under ${LIMITS.name} characters.`;
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) e.email = "That doesn’t look like an email address.";
  if (!company) e.company = "Which company is this for?";
  else if (company.length > LIMITS.company) e.company = `Keep this under ${LIMITS.company} characters.`;
  if (team && !(TEAMS as readonly string[]).includes(team)) e.team = "Pick one of the teams listed.";
  if (stage && !(STAGES as readonly string[]).includes(stage)) e.stage = "Pick one of the stages listed.";
  if (never.length > LIMITS.never) e.never = `Keep this under ${LIMITS.never.toLocaleString("en-US")} characters.`;

  if (Object.keys(e).length) return { ok: false, errors: e };
  return {
    ok: true,
    value: { name, email, company, team: team || undefined, stage: stage || undefined, never: never || undefined },
  };
}
