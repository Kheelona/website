import postcss from "postcss";
import { renderToStaticMarkup } from "react-dom/server";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { Actions, Cols, Container, LIST_RESET, Section, SectionHead, Split } from "./Layout";

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

describe("Layout: the DS page layout classes, as the mockup nests them", () => {
  it("nests a band section as home.html fold 2 does", () => {
    expect(
      renderToStaticMarkup(
        <Section band labelledBy="ask-title">
          <Container>
            <SectionHead>x</SectionHead>
          </Container>
        </Section>,
      ),
    ).toBe(
      '<section class="kh-section kh-section--band" aria-labelledby="ask-title"><div class="kh-container"><div class="kh-section__head">x</div></div></section>',
    );
  });

  it("Section: id, tight and composition classes", () => {
    const { container } = render(
      <Section id="modes" tight className="ks-hero" labelledBy="what-title">
        y
      </Section>,
    );
    const section = container.querySelector("section")!;
    expect(section.className).toBe("kh-section kh-section--tight ks-hero");
    expect(section).toHaveAttribute("id", "modes");
    expect(section).toHaveAttribute("aria-labelledby", "what-title");
  });

  it("Section can be the article head's header and the article body's div (story-*.html folds 1 and 2)", () => {
    expect(
      renderToStaticMarkup(
        <Section as="header" band className="ks-hero ks-story-head">
          h
        </Section>,
      ),
    ).toBe('<header class="kh-section kh-section--band ks-hero ks-story-head">h</header>');
    expect(renderToStaticMarkup(<Section as="div" className="ks-story-body">b</Section>)).toBe(
      '<div class="kh-section ks-story-body">b</div>',
    );
  });

  it("Section is a named region when labelled", () => {
    render(
      <Section labelledBy="t">
        <h2 id="t">Safety</h2>
      </Section>,
    );
    expect(screen.getByRole("region", { name: "Safety" })).toBeInTheDocument();
  });

  it.each([
    [{}, "kh-split"],
    [{ wide: "start" }, "kh-split kh-split--wide-start"],
    [{ wide: "end" }, "kh-split kh-split--wide-end"],
  ] as const)("Split %j", (props, cls) => {
    const { container } = render(<Split {...props}>z</Split>);
    expect(container.firstElementChild!.className).toBe(cls);
  });

  it("SectionHead can be a split, as home.html fold 4 is", () => {
    const { container } = render(<SectionHead split="start">h</SectionHead>);
    expect(container.firstElementChild!.className).toBe("kh-section__head kh-split kh-split--wide-start");
  });

  it.each([
    [{}, "div", "kh-cols"],
    [{ count: 2 }, "div", "kh-cols kh-cols--2"],
    [{ count: 3, as: "ul" }, "ul", "kh-cols kh-cols--3"],
    [{ count: 4, as: "ol" }, "ol", "kh-cols kh-cols--4"],
  ] as const)("Cols %j", (props, tag, cls) => {
    const { container } = render(<Cols {...props}>c</Cols>);
    expect(container.firstElementChild!.tagName.toLowerCase()).toBe(tag);
    expect(container.firstElementChild!.className).toBe(cls);
  });

  it("marks a block that reveals on scroll, and nothing else (D049 pick 1)", () => {
    const html = renderToStaticMarkup(
      <>
        <Cols count={3} reveal className="ks-modes">
          a
        </Cols>
        <Split reveal>b</Split>
        <Container reveal>c</Container>
        <Cols>d</Cols>
      </>,
    );
    expect(html).toBe(
      '<div class="kh-cols kh-cols--3 ks-modes" data-reveal="">a</div><div class="kh-split" data-reveal="">b</div>' +
        '<div class="kh-container" data-reveal="">c</div><div class="kh-cols">d</div>',
    );
  });

  it("Actions, plain and centred (home.html)", () => {
    expect(renderToStaticMarkup(<Actions>a</Actions>)).toBe('<div class="kh-section__actions">a</div>');
    expect(renderToStaticMarkup(<Actions center>a</Actions>)).toBe(
      '<div class="kh-section__actions kh-section__actions--center">a</div>',
    );
  });

  it("exports the list reset for lists other primitives render (LanguageChips, chip lists)", () => {
    expect(renderToStaticMarkup(<ul className={LIST_RESET} />)).toBe('<ul class="ks-list-reset"></ul>');
  });
});

describe("Layout CSS", () => {
  const CSS = "src/components/ui/Layout/layout.css";

  it("ports the list reset (meet-kheelu.css:11)", () => {
    expect(declarations(CSS, ".ks-list-reset")).toEqual(["margin: 0", "padding: 0", "list-style: none"]);
    expect(declarations(CSS, ".ks-list-reset")).toEqual(declarations("mockup/css/meet-kheelu.css", ".mk-list-reset"));
  });

  it("ports the vertical rhythm between layout blocks (mockup.css:103-104)", () => {
    for (const selector of [".kh-cols + .kh-subtitle, .kh-split + .kh-cols", ".kh-subtitle"]) {
      expect(declarations(CSS, selector).length, selector).toBeGreaterThan(0);
      expect(declarations(CSS, selector), selector).toEqual(declarations("mockup/mockup.css", selector));
    }
  });
});
