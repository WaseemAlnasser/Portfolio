import type { Metadata } from "next";
import { site } from "./site";

export const indexable = site.readyForIndexing && Boolean(site.siteUrl);

/** Absolute URLs are only emitted once the real domain is configured. */
export function pageMetadata(opts: { title: string; description: string; path: string }): Metadata {
  const url = site.siteUrl ? new URL(opts.path, site.siteUrl).toString() : null;
  return {
    title: opts.title,
    description: opts.description,
    alternates: url ? { canonical: url } : undefined,
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: opts.title,
      description: opts.description,
      type: "website",
      siteName: site.name,
      ...(url ? { url, images: [{ url: new URL("/og.png", site.siteUrl!).toString(), width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: url ? "summary_large_image" : "summary",
      title: opts.title,
      description: opts.description,
      ...(url ? { images: [new URL("/og.png", site.siteUrl!).toString()] } : {}),
    },
  };
}
