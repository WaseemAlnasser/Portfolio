# Waseem Alnasser — portfolio

Source for my personal portfolio site: [waseemalnasser.com](https://waseemalnasser.com).

A static site built with Next.js (App Router), TypeScript and Tailwind CSS, exported to plain HTML and hosted on Cloudflare Pages.

## Run it locally

Requires Node.js 20.9 or newer (Node 22 LTS recommended).

```bash
npm install
npm run dev      # development server on http://localhost:3000
npm run build    # static export to ./out
npm run start    # serve ./out on http://localhost:3000
npm run lint
npm run typecheck
npm run test:e2e # Playwright smoke tests against ./out (run build first)
```

## Structure

- `content/` — homepage and case-study copy in Markdown
- `src/lib/site.ts` — contact details, links, CV path and image lists in one place
- `src/components/` — layout, project cards and the HTML/CSS diagrams
- `public/` — images, CV and static assets

All rights reserved. The content, images and case-study text are not licensed for reuse.
