import { render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { cta } from "@/content/en-IN/cta";
import { seller } from "@/content/en-IN/seller";
import { TRUST_COMPACT, TRUST_FULL, trustItems, type TrustId } from "@/content/en-IN/trust";
import { buildOffer } from "@/lib/offer/offer";
import { CtaBlock } from "./CtaBlock";
import type { CtaBlockConfig, CtaSecondary, SellingContext } from "./cta-block.types";
import { addClass, builtMarkup, mockupCtaRun, mockupFold, renderedMarkup, STORE } from "../../../../test/support/mockup-compare";

/* CtaBlock (task 3.2; architecture §5.2 "Compact CTA block"; home.md "CTA block"). Rendered from the real content
   (the offer view model in both modes, content/en-IN/{cta,seller,trust}.ts), so each case proves the content and the
   component together print what the approved mockup prints. */

const TOKEN = buildOffer("token");
const FULL = buildOffer("full");
const context = (offer = TOKEN): SellingContext => ({ offer, ctaLabel: cta.preorder, help: seller.help });
const trust = (ids: readonly TrustId[]) => ids.map((id) => trustItems[id]);
const COMPACT = trust(TRUST_COMPACT);
/* The product close draws "Delivery included anywhere in India" with map-pin, as meet-kheelu.html does; the content keeps
   one icon per item (Home's package), so the product page's config passes map-pin for that item (wave-3 close ruling;
   task 5.2's config). */
const PRODUCT_CLOSE_TRUST = trust(["deliveries-start", ...TRUST_FULL]).map((item) => (item.id === "delivery-included" ? { ...item, icon: "map-pin" } : item));
const secondary = (id: keyof typeof cta.secondary, variant: CtaSecondary["variant"]): CtaSecondary => ({ ...cta.secondary[id], variant });
/* The untracked ghost links of the closes (the copy names no CTA value for them). */
const SEE_HOW: CtaSecondary = { label: "See how it works", href: "/products/kheelu", variant: "ghost", iconEnd: "arrow-right" };
const SEE_HOW_KHEELU: CtaSecondary = { ...SEE_HOW, label: "See how Kheelu works" };

/* The build's documented differences from the mockup markup in a CTA block (besides the harness's, test/support/mockup-compare.ts):
   - every chilli button of a CTA block carries ks-cta__button: the four page-only rules that make a phone-width
     button inline from 720 px (mockup.css:85, safety.css:51, ai-toys-for-kids-in-india.css:49, stories.css:130) are
     one rule on that class, so the page names mk-sf-cta, mk-gd-cta and mk-close-cta (no rule of its own) go;
   - the arrow carries the D049 pick 6 hook ks-btn__arrow (Button, task 2.2);
   - a centred trust line carries TrustLine's own centring class (mockup.css:97 ported in trust-line.css, task 2.4);
   - the product close's full row (mk-close-trust, meet-kheelu.css:104) and help line (#close .mk-help, :105) take the
     CtaBlock "full" layout's classes. */
const RENAMES = { "sf-cta": [], "gd-cta": [], "close-cta": [], "close-trust": ["ks-cta__full-trust"] };
const adjustFor = (layout: CtaBlockConfig["layout"]) => (el: Element) => {
  addClass(el, ".kh-btn--cta", "ks-cta__button");
  addClass(el, ".kh-btn--cta > svg", "ks-btn__arrow");
  addClass(el, ".ks-beside--center .kh-trustline", "ks-trustline--center");
  if (layout === "full") addClass(el, ".ks-help", "ks-cta__full-help");
};

type Placement = [name: string, slug: string, fold: string, config: CtaBlockConfig];
const PLACEMENTS: Placement[] = [
  ["Home hero (fold 1)", "home", 'section[aria-labelledby="hero-title"]', { cta: "hero", id: "hero-cta", priceId: "hero-price", arrow: true, block: true, layout: "stack", trust: COMPACT, helpLine: true, secondary: secondary("hero-learn", "ghost") }],
  ["Home films (fold 2)", "home", 'section[aria-labelledby="ask-title"]', { cta: "see-it-ask", align: "center", trust: COMPACT, secondary: secondary("see-it-ask-learn", "ghost") }],
  ["Home safety (fold 6)", "home", 'section[aria-labelledby="safety-title"]', { cta: "safety", align: "center", trust: COMPACT, secondary: secondary("safety-learn", "secondary") }],
  ["product hero (fold 1)", "meet-kheelu", 'section[aria-labelledby="hero-title"]', { cta: "product-top", arrow: true, block: true, layout: "stack", trust: COMPACT, helpLine: true }],
  ["product safety (fold 6)", "meet-kheelu", "#safety", { cta: "product-safety", align: "center", trust: COMPACT, secondary: secondary("product-safety-learn", "secondary") }],
  ["product close (fold 9)", "meet-kheelu", "#close", { cta: "product-foot", layout: "full", trust: PRODUCT_CLOSE_TRUST, helpLine: true }],
  ["safety close", "safety", "#close", { cta: "finale", arrow: true, block: true, trust: COMPACT, helpLine: true }],
  ["guide close", "ai-toys-for-kids-in-india", "#close", { cta: "finale", arrow: true, block: true, trust: COMPACT, helpLine: true }],
  ["stories hub close", "stories", "#close", { cta: "finale", arrow: true, block: true, layout: "journal", trust: COMPACT, helpLine: true, secondary: SEE_HOW }],
  ["article close (learning toys)", "story-learning-toys-for-a-three-year-old", "#close", { cta: "finale", arrow: true, block: true, layout: "journal", trust: COMPACT, helpLine: true, secondary: SEE_HOW }],
  ["article close (safe AI toy)", "story-what-to-look-for-in-a-safe-ai-toy", "#close", { cta: "finale", arrow: true, block: true, layout: "journal", trust: COMPACT, helpLine: true, secondary: SEE_HOW }],
  ["team close", "team", "#close", { cta: "finale", align: "center", trust: COMPACT, helpLine: true, secondary: SEE_HOW_KHEELU }],
  ["contact close (no help line)", "contact", "#close", { cta: "finale", align: "center", trust: COMPACT, secondary: SEE_HOW_KHEELU }],
  ["404 close", "404", "#close", { cta: "finale", align: "center", trust: COMPACT, helpLine: true }],
];

describe("CtaBlock: every placement of the approved mockup, exactly", () => {
  it.each(PLACEMENTS)("%s", (_name, slug, fold, config) => {
    const expected = builtMarkup(mockupCtaRun(mockupFold(slug, fold)), { renames: RENAMES, adjust: adjustFor(config.layout) });
    expect(renderedMarkup(<CtaBlock {...config} {...context()} />)).toBe(expected);
  });

  it("the product close draws the map-pin its config passes, as the mockup (no rewrite of the mockup)", () => {
    const html = renderedMarkup(<CtaBlock {...PLACEMENTS[5][3]} {...context()} />);
    expect(html).toContain(ICON_PATHS["map-pin"]);
    expect(html).not.toContain(ICON_PATHS.package);
  });
});

describe("CtaBlock: the block", () => {
  const hero = PLACEMENTS[0][3];

  it("keeps the CMO order: button, price sentence, trust line, help line, secondary", () => {
    const { container } = render(<CtaBlock {...PLACEMENTS[6][3]} secondary={SEE_HOW} {...context()} />);
    const order = [...container.querySelectorAll(".kh-btn--cta, .ks-price, .kh-trustline, .ks-help, .kh-btn--ghost")].map((el) =>
      el.matches(".kh-btn--cta") ? "button" : el.matches(".ks-price") ? "price" : el.matches(".kh-trustline") ? "trust" : el.matches(".ks-help") ? "help" : "secondary",
    );
    expect(order).toEqual(["button", "price", "trust", "help", "secondary"]);
  });

  it("is one chilli link to the store, named by the one label, with the placement's CTA value", () => {
    render(<CtaBlock {...hero} {...context()} />);
    const button = screen.getByRole("link", { name: "Pre-order Kheelu" });
    expect(button).toHaveAttribute("href", STORE);
    expect(button).toHaveAttribute("data-ph-capture-attribute-cta", "hero");
    expect(button).toHaveAttribute("id", "hero-cta");
    expect(screen.getAllByRole("link").filter((a) => a.classList.contains("kh-btn--cta"))).toHaveLength(1);
  });

  it("draws the arrow only where the placement asks for it", () => {
    const arrowed = render(<CtaBlock {...hero} {...context()} />).container;
    expect(arrowed.querySelectorAll(".kh-btn--cta .ks-btn__arrow")).toHaveLength(1);
    const plain = render(<CtaBlock {...PLACEMENTS[2][3]} {...context()} />).container;
    expect(plain.querySelector(".kh-btn--cta svg")).toBeNull();
  });

  it("is full width on phones only where the mockup says so (block), with the class that makes it inline from 720 px", () => {
    const block = render(<CtaBlock {...hero} {...context()} />).container.querySelector(".kh-btn--cta");
    expect(block).toHaveClass("kh-btn--block", "ks-cta__button");
    const inline = render(<CtaBlock {...PLACEMENTS[2][3]} {...context()} />).container.querySelector(".kh-btn--cta");
    expect(inline).not.toHaveClass("kh-btn--block");
  });

  it("links every trust item to its terms with an accessible name, and the help line to WhatsApp and the phone", () => {
    render(<CtaBlock {...hero} {...context()} />);
    expect(screen.getByRole("link", { name: "Deliveries start mid-November" })).toHaveAttribute("href", "/shipping");
    expect(screen.getByRole("link", { name: "7-day returns, no questions asked" })).toHaveAttribute("href", "/refund");
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", "https://wa.me/919187546483");
    expect(screen.getByRole("link", { name: "call +91 91875 46483" })).toHaveAttribute("href", "tel:+919187546483");
  });

  /* Task 3.6 item 6: the help line's words are content (`Copy`), which may change with the offer mode or name the
     delivery line, so the help line renders them with the page's offer, as every other line of the block does. */
  it("renders the help line with the offer: copy that changes with the mode, and the {delivery} token", () => {
    const help = { lead: { token: "Questions before you pay the advance?", full: "Questions before you pay?" }, contact: "{delivery}. [WhatsApp](https://wa.me/919187546483)" };
    const token = render(<CtaBlock {...hero} offer={TOKEN} ctaLabel={cta.preorder} help={help} />).container.querySelector(".ks-help");
    expect(token).toHaveTextContent("Questions before you pay the advance?");
    expect(token?.textContent).toContain(`${TOKEN.delivery}.`);
    const full = render(<CtaBlock {...hero} offer={FULL} ctaLabel={cta.preorder} help={help} />).container.querySelector(".ks-help");
    expect(full).toHaveTextContent("Questions before you pay?");
  });

  it("leaves the help line out where the mockup has none (contact close, Home folds 2 and 6)", () => {
    const { container } = render(<CtaBlock {...PLACEMENTS[12][3]} {...context()} />);
    expect(container.querySelector(".ks-help")).toBeNull();
  });

  it("renders a ghost secondary exactly as kh-btn kh-btn--ghost (wave-2 close), tracked only when it has a value", () => {
    const tracked = render(<CtaBlock {...hero} {...context()} />).container.querySelector(".kh-btn--ghost");
    expect(tracked?.getAttribute("class")).toBe("kh-btn kh-btn--ghost");
    expect(tracked).toHaveAttribute("data-ph-capture-attribute-cta", "hero-learn");
    const untracked = render(<CtaBlock {...PLACEMENTS[11][3]} {...context()} />).container.querySelector(".kh-btn--ghost");
    expect(untracked).not.toHaveAttribute("data-ph-capture-attribute-cta");
    expect(untracked).toHaveAttribute("href", "/products/kheelu");
  });

  it("never moves on arrival: nothing in the block carries data-reveal (architecture §11.2)", () => {
    for (const [, , , config] of PLACEMENTS) {
      expect(renderToStaticMarkup(<CtaBlock {...config} {...context()} />)).not.toContain("data-reveal");
    }
  });

  it("refuses a secondary value on the chilli button (Button, task 2.2)", () => {
    expect(() => renderToStaticMarkup(<CtaBlock {...hero} cta="hero-learn" {...context()} />)).toThrow(/secondary value/);
  });
});

describe("CtaBlock: full mode (the offer after the capped units, ADR-005)", () => {
  const PRICE = /<p( id="[^"]*")? class="kh-body-s ks-price">[^<]*<\/p>/;

  it.each(PLACEMENTS)("%s: the full-mode price sentence, everything else unchanged", (_name, _slug, _fold, config) => {
    const full = render(<CtaBlock {...config} {...context(FULL)} />).container;
    expect(within(full).getByText("₹7,999 (incl. GST), paid in full when you order.")).toHaveClass("kh-body-s", "ks-price");
    expect(full.textContent).not.toMatch(/₹499|₹4,500|₹4,999/);
    const tokenHtml = renderToStaticMarkup(<CtaBlock {...config} {...context(TOKEN)} />);
    const fullHtml = renderToStaticMarkup(<CtaBlock {...config} {...context(FULL)} />);
    expect(fullHtml.match(PRICE)?.[0]).toContain("paid in full when you order.");
    expect(fullHtml.replace(PRICE, "")).toBe(tokenHtml.replace(PRICE, ""));
  });
});
