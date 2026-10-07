import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!site.readyForIndexing || !site.siteUrl) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/" }, sitemap: new URL("/sitemap.xml", site.siteUrl).toString() };
}
