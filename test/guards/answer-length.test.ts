import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MOCKUP_SLUGS } from "../e2e/support/mockup-text";
import { ROOT, isTestOrStory, listFiles, readRepoFile } from "../e2e/support/repo";

/* answer-length (task 1.1; architecture §9.5, brief §9.3).
 *
 * Answer-first blocks: a question, then a 40-60 word answer, then any detail. The rule applies to
 * the first paragraph of every answer in the content model: FAQ items, AnswerSection and the
 * answer block of HeroSection's `answer` variant (any object with a `question` and an `answer`).
 * Counting follows the copy pages: source markers excluded, hyphenated words count as one, an
 * amount token counts as one word. The rule is proven against approved copy on every run: every
 * FAQ answer and answer card of the 18 mockup pages is 40-60 words.
 */

const MIN = 40;
const MAX = 60;

/** Words of one content string, rich-text tokens resolved the way they render (architecture §6.2). */
function countWords(text: string): number {
  const plain = text
    .replace(/\[\^\d+\]|[¹²³⁴⁵⁶⁷⁸⁹⁰]+|\[\d+\]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\{(?:hand|mark|nowrap):([^}]*)\}/g, "$1")
    .replace(/\{price:[a-z]+\}/g, "₹0")
    .replace(/\{delivery\}/g, "Deliveries start mid-November")
    .replace(/\{ph:[^}]*\}/g, "[PLACEHOLDER]");
  return plain.split(/\s+/).filter((w) => /[\p{L}\p{N}₹]/u.test(w)).length;
}

function firstParagraph(answer: unknown): string | null {
  if (typeof answer === "string") return answer.split(/\n\s*\n/)[0];
  if (Array.isArray(answer)) {
    const first = answer[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && typeof (first as { text?: unknown }).text === "string") {
      return (first as { text: string }).text;
    }
  }
  return null;
}

type Found = { where: string; question: string; words: number };

function answersIn(value: unknown, where: string, out: Found[], seen = new Set<unknown>()): Found[] {
  if (!value || typeof value !== "object" || seen.has(value)) return out;
  seen.add(value);
  const o = value as Record<string, unknown>;
  if (typeof o.question === "string" && "answer" in o) {
    const p = firstParagraph(o.answer);
    if (p !== null) out.push({ where, question: o.question, words: countWords(p) });
  }
  for (const [k, v] of Object.entries(o)) answersIn(v, `${where}.${k}`, out, seen);
  return out;
}

const outOfRange = (found: Found[]) =>
  found.filter((f) => f.words < MIN || f.words > MAX).map((f) => `${f.where} "${f.question}": ${f.words} words`);

/** The runtime content modules: .ts files under src/content, never a test, a type test
 *  (`*.test-d.ts`, compile-time fixtures such as `{ question: "q", answer: "a" }`), a story, or
 *  the shared types file. */
function contentModules(paths: string[]): string[] {
  return paths.filter((p) => p.endsWith(".ts") && !isTestOrStory(p) && !p.endsWith("/types.ts"));
}

describe("content module discovery", () => {
  it("reads content modules only, never tests, type tests, stories or the types file", () => {
    const tree = [
      "src/content/types.ts",
      "src/content/types.test-d.ts",
      "src/content/en-IN/faqs.ts",
      "src/content/en-IN/faqs.test.ts",
      "src/content/en-IN/pages/home.ts",
      "src/content/en-IN/Thing.stories.tsx",
    ];
    expect(contentModules(tree)).toEqual(["src/content/en-IN/faqs.ts", "src/content/en-IN/pages/home.ts"]);
  });
});

describe("answer-length rule", () => {
  const words = (n: number) => Array.from({ length: n }, (_, i) => `word${i}`).join(" ");
  it("is red below 40 and above 60 words, green inside", () => {
    expect(outOfRange(answersIn({ faq: { question: "Q?", answer: words(39) } }, "x", []))).toHaveLength(1);
    expect(outOfRange(answersIn({ faq: { question: "Q?", answer: words(61) } }, "x", []))).toHaveLength(1);
    expect(outOfRange(answersIn({ faq: { question: "Q?", answer: words(50) } }, "x", []))).toEqual([]);
  });
  it("counts the first paragraph only, without markers, with tokens resolved", () => {
    expect(countWords("It is {price:headline} (incl. GST).[^1] Read [the terms](/terms).")).toBe(8);
    expect(outOfRange(answersIn({ q: { question: "Q?", answer: `${words(50)}\n\n${words(80)}` } }, "x", []))).toEqual([]);
    expect(countWords("A back-and-forth talk¹ helps.")).toBe(4);
  });
});

describe("answer-length holds on the approved mockup (the rule never contradicts approved copy)", () => {
  it("finds the approved answers (control: the instrument records)", () => {
    let faqs = 0;
    let cards = 0;
    for (const slug of MOCKUP_SLUGS) {
      const doc = new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
      faqs += doc.querySelectorAll(".kh-faq__a").length;
      cards += doc.querySelectorAll(".mk-answer, .mk-team-answer").length;
    }
    expect(faqs).toBeGreaterThanOrEqual(25);
    expect(cards).toBe(4);
  });

  it.each(MOCKUP_SLUGS)("%s", (slug) => {
    const doc = new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
    const found: Found[] = [];
    for (const a of Array.from(doc.querySelectorAll(".kh-faq__a"))) {
      const q = a.closest("details")?.querySelector("summary")?.textContent?.trim() ?? "?";
      const p = a.querySelector("p") ?? a;
      found.push({ where: slug, question: q, words: countWords(p.textContent ?? "") });
    }
    for (const card of Array.from(doc.querySelectorAll(".mk-answer, .mk-team-answer"))) {
      const q = card.querySelector("h2, h3")?.textContent?.trim() ?? card.previousElementSibling?.textContent?.trim() ?? "?";
      const p = card.matches("p") ? card : card.querySelector("p");
      if (p) found.push({ where: slug, question: q, words: countWords(p.textContent ?? "") });
    }
    expect(outOfRange(found)).toEqual([]);
  });
});

describe("answer-length: src/content", () => {
  it("keeps every answer-first block at 40-60 words", async () => {
    const modules = contentModules(listFiles(["src/content"]));
    const found: Found[] = [];
    for (const path of modules) {
      const mod = (await import(/* @vite-ignore */ join(ROOT, path))) as Record<string, unknown>;
      for (const [name, value] of Object.entries(mod)) answersIn(value, `${path}:${name}`, found);
    }
    if (existsSync(join(ROOT, "src/content/en-IN/faqs.ts"))) {
      expect(
        found.some((f) => f.where.startsWith("src/content/en-IN/faqs.ts")),
        "faqs.ts exists but no { question, answer } item was found in it: point this guard at the content shape",
      ).toBe(true);
    }
    console.log(`[answer-length] ${modules.length} content module(s), ${found.length} answer-first block(s).`);
    expect(outOfRange(found)).toEqual([]);
  });
});
