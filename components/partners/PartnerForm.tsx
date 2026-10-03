"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { arrowClass, buttonClass } from "@/components/ui/button";
import { spring } from "@/lib/motion";
import { STAGES, TEAMS, validatePartner, type PartnerErrors } from "@/lib/partners";

const NEVER = ["Promise a refund", "Change bank details", "Email a regulator", "Close a complaint", "Delete records"];

type Errors = PartnerErrors;

export function PartnerForm() {
  const reduce = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [team, setTeam] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [never, setNever] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const showErrors = (e: Errors) => {
    setErrors(e);
    const first = (Object.keys(e) as (keyof Errors)[])[0];
    if (first) form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (sending) return;
    setFormError(null);
    const check = validatePartner({ name, email, company, team, stage, never });
    if (!check.ok) return showErrors(check.errors);
    setErrors({});

    setSending(true);
    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...check.value, website }),
      });
      const data: { ok?: boolean; errors?: Errors } | null = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setSent(true);
        requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
      } else if (res.status === 400 && data?.errors && Object.keys(data.errors).length) {
        showErrors(data.errors);
      } else if (res.status === 429) {
        setFormError("That’s a lot of requests in a short time. Try again in a few minutes.");
      } else {
        setFormError("We couldn’t send that. Try again in a moment.");
      }
    } catch {
      setFormError("We couldn’t send that. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  // Fixing a field clears its error straight away.
  const edit = (key: keyof Errors, set: (v: string) => void) => (v: string) => {
    set(v);
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const editChip = (key: "team" | "stage", set: (v: string | null) => void) => (v: string | null) => {
    set(v);
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleNever = (phrase: string) => {
    const parts = never.split(/\s*[,;\n]\s*/).map((p) => p.trim()).filter(Boolean);
    const has = parts.some((p) => p.toLowerCase() === phrase.toLowerCase());
    setNever((has ? parts.filter((p) => p.toLowerCase() !== phrase.toLowerCase()) : [...parts, phrase]).join(", "));
  };
  const neverHas = (phrase: string) => never.toLowerCase().includes(phrase.toLowerCase());

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!sent ? (
        <motion.form
          key="form"
          ref={form}
          noValidate
          onSubmit={onSubmit}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
          aria-label="Design partner request"
          className="relative border-t border-line"
        >
          <Row n="01" label="Your name" error={errors.name}>
            {(id, describedBy) => (
              <Input id={id} name="name" value={name} onChange={edit("name", setName)} autoComplete="name" placeholder="Priya Raman" describedBy={describedBy} invalid={!!errors.name} />
            )}
          </Row>
          <Row n="02" label="Work email" error={errors.email}>
            {(id, describedBy) => (
              <Input id={id} name="email" type="email" value={email} onChange={edit("email", setEmail)} autoComplete="email" placeholder="priya@company.com" describedBy={describedBy} invalid={!!errors.email} />
            )}
          </Row>
          <Row n="03" label="Company" error={errors.company}>
            {(id, describedBy) => (
              <Input id={id} name="company" value={company} onChange={edit("company", setCompany)} autoComplete="organization" placeholder="Acme Insurance" describedBy={describedBy} invalid={!!errors.company} />
            )}
          </Row>
          <Row n="04" label="Your team" optional group error={errors.team}>
            {(id) => <Chips id={id} options={TEAMS} value={team} onChange={editChip("team", setTeam)} />}
          </Row>
          <Row n="05" label="Where are your agents?" optional group error={errors.stage}>
            {(id) => <Chips id={id} options={STAGES} value={stage} onChange={editChip("stage", setStage)} />}
          </Row>
          <Row n="06" label="What should they never do without asking?" optional error={errors.never}>
            {(id, describedBy) => (
              <div>
                <textarea
                  id={id}
                  name="never"
                  value={never}
                  onChange={(e) => edit("never", setNever)(e.target.value)}
                  aria-invalid={!!errors.never || undefined}
                  aria-describedby={describedBy}
                  rows={2}
                  placeholder="Promise a refund over $500, change a customer’s bank details…"
                  className="field-sizing-content block min-h-[3.5rem] w-full resize-none bg-transparent pb-3 text-[1.0625rem] leading-relaxed text-ink placeholder:text-ink-4 focus:outline-none sm:text-lg"
                />
                <div className="mt-1 flex flex-wrap gap-2" aria-label="Suggestions">
                  {NEVER.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggleNever(p)}
                      aria-pressed={neverHas(p)}
                      className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
                        neverHas(p) ? "border-hold-line bg-hold-soft text-hold" : "border-line text-ink-3 hover:border-line-strong hover:text-ink-2"
                      }`}
                    >
                      {neverHas(p) ? "✓ " : "+ "}
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Row>

          {/* Honeypot for bots. Off-screen rather than display:none, which some bots skip. */}
          <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="partner-website">Website</label>
            <input
              id="partner-website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="flex flex-col-reverse gap-5 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-[38ch] text-ink-3">
              <p className="text-sm">We reply within two working days.</p>
              <p className="mt-2 text-[13px] leading-relaxed">
                By sending this, you agree to our{" "}
                <Link href="/legal/terms" className="text-ink-2 underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink-3">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/legal/privacy" className="text-ink-2 underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink-3">
                  Privacy Policy
                </Link>
                . We use these details only to reply to you.
              </p>
            </div>
            <button
              type="submit"
              disabled={sending}
              aria-busy={sending || undefined}
              className={buttonClass("primary", "!h-12 w-full !px-6 text-[15px] disabled:cursor-wait disabled:opacity-70 sm:w-auto")}
            >
              {sending ? (
                "Sending…"
              ) : (
                <>
                  Request a conversation <span aria-hidden className={arrowClass}>→</span>
                </>
              )}
            </button>
          </div>
          <AnimatePresence initial={false}>
            {formError && (
              <motion.p
                key={formError}
                role="alert"
                initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={spring.ui}
                className="mt-6 text-sm text-block"
              >
                {formError}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
      ) : (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.settle}
          role="status"
          className="border-t border-line pt-10"
        >
          <p className="label flex items-center gap-3 !text-hold">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 animate-breathe rounded-full bg-hold/60" />
              <span className="relative size-2 rounded-full bg-hold" />
            </span>
            Received
          </p>
          <h2 className="display-tight mt-5 text-[clamp(2.4rem,5vw,3.5rem)] font-[300]">Held for a person.</h2>
          <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-ink-2">
            Thanks, {name.trim().split(/\s+/)[0]}. One of the founders will write to <span className="text-ink">{email.trim()}</span> within two
            working days.
          </p>
          <ol className="mt-10 border-t border-line">
            {[
              ["We read what you sent", "and come back with questions about the actions that worry you most."],
              ["A thirty-minute call", "to look at one agent and the tools it can use."],
              ["Shadow mode on that agent", "for a couple of weeks. Nothing is blocked; you see what would have been held."],
            ].map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-line py-5">
                <span className="font-mono text-xs text-ink-4">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="text-ink">{t}</span> <span className="text-ink-3">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href="/" className={buttonClass("ghost", "!h-11")}>
              Back to the site
            </Link>
            <button type="button" onClick={() => setSent(false)} className="text-sm text-ink-3 hover:text-ink">
              Edit my answers
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */

function Row({
  n,
  label,
  optional,
  error,
  group,
  children,
}: {
  n: string;
  label: string;
  optional?: boolean;
  error?: string;
  group?: boolean;
  children: (id: string, describedBy?: string) => ReactNode;
}) {
  const id = useId();
  const errId = `${id}-err`;
  const Label = group ? "p" : "label";
  return (
    <div className="group/row relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2 border-b border-line pb-2 pt-6 sm:grid-cols-[3rem_minmax(0,1fr)]">
      <span aria-hidden className="pt-0.5 font-mono text-xs text-ink-4 transition-colors group-focus-within/row:text-hold">
        {n}
      </span>
      <div className="min-w-0">
        <Label {...(group ? { id: `${id}-label` } : { htmlFor: id })} className="mb-2 flex items-baseline justify-between gap-4 text-sm text-ink-2">
          {label}
          {optional && <span className="text-xs text-ink-4">Optional</span>}
        </Label>
        {children(id, error ? errId : undefined)}
        <AnimatePresence initial={false}>
          {error && (
            <motion.p
              id={errId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pb-2 text-sm text-block"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {/* The underline that draws in amber when the row has focus. */}
      <span
        aria-hidden
        className={`absolute inset-x-0 -bottom-px h-px origin-left transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-focus-within/row:scale-x-100 ${
          error ? "scale-x-100 bg-block/70" : "scale-x-0 bg-hold"
        }`}
      />
    </div>
  );
}

function Input({
  id,
  name,
  type = "text",
  value,
  onChange,
  autoComplete,
  placeholder,
  describedBy,
  invalid,
}: {
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  placeholder?: string;
  describedBy?: string;
  invalid?: boolean;
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete={autoComplete}
      placeholder={placeholder}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className="block h-11 w-full bg-transparent text-[1.0625rem] text-ink placeholder:text-ink-4 focus:outline-none sm:text-lg"
    />
  );
}

function Chips({ id, options, value, onChange }: { id: string; options: readonly string[]; value: string | null; onChange: (v: string | null) => void }) {
  return (
    <div role="radiogroup" aria-labelledby={`${id}-label`} className="flex flex-wrap gap-2 pb-3">
      {options.map((o) => {
        const on = value === o;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(on ? null : o)}
            className={`relative h-10 rounded-full border px-4 text-sm transition-colors ${
              on ? "border-ink bg-ink text-bg" : "border-line-strong text-ink-2 hover:border-ink-4 hover:text-ink"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
