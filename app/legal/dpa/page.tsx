import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalTable, type LegalSection } from "@/components/legal/LegalLayout";
import { COMPANY, PRIVACY_EMAIL, Placeholder, SECURITY_EMAIL } from "@/components/legal/Placeholder";

export const metadata: Metadata = {
  title: "Data Processing Addendum",
  description:
    "Draft Data Processing Addendum for Abeyance customers: roles, instructions, security measures, subprocessors, breach notification, transfers and deletion.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "scope",
    title: "Scope and roles",
    body: (
      <>
        <p>
          This addendum forms part of the <Link href="/legal/terms">Terms of Service</Link> between {COMPANY} (“Abeyance”) and the Customer. It
          applies whenever Abeyance processes personal data in Customer Data on the Customer’s behalf.
        </p>
        <p>
          For that personal data, the Customer is the controller (or, under Australian law, the APP entity responsible for it) and Abeyance is the
          processor. If the Customer is itself a processor for someone else, Abeyance is its subprocessor, and the Customer will pass on these
          commitments as needed.
        </p>
        <p>
          Words such as “personal data”, “processing”, “controller” and “processor” have the meanings given in the GDPR. “Applicable Data
          Protection Law” means the <em>Privacy Act 1988</em> (Cth), the GDPR and UK GDPR, and any other data protection law that applies to the
          processing.
        </p>
      </>
    ),
  },
  {
    id: "details",
    title: "Details of the processing",
    body: (
      <LegalTable
        head={["Item", "Detail"]}
        rows={[
          ["Subject matter", "Providing Abeyance: deciding ALLOW, HOLD or BLOCK on actions proposed by the Customer’s AI agents, routing holds to people, and keeping a decision ledger."],
          ["Duration", "The term of the agreement, plus the deletion period in section 09."],
          ["Nature and purpose", "Receiving, redacting, scoring, storing, displaying and exporting proposed actions and decisions, only to provide the service to the Customer."],
          ["Types of personal data", "Whatever the Customer’s agents include in a proposed action and its context, such as names, contact details, account and transaction references and message content. Also names, emails and roles of the Customer’s users."],
          ["Data subjects", "The Customer’s users and reviewers, and the Customer’s own customers, employees or other people named in proposed actions."],
          ["Special categories", <>Not intended. The Customer should configure agents not to send them. <Placeholder>CONFIRM</Placeholder></>],
        ]}
      />
    ),
  },
  {
    id: "instructions",
    title: "Processing on instructions",
    body: (
      <>
        <p>
          Abeyance processes personal data only on the Customer’s documented instructions. The agreement, this addendum, and the Customer’s
          configuration of Abeyance (its policies, integrations and settings) are those instructions.
        </p>
        <p>
          If Abeyance is required by law to process personal data in another way, it will tell the Customer first, unless the law forbids it. If
          Abeyance believes an instruction breaks Applicable Data Protection Law, it will tell the Customer.
        </p>
        <p>The Customer is responsible for having a lawful basis, and giving any notices, for the personal data it sends to Abeyance.</p>
      </>
    ),
  },
  {
    id: "confidentiality",
    title: "Confidentiality of personnel",
    body: (
      <p>
        Abeyance makes sure that everyone it authorises to process personal data is bound by a duty of confidentiality, and gives access only to
        those who need it to provide or support the service.
      </p>
    ),
  },
  {
    id: "security",
    title: "Security measures",
    body: (
      <>
        <p>
          Abeyance maintains the technical and organisational measures in the annex at the end of this addendum, and may improve them over time
          without reducing the overall level of protection. Abeyance is not yet certified to SOC 2 or ISO 27001.
        </p>
      </>
    ),
  },
  {
    id: "subprocessors",
    title: "Subprocessors",
    body: (
      <>
        <p>
          The Customer authorises Abeyance to use the subprocessors listed on our <Link href="/legal/subprocessors">Subprocessors</Link> page.
          Abeyance binds each one by written terms that protect personal data at least as well as this addendum, and remains responsible for them.
        </p>
        <p>
          Abeyance will give at least <Placeholder>N</Placeholder> days’ notice before adding or replacing a subprocessor. The Customer may object
          on reasonable data protection grounds within that period. If we cannot resolve the objection together, the Customer may end the affected
          part of the service and receive a refund of prepaid fees for it.
        </p>
        <p>
          Services the Customer enables itself, such as Slack, Microsoft Teams, CRM connectors, SIEMs, its own model endpoints or its own Postgres
          database, act on the Customer’s instructions and are not Abeyance’s subprocessors.
        </p>
      </>
    ),
  },
  {
    id: "breach",
    title: "Personal data breaches",
    body: (
      <>
        <p>
          Abeyance will tell the Customer without undue delay, and in any case within <Placeholder>N</Placeholder> hours, after becoming aware of a
          personal data breach affecting Customer Data.
        </p>
        <p>
          The notice will describe what happened, the data and people likely affected, the likely consequences, and what Abeyance has done and will
          do. Where information is not yet available, Abeyance will provide it as soon as it is.
        </p>
        <p>
          Under Australia’s Notifiable Data Breaches scheme, a suspected eligible data breach must be assessed within 30 days, and the Customer, as
          the entity responsible for the data, decides whether to notify the OAIC and affected individuals. Abeyance will help with that
          assessment and with any notifications the Customer must make under the GDPR or other law. Abeyance will not notify regulators or
          individuals about a breach of Customer Data on the Customer’s behalf without the Customer’s agreement, unless the law requires it.
        </p>
        <p>Abeyance’s notice is not an admission of fault.</p>
      </>
    ),
  },
  {
    id: "assistance",
    title: "Assistance",
    body: (
      <>
        <p>Taking into account the nature of the processing, Abeyance will help the Customer to:</p>
        <ul>
          <li>respond to requests from individuals exercising their rights, and pass on any such request it receives directly;</li>
          <li>carry out data protection or privacy impact assessments, and consult regulators where required;</li>
          <li>meet its security and breach notification obligations.</li>
        </ul>
        <p>
          Because the decision ledger is append-only and hash-chained, individual entries cannot be edited or deleted while a workspace is active.
          Abeyance will work with the Customer on how to meet a correction or erasure request within that design, for example by recording a
          correcting entry. <Placeholder>CONFIRM APPROACH WITH COUNSEL</Placeholder>
        </p>
      </>
    ),
  },
  {
    id: "deletion",
    title: "Deletion and return",
    body: (
      <p>
        When the agreement ends, the Customer may export its Customer Data, including the full decision ledger, for <Placeholder>N</Placeholder>{" "}
        days. After that Abeyance deletes Customer Data from its systems within <Placeholder>N</Placeholder> days, and from backups as they expire
        within <Placeholder>N</Placeholder> days, unless the law requires it to keep some. Abeyance will confirm deletion in writing on request.
        Data held in the Customer’s own Postgres database stays under the Customer’s control.
      </p>
    ),
  },
  {
    id: "audits",
    title: "Audits and information",
    body: (
      <>
        <p>
          Abeyance will make available the information reasonably needed to show that it meets this addendum, including its security
          documentation and, when available, independent audit reports. The evidence pack in the product maps decisions and controls to APRA CPS
          230, the EU AI Act and the NIST AI Risk Management Framework.
        </p>
        <p>
          If that information is not enough, the Customer, or an independent auditor it appoints under confidentiality terms, may audit Abeyance
          once a year on at least <Placeholder>N</Placeholder> days’ notice, during business hours, and in a way that does not compromise other
          customers’ data. Each party bears its own costs, unless the audit finds a material breach. Regulators with authority over the Customer may
          audit as the law requires.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    body: (
      <>
        <p>
          Abeyance processes Customer Data in the locations listed on the Subprocessors page. Customers can bring their own Postgres database and
          their own model endpoints to keep data in a region they choose.
        </p>
        <p>
          Where a transfer of personal data out of the EU or UK requires safeguards, the parties agree to the European Commission’s Standard
          Contractual Clauses (Decision 2021/914), which are incorporated by reference, as follows:
        </p>
        <ul>
          <li>
            Module Two (controller to processor) where the Customer is a controller; Module Three (processor to processor) where it is a processor.
            <Placeholder>CONFIRM MODULES</Placeholder>
          </li>
          <li>
            Clause 7 (docking clause): <Placeholder>INCLUDE / EXCLUDE</Placeholder>. Clause 9 (subprocessors): option 2, general written
            authorisation, with the notice period in section 06.
          </li>
          <li>
            Clause 11 (redress): optional language <Placeholder>INCLUDE / EXCLUDE</Placeholder>. Clauses 17 and 18 (governing law and courts):{" "}
            <Placeholder>EU MEMBER STATE</Placeholder>.
          </li>
          <li>Annexes I and II are completed by section 02 and the security annex of this addendum.</li>
          <li>For UK transfers, the UK International Data Transfer Addendum applies alongside them.</li>
        </ul>
        <p>For disclosures out of Australia, Abeyance takes reasonable steps to make sure recipients handle personal information consistently with the APPs.</p>
      </>
    ),
  },
  {
    id: "general",
    title: "Liability and precedence",
    body: (
      <p>
        Each party’s liability under this addendum is subject to the limits in the Terms of Service, except where Applicable Data Protection Law
        says otherwise. If this addendum conflicts with the Terms of Service, this addendum prevails for the processing of personal data. If it
        conflicts with the Standard Contractual Clauses, the Clauses prevail. Questions go to {PRIVACY_EMAIL}.
      </p>
    ),
  },
  {
    id: "annex-security",
    title: "Annex: security measures",
    body: (
      <>
        <h3>Data in transit and at rest</h3>
        <ul>
          <li>TLS for all data in transit.</li>
          <li>Stored credentials, such as integration tokens, encrypted with AES-256-GCM.</li>
          <li>Per-agent API keys stored only as hashes.</li>
        </ul>
        <h3>Minimising what leaves the service</h3>
        <ul>
          <li>
            Personal identifiers are redacted before a proposed action reaches the risk model or the explanation model. Redaction is
            pattern-based and covers Australian identifiers, including tax file numbers, BSBs, Medicare numbers and card numbers checked with the
            Luhn algorithm.
          </li>
          <li>The explanation model runs only for held actions, after the decision has been made.</li>
        </ul>
        <h3>Access control</h3>
        <ul>
          <li>Server-side sessions in HttpOnly cookies, and a CSRF header check.</li>
          <li>Five roles, enforced on every API route.</li>
          <li>Single sign-on through OIDC with PKCE.</li>
        </ul>
        <h3>Integrity and accountability</h3>
        <ul>
          <li>
            An append-only decision ledger, hash-chained with SHA-256. Database triggers reject UPDATE, DELETE and TRUNCATE. The chain can be verified
            through the API and the CLI.
          </li>
          <li>Exports of the ledger to the Customer’s SIEM.</li>
        </ul>
        <h3>Safe failure</h3>
        <ul>
          <li>Fail closed: if the risk model is unavailable, the action is held for a person.</li>
          <li>An emergency brake, for stopping agents’ actions at once.</li>
        </ul>
        <h3>Reporting</h3>
        <p>
          Security issues can be reported under our <Link href="/legal/vulnerability-disclosure">Vulnerability Disclosure Policy</Link> or to{" "}
          {SECURITY_EMAIL}.
        </p>
      </>
    ),
  },
];

export default function DpaPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Data Processing Addendum"
      intro={
        <p>
          How we handle personal data in what your agents send us. You decide what happens to it; we act on your instructions and protect it.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
