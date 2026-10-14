import { cleanup, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockupFold, skeleton, words } from "../../../test/support/mockup-compare";
import { STORE_URL } from "@/config/site";
import { organization } from "@/content/en-IN/organization";
import { APPROVED_ARTICLES, approvedArticle } from "../../../test/fixtures/journal/approved";
import type { Article } from "@/content/types";
import { siteGraphOf } from "@/layouts/SiteShell/site-graph";
import { buildOffer } from "@/lib/offer/offer";
import { articlePath } from "./article-page";
import { ArticleTemplate, articleMeta } from "./ArticleTemplate";

/* ArticleTemplate (task 4.2; structure §5): a journal article rendered as its page, in the approved order (story-*.html):
 * the article (head, then the reading column with the answer, the parts and the sources), then the related guides and
 * the journal close, or the keep-reading close where the article has no pre-order button (B5); BlogPosting and
 * BreadcrumbList from the post's stored dates and the visible crumbs. Since task 8b.2e (ADR-014; journal-pipeline §8.3)
 * the articles are read from the approved export (test/fixtures/journal/approved, through the adapter), the template's
 * proof whatever a writer publishes later; test/scalability-article.test.tsx renders the adapter's per-block fixture
 * posts as whole pages. */

const TOKEN = buildOffer("token");
const page = (article: Article, offer = TOKEN) => render(<ArticleTemplate article={article} offer={offer} />).container;

type Slug = string;
const APPROVED = ["learning-toys-for-a-three-year-old", "what-to-look-for-in-a-safe-ai-toy", "talking-toys-and-late-talkers"] as const;

/** The module with its head photo at the mockup's own size. Vitest loads an image file as a bare address, without the
 *  size next/image's static import carries, and the photo's shape sets the head's layout (portrait or wide). */
function sized(slug: Slug): Article {
  const article = approvedArticle(slug);
  const img = mockupFold(`story-${slug}`, ".mk-story-head img");
  const image = { src: `/${slug}.webp` as const, width: Number(img.getAttribute("width")), height: Number(img.getAttribute("height")), alt: article.head.image!.alt };
  return { ...article, head: { ...article.head, image } };
}

/* What the comparison leaves aside, on both sides: the reading column (its body is task 5.6's port; ArticleBody's own
   tests hold it to the mockup's), the art boards (compared layer by layer below) and the JSON-LD (not in the mockup).
   The build's documented differences: the type steps and list reset it adds, the CTA classes (CtaBlock.test.tsx), the
   heading's step span, the mockup's price spans, and the journal close's own names (CloseSection.test.tsx). */
const ASIDE = ".mk-story-body, .ks-story-body, .kh-art, script";
const OPTIONS = {
  skip: ASIDE,
  drop: /^(ks-type-.*|ks-list-reset|ks-cta__button|ks-btn__arrow)$/,
  unwrap: ".ks-heading__step, [data-src]",
  rename: { close: "ks-close-journal", "close-art": "ks-close-journal__art" },
};

/** The mockup's main, its addresses read as the build's: the related rows link each guide's own page, as the copy
 *  pages' "Real URL" column says (the mockup links the hub's topic while a guide waits for its rewrite;
 *  articles.test.ts maps the titles to the slugs), and the mockup's store page is the store host. */
function approvedMain(slug: Slug): Element {
  const main = mockupFold(`story-${slug}`, "main").cloneNode(true) as Element;
  main.querySelectorAll(".mk-related a.kh-listitem").forEach((row, i) => row.setAttribute("href", `/stories/${approvedArticle(slug).related[i]}`));
  main.querySelectorAll('a[href="store.html"]').forEach((link) => link.setAttribute("href", STORE_URL));
  return main;
}

/** The rendered page as the shell would hold it, in `<main>`. */
function builtMain(slug: Slug): Element {
  const main = document.createElement("main");
  main.id = "main";
  main.append(...Array.from(page(sized(slug)).childNodes).map((node) => node.cloneNode(true)));
  return main;
}

describe("ArticleTemplate: the three approved articles", () => {
  it.each(APPROVED)("%s: head, related guides and close equal the mockup's main, in order (reading column aside)", (slug) => {
    const built = builtMain(slug);
    const approved = approvedMain(slug);
    expect(skeleton(built, OPTIONS)).toBe(skeleton(approved, OPTIONS));
    expect(words(built, { skip: ASIDE })).toBe(words(approved, { skip: ASIDE }));
  });

  it.each(APPROVED)("%s: the reading column follows the head inside the article and holds the ported body, no open placeholder (task 5.6)", (slug) => {
    const container = page(approvedArticle(slug));
    const article = container.querySelector("article")!;
    expect(article).toHaveAttribute("aria-labelledby", "story-title");
    expect([...article.children].map((child) => child.className)).toEqual(["kh-section kh-section--band ks-hero ks-story-head", "kh-section ks-story-body"]);
    const column = article.querySelector(".ks-story-body > .kh-container")!;
    expect(column.classList.contains("ks-col")).toBe(true);
    expect(column.classList.contains("ks-prose")).toBe(true);
    expect(column.querySelector(".ks-placeholder")).toBeNull();
  });

  it.each(APPROVED.filter((slug) => approvedArticle(slug).close === "journal"))("%s: the close's art board is the mockup's, layer by layer", (slug) => {
    const built = page(approvedArticle(slug)).querySelector("#close .kh-art")!;
    const approved = mockupFold(`story-${slug}`, "#close .kh-art");
    expect(built.className).toBe("kh-art kh-tone-sun ks-close-journal__art");
    expect(built.getAttribute("role")).toBe(approved.getAttribute("role"));
    expect(built.getAttribute("aria-label")).toBe(approved.getAttribute("aria-label"));
    const builtLayers = [...built.children] as HTMLElement[];
    const approvedLayers = [...approved.children] as HTMLElement[];
    expect(builtLayers.length).toBe(approvedLayers.length);
    approvedLayers.forEach((layer, i) => {
      const mine = builtLayers[i];
      for (const edge of ["left", "width", "top", "bottom"] as const) expect(mine.style[edge], `${slug} layer ${i} ${edge}`).toBe(layer.style[edge]);
      const file = decodeURIComponent(layer.getAttribute("src") ?? "").split("/").slice(-2).join("/");
      if (file.startsWith("Doodles/")) {
        expect(mine.matches("svg.ks-doodle[data-draw]"), `${slug} layer ${i} draws (D049 pick 3)`).toBe(true);
      } else {
        expect(decodeURIComponent(mine.getAttribute("src") ?? "").endsWith(file), `${slug} layer ${i}: ${file}`).toBe(true);
      }
    });
  });

  it("gives the learning-toys close its doodle and keeps the safety and data guides' plain (DS 02-imagery)", () => {
    /* One page mounted at a time: with two in the document, jsdom resolves "#close" to the first page's close only. */
    const closeOf = (slug: Slug) => {
      cleanup();
      const close = page(approvedArticle(slug)).querySelector("#close");
      expect(close, slug).not.toBeNull();
      return close!;
    };
    expect(closeOf("learning-toys-for-a-three-year-old").querySelectorAll(".ks-doodle")).toHaveLength(1);
    for (const slug of ["what-to-look-for-in-a-safe-ai-toy", "questions-parents-ask-about-ai-toys", "should-kids-use-ai", "ai-toys-and-indias-data-law"] as const) {
      expect(closeOf(slug).querySelectorAll(".ks-doodle"), slug).toHaveLength(0);
    }
  });

  it("sends the journal close's button to the store, tracked as finale, with the arrow", () => {
    const container = page(approvedArticle("learning-toys-for-a-three-year-old"));
    const buttons = container.querySelectorAll(".kh-btn--cta");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveAttribute("href", STORE_URL);
    expect(buttons[0]).toHaveAttribute("data-ph-capture-attribute-cta", "finale");
    expect(buttons[0].querySelector(".ks-btn__arrow")).not.toBeNull();
  });

  it("ends the late-talker article on the keep-reading close: no pre-order button, no tracked CTA, no #close (B5)", () => {
    const container = page(approvedArticle("talking-toys-and-late-talkers"));
    expect(container.querySelector(".kh-btn--cta, [data-ph-capture-attribute-cta], #close")).toBeNull();
    const keep = screen.getByRole("region", { name: "Keep reading" });
    expect(within(keep).getByRole("link", { name: "All guides for parents of 3 to 7 year olds" })).toHaveAttribute("href", "/stories");
  });

  it("follows the offer's mode in the close's price sentence", () => {
    const container = page(approvedArticle("learning-toys-for-a-three-year-old"), buildOffer("full"));
    expect(container.querySelector("#close .ks-price")?.textContent).toBe("₹7,999 (incl. GST), paid in full when you order.");
  });

  /* A journal post's video (task 8b.2d; journal-pipeline §7): ArticleBody refuses a video without the content's play word
     (8b.2c), so the template passes it, and an article with a video builds. */
  it("names a video's play button with the content's play word and the video's title", async () => {
    const article = approvedArticle("learning-toys-for-a-three-year-old") as Article;
    const [first, ...rest] = article.body;
    const video = { kind: "video" as const, provider: "youtube" as const, videoId: "abcDEF12345", title: "Building a tower together" };
    const withVideo: Article = { ...article, body: [first.kind === "part" ? { ...first, blocks: [...first.blocks, video] } : first, ...rest] };
    page(withVideo);
    expect(await screen.findByRole("button", { name: "Play video: Building a tower together" })).toBeInTheDocument();
  });

  it("reveals nothing on arrival or scroll (no article mockup has data-reveal) and holds one h1", () => {
    for (const slug of APPROVED) {
      const container = page(approvedArticle(slug));
      expect(container.querySelector("[data-reveal]"), slug).toBeNull();
      expect(container.querySelectorAll("h1"), slug).toHaveLength(1);
    }
  });
});

describe("ArticleTemplate: crumbs and structured data", () => {
  const graphOf = (container: Element) => {
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(1);
    return JSON.parse(scripts[0].textContent ?? "") as { "@context": string; "@graph": Record<string, unknown>[] };
  };

  it("leads the crumbs with the hub, then the article's topic on the hub", () => {
    page(approvedArticle("learning-toys-for-a-three-year-old"));
    const crumbs = within(screen.getByRole("navigation", { name: "Breadcrumb" })).getAllByRole("link");
    expect(crumbs.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Stories", "/stories"],
      ["Learning and play", "/stories#learning"],
    ]);
  });

  it("emits one page graph: the BlogPosting with the module's stored dates, then the BreadcrumbList of the visible crumbs", () => {
    const article = approvedArticle("learning-toys-for-a-three-year-old");
    const container = page(article);
    const graph = graphOf(container);
    expect(graph["@context"]).toBe("https://schema.org");
    expect(graph["@graph"].map((node) => node["@type"])).toEqual(["BlogPosting", "BreadcrumbList"]);
    const [posting, breadcrumbs] = graph["@graph"];
    expect(posting).toEqual({
      "@type": "BlogPosting",
      "@id": "https://kheelona.com/stories/learning-toys-for-a-three-year-old#article",
      url: "https://kheelona.com/stories/learning-toys-for-a-three-year-old",
      mainEntityOfPage: "https://kheelona.com/stories/learning-toys-for-a-three-year-old",
      headline: "Learning toys for a 3-year-old, skill by skill",
      description:
        "Learning toys for a 3-year-old, skill by skill: language, turn-taking, pretend play, hands and numbers, plus what the WHO and IAP say about screens.",
      image: "https://kheelona.com/og/myra-04-drawing-at-home.jpg",
      datePublished: article.published,
      dateModified: article.updated,
      inLanguage: "en-IN",
      author: { "@id": "https://kheelona.com/#organization" },
      publisher: { "@id": "https://kheelona.com/#organization" },
      citation: article.sources.map((source) => ({ "@type": "CreativeWork", name: source.citation, url: source.href })),
    });
    expect(posting.headline).toBe(screen.getByRole("heading", { level: 1 }).textContent);
    const visible = within(screen.getByRole("navigation", { name: "Breadcrumb" }))
      .getAllByRole("link")
      .map((a, i) => ({ "@type": "ListItem", position: i + 1, name: a.textContent, item: `https://kheelona.com${a.getAttribute("href")}` }));
    expect(breadcrumbs).toEqual({ "@type": "BreadcrumbList", itemListElement: visible });
  });

  /* Task 4.9 item 3: every article's copy page says its source list is the BlogPosting `citation` (D026), so what a reader
     can open under the article is what a crawler is told, from the one `sources` list: each source a CreativeWork named
     by the citation as the numbered note prints it, with the note's address. */
  it.each(Object.keys(APPROVED_ARTICLES))("%s: cites exactly the visible numbered sources, in order", (slug) => {
    cleanup();
    const container = page(approvedArticle(slug));
    const posting = graphOf(container)["@graph"][0] as { citation?: { "@type": string; name: string; url: string }[] };
    const notes = [...container.querySelectorAll(".ks-notes > li")].map((li) => {
      const note = li.children[1];
      const link = note.querySelector("a")!;
      return { text: note.textContent, url: link.getAttribute("href") };
    });
    expect(notes.length, slug).toBeGreaterThan(0);
    expect(posting.citation?.map((c) => c["@type"])).toEqual(notes.map(() => "CreativeWork"));
    expect(posting.citation?.map((c) => ({ text: `${c.name} ${c.url}`, url: c.url }))).toEqual(notes);
  });

  it("cites nothing, and carries no citation key, for an article without sources", () => {
    const posting = graphOf(page({ ...approvedArticle("how-children-collect-words"), sources: [] }))["@graph"][0];
    expect(posting).not.toHaveProperty("citation");
  });

  it("credits a founder's byline to the Person the shell's Organization node publishes, and the team's to the Organization", () => {
    const posting = graphOf(page(approvedArticle("what-to-look-for-in-a-safe-ai-toy")))["@graph"][0];
    expect(posting.author).toEqual({ "@type": "Person", "@id": "https://kheelona.com/team#aman-soni", name: "Aman Soni" });
    const shellOrganization = siteGraphOf(organization)["@graph"][0] as unknown as { founder: { "@id": string }[] };
    expect(shellOrganization.founder.map((person) => person["@id"])).toContain("https://kheelona.com/team#aman-soni");
    const stub = graphOf(page(approvedArticle("how-children-collect-words")))["@graph"][0];
    expect(stub.author).toEqual({ "@id": "https://kheelona.com/#organization" });
    expect(stub.dateModified).toBe(approvedArticle("how-children-collect-words").updated);
  });

  it("refuses an article that sits under no hub topic: its crumbs would have nowhere to lead", () => {
    const stray = { ...approvedArticle("how-children-collect-words"), slug: "a-guide-under-no-topic" };
    expect(() => page(stray)).toThrow(/a-guide-under-no-topic.*hub topic/);
  });

  it("refuses a related guide that is not in the article registry", () => {
    const broken = { ...approvedArticle("how-children-collect-words"), related: ["no-such-guide", "busy-hands-no-screens", "should-kids-use-ai"] as const };
    expect(() => page(broken)).toThrow(/no-such-guide/);
  });
});

describe("articlePath", () => {
  it("is the article's address in the URL plan (routes.ts), never one the template spells", () => {
    expect(articlePath("busy-hands-no-screens")).toBe("/stories/busy-hands-no-screens");
    expect(() => articlePath("a-guide-with-no-route")).toThrow(/a-guide-with-no-route.*routes\.ts/);
  });
});

describe("articleMeta", () => {
  it("is the module's meta on the article's own path, an article for share tools with its stored dates and byline", () => {
    const article = approvedArticle("what-to-look-for-in-a-safe-ai-toy");
    const meta = articleMeta(article);
    expect(meta.title).toEqual({ absolute: "What to look for in a safe AI toy · Kheelona" });
    expect(meta.description).toBe(
      "What to look for in a safe AI toy: what Common Sense Media and Fairplay advise, the checks to make before one comes home, and how Kheelu measures up.",
    );
    expect(meta.alternates).toEqual({ canonical: "/stories/what-to-look-for-in-a-safe-ai-toy" });
    expect(meta.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-07-28",
      modifiedTime: article.updated,
      authors: ["Aman Soni"],
      url: "/stories/what-to-look-for-in-a-safe-ai-toy",
      images: [{ url: "/og/tara-02-evening-with-amma.jpg", width: 1200, height: 630, alt: article.meta.og.alt }],
    });
    expect(meta).not.toHaveProperty("robots");
  });
});
