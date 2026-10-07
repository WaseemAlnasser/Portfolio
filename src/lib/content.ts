import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { caseStudySlugs, type CaseStudySlug } from "./site";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Section = { id: string; title: string; body: string };

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Private build notes (<!-- ... -->) must never reach public output. */
function stripComments(src: string): string {
  return src.replace(/<!--[\s\S]*?-->/g, "");
}

function read(file: string) {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return { data, body: stripComments(content).trim() };
}

function finish(c: { title: string; lines: string[] }): Section {
  return { id: slugify(c.title), title: c.title, body: c.lines.join("\n").trim() };
}

/** Split markdown into the intro before the first heading of `level` and its sections. */
export function splitSections(body: string, level: 2 | 3): { intro: string; sections: Section[] } {
  const marker = "#".repeat(level) + " ";
  const intro: string[] = [];
  const sections: Section[] = [];
  let current: { title: string; lines: string[] } | null = null;
  for (const line of body.split("\n")) {
    if (line.startsWith(marker)) {
      if (current) sections.push(finish(current));
      current = { title: line.slice(marker.length).trim(), lines: [] };
    } else if (current) current.lines.push(line);
    else intro.push(line);
  }
  if (current) sections.push(finish(current));
  return { intro: intro.join("\n").trim(), sections };
}

export function md(src: string): string {
  return marked.parse(src, { async: false, gfm: true }) as string;
}

export function mdInline(src: string): string {
  return marked.parseInline(src, { async: false }) as string;
}

export function paragraphs(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/* ---------- Case studies ---------- */

export type CaseStudy = {
  slug: CaseStudySlug;
  title: string;
  summary: string;
  period: string;
  status: string;
  role: string;
  heading: string;
  lead: string; // HTML
  sections: (Section & { html: string })[];
};

export function loadCaseStudy(slug: CaseStudySlug): CaseStudy {
  const { data, body } = read(`${slug}.md`);
  for (const key of ["slug", "title", "summary", "period", "status", "role"]) {
    if (!data[key]) throw new Error(`content/${slug}.md: missing frontmatter "${key}"`);
  }
  if (data.slug !== slug) throw new Error(`content/${slug}.md: slug mismatch`);
  const h1 = body.match(/^# (.+)$/m);
  if (!h1) throw new Error(`content/${slug}.md: missing H1`);
  const withoutH1 = body.replace(/^# .+$/m, "").trim();
  const { intro, sections } = splitSections(withoutH1, 2);
  return {
    slug,
    title: String(data.title),
    summary: String(data.summary),
    period: String(data.period),
    status: String(data.status),
    role: String(data.role),
    heading: h1[1].trim(),
    lead: md(intro),
    sections: sections.map((s) => ({ ...s, html: md(s.body) })),
  };
}

export function loadAllCaseStudies(): CaseStudy[] {
  return caseStudySlugs.map(loadCaseStudy);
}

/* ---------- Home ---------- */

export type HomeProject = {
  title: string;
  body: string[]; // markdown paragraphs
  tech: string | null;
  status: string | null;
};

export type Home = {
  title: string;
  hero: { eyebrow: string; headline: string; paragraphs: string[] };
  resultsHeading: string;
  results: { figure: string; text: string }[];
  resultsNote: string;
  featured: HomeProject[];
  clients: HomeProject[];
  about: string[];
  experience: { title: string; dates: string; note: string | null; body: string[] }[];
  skills: { group: string; items: string }[];
  education: string[];
  languages: string[];
  contact: { heading: string; paragraphs: string[] };
};

const isTechLine = (p: string) => p.includes(" · ") && !/[.!?](s|$)/.test(p);

function toProject(s: Section): HomeProject {
  let status: string | null = null;
  let tech: string | null = null;
  const body: string[] = [];
  for (const p of paragraphs(s.body)) {
    if (/^\*\*[^*]+\*\*$/.test(p)) status = p.replace(/\*\*/g, "");
    else if (isTechLine(p)) tech = p;
    else body.push(p);
  }
  return { title: s.title, body, tech, status };
}

export function loadHome(): Home {
  const { data, body } = read("home.md");
  const { intro, sections } = splitSections(body, 2);
  const get = (title: string) => {
    const s = sections.find((x) => x.title.toLowerCase().startsWith(title.toLowerCase()));
    if (!s) throw new Error(`content/home.md: missing section "${title}"`);
    return s;
  };
  const eyebrow = intro
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("#"));
  if (!eyebrow) throw new Error("content/home.md: missing eyebrow line");

  const hero = sections[0];
  const results = get("Production experience");
  const results_items = results.body
    .split("\n")
    .filter((l) => l.startsWith("- "))
    .map((l) => {
      const m = l.match(/^- \*\*(.+?)\*\*\s*(.*)$/);
      if (!m) throw new Error(`content/home.md: bad result line "${l}"`);
      const rest = m[2].replace(/^[,\s]+/, "");
      return { figure: m[1], text: m[2].startsWith(",") ? rest.charAt(0).toUpperCase() + rest.slice(1) : rest };
    });
  const resultsNote = paragraphs(results.body.replace(/^- .*$/gm, "")).join(" ");

  const experience = splitSections(get("Experience").body, 3).sections.map((s) => {
    const ps = paragraphs(s.body);
    const dates = (ps.shift() ?? "").replace(/\*\*/g, "");
    const note = ps[0]?.startsWith("Same role") ? ps.shift()! : null;
    return { title: s.title, dates, note, body: ps };
  });

  const contact = get("Open to full-stack and backend roles");

  return {
    title: String(data.title),
    hero: { eyebrow, headline: hero.title, paragraphs: paragraphs(hero.body) },
    resultsHeading: results.title,
    results: results_items,
    resultsNote,
    featured: splitSections(get("Selected work").body, 3).sections.map(toProject),
    clients: splitSections(get("Client products").body, 3).sections.map(toProject),
    about: paragraphs(get("About").body),
    experience,
    skills: splitSections(get("Technical skills").body, 3).sections.map((s) => ({
      group: s.title,
      items: s.body,
    })),
    education: get("Education")
      .body.split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
    languages: get("Languages")
      .body.split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
    contact: {
      heading: contact.title,
      // Email, phone and location come from central config instead.
      paragraphs: paragraphs(contact.body).filter((p) => p !== "Dubai, UAE" && !p.startsWith("[")),
    },
  };
}
