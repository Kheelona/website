import { render } from "@testing-library/react";
import { PromiseMark, PROMISE_MARK_COUNT } from "./PromiseMark";

describe("PromiseMark", () => {
  it("renders decorative brand geometry, never announced to a screen reader", () => {
    const { container } = render(<PromiseMark index={0} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg.querySelector("path")).toBeTruthy();
  });

  it("gives each position in a group a different shape (no repeats in a four-up)", () => {
    const paths = [0, 1, 2, 3].map((i) => {
      const { container } = render(<PromiseMark index={i} />);
      return container.querySelector("path")!.getAttribute("d");
    });
    expect(new Set(paths).size).toBe(4);
  });

  it("wraps safely past the end of the rotation", () => {
    const { container: a } = render(<PromiseMark index={0} />);
    const { container: b } = render(<PromiseMark index={PROMISE_MARK_COUNT} />);
    expect(b.querySelector("path")!.getAttribute("d")).toBe(
      a.querySelector("path")!.getAttribute("d"),
    );
  });

  it("reads as chosen, not as a smudge: above the Shape default opacity", () => {
    const { container } = render(<PromiseMark index={1} />);
    expect(Number(container.querySelector("path")!.getAttribute("fill-opacity"))).toBeGreaterThan(
      0.15,
    );
  });

  it("takes a size override for tighter groups", () => {
    const { container } = render(<PromiseMark index={2} size="w-7" />);
    // SVG className is an SVGAnimatedString, not a string — read the attribute
    expect(container.querySelector("svg")!.getAttribute("class")).toContain("w-7");
  });
});
