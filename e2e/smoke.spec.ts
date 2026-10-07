import { expect, test } from "@playwright/test";

const routes = ["/", "/work/deliverit/", "/work/multi-tenant-saas/", "/work/vpn-platform/"];

for (const route of routes) {
  test(`direct load of ${route}: one H1, no overflow at 360px, no placeholders`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/\[ADD|example\.com|undefined|Lorem/);
    const html = await page.content();
    expect(html).not.toContain("<!--  Visual");
    for (const a of await page.locator("a").all()) {
      const href = await a.getAttribute("href");
      expect(href, "anchor without href").toBeTruthy();
    }
  });
}

test("unknown URL gives a 404 page, not the homepage", async ({ page }) => {
  const res = await page.goto("/no-such-page/");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("doesn’t exist");
  await expect(page.getByRole("link", { name: "Back to the homepage" })).toBeVisible();
});

test("configured links show; unconfigured ones are hidden", async ({ page, request }) => {
  await page.goto("/");
  const cv = page.getByRole("link", { name: "Download CV" });
  await expect(cv).toBeVisible();
  const res = await request.get((await cv.getAttribute("href"))!);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("pdf");
  await expect(page.getByRole("link", { name: "LinkedIn" })).toBeVisible();
  await expect(page.getByRole("link", { name: "GitHub" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /^Visit .*Elite/ })).toHaveCount(0);
  for (const host of ["deliverit.ae", "mbvision.ae", "stepsdecor.ae", "foamlines.ae"]) {
    await expect(page.locator(`a[href="https://${host}"]`).first()).toBeVisible();
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://waseemalnasser.com/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
});

test("mobile menu toggles with keyboard and exposes expanded state", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  const button = page.locator("#menu-button");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: "Experience" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(button).toHaveAttribute("aria-expanded", "false");
});

test("skip link is the first focusable element", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
});

test("homepage links to the three case studies and contact details work", async ({ page }) => {
  await page.goto("/");
  for (const slug of ["deliverit", "multi-tenant-saas", "vpn-platform"]) {
    await expect(page.locator(`a[href="/work/${slug}/"]`).first()).toBeVisible();
  }
  await expect(page.locator('a[href="mailto:hello@waseemalnasser.com"]').first()).toBeVisible();
  await expect(page.locator('a[href="tel:+971543204140"]')).toBeVisible();
});

test("Deliverit page: diagrams, contents anchors and the exact cost bar", async ({ page }) => {
  await page.goto("/work/deliverit/");
  await expect(page.getByText("Simplified architecture")).toBeVisible();
  await expect(page.getByText("Approximately 88% lower monthly API cost")).toBeVisible();
  const [before, after] = await page.locator('div[aria-hidden="true"].h-8').all().then(async (els) =>
    Promise.all(els.map(async (e) => (await e.boundingBox())!.width)),
  );
  expect(after / before).toBeCloseTo(0.12, 1);
  await page.getByRole("navigation", { name: "On this page" }).getByRole("link", { name: /OTP/ }).click();
  await expect(page).toHaveURL(/#responding-to-production-otp-abuse$/);
  await expect(page.getByRole("heading", { name: /OTP abuse/ })).toBeInViewport();
});

test("page works with JavaScript disabled", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("production software");
  await expect(page.getByText("hello@waseemalnasser.com").first()).toBeVisible();
  await ctx.close();
});

test("platform figures stay attributed to the platform", async ({ page }) => {
  await page.goto("/");
  const text = await page.locator("body").innerText();
  expect(text).toContain("on the Deliverit platform");
  expect(text).toContain("supported by the platform");
  expect(text).toContain("From about $300 to $36 per month");
});

test("desktop shows inline navigation and no menu button", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(page.locator("#menu-button")).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" })).toBeVisible();
});

test("configured images load, have alt text and captions", async ({ page }) => {
  for (const route of ["/", "/work/deliverit/", "/work/vpn-platform/"]) {
    await page.goto(route);
    await page.evaluate(() => document.querySelectorAll("img").forEach((i) => (i.loading = "eager")));
    await page.waitForLoadState("networkidle");
    const imgs = await page.locator("main img").all();
    expect(imgs.length).toBeGreaterThan(0);
    for (const img of imgs) {
      expect(await img.getAttribute("alt")).toBeTruthy();
      expect(await img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
    }
  }
});

test("robots.txt and sitemap allow crawling of the production domain", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  expect(robots).not.toMatch(/Disallow:\s*\/\s*$/m);
  expect(robots).toContain("Sitemap: https://waseemalnasser.com/sitemap.xml");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const p of ["/", "/work/deliverit/", "/work/multi-tenant-saas/", "/work/vpn-platform/"]) {
    expect(sitemap).toContain("<loc>https://waseemalnasser.com" + p + "</loc>");
  }
});

test("indexable pages carry no noindex; 404 stays noindex", async ({ page }) => {
  for (const route of ["/", "/work/deliverit/", "/work/multi-tenant-saas/", "/work/vpn-platform/"]) {
    await page.goto(route);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://waseemalnasser.com" + route);
  }
  await page.goto("/missing/");
  const tags = await page.locator('meta[name="robots"]').evaluateAll((els) => els.map((e) => e.getAttribute("content")));
  expect(tags.length).toBeGreaterThan(0);
  for (const t of tags) expect(t).toMatch(/noindex/);
});
