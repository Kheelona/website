import { readFileSync } from "node:fs";
import { join } from "node:path";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildOffer } from "@/lib/offer/offer";
import { StickyScroll } from "./StickyScroll";
import storiesMeta, * as stories from "./StickyScroll.stories";
import type { StickyScrollConfig } from "./sticky-scroll.types";

/* StickyScroll (task Q2.9; the D2C plan v2 §1.6 and §2 fold 5; D064 items 7 and 10): what Kheelu is and what a child
 * gets, point by point. Phones: stacked, each point with its own small picture (the one that carries the alt). From
 * 900 px: the heading, a stage with the point's picture and a thin progress line stay in view on the left while the
 * points scroll on the right; the island marks the point being read, CSS crossfades the stage and fills the line, only
 * where motion is welcome. The stage repeats the pictures for sighted readers only. A point may carry a small written
 * example, always labelled. The CTA block (`cta`) comes after the line, outside every reveal. */

const OFFER = buildOffer("token");
const IMAGE = (name: string) => ({ src: `/media/${name}.jpg`, width: 1600, height: 900, alt: `A picture of ${name}.` }) as const;
const CONFIG: StickyScrollConfig = {
  id: "asks",
  heading: { eyebrow: "How it works", title: "Kheelu asks. {hand:Your child thinks.}", id: "asks-title" },
  points: [
    { title: "A soft plush rabbit.", body: "No screen.", picture: { image: IMAGE("one"), fit: "contain" } },
    {
      title: "It asks one back.",
      body: "So they do the thinking.",
      picture: { image: IMAGE("two") },
      example: {
        note: "Illustrative example, not a recording.",
        lines: [
          { who: "Your child", text: "“Why?”" },
          { who: "Kheelu", text: "“Because. What do you think?”" },
        ],
      },
    },
    { title: "You read every conversation.", body: "In the parent app.", picture: { image: IMAGE("three") } },
  ],
  line: "Other AI gives answers. Kheelu asks questions.",
};
const CSS = readFileSync(join(process.cwd(), "src/components/sections/StickyScroll/sticky-scroll.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/** The island's IntersectionObserver, captured so a test can say which point crosses the reading line. */
class TestObserver {
  static all: TestObserver[] = [];
  readonly targets: Element[] = [];
  constructor(
    readonly callback: (entries: Partial<IntersectionObserverEntry>[]) => void,
    readonly options: IntersectionObserverInit,
  ) {
    TestObserver.all.push(this);
  }
  observe(el: Element) {
    this.targets.push(el);
  }
  disconnect() {}
}

beforeEach(() => {
  TestObserver.all = [];
  vi.stubGlobal("IntersectionObserver", TestObserver);
});
afterEach(() => vi.unstubAllGlobals());

describe("StickyScroll: the fold", () => {
  it("is a section named by its h2, the heading, stage and progress line on the left, the points on the right", () => {
    const { container } = render(<StickyScroll {...CONFIG} offer={OFFER} />);
    const section = screen.getByRole("region", { name: "Kheelu asks. Your child thinks." });
    expect(container.firstElementChild).toBe(section);
    expect(section).toHaveAttribute("id", "asks");
    expect(section.className).toBe("kh-section ks-sticky");
    const grid = section.querySelector(".kh-container > .kh-split.kh-split--wide-end.ks-sticky__grid")!;
    expect([...grid.children].map((el) => el.className)).toEqual(["ks-sticky__aside", "ks-sticky__points ks-list-reset"]);
    const aside = grid.firstElementChild!;
    expect([...aside.children].map((el) => el.className)).toEqual(["kh-heading", "ks-sticky__stage", "ks-sticky__progress ks-list-reset"]);
    expect([...aside.querySelectorAll("h2 .kh-hand")].map((s) => s.textContent)).toEqual(["Your child thinks."]);
  });

  it("reads the points in order, each an h3 and its words, each with its own small picture carrying the alt", () => {
    render(<StickyScroll {...CONFIG} offer={OFFER} />);
    const list = screen.getByRole("list", { name: "" });
    expect(list.tagName).toBe("OL");
    const points = [...document.querySelectorAll(".ks-sticky__point")];
    expect(points.map((li) => [li.querySelector("h3.kh-title")?.textContent, li.querySelector("p.ks-sticky__body")?.textContent])).toEqual(
      CONFIG.points.map((p) => [p.title, p.body]),
    );
    expect(points.map((li) => li.querySelector("figure.ks-sticky__thumb img")?.getAttribute("alt"))).toEqual(CONFIG.points.map((p) => p.picture.image.alt));
    expect(points.map((li) => li.querySelector("figure")?.className)).toEqual([
      "kh-photo ks-sticky__thumb ks-sticky__thumb--contain",
      "kh-photo ks-sticky__thumb",
      "kh-photo ks-sticky__thumb",
    ]);
    for (const img of document.querySelectorAll(".ks-sticky__thumb img")) {
      expect(img).toHaveAttribute("loading", "lazy");
      expect(img).toHaveAttribute("sizes", "(min-width: 900px) 1px, 96px");
    }
    for (const li of points) expect(li).toHaveAttribute("data-reveal", "");
  });

  it("repeats the pictures on the stage for sighted readers only, the first on before any scroll, the progress's first step too", () => {
    const { container } = render(<StickyScroll {...CONFIG} offer={OFFER} />);
    const stage = container.querySelector("[data-stage]")!;
    expect(stage).toHaveAttribute("aria-hidden", "true");
    expect([...stage.querySelectorAll("img")].map((img) => img.getAttribute("alt"))).toEqual(["", "", ""]);
    expect([...stage.children].map((pic) => pic.hasAttribute("data-on"))).toEqual([true, false, false]);
    expect([...stage.children].map((pic) => pic.className)).toEqual(["ks-sticky__pic ks-sticky__pic--contain", "ks-sticky__pic", "ks-sticky__pic"]);
    for (const img of stage.querySelectorAll("img")) {
      expect(img).toHaveAttribute("loading", "lazy");
      expect(img).toHaveAttribute("sizes", "(min-width: 1296px) 480px, (min-width: 900px) 40vw, 1px");
    }
    const progress = container.querySelector("[data-progress]")!;
    expect(progress).toHaveAttribute("aria-hidden", "true");
    expect([...progress.children].map((step) => step.hasAttribute("data-on"))).toEqual([true, false, false]);
  });

  it("labels the written example above the exchange, the label naming the list", () => {
    render(<StickyScroll {...CONFIG} offer={OFFER} />);
    const list = screen.getByRole("list", { name: "Illustrative example, not a recording." });
    expect(list.closest(".ks-sticky__point")?.querySelector("h3")?.textContent).toBe("It asks one back.");
    expect(list.previousElementSibling?.textContent).toBe("Illustrative example, not a recording.");
    expect([...list.children].map((li) => li.textContent)).toEqual(["Your child “Why?”", "Kheelu “Because. What do you think?”"]);
    expect(list.closest(".kh-card")).toHaveClass("ks-sticky__example");
  });

  it("refuses a written example without its label", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const unlabelled = { ...CONFIG.points[1], example: { ...CONFIG.points[1].example!, note: " " } };
    expect(() => render(<StickyScroll {...CONFIG} points={[CONFIG.points[0], unlabelled]} offer={OFFER} />)).toThrow(/label/);
    vi.mocked(console.error).mockRestore();
  });

  it("ends on the line, a paragraph and not a heading, then the CTA block, both outside the points and every reveal", () => {
    const { container } = render(<StickyScroll {...CONFIG} offer={OFFER} cta={<div className="cta-slot" />} />);
    const line = container.querySelector(".ks-sticky__grid + p.kh-title.ks-sticky__line")!;
    expect(line.textContent).toBe(CONFIG.line);
    expect(line.nextElementSibling).toHaveClass("cta-slot");
    expect(container.querySelector(".cta-slot")?.closest("[data-reveal]")).toBeNull();
  });
});

describe("StickyScroll: the point being read (the island)", () => {
  const stageOn = (container: HTMLElement) => [...container.querySelectorAll("[data-stage] > *")].map((pic) => pic.hasAttribute("data-on"));
  const stepsOn = (container: HTMLElement) => [...container.querySelectorAll("[data-progress] > *")].map((step) => step.hasAttribute("data-on"));

  it("watches every point against a thin reading line a little above the screen's middle", () => {
    const { container } = render(<StickyScroll {...CONFIG} offer={OFFER} />);
    expect(TestObserver.all).toHaveLength(1);
    const [observer] = TestObserver.all;
    expect(observer.options.rootMargin).toBe("-40% 0px -55% 0px");
    expect(observer.targets).toEqual([...container.querySelectorAll("[data-point]")]);
  });

  it("shows the picture of the point crossing the line and fills the progress up to it; between points the last stays", () => {
    const { container } = render(<StickyScroll {...CONFIG} offer={OFFER} />);
    const [observer] = TestObserver.all;
    const points = [...container.querySelectorAll("[data-point]")];
    act(() => observer.callback([{ target: points[2], isIntersecting: true }]));
    expect(stageOn(container)).toEqual([false, false, true]);
    expect(stepsOn(container)).toEqual([true, true, true]);
    act(() => observer.callback([{ target: points[2], isIntersecting: false }]));
    expect(stageOn(container)).toEqual([false, false, true]);
    act(() => observer.callback([{ target: points[1], isIntersecting: true }]));
    expect(stageOn(container)).toEqual([false, true, false]);
    expect(stepsOn(container)).toEqual([true, true, false]);
  });
});

describe("StickyScroll: the layout and its motion (sticky-scroll.css)", () => {
  it("shows the stage and the progress line from 900 px only, the aside sticky a DS gap under the laptop's sticky nav", () => {
    expect(CSS).toMatch(/\.ks-sticky__stage,\s*\.ks-sticky__progress \{\s*display: none;\s*\}/);
    expect(CSS).toMatch(/@media \(min-width: 900px\) \{\s*\.ks-sticky__aside \{\s*position: sticky;\s*top: calc\(var\(--ks-nav-clearance, 0px\) \+ var\(--space-6\)\);/);
    expect(CSS).toMatch(/\.ks-sticky__thumb \{\s*display: none;\s*\}/);
  });

  it("crossfades and fills only where motion is welcome, on DS tokens, and draws no fill under reduced motion", () => {
    const motion = /@media \(min-width: 900px\) and \(prefers-reduced-motion: no-preference\) \{([\s\S]*?)\n\}/.exec(CSS)?.[1] ?? "";
    expect(motion).toMatch(/\.ks-sticky__pic \{\s*transition: opacity var\(--duration-enter\) var\(--ease-standard\);\s*\}/);
    expect(motion).toMatch(/\.ks-sticky__progress > li::after \{\s*transition: transform var\(--duration-enter\) var\(--ease-standard\);\s*\}/);
    expect(CSS.replace(/@media \(min-width: 900px\) and \(prefers-reduced-motion: no-preference\) \{[\s\S]*?\n\}/, "")).not.toMatch(/transition|animation/);
    expect(CSS).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\.ks-sticky__progress \{\s*display: none;\s*\}\s*\}/);
  });
});

describe("StickyScroll: the stories show Home's fold", () => {
  it("take the page's own config", () => {
    expect(storiesMeta.args.heading.id).toBe("asks-title");
    expect(storiesMeta.args.points).toHaveLength(6);
    expect(stories.TwoPoints.args?.points).toHaveLength(2);
  });
});
