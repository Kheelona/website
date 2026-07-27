import { render } from "@testing-library/react";
import { HeroGlowBackground } from "./hero-glow";

describe("HeroGlowBackground", () => {
  it("renders a decorative, aria-hidden background fill", () => {
    const { container } = render(<HeroGlowBackground />);
    const root = container.querySelector('[data-slot="hero-glow-background"]');
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("aria-hidden", "true");
    // decorative contract: never intercepts pointer input
    expect(root?.className).toContain("pointer-events-none");
  });

  it("paints the three brand-warm blobs", () => {
    const { container } = render(<HeroGlowBackground />);
    const root = container.querySelector('[data-slot="hero-glow-background"]');
    expect(root?.children).toHaveLength(3);
  });

  it("forwards an extra className onto the fill", () => {
    const { container } = render(<HeroGlowBackground className="z-10" />);
    const root = container.querySelector('[data-slot="hero-glow-background"]');
    expect(root?.className).toContain("z-10");
  });
});
