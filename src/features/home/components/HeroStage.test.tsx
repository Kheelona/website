import { render, screen } from "@testing-library/react";
import { HeroStage } from "./HeroStage";
import { LUMI_ART } from "@/lib/lumi-art";

describe("HeroStage (Lumi alone, 2026-08-25)", () => {
  it("renders the Lumi artwork as the priority hero image", () => {
    render(<HeroStage />);
    const art = screen.getByAltText(LUMI_ART.alt);
    expect(art).toHaveAttribute("src", LUMI_ART.src);
    expect(art).toHaveAttribute("data-priority", "true");
  });

  it("declares the shipped file's real dimensions, so the box cannot cause CLS", () => {
    render(<HeroStage />);
    const art = screen.getByAltText(LUMI_ART.alt);
    expect(art).toHaveAttribute("width", String(LUMI_ART.width));
    expect(art).toHaveAttribute("height", String(LUMI_ART.height));
  });

  it("carries no fact bubbles (V4: the team asked for them off)", () => {
    render(<HeroStage />);
    expect(document.querySelectorAll(".hero-bubble").length).toBe(0);
  });

  it("composes ONE image", () => {
    render(<HeroStage />);
    expect(document.querySelectorAll("img").length).toBe(1);
  });

  /* The guide-suppression flag and the artwork must agree. It exists so two
     Kheelus never share a viewport (V5-5); with Kheelu out of the hero, the
     corner guide should greet normally. When the founder's whisper composite
     lands, this assertion is the reminder to put the flag back with it. */
  it("does not suppress the corner guide, because Kheelu is not in this artwork", () => {
    const { container } = render(<HeroStage />);
    expect(container.querySelector("[data-hero-has-kheelu]")).toBeNull();
    expect(LUMI_ART.alt).not.toMatch(/Kheelu/);
  });
});
