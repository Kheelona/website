import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { GSTIN } from "@/config/site";
import type { Copy, LegalBlock, LegalPage, Offer } from "@/content/types";
import { LegalTemplate } from "@/layouts/LegalTemplate/LegalTemplate";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { ORDER_REF_PATTERN } from "@/lib/store/order-ref";
import { GRIEVANCE_NOTE, PAGE_FACTS } from "../../../../test/e2e/support/page-facts";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { refundFixture } from "../../../../test/fixtures/legal/refund";
import { mockupFold, mockupRoute, skeleton, words, type SkeletonOptions } from "../../../../test/support/mockup-compare";
import { withFacts } from "../../../../test/support/mockup-facts";
import { DEFAULT_OG } from "../organization";
import {
  BANK_REFUND_WORKING_DAYS,
  NO_EXCHANGES,
  PAYMENT_TERMS,
  REFUND_START_WORKING_DAYS,
} from "../policies";
import { seller } from "../seller";
import { refundPage } from "./refund";
import { legalTemplateCopy } from "./shared";

/* The /refund content module (task 5.13; structure §5 row refund.html; wiki/site/pages/refund.md, the legal review of
 * 2026-10-11 applied). Rendered through LegalTemplate in its `notice` family, it is the approved page's <main>
 * (mockup/refund.html, D046) tag for tag and word for word, and the same markup as the template's parity fixture
 * (test/fixtures/legal/refund.ts, task 4.3); D042's three lines as the decision words them; the `#chargeback` paragraph
 * the store page links to (deviation V1); the `refund-learn` close and no pre-order button; a draft, last updated on the
 * founder's date. The founder's page facts (task 6.7; D055 items 1-8) are applied to the mockup and the fixture it is
 * compared with (test/e2e/support/page-facts.ts): no placeholder is left. Shared facts are read by reference, never
 * retyped: the number, WhatsApp, call and
 * email links from seller.ts, every policy number from policies.ts, the seller and grievance lines from seller.ts
 * through the template's seller-lines helper (their phrases kept together, as the notice family prints them). */

const TOKEN = buildOffer("token");
const FULL = buildOffer("full");

function page(doc: LegalPage, offer: Offer = TOKEN): ReactElement {
  return (
    <main id="main">
      <LegalTemplate doc={doc} variant="notice" copy={legalTemplateCopy} offer={offer} />
    </main>
  );
}
const html = (doc: LegalPage, offer: Offer = TOKEN) => renderToStaticMarkup(page(doc, offer));
const mainOf = (doc: LegalPage, offer: Offer = TOKEN) =>
  new DOMParser().parseFromString(`<!doctype html><body>${html(doc, offer)}</body>`, "text/html").querySelector("main")!;

/** As LegalTemplate.test.tsx compares a legal page with its mockup: the generated type steps, the list reset, the
 *  paragraph sticker's margin class and the family modifiers are the build's own and dropped; the mockup's value
 *  markers (data-src) are review-tool markup that never ships (N22). */
const OPTIONS: SkeletonOptions = {
  drop: /^ks-(?:type-.+|list-reset|sticker--flush|draft--notice|doc--(?:reference|notice)|doc-summary--(?:reference|notice)|doc-close--(?:reference|notice)|toc--groups)$/,
  unwrap: "span[data-src]",
};

/** The approved page with the founder's page facts applied (task 6.7). */
const mockupMain = withFacts(mockupFold("refund", "main"), PAGE_FACTS.refund.edits);
const SOURCE = readRepoFile("src/content/en-IN/legal/refund.ts");
/** The module's code without its comments. */
const CODE = SOURCE.replace(/\/\*[\s\S]*?\*\/|(?<!:)\/\/.*$/gm, "");
const COPY_PAGE = readRepoFile("wiki/site/pages/refund.md");

/** Every block of every part, in order. */
const blocks = (): readonly LegalBlock[] => (refundPage as LegalPage).parts.flatMap((part) => part.blocks);
const plain = (copy: Copy, offer: Offer = TOKEN) => toPlainText(copy, offer);

describe("the refund module: what it is", () => {
  it("is the /refund notice, a draft (D029: the founder signs it off as legal text), last updated 14 October 2026 (D055 item 8)", () => {
    expect(refundPage.slug).toBe("refund");
    expect(refundPage.status).toBe("draft");
    expect(refundPage.approvedOn).toBe("2026-10-14");
    expect(words(mainOf(refundPage).querySelector(".ks-updated")!)).toBe("Last updated: 14 October 2026");
  });

  it("carries the copy page's title and meta description, word for word and within 60 and 155 characters", () => {
    const row = (label: RegExp) => {
      const line = COPY_PAGE.split("\n").find((l) => label.test(l));
      expect(line, `refund.md has a ${label} row`).toBeDefined();
      return line!.split("|")[2].trim();
    };
    const title = plain(refundPage.meta.title);
    const description = plain(refundPage.meta.description);
    expect(title).toBe(row(/^\| Title \(\d+ characters\) \|/));
    expect(description).toBe(row(/^\| Meta description \(\d+ characters\) \|/));
    expect(title).toBe("Kheelu returns, refunds and warranty · Kheelona");
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeLessThanOrEqual(155);
    expect(plain(refundPage.meta.description, FULL)).toBe(description);
    expect(refundPage.meta.og).toBe(DEFAULT_OG);
  });

  it("numbers its parts with the copy page's ids, in its order (fold 3)", () => {
    expect(refundPage.parts.map((part) => part.id)).toEqual([
      "before-dispatch",
      "returns",
      "faulty",
      "exchanges",
      "refund-timing",
      "payments",
      "complaints",
      "seller",
    ]);
  });

  it("uses only icons the design system has (fold 2: each file checked)", () => {
    if (refundPage.summary.kind !== "trust") throw new Error("refund's short version is a trust list");
    for (const item of refundPage.summary.items) expect(Object.keys(ICON_PATHS)).toContain(item.icon);
  });
});

describe("the refund module through LegalTemplate (notice) against the approved page", () => {
  it("renders the mockup's <main>: same elements, classes, ARIA, ids, addresses and order", () => {
    expect(skeleton(mainOf(refundPage), OPTIONS)).toBe(skeleton(mockupMain, OPTIONS));
  });

  it("says every word the mockup says, the amounts and the delivery line from the offer", () => {
    expect(words(mainOf(refundPage))).toBe(words(mockupMain));
  });

  it("is the markup of the template's parity fixture (test/fixtures/legal/refund.ts) with the founder's facts, character for character", () => {
    // The complaint-reference line is the template's (legal/shared.ts), so the fixture's render already lacks it.
    const documentFacts = PAGE_FACTS.refund.edits.filter((edit) => edit !== GRIEVANCE_NOTE);
    expect(mainOf(refundPage).outerHTML).toBe(withFacts(mainOf(refundFixture), documentFacts, { built: true }).outerHTML);
  });

  it("shows no placeholder: the copy page lists none left, each filled or ruled off by the founder (D055; task 6.7)", () => {
    const section = COPY_PAGE.slice(COPY_PAGE.indexOf("## Placeholders"), COPY_PAGE.indexOf("## Questions for the founder"));
    expect(section).toMatch(/^## Placeholders\n\nNone left\./);
    expect(mainOf(refundPage).textContent).not.toMatch(/PLACEHOLDER/);
    expect(SOURCE).not.toMatch(/\{ph:|placeholder\(/);
  });

  it("says the founder's answers and nothing he did not confirm (D055 items 1-6)", () => {
    const text = words(mainOf(refundPage));
    for (const line of [
      "You get a full refund of everything you paid.",
      "After a return, your refund reaches you within 7 working days of your Kheelu reaching us.",
      "It’s a full refund of everything you paid.",
      "If your Kheelu comes back with something missing, or damaged beyond normal play, we’ll talk to you before deciding the refund.",
      "Kheelu has a 6-month warranty on manufacturing defects, from the day it’s delivered.",
      "Sending the repaired or replacement Kheelu back to you is free too.",
    ]) {
      expect(text).toContain(line);
    }
    // Item 4: the warranty backstop was not confirmed, so it is off the page; the 7-day faulty-on-arrival remedy stays.
    expect(text).not.toMatch(/full refund if neither works|don’t put it right/);
    expect(text).toContain("tell us within 7 days of receiving it, and you can have a replacement or a full refund");
    // Item 5: bank time is included after a return, so no bank days follow the return line.
    expect(text).not.toContain("Then your bank:");
  });

  it("names amounts only as offer tokens: no rupee sign typed in the module", () => {
    expect(SOURCE).not.toContain("₹");
    expect(CODE).toMatch(/\{price:token\}/);
  });
});

describe("the refund module: D042's lines, as the decision words them", () => {
  const D042 = readRepoFile("wiki/decisions/D042-policy-display-answers.md");
  const text = () => (mainOf(refundPage).textContent ?? "").replace(/\s+/g, " ");

  it("no exchanges: return it within 7 days and order again (Rule 7(1)(a))", () => {
    expect(D042).toContain(NO_EXCHANGES.replace(/\.$/, ""));
    const exchanges = refundPage.parts.find((part) => part.id === "exchanges")!;
    expect(plain((exchanges.blocks[0] as { text: Copy }).text).startsWith(NO_EXCHANGES)).toBe(true);
  });

  it("no payment fees, nothing recurring, payments by Razorpay, as the bold lead of the payments part (Rule 7(1)(c))", () => {
    expect(D042).toContain(`"${PAYMENT_TERMS.replace(/\.$/, "")}"`);
    const payments = refundPage.parts.find((part) => part.id === "payments")!;
    expect(payments.blocks[0]).toEqual({ kind: "p", lead: PAYMENT_TERMS });
  });

  it("we start your refund within 2 working days of your request; your bank takes 5-7 working days (ECOM-10)", () => {
    const line = `We start your refund within ${REFUND_START_WORKING_DAYS} working days of your request; your bank takes ${BANK_REFUND_WORKING_DAYS} working days`;
    expect(D042).toContain(`"${line}"`);
    expect(text()).toContain(line);
  });
});

describe("the refund module: the links other pages rely on", () => {
  it("keeps the `#chargeback` paragraph in the payments part, where the store page's chargeback link lands (deviation V1)", () => {
    const storeLink = mockupFold("store", 'a[href$="#chargeback"]').getAttribute("href")!;
    expect(mockupRoute(storeLink)).toBe("/refund#chargeback");
    const target = mainOf(refundPage).querySelector("p#chargeback");
    expect(target?.closest("section")?.getAttribute("aria-labelledby")).toBe("payments");
    expect(target?.textContent).toMatch(/raise a dispute \(a chargeback\) with your bank or card issuer/);
    expect(target?.querySelector('a[href="https://razorpay.com/support/"]')?.textContent).toBe("razorpay.com/support");
  });

  it("points each “section N” link at part N", () => {
    const refs = [...CODE.matchAll(/\[section (\d+)\]\(#([a-z-]+)\)/g)];
    expect(refs.length).toBeGreaterThanOrEqual(2);
    for (const [, n, id] of refs) expect(refundPage.parts[Number(n) - 1].id, `section ${n}`).toBe(id);
  });

  it("closes with Meet Kheelu (`refund-learn`) and the shipping page, and has no pre-order button anywhere (strategy §5)", () => {
    expect(refundPage.close).toEqual({
      title: "Still {hand:deciding?}",
      lead: "See what Kheelu does, what you get and what you pay.",
      actions: [
        { label: "Meet Kheelu", href: "/products/kheelu", cta: "refund-learn" },
        { label: "Shipping and delivery", href: "/shipping" },
      ],
    });
    const main = mainOf(refundPage);
    expect([...main.querySelectorAll("[data-ph-capture-attribute-cta]")].map((el) => el.getAttribute("data-ph-capture-attribute-cta"))).toEqual([
      "refund-learn",
    ]);
    expect(main.querySelector(".kh-btn--cta")).toBeNull();
  });
});

describe("the refund module: shared facts by reference, never retyped", () => {
  it("renders the shared seller and grievance blocks, with no lead of its own (refund prints none)", () => {
    expect(blocks().filter((b) => b.kind === "seller" || b.kind === "grievance")).toEqual([{ kind: "grievance" }, { kind: "seller" }]);
  });

  it("keeps the notice family's phrases together in the seller and grievance lines (seller-lines with nowrap, 4.3)", () => {
    const kept = [...mainOf(refundPage).querySelectorAll(".ks-doc__part span.ks-nowrap")].map((s) => s.textContent);
    expect(kept).toEqual(expect.arrayContaining(["No 51", "(Old Site No 1)", "Bengaluru 560041", "Co-Founder"]));
  });

  it("types no number, link, address, entity or grievance wording of the seller's", () => {
    const { phone, tel, whatsapp, email } = seller.support;
    for (const fact of [phone, tel, whatsapp, email, "wa.me", "919187546483", GSTIN, seller.legalName, "Kokarya", "Aman Soni", "Grievance Officer"]) {
      expect(CODE, fact).not.toContain(fact);
    }
  });

  it("types no policy number or D042 line of policies.ts", () => {
    for (const typed of [/\b\d+ days\b/, /\b\d+-day\b/, /\b\d+-month\b/, /\b\d+ working days\b/, /\b5-7\b/, PAYMENT_TERMS, NO_EXCHANGES]) {
      expect(CODE).not.toMatch(typeof typed === "string" ? new RegExp(typed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) : typed);
    }
  });

  it("names the order number's prefix the checkout gives every order (src/lib/store/order-ref.ts)", () => {
    expect(ORDER_REF_PATTERN.source.startsWith("^KH-")).toBe(true);
    expect(CODE).toContain("{nowrap:KH-}");
  });

  it("is a content module that needs no layout or component: content, its shared modules, the placeholder helper and DS art", () => {
    const imports = [...SOURCE.matchAll(/\bfrom\s+"([^"]+)"/g)].map((m) => m[1]);
    for (const path of imports) expect(path, path).toMatch(/^(?:@\/content\/types|\.\.\/(?:organization|policies|seller)|@\/lib\/content\/placeholder|@ds\/assets\/)/);
  });
});

describe("the refund module in full mode (the store sells at the full price once the reservations close)", () => {
  it("renders, every amount from the offer", () => {
    expect(() => html(refundPage, FULL)).not.toThrow();
  });

  /* Task 4.7 item 2: a reservation's total is the launch price in both modes (refund.md section 1), so the balance
     paragraph names it as {price:launch}; its full-mode stopgap (the total left out) is gone, and the approved sentence
     reads true whichever mode the store is in. */
  const balance = (offer: Offer) => mainOf(refundPage, offer).querySelector("#before-dispatch")!.parentElement!.querySelectorAll("p")[2].textContent!;

  it("gives a reservation's total as the launch price in both modes, never the full price", () => {
    for (const offer of [TOKEN, FULL]) {
      expect(balance(offer)).toContain(`On a reservation, the remaining ${offer.prices.balance} of the ${offer.prices.launch} price (incl. GST) is due before delivery`);
    }
    expect(balance(FULL)).toContain("the remaining ₹4,500 of the ₹4,999 price (incl. GST)");
    expect(balance(FULL)).not.toContain(FULL.prices.full);
  });

  it("names that total as {price:launch}, one sentence for both modes (no {price:headline}, which follows the mode)", () => {
    expect(CODE).toContain("the remaining {price:balance} of the {price:launch} price (incl. GST)");
    expect(CODE).not.toContain("{price:headline}");
  });

  it("reads word for word the same in both modes", () => {
    expect(words(mainOf(refundPage, FULL))).toBe(words(mainOf(refundPage, TOKEN)));
  });
});
