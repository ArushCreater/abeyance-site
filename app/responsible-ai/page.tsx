import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, type LegalSection } from "@/components/legal/LegalLayout";
import { CONTACT_EMAIL } from "@/components/legal/Placeholder";

export const metadata: Metadata = {
  title: "Responsible AI",
  description:
    "What the models inside Abeyance do and never do, how human oversight is built in, how it relates to EU AI Act Article 14 and APRA CPS 230, and its limitations.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "short",
    title: "The short version",
    body: (
      <p>
        Abeyance uses two models. One scores how risky a proposed action is. The other explains, in plain words, why an action was held. Neither
        approves anything. Limits are plain code, thresholds are yours, and the actions that matter wait for a person.
      </p>
    ),
  },
  {
    id: "do",
    title: "What the models do",
    body: (
      <>
        <h3>Risk scoring</h3>
        <p>
          TypeSafe’s Jev model scores each proposed action. It receives a redacted view, with personal identifiers removed. The score is compared
          with the thresholds you set for each type of action, alongside your deterministic rules, to reach ALLOW, HOLD or BLOCK.
        </p>
        <h3>Hold explanations</h3>
        <p>
          For held actions only, Anthropic’s Claude writes a short explanation for the reviewer, either directly or through OpenRouter. It runs after
          the decision has been made, on a redacted view of the action. You can bring your own model endpoint on Amazon Bedrock, Google Vertex AI or
          Azure AI Foundry instead.
        </p>
      </>
    ),
  },
  {
    id: "never",
    title: "What they never do",
    body: (
      <ul>
        <li>The explanation model never makes or changes a decision.</li>
        <li>No model sets a limit. Spending caps, allowlists and business hours are plain, testable code.</li>
        <li>No model approves or denies a hold. Only a person does.</li>
        <li>No model takes the action. Your agent does, and only after Abeyance answers.</li>
        <li>If the risk model cannot be reached, nothing is allowed by default. The action is held for a person.</li>
      </ul>
    ),
  },
  {
    id: "oversight",
    title: "Human oversight by design",
    body: (
      <>
        <p>Oversight is the product, not a setting:</p>
        <ul>
          <li>held actions go to a person, in the console, Slack or Microsoft Teams, with the reason in plain words;</li>
          <li>if nobody answers before the timeout, the action does not happen;</li>
          <li>an emergency brake pauses one agent, or every agent, at once;</li>
          <li>shadow mode lets you see what Abeyance would decide before it stops anything;</li>
          <li>every decision and approval is recorded in a hash-chained ledger that cannot be quietly changed.</li>
        </ul>
      </>
    ),
  },
  {
    id: "eu-ai-act",
    title: "EU AI Act, Article 14",
    body: (
      <>
        <p>
          Article 14 asks that high-risk AI systems can be overseen effectively by people: that overseers can understand the system’s output, avoid
          relying on it blindly, decide not to use it or override it, and stop it.
        </p>
        <p>
          Abeyance is designed to help you provide that oversight over your own agents. Reason codes and explanations help a reviewer understand an
          action. Approve and deny let them override it. The emergency brake lets them stop it. The ledger and evidence pack show that it happened.
        </p>
        <p>
          Whether your agents are high-risk, and what the Act requires of you, depends on your use case. That assessment is yours to make with your
          advisers. Using Abeyance does not by itself make a system compliant.
        </p>
      </>
    ),
  },
  {
    id: "cps-230",
    title: "APRA CPS 230",
    body: (
      <>
        <p>
          CPS 230 asks APRA-regulated entities, such as banks, insurers and superannuation funds, to manage operational risk, maintain critical
          operations through disruption, and manage the risks of their service providers.
        </p>
        <p>
          Abeyance gives you a control over one operational risk: an agent taking an irreversible action it should not. The evidence pack maps
          decisions and controls to CPS 230, the EU AI Act and the NIST AI Risk Management Framework. Abeyance is also a service provider you will
          want to assess under CPS 230 yourself. Our <Link href="/security">Security</Link> and{" "}
          <Link href="/legal/subprocessors">Subprocessors</Link> pages are a starting point.
        </p>
      </>
    ),
  },
  {
    id: "limitations",
    title: "Limitations",
    body: (
      <ul>
        <li>
          The risk model can be wrong. It may score a harmful action as low risk, or a harmless one as high. Thresholds and rules reduce the impact,
          but do not remove it.
        </li>
        <li>
          Redaction is pattern-based. It catches structured identifiers, such as tax file numbers and card numbers, but can miss personal
          information in free text, such as a name in a sentence.
        </li>
        <li>Explanations can be incomplete or inaccurate. They help a reviewer; they are not evidence on their own.</li>
        <li>Abeyance only sees the actions your agents send to it. An agent that does not call Abeyance is not controlled by it.</li>
        <li>Start in shadow mode, so you can see how Abeyance behaves on your own traffic before relying on it.</li>
      </ul>
    ),
  },
  {
    id: "certification",
    title: "Certification",
    body: (
      <p>
        Abeyance has not been certified or assessed against the EU AI Act, ISO/IEC 42001 or any other AI standard. We describe how it is designed,
        not a certification it does not have. Questions go to {CONTACT_EMAIL}.
      </p>
    ),
  },
];

export default function ResponsibleAiPage() {
  return (
    <LegalLayout
      eyebrow="Trust"
      title="Responsible AI"
      intro={<p>What the models in Abeyance do, what they never do, and where people stay in charge.</p>}
      sections={SECTIONS}
      back={{ href: "/trust", label: "Trust centre" }}
    />
  );
}
