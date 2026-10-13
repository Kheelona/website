import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { Article } from "@/content/types";
import { navigation } from "../../navigation";
import { ARTICLE_SLUGS } from "../../routes";
import { TRUST_COMPACT } from "../../trust";
import { articlePageCopy, articles, getArticle, PLAIN_CLOSE_ART } from "./index";

const DIR = join(process.cwd(), "src/content/en-IN/stories/articles");

/* The article registry (task 4.2; wave-3 close ruling): the one list of the 21 article modules, which the stories
 * route and the site shell's sticky-bar paths read, so a new article is its module, one line here and its slug in
 * routes.ts, never a shell edit. Also the words and the close every article page shares (story-*.html). */

describe("the article registry", () => {
  it("lists every article of the URL plan once, under its own slug, and nothing else", () => {
    expect(Object.keys(articles).sort()).toEqual([...ARTICLE_SLUGS].sort());
    for (const slug of ARTICLE_SLUGS) expect(articles[slug].slug, slug).toBe(slug);
  });

  it("holds the very object each article module exports", async () => {
    for (const slug of ARTICLE_SLUGS) {
      const mod = (await import(/* @vite-ignore */ join(DIR, `${slug}.ts`))) as { article: Article };
      expect(articles[slug], slug).toBe(mod.article);
    }
  });

  it("finds an article by its URL slug, and nothing outside the registry", () => {
    expect(getArticle("talking-toys-and-late-talkers")).toBe(articles["talking-toys-and-late-talkers"]);
    for (const slug of ["no-such-guide", "constructor", "__proto__", "toString", ""]) expect(getArticle(slug), slug).toBeUndefined();
  });
});

describe("the words every article page shares (story-*.html)", () => {
  it("leads the crumbs with the hub, named and linked as the nav links it", () => {
    expect(articlePageCopy.crumbs.hub).toEqual({ name: "Stories", path: "/stories" });
    expect(navigation.main).toContainEqual({ label: articlePageCopy.crumbs.hub.name, href: articlePageCopy.crumbs.hub.path });
    expect(articlePageCopy.crumbs.label).toBe("Breadcrumb");
  });

  it("words the byline as the approved heads print it", () => {
    expect(articlePageCopy.byline.published).toBe("First published");
    expect(articlePageCopy.byline.readTime(4)).toBe("4 min read");
  });

  it("names the notes and their markers, and the related band, as the approved articles do", () => {
    expect(articlePageCopy.sources).toEqual({ title: "Sources", marker: "Source" });
    expect(articlePageCopy.related).toEqual({ title: "Related guides" });
  });

  it("closes with the journal close of the hub: heading, finale button, compact trust line, help line, the ghost link", () => {
    const { close } = articlePageCopy;
    expect(close.heading).toEqual({
      title: "A toy that {hand:asks back.}",
      lead: "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back.",
    });
    expect(close.cta).toBe("finale");
    expect(close.trust).toBe(TRUST_COMPACT);
    expect(close.secondary).toEqual({ label: "See how it works", href: "/products/kheelu", variant: "ghost", iconEnd: "arrow-right" });
    expect(close.art.tone).toBe("sun");
    expect(close.art.layers.flatMap((layer) => ("doodle" in layer ? [layer.doodle.name] : []))).toEqual(["ink-heart"]);
  });

  it("keeps the safety and data guides' close art plain, no doodle (DS 02-imagery: no imagination layer on safety)", () => {
    expect(PLAIN_CLOSE_ART).toEqual([
      "what-to-look-for-in-a-safe-ai-toy",
      "questions-parents-ask-about-ai-toys",
      "should-kids-use-ai",
      "ai-toys-and-indias-data-law",
    ]);
  });

  it("ends the keep-reading close on the hub (B5)", () => {
    expect(articlePageCopy.keep).toEqual({
      title: "Keep reading",
      action: { label: "All guides for parents of 3 to 7 year olds", href: "/stories" },
    });
  });
});
