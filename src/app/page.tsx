import { Hero } from "@/components/Hero";
import { CompactProject, ProjectFeature } from "@/components/Projects";
import { loadAllCaseStudies, loadHome, mdInline } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { caseStudySlugs, site } from "@/lib/site";

const home = loadHome();

export const metadata = pageMetadata({
  title: home.title,
  description:
    "Full Stack Software Engineer in Dubai with production experience across backend systems, Flutter mobile apps, Stripe payments and cloud infrastructure. Case studies on Deliverit, a multi-tenant SaaS and a VPN platform.",
  path: "/",
});

// Hand-written one-line results, each restating a figure from the case-study copy.
const leadResults: Record<string, string> = {
  deliverit: "Reduced Google API costs by approximately 88%, from $300 to $36 per month.",
};

const clientSlugs: Record<string, string> = {
  "Elite Style Beauty Salon": "elite-style",
  "Rapid Medics": "rapid-medics",
};

function Heading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-3xl font-semibold tracking-tight sm:text-[2rem]">
      {children}
    </h2>
  );
}

function jsonLd() {
  const sameAs = [site.linkedinUrl, site.githubUrl].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.title,
    address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
    ...(site.siteUrl ? { url: site.siteUrl } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export default function HomePage() {
  const cases = loadAllCaseStudies();
  if (home.featured.length !== caseStudySlugs.length) {
    throw new Error("content/home.md: featured projects must match the case-study routes");
  }
  const cvLinks = [
    site.cv.backend && { label: site.cv.fullStack ? "Download Backend CV" : "Download CV", href: site.cv.backend },
    site.cv.fullStack && { label: site.cv.backend ? "Download Full Stack CV" : "Download CV", href: site.cv.fullStack },
  ].filter(Boolean) as { label: string; href: string }[];
  const socials = [
    site.linkedinUrl && { label: "LinkedIn", href: site.linkedinUrl },
    site.githubUrl && { label: "GitHub", href: site.githubUrl },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />

      <Hero eyebrow={home.hero.eyebrow} headline={home.hero.headline} body={home.hero.paragraphs} />

      <section aria-labelledby="results" className="border-y border-line bg-card">
        <div className="container-page py-10">
          <h2 id="results" className="label mb-6">
            {home.resultsHeading}
          </h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {home.results.map((r) => (
              <li key={r.figure}>
                <p className="text-3xl font-semibold tracking-tight text-accent">{r.figure}</p>
                <p className="mt-1 text-muted" dangerouslySetInnerHTML={{ __html: mdInline(r.text) }} />
              </li>
            ))}
          </ul>
          {home.resultsNote && <p className="mt-6 max-w-3xl text-sm text-muted">{home.resultsNote}</p>}
        </div>
      </section>

      <section id="work" aria-labelledby="work-heading" className="container-page py-16 md:py-20">
        <Heading id="work-heading">Selected work</Heading>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {home.featured.map((project, i) => {
            const slug = caseStudySlugs[i];
            const cs = cases[i];
            return (
              <div key={slug} className={i === 0 ? "lg:col-span-2" : ""}>
                <ProjectFeature
                  project={project}
                  slug={slug}
                  status={cs.status}
                  result={leadResults[slug]}
                  size={i === 0 ? "lead" : i === 1 ? "standard" : "small"}
                />
              </div>
            );
          })}
        </div>

        <h3 className="mt-14 text-xl font-semibold">Client products and ongoing work</h3>
        <div className="mt-4 rounded-2xl border border-line bg-card px-6 sm:px-8">
          {home.clients.map((c) => (
            <CompactProject key={c.title} project={c} slug={clientSlugs[c.title]} period={site.projectPeriods[clientSlugs[c.title]]}
              media={site.media[clientSlugs[c.title]]}
              sites={c.title.startsWith("WordPress") ? site.clientSites : undefined}
            />
          ))}
        </div>
      </section>

      <section id="about" aria-labelledby="about-heading" className="border-t border-line bg-card py-16 md:py-20">
        <div className="container-page">
          <Heading id="about-heading">About</Heading>
          <div className="prose-article mt-6 space-y-4 text-lg">
            {home.about.map((p) => (
              <p key={p} dangerouslySetInnerHTML={{ __html: mdInline(p) }} />
            ))}
          </div>
        </div>
      </section>

      <section id="experience" aria-labelledby="experience-heading" className="container-page py-16 md:py-20">
        <Heading id="experience-heading">Experience</Heading>
        <ol className="mt-8 space-y-8 border-l-2 border-line pl-6">
          {home.experience.map((e) => {
            const dates =
              site.deliveritEnd && e.title.startsWith("Deliverit")
                ? e.dates.replace("Present", site.deliveritEnd)
                : e.dates;
            return (
              <li key={e.title} className="relative">
                <span aria-hidden="true" className="absolute -left-[1.9rem] top-2 h-3 w-3 rounded-full bg-accent" />
                <h3 className="text-xl font-semibold">{e.title}</h3>
                <p className="label mt-1">{dates}</p>
                {e.note && <p className="mt-3 text-sm italic text-muted">{e.note}</p>}
                <div className="prose-article mt-3 text-muted">
                  {e.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="skills-heading" className="border-t border-line bg-card py-16 md:py-20">
        <div className="container-page">
          <Heading id="skills-heading">Technical skills</Heading>
          <dl className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {home.skills.map((g) => (
              <div key={g.group}>
                <dt className="font-semibold">{g.group}</dt>
                <dd className="mt-1 text-muted">{g.items}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="education-heading" className="container-page grid gap-10 py-16 md:grid-cols-2 md:py-20">
        <div>
          <Heading id="education-heading">Education</Heading>
          <div className="mt-4 space-y-1 text-muted">
            {home.education.map((l) => (
              <p key={l} dangerouslySetInnerHTML={{ __html: mdInline(l) }} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-[2rem]">Languages</h2>
          <div className="mt-4 space-y-1 text-muted">
            {home.languages.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-heading" className="on-dark bg-panel py-16 text-panel-ink md:py-20">
        <div className="container-page">
          <h2 id="contact-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {home.contact.heading}
          </h2>
          {home.contact.paragraphs.length > 0 && (
            <div className="mt-4 max-w-2xl space-y-3 text-lg text-panel-ink/90">
              {home.contact.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          )}
          {site.availableFrom && <p className="mt-4 font-medium">Available from {site.availableFrom}.</p>}
          <p className="mt-6">{site.location}</p>
          <ul className="mt-2 space-y-1 text-lg">
            <li>
              <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a className="underline underline-offset-4" href={site.phoneHref}>
                {site.phoneDisplay}
              </a>
            </li>
            {socials.map((s) => (
              <li key={s.label}>
                <a className="underline underline-offset-4" href={s.href} rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          {cvLinks.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {cvLinks.map((c) => (
                <a key={c.href} className="btn border-white bg-white text-panel hover:bg-[#e8efeb]" href={c.href} download>
                  {c.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
