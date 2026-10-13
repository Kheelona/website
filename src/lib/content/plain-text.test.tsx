import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Offer } from "@/content/types";
import { placeholder as ph } from "./placeholder";
import { toPlainText } from "./plain-text";
import { leafText, parseRichText, RichTextError, type RichNode } from "./rich-text";

/* The production placeholder scan (task 2.9) hunts the inline token and the marker
   opening across src/; built in pieces here so a test never reads as open content. */
const token = (body: string) => "{" + "ph:" + body + "}";
const OPEN = "[" + "PLACEHOLDER";

const prices = { token: "₹499", balance: "₹4,500", full: "₹7,999", mrp: "₹7,999", launch: "₹4,999" };
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

/** The D028 price sentence as the copy pages hold it, one version per mode. */
const priceSentence = {
  token:
    "Reserve yours for {price:token} today, refundable until dispatch, then pay {price:balance} before delivery: {price:headline} in total (incl. GST).",
  full: "{price:full} (incl. GST), paid in full when you order.",
};

describe("toPlainText", () => {
  it("leaves a string with no tokens as it is", () => {
    expect(toPlainText("Kheelu is made for children aged 3 to 7.")).toBe("Kheelu is made for children aged 3 to 7.");
  });

  it("keeps the words of accents and no-wrap phrases and drops their markup", () => {
    expect(toPlainText("Then it {hand:asks one back.} {nowrap:{hand:help},}")).toBe("Then it asks one back. help,");
  });

  it("keeps a link's label and drops its address", () => {
    expect(toPlainText("See our [Safety page](/safety) or [WhatsApp](https://wa.me/919187546483).")).toBe(
      "See our Safety page or WhatsApp.",
    );
  });

  it("prints a source marker as its visible number", () => {
    expect(toPlainText("to early language,[^1] so[^2]")).toBe("to early language,[1] so[2]");
  });

  it("resolves the token-mode price sentence exactly as the approved mockup prints it", () => {
    expect(toPlainText(priceSentence, tokenOffer)).toBe(
      "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST).",
    );
  });

  it("resolves the full-mode price sentence exactly as the copy page words it", () => {
    expect(toPlainText(priceSentence, fullOffer)).toBe("₹7,999 (incl. GST), paid in full when you order.");
  });

  it("follows the mode for the headline price", () => {
    expect(toPlainText("Kheelu is {price:headline} (incl. GST)", tokenOffer)).toBe("Kheelu is ₹4,999 (incl. GST)");
    expect(toPlainText("Kheelu is {price:headline} (incl. GST)", fullOffer)).toBe("Kheelu is ₹7,999 (incl. GST)");
  });

  it("prints the delivery line from the offer", () => {
    expect(toPlainText("{delivery}, anywhere in India.", tokenOffer)).toBe(
      "Deliveries start mid-November, anywhere in India.",
    );
  });

  it("prints an inline placeholder as its marker", () => {
    expect(toPlainText(`Size: ${token("F4 size and weight")}`)).toBe(`Size: ${OPEN} F4: size and weight]`);
  });

  it("prints a placeholder held in data as its marker", () => {
    expect(toPlainText(ph(null, "which phones the parent app runs on"))).toBe(
      `${OPEN}: which phones the parent app runs on]`,
    );
  });

  it("refuses copy that changes with the mode when no offer is given", () => {
    expect(() => toPlainText(priceSentence)).toThrow(/mode/i);
  });

  it("refuses an amount when no offer is given", () => {
    expect(() => toPlainText("{price:token} today")).toThrow(/offer/i);
  });

  it("passes on a syntax error instead of printing broken text", () => {
    expect(() => toPlainText("Then it {hand:asks")).toThrow(RichTextError);
  });
});

/* ── Round trip: parse → render → visible text equals the serialiser ─────────
   A renderer that follows the approved mockup's markup for each node, as
   ui/RichText (task 2.2) will. Whatever the markup, the words a parent sees
   must be the words JSON-LD, meta descriptions and llms.txt publish. */

function Nodes({ nodes, offer }: { nodes: readonly RichNode[]; offer?: Offer }) {
  return (
    <>
      {nodes.map((node, index) => (
        <Node key={index} node={node} offer={offer} />
      ))}
    </>
  );
}

function Node({ node, offer }: { node: RichNode; offer?: Offer }) {
  switch (node.kind) {
    case "hand":
    case "mark":
      return (
        <span className={`kh-${node.kind}`}>
          <Nodes nodes={node.children} offer={offer} />
        </span>
      );
    case "nowrap":
      return (
        <span className="ks-nowrap">
          <Nodes nodes={node.children} offer={offer} />
        </span>
      );
    case "link":
      return (
        <a href={node.href}>
          <Nodes nodes={node.children} offer={offer} />
        </a>
      );
    case "source":
      return (
        <a className="ks-src" href={`#src-${node.n}`} aria-label={`Source ${node.n}`}>
          {leafText(node, offer)}
        </a>
      );
    case "placeholder":
      return <span className="ks-placeholder">{leafText(node, offer)}</span>;
    default:
      return <>{leafText(node, offer)}</>;
  }
}

describe("round trip", () => {
  it.each([
    ["Then it {hand:asks one back.}", "Then it asks one back."],
    ["{nowrap:{hand:help},} not {mark:hype}", "help, not hype"],
    [
      "Questions? [WhatsApp](https://wa.me/919187546483) or [{nowrap:call +91 91875 46483}](tel:+919187546483)",
      "Questions? WhatsApp or call +91 91875 46483",
    ],
    ["back-and-forth talk,[^1] so the best toys[^2]", "back-and-forth talk,[1] so the best toys[2]"],
    [priceSentence.token, "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST)."],
    ["Its MRP is {price:mrp} (incl. of all taxes).", "Its MRP is ₹7,999 (incl. of all taxes)."],
    ["{delivery}. [Shipping](/shipping)", "Deliveries start mid-November. Shipping"],
    [`Battery: ${token("F4 battery life per charge")}`, `Battery: ${OPEN} F4: battery life per charge]`],
    [`Where: ${token("region")}`, `Where: ${OPEN}: region]`],
    // characters that mean something in HTML stay words, never markup
    ["Fish & chips <b>not bold</b> \"quoted\"", "Fish & chips <b>not bold</b> \"quoted\""],
  ])("%j renders and serialises to the same words", (source, expected) => {
    const { container } = render(<Nodes nodes={parseRichText(source)} offer={tokenOffer} />);
    expect(container.textContent).toBe(expected);
    expect(toPlainText(source, tokenOffer)).toBe(expected);
  });

  it("holds in full mode too", () => {
    const source = priceSentence.full;
    const { container } = render(<Nodes nodes={parseRichText(source)} offer={fullOffer} />);
    expect(container.textContent).toBe("₹7,999 (incl. GST), paid in full when you order.");
    expect(toPlainText(priceSentence, fullOffer)).toBe(container.textContent);
  });
});
