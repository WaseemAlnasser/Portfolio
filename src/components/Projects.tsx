import Link from "next/link";
import { mdInline, type HomeProject } from "@/lib/content";
import { site, type MediaItem } from "@/lib/site";
import { MediaGallery } from "./MediaGallery";

const Para = ({ text, className = "" }: { text: string; className?: string }) => (
  <p className={className} dangerouslySetInnerHTML={{ __html: mdInline(text) }} />
);

export function ProjectFeature({
  project,
  slug,
  status,
  result,
  size,
}: {
  project: HomeProject;
  slug: string;
  status: string;
  result?: string;
  size: "lead" | "standard" | "small";
}) {
  const dark = size === "lead";
  const external = site.projectUrls[slug];
  return (
    <article
      className={`group relative flex flex-col rounded-2xl border p-6 transition-shadow hover:shadow-md sm:p-8 ${
        dark ? "on-dark border-panel bg-panel text-panel-ink lg:p-10" : "border-line bg-card"
      }`}
    >
      <p className={`label mb-3 ${dark ? "!text-[#9fcfc0]" : ""}`}>{status}</p>
      <h3 className={`${size === "lead" ? "text-3xl sm:text-4xl" : "text-2xl"} font-semibold tracking-tight`}>
        {/* The title is the only link; its pseudo-element makes the whole card clickable. */}
        <Link href={`/work/${slug}/`} className="after:absolute after:inset-0 after:content-['']">
          {project.title}
          <span className="sr-only"> case study</span>
        </Link>
      </h3>
      <div className={`mt-4 space-y-3 ${size === "lead" ? "max-w-2xl text-lg" : ""} ${dark ? "text-panel-ink/90" : "text-muted"}`}>
        {project.body.map((p) => (
          <Para key={p} text={p} />
        ))}
      </div>
      {result && (
        <p className={`mt-5 border-l-2 pl-4 font-medium ${dark ? "border-[#6fc1aa]" : "border-accent text-ink"}`}>{result}</p>
      )}
      {project.tech && (
        <p className={`mt-5 font-mono text-[0.8rem] leading-relaxed ${dark ? "text-[#9fcfc0]" : "text-muted"}`}>{project.tech}</p>
      )}
      <p className={`mt-6 text-sm font-semibold ${dark ? "text-white" : "text-accent"}`} aria-hidden="true">
        Read the case study →
      </p>
      {external && (
        <p className="relative z-10 mt-3 text-sm">
          <a
            className={`underline underline-offset-3 ${dark ? "text-white" : "link-inline"}`}
            href={external}
            rel="noopener noreferrer"
          >
            Visit {new URL(external).hostname}
          </a>
        </p>
      )}
    </article>
  );
}

export function CompactProject({ project, slug, period, sites, media }: { project: HomeProject; slug?: string; period?: string; sites?: { label: string; url: string }[]; media?: MediaItem[] }) {
  const external = slug ? site.projectUrls[slug] : null;
  return (
    <article className="border-t border-line py-6 first:border-t-0 md:grid md:grid-cols-[14rem_1fr] md:gap-8">
      <div>
        <h3 className="text-lg font-semibold">{project.title}</h3>
        {(project.status || period) && <p className="label mt-1 !text-accent">{project.status ?? period}</p>}
      </div>
      <div className="mt-2 space-y-2 text-muted md:mt-0">
        {project.body.map((p) => (
          <Para key={p} text={p} />
        ))}
        {media && media.length > 0 && (
          <div className="pt-2">
            <MediaGallery items={media} compact />
          </div>
        )}
        {sites && sites.length > 0 && (
          <p>
            Live sites:{" "}
            {sites.map((s, i) => (
              <span key={s.url}>
                {i > 0 && ", "}
                <a className="link-inline" href={s.url} rel="noopener noreferrer">
                  {s.label}
                </a>
              </span>
            ))}
          </p>
        )}
        {external && (
          <p>
            <a className="link-inline" href={external} rel="noopener noreferrer">
              Visit {project.title}
            </a>
          </p>
        )}
      </div>
    </article>
  );
}
