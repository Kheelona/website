import { describe, expect, it } from "vitest";
import type { Offer } from "@/content/types";
import { leafText, parseRichText, PRICE_KEYS, RichTextError } from "./rich-text";

/* The production placeholder scan (task 2.9) hunts the inline token and the marker
   opening across src/; built in pieces here so a test never reads as open content. */
const ph = (body: string) => "{" + "ph:" + body + "}";
const OPEN = "[" + "PLACEHOLDER";

const offer: Offer = {
  mode: "token",
  headlinePaise: 499_900,
  prices: { token: "₹499", balance: "₹4,500", headline: "₹4,999", full: "₹7,999", mrp: "₹7,999", launch: "₹4,999" },
  sentence: "Reserve yours for {price:token} today.",
  sticky: { big: "{price:token} today", small: "refundable" },
  card: { product: "Kheelu", priceNote: "incl. GST", perks: { home: [], product: [] } },
  plus: "Every Kheelu comes with 6 months of Kheelona+.",
  delivery: "Deliveries start mid-November",
  availabilityStarts: "2026-11-15",
};

const text = (value: string) => ({ kind: "text", text: value });

describe("plain text", () => {
  it("is one text node", () => {
    expect(parseRichText("Ages 3 to 7 (incl. GST), a toy.")).toEqual([text("Ages 3 to 7 (incl. GST), a toy.")]);
  });

  it("is nothing at all when empty", () => {
    expect(parseRichText("")).toEqual([]);
  });
});

describe("each token of architecture §6.2", () => {
  it("{hand:…} is a hand-lettered accent", () => {
    expect(parseRichText("Then it {hand:asks one back.}")).toEqual([
      text("Then it "),
      { kind: "hand", children: [text("asks one back.")] },
    ]);
  });

  it("{mark:…} is a marked word", () => {
    expect(parseRichText("{mark:Conversation} matters.")).toEqual([
      { kind: "mark", children: [text("Conversation")] },
      text(" matters."),
    ]);
  });

  it("{nowrap:…} keeps a phrase on one line", () => {
    expect(parseRichText("Or {nowrap:call +91 91875 46483}")).toEqual([
      text("Or "),
      { kind: "nowrap", children: [text("call +91 91875 46483")] },
    ]);
  });

  it("[label](/path) is an internal link", () => {
    expect(parseRichText("See our [Safety page](/safety).")).toEqual([
      text("See our "),
      { kind: "link", href: "/safety", internal: true, children: [text("Safety page")] },
      text("."),
    ]);
  });

  it("an in-page anchor is internal too", () => {
    expect(parseRichText("[next section](#training)")).toEqual([
      { kind: "link", href: "#training", internal: true, children: [text("next section")] },
    ]);
  });

  it.each([
    ["https://wa.me/919187546483"],
    ["mailto:hello@kheelona.com"],
    ["tel:+919187546483"],
  ])("[label](%s) is an external link", (href) => {
    expect(parseRichText(`[us](${href})`)).toEqual([
      { kind: "link", href, internal: false, children: [text("us")] },
    ]);
  });

  it.each([
    ["/"],
    ["/products/kheelu#faq"],
    ["/stories/learning-toys-for-a-three-year-old"],
    ["/store?utm_source=home&utm_medium=web"],
    ["/og/home.jpg"],
    ["/privacy#src-1"],
  ])("accepts the site path %s", (href) => {
    expect(parseRichText(`[it](${href})`)).toEqual([{ kind: "link", href, internal: true, children: [text("it")] }]);
  });

  it("keeps balanced parentheses inside a link's address", () => {
    const [link] = parseRichText("[it](https://example.org/wiki/Play_(child))");
    expect(link).toMatchObject({ kind: "link", href: "https://example.org/wiki/Play_(child)" });
  });

  it("[^n] is a source marker", () => {
    expect(parseRichText("to early language,[^1] so[^12]")).toEqual([
      text("to early language,"),
      { kind: "source", n: 1 },
      text(" so"),
      { kind: "source", n: 12 },
    ]);
  });

  it.each(PRICE_KEYS.map((key) => [key]))("{price:%s} is an amount from the offer", (key) => {
    expect(parseRichText(`{price:${key}}`)).toEqual([{ kind: "price", key }]);
  });

  it("offers exactly the six price tokens of the plan (launch: task 4.7)", () => {
    expect([...PRICE_KEYS].sort()).toEqual(["balance", "full", "headline", "launch", "mrp", "token"]);
  });

  it("{price:launch} is the launch price a reservation's total stays at, in both modes (task 4.7)", () => {
    expect(parseRichText("the remaining {price:balance} of the {price:launch} price")).toEqual([
      text("the remaining "),
      { kind: "price", key: "balance" },
      text(" of the "),
      { kind: "price", key: "launch" },
      text(" price"),
    ]);
  });

  it("{delivery} is the delivery line", () => {
    expect(parseRichText("{delivery}, anywhere in India.")).toEqual([
      { kind: "delivery" },
      text(", anywhere in India."),
    ]);
  });

  it("the placeholder token is a placeholder with its id and note", () => {
    const [node] = parseRichText(ph("F4 size and weight"));
    expect(node).toMatchObject({ kind: "placeholder", id: "F4", note: "size and weight" });
  });

  it("a placeholder token without an id keeps the whole body as its note", () => {
    const [node] = parseRichText(ph("region"));
    expect(node).toMatchObject({ kind: "placeholder", id: null, note: "region" });
  });
});

describe("nesting", () => {
  it("lets an accent sit inside a no-wrap phrase, as the mockup's headlines do", () => {
    expect(parseRichText("{nowrap:{hand:help},}")).toEqual([
      { kind: "nowrap", children: [{ kind: "hand", children: [text("help")] }, text(",")] },
    ]);
  });

  it("lets a link label hold a no-wrap phrase and a price", () => {
    expect(parseRichText("[{nowrap:pay {price:token}}](/store-terms)")).toEqual([
      {
        kind: "link",
        href: "/store-terms",
        internal: true,
        children: [{ kind: "nowrap", children: [text("pay "), { kind: "price", key: "token" }] }],
      },
    ]);
  });

  it("lets a placeholder sit inside an accent", () => {
    const [hand] = parseRichText(`{mark:${ph("F4 net quantity")}}`);
    expect(hand).toMatchObject({ kind: "mark", children: [{ kind: "placeholder", id: "F4" }] });
  });
});

describe("what the parser refuses, with a message", () => {
  it.each([
    ["an unknown token", "Say {bold:this}.", /unknown token \{bold.*\{hand:…\}/i],
    ["an unclosed token", "Then it {hand:asks", /not closed/i],
    ["a stray closing brace", "Done } here", /unmatched \}/i],
    ["a brace that starts no token", "Set { here }", /\{ at 4/i],
    ["an empty pair of braces", "Set {} here", /\{ at 4/i],
    ["a price that is not one of the five", "{price:tokens}", /price.*token, balance, headline, full, mrp/i],
    ["a price with spacing", "{price: token}", /price/i],
    ["a body on the delivery token", "{delivery:soon}", /delivery/i],
    ["an accent with no body", "{hand}", /hand/i],
    ["an empty accent", "{hand:}", /empty/i],
    ["a bracket that starts no link", "[label] (/safety)", /\[label\]\(href\)/],
    ["a page copied from the mockup", "[Refunds](refund.html)", /site path/i],
    ["a site path that keeps the mockup's .html", "[Refunds](/refund.html)", /site path such as \/refund, not/i],
    ["a backslash browsers read as another site", "[R](/\\evil.com)", /site path such as \/refund, not/i],
    ["a second slash, another site", "[R](//evil.com)", /site path such as \/refund, not/i],
    ["a quote in a site path", '[R](/a"x)', /site path such as \/refund, not/i],
    ["markup in a site path", "[R](/a<b>)", /site path such as \/refund, not/i],
    ["a quote in an anchor", '[R](#a"x)', /anchor/i],
    ["an anchor with a second #", "[R](#a#b)", /anchor/i],
    ["plain http", "[it](http://example.org)", /use https:\/\/ for the link/i],
    ["a script address", "[it](javascript:alert(1))", /unsupported link address/i],
    ["spaces in an address", "[it](/a b)", /space/i],
    ["an unclosed address", "[it](/safety", /not closed/i],
    ["an empty link label", "[](/safety)", /empty/i],
    ["a link inside a link", "[a [b](/x)](/y)", /inside a link/i],
    ["a source marker inside a link", "[see[^1]](/x)", /inside a link/i],
    ["source number zero", "a[^0]", /source/i],
    ["a source marker with no number", "a[^b]", /source/i],
    ["an unclosed source marker", "a[^1", /source/i],
    ["a stray closing bracket", "a ] b", /unmatched \]/i],
  ])("refuses %s", (_label, source, message) => {
    expect(() => parseRichText(source)).toThrow(RichTextError);
    expect(() => parseRichText(source)).toThrow(message);
  });

  it("refuses an empty placeholder and an id with no note", () => {
    expect(() => parseRichText(ph(""))).toThrow(/empty/i);
    expect(() => parseRichText(ph("F4"))).toThrow(/note/i);
  });

  it("tells the author to use the token instead of a typed placeholder marker", () => {
    expect(() => parseRichText(`Size: ${OPEN} F4: size]`)).toThrow(new RegExp("\\{" + "ph:ID note\\}"));
  });

  it("says where the problem is, and quotes the string", () => {
    expect(() => parseRichText("Then it {hand:asks")).toThrow(/at 8 in "Then it \{hand:asks"/);
  });
});

describe("leafText: the visible text of each leaf", () => {
  it("is the offer's amount for a price", () => {
    expect(leafText({ kind: "price", key: "balance" }, offer)).toBe("₹4,500");
    expect(leafText({ kind: "price", key: "mrp" }, offer)).toBe("₹7,999");
  });

  it("is the offer's delivery line for {delivery}", () => {
    expect(leafText({ kind: "delivery" }, offer)).toBe("Deliveries start mid-November");
  });

  it("is the bracketed number for a source marker", () => {
    expect(leafText({ kind: "source", n: 3 }, undefined)).toBe("[3]");
  });

  it("is the marker for a placeholder", () => {
    const [node] = parseRichText(ph("C6 app store links"));
    expect(leafText(node as Parameters<typeof leafText>[0], undefined)).toBe(`${OPEN} C6: app store links]`);
  });

  it("refuses to render an amount or the delivery line without an offer", () => {
    expect(() => leafText({ kind: "price", key: "token" }, undefined)).toThrow(/offer/i);
    expect(() => leafText({ kind: "delivery" }, undefined)).toThrow(/offer/i);
  });
});
