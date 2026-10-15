import { describe, expect, it } from "vitest";
import { GSTIN, SUPPORT_WHATSAPP_DISPLAY } from "@/config/site";
import { readRepoFile } from "../e2e/support/repo";
import { MOCKUP_SLUGS } from "../e2e/support/mockup-text";
import { blockSentences } from "./mockup-facts";
import {
  SELLER_FACTS_COUNTS,
  SELLER_FACTS_RULES,
  sellerFactsCounts,
  sellerFactsSentences,
  withSellerFacts,
  withSellerFactsHtml,
} from "../e2e/support/seller-facts";

/* D063 items 2-3 against the frozen mockups (task Q2.3): the one table of the approved markup the ruling changes, the
 * pages it changes it on, and the sentences the text pass accepts. */

const NUMBER = SUPPORT_WHATSAPP_DISPLAY;
/** The number as a page shows it, or a call link. */
const PHONE = new RegExp(`${NUMBER.replace("+", "\\+")}|tel:`);
/** The pages that keep the number in their <main> (the E-Commerce Rules, r.4(2)(d); D063 item 2). */
const KEEPS_NUMBER = new Set(["contact", "privacy", "terms", "refund", "shipping"]);
const raw = (slug: string) => readRepoFile(`mockup/${slug}.html`);
const mainOf = (html: string) => html.slice(html.search(/<main\b/i), html.search(/<\/main>/i) + "</main>".length);
/** The chrome: the body outside <main> (the head is the page's meta; /contact's description keeps the number). */
const outsideMain = (html: string) => html.replace(mainOf(html), "").replace(/<head\b[\s\S]*?<\/head>/i, "");

describe("the seller-facts ruling of the approved mockups (D063 items 2-3)", () => {
  it.each(MOCKUP_SLUGS.map((s) => [s] as const))("%s: applies each rule exactly as often as the table says", (slug) => {
    expect(sellerFactsCounts(raw(slug))).toEqual(SELLER_FACTS_COUNTS[slug]);
  });

  it.each(MOCKUP_SLUGS.map((s) => [s] as const))("%s: leaves no GSTIN anywhere, and the number only in the main of /contact and the legal pages", (slug) => {
    const ruled = withSellerFactsHtml(raw(slug));
    expect(ruled).not.toContain(GSTIN);
    expect(outsideMain(ruled), "chrome").not.toMatch(PHONE);
    if (!KEEPS_NUMBER.has(slug)) expect(mainOf(ruled), "main").not.toMatch(PHONE);
    else expect(mainOf(ruled), "main keeps the number").toContain(NUMBER);
  });

  it("changes nothing a second time", () => {
    for (const slug of MOCKUP_SLUGS) {
      const once = withSellerFactsHtml(raw(slug));
      expect(withSellerFactsHtml(once), slug).toBe(once);
    }
  });

  it("names each rule once, and every rule is used somewhere", () => {
    const names = SELLER_FACTS_RULES.map((r) => r.name);
    expect(new Set(names).size).toBe(names.length);
    for (const name of names) expect(MOCKUP_SLUGS.some((s) => (SELLER_FACTS_COUNTS[s][name] ?? 0) > 0), name).toBe(true);
  });

  it("rules a DOM element as it rules the file: the footer's legal row, the contact page's seller card", () => {
    const home = new DOMParser().parseFromString(raw("home"), "text/html");
    const footer = withSellerFacts(home.querySelector("footer.kh-footer")!);
    expect(footer.textContent).not.toContain("GSTIN");
    expect(footer.querySelector('a[href^="tel:"]')).toBeNull();
    expect(footer.querySelector(".kh-footer__legal a[href^='https://wa.me/']")?.textContent).toBe("WhatsApp");
    expect(home.querySelector("footer.kh-footer")!.textContent, "the source stays as approved").toContain("GSTIN");

    const contact = new DOMParser().parseFromString(raw("contact"), "text/html");
    const card = withSellerFacts(contact.querySelector(".mk-seller")!);
    expect(card.textContent).not.toContain("GSTIN");
    expect(card.querySelector('a[href^="tel:"]')?.textContent, "the number stays on /contact").toBe(NUMBER);
  });

  it.each(MOCKUP_SLUGS.map((s) => [s] as const))("%s: the text pass's sentences are exactly those the ruling changes in <main>", (slug) => {
    const doc = new DOMParser().parseFromString(raw(slug), "text/html");
    const main = doc.querySelector("main")!;
    const before = blockSentences(main);
    const after = blockSentences(withSellerFacts(main));
    const missing = before.filter((s) => !after.includes(s));
    const extra = after.filter((s) => !before.includes(s));
    /* A rule is a set of sentences: the order they are listed in means nothing. */
    const { mockup, build } = sellerFactsSentences(slug);
    expect({ mockup: [...mockup].sort(), build: [...build].sort() }).toEqual({ mockup: missing.sort(), build: extra.sort() });
  });
});
