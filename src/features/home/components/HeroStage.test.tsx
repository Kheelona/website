import { render, screen } from "@testing-library/react";
import { HeroStage } from "./HeroStage";

describe("HeroStage", () => {
  it("renders the plush as the priority image and Kheelu beside it", () => {
    render(<HeroStage />);
    expect(
      screen.getByAltText(/Lumi, the sky blue talking plush toy/i),
    ).toHaveAttribute("src", "/product/lumi-blue-2.png");
    expect(
      screen.getByAltText(/Kheelu, the Kheelona mascot/i),
    ).toHaveAttribute("src", "/mascot/mascot-hero-wink.png");
  });

  it("carries no fact bubbles (V4: the team asked for them off)", () => {
    render(<HeroStage />);
    expect(document.querySelectorAll(".hero-bubble").length).toBe(0);
  });
});
