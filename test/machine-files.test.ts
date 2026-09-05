import { describe, expect, it } from "vitest";
import { GET as llms, LLMS_UPDATED } from "@/app/llms.txt/route";
import { GET as pricing, PRICING_UPDATED } from "@/app/pricing.md/route";
import { ORGANIZATION } from "@/lib/seo";
import { STORIES } from "@/lib/stories";

/** The two machine-readable files (llms.txt, pricing.md) restate visible copy
 *  for models that read one file instead of the site. SEO round 2026-09-05:
 *  they gained a real "Last updated" date, the journal's key answers and the
 *  official profiles. These guards keep them honest and un-driftable. */
async function body(res: Response) {
  return res.text();
}

describe("llms.txt", () => {
  it("carries a real ISO last-updated date, not a season", async () => {
    const text = await body(llms());
    expect(LLMS_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(text).toMatch(new RegExp(`Last updated: ${LLMS_UPDATED}\\s*$`));
    expect(text).not.toMatch(/Last updated: [A-Z][a-z]+ \d{4}/);
  });

  it("links only journal articles that exist", async () => {
    const text = await body(llms());
    const slugs = [...text.matchAll(/https:\/\/kheelona\.com\/stories\/([a-z0-9-]+)/g)].map((m) => m[1]);
    expect(slugs.length).toBeGreaterThanOrEqual(6);
    for (const slug of slugs) {
      expect(STORIES.some((s) => s.slug === slug), `llms.txt links a missing article: ${slug}`).toBe(true);
    }
  });

  it("names every profile the Organization schema names, so the two cannot disagree", async () => {
    const text = await body(llms());
    for (const url of ORGANIZATION.sameAs) expect(text, url).toContain(url);
  });

  it("obeys the voice law even as plain text", async () => {
    const text = await body(llms());
    expect(text).not.toMatch(/—/);
    expect(llms().headers.get("content-type")).toContain("text/plain");
  });
});

describe("pricing.md", () => {
  it("dates its prices to the day they last moved", async () => {
    const text = await body(pricing());
    expect(PRICING_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(text).toContain(`Last updated: ${PRICING_UPDATED}`);
    expect(text).not.toMatch(/Last updated: July 2026/);
    expect(pricing().headers.get("content-type")).toContain("text/markdown");
  });
});
