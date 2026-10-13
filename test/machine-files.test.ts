import { createHash } from "node:crypto";
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
import { nodesToPlainText } from "@/lib/content/plain-text";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";
import { getOffer, OFFER_REVALIDATE_SECONDS } from "@/lib/offer/get-offer";
import { buildOffer } from "@/lib/offer/offer";
import { ROOT, listFiles, readRepoFile } from "./e2e/support/repo";
import { findBanned } from "./guards/banned-phrases.data";

/* The machine files (task 4.4; architecture §9.3, ADR-012, D028, claims §4), data-driven over the URL plan
 * (src/content/en-IN/routes.ts) and the content modules, so a wave-5 page or article never edits this file.
 *
 *   sitemap.xml   exactly the plan's canonical URLs (no /playos, no merged 2-year-old article, no store URL), the
 *                 plan's priorities, and `lastModified` only where a route's content module stores a date;
 *   llms.txt and  in both offer modes: every line restates visible copy (whole strings of the content modules, never
 *   pricing.md    a substring; a term beside its own value; a heading is listed framing or visible copy), the first
 *                 amount is the mode's total "(incl. GST)" (D028), the rename note, the entity facts, no /playos or
 *                 any URL outside the plan, no banned line, a `*_UPDATED` constant pinned to the body it dates;
 *                 GET follows the live offer mode (getOffer), revalidates with it and sets no longer cache.
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
    // A floor, never a count (33 URLs in the plan on 2026-10-12; 32 since the 3-6-9-12 article left, D053), so an
    // emptied plan cannot pass the line above.
    expect(urls.length).toBeGreaterThanOrEqual(32);
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
    // Every article stores its dates (src/content/en-IN/stories/articles), so at least those 20 carry one (21 until
    // the 3-6-9-12 article left the journal, D053).
    expect(dated).toBeGreaterThanOrEqual(20);
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
  { name: "llms.txt", route: llmsRoute, text: llmsRoute.llmsText, updated: llmsRoute.LLMS_UPDATED, constant: "LLMS_UPDATED", type: "text/plain" },
  { name: "pricing.md", route: pricingRoute, text: pricingRoute.pricingText, updated: pricingRoute.PRICING_UPDATED, constant: "PRICING_UPDATED", type: "text/markdown" },
] as const;

/**
 * What each file said on the day its `*_UPDATED` constant names: a sha256 of its body per offer mode, the "Last
 * updated" line aside (architecture §9.3, lessons §6). The bodies are built from shared content modules no route
 * owns (faqs, trust, seller, offer, product, navigation, topics, routes, organization, policies, cta), so an edit
 * there changes a file without touching it; this pin is what notices. When it fails, bump the constant to the day
 * of the change and re-pin the date and both hashes here, in the same commit.
 */
const DATED: Record<(typeof MACHINE)[number]["name"], { readonly date: string } & Record<OfferMode, string>> = {
  "llms.txt": {
    // 2026-10-14: the product's Parent app row ends "On iPhone and Android." (D055 item 26; task 6.7); the 3-6-9-12 guide's
    // removal (D053; task 6.5) changed no line of it.
    date: "2026-10-14",
    token: "4575d9a28417aeb3c0416954462a9882447ec01e8793ab7850677fa61136bfeb",
    full: "b05c32366e09420e1852939d72a3bacf4abc29c7f1e2db55e1701bb41695f70c",
  },
  "pricing.md": {
    // 2026-10-13: "About Kheelu" adds the product page's Manufacturer declaration (task 4.5 item 6).
    date: "2026-10-13",
    token: "2906cc8bd7103c0b81eae3ebececf2170d378e69d7c3f11b70de8551c02bfc89",
    full: "48c0631c59900ff1e296611bde258218deee3bb6d31969f599465049ecdffd5c",
  },
};

/** A body's substance: the text without its "Last updated" line. */
const substanceHash = (body: string) => createHash("sha256").update(body.replace(/\nLast updated: [^\n]*\n$/, "\n")).digest("hex");

const offerFor = (mode: OfferMode): Offer => buildOffer(mode);

const squash = (s: string) => s.replace(/\s+/g, " ").trim();

/** What the pages can show, in one offer mode. `units`: every string a content module exports, each one whole (its
 *  plain text, squashed, a label's trailing ":" dropped). `records`: each object's own units together (a definition
 *  row, a topic, a founder, the grievance line), so a "term: value" line pairs a term with its own value. */
interface Corpus {
  readonly units: ReadonlySet<string>;
  readonly records: readonly ReadonlySet<string>[];
}

/** Where a placeholder stood in a string's plain text: a character no content string holds. */
const GAP = "\u0001";

/** Rich text with each placeholder (an unannounced fact) as a GAP: the machine files leave the fact out (llms.txt
 *  `announced`), never printing its marker, so the unit a file may restate is the text around it. */
const unannounced = (nodes: readonly RichNode[]): RichNode[] =>
  nodes.map((node): RichNode => {
    if (node.kind === "placeholder") return { kind: "text", text: GAP };
    return "children" in node ? { ...node, children: unannounced(node.children) } : node;
  });

/** Ends a sentence: a full stop, question or exclamation mark, then any closing quote or bracket. */
const SENTENCE_END = /[.!?…][”’"')\]]*$/;
/** Opens a sentence: any opening quote or bracket, then a capital or a digit. */
const SENTENCE_START = /^[“‘"'([]*[A-Z0-9₹]/;

/** A placeholder in the middle of a sentence (task 4.5 item 6): words follow it, and either words of the same sentence
 *  come before it or what follows does not open a sentence. Leaving such a fact out mangles the sentence ("Lasts on one
 *  charge."), so that string is no visible unit. One that ends the string, or stands between two sentences, is clean. */
function midSentence(text: string): boolean {
  const pieces = text.split(GAP);
  return pieces.slice(1).some((after, i) => {
    const before = pieces.slice(0, i + 1).join("").trimEnd();
    const next = after.trimStart();
    if (next === "") return false;
    return (before !== "" && !SENTENCE_END.test(before)) || !SENTENCE_START.test(next);
  });
}

/** Proof-gated content (D038): while `gated` is present the item is never rendered, so it is not visible copy. */
const isGated = (value: object): boolean => "gated" in value && (value as { gated?: unknown }).gated !== undefined;

function visibleCopy(mode: OfferMode, sources: Iterable<Exports> = modules.values()): Corpus {
  const offer = offerFor(mode);
  const units = new Set<string>();
  const records: Set<string>[] = [];
  const unitOf = (value: string): string => {
    let text: string;
    try {
      text = nodesToPlainText(unannounced(parseRichText(value)), offer);
    } catch {
      text = value;
    }
    if (midSentence(text)) return "";
    return squash(text.replaceAll(GAP, " ")).replace(/:$/, "");
  };
  const inMode = (value: unknown): unknown => (isModeVariant(value) ? value[mode] : value);
  const walk = (raw: unknown): void => {
    const value = inMode(raw);
    if (typeof value === "string") {
      const unit = unitOf(value);
      if (unit) units.add(unit);
    } else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === "object" && !isPlaceholder(value) && !isGated(value)) {
      const fields = Object.values(value).map(inMode);
      const own = fields.flatMap((f) => (Array.isArray(f) ? f.map(inMode) : [f])).filter((f): f is string => typeof f === "string");
      records.push(new Set(own.map(unitOf).filter(Boolean)));
      fields.forEach(walk);
    }
  };
  for (const mod of sources) walk(Object.values(mod));
  return { units, records };
}

/** The headings that frame a machine file rather than state a fact: the only H1 and H2 lines that need not be
 *  visible copy. Any other H1 or H2 must be one whole visible unit. */
const FRAMING: ReadonlySet<string> = new Set([
  "Kheelona",
  "Kheelu by Kheelona",
  "Pricing: Kheelu by Kheelona",
  "Safety",
  "Questions parents ask",
  "Delivery, returns and payment",
  "Contact",
  "Company",
  "Pages",
  "Guides for parents",
  "Machine-readable",
  "Official profiles",
  "What you pay",
  "Included with every Kheelu",
  "Returns and warranty",
  "Where to pre-order",
  "About Kheelu",
]);

/** The glue a machine file joins units with: ": " between a term and its value, " · " between items. */
const GLUE = /: | · /g;
/** A link (its label is a unit of its own) and a bare URL (checked by the link test, not here). */
const LINK = /\[([^\]]+)\]\(https:\/\/[^)\s]+\)/g;
const BARE_URL = /https:\/\/\S+/g;
const CUT = "\u0000";

/** Every way to read `chunk` as whole units joined by glue: the whole chunk first, so a sentence with a colon in
 *  it stays one unit; a piece is only ever compared whole, never as a substring of anything. */
function readings(chunk: string, units: ReadonlySet<string>): string[][] {
  const out: string[][] = [];
  const go = (rest: string, acc: readonly string[]): void => {
    if (units.has(squash(rest))) out.push([...acc, squash(rest)]);
    for (const glue of rest.matchAll(GLUE)) {
      const head = squash(rest.slice(0, glue.index));
      if (units.has(head)) go(rest.slice(glue.index + glue[0].length), [...acc, head]);
    }
  };
  go(chunk, []);
  return out;
}

/**
 * What a machine file says that no page says ([] when it restates visible copy only). An H1 or H2 is framing
 * (FRAMING) or one whole unit. Any other line, list mark, link brackets and URLs aside, must read as whole units
 * joined by glue, all from one record when there are two or more ("Microphone: None" pairs two visible units, but
 * "None" is the camera's value). The "Last updated" line is the file's date, checked on its own.
 */
function unsaid(text: string, copy: Corpus): string[] {
  const out: string[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || /^Last updated: \d{4}-\d{2}-\d{2}$/.test(line)) continue;
    const heading = /^#{1,2} (.+)$/.exec(line);
    if (heading) {
      const title = squash(heading[1]);
      if (!FRAMING.has(title) && !copy.units.has(title)) out.push(title);
      continue;
    }
    const said = line.replace(/^(?:###|-|>) /, "");
    const chunks = said
      .replace(LINK, `${CUT}$1${CUT}`)
      .replace(BARE_URL, CUT)
      .split(CUT)
      .map((chunk) => chunk.replace(/^(?:\s|:|·)+|(?:\s|:|·)+$/g, ""))
      .filter(Boolean);
    const ways = chunks.reduce<string[][]>((acc, chunk) => acc.flatMap((a) => readings(chunk, copy.units).map((r) => [...a, ...r])), [[]]);
    if (ways.some((way) => way.length <= 1 || copy.records.some((record) => way.every((unit) => record.has(unit))))) continue;
    const loose = chunks.flatMap((chunk) => chunk.split(GLUE)).map(squash).filter((piece) => piece && !copy.units.has(piece));
    out.push(...(loose.length > 0 ? loose : [squash(said)]));
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

describe.each(MACHINE)("$name", ({ name, route, text, updated, constant, type }) => {
  describe.each(MODES)("in %s mode", (mode) => {
    const body = () => text(offerFor(mode));

    it("restates visible copy only: every line is whole units of a content module, a term beside its own value", () => {
      const invented = unsaid(body(), visibleCopy(mode));
      expect(invented, `${name} says something no content module says:\n${invented.join("\n")}`).toEqual([]);
      expect(body().split("\n").filter((line) => line.trim()).length).toBeGreaterThan(10);
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

    it("states the entity facts as the pages do (test plan §4.3; architecture §9.3: made in India by Kheelona Robotics)", () => {
      for (const fact of ["Kheelu by Kheelona", "3 to 7", "Made in India", "Manufacturer: Kheelona Robotics Pvt Ltd", "WhatsApp or call +91 91875 46483"]) {
        expect(body(), fact).toContain(fact);
      }
    });

    it("ends with its dated constant", () => {
      expect(updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(`${updated}T00:00:00Z`).toISOString().slice(0, 10)).toBe(updated);
      expect(body()).toMatch(new RegExp(`\\nLast updated: ${updated}\\n$`));
    });

    it("is the body its dated constant dates: a change in substance bumps the date and the pin together", () => {
      const pin = DATED[name];
      expect(updated, `${name}: ${constant} and DATED["${name}"].date must name the same day`).toBe(pin.date);
      expect(
        substanceHash(body()),
        `${name} (${mode} mode) no longer says what it said on ${pin.date}. Main session: set ${constant} to the day of ` +
          `the change and re-pin DATED["${name}"] (its date and both hashes) in test/machine-files.test.ts, in the same commit.`,
      ).toBe(pin[mode]);
    });
  });

  it("answers GET in the live offer mode, with its content type and no cache outliving the window (ADR-005)", async () => {
    for (const mode of MODES) {
      vi.mocked(getOffer).mockResolvedValueOnce(offerFor(mode));
      const res = await route.GET();
      expect(res.headers.get("content-type")).toContain(type);
      expect(await res.text()).toBe(text(offerFor(mode)));
      // Next's own ISR header (s-maxage=300, stale-while-revalidate) carries the window; a browser max-age above it
      // would keep the token-mode body (₹499, "first 500 units") after a sell-out flip.
      const ages = [...(res.headers.get("cache-control") ?? "").matchAll(/\bmax-age=(\d+)/g)].map((m) => Number(m[1]));
      expect(ages.filter((age) => age > OFFER_REVALIDATE_SECONDS), `${name}: cache-control ${res.headers.get("cache-control")}`).toEqual([]);
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

  it("passes the lines the files carry: a sentence with a colon, a term and its value, items, a link and its lead", () => {
    const copy = visibleCopy("token");
    const clean = [
      "## Safety",
      "### Is Kheelu the same as Lumi?",
      "- Ages: 3 to 7",
      "- Toy-safety certification (BIS): applied for, not yet granted. We show no mark until it is granted.",
      "- Modes: AI mode (home Wi‑Fi) · Story mode (no Wi‑Fi needed) · Bluetooth mode (a paired phone)",
      "- Consumer care: WhatsApp or call +91 91875 46483 · hello@kheelona.com",
      `- [Screen time](${ORIGIN}/stories#screen-time): How much, which rules hold up, and what to do when the screen goes off.`,
    ];
    expect(unsaid(clean.join("\n"), copy)).toEqual([]);
  });

  it("refuses a sentence no content module says, and a claim assembled from visible words", () => {
    const copy = visibleCopy("token");
    // Invented outright.
    expect(unsaid("- Kheelu has no moving parts", copy)).toEqual(["Kheelu has no moving parts"]);
    // A heading is framing only when FRAMING lists it; this one claims a certification Kheelu does not have.
    expect(unsaid("## Safety: certified by BIS and approved by paediatricians", copy)).toEqual([
      "Safety: certified by BIS and approved by paediatricians",
    ]);
    // "granted" is inside "not yet granted", "On" inside the wake-up button's sentence: neither is a whole unit.
    expect(unsaid("- Toy-safety certification (BIS): granted", copy)).toEqual(["Toy-safety certification (BIS)", "granted"]);
    expect(unsaid("- Microphone: On", copy)).toEqual(["On"]);
    // Two whole units, but not one record's: "None" is the camera's value, not the microphone's.
    expect(unsaid("- Microphone: None", copy)).toEqual(["Microphone: None"]);
    const swapped = `[Screen time](${ORIGIN}/stories#screen-time): What a young child is working on, and the toys and habits that serve it.`;
    expect(unsaid(`- ${swapped}`, copy)).toEqual([swapped]);
  });

  /* Task 4.5 item 6. Proof-gated content (D038: founder bios, recognition) is never rendered, on any environment, so
     it is not visible copy, and a machine file that says it says something no page shows. */
  it("leaves gated content out: no machine file may say what a proof gate hides (D038)", () => {
    const copy = visibleCopy("token", [
      {
        founders: [{ name: "A Founder", bio: { text: "Won a national prize for toys.", gated: { proof: "F11" } } }],
        recognition: [{ name: "A programme" }, { name: "A national award", gated: { proof: "F11" } }],
      },
    ]);
    expect(copy.units.has("A Founder")).toBe(true);
    expect(copy.units.has("A programme")).toBe(true);
    for (const hidden of ["Won a national prize for toys.", "A national award", "F11"]) expect(copy.units.has(hidden), hidden).toBe(false);
    expect(unsaid("- Won a national prize for toys.", copy)).toEqual(["Won a national prize for toys."]);
    expect(unsaid("- A national award", copy)).toEqual(["A national award"]);
  });

  /* Task 4.5 item 6. A placeholder (an unannounced fact) is left out of the machine files. Where it ends a line or
     stands between two sentences, the words around it are whole; in the middle of a sentence, leaving it out makes a
     sentence no page says ("Lasts on one charge."), so that string is no visible unit at all. */
  it("refuses a sentence mangled by leaving out a placeholder from its middle", () => {
    const copy = visibleCopy("token", [
      {
        battery: { term: "Battery", value: "Lasts {ph:F4 hours} on one charge." },
        size: { term: "Size", value: "{ph:F4 size} in all." },
      },
    ]);
    expect(copy.units.has("Lasts on one charge.")).toBe(false);
    expect(copy.units.has("in all.")).toBe(false);
    expect(unsaid("- Battery: Lasts on one charge.", copy)).not.toEqual([]);
    expect(unsaid("- Size: in all.", copy)).not.toEqual([]);
  });

  it("keeps the words around a placeholder that ends a line or stands between sentences", () => {
    const copy = visibleCopy("token", [
      {
        safety: { term: "Battery safety", value: "Battery safety: {ph:F4 battery safety certification}" },
        app: { term: "Parent app", value: "Every conversation, word for word. {ph:which phones the parent app runs on}" },
        repair: "Pickup is free. {ph:confirm the return trip is free} How long a repair takes depends on where you are.",
      },
    ]);
    expect(copy.units.has("Battery safety")).toBe(true);
    expect(copy.units.has("Every conversation, word for word.")).toBe(true);
    expect(copy.units.has("Pickup is free. How long a repair takes depends on where you are.")).toBe(true);
    expect(unsaid("- Parent app: Every conversation, word for word.", copy)).toEqual([]);
  });
});
