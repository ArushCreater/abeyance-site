import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, type LegalSection } from "@/components/legal/LegalLayout";
import { SECURITY_EMAIL } from "@/components/legal/Placeholder";

export const metadata: Metadata = {
  title: "Security",
  description:
    "How Abeyance protects decisions, credentials and the ledger: fail-closed decisions, a hash-chained append-only ledger, PII redaction, SSO and role-based access.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "approach",
    title: "Our approach",
    body: (
      <>
        <p>
          Abeyance sits in the path of the actions your agents cannot take back. So it is built to fail safe, to record everything in a way that
          cannot be quietly changed, and to send as little as possible to anyone else.
        </p>
        <p>
          We are a young company and not yet certified to SOC 2 or ISO 27001. This page describes the controls we have today, without overstating
          them.
        </p>
      </>
    ),
  },
  {
    id: "fail-closed",
    title: "Decisions fail closed",
    body: (
      <ul>
        <li>If the risk model is unavailable, the action is held for a person. It is never allowed by default.</li>
        <li>If nobody answers a hold before its timeout, the action does not happen, and the agent gets a structured reason.</li>
        <li>Spending caps, allowlists and business hours are plain, testable code. A model never decides a limit.</li>
        <li>An emergency brake pauses one agent, or every agent in a workspace, at once.</li>
      </ul>
    ),
  },
  {
    id: "ledger",
    title: "A ledger that cannot be quietly changed",
    body: (
      <>
        <p>
          Every decision and approval is written to an append-only ledger. Each entry includes the SHA-256 hash of the entry before it, so any edit
          or deletion breaks the chain, and verification shows where.
        </p>
        <p>
          Database triggers reject <code>UPDATE</code>, <code>DELETE</code> and <code>TRUNCATE</code> on the ledger. You can verify the chain
          yourself through the API or the command-line tool, and export the full ledger to your SIEM as JSON Lines or CSV.
        </p>
      </>
    ),
  },
  {
    id: "data",
    title: "Protecting data",
    body: (
      <ul>
        <li>All traffic is encrypted in transit with TLS.</li>
        <li>Stored credentials, such as integration tokens, are encrypted with AES-256-GCM.</li>
        <li>Per-agent API keys are stored only as hashes, so we cannot read them back.</li>
        <li>
          Before a proposed action reaches the risk model or the explanation model, personal identifiers are redacted. Redaction is pattern-based and
          covers Australian identifiers, including tax file numbers, BSBs, Medicare numbers and Luhn-checked card numbers.
        </li>
        <li>The explanation model runs only on held actions, after the decision has been made.</li>
      </ul>
    ),
  },
  {
    id: "access",
    title: "Access control",
    body: (
      <ul>
        <li>Single sign-on through OIDC, using PKCE.</li>
        <li>Server-side sessions, held in an HttpOnly cookie that scripts cannot read.</li>
        <li>Five roles, enforced on every API route.</li>
        <li>A CSRF header check on console requests.</li>
        <li>A separate API key for each agent, so one can be revoked without touching the others.</li>
      </ul>
    ),
  },
  {
    id: "residency",
    title: "Where your data lives",
    body: (
      <>
        <p>
          The application runs on Vercel in Singapore, and the database and sign-in run on Supabase in the same region. The full list of providers
          is on our <Link href="/legal/subprocessors">Subprocessors</Link> page.
        </p>
        <p>
          If you need data to stay in a particular place, you can bring your own Postgres database for a workspace, and your own model endpoints on
          Amazon Bedrock, Google Vertex AI or Azure AI Foundry.
        </p>
      </>
    ),
  },
  {
    id: "compliance",
    title: "Compliance and certifications",
    body: (
      <>
        <p>
          Abeyance produces an evidence pack that maps decisions, approvals and controls to APRA CPS 230, the EU AI Act and the NIST AI Risk
          Management Framework, to support your own compliance work.
        </p>
        <p>
          <strong>SOC 2: not yet certified. ISO 27001: not yet certified.</strong> We will update this page when that changes. Until then, we are
          happy to answer security questionnaires and walk through our controls with your team.
        </p>
      </>
    ),
  },
  {
    id: "report",
    title: "Reporting a vulnerability",
    body: (
      <p>
        If you find a security issue, email {SECURITY_EMAIL}. Our <Link href="/legal/vulnerability-disclosure">Vulnerability Disclosure Policy</Link>{" "}
        explains what is in scope and our safe harbour for good-faith research.
      </p>
    ),
  },
];

export default function SecurityPage() {
  return (
    <LegalLayout
      eyebrow="Trust"
      title="Security"
      intro={<p>Built like a control system, not a chatbot. How Abeyance protects decisions, credentials and the ledger.</p>}
      sections={SECTIONS}
      back={{ href: "/trust", label: "Trust centre" }}
    />
  );
}
