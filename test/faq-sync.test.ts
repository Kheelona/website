import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { QA, HOME_FAQ, PRODUCT_FAQ, FAQ_GROUPS } from "@/lib/faq";

/**
 * One question, one answer, everywhere (founder, 2026-10-04: "all pages are
 * not in sync"). Home, /products/kheelu, /faq and /safety used to keep their
 * own copies of the same questions, and the copies had drifted: cost, refund,
 * ship date, internet, languages, ages and "what if it breaks" all differed
 * by page. lib/faq.ts now answers each shared question once.
 *
 * The guard catches the two ways drift comes back: the same question with a
 * different answer, and the same question REWORDED ("When will Kheelu ship?"
 * beside "When does Kheelu ship?") so an exact-match check would miss it.
 */
const ROOT = process.cwd();
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

const LISTS = {
  home: HOME_FAQ,
  product: PRODUCT_FAQ,
  faqPage: FAQ_GROUPS.flatMap((g) => g.items),
};

/** "When will Kheelu ship?" and "When does it ship?" reduce to the same key. */
const key = (q: string) =>
  q
    .toLowerCase()
    .replace(/[^a-z0-9₹ ]/g, "")
    .replace(/\b(kheelu|it|does|will|do|is|the|a|an|my|our|your|to|work)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

describe("every question the site asks twice has one answer", () => {
  const all = Object.entries(LISTS).flatMap(([page, items]) => items.map((e) => ({ page, ...e })));

  it("reads all three lists", () => {
    expect(all.length).toBeGreaterThan(30);
  });

  it("never answers the same question two ways", () => {
    const byQ = new Map<string, Set<string>>();
    for (const e of all) byQ.set(e.q, (byQ.get(e.q) ?? new Set()).add(e.a));
    const split = [...byQ].filter(([, answers]) => answers.size > 1).map(([q]) => q);
    expect(split).toEqual([]);
  });

  it("never rewords a shared question on another page", () => {
    const byKey = new Map<string, Set<string>>();
    for (const e of all) byKey.set(key(e.q), (byKey.get(key(e.q)) ?? new Set()).add(e.q));
    const reworded = [...byKey].filter(([, qs]) => qs.size > 1).map(([, qs]) => [...qs].join(" | "));
    expect(reworded).toEqual([]);
  });

  it("the key collapses rewordings (proves the guard can fail)", () => {
    expect(key("When will Kheelu ship?")).toBe(key("When does Kheelu ship?"));
    expect(key("Does Kheelu need the internet?")).toBe(key("Does it need the internet to work?"));
  });

  it("each page's shared questions ARE the QA entries, not copies", () => {
    const shared = new Set<object>(Object.values(QA));
    for (const items of Object.values(LISTS)) {
      for (const e of items) {
        const twin = Object.values(QA).find((s) => s.q === e.q);
        if (twin) expect(shared.has(e)).toBe(true);
      }
    }
  });
});

describe("each page reads the shared lists", () => {
  it.each([
    ["src/app/(site)/page.tsx", "HOME_FAQ"],
    ["src/app/(site)/products/kheelu/page.tsx", "PRODUCT_FAQ"],
    ["src/app/(site)/faq/page.tsx", "FAQ_GROUPS"],
    ["src/app/(site)/safety/page.tsx", "QA"],
  ])("%s imports %s from lib/faq", (file, name) => {
    expect(read(file)).toMatch(new RegExp(`import \\{[^}]*\\b${name}\\b[^}]*\\} from "@/lib/faq"`));
  });

  it("/safety's listening, voice and open-internet answers are the shared ones", () => {
    const src = read("src/app/(site)/safety/page.tsx");
    expect(src).toMatch(/listening: QA\.alwaysListening/);
    expect(src).toMatch(/voice: QA\.voice/);
    expect(src).toMatch(/QA\.openInternet/);
  });
});
