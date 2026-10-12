import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { Article } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { ROOT, readRepoFile } from "../../../../test/e2e/support/repo";
import { ARTICLE_SLUGS, type ArticleSlug } from "../routes";
import { hubTopics } from "./hub";
import { topics } from "./topics";

/* The stories hub as slug lists only (architecture §6.1; task 2.1 acceptance 5): each topic's
 * featured guide and list, in the approved hub's order; the cards themselves are read from each
 * article module, so this test also proves the article cards carry the hub's words. */

const hub = new DOMParser().parseFromString(readRepoFile("mockup/stories.html"), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

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
      if (!JSON.stringify(a.body).includes("{ph:ARTICLE rewrite pending}")) return;
      expect({ title: toPlainText(a.card.title), summary: toPlainText(a.card.summary) }, a.slug).toEqual(shown[i]);
    });
  });
});
