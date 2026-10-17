import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Newsreader carries the voice (headlines and prose); Geist the interface; Geist Mono the code.
const serif = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});
const sans = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const HOME_TITLE = "Abeyance — Approval and audit for AI agent actions";
const HOME_DESCRIPTION =
  "Abeyance asks before your AI agents do anything that matters. Rules decide what runs, what waits for a person in Slack, and what never happens, with a tamper-evident audit log. Install in five minutes.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: HOME_TITLE, template: "%s · Abeyance" },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Abeyance", locale: "en_AU", url: "/", title: HOME_TITLE, description: HOME_DESCRIPTION },
  twitter: { card: "summary_large_image", title: HOME_TITLE, description: HOME_DESCRIPTION },
  // Icons and the social image come from file conventions in app/.
};

export const viewport: Viewport = {
  themeColor: "#fbfbf9",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" suppressHydrationWarning className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-bg text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-raised focus:px-3 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
