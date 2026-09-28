"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { SuspendedText } from "@/components/type/SuspendedText";
import { arrowClass, buttonClass } from "@/components/ui/button";
import { spring } from "@/lib/motion";

const ROLES = ["AI Centre of Excellence", "Security / CISO office", "Platform engineering", "Operations", "Other"];

export function PartnerCTA() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) return;
    setSent(true);
  };

  return (
    <section id="partner" aria-labelledby="partner-title" className="border-t border-line">
      <div className="mx-auto grid max-w-[1200px] gap-16 px-5 py-28 sm:px-8 md:py-40 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
        <div>
          <p className="label">Design partners</p>
          <h2 id="partner-title" className="display-tight mt-5 text-[clamp(2.4rem,6.5vw,5rem)] font-[300]">
            <SuspendedText text="Switch the agents on." className="block" />
            <span className="block text-ink-3">Keep the few that matter in abeyance.</span>
          </h2>
          <p className="mt-8 max-w-[48ch] text-lg leading-relaxed text-ink-2">
            We’re working with a small number of regulated teams in fintech, insurance operations, regtech and
            platform engineering who have agents ready to go but can’t risk the irreversible actions.
          </p>
          <ul className="mt-10 space-y-3 text-ink-2">
            {[
              "A shadow-mode report on your own agent traffic",
              "Policies and thresholds tuned with you, per action type",
              "A direct line to the founding team in Sydney",
            ].map((t) => (
              <li key={t} className="flex gap-4">
                <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-hold" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait" initial={false}>
            {!sent ? (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.35 } }}
                className="space-y-6 rounded-2xl border border-line bg-raised/60 p-6 sm:p-8"
                aria-label="Design partner request"
              >
                <Field label="Work email" id="email">
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={inputClass} />
                </Field>
                <Field label="Company" id="company">
                  <input id="company" name="company" required autoComplete="organization" className={inputClass} />
                </Field>
                <Field label="Your team" id="role">
                  <select id="role" name="role" className={`${inputClass} appearance-none`} defaultValue="">
                    <option value="" disabled>
                      Choose one
                    </option>
                    {ROLES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </Field>
                <Field label="What should your agents never do without asking?" id="never" optional>
                  <textarea id="never" name="never" rows={3} className={`${inputClass} h-auto resize-none py-3`} />
                </Field>
                <button type="submit" className={buttonClass("primary", "w-full")}>
                  Request a conversation <span aria-hidden className={arrowClass}>→</span>
                </button>
                <p className="text-center text-xs text-ink-3">Preview build. This form doesn’t send anything yet.</p>
              </motion.form>
            ) : (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring.settle}
                className="flex min-h-[26rem] flex-col justify-center rounded-2xl border border-hold-line bg-hold-soft/30 p-8"
                role="status"
              >
                <p className="label !text-hold">Received</p>
                <p className="display-tight mt-4 text-4xl font-[300]">
                  <SuspendedText text="Held" suspend holdMs={1800} /> for a person.
                </p>
                <p className="mt-6 max-w-[36ch] leading-relaxed text-ink-2">
                  One of the founders will reply within two working days. (In this preview nothing was sent.)
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "block h-11 w-full rounded-lg border border-line-strong bg-bg px-3.5 text-ink placeholder:text-ink-4 transition-colors hover:border-ink-4 focus:border-hold focus:outline-none";

function Field({ label, id, optional, children }: { label: string; id: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex justify-between text-sm text-ink-2">
        {label}
        {optional && <span className="text-ink-3">Optional</span>}
      </label>
      {children}
    </div>
  );
}
