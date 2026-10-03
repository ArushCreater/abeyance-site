/**
 * Legal, trust and compliance pages. One list feeds the /legal index, the
 * trust centre, the footer and the sitemap, so they never drift apart.
 */

/** Shown on every document. Change it whenever a document changes. */
export const LAST_UPDATED = "4 October 2026";
export const LAST_UPDATED_ISO = "2026-10-04";

export type LegalDoc = {
  href: string;
  title: string;
  /** Shorter name for tight spaces such as the footer. */
  short: string;
  summary: string;
};

export const LEGAL_DOCS: LegalDoc[] = [
  {
    href: "/legal/terms",
    title: "Terms of Service",
    short: "Terms",
    summary: "The agreement between your organisation and us for using Abeyance.",
  },
  {
    href: "/legal/privacy",
    title: "Privacy Policy",
    short: "Privacy",
    summary: "What personal information we handle, why, where it goes, and your rights under Australian, EU and Californian law.",
  },
  {
    href: "/legal/dpa",
    title: "Data Processing Addendum",
    short: "DPA",
    summary: "How we process personal data on your behalf when you use the product.",
  },
  {
    href: "/legal/aup",
    title: "Acceptable Use Policy",
    short: "Acceptable use",
    summary: "What you and your agents may not use Abeyance to do.",
  },
  {
    href: "/legal/subprocessors",
    title: "Subprocessors",
    short: "Subprocessors",
    summary: "The third parties that process customer data for us, what they receive and where.",
  },
  {
    href: "/legal/cookies",
    title: "Cookies",
    short: "Cookies",
    summary: "This site sets no cookies. The console sets one, and it is strictly necessary.",
  },
  {
    href: "/legal/pilot",
    title: "Design Partner and Pilot Terms",
    short: "Pilot terms",
    summary: "The short, plain terms for a design partnership or pilot.",
  },
  {
    href: "/legal/vulnerability-disclosure",
    title: "Vulnerability Disclosure Policy",
    short: "Vulnerability disclosure",
    summary: "How to report a security issue to us, and how we will treat you when you do.",
  },
];

export const TRUST_PAGES: LegalDoc[] = [
  {
    href: "/trust",
    title: "Trust centre",
    short: "Trust centre",
    summary: "Security, privacy, AI transparency and the status of certifications, in one place.",
  },
  {
    href: "/security",
    title: "Security",
    short: "Security",
    summary: "How Abeyance protects decisions, credentials and the ledger.",
  },
  {
    href: "/responsible-ai",
    title: "Responsible AI",
    short: "Responsible AI",
    summary: "What the models in Abeyance do, what they never do, and where people stay in charge.",
  },
];
