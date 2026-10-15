import { describe, expect, it } from "vitest";
import { GSTIN, SUPPORT_WHATSAPP_DISPLAY } from "@/config/site";
import { readRepoFile } from "../e2e/support/repo";
import { MOCKUP_SLUGS } from "../e2e/support/mockup-text";
import { sentenceDiff } from "../e2e/support/parity";
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
/** The product page's Legal Metrology declaration row, which keeps the number since task Q2.10 (the Packaged Commodities
 *  Rules ask for a consumer-care number): the one place in that page's <main>. */
const CONSUMER_CARE = /<div><dt>Consumer care<\/dt><dd>[\s\S]*?<\/dd><\/div>/g;
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
    if (slug === "meet-kheelu") {
      const rows = mainOf(ruled).match(CONSUMER_CARE) ?? [];
      expect(rows, "one consumer care row").toHaveLength(1);
      expect(rows[0], "the consumer care row keeps the number and its call link").toMatch(new RegExp(`call ${NUMBER.replace("+", "\\+")}</a>`));
      expect(rows[0]).toContain('href="tel:');
      expect(mainOf(ruled).replace(CONSUMER_CARE, ""), "main, the consumer care row aside").not.toMatch(PHONE);
    } else if (!KEEPS_NUMBER.has(slug)) expect(mainOf(ruled), "main").not.toMatch(PHONE);
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
    /* Counted, as the text pass diffs a page (sentenceDiff): on the product page the help lines' "WhatsApp or call …"
       goes four times while the consumer care row keeps it once (task Q2.10). */
    const { missing, extra } = sentenceDiff(blockSentences(main), blockSentences(withSellerFacts(main)));
    /* A rule is a set of sentences: the order they are listed in means nothing. */
    const { mockup, build } = sellerFactsSentences(slug);
    expect({ mockup: [...mockup].sort(), build: [...build].sort() }).toEqual({ mockup: missing.sort(), build: extra.sort() });
  });
});
