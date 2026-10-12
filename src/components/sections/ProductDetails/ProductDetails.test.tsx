import { render, screen, within } from "@testing-library/react";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { approvedDetailsFoldHtml, runApprovedTabScript, tabStates } from "@/components/ui/Tabs/approved-tabs.test-support";
import { buildOffer } from "@/lib/offer/offer";
import { mockupFold, skeleton, words } from "../ArticleBody/__fixtures__/approved-fold";
import { ProductDetails } from "./ProductDetails";
import { PRODUCT_DETAILS } from "./ProductDetails.stories";

/* ProductDetails (tasks 3.4 and 3.5): the product page's fold 7 (meet-kheelu.html), section id="specs": the three
   panels (specs, in the box, safety) on ui/Tabs beside the declarations card, open facts shown as placeholders. Tabs as
   approved (P1 default; N21 corrected): the server sends the DS Tabs markup the mockup serves (tab row hidden, panels
   stacked under their headings), and the island makes tabs of it as the approved page's own script does
   (mockup/pages/meet-kheelu.html:397-439). Both states are compared with the approved fold: the served markup with
   the mockup file as it is, the tabbed one with the mockup after its script ran. */

const offer = buildOffer("token");
/* The mockup names its split mk-details, which the store page also uses for a different block (mapping §6.2), so the
   product takes its own name; the mockup's amount span marks where the MRP comes from (data-src, mockup-only, N22). */
const OPTIONS = { rename: { details: "ks-product-details" }, unwrap: "[data-src]" };

/** The section as the server sends it: rendered to HTML (no effect runs), then parsed. */
function served(ui: ReactElement): Element {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(ui);
  return host.firstElementChild!;
}

/** The approved fold after the approved page's own tab script ran on it. */
function approvedTabbed(): Element {
  const doc = document.implementation.createHTMLDocument("meet-kheelu");
  doc.body.innerHTML = approvedDetailsFoldHtml();
  runApprovedTabScript(doc);
  return doc.querySelector("section#specs")!;
}

describe("ProductDetails: the approved fold", () => {
  it("serves the markup and words of meet-kheelu.html fold 7 as the mockup serves it, tab row included", () => {
    const section = served(<ProductDetails {...PRODUCT_DETAILS} offer={offer} />);
    const mockup = mockupFold("meet-kheelu", "section#specs");
    expect(skeleton(section, OPTIONS)).toBe(skeleton(mockup, OPTIONS));
    expect(tabStates(section)).toBe(tabStates(mockup));
    expect(words(section)).toBe(words(mockup));
  });

  it("with JavaScript, equals the approved fold after the page's own tab script ran", () => {
    const { container } = render(<ProductDetails {...PRODUCT_DETAILS} offer={offer} />);
    const section = container.firstElementChild!;
    const mockup = approvedTabbed();
    expect(mockup.querySelector(".kh-tabs")!.className).toBe("kh-tabs is-tabs");
    expect(skeleton(section, OPTIONS)).toBe(skeleton(mockup, OPTIONS));
    expect(tabStates(section)).toBe(tabStates(mockup));
    expect(words(section)).toBe(words(mockup));
  });
});

describe("ProductDetails: parts", () => {
  it("keeps id=specs, named by its heading, and the panel and tab ids", () => {
    render(<ProductDetails {...PRODUCT_DETAILS} offer={offer} />);
    const section = screen.getByRole("region", { name: "The details, in full." });
    expect(section).toHaveAttribute("id", "specs");
    expect(within(section).getAllByRole("tab").map((t) => [t.id, t.getAttribute("aria-controls")])).toEqual([
      ["tab-specs", "panel-specs"],
      ["tab-box", "panel-box"],
      ["tab-safety", "panel-safety"],
    ]);
    expect(within(section).getAllByRole("tabpanel", { hidden: true }).map((p) => [p.id, p.getAttribute("aria-labelledby")])).toEqual([
      ["panel-specs", "tab-specs"],
      ["panel-box", "tab-box"],
      ["panel-safety", "tab-safety"],
    ]);
  });

  it("names its split ks-product-details, never the store's ks-details card (mapping §6.2: mk-details is two blocks)", () => {
    const { container } = render(<ProductDetails {...PRODUCT_DETAILS} offer={offer} />);
    const split = container.querySelector(".kh-split")!;
    expect(split.className).toBe("kh-split kh-split--wide-start ks-product-details");
    expect(container.querySelector(".ks-details")).toBeNull();
  });

  it("serves the three panels stacked, each under its heading, the tab row hidden, every panel's text in the HTML", () => {
    const tabs = served(<ProductDetails {...PRODUCT_DETAILS} offer={offer} />).querySelector(".kh-tabs")!;
    expect(tabs.className).toBe("kh-tabs");
    expect(tabs.querySelector(".kh-tabs__list")!.hasAttribute("hidden")).toBe(true);
    expect(tabs.querySelector("[role='tabpanel'], [hidden]:not(.kh-tabs__list), .kh-sr")).toBeNull();
    const panels = [...tabs.querySelectorAll(":scope > .kh-tabs__panel")];
    expect(panels.map((p) => p.firstElementChild!.outerHTML)).toEqual([
      '<h3 class="kh-subtitle ks-panel-title" data-tab-heading="">Specs</h3>',
      '<h3 class="kh-subtitle ks-panel-title" data-tab-heading="">In the box</h3>',
      '<h3 class="kh-subtitle ks-panel-title" data-tab-heading="">Safety</h3>',
    ]);
    expect(panels[0].querySelector("dl")!.className).toBe("ks-specs");
    expect(panels[1].querySelector("ul")!.className).toBe("ks-ticks");
    expect(panels.map((p) => p.textContent)).toEqual([
      expect.stringContaining("Charger[PLACEHOLDER F4: charger type and its BIS registration number]"),
      expect.stringContaining("Quick-start card"),
      expect.stringContaining("Battery safety: [PLACEHOLDER F4: battery safety certification]"),
    ]);
  });

  it("with JavaScript, shows the tab row named Product details and the Specs panel; the other two wait behind their tabs", () => {
    render(<ProductDetails {...PRODUCT_DETAILS} offer={offer} />);
    const list = screen.getByRole("tablist", { name: "Product details" });
    expect(within(list).getAllByRole("tab").map((t) => [t.textContent, t.getAttribute("aria-selected")])).toEqual([
      ["Specs", "true"],
      ["In the box", "false"],
      ["Safety", "false"],
    ]);
    expect(screen.getAllByRole("tabpanel").map((p) => p.id)).toEqual(["panel-specs"]);
  });

  it("shows every open fact visibly, in place", () => {
    const section = served(<ProductDetails {...PRODUCT_DETAILS} offer={offer} />);
    const marks = [...section.querySelectorAll(".ks-placeholder")].map((m) => m.textContent);
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
