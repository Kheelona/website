import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { routes, type RouteEntry } from "@/content/en-IN/routes";
import type { Meta, OfferMode } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { MOCKUP_SLUGS } from "./e2e/support/mockup-text";
import { ROOT, readRepoFile } from "./e2e/support/repo";
import { mockupRoute } from "./e2e/support/routes";
import { isStillLegacy } from "./guards/legacy-paths";

/**
 * Search-result metadata for every route of the URL plan (task 4.4; architecture §9.1, ADR-012, SPA 5), data-driven
 * over src/content/en-IN/routes.ts and the content modules, so a wave-5 page task never edits this file.
 *
 * For each route: a page file serves it; its content module's page (the export that carries `meta`) is checked:
 *   - the title fits in 60 characters and the description in 155, in both offer modes;
 *   - both are word for word what the route's copy page (wiki/site/pages/<mockup slug>.md) gives, per mode;
 *   - both are unique across the routes;
 *   - the title as rendered (pageMeta's absolute title) names the brand at most once: the old site shipped
 *     "… · Kheelona · Kheelona" to production because a route group counted as a segment for the title template;
 *   - pageMeta accepts it (D028: machine-read text leads with the total; no typed amount) and its share card exists.
 * A route whose module is not written yet prints "pending" while its legacy page still serves it (legacy-paths.ts);
 * any other missing module fails. Once task 6.3 empties LEGACY_PATHS, "pending" is impossible.
 */

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;
const MODES: readonly OfferMode[] = ["token", "full"];
const BRAND = "Kheelona";

/** The page file Next serves a marketing path from: route groups are transparent, a static segment wins over a
 *  dynamic one, a catch-all comes last. */
function pageFileFor(path: string): string | null {
  const visit = (dir: string, rest: readonly string[]): string | null => {
    if (rest.length === 0 && existsSync(join(ROOT, dir, "page.tsx"))) return `${dir}/page.tsx`;
    const dirs = readdirSync(join(ROOT, dir), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
    const next = rest.length > 0;
    const tries: (readonly [string, readonly string[]])[] = [
      ...(next ? dirs.filter((d) => d === rest[0]).map((d) => [d, rest.slice(1)] as const) : []),
      ...dirs.filter((d) => /^\(.+\)$/.test(d)).map((d) => [d, rest] as const),
      ...(next ? dirs.filter((d) => /^\[[^.[\]]+\]$/.test(d)).map((d) => [d, rest.slice(1)] as const) : []),
      ...(next ? dirs.filter((d) => /^\[\[?\.\.\./.test(d)).map((d) => [d, [] as string[]] as const) : []),
    ];
    for (const [d, r] of tries) {
      const hit = visit(`${dir}/${d}`, r);
      if (hit) return hit;
    }
    return null;
  };
  return visit("src/app", path.split("/").filter(Boolean));
}

type Page = { readonly meta: Meta };
type State =
  | { kind: "checked"; route: RouteEntry; page: Page }
  | { kind: "pending" | "missing"; route: RouteEntry; why: string };

const states: State[] = [];
beforeAll(async () => {
  for (const route of routes) {
    const file = join(ROOT, "src/content/en-IN", `${route.module}.ts`);
    const mod = existsSync(file) ? ((await import(/* @vite-ignore */ file)) as Record<string, unknown>) : {};
    const pages = Object.values(mod).filter((v): v is Page => typeof v === "object" && v !== null && "meta" in v);
    if (pages.length > 0) {
      states.push({ kind: "checked", route, page: pages[0] });
      continue;
    }
    const served = pageFileFor(route.path);
    const why = `${route.path}: src/content/en-IN/${route.module}.ts ${existsSync(file) ? "carries no page meta" : "is missing"}`;
    if (served && isStillLegacy(served)) states.push({ kind: "pending", route, why: `${why}; the legacy page ${served} still serves it` });
    else states.push({ kind: "missing", route, why: `${why}, and ${served ?? "no page file"} is not a legacy page` });
  }
  for (const s of states) if (s.kind === "pending") console.log(`[metadata] pending ${s.why}`);
});

const checked = () => states.filter((s): s is Extract<State, { kind: "checked" }> => s.kind === "checked");
const plain = (page: Page, mode: OfferMode) => ({
  title: toPlainText(page.meta.title, buildOffer(mode)),
  description: toPlainText(page.meta.description, buildOffer(mode)),
});

/** The copy page's metadata rows ("Title (54 characters)", "Meta description, token mode (150 characters)"),
 *  without its source markers, each read at the length the row states. */
function copyMeta(slug: string): { title: string; description: Record<OfferMode, string> } {
  const rows = readRepoFile(`wiki/site/pages/${slug}.md`)
    .split("\n")
    .filter((l) => /^\|\s*(?:Meta title|Title|Meta description)[^|]*\(\d+ characters\)\s*\|/.test(l))
    .map((l) => {
      const [label, value] = l.split("|").slice(1, 3).map((c) => c.trim());
      const text = value.replace(/`\{[a-z-]+-source\}`/g, "");
      expect(text.length, `${slug}.md "${label}" says ${label.match(/\d+/)![0]} characters`).toBe(Number(label.match(/\((\d+) characters\)/)![1]));
      return { label, text };
    });
  const title = rows.find((r) => /^(?:Meta title|Title) /.test(r.label))?.text;
  const description = (mode: OfferMode) =>
    rows.find((r) => r.label.startsWith(`Meta description, ${mode} mode`))?.text ?? rows.find((r) => /^Meta description \(/.test(r.label))?.text;
  expect(title, `${slug}.md has no title row`).toBeTruthy();
  expect(description("token"), `${slug}.md has no meta description row`).toBeTruthy();
  return { title: title!, description: { token: description("token")!, full: description("full")! } };
}

/** The copy page of a marketing path: the approved mockup whose page meta names that URL (structure §5). */
const COPY_PAGE: ReadonlyMap<string, string> = new Map(
  MOCKUP_SLUGS.map((slug) => mockupRoute(slug))
    .filter((r) => r.host === "marketing" && r.mockup !== "404")
    .map((r) => [r.path, r.mockup!]),
);

/** Copy pages type ASCII quotes and hyphens; the content modules carry the typographic ones the pages print. */
const same = (s: string) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/‑/g, "-").replace(/ /g, " ");

describe("every route of the URL plan", () => {
  it("is served by a page file", () => {
    expect(routes.filter((r) => pageFileFor(r.path) === null).map((r) => r.path)).toEqual([]);
  });

  it("has its content module, or prints pending while its legacy page still serves it", () => {
    expect(states).toHaveLength(routes.length);
    expect(states.filter((s) => s.kind === "missing").map((s) => (s as { why: string }).why)).toEqual([]);
    // The articles' modules exist from wave 2 on, so the check is never vacuous.
    expect(checked().length).toBeGreaterThanOrEqual(21);
  });
});

describe("the metadata of every route whose content module is written", () => {
  it.each(MODES)("fits: title within 60 characters, description within 155 (%s mode)", (mode) => {
    const over = checked().flatMap(({ route, page }) => {
      const { title, description } = plain(page, mode);
      return [
        ...(title.length > TITLE_MAX ? [`${route.path} title ${title.length}: ${title}`] : []),
        ...(description.length > DESCRIPTION_MAX ? [`${route.path} description ${description.length}: ${description}`] : []),
      ];
    });
    expect(over).toEqual([]);
  });

  it.each(MODES)("is unique across the routes (%s mode)", (mode) => {
    const seen = { title: new Map<string, string>(), description: new Map<string, string>() };
    const doubles: string[] = [];
    for (const { route, page } of checked()) {
      const text = plain(page, mode);
      for (const key of ["title", "description"] as const) {
        const other = seen[key].get(text[key]);
        if (other) doubles.push(`${route.path} and ${other} share a ${key}: ${text[key]}`);
        seen[key].set(text[key], route.path);
      }
    }
    expect(doubles).toEqual([]);
  });

  it.each(MODES)("is word for word the copy page's, where the route has one (%s mode)", (mode) => {
    let compared = 0;
    for (const { route, page } of checked()) {
      const slug = COPY_PAGE.get(route.path);
      if (!slug) continue;
      const copy = copyMeta(slug);
      const text = plain(page, mode);
      expect(same(text.title), `${route.path} title (${slug}.md)`).toBe(same(copy.title));
      expect(same(text.description), `${route.path} description (${slug}.md)`).toBe(same(copy.description[mode]));
      compared++;
    }
    // The three approved articles have copy pages; every page module written in wave 5 adds one.
    expect(compared).toBeGreaterThanOrEqual(3);
  });

  it.each(MODES)("renders through pageMeta with the brand at most once in the title (%s mode)", (mode) => {
    for (const { route, page } of checked()) {
      const meta = pageMeta({ ...page.meta, path: route.path, offer: buildOffer(mode) });
      const title = (meta.title as { absolute: string }).absolute;
      expect(title.split(BRAND).length - 1, `${route.path}: "${title}"`).toBeLessThanOrEqual(1);
      expect(meta.description).toBe(plain(page, mode).description);
    }
  });

  it("shares a card that exists, with words for it", () => {
    for (const { route, page } of checked()) {
      expect(existsSync(join(ROOT, "public", page.meta.og.image)), `${route.path}: ${page.meta.og.image}`).toBe(true);
      expect(page.meta.og.alt.trim().length, route.path).toBeGreaterThan(0);
    }
  });
});

describe("the copy pages this guard reads", () => {
  it("map every marketing page of the plan that has a mockup, and give each a title and description", () => {
    for (const [path, slug] of COPY_PAGE) {
      expect(routes.map((r) => r.path), slug).toContain(path);
      const copy = copyMeta(slug);
      expect(copy.title.length, slug).toBeLessThanOrEqual(TITLE_MAX);
      for (const mode of MODES) expect(copy.description[mode].length, `${slug} ${mode}`).toBeLessThanOrEqual(DESCRIPTION_MAX);
    }
    expect(COPY_PAGE.size).toBe(15);
  });
});
