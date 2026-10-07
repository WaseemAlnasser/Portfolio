import { mdInline } from "@/lib/content";
import { site } from "@/lib/site";

const scopes = [
  { name: "Web", caption: "React, Vue.js and Next.js applications alongside Laravel and Node.js back ends." },
  { name: "Mobile", caption: "Flutter applications for Android and iOS, including store subscriptions." },
  { name: "Backend", caption: "Node.js/TypeScript and Laravel services with MySQL, Redis and queues." },
  { name: "Operations", caption: "Docker deployments, GitHub Actions, monitoring and production releases." },
];

export function Hero({
  eyebrow,
  headline,
  body,
}: {
  eyebrow: string;
  headline: string;
  body: string[];
}) {
  return (
    <section className="container-page grid gap-10 py-14 md:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center">
      <div>
        <p className="label mb-4">{eyebrow}</p>
        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          <span className="sr-only">{site.name}. </span>
          {headline}
        </h1>
        <div className="mt-6 max-w-xl space-y-4 text-lg text-muted">
          {body.map((p) => (
            <p key={p} dangerouslySetInnerHTML={{ __html: mdInline(p) }} />
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a className="btn btn-primary" href="#work">
            View selected work
          </a>
          <a className="btn btn-secondary" href={`mailto:${site.email}`}>
            Email me
          </a>
        </div>
      </div>

      <figure aria-labelledby="scopes-caption" className="rounded-2xl border border-line bg-card p-5 sm:p-6">
        <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {scopes.map((s) => (
            <li key={s.name} className="bg-card p-4">
              <p className="font-mono text-sm font-semibold text-accent">{s.name}</p>
              <p className="mt-1 text-sm leading-snug text-muted">{s.caption}</p>
            </li>
          ))}
        </ul>
        <figcaption id="scopes-caption" className="mt-3 text-xs text-muted">
          Areas of work at a glance.
        </figcaption>
      </figure>
    </section>
  );
}
