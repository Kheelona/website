import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { GSTIN } from "@/config/site";
import type { Copy, LegalBlock, LegalPage, Offer } from "@/content/types";
import { LegalTemplate } from "@/layouts/LegalTemplate/LegalTemplate";
import { isPlaceholder } from "@/lib/content/placeholder";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { ORDER_REF_PATTERN } from "@/lib/store/order-ref";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { refundFixture } from "../../../../test/fixtures/legal/refund";
import { mockupFold, mockupRoute, skeleton, words, type SkeletonOptions } from "../../../../test/support/mockup-compare";
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
 * the store page links to (deviation V1); the `refund-learn` close and no pre-order button; a draft, with exactly the
 * placeholders the copy page lists. Shared facts are read by reference, never retyped: the number, WhatsApp, call and
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

const mockupMain = mockupFold("refund", "main");
const SOURCE = readRepoFile("src/content/en-IN/legal/refund.ts");
/** The module's code without its comments. */
const CODE = SOURCE.replace(/\/\*[\s\S]*?\*\/|(?<!:)\/\/.*$/gm, "");
const COPY_PAGE = readRepoFile("wiki/site/pages/refund.md");

/** Every block of every part, in order. */
const blocks = (): readonly LegalBlock[] => (refundPage as LegalPage).parts.flatMap((part) => part.blocks);
const plain = (copy: Copy, offer: Offer = TOKEN) => toPlainText(copy, offer);

describe("the refund module: what it is", () => {
  it("is the /refund notice, a draft whose approval date is a placeholder until the founder signs it off (D029)", () => {
    expect(refundPage.slug).toBe("refund");
    expect(refundPage.status).toBe("draft");
    expect(isPlaceholder(refundPage.approvedOn)).toBe(true);
    expect(toPlainText(refundPage.approvedOn)).toBe("[PLACEHOLDER: the date the founder approves this page]");
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

  it("is the markup of the template's parity fixture (test/fixtures/legal/refund.ts), character for character", () => {
    expect(html(refundPage)).toBe(html(refundFixture));
  });

  it("shows exactly the placeholders the copy page lists, each visible on beta (fold 1 to section 7)", () => {
    const listed = [...COPY_PAGE.slice(COPY_PAGE.indexOf("## Placeholders")).matchAll(/`\[PLACEHOLDER: ([^\]`]+)\]`/g)].map((m) => m[1]);
    expect(listed).toHaveLength(10);
    const shown = [...(mainOf(refundPage).textContent ?? "").matchAll(/\[PLACEHOLDER: ([^\]]+)\]/g)].map((m) => m[1]);
    expect([...shown].sort()).toEqual([...listed].sort());
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

  it("never gives a reservation's total as the full price: the balance paragraph drops the total there", () => {
    const balance = (offer: Offer) => mainOf(refundPage, offer).querySelector("#before-dispatch")!.parentElement!.querySelectorAll("p")[2].textContent!;
    expect(balance(TOKEN)).toContain(`the remaining ${TOKEN.prices.balance} of the ${TOKEN.prices.headline} price (incl. GST)`);
    expect(balance(FULL)).not.toContain(FULL.prices.headline);
    expect(balance(FULL)).toContain(`On a reservation, the remaining ${FULL.prices.balance} (incl. GST) is due before delivery`);
  });

  it("changes nothing else", () => {
    const rest = (offer: Offer) => {
      const main = mainOf(refundPage, offer);
      main.querySelector("#before-dispatch")!.parentElement!.querySelectorAll("p")[2].remove();
      return words(main);
    };
    expect(rest(FULL)).toBe(rest(TOKEN));
  });
});
