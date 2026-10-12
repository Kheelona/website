import { describe, expect, it } from "vitest";
import { hoistNowrap, mockupDiff } from "./mockup-diff";

/* The element comparison behind the shells' mockup parity tests (task 3.1; SiteShell.test.tsx with mockup/home.html,
 * StoreShell.test.tsx with mockup/store.html). If it stopped reporting differences, both parity tests would pass on any
 * markup, so this proves it reports each kind and forgives only what it is told to. */

const html = (markup: string): Element => {
  const el = new DOMParser().parseFromString(`<body>${markup}</body>`, "text/html").body.firstElementChild;
  if (!el) throw new Error(`no element in ${markup}`);
  return el;
};

const realHref = (href: string) => (href === "home.html" ? "/" : href.replace(/^([a-z-]+)\.html/, "/$1"));
const diff = mockupDiff({ realHref });

describe("mockupDiff", () => {
  it("finds nothing between the mockup's element and its port: mk- read as ks-, any attribute or class order, spacing", () => {
    expect(
      diff(
        html('<nav class="ks-nav kh-nav" aria-label="Main"><a href="/safety">  Safety </a></nav>'),
        html('<nav aria-label="Main" class="kh-nav mk-nav">\n  <a href="safety.html">Safety</a>\n</nav>'),
      ),
    ).toEqual([]);
  });

  it("reads the mockup's links through realHref, and only the mockup's", () => {
    expect(diff(html('<a href="/">x</a>'), html('<a href="home.html">x</a>'))).toEqual([]);
    expect(diff(html('<a href="home.html">x</a>'), html('<a href="home.html">x</a>'))).toEqual(['a [href]: "home.html" instead of "/"']);
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

  it("forgives only the attributes, renamed classes and state classes it is given", () => {
    const told = mockupDiff({ realHref, ignore: ["inert", "width"], renameClasses: { "mk-seller": "ks-store-foot__seller" }, dropClasses: ["is-hidden"] });
    expect(told(html('<div class="kh-buybar" inert width="9"></div>'), html('<div class="kh-buybar is-hidden"></div>'))).toEqual([]);
    expect(told(html('<address class="ks-store-foot__seller"></address>'), html('<address class="mk-seller"></address>'))).toEqual([]);
    expect(diff(html('<div class="kh-buybar" inert></div>'), html('<div class="kh-buybar is-hidden"></div>'))).toEqual([
      'div [class]: "kh-buybar" instead of "is-hidden kh-buybar"',
      'div [inert]: "" instead of undefined',
    ]);
  });
});

describe("hoistNowrap", () => {
  it("reads a link whose only child is a no-wrap span as the mockup's no-wrap link, on a copy", () => {
    const built = html('<p><a href="tel:+91"><span class="ks-nowrap">+91 1</span></a></p>');
    const hoisted = hoistNowrap(built);
    expect(hoisted.innerHTML).toBe('<a href="tel:+91" class="ks-nowrap">+91 1</a>');
    expect(built.innerHTML).toBe('<a href="tel:+91"><span class="ks-nowrap">+91 1</span></a>');
  });

  it("leaves a link with more than the span alone", () => {
    const built = html('<p><a href="tel:+91">call <span class="ks-nowrap">+91 1</span></a></p>');
    expect(hoistNowrap(built).innerHTML).toBe(built.innerHTML);
  });
});
