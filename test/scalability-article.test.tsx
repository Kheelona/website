import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { JOURNAL_IMAGES } from "@/config/journal";
import { ARTICLE_SLUGS } from "@/content/en-IN/routes";
import { articles } from "@/content/en-IN/stories/articles";
import { hubGroupsOf, hubPage } from "@/content/en-IN/stories/hub";
import { journal } from "@/content/en-IN/stories/journal";
import { stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import { articleMeta } from "@/layouts/ArticleTemplate/ArticleTemplate";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import sitemap from "@/app/sitemap";

/* The brief's scalability test, article half (brief §6; architecture §5.4; ADR-014; journal-pipeline §8.3, task 8b.2e):
 * a story is a published dashboard post and nothing else. The adapter's fixture posts, one per block kind (paragraphs,
 * headings and anchors, every list style, a callout and a question group, facts with their photo, photos in and between
 * parts, an uploaded cover, a video, a talking guide), are published into the journal beside the 20 guides: the snapshot
 * module is the only thing this test replaces. Each becomes a route, a sitemap entry, a row of its topic on the hub and a
 * whole page through the stories route, with its metadata and structured data, and no component, template, route or
 * content edit. Fixture words only (test/fixtures/journal/block-kinds.fixture.json); never shipped. */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));

/* What a writer does: publish posts. The committed snapshot, plus the nine fixture posts, as the sync would hand them over. */
vi.mock("@/content/en-IN/stories/posts.generated.json", async () => {
  const { readFileSync } = await import("node:fs");
  const read = (path: string) => JSON.parse(readFileSync(`${process.cwd()}/${path}`, "utf8")) as { generated: string; posts: unknown[] };
  const snapshot = read("src/content/en-IN/stories/posts.generated.json");
  const kinds = read("test/fixtures/journal/block-kinds.fixture.json");
  return { default: { generated: snapshot.generated, posts: [...snapshot.posts, ...kinds.posts] } };
});

const KINDS = ["kind-blockquotes", "kind-facts", "kind-headings", "kind-images", "kind-lists", "kind-paragraphs", "kind-talking", "kind-upload", "kind-video"];

async function storyPage(slug: string): Promise<HTMLElement> {
  getOffer.mockResolvedValue(buildOffer("token"));
  const { default: StoryPage } = await import("@/app/(site)/stories/[slug]/page");
  return render(await StoryPage({ params: Promise.resolve({ slug }) })).container;
}

describe("scalability: a new article is a published post and nothing else", () => {
  it("publishes every fixture post as a route of the URL plan, prerendered by the stories route", async () => {
    expect(ARTICLE_SLUGS).toEqual(expect.arrayContaining(KINDS));
    expect(ARTICLE_SLUGS).toHaveLength(20 + KINDS.length);
    const { generateStaticParams } = await import("@/app/(site)/stories/[slug]/page");
    expect(generateStaticParams()).toEqual(expect.arrayContaining(KINDS.map((slug) => ({ slug }))));
    expect(journal.dropped).toEqual([]);
  });

  it("lists each in the sitemap with the date its post stores", () => {
    const entries = sitemap();
    for (const slug of KINDS) {
      expect(entries.find((e) => e.url === `https://kheelona.com/stories/${slug}`), slug).toEqual({
        url: `https://kheelona.com/stories/${slug}`,
        lastModified: articles[slug].updated,
        priority: 0.6,
      });
    }
  });

  it("joins each to its topic on the hub, after the hub's own list, newest first", () => {
    const tail = (topic: string, listed: number) => hubGroupsOf.find((g) => g.topic === topic)!.slugs.slice(listed);
    expect(tail("screen-time", 5)).toEqual(["kind-upload", "kind-lists", "kind-paragraphs"]);
    expect(tail("talking", 6)).toEqual(["kind-talking"]);
    expect(tail("ai-and-safety", 4)).toEqual(["kind-blockquotes", "kind-facts"]);
    expect(tail("learning", 2)).toEqual(["kind-video", "kind-images", "kind-headings"]);
    const rows = JSON.stringify(hubPage.sections);
    for (const slug of KINDS) expect(rows, slug).toContain(`"href":"/stories/${slug}"`);
  });

  it("gives the phone buy bar to each post whose topic closes with the pre-order button, never to a talking one (B5)", () => {
    const paths = stickyBarPaths();
    for (const slug of KINDS) expect(paths.includes(`/stories/${slug}`), slug).toBe(slug !== "kind-talking");
  });

  it.each(KINDS)("renders %s as a whole page: head, answer card, parts, sources, then its close", async (slug) => {
    const article = articles[slug];
    const container = await storyPage(slug);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(toPlainText(article.head.title));
    expect(container.querySelectorAll("h1 .kh-hand")).toHaveLength(1);
    const crumbs = within(screen.getByRole("navigation", { name: "Breadcrumb" })).getAllByRole("link");
    expect(crumbs.map((a) => a.getAttribute("href"))[1], slug).toBe(`/stories#${journal.topicOf.get(slug)}`);
    const column = container.querySelector(".ks-story-body > .kh-container")!;
    expect(column.firstElementChild?.classList.contains("ks-answer"), slug).toBe(true);
    expect(column.lastElementChild?.classList.contains("ks-sources"), slug).toBe(true);
    for (const marker of screen.getAllByRole("link", { name: "Source 1" })) expect(marker).toHaveAttribute("href", "#src-1");
    const keep = slug === "kind-talking";
    expect(container.querySelector("#close [data-ph-capture-attribute-cta='finale']") !== null, slug).toBe(!keep);
    if (keep) expect(screen.getByRole("region", { name: "Keep reading" })).toBeInTheDocument();
    const related = within(screen.getByRole("region", { name: keep ? "Keep reading" : "Related guides" })).getAllByRole("link");
    expect(related.slice(0, 3).map((a) => a.getAttribute("href"))).toEqual(article.related.map((r) => `/stories/${r}`));
  });

  it("renders each block kind with the DS parts the approved guides use", async () => {
    expect((await storyPage("kind-headings")).querySelector("section#first-part > h2")?.textContent).toBe("The first part");
    const lists = await storyPage("kind-lists");
    expect([".ks-checks", ".ks-tips", "ol"].map((s) => lists.querySelector(`.ks-part ${s}`) !== null)).toEqual([true, true, true]);
    const quotes = await storyPage("kind-blockquotes");
    expect([".ks-try", ".ks-questions"].map((s) => quotes.querySelector(s) !== null)).toEqual([true, true]);
    expect((await storyPage("kind-facts")).querySelector(".ks-part.ks-breakout .ks-facts-list")).not.toBeNull();
    expect((await storyPage("kind-images")).querySelector(".ks-story-body .kh-container > figure.kh-photo")).not.toBeNull();
    const video = await storyPage("kind-video");
    expect(video.querySelectorAll("figure.ks-video")).toHaveLength(2);
    expect(video.querySelector("iframe")).toBeNull();
  });

  it("closes a talking post without a pitch, its D025 line under the answer (B5)", async () => {
    const container = await storyPage("kind-talking");
    expect(container.querySelector(".ks-answer")?.lastElementChild?.className).toBe("kh-body-s ks-disclaimer");
    expect(container.querySelector('a[href^="/products"]')).toBeNull();
  });

  it("shares an uploaded cover through this site's optimiser at the size it serves, and heads the page with it", async () => {
    const cover = `${JOURNAL_IMAGES}kind-upload-cover.jpg`;
    expect(articleMeta(articles["kind-upload"]).openGraph?.images).toEqual([
      { url: `/_next/image?url=${encodeURIComponent(cover)}&w=1200&q=75`, width: 1200, height: 675, alt: "A child's drawing of a sun on a fridge door" },
    ]);
    const container = await storyPage("kind-upload");
    expect(container.querySelector(".ks-story-head img")?.getAttribute("src")).toBe(cover);
  });

  it("gives the page its structured data and metadata from the post: a founder as the Person, the stored dates", async () => {
    const container = await storyPage("kind-blockquotes");
    const graph = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!) as { "@graph": Record<string, unknown>[] };
    const [posting, breadcrumbs] = graph["@graph"];
    expect(posting).toMatchObject({
      "@type": "BlogPosting",
      url: "https://kheelona.com/stories/kind-blockquotes",
      headline: "A callout and a group of questions",
      datePublished: "2026-09-05",
      dateModified: "2026-09-05",
      author: { "@type": "Person", "@id": "https://kheelona.com/team#apoorva-sahu", name: "Apoorva Sahu" },
    });
    expect(breadcrumbs).toMatchObject({ "@type": "BreadcrumbList", itemListElement: [{ name: "Stories" }, { name: "AI toys and safety" }] });
    expect(articleMeta(articles["kind-blockquotes"])).toMatchObject({
      title: { absolute: "A callout and a group of questions · Kheelona" },
      alternates: { canonical: "/stories/kind-blockquotes" },
      openGraph: { type: "article", publishedTime: "2026-09-05", modifiedTime: "2026-09-05", authors: ["Apoorva Sahu"] },
    });
  });
});
