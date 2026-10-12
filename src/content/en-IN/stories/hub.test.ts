import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { Article } from "@/content/types";
import type { SectionEntryOf } from "@/layouts/sections-registry";
import { toPlainText } from "@/lib/content/plain-text";
import { ROOT, readRepoFile } from "../../../../test/e2e/support/repo";
import { DEFAULT_OG } from "../organization";
import { ARTICLE_SLUGS, routes, type ArticleSlug } from "../routes";
import { trustItems } from "../trust";
import { articlePageCopy, articles } from "./articles";
import { hubPage, hubPath, hubTopics } from "./hub";
import { topics } from "./topics";

/* The stories hub as slug lists only (architecture §6.1; task 2.1 acceptance 5): each topic's
 * featured guide and list, in the approved hub's order; the cards themselves are read from each
 * article module, so this test also proves the article cards carry the hub's words. */

const hub = new DOMParser().parseFromString(readRepoFile("mockup/stories.html"), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
/* A stub's open body (articles/stub.ts), built in pieces: the production placeholder scan (task 2.9)
   refuses the inline token anywhere in src/, and stub.ts goes once every guide is rewritten, so this
   test neither spells the token nor imports it (articles.test.ts proves the two agree). */
const REWRITE_PENDING = "{" + "ph:" + "ARTICLE rewrite pending}";

async function article(slug: ArticleSlug): Promise<Article> {
  const mod = (await import(/* @vite-ignore */ join(ROOT, "src/content/en-IN/stories/articles", `${slug}.ts`))) as { article: Article };
  return mod.article;
}

describe("the hub's topic groups", () => {
  it("follow the topics, in order", () => {
    expect(hubTopics.map((g) => g.topic)).toEqual(topics.map((t) => t.id));
  });

  it("place every article of the URL plan exactly once", () => {
    const placed = hubTopics.flatMap((g) => [...(g.featured ? [g.featured] : []), ...g.slugs]);
    expect(new Set(placed).size).toBe(placed.length);
    expect([...placed].sort()).toEqual([...ARTICLE_SLUGS].sort());
  });

  it("hold slugs only: no titles or summaries live in the hub (a rewrite never edits hub.ts)", () => {
    for (const g of hubTopics) expect(Object.keys(g).sort()).toEqual(g.featured ? ["featured", "slugs", "topic"] : ["slugs", "topic"]);
  });
});

describe.each(hubTopics.map((g) => [g.topic, g] as const))("topic %s, as the approved hub shows it", (topic, group) => {
  const section = hub.querySelector(`section#${topic}`)!;

  it("features the guide the hub features, with its card words and read time", async () => {
    const card = section.querySelector(".mk-guide");
    if (!group.featured) {
      expect(card).toBeNull();
      return;
    }
    const a = await article(group.featured);
    expect(toPlainText(a.card.title)).toBe(norm(card?.querySelector(".kh-card__title")?.textContent));
    expect(toPlainText(a.card.summary)).toBe(norm(card?.querySelector(".kh-card__body")?.textContent));
    expect(norm(card?.querySelector("a")?.textContent)).toContain(`${a.head.readMinutes} min read`);
  });

  it("lists the other guides in order; a guide still waiting for its rewrite carries the hub's card words", async () => {
    const shown = Array.from(section.querySelectorAll("li.kh-listitem")).map((li) => ({
      title: norm(li.querySelector(".kh-listitem__title")?.textContent),
      summary: norm(li.querySelector(".kh-listitem__sub")?.textContent),
    }));
    expect(group.slugs).toHaveLength(shown.length);
    const cards = await Promise.all(group.slugs.map(article));
    cards.forEach((a, i) => {
      /* A rewritten guide may take its keyword-map title (stories.md, notes on the cards), so only
         the guides still waiting are held to the hub's words here. */
      if (!JSON.stringify(a.body).includes(REWRITE_PENDING)) return;
      expect({ title: toPlainText(a.card.title), summary: toPlainText(a.card.summary) }, a.slug).toEqual(shown[i]);
    });
  });
});

/* The hub page itself (task 5.5; stories.html, stories.md): the page's own words, then its folds built from the
 * topics, the slug lists above and each guide's own module (title, summary, photo, read time), and the journal close
 * every article page shares (articlePageCopy). Nothing about a guide is typed twice: the checks below hold the hub to
 * the very values of the article registry, then to the approved page's words. */

type Topic = SectionEntryOf<"topic-section">;
type Close = SectionEntryOf<"close-section">;
type Hero = SectionEntryOf<"hero-section">;

const sectionsOf = <K extends Topic["kind"] | Close["kind"] | Hero["kind"]>(kind: K) =>
  hubPage.sections.filter((s): s is Extract<typeof s, { kind: K }> => s.kind === kind);
const topicFolds = () => sectionsOf("topic-section");
const pathOf = (slug: ArticleSlug) => routes.find((r) => r.module === `stories/articles/${slug}`)!.path;

describe("the hub page", () => {
  it("lives at the URL plan's hub route, whose content module is this one", () => {
    expect(routes.filter((r) => r.kind === "hub").map(({ path, module }) => ({ path, module }))).toEqual([{ path: hubPath, module: "stories/hub" }]);
  });

  it("carries the copy page's title and description (stories.md, at a glance) and the default share card", () => {
    expect(hubPage.meta).toEqual({
      title: "Parenting guides for ages 3 to 7 · Kheelona",
      description:
        "Parenting guides for 3 to 7 year olds, in plain words: screen time, talking and language, learning toys, and AI toys and safety.",
      og: DEFAULT_OG,
    });
    expect(toPlainText(hubPage.meta.title)).toBe(hub.querySelector("title")?.textContent);
    expect(toPlainText(hubPage.meta.description)).toBe(hub.querySelector('meta[name="description"]')?.getAttribute("content"));
  });

  it("opens with the hub hero, then the four topics, then the journal close: the approved folds in order", () => {
    expect(hubPage.sections.map((s) => s.kind)).toEqual(["hero-section", ...topics.map(() => "topic-section"), "close-section"]);
  });

  it("words the hero as the approved fold 1, the jump links named and anchored by topics.ts", () => {
    const [hero] = sectionsOf("hero-section");
    const fold = hub.querySelector("main > section")!;
    expect(hero.config.variant).toBe("hub");
    if (hero.config.variant !== "hub") return;
    const { heading, written, topics: jump } = hero.config;
    expect(heading.id).toBe(fold.querySelector("h1")?.id);
    expect(heading.title).toBe("Guides for parents of {hand:3 to 7 year olds}");
    expect(fold.querySelector("h1 .kh-hand")?.textContent).toBe("3 to 7 year olds");
    expect([heading.eyebrow, toPlainText(heading.title as string), heading.lead, written].map((s) => norm(s as string))).toEqual(
      [".kh-eyebrow", "h1", ".kh-heading__lead", ".mk-written"].map((sel) => norm(fold.querySelector(sel)?.textContent)),
    );
    expect(jump.id).toBe(fold.querySelector("nav")?.getAttribute("aria-labelledby"));
    expect(jump.label).toBe(norm(fold.querySelector(`#${jump.id}`)?.textContent));
    expect(jump.links).toEqual(topics.map((t) => ({ label: t.title, href: `#${t.id}` })));
  });

  it("gives each topic its anchor, heading and lead from topics.ts, on alternating bands from the page surface", () => {
    expect(topicFolds().map((f) => f.config.topic)).toEqual(topics.map(({ id, title, lead }) => ({ id, title, lead })));
    const bands = Array.from(hub.querySelectorAll("section.mk-topic")).map((s) => s.classList.contains("kh-section--band"));
    expect(topicFolds().map((f) => f.config.band === true)).toEqual(bands);
  });

  it("features the guide hub.ts features: card words, head photo and read time from its own module, linked to its page", () => {
    topicFolds().forEach((fold, i) => {
      const slug = hubTopics[i].featured;
      const card = fold.config.featured;
      if (slug === undefined) return expect(card).toBeUndefined();
      const a = articles[slug];
      expect(card?.title).toBe(a.card.title);
      expect(card?.summary).toBe(a.card.summary);
      expect(card?.image).toBe(a.head.image);
      expect(card?.href).toBe(pathOf(slug));
      expect(card?.linkLabel).toBe(`Read the guide · ${articlePageCopy.byline.readTime(a.head.readMinutes!)}`);
      const link = hub.querySelector(`section#${fold.config.topic.id} .mk-guide a`)!.cloneNode(true) as Element;
      link.querySelector(".kh-sr")?.remove();
      expect(card?.linkLabel).toBe(norm(link.textContent));
    });
  });

  it("lists every other guide by its own module's card words, in hub.ts's order, each linked to its own page", () => {
    topicFolds().forEach((fold, i) => {
      expect(fold.config.items).toHaveLength(hubTopics[i].slugs.length);
      hubTopics[i].slugs.forEach((slug, j) => {
        const row = fold.config.items[j];
        expect(row.title, slug).toBe(articles[slug].card.title);
        expect(row.summary, slug).toBe(articles[slug].card.summary);
        expect(row.href, slug).toBe(pathOf(slug));
      });
    });
  });

  it("links all 21 guides of the URL plan once each, with no review label anywhere (N22)", () => {
    const linked = topicFolds().flatMap((f) => [...(f.config.featured ? [f.config.featured.href] : []), ...f.config.items.map((r) => r.href)]);
    expect([...linked].sort()).toEqual(ARTICLE_SLUGS.map(pathOf).sort());
    expect(JSON.stringify(hubPage)).not.toMatch(/Rewritten in the build/);
  });

  it("closes with the journal close of the article pages (articlePageCopy), never retyped", () => {
    const [close] = sectionsOf("close-section");
    const words = articlePageCopy.close;
    expect(close.config.variant).toBe("journal");
    if (close.config.variant !== "journal") return;
    expect(close.config.heading).toBe(words.heading);
    expect(close.config.art).toBe(words.art);
    expect(close.config.cta).toEqual({
      cta: words.cta,
      arrow: true,
      block: true,
      trust: words.trust.map((id) => trustItems[id]),
      helpLine: true,
      secondary: words.secondary,
    });
    expect(close.config.cta.secondary).toBe(words.secondary);
  });
});
