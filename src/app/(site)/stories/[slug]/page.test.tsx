import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ARTICLE_SLUGS } from "@/content/en-IN/routes";
import { articles } from "@/content/en-IN/stories/articles";
import { articleMeta } from "@/layouts/ArticleTemplate/ArticleTemplate";
import { buildOffer } from "@/lib/offer/offer";

/* The stories route (task 4.2; structure §3.1): one page per article of the URL plan, each its journal post through the
 * article template, with the live offer; every other slug stops at the router (dynamicParams = false), so an unknown
 * guide is the real 404 and never a thrown one (test/not-found-ssr.test.ts, lessons §1). */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });
const SOURCE = readFileSync("src/app/(site)/stories/[slug]/page.tsx", "utf8");

describe("/stories/[slug]", () => {
  it("prerenders exactly the 20 articles of the URL plan (routes.ts) and refuses every other slug at the router", async () => {
    const mod = await import("./page");
    expect(mod.generateStaticParams()).toEqual(ARTICLE_SLUGS.map((slug) => ({ slug })));
    /* 21 until the 3-6-9-12 article left the journal (D053, task 6.5); its URL is a redirect. */
    expect(mod.generateStaticParams()).toHaveLength(20);
    expect(mod.dynamicParams).toBe(false);
    expect(SOURCE).toMatch(/^export const dynamicParams = false;$/m);
  });

  it("revalidates like every page that shows a price: the journal close shows one", async () => {
    expect((await import("./page")).revalidate).toBe(300);
  });

  it("never throws a 404 (a thrown notFound() renders a blank page on the server, lessons §1)", () => {
    expect(SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "")).not.toMatch(/\bnotFound\b/);
  });

  it("takes each article's metadata from its journal post", async () => {
    const { generateMetadata } = await import("./page");
    for (const slug of ARTICLE_SLUGS) expect(await generateMetadata(params(slug)), slug).toEqual(articleMeta(articles[slug]));
  });

  it("renders the article through the template, with the live offer in the close", async () => {
    getOffer.mockResolvedValue(buildOffer("full"));
    const { default: StoryPage } = await import("./page");
    const { container } = render(await StoryPage(params("learning-toys-for-a-three-year-old")));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Learning toys for a 3-year-old, skill by skill");
    expect(container.querySelector("#close .ks-price")?.textContent).toBe("₹7,999 (incl. GST), paid in full when you order.");
    expect(getOffer).toHaveBeenCalled();
  });

  it("is thin: no copy, price or address typed in the route file (structure §3.1)", () => {
    const code = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "").replace(/^import [^;]*;$/gm, "");
    expect([...code.matchAll(/"([^"]*)"/g)].map((m) => m[1])).toEqual([]);
    expect(code).not.toMatch(/₹|https?:/);
  });
});
