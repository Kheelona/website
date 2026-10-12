import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { resolvePlacement, SvgLayer } from "./layer";

/* The one placement rule every art-board and imagination layer follows (DS 10-pages.md:50: left, top or
   bottom and width in %; content may also anchor right, src/content/types.ts ArtPlacement). */

describe("resolvePlacement", () => {
  it("keeps left and top as given, with no rotation", () => {
    expect(resolvePlacement({ left: 6, top: 8, width: 30 })).toEqual({ left: 6, top: 8, width: 30, rotate: 0 });
  });

  it("keeps bottom and the rotation", () => {
    expect(resolvePlacement({ left: 2, bottom: 2, width: 44, rotate: -6 })).toEqual({ left: 2, bottom: 2, width: 44, rotate: -6 });
  });

  it("turns a right anchor into the same left edge: 100 - right - width", () => {
    // meet-kheelu.html:20, the star behind the hero: right 4%, width 30% -> left 66%.
    expect(resolvePlacement({ right: 4, top: 6, width: 30 })).toEqual({ left: 66, top: 6, width: 30, rotate: 0 });
    // refund.html:20: right 30%, width 24%, bottom 6% -> left 46%.
    expect(resolvePlacement({ right: 30, bottom: 6, width: 24 })).toEqual({ left: 46, bottom: 6, width: 24, rotate: 0 });
  });

  it("rounds the computed edge to four decimals (no float noise in the style attribute)", () => {
    expect(resolvePlacement({ right: 4.5, top: 0, width: 30.1 }).left).toBe(65.4);
  });

  it.each([
    ["no horizontal anchor", { top: 1, width: 10 }],
    ["both horizontal anchors", { left: 1, right: 1, top: 1, width: 10 }],
    ["no vertical anchor", { left: 1, width: 10 }],
    ["both vertical anchors", { left: 1, top: 1, bottom: 1, width: 10 }],
    ["a width that is not a number", { left: 1, top: 1, width: Number.NaN }],
  ])("refuses %s", (_name, placement) => {
    expect(() => resolvePlacement(placement)).toThrow(/art-board layer/i);
  });
});

describe("SvgLayer: a decorative SVG file placed on a board", () => {
  it("renders the mockup's plain <img>: class, empty alt, % position and rotation", () => {
    const { container } = render(<SvgLayer className="kh-art__layer" src="/shapes/sun.svg" placement={{ left: 6, top: 8, width: 30 }} />);
    const img = container.querySelector("img")!;
    expect(container.children).toHaveLength(1);
    expect(img).toHaveClass("kh-art__layer");
    expect(img).toHaveAttribute("src", "/shapes/sun.svg");
    expect(img).toHaveAttribute("alt", "");
    expect(img.style.left).toBe("6%");
    expect(img.style.top).toBe("8%");
    expect(img.style.bottom).toBe("");
    expect(img.style.width).toBe("30%");
    expect(img.style.transform).toBe("rotate(0deg)");
  });

  it("anchors to the bottom and tilts when asked", () => {
    const { container } = render(
      <SvgLayer className="kh-imagine__doodle" src="/d.svg" placement={{ right: 30, bottom: 6, width: 24, rotate: -12 }} />,
    );
    const img = container.querySelector("img")!;
    expect(img.style.left).toBe("46%");
    expect(img.style.bottom).toBe("6%");
    expect(img.style.top).toBe("");
    expect(img.style.transform).toBe("rotate(-12deg)");
  });

  it("loads eagerly by default (a first-screen board) and lazily below it, as the mockup does", () => {
    const eager = render(<SvgLayer className="kh-art__layer" src="/a.svg" placement={{ left: 0, top: 0, width: 10 }} />);
    expect(eager.container.querySelector("img")).not.toHaveAttribute("loading");
    const lazy = render(<SvgLayer className="kh-art__layer" src="/a.svg" placement={{ left: 0, top: 0, width: 10 }} lazy />);
    expect(lazy.container.querySelector("img")).toHaveAttribute("loading", "lazy");
    expect(lazy.container.querySelector("img")).not.toHaveAttribute("fetchpriority");
  });

  it("an eager layer is fetchpriority low, so it never competes with the page's LCP image", () => {
    const eager = render(<SvgLayer className="kh-art__layer" src="/a.svg" placement={{ left: 0, top: 0, width: 10 }} />);
    expect(eager.container.querySelector("img")).toHaveAttribute("fetchpriority", "low");
  });

  /* React's server renderer hoists a <link rel="preload" as="image"> into <head>, ahead of the stylesheet, for every
     <img> that is neither loading="lazy" nor fetchpriority="low" (react-dom-server, case "img"); renderToStaticMarkup
     runs the same code. A decorative shape or still doodle must not take that place from the LCP image. */
  it("gives React's server renderer no reason to preload it, eager or lazy", () => {
    for (const lazy of [false, true]) {
      const html = renderToStaticMarkup(<SvgLayer className="kh-art__layer" src="/a.svg" placement={{ left: 0, top: 0, width: 10 }} lazy={lazy} />);
      expect(html, `lazy=${lazy}`).toMatch(/^<img /);
      expect(html, `lazy=${lazy}`).not.toContain('rel="preload"');
    }
  });
});
