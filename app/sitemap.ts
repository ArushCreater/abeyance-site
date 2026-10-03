import type { MetadataRoute } from "next";
import { LAST_UPDATED_ISO, LEGAL_DOCS, TRUST_PAGES } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const legal = new Date(LAST_UPDATED_ISO);
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/partners`, changeFrequency: "monthly", priority: 0.8 },
    ...TRUST_PAGES.map((p) => ({ url: `${SITE_URL}${p.href}`, lastModified: legal, changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: `${SITE_URL}/legal`, lastModified: legal, changeFrequency: "monthly", priority: 0.4 },
    ...LEGAL_DOCS.map((d) => ({ url: `${SITE_URL}${d.href}`, lastModified: legal, changeFrequency: "monthly" as const, priority: 0.4 })),
  ];
}
