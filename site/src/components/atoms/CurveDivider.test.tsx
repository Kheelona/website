import { render } from "@testing-library/react";
import { CurveDivider } from "./CurveDivider";

describe("CurveDivider", () => {
  it("renders a decorative, aria-hidden curve seam", () => {
    const { container } = render(<CurveDivider from="cream" />);
    const svg = container.querySelector("svg[data-curve]");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("paints the seam with the exact wash it bleeds from", () => {
    const { container } = render(<CurveDivider from="teal" />);
    const path = container.querySelector("path");
    // teal-deep band fill, matched to the section above
    expect(path).toHaveAttribute("fill", "#0f766e");
  });

  it("uses a different fill for a different source wash", () => {
    const { container } = render(<CurveDivider from="orange" />);
    const path = container.querySelector("path");
    expect(path).toHaveAttribute("fill", "#c25210");
  });

  it("mirrors the curve horizontally when flipped", () => {
    const { container } = render(<CurveDivider from="cream" flip />);
    const svg = container.querySelector("svg[data-curve]");
    expect(svg).toHaveStyle({ transform: "scaleX(-1)" });
  });

  it("has no transform when not flipped", () => {
    const { container } = render(<CurveDivider from="cream" />);
    const svg = container.querySelector("svg[data-curve]") as SVGElement;
    expect(svg.style.transform).toBe("");
  });
});
