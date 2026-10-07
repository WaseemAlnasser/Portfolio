import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BillingSync,
  CostComparison,
  DeliveritArchitecture,
  DomainWorkflow,
  OtpControls,
  PaymentFlow,
  TenantProvisioning,
  VpnProvisioning,
} from "@/components/Diagrams";
import { MediaGallery } from "@/components/MediaGallery";
import { loadAllCaseStudies, loadCaseStudy } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { caseStudySlugs, site, type CaseStudySlug } from "@/lib/site";

/** Diagram shown after the section with the given heading, keyed by slug. */
const diagrams: Record<CaseStudySlug, Record<string, ReactNode>> = {
  deliverit: {
    "System overview": <DeliveritArchitecture />,
    "Reducing location API costs by approximately 88%": <CostComparison />,
    "Aligning Stripe payments with delivery completion": <PaymentFlow />,
    "Responding to production OTP abuse": <OtpControls />,
  },
  "multi-tenant-saas": {
    "Turning registration into a provisioned store": <TenantProvisioning />,
    "Purchasing and connecting domains inside the product": <DomainWorkflow />,
    "Maintaining subscriptions and entitlements": <BillingSync />,
  },
  "vpn-platform": {
    "Automating server provisioning": <VpnProvisioning />,
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

function isSlug(s: string): s is CaseStudySlug {
  return (caseStudySlugs as readonly string[]).includes(s);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isSlug(slug)) return {};
  const cs = loadCaseStudy(slug);
  return pageMetadata({ title: cs.title, description: cs.summary, path: `/work/${slug}/` });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const cs = loadCaseStudy(slug);
  const all = loadAllCaseStudies();
  const next = all[(all.findIndex((c) => c.slug === slug) + 1) % all.length];
  const map = diagrams[slug];
  const known = new Set(cs.sections.map((s) => s.title));
  for (const key of Object.keys(map)) {
    if (!known.has(key)) throw new Error(`Diagram anchor "${key}" not found in content/${slug}.md`);
  }
  const media = site.media[slug] ?? [];
  const external = site.projectUrls[slug];
  const showContents = cs.sections.length >= 5;

  return (
    <article className="container-page py-10 md:py-14">
      <p>
        <Link href="/#work" className="link-inline text-sm font-medium">
          ← Back to selected work
        </Link>
      </p>

      <header className="mt-6 max-w-3xl">
        <p className="label !text-accent">{cs.status}</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{cs.heading}</h1>
        <dl className="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="label">Period</dt>
            <dd>{cs.period}</dd>
          </div>
          <div>
            <dt className="label">Role</dt>
            <dd>{cs.role}</dd>
          </div>
        </dl>
        {external && (
          <p className="mt-4">
            <a className="link-inline" href={external} rel="noopener noreferrer">
              Visit {new URL(external).hostname}
            </a>
          </p>
        )}
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[14rem_minmax(0,1fr)]">
        {showContents ? (
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <p className="label mb-3">On this page</p>
            <ol className="space-y-2 text-sm">
              {media.length > 0 && (
                <li>
                  <a className="text-muted hover:text-accent hover:underline" href="#screens">
                    The app
                  </a>
                </li>
              )}
              {cs.sections.map((s) => (
                <li key={s.id}>
                  <a className="text-muted hover:text-accent hover:underline" href={`#${s.id}`}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : (
          <div className="hidden lg:block" />
        )}

        <div className="min-w-0">
          <div className="prose-article text-lg" dangerouslySetInnerHTML={{ __html: cs.lead }} />

          {media.length > 0 && (
            <section id="screens" aria-labelledby="screens-h" className="mt-10">
              <h2 id="screens-h" className="text-2xl font-semibold tracking-tight sm:text-3xl">
                The app
              </h2>
              {site.mediaNotes[slug] && <p className="mt-2 max-w-3xl text-sm text-muted">{site.mediaNotes[slug]}</p>}
              <div className="mt-5">
                <MediaGallery items={media} />
              </div>
            </section>
          )}

          {cs.sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="mt-12">
              <h2 id={`${s.id}-h`} className="max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
                {s.title}
              </h2>
              <div className="prose-article mt-4" dangerouslySetInnerHTML={{ __html: s.html }} />
              {map[s.title]}
            </section>
          ))}
        </div>
      </div>

      <aside aria-labelledby="next-h" className="mt-16 rounded-2xl border border-line bg-card p-6 sm:p-8">
        <h2 id="next-h" className="label">
          Next
        </h2>
        <p className="mt-2 text-xl font-semibold">
          <Link className="link-inline" href={`/work/${next.slug}/`}>
            {next.title}
          </Link>
        </p>
        <p className="mt-2 text-muted">
          Or get in touch:{" "}
          <a className="link-inline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
      </aside>
    </article>
  );
}
