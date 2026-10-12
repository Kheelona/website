import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildOffer } from "@/lib/offer/offer";
import { mockupFold, skeleton, words } from "../ArticleBody/__fixtures__/approved-fold";
import { ProductDetails } from "./ProductDetails";
import { PRODUCT_DETAILS } from "./ProductDetails.stories";

/* ProductDetails (task 3.4): the product page's fold 7 (meet-kheelu.html), the three panels STACKED as the plan rules
   (N21: no tab list and no JavaScript), each under its own heading, beside the declarations card; open facts shown as
   placeholders; the section keeps id="specs". The comparison is with the mockup's markup as served, which is its
   no-JavaScript state: the tab list hidden, the panels stacked (its page script, which makes tabs, is not built). */

const offer = buildOffer("token");
/* The hidden tab list is not built (N21); the mockup's amount span marks where the MRP comes from (data-src,
   mockup-only, N22). */
const OPTIONS = { skip: "[hidden]", unwrap: "[data-src]" };

describe("ProductDetails: the approved fold", () => {
  it("markup and words equal meet-kheelu.html fold 7 as served (no JavaScript), without its hidden tab list", () => {
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
