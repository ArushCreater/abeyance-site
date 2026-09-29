"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { arrowClass, buttonClass } from "@/components/ui/button";
import { spring } from "@/lib/motion";

const TEAMS = ["AI / CoE", "Security", "Platform", "Operations", "Other"];
const STAGES = ["Exploring", "Piloting", "In production"];
const NEVER = ["Promise a refund", "Change bank details", "Email a regulator", "Close a complaint", "Delete records"];

type Errors = Partial<Record<"name" | "email" | "company", string>>;

export function PartnerForm() {
  const reduce = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [team, setTeam] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [never, setNever] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!name.trim()) e.name = "Tell us who we’re talking to.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "That doesn’t look like an email address.";
    if (!company.trim()) e.company = "Which company is this for?";
    return e;
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const first = (Object.keys(e) as (keyof Errors)[])[0];
    if (first) {
      form.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSent(true);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  };

  // Fixing a field clears its error straight away.
  const edit = (key: keyof Errors, set: (v: string) => void) => (v: string) => {
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
          className="border-t border-line"
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
          <Row n="04" label="Your team" optional group>
            {(id) => <Chips id={id} options={TEAMS} value={team} onChange={setTeam} />}
          </Row>
          <Row n="05" label="Where are your agents?" optional group>
            {(id) => <Chips id={id} options={STAGES} value={stage} onChange={setStage} />}
          </Row>
          <Row n="06" label="What should they never do without asking?" optional>
            {(id) => (
              <div>
                <textarea
                  id={id}
                  name="never"
                  value={never}
                  onChange={(e) => setNever(e.target.value)}
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

          <div className="flex flex-col-reverse gap-5 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-3">We reply within two working days.</p>
            <button type="submit" className={buttonClass("primary", "!h-12 w-full !px-6 text-[15px] sm:w-auto")}>
              Request a conversation <span aria-hidden className={arrowClass}>→</span>
            </button>
          </div>
          <p className="mt-6 text-xs text-ink-4">Preview: requests from this page aren’t sent anywhere yet.</p>
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
          <p className="mt-8 text-xs text-ink-4">Preview: nothing was sent.</p>
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

function Chips({ id, options, value, onChange }: { id: string; options: string[]; value: string | null; onChange: (v: string | null) => void }) {
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
