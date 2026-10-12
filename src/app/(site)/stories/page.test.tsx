import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { addClass, mockupFold, skeleton, words } from "../../../../test/support/mockup-compare";
import { STORE_URL } from "@/config/site";
import { ARTICLE_SLUGS } from "@/content/en-IN/routes";
import { hubPage, hubPath, hubTopics } from "@/content/en-IN/stories/hub";
import type { ImageRef } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";

/* The stories hub route (task 5.5; structure §3.1, §5; stories.html, stories.md): the hub's content module through the
 * page template, with the live offer. Thin: no words here. The page is the approved hub's main: the hero with the topic
 * links, one band per topic with all 21 guides (each linked to its own page), and the journal close. */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));

const SOURCE = readFileSync("src/app/(site)/stories/page.tsx", "utf8");
const TOKEN = buildOffer("token");

/** The hub with each featured photo at the mockup's own size. Vitest loads an image file as a bare address, without
 *  the size next/image's static import carries, and a photo's shape sets its crop (the portrait Myra card). */
function sized(page: PageContent): PageContent {
  const sections = page.sections.map((entry) => {
    if (entry.kind !== "topic-section" || entry.config.featured === undefined) return entry;
    const { featured, topic } = entry.config;
    const img = mockupFold("stories", `section#${topic.id} .mk-guide img`);
    const image: ImageRef = { src: `/${topic.id}.webp`, width: Number(img.getAttribute("width")), height: Number(img.getAttribute("height")), alt: featured.image.alt };
    return { ...entry, config: { ...entry.config, featured: { ...featured, image } } };
  });
  return { ...page, sections };
}

/** The rendered page as the shell holds it, in `<main>`. */
function builtMain(page: PageContent = sized(hubPage)): HTMLElement {
  const main = document.createElement("main");
  main.id = "main";
  const { container } = render(<PageTemplate page={page} offer={TOKEN} path={hubPath} />);
  main.append(...Array.from(container.childNodes).map((node) => node.cloneNode(true)));
  return main;
}

/**
 * The approved main as the build prints it. Two documented differences, both decided before the build:
 * - the "Rewritten in the build" captions are Gate A review labels and never ship (N22; architecture §19);
 * - every guide links to its own page: each row the mockup leaves quiet while its guide waits for its rewrite becomes
 *   the DS link row, `li > a.kh-listitem` (the copy page: "at launch every card links"; stories.md question 1), in the
 *   order of hub.ts, whose slugs hub.test.ts holds to the mockup's titles.
 * The mockup's store page is the store host, and its centred hub heading (stories.css:128) is the hero's words-only
 * class, as HeroSection.test.tsx reads it.
 */
function approvedMain(): Element {
  const main = mockupFold("stories", "main").cloneNode(true) as Element;
  addClass(main, ".mk-journal-intro header.kh-heading--hero", "ks-hero-words");
  main.querySelectorAll(".mk-later").forEach((label) => label.remove());
  hubTopics.forEach((group) => {
    const rows = main.querySelectorAll(`section#${group.topic} li.kh-listitem`);
    expect(rows).toHaveLength(group.slugs.length);
    rows.forEach((row, i) => {
      const link = main.ownerDocument.createElement("a");
      link.className = row.className;
      link.setAttribute("href", `/stories/${group.slugs[i]}`);
      link.append(...Array.from(row.childNodes));
      row.removeAttribute("class");
      row.append(link);
    });
  });
  main.querySelectorAll('a[href="store.html"]').forEach((a) => a.setAttribute("href", STORE_URL));
  return main;
}

/* Left aside on both sides: the close's art board (CloseSection.test.tsx compares it layer by layer) and the build's
   JSON-LD (none here, below). The build's own names: type steps, list reset, tap target and CTA classes it adds, the
   heading's step span, the mockup's price spans, and the hub blocks' ks- names (TopicSection, CloseSection). */
const ASIDE = ".kh-art, script";
const OPTIONS = {
  skip: ASIDE,
  drop: /^(ks-type-.*|ks-list-reset|ks-card__link--tap|ks-cta__button|ks-btn__arrow)$/,
  unwrap: ".ks-heading__step, [data-src]",
  rename: {
    close: "ks-close-journal",
    "close-art": "ks-close-journal__art",
    guides: "ks-topic__guides",
    "guides--two": "ks-topic__guides--two",
    "photo-myra": "ks-guide__photo--portrait",
  },
};

describe("/stories: the route", () => {
  it("takes its metadata from the hub's module, at the URL plan's hub path", async () => {
    const { metadata } = await import("./page");
    expect(hubPath).toBe("/stories");
    expect(metadata).toEqual(pageMeta({ ...hubPage.meta, path: hubPath }));
    expect(metadata.title).toEqual({ absolute: "Parenting guides for ages 3 to 7 · Kheelona" });
  });

  it("revalidates like every page that shows a price: the journal close shows one", async () => {
    expect((await import("./page")).revalidate).toBe(300);
  });

  it("renders the hub through the page template, with the live offer in the close", async () => {
    getOffer.mockResolvedValue(buildOffer("full"));
    const { default: StoriesPage } = await import("./page");
    const { container } = render(await StoriesPage());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Guides for parents of 3 to 7 year olds");
    expect(container.querySelector("#close .ks-price")?.textContent).toBe("₹7,999 (incl. GST), paid in full when you order.");
    expect(getOffer).toHaveBeenCalled();
  });

  it("is thin: no copy, price or address typed in the route file (structure §3.1)", () => {
    const code = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "").replace(/^import [^;]*;$/gm, "");
    expect([...code.matchAll(/"([^"]*)"/g)].map((m) => m[1])).toEqual([]);
    expect(code).not.toMatch(/₹|https?:|\/stories/);
  });
});

describe("/stories: the approved hub", () => {
  it("equals the approved page's main, fold by fold, in markup and words (art board aside)", () => {
    const built = builtMain();
    const approved = approvedMain();
    expect(skeleton(built, OPTIONS)).toBe(skeleton(approved, OPTIONS));
    expect(words(built, { skip: ASIDE })).toBe(words(approved, { skip: ASIDE }));
  });

  it("lists all 21 guides under the four topic anchors, each linked once to its own page", () => {
    const main = builtMain();
    const anchors = ["screen-time", "talking", "ai-and-safety", "learning"];
    expect(Array.from(main.querySelectorAll("section.ks-topic")).map((s) => s.id)).toEqual(anchors);
    const links = anchors.flatMap((id) => Array.from(main.querySelectorAll(`section#${id} a[href^="/stories/"]`)).map((a) => a.getAttribute("href")));
    expect(links.sort()).toEqual(ARTICLE_SLUGS.map((slug) => `/stories/${slug}`).sort());
    for (const id of anchors) expect(main.querySelector(`a.kh-tag[href="#${id}"]`), id).not.toBeNull();
  });

  it("names each featured card's link by its guide and keeps every row's title an h3 under its topic's h2", () => {
    const main = builtMain();
    const talking = within(main.querySelector<HTMLElement>("section#talking")!);
    expect(talking.getByRole("link", { name: "Read the guide · 3 min read: Late talker? What helps a child find their words" })).toHaveAttribute(
      "href",
      "/stories/talking-toys-and-late-talkers",
    );
    expect(talking.getByRole("heading", { level: 2 })).toHaveTextContent("Talking and language");
    expect(talking.getAllByRole("heading", { level: 3 })).toHaveLength(7);
  });

  it("has one h1, one chilli button (finale, to the store) and no page JSON-LD (architecture §9.2: none beyond the shell)", () => {
    const main = builtMain();
    expect(main.querySelectorAll("h1")).toHaveLength(1);
    const buttons = main.querySelectorAll(".kh-btn--cta");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveAttribute("href", STORE_URL);
    expect(buttons[0]).toHaveAttribute("data-ph-capture-attribute-cta", "finale");
    expect(main.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it("draws the close's doodle below the first screen and never reveals a fold (stories.html has no data-reveal)", () => {
    const main = builtMain();
    expect(main.querySelectorAll("#close svg.ks-doodle[data-draw]")).toHaveLength(1);
    expect(main.querySelector("[data-reveal]")).toBeNull();
  });

  it("ships no review label and no mockup-only markup (N22)", () => {
    const main = builtMain();
    expect(main.textContent).not.toMatch(/Rewritten in the build/);
    expect(main.querySelector('[class*="mk-"], [data-src]')).toBeNull();
  });
});
