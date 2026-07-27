import { render, screen } from "@testing-library/react";
import { Reveal } from "./Reveal";

describe("Reveal", () => {
  it("renders its children fully visible in SSR HTML", () => {
    render(<Reveal>Hello parent</Reveal>);
    expect(screen.getByText("Hello parent")).toBeInTheDocument();
  });

  it("defaults to the non-hiding rise mode via data-reveal", () => {
    render(<Reveal>Content</Reveal>);
    expect(screen.getByText("Content")).toHaveAttribute("data-reveal", "rise");
  });

  it("opts into fade mode when asked", () => {
    render(<Reveal mode="fade">Content</Reveal>);
    expect(screen.getByText("Content")).toHaveAttribute("data-reveal", "fade");
  });

  it("renders an <li> when as='li' so list semantics stay valid", () => {
    render(
      <ul>
        <Reveal as="li">Row</Reveal>
      </ul>,
    );
    const item = screen.getByText("Row");
    expect(item.tagName).toBe("LI");
  });

  it("applies a stagger via transitionDelay when a delay is set", () => {
    render(<Reveal delay={0.3}>Content</Reveal>);
    expect(screen.getByText("Content")).toHaveStyle({ transitionDelay: "0.3s" });
  });

  it("forwards a custom className", () => {
    render(<Reveal className="mt-8">Content</Reveal>);
    expect(screen.getByText("Content")).toHaveClass("mt-8");
  });
});
