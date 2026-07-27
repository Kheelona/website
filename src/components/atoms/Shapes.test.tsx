import { render } from "@testing-library/react";
import { Shape } from "./Shapes";

describe("Shape", () => {
  it("renders a decorative, aria-hidden brand shape with a path", () => {
    const { container } = render(<Shape kind="flower5" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("path")).toBeInTheDocument();
  });

  it("defaults to currentColor fill at the ambient 0.15 opacity", () => {
    const { container } = render(<Shape kind="flower5" />);
    const path = container.querySelector("path")!;
    expect(path).toHaveAttribute("fill", "currentColor");
    expect(path).toHaveAttribute("fill-opacity", "0.15");
  });

  it("uses the shared 67-unit viewBox for standard shapes", () => {
    const { container } = render(<Shape kind="flower5" />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 0 67.064 67.064",
    );
  });

  it("uses the shape's own viewBox for the kit additions", () => {
    const { container } = render(<Shape kind="triangle5" />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 0 70.365 64.736",
    );
  });

  it("applies caller color and opacity to the fill", () => {
    const { container } = render(
      <Shape kind="polygon" color="#0f766e" opacity={0.4} />,
    );
    const path = container.querySelector("path")!;
    expect(path).toHaveAttribute("fill", "#0f766e");
    expect(path).toHaveAttribute("fill-opacity", "0.4");
  });
});
