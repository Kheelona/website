import { render, screen } from "@testing-library/react";
import { MascotScene } from "./MascotScene";

describe("MascotScene", () => {
  it("renders the pose cutout with its descriptive alt and src", () => {
    render(<MascotScene pose="hero-wink" />);
    const img = screen.getByRole("img", {
      name: /friendly fox with round blue glasses, winking/i,
    });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/mascot/mascot-hero-wink.png");
  });

  it("swaps the alt text and asset per pose", () => {
    render(<MascotScene pose="joy" />);
    const img = screen.getByRole("img", { name: /dancing with one arm in the air/i });
    expect(img).toHaveAttribute("src", "/mascot/mascot-joy.png");
  });

  it("carries the high fetch priority hint when priority is set", () => {
    render(<MascotScene pose="hero-wink" priority />);
    expect(screen.getByRole("img")).toHaveAttribute("fetchpriority", "high");
  });
});
