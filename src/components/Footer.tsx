import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="container-page flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <p>
          {site.name} · {site.title} · {site.location}
        </p>
        <p>
          <a className="link-inline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </p>
      </div>
    </footer>
  );
}
