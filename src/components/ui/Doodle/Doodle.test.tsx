import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DOODLE_NAMES } from "@/assets/doodles.generated";
import { asDoodleName, Doodle } from "./Doodle";
import { doodleSrc } from "./doodle-files";

/* Doodle (task 2.3; D049 picks 2 and 3, ADR-010, architecture §11.2 row 3 and §11.3). Still: the DS file as a
   plain decorative <img> (heroes). Drawn: the generated inline SVG, the hook motion.css draws
   (`.ks-doodle[data-draw] path:not(.ks-doodle__fill)`), in an order of 1 to 5. */

const at = { left: 43, top: 2, width: 13, rotate: 10 };

/** True when `src` serves the DS file `Doodles/<name>.svg`: its URL (Next, Storybook) or, where Vite inlines a
 *  small asset as a data URI (Vitest), the same SVG text (Vite collapses whitespace between tags, swaps double
 *  quotes for single ones and percent-encodes, vite svgToDataURL). */
function servesDsDoodle(src: string | null, name: string): boolean {
  if (!src) return false;
  const file = readFileSync(`design-system/project/assets/Doodles/${name}.svg`, "utf8");
  if (src.startsWith("data:image/svg+xml;base64,")) return Buffer.from(src.slice(26), "base64").toString("utf8") === file;
  if (src.startsWith("data:image/svg+xml,")) {
    const squash = (s: string) => s.trim().replace(/>\s+</g, "><").replace(/"/g, "'").replace(/\s+/g, " ");
    return squash(decodeURIComponent(src.slice(19))) === squash(file);
  }
  return src.endsWith(`/Doodles/${name}.svg`);
}

describe("Doodle, still (a hero: pick 2)", () => {
  it("renders the DS file as a plain decorative <img> in the layer class, positioned", () => {
    const { container } = render(<Doodle name="chalk-question-mark" draw={false} className="kh-art__layer" placement={at} />);
    const img = container.querySelector("img")!;
    expect(container.children).toHaveLength(1);
    expect(servesDsDoodle(img.getAttribute("src"), "chalk-question-mark")).toBe(true);
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveClass("kh-art__layer");
    expect(img.style.left).toBe("43%");
    expect(img.style.top).toBe("2%");
    expect(img.style.width).toBe("13%");
    expect(img.style.transform).toBe("rotate(10deg)");
    expect(img).not.toHaveAttribute("loading");
    expect(img).toHaveAttribute("fetchpriority", "low");
  });

  it("never carries the draw hooks and never inlines the SVG", () => {
    const { container } = render(<Doodle name="ink-heart" draw={false} order={3} className="kh-art__layer" placement={at} />);
    expect(container.querySelector("svg")).toBeNull();
    expect(container.querySelector("[data-draw], [data-draw-order]")).toBeNull();
  });

  it("loads lazily below the first screen when asked", () => {
    const { container } = render(<Doodle name="ink-heart" draw={false} lazy className="kh-art__layer" placement={at} />);
    expect(container.querySelector("img")).toHaveAttribute("loading", "lazy");
  });
});

describe("Doodle, drawn (below the first screen: pick 3)", () => {
  it("renders the generated inline SVG with data-draw and order 1 by default, positioned", () => {
    const { container } = render(<Doodle name="chalk-planet" draw className="kh-imagine__doodle" placement={{ left: 4, top: 30, width: 20, rotate: -10 }} />);
    const svg = container.querySelector("svg")!;
    expect(container.querySelector("img")).toBeNull();
    expect(svg).toHaveClass("ks-doodle", "kh-imagine__doodle");
    expect(svg).toHaveAttribute("data-draw", "");
    expect(svg).toHaveAttribute("data-draw-order", "1");
    expect(svg.style.left).toBe("4%");
    expect(svg.style.top).toBe("30%");
    expect(svg.style.width).toBe("20%");
    expect(svg.style.transform).toBe("rotate(-10deg)");
  });

  it("is the element motion.css draws: .ks-doodle[data-draw] holding stroked paths", () => {
    const { container } = render(<Doodle name="chalk-question-mark" draw className="kh-art__layer" placement={at} />);
    const svg = container.querySelector("svg")!;
    expect(svg.matches(".ks-doodle[data-draw]")).toBe(true);
    const strokes = svg.querySelectorAll("path:not(.ks-doodle__fill)");
    expect(strokes.length).toBeGreaterThan(0);
    strokes.forEach((p) => expect(p).toHaveAttribute("pathLength", "1"));
  });

  /* motion.css strokes every `.ks-doodle[data-draw] path:not(.ks-doodle__fill)` from dash offset 1 to 0 and fades
     every `.ks-doodle__fill` in at the end (architecture §11.2 row 3). So, in every doodle: what the stroke rule
     selects is an unfilled stroke that is one dash long, and anything painted with a fill is marked as a fill. */
  it.each(DOODLE_NAMES)("%s: the stroke rule selects only unfilled strokes, and every filled shape is a ks-doodle__fill", (name) => {
    const { container } = render(<Doodle name={name} draw className="kh-art__layer" placement={at} />);
    const svg = container.querySelector("svg")!;
    // From the container: jsdom does not match a descendant selector that starts at the scope element itself.
    const strokes = [...container.querySelectorAll(".ks-doodle[data-draw] path:not(.ks-doodle__fill)")];
    expect(strokes.length, "strokes to draw").toBeGreaterThan(0);
    for (const path of strokes) {
      expect(path.getAttribute("fill"), "a drawn path is not filled").toBe("none");
      expect(path.getAttribute("stroke"), "a drawn path has a stroke").toMatch(/\S/);
      expect(path.getAttribute("pathLength"), "a drawn path is one dash long").toBe("1");
    }
    const filled = [...svg.querySelectorAll("[fill]")].filter((el) => el.tagName.toLowerCase() !== "g" && el.getAttribute("fill") !== "none");
    for (const shape of filled) expect(shape, `${shape.tagName} painted with fill ${shape.getAttribute("fill")}`).toHaveClass("ks-doodle__fill");
  });

  it.each([2, 3, 4, 5] as const)("carries data-draw-order %i for the stagger", (order) => {
    const { container } = render(<Doodle name="chalk-star" draw order={order} className="kh-imagine__doodle" placement={at} />);
    expect(container.querySelector("svg")).toHaveAttribute("data-draw-order", String(order));
  });

  it("stays decorative: hidden from assistive technology and never focusable", () => {
    const { container } = render(<Doodle name="ink-star" draw className="kh-art__layer" placement={{ left: 82, bottom: 9, width: 11 }} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(svg).not.toHaveAttribute("role");
    expect(svg.style.bottom).toBe("9%");
  });
});

describe("the DS doodle files", () => {
  it("has the DS file of the same name for every generated doodle", () => {
    for (const name of DOODLE_NAMES) expect(servesDsDoodle(doodleSrc(name), name), name).toBe(true);
    expect(servesDsDoodle(doodleSrc("ink-star"), "ink-heart"), "control: another file").toBe(false);
  });

  it("narrows a content string to a doodle name, and refuses one the DS does not have", () => {
    expect(asDoodleName("ink-star")).toBe("ink-star");
    expect(() => asDoodleName("ink-moon")).toThrow(/ink-moon/);
  });
});
