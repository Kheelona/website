import { join } from "node:path";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import * as llmsRoute from "@/app/llms.txt/route";
import * as pricingRoute from "@/app/pricing.md/route";
import sitemap from "@/app/sitemap";
import { organization } from "@/content/en-IN/organization";
import { routes, type RouteEntry } from "@/content/en-IN/routes";
import type { Offer, OfferMode } from "@/content/types";
import { siteGraphOf } from "@/layouts/SiteShell/site-graph";
import { isModeVariant } from "@/lib/content/mode";
import { isPlaceholder } from "@/lib/content/placeholder";
import { toPlainText } from "@/lib/content/plain-text";
import { getOffer, OFFER_REVALIDATE_SECONDS } from "@/lib/offer/get-offer";
import { buildOffer } from "@/lib/offer/offer";
import { ROOT, listFiles, readRepoFile } from "./e2e/support/repo";
import { findBanned } from "./guards/banned-phrases.data";

/* The machine files (task 4.4; architecture §9.3, ADR-012, D028, claims §4), data-driven over the URL plan
 * (src/content/en-IN/routes.ts) and the content modules, so a wave-5 page or article never edits this file.
 *
 *   sitemap.xml   exactly the plan's canonical URLs (no /playos, no merged 2-year-old article, no store URL), the
 *                 plan's priorities, and `lastModified` only where a route's content module stores a date;
 *   llms.txt and  in both offer modes: every line restates visible copy (each fragment is the text of a content
 *   pricing.md    module), the first amount is the mode's total "(incl. GST)" (D028), the rename note, the entity
 *                 facts, no /playos or any URL outside the plan, no banned line, a dated `*_UPDATED` constant;
 *                 GET follows the live offer mode (getOffer) and revalidates with it.
 */

vi.mock("@/lib/offer/get-offer", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/offer/get-offer")>()),
  getOffer: vi.fn(),
}));

const ORIGIN = "https://kheelona.com";
const STORE = "https://store.kheelona.com";
const MODES: readonly OfferMode[] = ["token", "full"];
const url = (path: string) => (path === "/" ? ORIGIN : `${ORIGIN}${path}`);

type Exports = Record<string, unknown>;

/** Every content module under src/content/en-IN (tests aside), by path. */
const modules = new Map<string, Exports>();
beforeAll(async () => {
  const files = listFiles(["src/content/en-IN"]).filter((p) => p.endsWith(".ts") && !/\.test(-d)?\.ts$/.test(p));
  for (const file of files) modules.set(file, (await import(/* @vite-ignore */ join(ROOT, file))) as Exports);
});

/** A route's page content: the export of its content module that carries `meta`, or null while none is written. */
function pageContent(route: RouteEntry): Exports | null {
  const mod = modules.get(`src/content/en-IN/${route.module}.ts`);
  const pages = Object.values(mod ?? {}).filter((v): v is Exports => typeof v === "object" && v !== null && "meta" in v);
  return pages[0] ?? null;
}

afterEach(() => vi.useRealTimers());

describe("sitemap.xml", () => {
  it("lists exactly the URL plan, in its order, as canonical URLs on the production origin", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual(routes.map((r) => url(r.path)));
    expect(urls).toHaveLength(33);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("leaves out the redirected URLs and the store host (D041, D048)", () => {
    const urls = sitemap().map((entry) => String(entry.url));
    expect(urls).not.toContain(`${ORIGIN}/playos`);
    expect(urls).not.toContain(`${ORIGIN}/stories/brain-development-toys-for-a-2-year-old`);
    expect(urls.filter((u) => !u.startsWith(ORIGIN))).toEqual([]);
    expect(urls.filter((u) => /store\.|betawebsite|betastore/.test(u))).toEqual([]);
  });

  it("gives every URL the plan's priority", () => {
    const priority = new Map(sitemap().map((entry) => [entry.url, entry.priority]));
    for (const r of routes) expect(priority.get(url(r.path)), r.path).toBe(r.priority);
  });

  it("dates a URL only where its content module stores a date, and then with that date", () => {
    const modified = new Map(sitemap().map((entry) => [entry.url, entry.lastModified]));
    let dated = 0;
    for (const r of routes) {
      const stored = pageContent(r)?.updated;
      if (typeof stored === "string") {
        expect(stored, r.path).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(modified.get(url(r.path)), r.path).toBe(stored);
        dated++;
      } else {
        expect(modified.get(url(r.path)), `${r.path} has no stored date, so no lastModified`).toBeUndefined();
      }
    }
    // Every article stores its dates (src/content/en-IN/stories/articles), so at least those 21 carry one.
    expect(dated).toBeGreaterThanOrEqual(21);
  });

  it("never computes a date at build: the clock does not reach the file (lessons §6)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2031-05-05T05:05:05Z"));
    const dates = sitemap().flatMap((entry) => (entry.lastModified === undefined ? [] : [entry.lastModified]));
    // A stored date is a plain calendar date; a computed one would be a Date, or a string carrying the clock's year.
    expect(dates.filter((d) => typeof d !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(d) || d.includes("2031"))).toEqual([]);
  });
});

/* ── llms.txt and pricing.md ─────────────────────────────────────────────────────────────────────────────── */

const MACHINE = [
  { name: "llms.txt", route: llmsRoute, text: llmsRoute.llmsText, updated: llmsRoute.LLMS_UPDATED, type: "text/plain" },
  { name: "pricing.md", route: pricingRoute, text: pricingRoute.pricingText, updated: pricingRoute.PRICING_UPDATED, type: "text/markdown" },
] as const;

const offerFor = (mode: OfferMode): Offer => buildOffer(mode);

/** The text of every string a content module exports, in one offer mode: what the pages can show. */
function visibleCopy(mode: OfferMode): string {
  const offer = offerFor(mode);
  const out: string[] = [];
  const walk = (value: unknown): void => {
    if (typeof value === "string") {
      try {
        out.push(toPlainText(value, offer));
      } catch {
        out.push(value);
      }
    } else if (isModeVariant(value)) walk(value[mode]);
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === "object" && !isPlaceholder(value)) Object.values(value).forEach(walk);
  };
  for (const mod of modules.values()) walk(Object.values(mod));
  return squash(out.join("\n"));
}

const squash = (s: string) => s.replace(/\s+/g, " ").trim();

/**
 * The words of a machine file, cut at its glue: list marks, link brackets, URLs, ": " between a term and its value
 * and " · " between items. H1 and H2 headings are the file's own framing and the "Last updated" line its date;
 * every other piece must be visible copy.
 */
function fragments(text: string): string[] {
  const out: string[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || /^#{1,2} /.test(line) || /^Last updated: \d{4}-\d{2}-\d{2}$/.test(line)) continue;
    const body = line
      .replace(/^(?:###|-|>) /, "")
      .replace(/\[([^\]]+)\]\(https:\/\/[^)\s]+\)/g, " · $1 · ")
      .replace(/https:\/\/\S+/g, " · ");
    for (const piece of body.split(/: | · /)) if (piece.trim()) out.push(squash(piece));
  }
  return out;
}

/** Every URL a machine file names: link targets and bare URLs. */
function urlsIn(text: string): string[] {
  return [...text.matchAll(/https?:\/\/[^\s)\]]+/g)].map((m) => m[0].replace(/[.,;:]$/, ""));
}

/** The URLs a machine file may name: the plan's routes (with a fragment), the store, the two machine files and
 *  the profiles the Organization JSON-LD names. */
function allowedUrl(u: string): boolean {
  const planned = new Set(routes.map((r) => url(r.path)));
  const [base] = u.split("#");
  const profiles: readonly string[] = organization.sameAs;
  return planned.has(base) || u === STORE || u === `${ORIGIN}/llms.txt` || u === `${ORIGIN}/pricing.md` || profiles.includes(u);
}

/** The Organization node the site shell emits on every page (task 3.1's mapper). */
const organizationNode = () => siteGraphOf(organization)["@graph"].find((n) => n["@type"] === "Organization")!;

describe.each(MACHINE)("$name", ({ name, route, text, updated, type }) => {
  describe.each(MODES)("in %s mode", (mode) => {
    const body = () => text(offerFor(mode));

    it("restates visible copy only: every fragment is the text of a content module", () => {
      const copy = visibleCopy(mode);
      const invented = fragments(body()).filter((f) => !copy.includes(f));
      expect(invented, `${name} says something no content module says:\n${invented.join("\n")}`).toEqual([]);
      expect(fragments(body()).length).toBeGreaterThan(10);
    });

    it("leads with the total, incl. GST, before any other amount (D028)", () => {
      const amounts = [...body().matchAll(/₹\s?\d[\d,]*/g)];
      const total = mode === "token" ? "₹4,999" : "₹7,999";
      expect(amounts[0]?.[0], "the first amount").toBe(total);
      expect(body().slice(amounts[0]!.index, amounts[0]!.index + total.length + 12)).toBe(`${total} (incl. GST)`);
      if (mode === "full") expect(body(), "full mode has no advance").not.toMatch(/₹499\b|\badvance\b/);
      else expect(body(), "token mode names the refundable advance second").toMatch(/₹499/);
    });

    it("names no unit count but the 500-unit cap, at most once (D041), and nothing under 3", () => {
      const units = [...body().matchAll(/\b\d[\d,]*\s+units\b/gi)].map((m) => m[0]);
      expect(units.filter((u) => u !== "500 units")).toEqual([]);
      expect(units.length).toBeLessThanOrEqual(1);
      expect(body()).not.toMatch(/\b(?:1|2|two)[- ]year[- ]olds?\b|\btoddlers?\b|\bbab(?:y|ies)\b/i);
    });

    it("carries no banned line (claims §4) and no em dash", () => {
      const hits = findBanned(body());
      expect(hits, hits.map((h) => `${h.id}: "${h.match}" in "${h.sentence}"`).join("\n")).toEqual([]);
      expect(body()).not.toContain("—");
    });

    it("links only the plan's pages, the store, the machine files and the official profiles (never /playos)", () => {
      expect(body()).not.toMatch(/\/playos\b/);
      expect(urlsIn(body()).filter((u) => !allowedUrl(u))).toEqual([]);
    });

    it("carries the rename note: Kheelu was called Lumi until 5 September 2026", () => {
      expect(body()).toMatch(/\bKheelu is the toy that was called Lumi until 5 September 2026\b/);
    });

    it("states the entity facts as the pages do (test plan §4.3)", () => {
      for (const fact of ["Kheelu by Kheelona", "3 to 7", "Made in India", "WhatsApp or call +91 91875 46483"]) {
        expect(body(), fact).toContain(fact);
      }
    });

    it("ends with its dated constant", () => {
      expect(updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(`${updated}T00:00:00Z`).toISOString().slice(0, 10)).toBe(updated);
      expect(body()).toMatch(new RegExp(`\\nLast updated: ${updated}\\n$`));
    });
  });

  it("answers GET in the live offer mode, with its content type (ADR-005)", async () => {
    for (const mode of MODES) {
      vi.mocked(getOffer).mockResolvedValueOnce(offerFor(mode));
      const res = await route.GET();
      expect(res.headers.get("content-type")).toContain(type);
      expect(await res.text()).toBe(text(offerFor(mode)));
    }
  });

  it("is prerendered and revalidated with the offer, so a mode flip reaches it within the window", () => {
    expect(route.dynamic).toBe("force-static");
    expect(route.revalidate).toBe(OFFER_REVALIDATE_SECONDS);
  });

  it("restates no Organization fact by hand: they come from the site shell's mapper (task 3.1)", () => {
    const source = readRepoFile(`src/app/${name}/route.ts`);
    const facts = [organization.legalName, ...organization.sameAs, ...organization.founders.map((f) => f.name), organization.taxId];
    expect(facts.filter((fact) => source.includes(fact))).toEqual([]);
  });
});

describe("llms.txt", () => {
  const body = (mode: OfferMode = "token") => llmsRoute.llmsText(offerFor(mode));

  it("names the grievance officer with the published line, in both modes (D029, D032)", () => {
    for (const mode of MODES) {
      expect(body(mode)).toMatch(/\n- Grievance Officer: Aman Soni, Co-Founder and CTO, aman@kheelona\.com, \+91 91875 46483\. We acknowledge every complaint within 48 hours/);
    }
  });

  it("names every profile the Organization JSON-LD names, so the two cannot disagree", () => {
    const sameAs = organizationNode().sameAs as readonly string[];
    expect(sameAs.length).toBeGreaterThan(0);
    for (const profile of sameAs) expect(body(), profile).toContain(profile);
  });

  it("links every page of the plan that is not an article, and the store", () => {
    for (const r of routes.filter((x) => x.kind !== "article")) expect(urlsIn(body()), r.path).toContain(url(r.path));
    expect(urlsIn(body())).toContain(STORE);
    expect(urlsIn(body())).toContain(`${ORIGIN}/pricing.md`);
  });
});

describe("the visible-copy check", () => {
  it("reads every content module, so it cannot pass on an empty corpus", () => {
    expect(modules.size).toBeGreaterThan(20);
    for (const r of routes.filter((x) => x.kind === "article")) expect(modules.has(`src/content/en-IN/${r.module}.ts`), r.module).toBe(true);
  });

  it("refuses a sentence no content module says", () => {
    const copy = visibleCopy("token");
    const planted = "- Kheelu has no moving parts\n- Ages: 3 to 7\n### Is Kheelu the same as Lumi?";
    expect(fragments(planted).filter((f) => !copy.includes(f))).toEqual(["Kheelu has no moving parts"]);
  });
});
