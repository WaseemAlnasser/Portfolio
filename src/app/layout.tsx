import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { indexable } from "@/lib/metadata";
import { navItems, site } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f7f7f2" };

export const metadata: Metadata = {
  // Absolute URLs (canonical, social images) are added per page once siteUrl is configured.
  ...(site.siteUrl ? { metadataBase: new URL(site.siteUrl) } : {}),
  title: { default: `${site.name} | ${site.title}`, template: `%s | ${site.name}` },
  description: `${site.name} is a ${site.title} in ${site.location} with production experience in backend systems, mobile, payments and infrastructure.`,
  authors: [{ name: site.name }],
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // CV links appear in navigation only once PDFs are configured.
  const items: { label: string; href: string; external?: boolean }[] = [...navItems];
  const cvTarget = site.cv.fullStack ?? site.cv.backend;
  if (cvTarget) items.push({ label: "CV", href: cvTarget, external: true });

  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Header name={site.name} items={items} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
