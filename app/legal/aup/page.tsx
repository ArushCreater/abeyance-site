import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, type LegalSection } from "@/components/legal/LegalLayout";
import { CONTACT_EMAIL, SECURITY_EMAIL } from "@/components/legal/Placeholder";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description: "What organisations and their AI agents may not use Abeyance to do.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "purpose",
    title: "Why this policy exists",
    body: (
      <>
        <p>
          Abeyance exists to make AI agents safer to run. This policy sets out what you, your users and your agents may not do with it. It forms
          part of our <Link href="/legal/terms">Terms of Service</Link>.
        </p>
        <p>You are responsible for your agents as if they were your users. If an agent breaks this policy, you have broken it.</p>
      </>
    ),
  },
  {
    id: "unlawful",
    title: "Unlawful or harmful activity",
    body: (
      <>
        <p>Do not use Abeyance to:</p>
        <ul>
          <li>break any law, including privacy, consumer protection, anti-discrimination, sanctions, anti-money laundering or financial services law;</li>
          <li>defraud, deceive or manipulate anyone, or help someone else do so;</li>
          <li>send spam or unsolicited commercial messages through an agent;</li>
          <li>harass, threaten or harm people;</li>
          <li>process personal information you have no right to process.</li>
        </ul>
      </>
    ),
  },
  {
    id: "oversight",
    title: "Undermining human oversight",
    body: (
      <>
        <p>Abeyance puts people in the loop for the actions that matter. Do not:</p>
        <ul>
          <li>describe an action falsely, or leave out context, so that it scores as lower risk than it is;</li>
          <li>split one action into smaller ones to stay under a threshold or spending cap;</li>
          <li>approve held actions automatically, or let an agent approve its own holds;</li>
          <li>represent to your customers or regulators that a person reviewed an action when Abeyance allowed it without one.</li>
        </ul>
      </>
    ),
  },
  {
    id: "service",
    title: "Protecting the service",
    body: (
      <>
        <p>Do not:</p>
        <ul>
          <li>access, or try to access, another customer’s workspace or data;</li>
          <li>probe, scan or test the security of Abeyance, except as our Vulnerability Disclosure Policy allows;</li>
          <li>interfere with the decision ledger or try to break its hash chain;</li>
          <li>overload the service, or get around rate limits or usage limits;</li>
          <li>reverse engineer the service, except where the law allows it despite this restriction;</li>
          <li>share API keys or sign-in details, or resell access, without our written agreement;</li>
          <li>use Abeyance to build a competing product.</li>
        </ul>
      </>
    ),
  },
  {
    id: "content",
    title: "Content you send",
    body: (
      <p>
        Send only the data your agents need for a decision. Do not send malware, or content you do not have the right to share. Avoid sending
        special categories of information, such as health records, unless you have agreed this with us in writing.
      </p>
    ),
  },
  {
    id: "enforcement",
    title: "If this policy is broken",
    body: (
      <p>
        We may remove content, suspend an agent or a user, or suspend a workspace if this policy is broken or we reasonably believe it is. Where
        practical we will tell you first and give you a chance to fix it. Suspending a workspace does not delete your decision ledger.
      </p>
    ),
  },
  {
    id: "report",
    title: "Reporting misuse",
    body: (
      <p>
        Report misuse to {CONTACT_EMAIL}. Report security vulnerabilities to {SECURITY_EMAIL}, as our{" "}
        <Link href="/legal/vulnerability-disclosure">Vulnerability Disclosure Policy</Link> describes.
      </p>
    ),
  },
];

export default function AupPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Acceptable Use Policy"
      intro={<p>The short list of things you and your agents may not use Abeyance to do.</p>}
      sections={SECTIONS}
    />
  );
}
