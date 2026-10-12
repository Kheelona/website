import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { seller } from "@/content/en-IN/seller";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { builtMarkup, canonical, mockupElement, mockupPage, renderedElement } from "../CtaBlock/mockup-fold.test-support";
import { SellerBlock } from "./SellerBlock";
import type { SellerBlockConfig, SellerLinesCopy } from "./seller-block.types";

/* SellerBlock (task 3.2): who a parent is buying from, in its two contexts (mockup-css-mapping §6.2): the contact
   page's fold, the four seller lines character for character as the footer (contact.html fold 4, links 800), and the
   seller line a legal page prints in its part (privacy.html:293-295, terms.html:217-219, refund.html:141; links 700
   from the legal template). The words come from content/en-IN/seller.ts. */

const LINES: SellerLinesCopy = {
  entity: seller.legalName,
  gstin: `GSTIN ${seller.gstin}`,
  address: seller.addressLine,
  contact: seller.support.line,
};
const CONTACT: SellerBlockConfig = {
  context: "contact",
  title: "Who you’re {hand:buying from.}",
  intro: "Kheelu is designed here in Bengaluru, by parents who use it at home, and made in India. This is also the company you’re buying from.",
  lines: LINES,
};
const LEGAL_SENTENCE = `${seller.legalName}, registered at ${seller.addressLine}. GSTIN ${seller.gstin}.`;

describe("SellerBlock: contact (contact.html fold 4)", () => {
  it("renders the fold exactly as the mockup", () => {
    const expected = builtMarkup([mockupElement("contact", 'section[aria-labelledby="seller-title"]')]);
    expect(canonical(renderedElement(<SellerBlock {...CONTACT} />))).toBe(expected);
  });

  it("prints the four seller lines character for character as the footer (partials/footer.html, without the ©)", () => {
    const footer = [...mockupPage("contact").querySelectorAll(".kh-footer__legal > span")].map((s) => s.textContent);
    const address = renderedElement(<SellerBlock {...CONTACT} />).querySelector("address")!;
    const lines = [address.querySelector("strong")!, ...address.querySelectorAll(":scope > span")].map((el) => el.textContent);
    expect(lines).toEqual([footer[0]!.replace(/^© 2026 /, ""), ...footer.slice(1, 4)]);
  });

  it("is a band section named by its heading, with the seller's phone and email as links", () => {
    render(<SellerBlock {...CONTACT} />);
    const region = screen.getByRole("region", { name: "Who you’re buying from." });
    expect(region).toHaveClass("kh-section", "kh-section--band");
    expect(screen.getByRole("link", { name: "+91 91875 46483" })).toHaveAttribute("href", "tel:+919187546483");
    expect(screen.getByRole("link", { name: "hello@kheelona.com" })).toHaveAttribute("href", "mailto:hello@kheelona.com");
  });
});

describe("SellerBlock: legal (the seller line in a legal page's part)", () => {
  it("renders privacy's card exactly as the mockup: a bold lead, then the registered seller", () => {
    const card = <SellerBlock context="legal" line={{ lead: "Who we are:", text: LEGAL_SENTENCE }} className="ks-doc__card" />;
    expect(canonical(renderedElement(card))).toBe(builtMarkup([mockupElement("privacy", "#contact .mk-doc__card:last-child")]));
  });

  it("renders terms' card with its own lead", () => {
    const card = <SellerBlock context="legal" line={{ lead: "Seller:", text: LEGAL_SENTENCE }} className="ks-doc__card" />;
    expect(canonical(renderedElement(card))).toBe(builtMarkup([mockupElement("terms", "#contact .mk-doc__card:first-of-type")]));
  });

  it("renders a plain paragraph with no card and no lead where the page has one (refund and shipping)", () => {
    const p = renderedElement(<SellerBlock context="legal" line={{ text: LEGAL_SENTENCE }} card={false} />);
    expect(p.outerHTML).toBe(`<p>${LEGAL_SENTENCE}</p>`);
    expect(mockupElement("refund", 'section[aria-labelledby="seller"] p').textContent).toBe(LEGAL_SENTENCE);
  });
});

describe("SellerBlock: the link weight follows the context (mockup-css-mapping §6.2, row 18)", () => {
  const css = readRepoFile("src/components/sections/SellerBlock/seller-block.css");

  it("contact: the card carries ks-seller, whose links are the DS link colour at 800 (contact.css:27)", () => {
    expect(renderedElement(<SellerBlock {...CONTACT} />).querySelector(".kh-card")).toHaveClass("ks-seller");
    expect(css).toMatch(/\.ks-seller a \{\s*color: var\(--link\);\s*font-weight: 800;/);
  });

  it("legal: no ks-seller, so the legal template's link rule (700) applies", () => {
    expect(renderedElement(<SellerBlock context="legal" line={{ lead: "Seller:", text: LEGAL_SENTENCE }} />)).not.toHaveClass("ks-seller");
    expect(css).not.toMatch(/font-weight: 700/);
  });
});
