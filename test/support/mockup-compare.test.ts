import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  addClass,
  asBuilt,
  builtMarkup,
  canonical,
  mockupCtaRun,
  mockupDiff,
  mockupFold,
  mockupLinks,
  mockupPage,
  mockupRoute,
  outline,
  parseMockup,
  portClass,
  skeleton,
  STORE,
  withPriceLine,
  without,
  words,
} from "./mockup-compare";
import { PRICE_LINE, PRICE_LINE_HIDDEN, PRICE_LINE_TEXT } from "../e2e/support/deviations";
import { sentenceDiff, sentences } from "../e2e/support/parity";
import { ROOT, readRepoFile } from "../e2e/support/repo";
import { blockSentences } from "./mockup-facts";

/* The one mockup comparison harness (task 3.6 items 5 and 14). Every section and shell parity test reads the approved
 * mockup and compares through it, so if it stopped reporting a difference those tests would pass on any markup: this
 * proves it reads the right thing, ports only what it is told to, and reports each kind of difference (the controls). */

const html = (markup: string): Element => {
  const el = new DOMParser().parseFromString(`<body>${markup}</body>`, "text/html").body.firstElementChild;
  if (!el) throw new Error(`no element in ${markup}`);
  return el;
};

describe("reading the mockup", () => {
  it("mockupFold reads one element of a built mockup page by selector, the index-th match when asked", () => {
    const answer = mockupFold("story-learning-toys-for-a-three-year-old", "section[aria-labelledby='answer-title']");
    expect(answer.tagName).toBe("SECTION");
    expect(answer.querySelector("h2")?.textContent).toBe("What are the best learning toys for a 3-year-old?");
    expect(mockupFold("home", "section", 1)).toBe(mockupPage("home").querySelectorAll("section")[1]);
  });

  it("fails loudly when the selector finds nothing, so a test can never compare against an empty fold", () => {
    expect(() => mockupFold("404", ".nothing-here")).toThrow(/mockup\/404\.html: no element matches \.nothing-here/);
    expect(() => mockupFold("home", "main", 1)).toThrow(/no element matches main \(#1\)/);
  });

  it("parses a page once for reading (mockupPage), fresh for changing (parseMockup)", () => {
    expect(mockupPage("home")).toBe(mockupPage("home"));
    const fresh = parseMockup("home");
    expect(fresh).not.toBe(mockupPage("home"));
    fresh.querySelector("main")!.remove();
    expect(mockupPage("home").querySelector("main")).not.toBeNull();
  });

  it("mockupCtaRun: the actions row holding the chilli button and every element after it in its column", () => {
    const run = mockupCtaRun(mockupFold("home", 'section[aria-labelledby="hero-title"]'));
    expect(run[0].querySelector(".kh-btn--cta")).not.toBeNull();
    expect(run.map((el) => el.parentElement)).toEqual(run.map(() => run[0].parentElement));
    expect(() => mockupCtaRun(html("<section><p>no button</p></section>"))).toThrow(/no actions row/);
  });
});

/* Task Q2.8 (D065 item 3; deviations.ts PRICE_LINE): every mockup a unit test reads carries the selling pages' price
   lines as the build prints them, and the checkout's as approved. */
describe("reading the mockup with task Q2.8's price lines (withPriceLine)", () => {
  const { sentence, cardNote, bar, returns, delivery } = PRICE_LINE;
  const text = (el: Element | null | undefined) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();
  /** A trust line's link words, without the store's visually hidden new-tab note. */
  const linkWords = (list: Element) =>
    [...list.querySelectorAll(":scope > li > a")].map((a) => {
      const copy = a.cloneNode(true) as Element;
      copy.querySelectorAll(".kh-sr").forEach((n) => n.remove());
      return text(copy);
    });

  it("prints the short price line beside every button, in the drawer and as the offer card's fine print", () => {
    const home = parseMockup("home");
    const lines = [...home.querySelectorAll(".mk-price, .kh-offer__fine"), home.querySelector(".kh-drawer__note")];
    expect(lines.length).toBeGreaterThanOrEqual(5);
    for (const el of lines) expect(text(el)).toBe(sentence.build);
    expect(home.body.textContent).not.toContain("Reserve yours for");
  });

  it("takes the offer card's note off and says in total on the buy bar", () => {
    const home = parseMockup("home");
    expect(text(home.querySelector(".kh-offer__prices"))).toBe("₹4,999");
    expect([...home.querySelectorAll(".kh-offer__prices > .kh-body-s")].map(text)).not.toContain(cardNote);
    expect(text(home.querySelector(".kh-buybar__small"))).toBe(bar.build);
  });

  it("puts the risk-reversal line in each compact trust line and the drawer's note; the full row keeps the returns promise", () => {
    const home = parseMockup("home");
    const rows = [...home.querySelectorAll("ul.mk-trust")].map(linkWords);
    expect(rows.slice(0, 3)).toEqual([0, 1, 2].map(() => [delivery, returns.build]));
    expect(rows[3][0]).toBe(returns.mockup);
    expect(text(home.querySelectorAll(".kh-drawer__note")[1])).toBe(`${delivery} · ${returns.build}`);
    // The trust link opens the refund page's part that keeps the promise (trust.ts), as the build links it.
    expect(mockupLinks(home.querySelector("ul.mk-trust")!)).toEqual(["/shipping#when", "/refund#before-dispatch"]);
  });

  it("keeps the checkout as approved: the store's price and its form keep D028's sentence and the full row; its first screen takes the risk-reversal line", () => {
    const store = parseMockup("store");
    expect(text(store.querySelector("#store-price"))).toBe(sentence.mockup);
    expect(text(store.querySelector("form .mk-price"))).toBe(sentence.mockup);
    const [top, form] = [...store.querySelectorAll("ul.mk-trust")];
    expect(linkWords(top)).toEqual([delivery, returns.build]);
    expect(top.querySelectorAll(".kh-sr")).toHaveLength(2);
    expect(linkWords(form)[0]).toBe(returns.mockup);
  });

  /* What the parity specs make of it, on every approved page: the text pass's shared rule accepts exactly the sentences
     the lines change in main, and with the pixels' shared hides applied on both sides the page's words line up again,
     but for the card's note, which sits on its amount's row and moves nothing. */
  const SLUGS = readdirSync(join(ROOT, "mockup"))
    .filter((f) => f.endsWith(".html") && f !== "index.html")
    .map((f) => f.replace(/\.html$/, ""));
  const raw = (slug: string) => new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
  /** A page's main as the browser's text reads it (innerText): besides the blocks blockSentences knows, the offer card's
   *  amount row is a flex row (each item on a line of its own) and the store's new-tab note is absolutely positioned (a
   *  line of its own too). */
  const mainOf = (doc: Document) => {
    const main = doc.querySelector("main")!;
    for (const el of main.querySelectorAll(".kh-offer__prices > *, .kh-sr")) {
      el.before("\n");
      el.after("\n");
    }
    return main;
  };
  const hidden = (side: "mockup" | "build") => PRICE_LINE_HIDDEN.filter((r) => r.side === side).map((r) => r.selector);

  it.each(SLUGS)("%s: the text pass accepts exactly what changes in main, and the hides leave only the card's note", (slug) => {
    const { missing, extra } = sentenceDiff(blockSentences(mainOf(raw(slug))), blockSentences(mainOf(parseMockup(slug))));
    expect(missing.filter((s) => !PRICE_LINE_TEXT.mockup.test(s))).toEqual([]);
    expect(extra.filter((s) => !PRICE_LINE_TEXT.build?.test(s))).toEqual([]);
    const after = (doc: Document) => {
      const main = mainOf(doc).cloneNode(true) as Element;
      main.querySelectorAll(hidden("mockup").join(", ")).forEach((n) => n.remove());
      return blockSentences(main);
    };
    const left = sentenceDiff(after(raw(slug)), after(parseMockup(slug)));
    expect(left.extra).toEqual([]);
    expect(left.missing.filter((s) => !sentences(PRICE_LINE.cardNote).includes(s))).toEqual([]);
  });

  it("names the same blocks on both sides of the pixels' shared hides, and each one it finds is a line that changes", () => {
    expect(hidden("build")).toEqual(hidden("mockup").map((s) => s.replace(/\bmk-/g, "ks-")));
    for (const [slug, count] of [["home", 7], ["store", 1]] as const) {
      const found = (doc: Document) => [...mainOf(doc).querySelectorAll(hidden("mockup").join(", "))].map((el) => words(el));
      const [before, after] = [found(raw(slug)), found(parseMockup(slug))];
      expect(before, slug).toHaveLength(count);
      expect(after, slug).toHaveLength(count);
      after.forEach((line, i) => expect(line, `${slug} #${i}`).not.toBe(before[i]));
    }
  });

  it("changes nothing that does not read as those lines (control)", () => {
    const el = html(
      `<div><p class="kh-body-s mk-price">₹499 today</p><ul class="kh-trustline mk-trust"><li><a href="refund.html">${returns.mockup}</a></li></ul></div>`,
    );
    const before = el.outerHTML;
    withPriceLine(el);
    expect(el.outerHTML).toBe(before);
  });
});

describe("mockupRoute: a mockup address read as the route it became (structure §5)", () => {
  it.each([
    ["home.html", "/"],
    ["home.html#faq", "/#faq"],
    ["meet-kheelu.html#faq", "/products/kheelu#faq"],
    ["story-talking-toys-and-late-talkers.html", "/stories/talking-toys-and-late-talkers"],
    ["stories.html#learning", "/stories#learning"],
    ["refund.html#returns", "/refund#returns"],
    ["ai-toys-for-kids-in-india.html", "/ai-toys-for-kids-in-india"],
    ["store.html", STORE],
  ])("%s is %s", (href, route) => {
    expect(mockupRoute(href)).toBe(route);
  });

  it("keeps anything else as it is: fragments, other schemes, a route the build wrote", () => {
    for (const kept of ["#src-1", "tel:+919187546483", "mailto:hello@kheelona.com", "https://wa.me/919187546483", "/products/kheelu#faq"]) {
      expect(mockupRoute(kept)).toBe(kept);
    }
  });
});

describe("portClass: a mockup block takes its ks- name, or the rename table's", () => {
  it("ports mk- to ks- and keeps every other class", () => {
    expect(portClass("mk-price")).toEqual(["ks-price"]);
    expect(portClass("kh-body-s")).toEqual(["kh-body-s"]);
    expect(portClass("is-hidden")).toEqual(["is-hidden"]);
  });

  it("follows the rename table: one name, several names, or none", () => {
    const renames = { guides: "ks-topic__guides", "sf-cta": [], later: "", "close-trust": ["ks-cta__full-trust", "x"] };
    expect(portClass("mk-guides", renames)).toEqual(["ks-topic__guides"]);
    expect(portClass("mk-sf-cta", renames)).toEqual([]);
    expect(portClass("mk-later", renames)).toEqual([]);
    expect(portClass("mk-close-trust", renames)).toEqual(["ks-cta__full-trust", "x"]);
    expect(portClass("mk-constructor", renames)).toEqual(["ks-constructor"]);
  });
});

describe("1. the exact markup", () => {
  it("canonical: attributes sorted, comments dropped, white space as one space, indentation left out", () => {
    expect(canonical(html('<p data-x="1" class="b">\n  One   <!-- note -->two\n  <a href="/x">three</a>\n</p>'))).toBe(
      '<p class="b" data-x="1"> One two <a href="/x">three</a></p>',
    );
  });

  it("asBuilt: value markers gone (their bare spans unwrapped), classes ported, addresses read as routes, on a clone", () => {
    const source = html('<p class="mk-price">Pay <span data-src="TOKEN">₹499</span> at <a href="store.html" data-src="STORE_URL">the store</a></p>');
    expect(canonical(asBuilt(source))).toBe(`<p class="ks-price">Pay ₹499 at <a href="${STORE}">the store</a></p>`);
    expect(source.getAttribute("class")).toBe("mk-price");
  });

  it("asBuilt keeps a no-wrap link one link with the class on it, as RichText renders {nowrap:[…](tel:…)} (task 3.6)", () => {
    expect(canonical(asBuilt(html('<p><a href="tel:+919187546483" class="mk-nowrap">+91 91875 46483</a></p>')))).toBe(
      '<p><a class="ks-nowrap" href="tel:+919187546483">+91 91875 46483</a></p>',
    );
  });

  it("asBuilt keeps a marked span the component draws anyway", () => {
    expect(canonical(asBuilt(html('<li><span data-src="perk">Free delivery</span></li>'), {}, "li span"))).toBe("<li><span>Free delivery</span></li>");
  });

  it("builtMarkup applies a section's documented differences after the general ones; addClass appends a class", () => {
    const adjust = (el: Element) => addClass(el, ".kh-btn--cta", "ks-cta__button");
    expect(builtMarkup([html('<div class="mk-sf-cta"><a class="kh-btn kh-btn--cta" href="store.html">Buy</a></div>')], { renames: { "sf-cta": [] }, adjust })).toBe(
      `<div><a class="kh-btn kh-btn--cta ks-cta__button" href="${STORE}">Buy</a></div>`,
    );
  });

  it("without: a clone minus what the selector matches", () => {
    const el = html('<div><img src="x"><p>kept</p></div>');
    expect(canonical(without(el, "img"))).toBe("<div><p>kept</p></div>");
    expect(el.querySelector("img")).not.toBeNull();
  });

  it("is red when the markup differs (controls)", () => {
    expect(canonical(html("<p>a</p>"))).not.toBe(canonical(html("<p>b</p>")));
    expect(canonical(html('<p class="x">a</p>'))).not.toBe(canonical(html('<p class="y">a</p>')));
    expect(canonical(html("<p><b>a</b></p>"))).not.toBe(canonical(html("<p><i>a</i></p>")));
  });
});

describe("2. skeleton", () => {
  it("lists tags, sorted classes and ARIA, one element per line, indented by depth", () => {
    const el = html('<section class="b a" aria-labelledby="t" data-x="1" style="left: 1%"><h2 id="t">Hi</h2></section>');
    expect(skeleton(el)).toBe("section.a.b[aria-labelledby=@1]\n  h2[id]");
  });

  it("compares an anchor's id by value, so a wrong fragment target is red", () => {
    expect(skeleton(html('<section id="specs"></section>'))).toBe("section[id=specs]");
    expect(skeleton(html('<section id="specs"></section>'))).not.toBe(skeleton(html('<section id="details"></section>')));
  });

  it("compares a label by the element it points to (its line), not by the spelling of a label-only id", () => {
    const fold = (label: string, heading: string) =>
      skeleton(html(`<section aria-labelledby="${label}"><h2 id="${heading}"></h2><p id="note"></p></section>`));
    expect(fold("working-title", "working-title")).toBe("section[aria-labelledby=@1]\n  h2[id]\n  p[id=note]");
    expect(fold("story-part-1-title", "story-part-1-title")).toBe(fold("working-title", "working-title"));
    expect(fold("note", "working-title")).not.toBe(fold("working-title", "working-title"));
  });

  it("still compares a label's id by value when a link in the fold points at it (an anchor as well as a label)", () => {
    expect(skeleton(html('<section aria-labelledby="t"><h2 id="t"></h2><a href="#t"></a></section>'))).toBe(
      "section[aria-labelledby=@1]\n  h2[id=t]\n  a[href=#t]",
    );
  });

  it("keeps a label that points outside the fold as its id, compared by value", () => {
    expect(skeleton(html('<nav aria-labelledby="menu-title"></nav>'))).toBe("nav[aria-labelledby=menu-title]");
  });

  it("compares addresses by value, a mockup page read as the route it became", () => {
    const link = (href: string) => skeleton(html(`<a href="${href}"></a>`));
    expect(link("home.html")).toBe("a[href=/]");
    expect(link("meet-kheelu.html#faq")).toBe("a[href=/products/kheelu#faq]");
    expect(link("story-talking-toys-and-late-talkers.html")).toBe("a[href=/stories/talking-toys-and-late-talkers]");
    expect(link("/products/kheelu#faq")).toBe("a[href=/products/kheelu#faq]");
  });

  it("is red when a link goes to another page (control)", () => {
    const link = (href: string) => skeleton(html(`<a href="${href}"></a>`));
    expect(link("/refund")).not.toBe(link("shipping.html"));
    expect(link("/stories/learning-toys-for-a-three-year-old")).not.toBe(link("story-talking-toys-and-late-talkers.html"));
  });

  it("renames the mockup prefix to ks-, or as the table says, and drops what a test ignores", () => {
    const el = html('<ul class="mk-guides kh-list mk-later ks-list-reset"></ul>');
    expect(skeleton(el, { rename: { guides: "ks-topic__guides", later: "" }, drop: /^ks-list-reset$/ })).toBe("ul.kh-list.ks-topic__guides");
  });

  it("keeps an icon as one line and skips the subtrees a test names", () => {
    const el = html('<p><svg class="kh-icon" aria-hidden="true"><path d="M0"/></svg><span hidden>x</span><span>y</span></p>');
    expect(skeleton(el, { skip: "[hidden]" })).toBe("p\n  svg.kh-icon[aria-hidden]\n  span");
  });

  it("unwraps an element the build adds inside the mockup's (Heading's step span)", () => {
    const el = html('<h1 class="kh-heading__title"><span class="ks-heading__step"><span class="kh-hand">x</span></span></h1>');
    expect(skeleton(el, { unwrap: ".ks-heading__step" })).toBe("h1.kh-heading__title\n  span.kh-hand");
  });

  it("is red when the markup differs (control)", () => {
    expect(skeleton(html('<div class="a"><p></p></div>'))).not.toBe(skeleton(html('<div class="a"><span></span></div>')));
  });
});

describe("2. words", () => {
  it("is the visible text with whitespace collapsed, hidden subtrees left out", () => {
    expect(words(html("<p>Read  the guide\n · 3 min<span hidden>gone</span></p>"), { skip: "[hidden]" })).toBe("Read the guide · 3 min");
  });

  it("separates blocks, as the page shows them, but keeps inline text joined exactly (a missing space stays red)", () => {
    expect(words(html("<div><h2>Title</h2><p>One.</p><ul><li>a</li><li>b</li></ul></div>"))).toBe("Title One. a b");
    expect(words(html("<p><strong>Try this:</strong>pause</p>"))).toBe("Try this:pause");
  });
});

describe("2b. outline", () => {
  it("lists tags, ported classes (each once, sorted) and [data-reveal], two spaces per level", () => {
    const el = html('<section class="mk-hero kh-section" data-reveal><div class="b a a"><p>x</p></div></section>');
    expect(outline(el)).toEqual(["section.kh-section.ks-hero[data-reveal]", "  div.a.b", "    p"]);
  });

  it("follows a rename table, stops where a primitive's own test takes over, and keeps an svg as one line", () => {
    const el = html('<div class="mk-shots--solo"><figure class="kh-photo"><img></figure><span><svg class="kh-icon"><path/></svg></span></div>');
    const lines = outline(el, { renames: { "shots--solo": ["ks-shots--solo", "ks-shots--product"] }, stop: (e) => e.classList.contains("kh-photo") });
    expect(lines).toEqual(["div.ks-shots--product.ks-shots--solo", "  figure.kh-photo", "  span", "    svg.kh-icon"]);
  });

  it("adds the classes the build adds where the mockup has none, on either side", () => {
    const extra = (e: Element) => (e.tagName === "UL" ? ["ks-list-reset"] : []);
    expect(outline(html('<ul class="kh-trust"><li></li></ul>'), { extra })).toEqual(outline(html('<ul class="kh-trust ks-list-reset"><li></li></ul>'), { extra }));
  });

  it("is red when the markup or a reveal differs (controls)", () => {
    expect(outline(html("<div><p></p></div>"))).not.toEqual(outline(html("<div><span></span></div>")));
    expect(outline(html("<div data-reveal></div>"))).not.toEqual(outline(html("<div></div>")));
    expect(outline(html('<div class="mk-x"></div>'))).not.toEqual(outline(html('<div class="mk-x"></div>'), { renames: { x: "ks-y" } }));
  });
});

describe("3. mockupDiff", () => {
  const diff = mockupDiff();

  it("finds nothing between the mockup's element and its port: mk- read as ks-, any attribute or class order, spacing", () => {
    expect(
      diff(
        html('<nav class="ks-nav kh-nav" aria-label="Main"><a href="/safety">  Safety </a></nav>'),
        html('<nav aria-label="Main" class="kh-nav mk-nav">\n  <a href="safety.html">Safety</a>\n</nav>'),
      ),
    ).toEqual([]);
  });

  it("reads the mockup's links as routes (or through realHref), and only the mockup's", () => {
    expect(diff(html('<a href="/">x</a>'), html('<a href="home.html">x</a>'))).toEqual([]);
    expect(diff(html('<a href="home.html">x</a>'), html('<a href="home.html">x</a>'))).toEqual(['a [href]: "home.html" instead of "/"']);
    const onOrigin = mockupDiff({ realHref: (href) => `https://kheelona.com${mockupRoute(href)}` });
    expect(onOrigin(html('<a href="https://kheelona.com/terms">x</a>'), html('<a href="terms.html">x</a>'))).toEqual([]);
  });

  it("reports a different tag", () => {
    expect(diff(html("<div><span>a</span></div>"), html("<div><b>a</b></div>"))).toEqual(["div > b:nth(0): <span> instead of <b>"]);
  });

  it("reports an attribute that differs, is missing or is extra, with the path to it", () => {
    expect(diff(html('<p><a href="/x" rel="me">a</a></p>'), html('<p><a href="/y" target="_blank">a</a></p>'))).toEqual([
      'p > a:nth(0) [href]: "/x" instead of "/y"',
      'p > a:nth(0) [rel]: "me" instead of undefined',
      'p > a:nth(0) [target]: undefined instead of "_blank"',
    ]);
  });

  it("reports different words and a different number of children", () => {
    expect(diff(html("<p>Made in India</p>"), html("<p>Made in Bharat</p>"))).toEqual(['p child 0: "Made in India" instead of "Made in Bharat"']);
    expect(diff(html("<p><i></i></p>"), html("<p><i></i><b></b></p>"))).toEqual(["p: children [<i>] instead of [<i>, <b>]"]);
  });

  it("reads the mockup's data-src spans as the text they show", () => {
    expect(diff(html("<p>From ₹499 today</p>"), html('<p>From <span data-src="offer">₹499</span> today</p>'))).toEqual([]);
  });

  it("forgives only the attributes, renamed blocks and state classes it is given", () => {
    const told = mockupDiff({ ignore: ["inert", "width"], renames: { seller: "ks-store-foot__seller" }, dropClasses: ["is-hidden"] });
    expect(told(html('<div class="kh-buybar" inert width="9"></div>'), html('<div class="kh-buybar is-hidden"></div>'))).toEqual([]);
    expect(told(html('<address class="ks-store-foot__seller"></address>'), html('<address class="mk-seller"></address>'))).toEqual([]);
    expect(diff(html('<div class="kh-buybar" inert></div>'), html('<div class="kh-buybar is-hidden"></div>'))).toEqual([
      'div [class]: "kh-buybar" instead of "is-hidden kh-buybar"',
      'div [inert]: "" instead of undefined',
    ]);
  });
});

