import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PreorderButton } from "./PreorderButton";

/* In tests (no KH_SITE_ENV) the build is "development", whose store is the production one
   (src/config/env.ts): https://store.kheelona.com, as STORE_URL. Written out here, not imported, so the
   test fails if the button stops pointing at the store. */
const STORE = "https://store.kheelona.com";
const LABEL = "Pre-order Kheelu";

describe("PreorderButton", () => {
  it("always links to the store with the label and the CTA value it is given", () => {
    render(<PreorderButton cta="finale" label={LABEL} />);
    const link = screen.getByRole("link", { name: LABEL });
    expect(link).toHaveAttribute("href", STORE);
    expect(link).toHaveAttribute("data-ph-capture-attribute-cta", "finale");
    expect(link.className).toBe("kh-btn kh-btn--cta");
  });

  it("renders the product hero button as meet-kheelu.html fold 1 does: size l, block, arrow, no id", () => {
    const html = renderToStaticMarkup(<PreorderButton cta="product-top" label={LABEL} size="l" block arrow />);
    expect(html.startsWith(
      `<a href="${STORE}" class="kh-btn kh-btn--cta kh-btn--l kh-btn--block" data-ph-capture-attribute-cta="product-top"><span>${LABEL}</span><svg class="kh-icon ks-btn__arrow"`,
    )).toBe(true);
    expect(html.match(/<svg/g)).toHaveLength(1);
  });

  it("takes the Home hero's id and a composition class", () => {
    render(<PreorderButton cta="hero" label={LABEL} id="hero-cta" className="ks-close-cta" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("id", "hero-cta");
    expect(link).toHaveClass("ks-close-cta");
  });

  it("has no arrow unless asked (the sticky bar, the nav and the drawer)", () => {
    const { container } = render(<PreorderButton cta="sticky-bar" label={LABEL} />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("refuses a secondary value", () => {
    expect(() => renderToStaticMarkup(<PreorderButton cta="faq-more" label={LABEL} />)).toThrow(/secondary value/);
  });
});
