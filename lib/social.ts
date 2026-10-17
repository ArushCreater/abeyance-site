import type { Metadata } from "next";

const SITE_NAME = "Abeyance";
const IMAGE_ALT =
  "Abeyance asks before your AI agents do anything that matters. The Abeyance logo over a cobalt-to-ember gradient, with npx abeyance init.";
// The card image. A page that sets its own openGraph loses the file-based one, so it's named here too.
const OG_IMAGE = { url: "/opengraph-image.jpg", width: 1200, height: 630, alt: IMAGE_ALT, type: "image/jpeg" };
const X_IMAGE = { url: "/twitter-image.jpg", width: 1200, height: 630, alt: IMAGE_ALT };

/**
 * A page's metadata, with its social card. Next.js replaces (doesn't merge)
 * openGraph and twitter between segments, so each page that has its own
 * title builds them here, with the shared image from app/opengraph-image.jpg
 * and app/twitter-image.jpg.
 */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const full = `${title} · ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_AU", url: path, title: full, description, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: full, description, images: [X_IMAGE] },
  };
}
