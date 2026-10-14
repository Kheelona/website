import { describe, expect, it } from "vitest";
import type { Copy, FaqItem, Offer, ProseBlock } from "@/content/types";
import { isModeVariant } from "@/lib/content/mode";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { COPY_FIXES, type CopyFixesSlug } from "../../../test/e2e/support/deviations";
import { readRepoFile } from "../../../test/e2e/support/repo";
import { withFacts } from "../../../test/support/mockup-facts";
import { faqs, pickFaqs, type FaqId } from "./faqs";

/* Every FAQ item of every page, once (architecture §6.1; task 2.1 acceptance 1): word for word as
 * the approved mockup prints it in token mode (architecture §6.3), the full-mode variants as the
 * copy pages word them (home.md fold 8, meet-kheelu.md fold 8, ai-toys-for-kids-in-india.md
 * questions, store.md fold 5), ids stable. The mockup is read with task 7.1b's copy fixes applied
 * (test/e2e/support/deviations.ts COPY_FIXES; deviations V18, V19): Home's age-3 sentence and refund
 * timing, /safety's age-3 lines and its pointer to the next question. */

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
    "delivery-start",
    "returns-and-warranty",
    "after-the-first-week",
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

/** A page's approved FAQ items: its mockup's <main> with that page's copy fixes of task 7.1b, if any, applied. */
function approvedItems(slug: string): Element[] {
  const main = new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html").querySelector("main")!;
  const fixes = Object.hasOwn(COPY_FIXES, slug) ? COPY_FIXES[slug as CopyFixesSlug].edits : [];
  return Array.from(withFacts(main, fixes).querySelectorAll(".kh-faq__item"));
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
    const doc = new DOMParser().parseFromString(readRepoFile("mockup/meet-kheelu.html"), "text/html");
    const item = Array.from(doc.querySelectorAll(".kh-faq__item")).find((el) => norm(el.querySelector(".kh-faq__q span")?.textContent) === plain(faqs[P15.id].question, token));
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

describe("full mode (copy pages)", () => {
  const homeFull =
    "Kheelu is ₹7,999 (incl. GST), paid in full when you order, with delivery anywhere in India included. You can pay by UPI, card or net banking, and you get a GST invoice. Deliveries start mid-November. If it isn’t right for your family, you can return it within 7 days of delivery, no questions asked.";

  it("Home's price question becomes home.md's full-mode answer", () => {
    expect(plain(faqs["price-and-advance"].question, full)).toBe("How much is Kheelu?");
    expect(plain(faqs["price-and-advance"].answer, full)).toBe(homeFull);
  });

  it("the product page's price question becomes meet-kheelu.md's full-mode answer", () => {
    expect(plain(faqs["cost-and-advance"].question, full)).toBe("What does Kheelu cost?");
    expect(plain(faqs["cost-and-advance"].answer, full)).toBe(
      "Kheelu is ₹7,999 (incl. GST), paid in full when you order, with delivery anywhere in India included. Pay by UPI, card or net banking, with no payment fees, and get a GST invoice. Deliveries start mid-November. If it isn’t right for your family, return it within 7 days of delivery, no questions asked.",
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
