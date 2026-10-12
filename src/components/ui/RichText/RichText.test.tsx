import postcss from "postcss";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Offer } from "@/content/types";
import { placeholder as ph } from "@/lib/content/placeholder";
import { toPlainText } from "@/lib/content/plain-text";
import { RichTextError } from "@/lib/content/rich-text";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { RichText } from "./RichText";

/** The declarations of the top-level rule with exactly these selectors, in order. */
function declarations(path: string, selector: string): string[] {
  const out: string[] = [];
  postcss.parse(readRepoFile(path)).each((node) => {
    if (node.type === "rule" && node.selectors.join(", ") === selector) {
      node.each((d) => void (d.type === "decl" && out.push(`${d.prop}: ${d.value}`)));
    }
  });
  return out;
}

vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({ href, children, ...rest }: { href: string; children?: React.ReactNode } & Record<string, unknown>) =>
      React.createElement("a", { href, "data-next-link": "", ...rest }, children),
  };
});

/* The production placeholder scan (task 2.9) hunts the inline token and the marker opening across src/;
   built in pieces here so a test never reads as open content. */
const token = (body: string) => "{" + "ph:" + body + "}";
const OPEN = "[" + "PLACEHOLDER";

const prices = { token: "₹499", balance: "₹4,500", full: "₹7,999", mrp: "₹7,999" };
const tokenOffer: Offer = {
  mode: "token",
  headlinePaise: 499_900,
  prices: { ...prices, headline: "₹4,999" },
  sentence: "",
  sticky: { big: "", small: "" },
  card: { product: "Kheelu", priceNote: "incl. GST", perks: { home: [], product: [] } },
  plus: "",
  delivery: "Deliveries start mid-November",
  availabilityStarts: "2026-11-15",
};
const fullOffer: Offer = { ...tokenOffer, mode: "full", headlinePaise: 799_900, prices: { ...prices, headline: "₹7,999" } };

const html = (node: React.ReactElement) => renderToStaticMarkup(node);

describe("RichText: the inline syntax rendered as the mockup marks it up", () => {
  it("renders plain words as they are, with no wrapper of its own", () => {
    expect(html(<RichText text="Real children, real families." />)).toBe("Real children, real families.");
  });

  it("wraps the text in the element, class and id it is given", () => {
    expect(html(<RichText as="p" className="kh-body-s ks-price" id="hero-price" text="Hello" />)).toBe(
      '<p class="kh-body-s ks-price" id="hero-price">Hello</p>',
    );
  });

  it("renders the hand-lettered accent (home.html fold 1 h1)", () => {
    expect(html(<RichText text="Kheelu answers every why. Then it {hand:asks one back.}" />)).toBe(
      'Kheelu answers every why. Then it <span class="kh-hand">asks one back.</span>',
    );
  });

  it("renders the crayon mark and a no-wrap phrase", () => {
    expect(html(<RichText text="{mark:Conversation} helps, {nowrap:ages 3 to 7}" />)).toBe(
      '<span class="kh-mark">Conversation</span> helps, <span class="ks-nowrap">ages 3 to 7</span>',
    );
  });

  it("puts the no-wrap class on a link it wraps alone, as the hero help line does (home.html:16)", () => {
    expect(
      html(<RichText text="Questions? [WhatsApp](https://wa.me/919187546483) or {nowrap:[call +91 91875 46483](tel:+919187546483)}" />),
    ).toBe(
      'Questions? <a href="https://wa.me/919187546483">WhatsApp</a> or <a href="tel:+919187546483" class="ks-nowrap">call +91 91875 46483</a>',
    );
  });

  it("keeps a span when a no-wrap phrase holds more than a link", () => {
    expect(html(<RichText text="{nowrap:or [call](tel:+919187546483)}" />)).toBe(
      '<span class="ks-nowrap">or <a href="tel:+919187546483">call</a></span>',
    );
  });

  it("routes site paths through next/link and leaves anchors and other addresses plain", () => {
    render(<RichText text="[Refunds](/refund), [FAQ](#faq), [email](mailto:hello@kheelona.com)" />);
    expect(screen.getByRole("link", { name: "Refunds" })).toHaveAttribute("data-next-link");
    expect(screen.getByRole("link", { name: "FAQ" })).not.toHaveAttribute("data-next-link");
    expect(screen.getByRole("link", { name: "email" })).toHaveAttribute("href", "mailto:hello@kheelona.com");
  });

  it("renders a source marker as the mockup does, with the word it is given", () => {
    expect(html(<RichText text="to early language,[^1] so" sources={{ label: "Source" }} />)).toBe(
      'to early language,<a class="ks-src" href="#src-1" aria-label="Source 1">[1]</a> so',
    );
  });

  it("passes the article variant to every marker", () => {
    const { container } = render(<RichText text="a[^1][^2]" sources={{ label: "Source", variant: "article" }} />);
    expect([...container.querySelectorAll("a")].map((a) => a.className)).toEqual([
      "ks-src ks-src--article",
      "ks-src ks-src--article",
    ]);
  });

  it("refuses a source marker when the section gave no sources", () => {
    expect(() => html(<RichText text="a fact.[^1]" />)).toThrow(/source marker/);
  });

  it("renders an inline placeholder with the dashed placeholder style", () => {
    expect(html(<RichText text={`Size and weight: ${token("F4 size and weight")}`} />)).toBe(
      `Size and weight: <span class="ks-placeholder">${OPEN} F4: size and weight]</span>`,
    );
  });

  it("renders a placeholder value from content data", () => {
    expect(html(<RichText as="dd" text={ph("F4", "battery")} />)).toBe(`<dd><span class="ks-placeholder">${OPEN} F4: battery]</span></dd>`);
  });

  it("refuses a string that breaks the syntax, so a typo fails the build", () => {
    expect(() => html(<RichText text="{hand:open" />)).toThrow(RichTextError);
  });
});

describe("RichText: prices and modes come from the offer", () => {
  const sentence = {
    token:
      "Reserve yours for {price:token} today, refundable until dispatch, then pay {price:balance} before delivery: {price:headline} in total (incl. GST).",
    full: "{price:full} (incl. GST), paid in full when you order.",
  };

  it("resolves the token-mode price sentence exactly as home.html prints it", () => {
    expect(html(<RichText text={sentence} offer={tokenOffer} />)).toBe(
      "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST).",
    );
  });

  it("resolves the full-mode sentence", () => {
    expect(html(<RichText text={sentence} offer={fullOffer} />)).toBe("₹7,999 (incl. GST), paid in full when you order.");
  });

  it("prints a sentence with amounts as one text, without React's text separators in the server HTML", () => {
    // renderToString is what a page's HTML goes through; adjacent text nodes there get a <!-- --> between them.
    expect(renderToString(<RichText as="p" text={sentence} offer={tokenOffer} />)).toBe(
      "<p>Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST).</p>",
    );
    expect(renderToString(<RichText text="{delivery} · {hand:asks {price:token} back}" offer={tokenOffer} />)).toBe(
      'Deliveries start mid-November · <span class="kh-hand">asks ₹499 back</span>',
    );
  });

  it("renders the delivery line", () => {
    expect(html(<RichText text="{delivery}" offer={tokenOffer} />)).toBe("Deliveries start mid-November");
  });

  it("refuses an amount or a mode variant without the offer, rather than guess a price", () => {
    expect(() => html(<RichText text="Only {price:token} today" />)).toThrow(/offer/);
    expect(() => html(<RichText text={sentence} />)).toThrow(/offer mode/);
  });

  it("shows exactly the words the plain-text serialiser gives JSON-LD and meta", () => {
    const text = `Then it {hand:asks one back.} Pay {price:headline}[^1] or [ask us](/contact) ${token("C6 app store links")} {nowrap:{mark:now}}.`;
    const { container } = render(<RichText as="p" text={text} offer={tokenOffer} sources={{ label: "Source" }} />);
    expect(container.textContent).toBe(toPlainText(text, tokenOffer));
  });
});

describe("RichText CSS", () => {
  const CSS = "src/components/ui/RichText/rich-text.css";

  it("ports the no-wrap helper (mockup.css:32)", () => {
    expect(declarations(CSS, ".ks-nowrap")).toEqual(["white-space: nowrap"]);
    expect(declarations(CSS, ".ks-nowrap")).toEqual(declarations("mockup/mockup.css", ".mk-nowrap"));
  });

  it("ports the link colour in captions and small text (mockup.css:105)", () => {
    const selector = ".kh-caption a, .kh-body-s a:not(.kh-btn)";
    expect(declarations(CSS, selector)).toEqual(["color: var(--link)"]);
    expect(declarations(CSS, selector)).toEqual(declarations("mockup/mockup.css", selector));
  });
});
