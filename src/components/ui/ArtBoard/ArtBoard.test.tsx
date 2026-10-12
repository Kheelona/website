import { render } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it, vi } from "vitest";
import type { ArtLayer } from "@/content/types";
import { ArtBoard } from "./ArtBoard";

/* ArtBoard (task 2.3; DS scrapbook board kh-art, 10-pages.md:42-52; ADR-010; D049 picks 2 and 3). Rendered
   through the real next/image (the shared test setup mocks it). Fixture: the Home hero board, home.html:22-26. */
vi.unmock("next/image");

const ADVIK = { src: "/_next/static/media/advik-sticker.png", width: 744, height: 1198 } as StaticImageData;
const KHEELU = { src: "/_next/static/media/kheelu-front-sticker.png", width: 1154, height: 1397 } as StaticImageData;
const SUN = { src: "/_next/static/media/sun-sun.svg", width: 240, height: 240 } as StaticImageData;

const HOME_HERO: readonly ArtLayer[] = [
  { image: { src: SUN, alt: "" }, left: 6, width: 30, top: 8 },
  { image: { src: ADVIK, alt: "" }, left: 38, width: 54, bottom: 0 },
  { image: { src: KHEELU, alt: "" }, left: 2, width: 44, bottom: 2, rotate: -6 },
  { doodle: { name: "chalk-question-mark" }, left: 43, width: 13, top: 2, rotate: 10 },
];
const LABEL = "Kheelu by Kheelona, the cream plush rabbit with rainbow ears, beside a smiling boy";
const SIZES = "(min-width: 900px) 540px, calc(100vw - 32px)";

const board = (c: HTMLElement) => c.firstElementChild as HTMLElement;
const layers = (c: HTMLElement) => [...board(c).children] as HTMLElement[];

describe("ArtBoard: the board", () => {
  it("is a kh-art block in its tone, named as one image when it shows something a parent should know", () => {
    const { container } = render(<ArtBoard tone="blue" label={LABEL} layers={HOME_HERO} sizes={SIZES} hero />);
    expect(board(container).tagName.toLowerCase()).toBe("div");
    expect(board(container).className).toBe("kh-art kh-tone-blue");
    expect(board(container)).toHaveAttribute("role", "img");
    expect(board(container)).toHaveAttribute("aria-label", LABEL);
  });

  it("has no role and no name without a label (refund.html:19)", () => {
    const { container } = render(<ArtBoard tone="blue" layers={HOME_HERO} sizes={SIZES} />);
    expect(board(container)).not.toHaveAttribute("role");
    expect(board(container)).not.toHaveAttribute("aria-label");
  });

  it("keeps the layers in their order, then the sticker last", () => {
    const { container } = render(
      <ArtBoard tone="blue" layers={HOME_HERO} sizes={SIZES} sticker={<span className="kh-sticker">It asks.</span>} />,
    );
    const kinds = layers(container).map((el) => `${el.tagName.toLowerCase()}${el.hasAttribute("srcset") ? ":raster" : ""}`);
    expect(kinds).toEqual(["img", "img:raster", "img:raster", "svg", "span"]);
    expect(layers(container).at(-1)).toHaveClass("kh-sticker");
  });

  it.each([
    ["ratio", { ratio: "4 / 3" as const }, "kh-art kh-tone-sun"],
    ["clamp (the 480 px tablet width, 720-899)", { clamp: true }, "kh-art kh-tone-sun ks-art--clamp"],
    ["a section class", { clamp: true, className: "ks-gd-plush-art" }, "kh-art kh-tone-sun ks-art--clamp ks-gd-plush-art"],
  ])("%s", (_name, props, classes) => {
    const { container } = render(<ArtBoard tone="sun" layers={HOME_HERO} sizes={SIZES} {...props} />);
    expect(board(container).className).toBe(classes);
  });

  it("sets the DS ratio variable on the board only when asked", () => {
    const { container } = render(<ArtBoard tone="sun" layers={HOME_HERO} sizes={SIZES} ratio="4 / 3" />);
    expect(board(container).style.getPropertyValue("--kh-ratio")).toBe("4 / 3");
    const plain = render(<ArtBoard tone="sun" layers={HOME_HERO} sizes={SIZES} />);
    expect(board(plain.container).style.getPropertyValue("--kh-ratio")).toBe("");
  });

  it("marks a board that reveals on scroll, and refuses it in a hero or on the LCP", () => {
    const { container } = render(<ArtBoard tone="blue" layers={HOME_HERO} sizes={SIZES} reveal />);
    expect(board(container)).toHaveAttribute("data-reveal", "");
    expect(() => render(<ArtBoard tone="blue" layers={HOME_HERO} sizes={SIZES} hero reveal />)).toThrow(/hero/i);
    expect(() => render(<ArtBoard tone="blue" layers={HOME_HERO} sizes={SIZES} lcp reveal />)).toThrow(/LCP/);
  });
});

describe("ArtBoard: layers", () => {
  it("renders a raster through next/image, placed in %, asking for its share of the board's sizes", () => {
    const { container } = render(<ArtBoard tone="blue" layers={HOME_HERO} sizes={SIZES} />);
    const advik = layers(container)[1];
    expect(advik).toHaveClass("kh-art__layer");
    expect(advik).toHaveAttribute("alt", "");
    expect(advik).toHaveAttribute("sizes", "(min-width: 900px) calc(540px * 0.54), calc((100vw - 32px) * 0.54)");
    expect(advik.getAttribute("srcset")).toMatch(/ \d+w(,|$)/);
    expect(advik.style.left).toBe("38%");
    expect(advik.style.width).toBe("54%");
    expect(advik.style.bottom).toBe("0%");
    expect(layers(container)[2].style.transform).toBe("rotate(-6deg)");
  });

  it("keeps a raster's alt text when the board has no label (ai-toys-for-kids-in-india.html:87)", () => {
    const plush: ArtLayer[] = [{ image: { src: KHEELU, alt: "Kheelu, the soft cream plush rabbit." }, left: 22, width: 56, bottom: 4 }];
    const { container } = render(<ArtBoard tone="blue" layers={plush} sizes={SIZES} reveal />);
    expect(layers(container)[0]).toHaveAttribute("alt", "Kheelu, the soft cream plush rabbit.");
  });

  it("renders a DS shape (SVG) as a plain <img>: no srcset, eager in a hero, lazy below it", () => {
    const hero = render(<ArtBoard tone="blue" layers={HOME_HERO} sizes={SIZES} hero />);
    const sun = layers(hero.container)[0];
    expect(sun).toHaveAttribute("src", SUN.src);
    expect(sun).toHaveAttribute("alt", "");
    expect(sun).toHaveClass("kh-art__layer");
    expect(sun).not.toHaveAttribute("srcset");
    expect(sun).not.toHaveAttribute("loading");
    expect(sun.style.top).toBe("8%");
    const below = render(<ArtBoard tone="blue" layers={HOME_HERO} sizes={SIZES} />);
    expect(layers(below.container)[0]).toHaveAttribute("loading", "lazy");
  });

  it("knows a DS shape that the bundler inlined as a data URI (Vite does, in Storybook) is an SVG, not a raster", () => {
    const inlined = { src: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%3e%3c/svg%3e", width: 240, height: 240 } as StaticImageData;
    const hero = render(<ArtBoard tone="blue" layers={[{ image: { src: inlined, alt: "" }, left: 6, width: 30, top: 8 }]} sizes={SIZES} hero />);
    const shape = layers(hero.container)[0];
    expect(shape).toHaveAttribute("src", inlined.src);
    expect(shape).not.toHaveAttribute("srcset");
    expect(shape).not.toHaveAttribute("loading");
    expect(shape).not.toHaveAttribute("data-nimg");
  });

  it("places a right-anchored layer at the same left edge (meet-kheelu.html:20)", () => {
    const star: ArtLayer[] = [{ image: { src: SUN, alt: "" }, right: 4, width: 30, top: 6 }];
    const { container } = render(<ArtBoard tone="blue" layers={star} sizes={SIZES} />);
    expect(layers(container)[0].style.left).toBe("66%");
  });

  it("keeps a hero's doodle still: the DS file as a plain <img>, never drawn (pick 2)", () => {
    const drawAsked: ArtLayer[] = [{ doodle: { name: "chalk-question-mark", draw: true, order: 2 }, left: 43, width: 13, top: 2 }];
    const { container } = render(<ArtBoard tone="blue" layers={drawAsked} sizes={SIZES} hero />);
    const doodle = layers(container)[0];
    expect(doodle.tagName.toLowerCase()).toBe("img");
    expect(doodle).toHaveClass("kh-art__layer");
    expect(container.querySelector("[data-draw]")).toBeNull();
  });

  it("draws a doodle below the first screen (pick 3), in its order", () => {
    const close: ArtLayer[] = [{ doodle: { name: "ink-heart", order: 2 }, left: 82, width: 12, top: 9, rotate: 14 }];
    const { container } = render(<ArtBoard tone="sun" layers={close} sizes={SIZES} />);
    const doodle = layers(container)[0];
    expect(doodle.tagName.toLowerCase()).toBe("svg");
    expect(doodle).toHaveClass("ks-doodle", "kh-art__layer");
    expect(doodle).toHaveAttribute("data-draw", "");
    expect(doodle).toHaveAttribute("data-draw-order", "2");
    expect(doodle.style.transform).toBe("rotate(14deg)");
  });

  it("keeps a doodle still below the first screen when its content says so, loading it lazily", () => {
    const still: ArtLayer[] = [{ doodle: { name: "ink-heart", draw: false }, left: 82, width: 12, top: 9 }];
    const { container } = render(<ArtBoard tone="sun" layers={still} sizes={SIZES} />);
    expect(layers(container)[0].tagName.toLowerCase()).toBe("img");
    expect(layers(container)[0]).toHaveAttribute("loading", "lazy");
  });

  it("refuses a doodle the DS does not have", () => {
    const bad: ArtLayer[] = [{ doodle: { name: "ink-moon" }, left: 1, width: 10, top: 1 }];
    expect(() => render(<ArtBoard tone="sun" layers={bad} sizes={SIZES} />)).toThrow(/ink-moon/);
  });
});

describe("ArtBoard: loading (ADR-010, N12)", () => {
  it("lazy-loads every raster when the board does not hold the LCP", () => {
    const { container } = render(<ArtBoard tone="blue" layers={HOME_HERO} sizes={SIZES} hero />);
    for (const img of container.querySelectorAll("img[srcset]")) {
      expect(img).toHaveAttribute("loading", "lazy");
      expect(img).not.toHaveAttribute("fetchpriority");
    }
  });

  it("gives the LCP hint to the largest raster only: Advik (0.54² × 1198/744) over Kheelu (0.44² × 1397/1154)", () => {
    const { container, baseElement } = render(<ArtBoard tone="blue" layers={HOME_HERO} sizes={SIZES} hero lcp />);
    const [advik, kheelu] = [layers(container)[1], layers(container)[2]];
    expect(advik).toHaveAttribute("loading", "eager");
    expect(advik).toHaveAttribute("fetchpriority", "high");
    expect(kheelu).toHaveAttribute("loading", "lazy");
    expect(kheelu).not.toHaveAttribute("fetchpriority");
    expect(baseElement.ownerDocument.head.querySelector('link[rel="preload"]')).toBeNull();
  });

  it("picks the largest by rendered area, not by list position", () => {
    const swapped: ArtLayer[] = [
      { image: { src: KHEELU, alt: "" }, left: 2, width: 60, bottom: 2 },
      { image: { src: ADVIK, alt: "" }, left: 38, width: 40, bottom: 0 },
    ];
    const { container } = render(<ArtBoard tone="blue" layers={swapped} sizes={SIZES} lcp />);
    expect(layers(container)[0]).toHaveAttribute("fetchpriority", "high");
    expect(layers(container)[1]).not.toHaveAttribute("fetchpriority");
  });
});

describe("ArtBoard: compile-time contract (tsc checks these lines; never rendered)", () => {
  it("requires sizes, has no priority prop, and takes a layer as an image or a doodle, never both", () => {
    const misuses = () => (
      <>
        {/* @ts-expect-error sizes is required: each raster asks for its share of the board's sizes */}
        <ArtBoard tone="blue" layers={HOME_HERO} />
        {/* @ts-expect-error no priority prop: the board's LCP raster takes lcp */}
        <ArtBoard tone="blue" layers={HOME_HERO} sizes={SIZES} priority />
        {/* @ts-expect-error a layer is an image or a doodle, never both */}
        <ArtBoard tone="blue" sizes={SIZES} layers={[{ image: { src: ADVIK, alt: "" }, doodle: { name: "ink-heart" }, left: 1, top: 1, width: 10 }]} />
        {/* @ts-expect-error a ratio is "width / height" */}
        <ArtBoard tone="blue" layers={HOME_HERO} sizes={SIZES} ratio="4:3" />
      </>
    );
    expect(misuses).toBeTypeOf("function");
  });
});
