import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { routes } from "@/content/en-IN/routes";
import type { Article } from "@/content/types";
import { isModeVariant } from "@/lib/content/mode";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";
import { ROOT, listFiles } from "./e2e/support/repo";

/**
 * Internal links (task 4.4; architecture §6.1, SPA 5), data-driven over the URL plan (src/content/en-IN/routes.ts),
 * the article modules' `related` lists and every content module, so a wave-5 page or article never edits this file.
 *
 * The finding it keeps closed: on 2026-08-12 a crawl of the live sitemap found fifteen of the nineteen journal
 * articles with exactly ONE incoming internal link (from the /stories index) and the other four with two; no
 * article linked to any other. The journal was a set of dead-end leaves, and crawl equity pooled on Home instead of
 * reaching the pages written to rank. Each article's module now names three related guides, so the graph is data:
 *   - every article is offered by at least three other articles, and none hoards the links;
 *   - every internal link any content module carries (rich-text links, nav, trust and CTA links) lands on a
 *     route of the plan, so the site grows no dead end of a new kind;
 *   - every external link is https (or mailto: and tel:), and every article's sources are labelled and distinct.
 */

const ARTICLES = routes.filter((r) => r.kind === "article");
const PLANNED = new Set<string>(routes.map((r) => r.path));

type Exports = Record<string, unknown>;
const modules = new Map<string, Exports>();
const articles = new Map<string, Article>();

beforeAll(async () => {
  const files = listFiles(["src/content/en-IN"]).filter((p) => p.endsWith(".ts") && !/\.test(-d)?\.ts$/.test(p));
  for (const file of files) modules.set(file, (await import(/* @vite-ignore */ join(ROOT, file))) as Exports);
  for (const r of ARTICLES) {
    const page = Object.values(modules.get(`src/content/en-IN/${r.module}.ts`) ?? {}).find(
      (v) => typeof v === "object" && v !== null && "related" in v && "meta" in v,
    );
    if (page) articles.set(r.path, page as Article);
  }
});

/** Article path → the articles that offer it in their `related` list. */
function incoming(): Map<string, string[]> {
  const graph = new Map<string, string[]>(ARTICLES.map((r) => [r.path, []]));
  for (const [path, article] of articles) {
    for (const slug of article.related) graph.get(`/stories/${slug}`)?.push(path);
  }
  return graph;
}

type Link = { from: string; href: string };

/** Every link a value carries: `href` fields (nav, trust items, CTAs) and the links inside rich text. */
function linksIn(from: string, value: unknown, out: Link[] = []): Link[] {
  const fromNodes = (nodes: readonly RichNode[]) => {
    for (const node of nodes) {
      if (node.kind === "link") out.push({ from, href: node.href });
      if ("children" in node) fromNodes(node.children);
    }
  };
  if (typeof value === "string") {
    try {
      fromNodes(parseRichText(value));
    } catch {
      // Not rich text (an id, a tel: target): the parser's own guards cover the strings that are.
    }
  } else if (isModeVariant(value)) {
    linksIn(from, value.token, out);
    linksIn(from, value.full, out);
  } else if (Array.isArray(value)) value.forEach((v) => linksIn(from, v, out));
  else if (value && typeof value === "object") {
    for (const [key, v] of Object.entries(value)) {
      if (key === "href" && typeof v === "string") out.push({ from, href: v });
      else linksIn(from, v, out);
    }
  }
  return out;
}

/** The notes a source list repeats. A note is its citation and its address: two places in one document (the
 *  learning-toys guide's NEP 2020 chapter 4 and chapter 1, copy page fold 13) are two notes with one address. */
function repeatedSources(sources: Article["sources"]): string[] {
  const seen = new Set<string>();
  return sources.flatMap((s) => {
    const key = `${s.citation}\n${s.href}`;
    if (seen.has(key)) return [s.href];
    seen.add(key);
    return [];
  });
}

const allLinks = () => [...modules].flatMap(([file, mod]) => linksIn(file, mod));
const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//");

describe("the journal is not a set of dead ends", () => {
  it("reads every article of the plan from its module", () => {
    expect(ARTICLES.length).toBeGreaterThanOrEqual(19);
    expect(ARTICLES.filter((r) => !articles.has(r.path)).map((r) => r.module)).toEqual([]);
  });

  it("names three related articles in every article, all of them in the plan, never itself", () => {
    for (const [path, article] of articles) {
      const targets = article.related.map((slug) => `/stories/${slug}`);
      expect(new Set(targets).size, path).toBe(3);
      expect(targets, path).not.toContain(path);
      expect(targets.filter((t) => !PLANNED.has(t)), path).toEqual([]);
    }
  });

  it("gives every article at least three incoming links from other articles", () => {
    const short = [...incoming()].filter(([, from]) => from.length < 3);
    expect(short.map(([path, from]) => `${path} is offered only by: ${from.join(", ") || "nothing"}`)).toEqual([]);
  });

  it("spreads the links rather than pointing them all at a few favourites", () => {
    /* Three offered links per article, so a fair spread means nothing hoards them: a ceiling of double the
       average catches a list that funnels the journal into one or two pieces. */
    const counts = [...incoming().values()].map((from) => from.length);
    const average = counts.reduce((a, b) => a + b, 0) / counts.length;
    expect(Math.max(...counts)).toBeLessThanOrEqual(average * 2);
  });
});

describe("every link the content carries lands somewhere real", () => {
  it("reads the links of every content module", () => {
    expect(modules.size).toBeGreaterThan(20);
    expect(allLinks().filter((l) => isInternal(l.href)).length).toBeGreaterThan(20);
  });

  it("points every internal link at a route of the URL plan", () => {
    const dead = allLinks()
      .filter((l) => isInternal(l.href))
      .filter((l) => !PLANNED.has(l.href.split(/[?#]/)[0].replace(/(.)\/$/, "$1")))
      .map((l) => `${l.from} links ${l.href}, which is not a page of the plan (src/content/en-IN/routes.ts)`);
    expect(dead).toEqual([]);
  });

  it("uses https for every outside link (or mailto: and tel:), and in-page anchors for the rest", () => {
    const odd = allLinks()
      .filter((l) => !isInternal(l.href))
      .filter((l) => !/^(?:https:\/\/|mailto:|tel:|#[A-Za-z0-9_-]+$)/.test(l.href))
      .map((l) => `${l.from}: ${l.href}`);
    expect(odd).toEqual([]);
  });

  it("counts a note as repeated only when its citation and address both repeat: two places in one document are two notes", () => {
    const nep = "https://ncert.nic.in/pdf/nep/NEP_2020.pdf";
    expect(repeatedSources([{ citation: "NEP 2020, chapter 4, p. 11.", href: nep }, { citation: "NEP 2020, chapter 1, p. 7.", href: nep }])).toEqual([]);
    expect(repeatedSources([{ citation: "NEP 2020, chapter 4, p. 11.", href: nep }, { citation: "NEP 2020, chapter 4, p. 11.", href: nep }])).toEqual([nep]);
  });

  it("labels every article's sources and never repeats one", () => {
    for (const [path, article] of articles) {
      expect(repeatedSources(article.sources), `${path} repeats a source`).toEqual([]);
      for (const source of article.sources) {
        expect(source.href, path).toMatch(/^https:\/\//);
        expect(source.citation.trim().length, `${path}: an unlabelled source`).toBeGreaterThan(8);
      }
    }
  });
});
