"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { Plate } from "./Essay";

/** The approval card as it lands in a channel. Approve or deny it; nothing real happens. */
export function ApprovalFigure() {
  const [decision, setDecision] = useState<"approved" | "denied" | null>(null);
  return (
    <Plate>
      <div className="flex items-center justify-between border-b border-line px-5 py-3 text-[13px]">
        <span className="font-medium text-ink"># agent-approvals</span>
        <span className="text-ink-4">Slack · example</span>
      </div>
      <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 px-5 py-6 sm:px-7">
        <span className="grid size-9 place-items-center rounded-lg bg-[#eef1fb]">
          <LogoMark className="h-5 w-5 text-[#3458d4]" />
        </span>
        <div className="min-w-0">
          <p className="text-[14px]">
            <span className="font-semibold text-ink">Abeyance</span> <span className="ml-1 rounded bg-sunken px-1 py-px text-[10px] font-medium uppercase tracking-wide text-ink-3">app</span>{" "}
            <span className="ml-1 text-[12px] text-ink-4">10:42</span>
          </p>
          <p className="mt-1 text-[15px] text-ink">
            <span className="font-semibold">accounts-payable</span> wants to send a payment. It’s held until someone approves.
          </p>

          <div className="mt-3 border-l-[3px] border-ember/70 pl-4">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13.5px] sm:grid-cols-3">
              <Field k="Action" v={<code className="font-mono text-[12.5px]">payment.send</code>} />
              <Field k="Amount" v="$600.00" />
              <Field k="Payee" v="vendor_42 · new" />
              <Field k="Account" v={<span className="font-mono text-[12.5px]">•••• •••• 4821</span>} />
              <Field k="Rule" v={<span><code className="font-mono text-[12.5px]">large_payment</code> · hold</span>} />
              <Field k="Jev (shadow)" v="0.78 · confidence 0.94" />
            </dl>
            <p className="mt-3 text-[13px] text-ink-3">Why it looks risky: a payee this agent hasn’t paid before, and an unusual amount for it.</p>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {decision ? (
              <motion.p key="done" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-5 text-[14px] text-ink-2">
                {decision === "approved" ? (
                  <>
                    <span className="text-allow">✓ Approved by you.</span> The agent resumed 1.2 seconds later and the payment went out.
                  </>
                ) : (
                  <>
                    <span className="text-block">✕ Denied by you.</span> The function never ran. The agent was told why.
                  </>
                )}
                <button type="button" onClick={() => setDecision(null)} className="ml-3 text-[13px] text-ink-3 underline decoration-ink/20 underline-offset-4 hover:text-ink">
                  Again
                </button>
              </motion.p>
            ) : (
              <motion.div key="ask" exit={{ opacity: 0 }} className="mt-5 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => setDecision("approved")} className="h-9 rounded-md bg-[#2c7a5c] px-4 text-[14px] font-medium text-white transition-opacity hover:opacity-90">
                  Approve
                </button>
                <button type="button" onClick={() => setDecision("denied")} className="h-9 rounded-md border border-line-strong px-4 text-[14px] text-ink transition-colors hover:border-ink/40">
                  Deny
                </button>
                <span className="ml-2 text-[12.5px] text-ink-4">Times out in 15 min · then denied</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Plate>
  );
}

function Field({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[12px] text-ink-3">{k}</dt>
      <dd className="mt-0.5 truncate text-ink">{v}</dd>
    </div>
  );
}
