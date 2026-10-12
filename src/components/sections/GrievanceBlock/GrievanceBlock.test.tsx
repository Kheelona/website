import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { seller } from "@/content/en-IN/seller";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { builtMarkup, canonical, mockupFold, renderedElement } from "../../../../test/support/mockup-compare";
import { GrievanceBlock } from "./GrievanceBlock";
import type { GrievanceBlockConfig } from "./grievance-block.types";

/* GrievanceBlock (task 3.2): the D032 grievance block, from the one content value (content/en-IN/seller.ts), in its
   two contexts (mockup-css-mapping §6.2): the contact page's own fold (contact.html fold 3, links 800) and the card a
   legal page puts in its part (privacy.html:289-293, links 700 from the legal template). */

/* D032 (wiki/decisions/D032-grievance-block-and-call-line.md, "Published wording"), verbatim. */
const D032 =
  "Grievance Officer: Aman Soni, Co-Founder and CTO, aman@kheelona.com, +91 91875 46483. We acknowledge every complaint within 48 hours and resolve it within one month of receiving it.";

const CONTACT: GrievanceBlockConfig = {
  context: "contact",
  title: "Make a formal complaint.",
  intro: "If something has gone wrong and we haven’t put it right, you can complain formally to our grievance officer. Please include your order number.",
  line: seller.grievance.line,
};
const NOTE = "{ph:how you get a complaint reference to track your complaint; not set up yet}";
const LEGAL: GrievanceBlockConfig = { context: "legal", line: seller.grievance.line, note: NOTE, className: "ks-doc__card" };

describe("GrievanceBlock: contact (contact.html fold 3)", () => {
  it("renders the fold exactly as the mockup", () => {
    expect(canonical(renderedElement(<GrievanceBlock {...CONTACT} />))).toBe(builtMarkup([mockupFold("contact", "#grievance")]));
  });

  it("prints the D032 wording verbatim, from the one content value", () => {
    const card = renderedElement(<GrievanceBlock {...CONTACT} />).querySelector(".ks-grievance");
    expect(card?.textContent).toBe(D032);
    expect(card?.querySelector("strong")?.textContent).toBe("Grievance Officer:");
  });

  it("is the #grievance fragment the footer links to, a region named by its heading", () => {
    render(<GrievanceBlock {...CONTACT} />);
    const region = screen.getByRole("region", { name: "Make a formal complaint." });
    expect(region).toHaveAttribute("id", "grievance");
    expect(screen.getByRole("link", { name: "aman@kheelona.com" })).toHaveAttribute("href", "mailto:aman@kheelona.com");
    expect(screen.getByRole("link", { name: "+91 91875 46483" })).toHaveAttribute("href", "tel:+919187546483");
  });
});

describe("GrievanceBlock: legal (the card in a legal page's part, all four legal pages)", () => {
  it("renders the privacy and terms card exactly as the mockup: the D032 line, then the complaint-reference placeholder", () => {
    const expected = builtMarkup([mockupFold("privacy", "#contact .mk-doc__card")]);
    expect(canonical(renderedElement(<GrievanceBlock {...LEGAL} />))).toBe(expected);
    expect(builtMarkup([mockupFold("terms", "#contact .mk-doc__card:last-child")])).toBe(expected);
  });

  /* Task 3.6 item 6. Refund and shipping wrap "Co-Founder" in a no-wrap (refund.html:167, shipping.html:152), which
     4.3's seller-lines helper adds for that family; here the line carries the token itself. */
  it.each([
    ["refund", 'section[aria-labelledby="complaints"] .mk-doc__card'],
    ["shipping", 'section[aria-labelledby="seller"] .mk-doc__card'],
  ])("renders the %s card exactly as the mockup: the D032 line with its no-wrap, then the note", (slug, selector) => {
    const line = { ...seller.grievance.line, text: seller.grievance.line.text.replace("Co-Founder", "{nowrap:Co-Founder}") };
    const card = <GrievanceBlock context="legal" line={line} note={NOTE} className="ks-doc__card" />;
    const expected = builtMarkup([mockupFold(slug, selector)]);
    expect(canonical(renderedElement(card))).toBe(expected);
    expect(renderedElement(card).textContent).toContain(D032);
    // Control: the line without its no-wrap is not the approved card.
    const plain = <GrievanceBlock context="legal" line={seller.grievance.line} note={NOTE} className="ks-doc__card" />;
    expect(canonical(renderedElement(plain))).not.toBe(expected);
  });

  it("shows the complaint-reference note on all four legal pages, as each mockup's card does", () => {
    const cards = [
      ["privacy", "#contact .mk-doc__card"],
      ["terms", "#contact .mk-doc__card:last-child"],
      ["refund", 'section[aria-labelledby="complaints"] .mk-doc__card'],
      ["shipping", 'section[aria-labelledby="seller"] .mk-doc__card'],
    ] as const;
    for (const [slug, selector] of cards) {
      const ps = mockupFold(slug, selector).querySelectorAll("p");
      expect(ps, slug).toHaveLength(2);
      expect(ps[1].textContent, slug).toBe("[PLACEHOLDER: how you get a complaint reference to track your complaint; not set up yet]");
    }
  });

  it("prints the same D032 wording, and no note unless the page gives one (the contact page's fold has none)", () => {
    const card = renderedElement(<GrievanceBlock context="legal" line={seller.grievance.line} />);
    expect(card.textContent).toBe(D032);
    expect(card.querySelectorAll("p")).toHaveLength(1);
    expect(card.getAttribute("class")).toBe("kh-card");
  });
});

describe("GrievanceBlock: the link weight follows the context (mockup-css-mapping §6.2, row 18)", () => {
  const css = readRepoFile("src/components/sections/GrievanceBlock/grievance-block.css");

  it("contact: the card carries ks-grievance, whose links are the DS link colour at 800 (contact.css:27)", () => {
    expect(renderedElement(<GrievanceBlock {...CONTACT} />).querySelector(".kh-card")).toHaveClass("ks-grievance");
    expect(css).toMatch(/\.ks-grievance a \{\s*color: var\(--link\);\s*font-weight: 800;/);
  });

  it("legal: the card carries no ks-grievance, so the legal template's link rule (700, privacy.css:38) applies", () => {
    expect(renderedElement(<GrievanceBlock {...LEGAL} />)).not.toHaveClass("ks-grievance");
    expect(css).not.toMatch(/font-weight: 700/);
  });
});
