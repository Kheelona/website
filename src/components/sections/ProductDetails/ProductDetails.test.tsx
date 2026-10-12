import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildOffer } from "@/lib/offer/offer";
import { mockupFold, skeleton, words } from "../../../../test/support/mockup-compare";
import { ProductDetails } from "./ProductDetails";
import { PRODUCT_DETAILS } from "./ProductDetails.stories";

/* ProductDetails (task 3.4): the product page's fold 7 (meet-kheelu.html), the three panels STACKED as the plan rules
   (N21: no tab list and no JavaScript), each under its own heading, beside the declarations card; open facts shown as
   placeholders; the section keeps id="specs". The approved page renders a DS tab row (Specs, In the box, Safety) in
   both states: its page script turns the panels into tabs, and without JavaScript the row still shows above the three
   stacked panels, because the DS `.kh-tabs__list { display: flex }` overrides the row's `hidden` attribute. The build
   leaves that row out by the N21 ruling, so the comparison is with the mockup's markup without its tab list (the fold's
   one difference from the approved render; reported to the main session for 5.2's parity, 2026-10-12). */

const offer = buildOffer("token");
/* The tab row is left out by ruling (N21), not because it is invisible; the mockup names its split mk-details, which
   the store page also uses for a different block (mapping §6.2), so the product takes its own name; the mockup's
   amount span marks where the MRP comes from (data-src, mockup-only, N22). */
const OPTIONS = { rename: { details: "ks-product-details" }, skip: ".kh-tabs__list", unwrap: "[data-src]" };

describe("ProductDetails: the approved fold", () => {
  it("markup and words equal meet-kheelu.html fold 7 without its tab row (left out by the N21 ruling)", () => {
    const { container } = render(<ProductDetails {...PRODUCT_DETAILS} offer={offer} />);
    const mockup = mockupFold("meet-kheelu", "section#specs");
    expect(skeleton(container.firstElementChild!, OPTIONS)).toBe(skeleton(mockup, OPTIONS));
    expect(words(container.firstElementChild!)).toBe(words(mockup, OPTIONS));
  });
});

describe("ProductDetails: parts", () => {
  it("keeps id=specs, named by its heading", () => {
    render(<ProductDetails {...PRODUCT_DETAILS} offer={offer} />);
    const section = screen.getByRole("region", { name: "The details, in full." });
    expect(section).toHaveAttribute("id", "specs");
  });

  it("names its split ks-product-details, never the store's ks-details card (mapping §6.2: mk-details is two blocks)", () => {
    const { container } = render(<ProductDetails {...PRODUCT_DETAILS} offer={offer} />);
    const split = container.querySelector(".kh-split")!;
    expect(split.className).toBe("kh-split kh-split--wide-start ks-product-details");
    expect(container.querySelector(".ks-details")).toBeNull();
  });

  it("stacks the three panels, each with its heading, with no tab list, no tab roles and nothing interactive", () => {
    const { container } = render(<ProductDetails {...PRODUCT_DETAILS} offer={offer} />);
    const tabs = container.querySelector(".kh-tabs")!;
    expect(tabs.className).toBe("kh-tabs");
    expect(tabs.querySelector(".kh-tabs__list, [role='tablist'], [role='tab'], [role='tabpanel'], button")).toBeNull();
    const panels = [...tabs.children];
    expect(panels.map((p) => p.className)).toEqual(["kh-tabs__panel", "kh-tabs__panel", "kh-tabs__panel"]);
    expect(panels.map((p) => p.firstElementChild!.outerHTML)).toEqual([
      '<h3 class="kh-subtitle ks-panel-title">Specs</h3>',
      '<h3 class="kh-subtitle ks-panel-title">In the box</h3>',
      '<h3 class="kh-subtitle ks-panel-title">Safety</h3>',
    ]);
    expect(panels[0].querySelector("dl")!.className).toBe("ks-specs");
    expect(panels[1].querySelector("ul")!.className).toBe("ks-ticks");
  });

  it("shows every open fact visibly, in place", () => {
    const { container } = render(<ProductDetails {...PRODUCT_DETAILS} offer={offer} />);
    const marks = [...container.querySelectorAll(".ks-placeholder")].map((m) => m.textContent);
    expect(marks).toContain("[PLACEHOLDER F4: size and weight]");
    expect(marks).toContain("[PLACEHOLDER: which phones the parent app runs on]");
    expect(marks).toHaveLength(9);
  });

  it("prints the MRP from the offer, the same in both modes, in the declarations card", () => {
    for (const mode of ["token", "full"] as const) {
      const live = buildOffer(mode);
      const { container, unmount } = render(<ProductDetails {...PRODUCT_DETAILS} offer={live} />);
      const card = container.querySelector(".kh-card")!;
      expect(card.className).toBe("kh-card ks-declare");
      expect(within(card as HTMLElement).getByText(`${live.prices.mrp} (incl. of all taxes)`).tagName).toBe("DD");
      unmount();
    }
  });

  it("gives each way to reach consumer care its own line", () => {
    const { container } = render(<ProductDetails {...PRODUCT_DETAILS} offer={offer} />);
    const care = [...container.querySelectorAll(".ks-care")];
    expect(care).toHaveLength(2);
    expect(within(care[1] as HTMLElement).getByRole("link", { name: "hello@kheelona.com" })).toHaveAttribute("href", "mailto:hello@kheelona.com");
  });

  it("ends on the ghost link to the terms", () => {
    render(<ProductDetails {...PRODUCT_DETAILS} offer={offer} />);
    const link = screen.getByRole("link", { name: "Read the returns and warranty terms" });
    expect(link.className).toBe("kh-btn kh-btn--ghost");
    expect(link).toHaveAttribute("href", "/refund");
  });

  it("refuses an amount without the offer, rather than guessing a price", () => {
    expect(() => render(<ProductDetails {...PRODUCT_DETAILS} />)).toThrow();
  });
});
