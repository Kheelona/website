import { render, screen } from "@testing-library/react";
import { HeroStage } from "./HeroStage";

describe("HeroStage (REV-a final art, 2026-07-31)", () => {
  it("renders the single final artwork as the priority hero image", () => {
    render(<HeroStage />);
    const art = screen.getByAltText(/Kheelu, the Kheelona mascot, kneeling to whisper/i);
    expect(art).toHaveAttribute("src", "/hero/kheelu-lumi.png");
  });

  it("carries no fact bubbles (V4: the team asked for them off)", () => {
    render(<HeroStage />);
    expect(document.querySelectorAll(".hero-bubble").length).toBe(0);
  });

  it("composes ONE image now, not the interim two-cutout pair", () => {
    render(<HeroStage />);
    expect(document.querySelectorAll("img").length).toBe(1);
  });
});
