import { describe, expect, it } from "vitest";
import { seller } from "@/content/en-IN/seller";
import { readRepoFile } from "../../../test/e2e/support/repo";
import { toPlainText } from "./plain-text";
import { parseRichText, type RichNode } from "./rich-text";
import { GSTIN } from "@/config/site";
import * as sellerLines from "./seller-lines";
import { grievanceOfficerLine, legalSellerSentence, type SellerFacts } from "./seller-lines";

/* The seller lines (task 4.3, wave-3 close): seller.ts holds the facts; this one helper composes the lines the legal
 * pages print from them, each with a no-wrap option. The refund and shipping family keeps `No 51`, `(Old Site No 1)`,
 * `Bengaluru 560041` and `Co-Founder` on one line each, as their approved mockups mark them (refund.html:133, 141;
 * shipping.html:114, 118); privacy and terms wrap nothing. The website prints no GSTIN (D063 item 3, D064 item 11; task
 * Q2.3): the mockups' seller sentences end "GSTIN 29AAMCK1530E1ZN.", the build's end at the address. */

const doc = (slug: string) => new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

/** The words the content string keeps on one line: every `{nowrap:…}` outside a link. The phone link keeps itself
 *  whole either way (`[{nowrap:…}](tel:…)` or `{nowrap:[…](tel:…)}`); the mockup marks it on the link, not a span. */
function nowrapPhrases(nodes: readonly RichNode[]): string[] {
  return nodes.flatMap((node) => {
    if (node.kind === "link") return [];
    if (node.kind === "nowrap") return node.children.some((c) => c.kind === "link") ? [] : [toPlainText(phrase(node.children))];
    return "children" in node ? nowrapPhrases(node.children) : [];
  });
}
/** A run of nodes back as one string, for the serialiser (text and nested wraps only, as these phrases hold). */
function phrase(nodes: readonly RichNode[]): string {
  return nodes.map((n) => (n.kind === "text" ? n.text : "children" in n ? phrase(n.children) : "")).join("");
}
/** The mockup's own no-wrap spans in an element (links that carry the class are the phone link, not a phrase). */
const mockupPhrases = (el: Element) => [...el.querySelectorAll("span.mk-nowrap")].map((s) => norm(s.textContent));
/** A mockup seller sentence as D063 item 3 rules it: its closing GSTIN sentence off. */
const GSTIN_SENTENCE = ` GSTIN ${GSTIN}.`;
const withoutGstin = (words: string) => {
  expect(words.endsWith(GSTIN_SENTENCE), words).toBe(true);
  return words.slice(0, -GSTIN_SENTENCE.length);
};

const REFUND_SELLER = doc("refund").querySelector('section[aria-labelledby="seller"] p')!;
const SHIPPING_SELLER = doc("shipping").querySelector('section[aria-labelledby="seller"] p')!;
const PRIVACY_SELLER = doc("privacy").querySelector("#contact .mk-doc__card:last-child p")!;
const TERMS_SELLER = doc("terms").querySelector("#contact .mk-doc__card:first-of-type p")!;
const REFUND_GRIEVANCE = doc("refund").querySelector('section[aria-labelledby="complaints"] .mk-doc__card p')!;
const SHIPPING_GRIEVANCE = doc("shipping").querySelector('section[aria-labelledby="seller"] .mk-doc__card p')!;
const PRIVACY_GRIEVANCE = doc("privacy").querySelector("#contact .mk-doc__card p")!;

describe("the GSTIN (D063 item 3)", () => {
  it("has no line of its own: the footer, the store footer and /contact print none", () => {
    expect(sellerLines).not.toHaveProperty("gstinLine");
  });
});

describe("legalSellerSentence", () => {
  const plain = `${seller.legalName}, registered at ${seller.addressLine}.`;

  it("is the registered seller in one sentence: entity and registered address, no GSTIN", () => {
    expect(legalSellerSentence(seller)).toBe(plain);
    expect(legalSellerSentence(seller, { nowrap: true })).not.toContain("GSTIN");
  });

  it("says what privacy's and terms' seller cards say after their lead, the GSTIN off, with nothing kept together", () => {
    for (const p of [PRIVACY_SELLER, TERMS_SELLER]) {
      const words = withoutGstin(norm(p.textContent).replace(/^(?:Who we are|Seller): /, ""));
      expect(toPlainText(legalSellerSentence(seller))).toBe(words);
      expect(mockupPhrases(p)).toEqual([]);
    }
    expect(nowrapPhrases(parseRichText(legalSellerSentence(seller)))).toEqual([]);
  });

  it("with nowrap, keeps No 51, (Old Site No 1) and Bengaluru 560041 together, exactly as refund and shipping do", () => {
    const sentence = legalSellerSentence(seller, { nowrap: true });
    for (const p of [REFUND_SELLER, SHIPPING_SELLER]) {
      expect(toPlainText(sentence)).toBe(withoutGstin(norm(p.textContent)));
      expect(nowrapPhrases(parseRichText(sentence))).toEqual(mockupPhrases(p));
    }
    expect(mockupPhrases(REFUND_SELLER)).toEqual(["No 51", "(Old Site No 1)", "Bengaluru 560041"]);
    expect(sentence).toBe(
      `${seller.legalName}, registered at 5th Floor, {nowrap:No 51} {nowrap:(Old Site No 1)}, ${seller.address.line2}, {nowrap:Bengaluru 560041}, Karnataka, India.`,
    );
  });

  it("builds the address from its parts, so another address follows the same rules", () => {
    const moved: SellerFacts = {
      ...seller,
      address: { line1: "2nd Floor, No 7 (Plot 3)", line2: "MG Road", city: "Pune", state: "Maharashtra", pincode: "411001", country: "India" },
      addressLine: "2nd Floor, No 7 (Plot 3), MG Road, Pune 411001, Maharashtra, India",
    };
    expect(legalSellerSentence(moved)).toBe(`${seller.legalName}, registered at 2nd Floor, No 7 (Plot 3), MG Road, Pune 411001, Maharashtra, India.`);
    expect(nowrapPhrases(parseRichText(legalSellerSentence(moved, { nowrap: true })))).toEqual(["No 7", "(Plot 3)", "Pune 411001"]);
  });

  it("refuses address parts that do not make the footer's one-line address (one source of truth)", () => {
    expect(() => legalSellerSentence({ ...seller, addressLine: "Somewhere else" })).toThrow(/address/);
    expect(() => legalSellerSentence({ ...seller, addressLine: "Somewhere else" }, { nowrap: true })).toThrow(/address/);
  });
});

describe("grievanceOfficerLine", () => {
  it("is the D032 line from the one content value, unchanged without nowrap (privacy, terms, contact)", () => {
    expect(grievanceOfficerLine(seller)).toEqual(seller.grievance.line);
    const line = grievanceOfficerLine(seller);
    expect(`${toPlainText(line.lead)} ${toPlainText(line.text)}`).toBe(norm(PRIVACY_GRIEVANCE.textContent));
    expect(mockupPhrases(PRIVACY_GRIEVANCE)).toEqual([]);
  });

  it("with nowrap, keeps Co-Founder on one line, exactly as refund and shipping do, with the same words", () => {
    const line = grievanceOfficerLine(seller, { nowrap: true });
    expect(line.lead).toBe(seller.grievance.line.lead);
    for (const p of [REFUND_GRIEVANCE, SHIPPING_GRIEVANCE]) {
      expect(`${toPlainText(line.lead)} ${toPlainText(line.text)}`).toBe(norm(p.textContent));
      expect(nowrapPhrases(parseRichText(line.text))).toEqual(mockupPhrases(p));
    }
    expect(mockupPhrases(REFUND_GRIEVANCE)).toEqual(["Co-Founder"]);
    expect(line.text.startsWith(`${seller.grievance.name}, {nowrap:Co-Founder} and CTO, `)).toBe(true);
  });

  it("refuses a line that does not name the officer's role (the role is where the line keeps words together)", () => {
    const off: SellerFacts = { ...seller, grievance: { ...seller.grievance, role: "Chief Officer" } };
    expect(() => grievanceOfficerLine(off, { nowrap: true })).toThrow(/role/);
  });
});
