import { render, screen } from "@testing-library/react";
import { Reveal } from "./Reveal";

describe("Reveal (a plain wrapper since the 2026-10 redesign)", () => {
  it("renders its children fully visible, with no reveal hook to hide them", () => {
    render(<Reveal mode="fade" delay={0.3}>Hello parent</Reveal>);
    const el = screen.getByText("Hello parent");
    expect(el).not.toHaveAttribute("data-reveal");
    expect(el).not.toHaveAttribute("style");
  });

  it("renders an <li> when as='li' so list semantics stay valid", () => {
    render(
      <ul>
        <Reveal as="li">Row</Reveal>
      </ul>,
    );
    expect(screen.getByText("Row").tagName).toBe("LI");
  });

  it("forwards a custom className", () => {
    render(<Reveal className="mt-8">Content</Reveal>);
    expect(screen.getByText("Content")).toHaveClass("mt-8");
  });
});
