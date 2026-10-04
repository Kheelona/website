import { render, screen } from "@testing-library/react";
import { HeroStage } from "./HeroStage";
import { KHEELU_ART } from "@/lib/kheelu-art";

describe("HeroStage (Kheelu alone, 2026-08-25)", () => {
  it("renders the Kheelu artwork as the priority hero image", () => {
    render(<HeroStage />);
    const art = screen.getByAltText(KHEELU_ART.alt);
    expect(art).toHaveAttribute("src", KHEELU_ART.src);
    expect(art).toHaveAttribute("data-priority", "true");
  });

  it("declares the shipped file's real dimensions, so the box cannot cause CLS", () => {
    render(<HeroStage />);
    const art = screen.getByAltText(KHEELU_ART.alt);
    expect(art).toHaveAttribute("width", String(KHEELU_ART.width));
    expect(art).toHaveAttribute("height", String(KHEELU_ART.height));
  });

  it("carries no fact bubbles (V4: the team asked for them off)", () => {
    render(<HeroStage />);
    expect(document.querySelectorAll(".hero-bubble").length).toBe(0);
  });

  it("composes ONE image", () => {
    render(<HeroStage />);
    expect(document.querySelectorAll("img").length).toBe(1);
  });

  /* The guide-suppression flag and the artwork must agree. It exists so the
     mascot illustration and the corner guide never share a viewport (V5-5);
     with the mascot out of the hero, the guide should greet normally. When the
     founder's whisper composite lands, this is the reminder to restore the flag.

     This used to also assert `KHEELU_ART.alt` did not mention "Kheelu", using
     the alt string as a proxy for "the mascot is not in this picture". The
     2026-09-05 rename killed that proxy: the PRODUCT is called Kheelu now, so
     its own alt text names it and the assertion could only ever fail. The
     invariant that actually matters is unchanged and is asserted directly here
     and by "composes ONE image" above: the hero holds the product art alone. */
  it("does not suppress the corner guide, because the mascot is not in this artwork", () => {
    const { container } = render(<HeroStage />);
    expect(container.querySelector("[data-hero-has-kheelu]")).toBeNull();
    expect(document.querySelectorAll("img")).toHaveLength(1);
    expect(screen.getByAltText(KHEELU_ART.alt)).toHaveAttribute("src", KHEELU_ART.src);
  });
});
