import type { Metadata, Viewport } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Abeyance — Control what your AI agents can do.",
    template: "%s · Abeyance",
  },
  description:
    "The approval and audit layer for AI agents. Set rules, approve actions in Slack, and keep a tamper-evident trail. Smart risk scoring observes alongside your policies.",
  // Icons come from the file conventions: app/icon.svg, app/favicon.ico, app/apple-icon.png.
};

export const viewport: Viewport = {
  themeColor: "#fbfbfd",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${manrope.variable} ${plexMono.variable}`}>
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
