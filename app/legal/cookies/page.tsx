import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalTable, type LegalSection } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Cookies",
  description: "This website sets no cookies and runs no analytics. The Abeyance console sets one strictly necessary session cookie.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "site",
    title: "This website",
    body: (
      <p>
        This website sets no cookies. It has no analytics, no advertising and no tracking scripts, so there is nothing to consent to and no cookie
        banner.
      </p>
    ),
  },
  {
    id: "console",
    title: "The Abeyance console",
    body: (
      <>
        <p>The console sets one cookie, which keeps you signed in. It is strictly necessary, so it does not need consent.</p>
        <LegalTable
          head={["Name", "Purpose", "Type"]}
          rows={[
            [<code key="name">abey_session</code>, "Identifies your server-side session after you sign in. HttpOnly, so scripts cannot read it. Not used for tracking.", "Strictly necessary, first party"],
          ]}
        />
      </>
    ),
  },
  {
    id: "changes",
    title: "If this changes",
    body: (
      <p>
        If we ever add a cookie that is not strictly necessary, we will update this page and the <Link href="/legal/privacy">Privacy Policy</Link>{" "}
        first, and ask for your consent where the law requires it.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Cookies"
      intro={<p>The short version: none on this website, and one in the console that keeps you signed in.</p>}
      sections={SECTIONS}
    />
  );
}
