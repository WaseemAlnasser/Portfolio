import type { MetadataRoute } from "next";
import { caseStudySlugs, site } from "@/lib/site";

export const dynamic = "force-static";

/** Empty until the real domain is configured, so no placeholder hosts are published. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.siteUrl || !site.readyForIndexing) return [];
  const paths = ["/", ...caseStudySlugs.map((s) => `/work/${s}/`)];
  return paths.map((p) => ({ url: new URL(p, site.siteUrl!).toString() }));
}
