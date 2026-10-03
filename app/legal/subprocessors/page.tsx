import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalTable, type LegalSection } from "@/components/legal/LegalLayout";
import { Placeholder, PRIVACY_EMAIL } from "@/components/legal/Placeholder";

export const metadata: Metadata = {
  title: "Subprocessors",
  description:
    "The third parties that process customer data for Abeyance, what each receives and where, plus the integrations customers can enable themselves.",
};

const CONFIRM = <Placeholder>CONFIRM REGION</Placeholder>;

const SUBPROCESSORS = [
  ["Vercel", "Hosts the application and this website; runs our serverless functions", "Requests to the service, including proposed actions and console traffic", "Singapore (sin1)"],
  ["Supabase", "Postgres database and sign-in (Supabase Auth)", "Customer Data, including the decision ledger; user accounts", "Singapore, same region as hosting"],
  ["Resend", "Sends transactional email, including design partner requests from this website", "Recipient addresses and message content", <>United States {CONFIRM}</>],
  ["TypeSafe (Jev model)", "Scores the risk of each proposed action", "A redacted view of the proposed action, with personal identifiers removed", CONFIRM],
  ["Anthropic (Claude)", "Writes a plain-language explanation for held actions, after the decision", "A redacted view of the held action and its decision", <>United States {CONFIRM}</>],
  ["OpenRouter", "Routes requests to Anthropic’s models, where used instead of a direct connection", "The same redacted view sent for explanations", <>United States {CONFIRM}</>],
];

const INTEGRATIONS = [
  ["Slack", "Approver cards, so reviewers can approve or deny a hold in one click", "Details of held actions, sent to the people and channels you configure"],
  ["Microsoft Teams (Microsoft)", "Approver cards, so reviewers can approve or deny a hold in one click", "Details of held actions, sent to the people and channels you configure"],
  ["Salesforce, HubSpot, Zendesk", "Context connectors: look up records to inform a decision", "Record lookups and the data they return"],
  ["Splunk, Datadog, Microsoft Sentinel, Elastic", "Receive exports of the decision ledger, as JSON Lines or CSV", "Ledger entries, reason codes and hashes"],
  ["Your own model endpoint (Amazon Bedrock, Google Vertex AI, Azure AI Foundry)", "Runs models in your own cloud account instead of ours", "Whatever the model call requires, in your region"],
  ["Your own Postgres database", "Stores your workspace’s data in a database you control", "Customer Data for that workspace"],
];

const SECTIONS: LegalSection[] = [
  {
    id: "list",
    title: "Our subprocessors",
    body: (
      <>
        <p>
          These companies process customer data on our behalf. Each is bound by written terms that protect it at least as well as our{" "}
          <Link href="/legal/dpa">Data Processing Addendum</Link>.
        </p>
        <LegalTable head={["Subprocessor", "Purpose", "Data", "Location"]} rows={SUBPROCESSORS} />
        <p>
          Personal identifiers are redacted before a proposed action reaches TypeSafe or Anthropic. Explanations run only on held actions, after the
          decision has been made, and never decide anything.
        </p>
      </>
    ),
  },
  {
    id: "integrations",
    title: "Integrations you enable",
    body: (
      <>
        <p>
          These are not our subprocessors. They run only if you switch them on, they act on your instructions, and their own terms apply between
          you and them.
        </p>
        <LegalTable head={["Integration", "What it does", "Data exchanged"]} rows={INTEGRATIONS} />
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this list",
    body: (
      <p>
        We will update this page and tell customers at least <Placeholder>N</Placeholder> days before adding or replacing a subprocessor. To be told
        by email, write to {PRIVACY_EMAIL}. Customers may object as the Data Processing Addendum describes.
      </p>
    ),
  },
];

export default function SubprocessorsPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Subprocessors"
      intro={<p>Who processes customer data for us, what they receive, and where. Locations we have yet to confirm are marked.</p>}
      sections={SECTIONS}
    />
  );
}
