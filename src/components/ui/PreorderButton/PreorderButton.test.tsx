import { renderToStaticMarkup } from "react-dom/server";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { PreorderButton, type PreorderButtonProps } from "./PreorderButton";

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

/* The Chilli button as the built mockup page renders it (mockup/<page>.html, partials and {{icon:…}} inlined), turned
   into what the build must print: the store URL for store.html, each mk- class under its ks- name, and on the arrow
   the D049 pick 6 hook. Nothing else may differ. */
function mockupButton(page: string, cta: string): string {
  const element = new RegExp(`<a [^>]*data-ph-capture-attribute-cta="${cta}"[^>]*>[\\s\\S]*?</a>`).exec(readRepoFile(`mockup/${page}.html`));
  if (element === null) throw new Error(`mockup/${page}.html has no Chilli button "${cta}"`);
  return element[0]
    .replace('href="store.html"', `href="${STORE}"`)
    .replace(/\bmk-/g, "ks-")
    .replace('<svg class="kh-icon"', '<svg class="kh-icon ks-btn__arrow"');
}

describe("PreorderButton: every Chilli button of the approved pages, exactly as the mockup marks it up", () => {
  const cases: [page: string, props: Omit<PreorderButtonProps, "label">][] = [
    ["home", { cta: "hero", id: "hero-cta", size: "l", block: true, arrow: true }],
    ["home", { cta: "see-it-ask", size: "l" }],
    ["home", { cta: "safety", size: "l" }],
    ["home", { cta: "finale", size: "l", block: true }],
    ["home", { cta: "navbar", size: "s", className: "ks-nav-cta" }],
    ["home", { cta: "navbar-mobile", size: "l", block: true }],
    ["home", { cta: "sticky-bar" }],
    ["meet-kheelu", { cta: "product-top", size: "l", block: true, arrow: true }],
    ["meet-kheelu", { cta: "product-offer", size: "l", block: true }],
    ["meet-kheelu", { cta: "product-safety", size: "l" }],
    ["meet-kheelu", { cta: "product-foot", size: "l", className: "ks-close-cta" }],
    ["ai-toys-for-kids-in-india", { cta: "finale", size: "l", block: true, arrow: true, className: "ks-gd-cta" }],
    ["safety", { cta: "finale", size: "l", block: true, arrow: true, className: "ks-sf-cta" }],
    ["stories", { cta: "finale", size: "l", block: true, arrow: true }],
    ["story-learning-toys-for-a-three-year-old", { cta: "finale", size: "l", block: true, arrow: true }],
    ["story-what-to-look-for-in-a-safe-ai-toy", { cta: "finale", size: "l", block: true, arrow: true }],
    ["team", { cta: "finale", size: "l" }],
    ["contact", { cta: "finale", size: "l" }],
    ["404", { cta: "finale", size: "l" }],
  ];

  it.each(cases)("%s: %j", (page, props) => {
    expect(renderToStaticMarkup(<PreorderButton label={LABEL} {...props} />)).toBe(mockupButton(page, props.cta));
  });
});
