import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, type LegalSection } from "@/components/legal/LegalLayout";
import { CONTACT_EMAIL, Placeholder } from "@/components/legal/Placeholder";

export const metadata: Metadata = {
  title: "Design Partner and Pilot Terms",
  description: "The short, plain terms for an Abeyance design partnership or pilot: shadow mode first, no SLA, confidentiality and deletion at the end.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "covers",
    title: "What these terms cover",
    body: (
      <>
        <p>
          These terms apply when your organisation joins Abeyance as a design partner or runs a pilot. They sit on top of our{" "}
          <Link href="/legal/terms">Terms of Service</Link> and <Link href="/legal/dpa">Data Processing Addendum</Link>. Where they differ, these
          terms apply to the pilot.
        </p>
        <p>The pilot is the period, scope and agents we agree with you in writing, by email or in a short pilot plan.</p>
      </>
    ),
  },
  {
    id: "fees-term",
    title: "Fees and term",
    body: (
      <>
        <p>
          The pilot is free of charge, unless we agree a fee of <Placeholder>FEE</Placeholder> in writing.
        </p>
        <p>
          It runs for <Placeholder>N</Placeholder> days from the day your first agent connects. We can extend it by agreeing in writing. There is no
          obligation on either side to continue into a paid agreement afterwards.
        </p>
      </>
    ),
  },
  {
    id: "shadow",
    title: "Shadow mode first",
    body: (
      <>
        <p>
          Every pilot starts in shadow mode. Abeyance sees what your agent proposes and records what it would have decided, but nothing is held or
          blocked, and your existing approval process carries on as before.
        </p>
        <p>
          Abeyance only begins holding or blocking actions when you decide to switch an agent to enforcement, and tell us. You can switch back to
          shadow mode at any time.
        </p>
      </>
    ),
  },
  {
    id: "feedback",
    title: "Feedback",
    body: (
      <p>
        We will ask for honest feedback, about once a fortnight. You give us a perpetual, royalty-free licence to use any feedback to improve
        Abeyance. Feedback does not include your confidential information or your Customer Data, which stay yours.
      </p>
    ),
  },
  {
    id: "no-sla",
    title: "No service levels",
    body: (
      <>
        <p>
          A pilot has no service level agreement. Features may change, be incomplete or be withdrawn. We will tell you before we change anything that
          affects your agents.
        </p>
        <p>
          To the extent the law allows, our total liability arising from the pilot is limited to <Placeholder>PILOT LIABILITY CAP</Placeholder>.
          Nothing in these terms limits rights under the Australian Consumer Law that cannot be limited.
        </p>
      </>
    ),
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    body: (
      <p>
        Each of us keeps what the other shares during the pilot confidential, as the Terms of Service describe. That includes your agent traffic and
        our shadow-mode reports to you. We will not name you as a design partner, or describe your results publicly, without your written consent.
      </p>
    ),
  },
  {
    id: "data",
    title: "Your data, and deleting it",
    body: (
      <>
        <p>
          Send only what your agents need for a decision. If you can, start with an agent whose actions carry little personal information.
        </p>
        <p>
          When the pilot ends, we delete your Customer Data, including the decision ledger, within <Placeholder>N</Placeholder> days, unless you
          continue into a paid agreement or ask us to export it first. We will confirm deletion in writing on request.
        </p>
      </>
    ),
  },
  {
    id: "ending",
    title: "Ending the pilot early",
    body: (
      <p>
        Either of us may end the pilot at any time with <Placeholder>N</Placeholder> days’ written notice to the other, without needing a reason.
        Notice to us goes to {CONTACT_EMAIL}.
      </p>
    ),
  },
];

export default function PilotPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Design Partner and Pilot Terms"
      intro={
        <p>
          The terms for trying Abeyance with us. Shadow mode first, nothing blocked until you say so, and your data deleted when we finish.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
