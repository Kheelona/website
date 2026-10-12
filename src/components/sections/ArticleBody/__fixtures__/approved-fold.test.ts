import { describe, expect, it } from "vitest";
import { mockupFold, skeleton, words } from "./approved-fold";

/* Test support for the task 3.4 section tests: an approved mockup fold, read from the built mockup page, reduced to a
   skeleton (tags, classes with the mockup prefix renamed to ks-, ARIA) that a section's render must equal (SCA 1). */

const html = (markup: string) => {
  const host = document.createElement("div");
  host.innerHTML = markup;
  return host.firstElementChild!;
};

describe("mockupFold", () => {
  it("reads one element of a built mockup page by selector", () => {
    const answer = mockupFold("story-learning-toys-for-a-three-year-old", "section[aria-labelledby='answer-title']");
    expect(answer.tagName).toBe("SECTION");
    expect(answer.querySelector("h2")?.textContent).toBe("What are the best learning toys for a 3-year-old?");
  });

  it("fails loudly when the selector finds nothing, so a test can never compare against an empty fold", () => {
    expect(() => mockupFold("404", ".nothing-here")).toThrow(/no element matches/);
  });
});

describe("skeleton", () => {
  it("lists tags, sorted classes and ARIA, one element per line, indented by depth", () => {
    const el = html('<section class="b a" aria-labelledby="t" data-x="1" style="left: 1%"><h2 id="t">Hi</h2></section>');
    expect(skeleton(el)).toBe("section.a.b[aria-labelledby]\n  h2[id]");
  });

  it("renames the mockup prefix to ks-, or as the table says, and drops what a test ignores", () => {
    const prefix = "m" + "k-";
    const el = html(`<ul class="${prefix}guides kh-list ${prefix}later ks-list-reset"></ul>`);
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

describe("words", () => {
  it("is the visible text with whitespace collapsed, hidden subtrees left out", () => {
    expect(words(html("<p>Read  the guide\n · 3 min<span hidden>gone</span></p>"), { skip: "[hidden]" })).toBe("Read the guide · 3 min");
  });

  it("separates blocks, as the page shows them, but keeps inline text joined exactly (a missing space stays red)", () => {
    expect(words(html("<div><h2>Title</h2><p>One.</p><ul><li>a</li><li>b</li></ul></div>"))).toBe("Title One. a b");
    expect(words(html("<p><strong>Try this:</strong>pause</p>"))).toBe("Try this:pause");
  });
});
