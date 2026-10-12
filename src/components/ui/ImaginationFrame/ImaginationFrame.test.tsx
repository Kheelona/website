import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it, vi } from "vitest";
import { type DoodleLayer, IMAGINE_ZOOM, ImaginationFrame } from "./ImaginationFrame";

/* ImaginationFrame (task 2.3; DS ImaginationFrame kh-imagine, bundle.css:432-460; D049 pick 3; the founder's zoom,
   mockup.css:130-132). Fixture: Home fold 3, home.html:145-151. Rendered through the real next/image. */
vi.unmock("next/image");

const KABIR = {
  src: { src: "/_next/static/media/kabir-01-imagining-space-web.webp", width: 1208, height: 1500 } as StaticImageData,
  alt: "A boy in glasses and a rust T-shirt holding Kheelu against a dark wall, looking up at a chalk planet.",
};
const HOME_DOODLES: readonly DoodleLayer[] = [
  { doodle: { name: "chalk-planet" }, left: 4, top: 30, width: 20, rotate: -10 },
  { doodle: { name: "chalk-star" }, left: 16, top: 22, width: 8, rotate: -18 },
  { doodle: { name: "chalk-star" }, left: 86, top: 48, width: 7, rotate: 12 },
  { doodle: { name: "chalk-thought-cloud" }, left: 72, top: 22, width: 20 },
];
const QUESTION = "why does the moon follow our car?";
const SIZES = "(min-width: 900px) 540px, calc(100vw - 32px)";

const frame = (c: HTMLElement) => c.firstElementChild as HTMLElement;
const children = (c: HTMLElement) => [...frame(c).children] as HTMLElement[];

describe("ImaginationFrame: markup", () => {
  it("is a kh-imagine figure: the photo, the doodles in order, then the question", () => {
    const { container } = render(<ImaginationFrame photo={KABIR} sizes={SIZES} doodles={HOME_DOODLES} question={QUESTION} />);
    expect(frame(container).tagName.toLowerCase()).toBe("figure");
    expect(frame(container).className).toBe("kh-imagine");
    const tags = children(container).map((el) => `${el.tagName.toLowerCase()}.${el.getAttribute("class")?.split(" ").at(-1)}`);
    expect(tags).toEqual(["img.kh-imagine__photo", "svg.kh-imagine__doodle", "svg.kh-imagine__doodle", "svg.kh-imagine__doodle", "svg.kh-imagine__doodle", "figcaption.kh-imagine__question"]);
    expect(children(container).at(-1)).toHaveTextContent(QUESTION);
  });

  it("adds the founder's zoom class (ks-imagine-zoom) and a section class", () => {
    const { container } = render(<ImaginationFrame photo={KABIR} sizes={SIZES} zoom className="ks-x" />);
    expect(frame(container).className).toBe("kh-imagine ks-imagine-zoom ks-x");
  });

  it("has no figcaption without a question, and no doodles without doodles", () => {
    const { container } = render(<ImaginationFrame photo={KABIR} sizes={SIZES} />);
    expect(children(container)).toHaveLength(1);
  });

  it("marks a frame that reveals on scroll, and refuses it in a hero or on the LCP", () => {
    expect(frame(render(<ImaginationFrame photo={KABIR} sizes={SIZES} reveal />).container)).toHaveAttribute("data-reveal", "");
    expect(() => render(<ImaginationFrame photo={KABIR} sizes={SIZES} hero reveal />)).toThrow(/hero/i);
    expect(() => render(<ImaginationFrame photo={KABIR} sizes={SIZES} lcp reveal />)).toThrow(/LCP/);
  });
});

describe("ImaginationFrame: the photo", () => {
  it("renders the photo through next/image with its alt text and the frame's sizes, lazily", () => {
    const { container } = render(<ImaginationFrame photo={KABIR} sizes={SIZES} />);
    const photo = children(container)[0];
    expect(photo).toHaveAttribute("alt", KABIR.alt);
    expect(photo).toHaveAttribute("sizes", SIZES);
    expect(photo.getAttribute("srcset")).toMatch(/ \d+w(,|$)/);
    expect(photo).toHaveAttribute("loading", "lazy");
    expect(photo).not.toHaveAttribute("fetchpriority");
  });

  it("asks for the photo at its painted size when zoomed: the frame's sizes times the zoom", () => {
    const { container } = render(<ImaginationFrame photo={KABIR} sizes={SIZES} zoom />);
    expect(children(container)[0]).toHaveAttribute("sizes", "(min-width: 900px) calc(540px * 1.32), calc((100vw - 32px) * 1.32)");
  });

  it("takes its zoom factor from imagination-frame.css, the one place the scale is set", () => {
    const css = readFileSync("src/components/ui/ImaginationFrame/imagination-frame.css", "utf8");
    const scale = /\.ks-imagine-zoom \.kh-imagine__photo\s*\{[^}]*transform:\s*scale\(([\d.]+)\)/.exec(css);
    expect(scale, "the zoom rule in imagination-frame.css").not.toBeNull();
    expect(IMAGINE_ZOOM).toBe(Number(scale![1]));
  });

  it("loads eagerly at high priority when it is the page's LCP image", () => {
    const { container } = render(<ImaginationFrame photo={KABIR} sizes={SIZES} lcp />);
    expect(children(container)[0]).toHaveAttribute("loading", "eager");
    expect(children(container)[0]).toHaveAttribute("fetchpriority", "high");
  });
});

describe("ImaginationFrame: the doodles (D049 pick 3)", () => {
  it("draws each doodle, staggered by its place when the content gives no order", () => {
    const { container } = render(<ImaginationFrame photo={KABIR} sizes={SIZES} doodles={HOME_DOODLES} />);
    const doodles = [...container.querySelectorAll("svg.kh-imagine__doodle")];
    expect(doodles.map((d) => d.getAttribute("data-draw-order"))).toEqual(["1", "2", "3", "4"]);
    doodles.forEach((d) => expect(d).toHaveClass("ks-doodle"));
    expect((doodles[0] as SVGElement).style.left).toBe("4%");
    expect((doodles[0] as SVGElement).style.top).toBe("30%");
    expect((doodles[3] as SVGElement).style.transform).toBe("rotate(0deg)");
  });

  it("keeps an order the content gives, and never staggers past step 5", () => {
    const six: DoodleLayer[] = Array.from({ length: 6 }, (_, i) => ({ doodle: { name: "chalk-star" }, left: i * 10, top: 10, width: 5 }));
    six[0] = { ...six[0], doodle: { name: "chalk-star", order: 3 } };
    const { container } = render(<ImaginationFrame photo={KABIR} sizes={SIZES} doodles={six} />);
    expect([...container.querySelectorAll("[data-draw-order]")].map((d) => d.getAttribute("data-draw-order"))).toEqual(["3", "2", "3", "4", "5", "5"]);
  });

  it("keeps the doodles still in a hero (pick 2): plain <img> of the DS files", () => {
    const { container } = render(<ImaginationFrame photo={KABIR} sizes={SIZES} doodles={HOME_DOODLES} hero />);
    expect(container.querySelector("[data-draw]")).toBeNull();
    const imgs = container.querySelectorAll("img.kh-imagine__doodle");
    expect(imgs).toHaveLength(4);
    imgs.forEach((img) => {
      expect(img).toHaveAttribute("alt", "");
      expect(img).not.toHaveAttribute("loading");
    });
  });

  it("refuses a doodle the DS does not have", () => {
    expect(() => render(<ImaginationFrame photo={KABIR} sizes={SIZES} doodles={[{ doodle: { name: "chalk-moon" }, left: 1, top: 1, width: 5 }]} />)).toThrow(/chalk-moon/);
  });
});
