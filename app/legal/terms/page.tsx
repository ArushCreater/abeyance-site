import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, type LegalSection } from "@/components/legal/LegalLayout";
import { ABN, ADDRESS, COMPANY, CONTACT_EMAIL, GOVERNING_LAW, Placeholder } from "@/components/legal/Placeholder";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Draft terms for organisations using Abeyance, the commit control for AI agents. Business customers only.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <p>
          These terms are an agreement between {COMPANY} (ABN {ABN}), of {ADDRESS} (“Abeyance”, “we”, “us”), and the organisation that signs up
          for or uses Abeyance (“you”, the “Customer”).
        </p>
        <p>
          Abeyance is for businesses only. By accepting these terms you confirm that you are accepting them for an organisation and that you have
          authority to bind it. If you have signed an order form with us, the order form takes priority over these terms where they conflict.
        </p>
        <p>
          A design partnership or pilot is covered by our <Link href="/legal/pilot">pilot terms</Link>, which sit on top of these terms.
        </p>
      </>
    ),
  },
  {
    id: "service",
    title: "What Abeyance does",
    body: (
      <>
        <p>
          Abeyance is a control point for AI agents. Before one of your agents takes an action that cannot easily be undone, such as sending an
          email, closing a ticket, changing a CRM record or issuing a refund, it asks Abeyance. Abeyance answers <strong>ALLOW</strong>,{" "}
          <strong>HOLD</strong> or <strong>BLOCK</strong>. A held action waits for a person you choose to approve or deny it.
        </p>
        <p>
          Abeyance helps you decide. It does not take the action itself, and it does not replace your own controls, policies or judgement. You
          remain responsible for what your agents do and for the decisions your people make on held actions.
        </p>
        <p>
          You can run Abeyance in shadow mode, where it records what it would have decided without stopping anything. While in shadow mode,
          nothing is held or blocked.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Accounts, users and agents",
    body: (
      <>
        <p>You decide who can use your workspace and what role each person has. You are responsible for:</p>
        <ul>
          <li>everything done through your workspace by your users and your agents;</li>
          <li>keeping sign-in details and per-agent API keys secret, and revoking them when they are no longer needed;</li>
          <li>making sure the people who approve or deny held actions have the authority and knowledge to do so;</li>
          <li>telling us promptly if you think your workspace has been accessed without permission.</li>
        </ul>
      </>
    ),
  },
  {
    id: "your-data",
    title: "Your data",
    body: (
      <>
        <p>
          “Customer Data” means the data your agents and users send to Abeyance, including proposed actions, the context attached to them, and
          the decisions and approvals recorded about them. You own your Customer Data.
        </p>
        <p>
          You give us permission to host, process and transmit Customer Data only as needed to provide, secure and support Abeyance for you, and
          as set out in our <Link href="/legal/dpa">Data Processing Addendum</Link>, which forms part of these terms.
        </p>
        <p>
          You are responsible for having the right to send Customer Data to us, including any notices or consents your own customers need. We
          will not use Customer Data to train or fine-tune machine learning models <Placeholder>CONFIRM AGAINST SUBPROCESSOR TERMS</Placeholder>.
        </p>
        <p>
          The decision ledger is append-only by design. Entries cannot be edited or deleted while your workspace is active. When the agreement
          ends, we delete or return Customer Data as the Data Processing Addendum describes.
        </p>
      </>
    ),
  },
  {
    id: "ai",
    title: "AI features",
    body: (
      <>
        <p>
          Abeyance uses machine learning models. A risk model scores each proposed action, after personal identifiers have been redacted. For held
          actions, a large language model writes a short explanation for the reviewer, after the decision has been made. The explanation never
          makes the decision.
        </p>
        <p>
          Model outputs can be wrong or incomplete. Treat risk scores and explanations as aids for a person, not as advice. More detail is in our{" "}
          <Link href="/responsible-ai">Responsible AI</Link> page.
        </p>
      </>
    ),
  },
  {
    id: "third-parties",
    title: "Integrations and your own providers",
    body: (
      <>
        <p>
          You can connect Abeyance to other services, such as Slack, Microsoft Teams, Salesforce, HubSpot, Zendesk or your SIEM, and you can bring
          your own model endpoints or your own Postgres database. When you enable one, you authorise us to exchange data with it on your behalf.
        </p>
        <p>
          Those services are provided under their own terms, not ours. We are not responsible for them, for their availability, or for what they
          do with data once you have told us to send it to them.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <p>
        You must follow our <Link href="/legal/aup">Acceptable Use Policy</Link>. We may suspend access, with notice where practical, if your use
        breaches it or puts the service, other customers or third parties at risk. We will restore access once the issue is resolved.
      </p>
    ),
  },
  {
    id: "fees",
    title: "Fees",
    body: (
      <>
        <p>
          You pay the fees in your order form: <Placeholder>FEES</Placeholder>. Unless the order form says otherwise, invoices are due within{" "}
          <Placeholder>PAYMENT TERMS, e.g. 30</Placeholder> days. Fees are in Australian dollars and exclude GST, which we will add where it
          applies.
        </p>
        <p>We may change fees for a renewal term by telling you at least <Placeholder>N</Placeholder> days before it starts.</p>
      </>
    ),
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    body: (
      <p>
        Each of us will keep the other’s confidential information secret, use it only for this agreement, and share it only with people who need
        it and are bound by similar duties. This does not cover information that is public through no fault of the receiver, that the receiver
        already had or developed independently, or that must be disclosed by law (with notice to the other party where the law allows).
      </p>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property and feedback",
    body: (
      <>
        <p>
          We own Abeyance, including the software, documentation and anything we build to improve it. These terms give you a non-exclusive,
          non-transferable right to use it for your internal business purposes while the agreement is in force.
        </p>
        <p>
          If you give us suggestions or feedback, we may use them without restriction or payment. Doing so does not give us any rights in your
          Customer Data or your confidential information.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security and availability",
    body: (
      <>
        <p>
          We protect Customer Data with the measures described on our <Link href="/security">Security</Link> page and in the Data Processing
          Addendum. We are not yet certified to SOC 2 or ISO 27001.
        </p>
        <p>
          Abeyance fails closed: if the risk model cannot be reached, the action is held for a person rather than allowed. How your agents behave if
          they cannot reach Abeyance at all depends on how you integrate it, and is your decision.
        </p>
        <p>
          Unless your order form includes a service level agreement, we provide Abeyance without any uptime or response-time commitment, though
          we work to keep it available and will tell you about planned maintenance in advance.
        </p>
      </>
    ),
  },
  {
    id: "warranties",
    title: "Warranties and the Australian Consumer Law",
    body: (
      <>
        <p>
          Each of us confirms that it has the authority to enter into these terms. We will provide Abeyance with reasonable care and skill.
        </p>
        <p>
          Apart from that, and to the extent the law allows, Abeyance is provided “as is”. We do not promise that it will catch every risky action,
          that it will never hold or block a safe one, or that it will be free of errors.
        </p>
        <p>
          Nothing in these terms excludes, restricts or modifies any right or remedy under the Australian Consumer Law or other law that cannot be
          excluded. Where we are allowed to limit our liability for a breach of such a guarantee, our liability is limited to supplying the service
          again or paying the cost of having it supplied again.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Liability",
    body: (
      <>
        <p>To the extent the law allows:</p>
        <ul>
          <li>
            neither of us is liable to the other for loss of profit, revenue, data or goodwill, or for any indirect or consequential loss;
          </li>
          <li>
            each party’s total liability under or in connection with these terms is limited to <Placeholder>LIABILITY CAP, e.g. fees paid in the
            previous 12 months</Placeholder>.
          </li>
        </ul>
        <p>
          These limits do not apply to a party’s liability for breach of confidentiality, for infringing the other’s intellectual property, for
          fraud, or for anything else that cannot be limited by law. <Placeholder>CONFIRM CARVE-OUTS WITH COUNSEL</Placeholder>
        </p>
        <p>
          Each party’s liability is reduced to the extent the other party caused or contributed to the loss, including, for you, through the
          configuration of policies, thresholds or reviewers.
        </p>
      </>
    ),
  },
  {
    id: "term",
    title: "Term, suspension and ending the agreement",
    body: (
      <>
        <p>
          These terms start when you first accept them or use Abeyance and continue until ended. Either of us may end the agreement on{" "}
          <Placeholder>N</Placeholder> days’ written notice, or immediately if the other materially breaches it and does not fix the breach within{" "}
          <Placeholder>N</Placeholder> days of being asked to.
        </p>
        <p>
          When the agreement ends, your access stops. For <Placeholder>N</Placeholder> days afterwards you can ask us to export your Customer Data,
          including the decision ledger. After that we delete it, as set out in the Data Processing Addendum.
        </p>
        <p>Sections that by their nature should survive, such as confidentiality, liability and payment of fees already due, survive.</p>
      </>
    ),
  },
  {
    id: "general",
    title: "General",
    body: (
      <>
        <p>
          These terms are governed by the law of {GOVERNING_LAW}, Australia, and each of us submits to the courts of that state.
        </p>
        <p>
          We may update these terms. If a change materially affects you, we will tell you at least <Placeholder>N</Placeholder> days before it takes
          effect. Neither of us may assign this agreement without the other’s consent, except to a successor of its whole business. Neither of us
          is liable for delays caused by events outside its reasonable control. If any part of these terms is unenforceable, the rest continues.
          These terms, the order form and the documents they refer to are the whole agreement between us about Abeyance.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Notices and questions about these terms go to {CONTACT_EMAIL}, or by post to {ADDRESS}.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Terms of Service"
      intro={
        <p>
          The agreement between your organisation and us for using Abeyance. Written to be read, with the legal detail kept where it is needed.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
