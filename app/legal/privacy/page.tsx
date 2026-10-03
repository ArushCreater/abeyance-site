import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalTable, type LegalSection } from "@/components/legal/LegalLayout";
import { ABN, ADDRESS, COMPANY, EU_REP, PRIVACY_EMAIL, Placeholder } from "@/components/legal/Placeholder";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Abeyance handles personal information under the Australian Privacy Act and the APPs, the GDPR and the CCPA. This site sets no cookies and runs no analytics.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "scope",
    title: "Who we are and what this covers",
    body: (
      <>
        <p>
          {COMPANY} (ABN {ABN}), of {ADDRESS}, makes Abeyance. This policy explains how we handle personal information about people who visit
          this website, ask to become a design partner, sign in to the Abeyance console, or deal with us as a business contact.
        </p>
        <p>
          We follow the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs). Where the EU or UK General Data Protection
          Regulation or Californian privacy law applies, the sections below on those laws apply as well.
        </p>
        <p>
          When our customers send data to Abeyance, such as the actions their agents propose, we handle it on their behalf and under their
          instructions. For that data the customer decides what happens to it, their own privacy policy applies, and our{" "}
          <Link href="/legal/dpa">Data Processing Addendum</Link> governs what we may do.
        </p>
      </>
    ),
  },
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <h3>When you visit this website</h3>
        <p>
          This website sets no cookies and has no analytics, advertising or tracking scripts. Our hosting provider, Vercel, processes technical
          information such as your IP address and browser type to deliver pages and protect the service from abuse.
        </p>
        <h3>When you ask to become a design partner</h3>
        <p>
          The form asks for your name, work email, company, team, how far along your agents are, and anything you choose to write about what your
          agents should never do without asking. We also record when the request arrived and your browser’s user agent.
        </p>
        <p>
          To stop repeated submissions, we look at your IP address for a short time in memory. We do not store it with your request. If sending
          your request by email fails, its details are written to our hosting provider’s logs so that it is not lost.
        </p>
        <h3>When you use the Abeyance console</h3>
        <p>
          Your name, work email, role in your organisation’s workspace, single sign-on identifiers if your organisation uses them, and records of
          what you do in the console, such as approving or denying a held action. Approvals and denials are recorded in your organisation’s
          decision ledger.
        </p>
        <h3>When you deal with us as a business contact</h3>
        <p>Your name, role, organisation and contact details, and what you tell us in emails and meetings.</p>
        <p>
          We do not ask for sensitive information, such as health information or racial or ethnic origin. Please do not include it in the partner
          form.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use it",
    body: (
      <ul>
        <li>to reply to design partner requests and other enquiries, and to run design partnerships and pilots;</li>
        <li>to provide the console, sign you in, keep your session secure and enforce your role;</li>
        <li>to keep Abeyance and this website secure, and to investigate misuse;</li>
        <li>to meet our legal, accounting and regulatory obligations;</li>
        <li>to send service messages about your account. We do not send marketing email without your consent.</li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <>
        <p>This website sets no cookies, and runs no analytics or trackers. That is why there is no cookie banner.</p>
        <p>
          The Abeyance console sets one cookie, <code>abey_session</code>, which keeps you signed in. It is strictly necessary, it is HttpOnly so
          scripts cannot read it, and it is not used for tracking. Details are on our <Link href="/legal/cookies">Cookies</Link> page.
        </p>
      </>
    ),
  },
  {
    id: "disclosure",
    title: "Who we share it with",
    body: (
      <>
        <p>
          We share personal information with service providers who help us run Abeyance and this website, such as our hosting, database and email
          providers. They may use it only to provide their service to us. The full list, with what each receives and where, is on our{" "}
          <Link href="/legal/subprocessors">Subprocessors</Link> page.
        </p>
        <p>
          We may also disclose personal information if the law requires it, to protect rights or safety, or as part of a sale or restructure of our
          business, in which case the buyer must handle it as this policy describes.
        </p>
        <p>We do not sell personal information, and we do not share it for advertising.</p>
      </>
    ),
  },
  {
    id: "overseas",
    title: "Overseas disclosure (APP 8)",
    body: (
      <>
        <p>
          Some of our service providers store or process personal information outside Australia. Our application and database run in Singapore.
          Email delivery and some AI providers are based in the United States. The countries involved are:
        </p>
        <ul>
          <li>Singapore, for hosting, the database and sign-in;</li>
          <li>
            the United States, for email delivery and for hold explanations <Placeholder>CONFIRM REGION</Placeholder>;
          </li>
          <li>
            <Placeholder>OTHER COUNTRIES, CONFIRM WITH SUBPROCESSOR LIST</Placeholder>.
          </li>
        </ul>
        <p>
          Before disclosing personal information overseas, we take reasonable steps to make sure the recipient handles it consistently with the
          APPs, including through contract terms. Customers can keep their decision data in their own Postgres database, in a region they choose.
        </p>
      </>
    ),
  },
  {
    id: "security-retention",
    title: "Security and how long we keep it",
    body: (
      <>
        <p>
          We use encryption in transit, encrypt stored credentials, restrict access by role and keep server-side sessions. More is on our{" "}
          <Link href="/security">Security</Link> page.
        </p>
        <p>
          We keep design partner requests for <Placeholder>N</Placeholder> months after our last contact with you, console account information for
          as long as your organisation’s account is active plus <Placeholder>N</Placeholder> days, and business records for as long as the law
          requires. Then we delete or de-identify it.
        </p>
      </>
    ),
  },
  {
    id: "access",
    title: "Access and correction",
    body: (
      <p>
        You can ask for the personal information we hold about you, and ask us to correct it. Write to {PRIVACY_EMAIL}. We will reply within 30
        days. If we refuse, we will tell you why and how to complain. If your information is in a customer’s workspace, such as an approval you
        recorded at work, we will pass your request to that customer, since they control that data.
      </p>
    ),
  },
  {
    id: "complaints",
    title: "Complaints",
    body: (
      <>
        <p>
          If you think we have mishandled your personal information, write to {PRIVACY_EMAIL}. We will acknowledge your complaint within{" "}
          <Placeholder>N</Placeholder> working days and aim to resolve it within 30 days.
        </p>
        <p>
          If you are not satisfied with our response, you can complain to the Office of the Australian Information Commissioner (OAIC) at{" "}
          <a href="https://www.oaic.gov.au" rel="noopener">
            oaic.gov.au
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "gdpr",
    title: "If you are in the EU or UK (GDPR)",
    body: (
      <>
        <p>
          For the personal information described in this policy, {COMPANY} is the controller. Our representative in the EU under Article 27 GDPR
          is {EU_REP}. Our representative in the UK is <Placeholder>UK REPRESENTATIVE</Placeholder>.
        </p>
        <h3>Lawful bases</h3>
        <LegalTable
          head={["What we do", "Lawful basis"]}
          rows={[
            ["Replying to a design partner request", "Our legitimate interest in answering business enquiries, or steps you asked for before a contract"],
            ["Providing the console to you", "Performance of our contract with your organisation, and our legitimate interest in providing a service your employer has chosen"],
            ["Security and abuse prevention", "Our legitimate interest in keeping the service and its users safe"],
            ["Records we must keep", "Compliance with a legal obligation"],
            ["Marketing email, if you opt in", "Consent, which you can withdraw at any time"],
          ]}
        />
        <h3>Your rights</h3>
        <p>
          You can ask to access, correct or delete your personal information, to restrict or object to how we use it, and to receive it in a
          portable format. Where we rely on consent, you can withdraw it. Write to {PRIVACY_EMAIL}. You can also complain to your local data
          protection authority.
        </p>
        <h3>Transfers</h3>
        <p>
          We are based in Australia, which does not have an adequacy decision from the European Commission. When we transfer personal information
          out of the EU or UK, including to Australia, Singapore and the United States, we rely on the European Commission’s Standard Contractual
          Clauses or the UK International Data Transfer Addendum, together with additional safeguards where needed. You can ask us for a copy.
        </p>
      </>
    ),
  },
  {
    id: "ccpa",
    title: "If you are in California (CCPA and CPRA)",
    body: (
      <>
        <p>To the extent the California Consumer Privacy Act, as amended by the CPRA, applies to us:</p>
        <ul>
          <li>
            In the last 12 months we have collected identifiers (such as name and email), professional information (such as company and team) and
            limited internet activity information (such as browser type), from you directly and from your use of the console, for the purposes set
            out above.
          </li>
          <li>We do not sell or share personal information, as those terms are defined, and we have not done so in the last 12 months.</li>
          <li>We do not use or disclose sensitive personal information for any purpose that would give you a right to limit it.</li>
          <li>
            You have the right to know what we collect and how we use it, and to ask us to delete or correct it. We will not treat you differently
            for using these rights.
          </li>
        </ul>
        <p>
          To make a request, write to {PRIVACY_EMAIL}. We will check your identity by confirming details we already hold. An authorised agent can
          make a request for you with your signed permission.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We will update this policy when how we handle personal information changes, and change the date at the top. If a change is significant, we
        will tell console users by email before it takes effect.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Privacy questions and requests go to {PRIVACY_EMAIL}, or by post to {ADDRESS}.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Privacy Policy"
      intro={
        <p>
          We collect as little as we can. This website sets no cookies and runs no analytics. Here is what we do collect, why, where it goes, and
          what you can ask us to do with it.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
