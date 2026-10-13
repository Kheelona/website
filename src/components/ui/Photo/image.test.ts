import { describe, expect, it } from "vitest";
import type { StaticImageData } from "next/image";
import { cssRatio, imageRatio, imageSource, loadingFor, scaleSizes } from "./image";

/* The raster helpers every media primitive shares (task 2.3; ADR-010, architecture §10). */

const STATIC = { src: "/_next/static/media/advik.png", width: 744, height: 1198 } as StaticImageData;

describe("imageSource", () => {
  it("passes a static import as is: next/image reads its size", () => {
    expect(imageSource({ src: STATIC, alt: "" })).toEqual({ src: STATIC });
  });

  it("gives a site path its stated size, so nothing shifts", () => {
    expect(imageSource({ src: "/video/moments/a.jpg", width: 640, height: 360, alt: "" })).toEqual({
      src: "/video/moments/a.jpg",
      width: 640,
      height: 360,
    });
  });
});

describe("imageRatio (height over width)", () => {
  it("reads a static import's own size", () => {
    expect(imageRatio({ src: STATIC, alt: "" })).toBeCloseTo(1198 / 744, 10);
  });

  it("reads a site path's stated size", () => {
    expect(imageRatio({ src: "/a.jpg", width: 1600, height: 900, alt: "" })).toBe(0.5625);
  });
});

/* The ratio a box takes so that next/image's renditions, whose heights are rounded to whole pixels, never change its
   height (task 4.6): the image's own width over its height, as CSS writes it. */
describe("cssRatio (CSS width / height)", () => {
  it("reads a static import's own size", () => {
    expect(cssRatio({ src: STATIC, alt: "" })).toBe("744 / 1198");
  });

  it("reads a site path's stated size", () => {
    expect(cssRatio({ src: "/a.jpg", width: 1600, height: 900, alt: "" })).toBe("1600 / 900");
  });
});

describe("loadingFor", () => {
  it("the page's one LCP image: eager and high priority (never priority or preload, deprecated in Next 16)", () => {
    expect(loadingFor(true)).toEqual({ loading: "eager", fetchPriority: "high" });
  });

  it("everything else: lazy, no priority hint", () => {
    expect(loadingFor(false)).toEqual({ loading: "lazy" });
    expect(loadingFor(undefined)).toEqual({ loading: "lazy" });
  });
});

describe("scaleSizes: a share of the layout's sizes", () => {
  it.each([
    ["one length", "100vw", 0.5, "calc(100vw * 0.5)"],
    [
      "a media condition and a fallback calc()",
      "(min-width: 900px) 540px, calc(100vw - 32px)",
      0.54,
      "(min-width: 900px) calc(540px * 0.54), calc((100vw - 32px) * 0.54)",
    ],
    [
      "a compound condition",
      "(min-width: 720px) and (max-width: 899px) 480px,100vw",
      0.44,
      "(min-width: 720px) and (max-width: 899px) calc(480px * 0.44), calc(100vw * 0.44)",
    ],
    ["the zoom of a frame", "(min-width: 900px) 45vw, 100vw", 1.32, "(min-width: 900px) calc(45vw * 1.32), calc(100vw * 1.32)"],
    ["float noise rounded away", "100vw", 0.07 * 3, "calc(100vw * 0.21)"],
  ])("%s", (_name, sizes, factor, want) => {
    expect(scaleSizes(sizes, factor)).toBe(want);
  });

  it("leaves the sizes alone at a factor of 1", () => {
    expect(scaleSizes("(min-width: 900px) 540px, 100vw", 1)).toBe("(min-width: 900px) 540px, 100vw");
  });

  it.each([
    ["empty sizes", "", 0.5],
    ["a zero factor", "100vw", 0],
    ["a negative factor", "100vw", -1],
    ["an unbalanced parenthesis", "(min-width: 900px 540px", 0.5],
  ])("refuses %s", (_name, sizes, factor) => {
    expect(() => scaleSizes(sizes, factor)).toThrow();
  });
});
