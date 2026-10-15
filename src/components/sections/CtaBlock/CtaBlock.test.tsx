import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { cta } from "@/content/en-IN/cta";
import { seller } from "@/content/en-IN/seller";
import { TRUST_COMPACT, trustItems, type TrustId } from "@/content/en-IN/trust";
import { buildOffer } from "@/lib/offer/offer";
import { CtaBlock } from "./CtaBlock";
import type { CtaBlockConfig, CtaSecondary, SellingContext } from "./cta-block.types";
import { withSellerFacts } from "../../../../test/e2e/support/seller-facts";
import { addClass, builtMarkup, mockupCtaRun, mockupFold, renderedMarkup, STORE } from "../../../../test/support/mockup-compare";

/* CtaBlock (task 3.2; architecture §5.2 "Compact CTA block"; home.md "CTA block"). Rendered from the real content
   (the offer view model in both modes, content/en-IN/{cta,seller,trust}.ts), so each case proves the content and the
   component together print what the approved mockup prints. */

const TOKEN = buildOffer("token");
const FULL = buildOffer("full");
const context = (offer = TOKEN): SellingContext => ({ offer, ctaLabel: cta.preorder, help: seller.help });
const trust = (ids: readonly TrustId[]) => ids.map((id) => trustItems[id]);
const COMPACT = trust(TRUST_COMPACT);
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
  /* The trust line in place of meet-kheelu.html's five-item row since task Q2.8's review (the D2C plan v2 §1.1; the
     harness reads the mockup's row so, test/support/mockup-compare.ts withPriceLine). */
  ["product close (fold 9)", "meet-kheelu", "#close", { cta: "product-foot", layout: "full", trust: COMPACT, helpLine: true }],
  ["safety close", "safety", "#close", { cta: "finale", arrow: true, block: true, trust: COMPACT, helpLine: true }],
  ["guide close", "ai-toys-for-kids-in-india", "#close", { cta: "finale", arrow: true, block: true, trust: COMPACT, helpLine: true }],
  ["stories hub close", "stories", "#close", { cta: "finale", arrow: true, block: true, layout: "journal", trust: COMPACT, helpLine: true, secondary: SEE_HOW }],
  ["article close (learning toys)", "story-learning-toys-for-a-three-year-old", "#close", { cta: "finale", arrow: true, block: true, layout: "journal", trust: COMPACT, helpLine: true, secondary: SEE_HOW }],
  ["article close (safe AI toy)", "story-what-to-look-for-in-a-safe-ai-toy", "#close", { cta: "finale", arrow: true, block: true, layout: "journal", trust: COMPACT, helpLine: true, secondary: SEE_HOW }],
  ["team close", "team", "#close", { cta: "finale", align: "center", trust: COMPACT, helpLine: true, secondary: SEE_HOW_KHEELU }],
  ["contact close (no help line)", "contact", "#close", { cta: "finale", align: "center", trust: COMPACT, secondary: SEE_HOW_KHEELU }],
  ["404 close", "404", "#close", { cta: "finale", align: "center", trust: COMPACT, helpLine: true }],
];

/* The help lines as D063 item 2 rules them (task Q2.3; test/e2e/support/seller-facts.ts): WhatsApp, the call off. */
describe("CtaBlock: every placement of the approved mockup, exactly", () => {
  it.each(PLACEMENTS)("%s", (_name, slug, fold, config) => {
    const expected = builtMarkup(mockupCtaRun(withSellerFacts(mockupFold(slug, fold))), { renames: RENAMES, adjust: adjustFor(config.layout) });
    expect(renderedMarkup(<CtaBlock {...config} {...context()} />)).toBe(expected);
  });

  /* A trust item draws the icon its config passes, not the content's (the product close passed map-pin for "Delivery
     included anywhere in India" until task Q2.8's review gave that close the trust line). */
  it("draws the icon its config passes for a trust item (no rewrite of the content)", () => {
    const pinned = trust(["delivery-included"]).map((item) => ({ ...item, icon: "map-pin" }));
    const html = renderedMarkup(<CtaBlock {...PLACEMENTS[5][3]} trust={pinned} {...context()} />);
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

  it("links every trust item to its terms with an accessible name, and the help line to WhatsApp, never a call (D063)", () => {
    const { container } = render(<CtaBlock {...hero} {...context()} />);
    // Each to the part of its terms page that keeps the promise (task 7.1a, CMO built-page review C, m8).
    expect(screen.getByRole("link", { name: "Deliveries start mid-November" })).toHaveAttribute("href", "/shipping#when");
    // The one risk-reversal line (task Q2.8; D065 item 3), to the refund page's part that keeps its first promise.
    expect(screen.getByRole("link", { name: "Full refund until dispatch · 7-day returns" })).toHaveAttribute("href", "/refund#before-dispatch");
    // The help line without the call (D063 item 2, task Q2.3), in the D2C plan v2 §1.1's words (task Q2.14).
    expect(screen.getByRole("link", { name: "Message us on WhatsApp" })).toHaveAttribute("href", "https://wa.me/919187546483");
    expect(container.querySelector('a[href^="tel:"]')).toBeNull();
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

/* D065 item 3 (task Q2.8): GST and the payment breakdown only at checkout, so no block beside a button names GST or the
   balance, in either mode; its price line is the short one and its compact trust line ends with the risk-reversal line. */
describe("CtaBlock: the short price line and the risk-reversal line (D065 item 3)", () => {
  it.each(PLACEMENTS)("%s: no GST and no balance, in either mode", (_name, _slug, _fold, config) => {
    for (const offer of [TOKEN, FULL]) {
      const text = render(<CtaBlock {...config} {...context(offer)} />).container.textContent ?? "";
      expect(text).not.toMatch(/GST/);
      expect(text).not.toContain(offer.prices.balance);
    }
  });

  // The D2C plan v2 §1.1: the trust line's item 1 is the risk-reversal line, item 2 the delivery line.
  it("prints the short price line beside the button, and the risk-reversal line first in the compact trust line", () => {
    const { container } = render(<CtaBlock {...PLACEMENTS[0][3]} {...context()} />);
    expect(container.querySelector(".ks-price")?.textContent).toBe("₹499 today, refundable. ₹4,999 in total.");
    expect([...container.querySelectorAll(".kh-trustline a")].map((a) => a.textContent)).toEqual([
      "Full refund until dispatch · 7-day returns",
      "Deliveries start mid-November",
    ]);
  });
});

/* Task Q2.9 (the D2C plan v2 §2.0 and fold 1; the CMO's M1 and M2): Home's hero link "Watch Kheelu ask, in a 30-second
   film" shows on laptops only, from 900 px: under it the founder's 5-line H1 leaves no room for a link and Kheelu on the
   first phone screen. The link is in the HTML at every width (no layout shift, nothing client-side); its actions row
   carries `ks-cta__laptop`, which cta-block.css hides below 900 px. */
describe("CtaBlock: a secondary link for laptops only (task Q2.9)", () => {
  const hero = PLACEMENTS[0][3];
  const FILM: CtaSecondary = { label: "Watch Kheelu ask, in a 30-second film", href: "#learning-by-asking", cta: "hero-film", variant: "ghost", icon: "play", from: "laptop" };
  const CSS = readFileSync(join(process.cwd(), "src/components/sections/CtaBlock/cta-block.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

  it("marks the link's actions row ks-cta__laptop, the link itself as any ghost link, tracked hero-film", () => {
    const { container } = render(<CtaBlock {...hero} secondary={FILM} {...context()} />);
    const link = container.querySelector('[data-ph-capture-attribute-cta="hero-film"]')!;
    expect(link.getAttribute("class")).toBe("kh-btn kh-btn--ghost");
    expect(link).toHaveAttribute("href", "#learning-by-asking");
    expect(link.parentElement?.getAttribute("class")).toBe("kh-section__actions ks-cta__laptop");
    expect(link.firstElementChild?.tagName.toLowerCase()).toBe("svg");
  });

  it("hides that row below 900 px with one rule, and leaves every other secondary link alone", () => {
    expect(CSS).toMatch(/@media \(max-width: 899px\) \{\s*\.ks-cta__laptop \{\s*display: none;\s*\}\s*\}/);
    const plain = render(<CtaBlock {...hero} {...context()} />).container.querySelector(".kh-btn--ghost")!;
    expect(plain.parentElement?.getAttribute("class")).toBe("kh-section__actions");
  });
});

/* The D2C plan v2's build condition C1 (the CMO's review; the guard's part-price-button): the price line after a button is
   a block of its own, never a span inside the button or right after its label, so the two never read as one string. */
describe("CtaBlock: the price line is its own block after the button (C1)", () => {
  it.each(PLACEMENTS)("%s: a p after the button's row, outside the button", (_name, _slug, _fold, config) => {
    const { container } = render(<CtaBlock {...config} {...context()} />);
    const button = container.querySelector(".kh-btn--cta")!;
    const price = container.querySelector(".ks-price")!;
    expect(price.tagName).toBe("P");
    expect(button.contains(price)).toBe(false);
    expect(button.closest(".kh-section__actions")?.contains(price)).toBe(false);
    expect(button.compareDocumentPosition(price) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe("CtaBlock: full mode (the offer after the capped units, ADR-005)", () => {
  const PRICE = /<p( id="[^"]*")? class="kh-body-s ks-price">[^<]*<\/p>/;

  it.each(PLACEMENTS)("%s: the full-mode price line, everything else unchanged", (_name, _slug, _fold, config) => {
    const full = render(<CtaBlock {...config} {...context(FULL)} />).container;
    expect(within(full).getByText("₹7,999 in total, paid in full when you order.")).toHaveClass("kh-body-s", "ks-price");
    expect(full.textContent).not.toMatch(/₹499|₹4,500|₹4,999/);
    const tokenHtml = renderToStaticMarkup(<CtaBlock {...config} {...context(TOKEN)} />);
    const fullHtml = renderToStaticMarkup(<CtaBlock {...config} {...context(FULL)} />);
    expect(fullHtml.match(PRICE)?.[0]).toContain("paid in full when you order.");
    expect(fullHtml.replace(PRICE, "")).toBe(tokenHtml.replace(PRICE, ""));
  });
});
