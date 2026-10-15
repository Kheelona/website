import { describe, expect, it } from "vitest";
import { llmsText } from "@/app/llms.txt/route";
import type { Copy, FaqItem, Offer, ProseBlock } from "@/content/types";
import { isModeVariant } from "@/lib/content/mode";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import {
  CLAIM_FIXES,
  type ClaimFixesSlug,
  COPY_FIXES,
  type CopyFixesSlug,
  editsBeforeClaimFixes,
  FAQ_FIXES,
  type FaqFixesSlug,
  AFTER_SIX_MONTHS,
  LANGUAGES_FAQ,
  NOT_RIGHT_QUESTION,
  PRODUCT_PRICE_ANSWER,
  RETURNS_QUESTION,
  SELLING_UPDATE,
  TEXT_DEVIATIONS,
  VISUAL_HIDDEN,
} from "../../../test/e2e/support/deviations";
import { readRepoFile } from "../../../test/e2e/support/repo";
import { findBanned } from "../../../test/guards/banned-phrases.data";
import { mockupFold } from "../../../test/support/mockup-compare";
import { factSentences, hiddenProblems, ruleReach, withFacts } from "../../../test/support/mockup-facts";
import { faqs, pickFaqs, type FaqId } from "./faqs";
import { films } from "./films";
import { product } from "./products/kheelu/product";

/* Every FAQ item of every page, once (architecture §6.1; task 2.1 acceptance 1): word for word as
 * the approved mockup prints it in token mode (architecture §6.3), the full-mode variants as the
 * copy pages word them (home.md fold 8, meet-kheelu.md fold 8, ai-toys-for-kids-in-india.md
 * questions, store.md fold 5), ids stable. The mockup is read with task 7.1b's copy fixes applied
 * (test/e2e/support/deviations.ts COPY_FIXES; deviations V18, V19): Home's age-3 sentence and refund
 * timing, /safety's age-3 lines and its pointer to the next question; then with task 8b.1's claim fixes
 * (CLAIM_FIXES; deviations V26-V31, D058): the age answers' mechanism in the live team's words, no
 * "or delete" in the first-week answer, and /safety's "Replies" line without the closed library; then with task 8c.4's
 * FAQ fixes (FAQ_FIXES; D061): Home's fourth question in the parent's words, and the product page's languages question;
 * and since task 8c.8 (the CMO's wave 8c review, m7, m8) the product page's sixth question in the same words as Home's,
 * and the languages answer's film name a link to that film's tile. */

const token = buildOffer("token");
const full = buildOffer("full");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const plain = (value: Copy, offer: Offer) => toPlainText(value, offer);

/** Each mockup page's FAQ, in its order. */
const PAGES: Readonly<Record<string, readonly FaqId[]>> = {
  home: ["think-less", "what-ages", "price-and-advance", "not-right-for-us", "when-arrive", "same-as-lumi"],
  "meet-kheelu": [
    "do-the-thinking",
    "talks-back",
    "right-for-a-three-year-old",
    "cost-and-advance",
    "returns-and-warranty",
    "after-the-first-week",
    "after-six-months",
    "languages",
    "speech",
  ],
  safety: ["age-three", "child-safety-groups"],
  "ai-toys-for-kids-in-india": ["what-is-an-ai-toy", "ai-toy-or-tablet", "ai-toy-age", "wifi", "how-much"],
  store: ["paying-today", "change-my-mind", "store-arrival", "how-to-pay"],
};

/** P15's default (open questions §P; applied by task 4.7, deviation V6): the shared answer to "What if it isn’t right
 *  for us, or stops working?" gives D033's remedy for a faulty Kheelu, a replacement or a full refund (Rule 7(4)), as
 *  /refund does, where the approved mockup said "we replace it" (meet-kheelu.html:357). The one sentence that differs. */
const P15 = {
  id: "returns-and-warranty",
  mockup: "Tell us within 7 days and we replace it.",
  build: "Tell us within 7 days for a replacement or a full refund.",
} as const;

/** A prose block as the visible text it renders. */
function blockText(block: ProseBlock, offer: Offer): string[] {
  switch (block.kind) {
    case "p":
      return [[block.lead, block.text].filter(Boolean).map((t) => plain(t!, offer)).join(" ")];
    case "list":
      return block.items.map((item) =>
        typeof item === "string" ? plain(item, offer) : [item.lead, item.text].filter(Boolean).map((t) => plain(t!, offer)).join(" "),
      );
    default:
      throw new Error(`FAQ detail block ${block.kind} has no rule in this test`);
  }
}

/** Words as the answer-length guard counts them: markers out, an amount is one word. */
const words = (text: string) => text.replace(/\[\d+\]/g, " ").split(/\s+/).filter((w) => /[\p{L}\p{N}₹]/u.test(w)).length;

describe("ids", () => {
  it("are each item's own stable kebab-case id", () => {
    for (const [key, item] of Object.entries(faqs)) {
      expect(item.id).toBe(key);
      expect(key).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("cover every page's FAQ, each item on exactly one page", () => {
    const listed = Object.values(PAGES).flat();
    expect(new Set(listed).size).toBe(listed.length);
    expect([...listed].sort()).toEqual(Object.keys(faqs).sort());
  });

  it("are picked in the order a page lists them", () => {
    expect(pickFaqs(["wifi", "how-much"]).map((f) => f.id)).toEqual(["wifi", "how-much"]);
  });
});

/** A page's approved FAQ items: its mockup's <main> with that page's copy fixes of task 7.1b, then its claim fixes of
 *  task 8b.1, then its FAQ fixes of task 8c.4, then the selling update's questions (task Q2.10, the product page), if any,
 *  applied. */
function approvedItems(slug: string): Element[] {
  const main = new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html").querySelector("main")!;
  const fixes = Object.hasOwn(COPY_FIXES, slug) ? COPY_FIXES[slug as CopyFixesSlug].edits : [];
  // The claim fixes start from the page as its earlier rules left it, so they apply in a pass of their own; only those
  // inside the questions (the rest need the page facts, which no FAQ reads). The FAQ fixes start from the page as the
  // claim fixes leave it (the first-week answer without "or delete"), so they take a pass of their own too.
  const claims = Object.hasOwn(CLAIM_FIXES, slug) ? CLAIM_FIXES[slug as ClaimFixesSlug].edits.filter((e) => /faq|^li$/.test(e.at)) : [];
  const later = Object.hasOwn(FAQ_FIXES, slug) ? FAQ_FIXES[slug as FaqFixesSlug].edits : [];
  // The selling update's questions (task Q2.10) start from the page as the FAQ fixes leave it (the languages question
  // after the first-week one); only its edits inside the questions.
  const selling = Object.hasOwn(SELLING_UPDATE, slug) ? SELLING_UPDATE[slug as keyof typeof SELLING_UPDATE].edits.filter((e) => /faq/.test(e.at)) : [];
  return Array.from(withFacts(withFacts(withFacts(withFacts(main, fixes), claims), later), selling).querySelectorAll(".kh-faq__item"));
}

describe.each(Object.entries(PAGES))("mockup %s, token mode, word for word", (slug, ids) => {
  const items = approvedItems(slug);

  it("has the same number of questions", () => {
    expect(items.length).toBe(ids.length);
  });

  it.each(ids.map((id, i) => [id, i] as const))("%s", (id, i) => {
    const item: FaqItem = faqs[id];
    const shown = items[i];
    expect(plain(item.question, token)).toBe(norm(shown.querySelector(".kh-faq__q span")?.textContent));
    const paragraphs = Array.from(shown.querySelectorAll(".kh-faq__a > p, .kh-faq__a > ul > li")).map((el) => norm(el.textContent));
    const rendered = [plain(item.answer, token), ...(item.detail ?? []).flatMap((b) => blockText(b, token))];
    if (id === P15.id) {
      // The approved answer, with P15's one sentence (the replacement is never vacuous: the mockup has the old line).
      expect(paragraphs[0]).toContain(P15.mockup);
      expect(rendered).toEqual([paragraphs[0].replace(P15.mockup, P15.build), ...paragraphs.slice(1)]);
      return;
    }
    expect(rendered).toEqual(paragraphs);
  });
});

describe("P15: the shared answer gives D033's remedy for a faulty Kheelu (deviation V6)", () => {
  const answer = () => plain(faqs[P15.id].answer, token);

  it("says “a replacement or a full refund”, as /refund does, and no longer “we replace it”", () => {
    expect(answer()).toContain(`Arrived faulty? ${P15.build}`);
    expect(answer()).not.toContain(P15.mockup);
  });

  it("changes only that sentence: every other word is the approved mockup's", () => {
    // The mockup's item by its approved question (task 8c.8 rewords the question, RETURNS_QUESTION; the answer stays).
    const doc = new DOMParser().parseFromString(readRepoFile("mockup/meet-kheelu.html"), "text/html");
    const item = Array.from(doc.querySelectorAll(".kh-faq__item")).find((el) => norm(el.querySelector(".kh-faq__q span")?.textContent) === RETURNS_QUESTION.mockup);
    expect(item).toBeDefined();
    expect(answer()).toBe(norm(item?.querySelector(".kh-faq__a > p")?.textContent).replace(P15.mockup, P15.build));
  });

  it("stays within 60 words in both modes (answer-length)", () => {
    expect(words(answer())).toBe(60);
    expect(words(plain(faqs[P15.id].answer, full))).toBe(60);
  });
});

describe("task 7.1b's copy fixes in the shared answers (deviations V18, V19)", () => {
  it("advise a grown-up nearby at 3 in the site's one wording, never “we advise” or “while they play”, on Home and /safety", () => {
    expect(plain(faqs["what-ages"].answer, token)).toContain(" It is not a toy for children under 3. If your child is 3, keep a grown-up nearby. ");
    expect(plain(faqs["age-three"].answer, token)).toContain(" and it is not a toy for children under 3. If your child is 3, keep a grown-up nearby. ");
    const detail = faqs["child-safety-groups"].detail.flatMap((b) => blockText(b, token));
    expect(detail.at(-1)).toBe("At 3: keep a grown-up nearby.");
    for (const id of ["what-ages", "age-three"] as const) expect(plain(faqs[id].answer, token), id).not.toMatch(/we advise|while they play/);
  });

  it("keep /safety's open answer at the copy page's 50 words with the one wording (CMO copy review 7.1b, minor 1)", () => {
    expect(words(plain(faqs["age-three"].answer, token))).toBe(50);
  });

  it("say the refund reaches you within 7 working days of the return reaching us, as /refund does (D056 item 4)", () => {
    expect(plain(faqs["not-right-for-us"].answer, token)).toContain("Once it reaches us and qualifies for return, your refund reaches you within 7 working days.");
  });

  it("point /safety's open answer to the next question, where the answer is (CMO A M4)", () => {
    expect(plain(faqs["age-three"].answer, token)).toMatch(/Its advice in full, and our answer, are in the next question\.$/);
  });
});

/* Task 8b.1 (D058; the live team's code check of 12 October): the answers follow the code check. The approved mockups keep
   the withdrawn lines; the claim fixes above (CLAIM_FIXES) turn them into these, and the copy pages count the words. */
describe("task 8b.1's claim fixes in the shared answers (D058; deviations V26-V31)", () => {
  const all = () =>
    (Object.values(faqs) as FaqItem[]).flatMap((f) => [plain(f.answer, token), plain(f.answer, full), ...(f.detail ?? []).flatMap((b) => blockText(b, token))]);

  it("say none of the claims D058 withdraws: one-tap delete, the closed library, the age-graded layer", () => {
    expect(all().filter((t) => /one tap|closed (?:content )?library|curated|age-graded|safety layer|read or delete|servers in India/.test(t))).toEqual([]);
  });

  it("give the age answers' mechanism in the live team's words, at the copy pages' word counts", () => {
    const mechanism = "At setup, you enter your child’s age in the parent app. You can change it later. The AI model gets child-safety rules for that age, with Google’s safety filters on top.";
    for (const [id, n] of [["what-ages", 58], ["right-for-a-three-year-old", 59]] as const) {
      expect(plain(faqs[id].answer, token).endsWith(`If your child is 3, keep a grown-up nearby. ${mechanism}`), id).toBe(true);
      expect(words(plain(faqs[id].answer, token)), id).toBe(n);
    }
    expect(plain(faqs["ai-toy-age"].answer, token)).toContain(
      "You enter your child’s age in the parent app, and Kheelu’s AI is given child-safety rules and that age on every conversation.",
    );
    expect(words(plain(faqs["ai-toy-age"].answer, token))).toBe(59);
  });

  it("read the first-week answer without “or delete” (42 words) and /safety's “Replies” line in the live words", () => {
    expect(plain(faqs["after-the-first-week"].answer, token)).toMatch(/ You can read any conversation in the parent app\.$/);
    expect(words(plain(faqs["after-the-first-week"].answer, token))).toBe(42);
    const replies = faqs["child-safety-groups"].detail.flatMap((b) => blockText(b, token)).find((line) => line.startsWith("Replies:"));
    expect(replies).toBe(
      "Replies: its answers are generated by an AI model that is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top. It can’t browse or search the web. When it doesn’t know something, it says so. Before launch, we test it by trying to make it say things it shouldn’t. You can read every conversation.",
    );
  });
});

/* Task 8c.4 (D061; the CMO's review of the advisor's proposal, AP-30): Home's fourth question in the parent's own words,
   its answer unchanged; and the product page answers "Which languages does Kheelu speak?", which no question on Home or
   the product page answered, from facts.md's languages row: the named languages and the ceiling read from product.ts,
   switching mid-sentence as D017 approved it, in AI mode as film 6's caption says. Both depart from the frozen mockups
   (D046), so each is a deviation the founder signs at Gate B (D015): test/e2e/support/deviations.ts FAQ_FIXES. */
describe("task 8c.4: the FAQ wording and the languages answer (D061)", () => {
  const answer = () => plain(faqs.languages.answer, token);
  const names = product.languages.map((l) => l.name);
  const filmSix = films.find((f) => f.id === "a-story-in-two-languages")!;

  it("asks Home's fourth question in the parent's words (AP-30), in both offer modes", () => {
    expect(NOT_RIGHT_QUESTION).toEqual({ mockup: "What if it isn’t right for us?", build: "What if my child doesn’t like it?" });
    expect(plain(faqs["not-right-for-us"].question, token)).toBe(NOT_RIGHT_QUESTION.build);
    expect(plain(faqs["not-right-for-us"].question, full)).toBe(NOT_RIGHT_QUESTION.build);
  });

  it("is the question llms.txt asks, with the same answer, in both offer modes (the machine file restates the page)", () => {
    for (const offer of [token, full]) {
      const body = llmsText(offer);
      expect(body).toContain(`\n### ${NOT_RIGHT_QUESTION.build}\n\n${plain(faqs["not-right-for-us"].answer, offer)}\n`);
      expect(body).not.toContain(NOT_RIGHT_QUESTION.mockup);
    }
  });

  it("keeps that question's answer word for word: the approved one, with V18's refund timing", () => {
    expect(plain(faqs["not-right-for-us"].answer, token)).toBe(
      "Return it within 7 days of delivery, no questions asked. Opened is fine: just send back everything that came in the box, undamaged. We arrange the pickup, free. Once it reaches us and qualifies for return, your refund reaches you within 7 working days. Until we dispatch it, everything you’ve paid is refundable in full.",
    );
  });

  it("answers which languages Kheelu speaks in the words FAQ_FIXES pins, the same in both offer modes", () => {
    expect(plain(faqs.languages.question, token)).toBe("Which languages does Kheelu speak?");
    expect(plain(faqs.languages.question, token)).toBe(LANGUAGES_FAQ.question);
    expect(answer()).toBe(LANGUAGES_FAQ.answer);
    expect(plain(faqs.languages.answer, full)).toBe(answer());
  });

  it("names every announced language and the ceiling as product.ts holds them, in their order", () => {
    expect(answer()).toContain(`up to ${product.languageCeiling} languages at launch, including ${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}.`);
    expect(names).toHaveLength(8);
  });

  it("types no language name and no ceiling in faqs.ts: they render from the languages source", () => {
    const source = readRepoFile("src/content/en-IN/faqs.ts");
    for (const name of names) expect(source, name).not.toMatch(new RegExp(`\\b${name}\\b`));
    expect(source).not.toMatch(/\bup to (?:10|ten)\b/i);
    expect(source).not.toContain(filmSix.chip);
  });

  it("says only facts.md's languages row: switching mid-sentence (D017), in AI mode as film 6's caption says, with that film named", () => {
    expect(filmSix.caption).toBe("In AI mode, Arha switches to English, and Kheelu switches with her.");
    expect(answer()).toContain("In AI mode, it can switch between them mid-sentence: when your child changes language, Kheelu changes with them.");
    expect(answer()).toMatch(new RegExp(`You can watch it happen in the film “${filmSix.chip}”\\.$`));
    // No language the facts do not name (D058 item 7: not Marathi, not Punjabi), and no count but the ceiling.
    expect(answer()).not.toMatch(/Marathi|Punjabi|Gujarati|Malayalam|\b(?:eight|8|seven|7) (?:Indian )?languages\b/i);
  });

  it("is an answer-first block of 40-60 words that the banned-phrases guard passes", () => {
    expect(words(answer())).toBeGreaterThanOrEqual(40);
    expect(words(answer())).toBeLessThanOrEqual(60);
    expect(findBanned(`${plain(faqs.languages.question, token)}\n${answer()}`)).toEqual([]);
    expect(findBanned(plain(faqs["not-right-for-us"].question, token))).toEqual([]);
  });
});

/* Task 8c.8 (the CMO's review of wave 8c on the beta, m7 and m8; the main session's rulings, 2026-10-15): the product page
   asked "What if it isn’t right for us, or stops working?" while Home asks the parent's own fear (V41), so the two selling
   pages disagreed: the product page's question takes Home's words and keeps its second half, the answer unchanged; it
   renders on the page, in the FAQPage JSON-LD and in /llms.txt from this one item. And the languages answer named a film
   about 12,000 px above it that the reader could not reach from the answer: the film's name is now an in-page link to that
   film's tile in the strip (the tile carries the film's id), which the strip's island plays as a quote's "Watch the film"
   plays it; the words, and so the JSON-LD and /llms.txt, are unchanged. */
describe("task 8c.8: the product page's sixth question and the languages answer's film (CMO wave 8c m7, m8)", () => {
  const filmSix = films.find((f) => f.id === "a-story-in-two-languages")!;

  it("asks Home's question with the product page's second half, the answer unchanged, in both offer modes", () => {
    expect(RETURNS_QUESTION).toEqual({
      mockup: "What if it isn’t right for us, or stops working?",
      build: "What if my child doesn’t like it, or it stops working?",
    });
    expect(plain(faqs["returns-and-warranty"].question, token)).toBe(RETURNS_QUESTION.build);
    expect(plain(faqs["returns-and-warranty"].question, full)).toBe(RETURNS_QUESTION.build);
    expect(RETURNS_QUESTION.build.startsWith(NOT_RIGHT_QUESTION.build.replace(/\?$/, ","))).toBe(true);
  });

  it("is the question /llms.txt asks, with the same answer, never the old one", () => {
    for (const offer of [token, full]) {
      const body = llmsText(offer);
      expect(body).toContain(`\n### ${RETURNS_QUESTION.build}\n\n${plain(faqs["returns-and-warranty"].answer, offer)}\n`);
      expect(body).not.toContain(RETURNS_QUESTION.mockup);
    }
  });

  it("links the film's name in the languages answer to that film's tile, the words unchanged", () => {
    expect(faqs.languages.answer).toContain(`[“${filmSix.chip}”](#${filmSix.id})`);
    expect(LANGUAGES_FAQ.film).toEqual({ name: `“${filmSix.chip}”`, href: `#${filmSix.id}` });
    expect(plain(faqs.languages.answer, token)).toBe(LANGUAGES_FAQ.answer);
    expect(llmsText(token)).toContain(`\n${LANGUAGES_FAQ.answer}\n`);
  });
});

describe.each(Object.keys(FAQ_FIXES) as FaqFixesSlug[])("%s: task 8c.4's FAQ fixes (D061) as a parity deviation", (slug) => {
  const fixes = FAQ_FIXES[slug];
  /* The mockup as the page's earlier rules leave it: its page facts and copy fixes, then task 8b.1's claim fixes. */
  const base = withFacts(withFacts(mockupFold(slug, "main"), editsBeforeClaimFixes(slug)), CLAIM_FIXES[slug].edits);
  const once = (lines: readonly string[]) => [...new Set(lines)];

  it("lists exactly the sentences the edits change, against the mockup with the page's earlier rules applied", () => {
    expect(factSentences(base, fixes.edits)).toEqual({ missing: [...fixes.mockup], extra: [...fixes.build] });
    expect(fixes.build.length).toBeGreaterThan(0);
  });

  it("is one rule of the page, after task 8b.1's claim fixes, which excuses and accepts exactly those sentences and no other line", () => {
    const rules = TEXT_DEVIATIONS[slug] ?? [];
    const mine = rules.filter((r) => r.approvedBy === fixes.approvedBy);
    expect(mine).toHaveLength(1);
    expect(rules.indexOf(mine[0])).toBeGreaterThan(rules.findIndex((r) => r.approvedBy === CLAIM_FIXES[slug].approvedBy));
    expect(ruleReach(base, fixes.edits, mine[0])).toEqual({ excused: once(fixes.mockup), accepted: once(fixes.build) });
    expect(mine[0].jsOff).toBeUndefined();
  });

  it("hides for the pixels the blocks it lists, in VISUAL_HIDDEN in its order, each found once on its side and holding a sentence its edits change", () => {
    expect(hiddenProblems(base, fixes)).toEqual([]);
    const rules = (VISUAL_HIDDEN[slug] ?? []).filter((r) => r.approvedBy === fixes.approvedBy);
    const sel = (side: string) => rules.filter((r) => r.side === side).map((r) => r.selector);
    expect(sel("mockup")).toEqual([...fixes.hidden.both, ...fixes.hidden.mockup]);
    expect(sel("build")).toEqual([...fixes.hidden.both, ...fixes.hidden.build]);
  });

  /* D061 lists the FAQ wording among the main session's rulings, each signed as a deviation row for the founder's
   * information; the founder signs the rows at Gate B (D015). The row numbers are the main session's to assign. */
  it("names its deviations.md row, the main session's D061 ruling (AP-30), the founder's Gate B signature and this task", () => {
    expect(fixes.approvedBy).toMatch(
      /^deviations\.md V\d+ \(the main session's D061 ruling \(AP-30\), for the founder's signature at Gate B \(D015\), 2026-10-15; .*task 8c\.4(?:; amended by task 8c\.8 \(CMO wave 8c review m\d+(?:, m\d+)*\))?\)$/,
    );
  });
});

/* Task Q2.10 (the selling update on the product page; the D2C plan v2 §3 fold 11, the CMO's M5; D065 items 3, 4 and 6):
   the price question's answer leads with the total and says no "incl. GST", no balance amount, no first 500 and no
   invoice (GST and the breakdown only at checkout); "When does delivery start?" leaves the page (the offer card and the
   trust line carry the date) and faqs.ts; and the page asks "Will Kheelona+ charge me after the 6 months?", in the
   founder's words for G30, after the first-week question. The words are the plan's, exactly (SELLING_UPDATE holds the
   same literals for the text pass). */
describe("task Q2.10: the product page's price answer and the Kheelona+ question (the D2C plan v2 §3 fold 11)", () => {
  it("answers the price question with the total, the advance and when the rest is due, in the plan's words", () => {
    expect(plain(faqs["cost-and-advance"].question, token)).toBe("What does Kheelu cost, and what is the advance for?");
    expect(plain(faqs["cost-and-advance"].answer, token)).toBe(PRODUCT_PRICE_ANSWER.build);
    expect(PRODUCT_PRICE_ANSWER.build).toBe(
      "Kheelu is ₹4,999 in total, with delivery anywhere in India included. The ₹499 is a refundable advance that reserves yours; the rest is due before delivery. Pay by UPI, card or net banking, with no payment fees.",
    );
  });

  it("says no GST, no balance amount, no first 500 and no invoice in either mode, and leads with the total (D028)", () => {
    for (const offer of [token, full]) {
      const answer = plain(faqs["cost-and-advance"].answer, offer);
      expect(answer).not.toMatch(/GST|invoice|first 500|₹4,500|remaining/);
      expect(answer.match(/₹[\d,]+/)?.[0]).toBe(offer.prices.headline);
    }
    expect(faqs["cost-and-advance"].answer.token).not.toContain("{price:balance}");
  });

  it("asks whether Kheelona+ charges after the 6 months, answered in the founder's words, the same in both modes", () => {
    expect(faqs["after-six-months"].id).toBe("after-six-months");
    expect(plain(faqs["after-six-months"].question, token)).toBe(AFTER_SIX_MONTHS.question);
    expect(plain(faqs["after-six-months"].answer, token)).toBe(AFTER_SIX_MONTHS.answer);
    expect(plain(faqs["after-six-months"].answer, full)).toBe(AFTER_SIX_MONTHS.answer);
    expect(AFTER_SIX_MONTHS.answer.endsWith("Nothing renews without you.")).toBe(true);
  });

  it("drops \"When does delivery start?\": no page lists it, so faqs.ts holds it no more", () => {
    expect(Object.keys(faqs)).not.toContain("delivery-start");
  });

  it("passes the claims guard on the new words", () => {
    for (const offer of [token, full]) {
      for (const id of ["cost-and-advance", "after-six-months"] as const) {
        expect(findBanned(`${plain(faqs[id].question, offer)}\n${plain(faqs[id].answer, offer)}`), id).toEqual([]);
      }
    }
  });
});

describe("full mode (copy pages)", () => {
  const homeFull =
    "Kheelu is ₹7,999 (incl. GST), paid in full when you order, with delivery anywhere in India included. You can pay by UPI, card or net banking, and you get a GST invoice. Deliveries start mid-November. If it isn’t right for your family, you can return it within 7 days of delivery, no questions asked.";

  it("Home's price question becomes home.md's full-mode answer", () => {
    expect(plain(faqs["price-and-advance"].question, full)).toBe("How much is Kheelu?");
    expect(plain(faqs["price-and-advance"].answer, full)).toBe(homeFull);
  });

  it("the product page's price question becomes meet-kheelu.md's full-mode answer", () => {
    expect(plain(faqs["cost-and-advance"].question, full)).toBe("What does Kheelu cost?");
    // The D2C plan v2 §3 fold 11 (task Q2.10; D065 items 3-4): the total, no GST and no invoice line on a selling page.
    expect(plain(faqs["cost-and-advance"].answer, full)).toBe(
      "Kheelu is ₹7,999 in total, paid in full when you order, with delivery anywhere in India included. Pay by UPI, card or net banking, with no payment fees. Deliveries start mid-November.",
    );
  });

  it("the guide's price question becomes Home's full-mode answer", () => {
    expect(plain(faqs["how-much"].question, full)).toBe("How much is Kheelu?");
    expect(plain(faqs["how-much"].answer, full)).toBe(homeFull);
  });

  it("the store's first answer pays the whole price; its delivery answer drops the balance sentence", () => {
    expect(plain(faqs["paying-today"].answer, full)).toBe(
      "The whole price: ₹7,999 (incl. GST), with delivery anywhere in India included. There is nothing more to pay before dispatch: no balance link, and nothing charged automatically. Until we dispatch your Kheelu, all of it is refundable.",
    );
    expect(plain(faqs["store-arrival"].answer, full)).toBe(
      plain(faqs["store-arrival"].answer, token).replace(" A reserved Kheelu is dispatched once the balance is paid.", ""),
    );
  });

  it("changes only the five price-bearing items; every other item reads the same in both modes", () => {
    const variant = Object.values(faqs)
      .filter((f) => isModeVariant(f.question) || isModeVariant(f.answer))
      .map((f) => f.id)
      .sort();
    expect(variant).toEqual(["cost-and-advance", "how-much", "paying-today", "price-and-advance", "store-arrival"]);
  });

  it("never mentions the advance, the balance or the cap in a full-mode answer", () => {
    for (const id of ["cost-and-advance", "how-much", "paying-today", "price-and-advance", "store-arrival"] as const) {
      const text = plain(faqs[id].answer, full);
      expect(text, id).not.toMatch(/₹499|₹4,500|advance|first 500|reserve/);
    }
  });
});

describe("answer lengths (architecture §9.5; the answer-length guard skips mode variants)", () => {
  it("keeps every token-mode answer at 40-60 words", () => {
    const out = Object.values(faqs)
      .map((f) => [f.id, words(plain(f.answer, token))] as const)
      .filter(([, n]) => n < 40 || n > 60);
    expect(out).toEqual([]);
  });

  it("keeps every full-mode answer at 40-60 words, apart from the store's approved 37-word answer", () => {
    const out = Object.values(faqs)
      .map((f) => [f.id, words(plain(f.answer, full))] as const)
      .filter(([, n]) => n < 40 || n > 60);
    /* store.md fold 5, "Full mode": "What am I paying today?" is approved at 37 words (the store's
       answers are "each under 60 words"; the store is noindex, so no FAQPage reads it). */
    expect(out).toEqual([["paying-today", 37]]);
  });
});

describe("money", () => {
  it("never types a rupee amount: every amount is a {price:…} token", () => {
    expect(JSON.stringify(faqs)).not.toContain("₹");
  });
});
