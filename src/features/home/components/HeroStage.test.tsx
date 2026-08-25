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

  /* §8.31: the cream plush needs a ground or it reads as an outline on the
     cream wash. The panel is decorative and nothing reads on it, so it must
     stay aria-hidden and stay label-free — the moment text goes in here, the
     §8.29 white-on-orange law starts applying to it. */
  it("grounds the plush on an orange panel that is decorative and label-free", () => {
    const { container } = render(<HeroStage />);
    const panel = container.querySelector("[data-hero-panel]");
    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute("aria-hidden", "true");
    expect(panel!.className).toContain("bg-orange");
    expect(panel!.textContent).toBe("");
  });

  /* The panel is bounded to this column ON PURPOSE. A radial glow was tried
     first and reached into the copy column, putting ink body text on deep
     orange. Horizontal insets are the guard; going wider needs a re-check. */
  it("keeps the panel inset-bounded rather than free-floating", () => {
    const { container } = render(<HeroStage />);
    const cls = container.querySelector("[data-hero-panel]")!.className;
    expect(cls).toMatch(/inset-x/);
    expect(cls).not.toMatch(/w-screen|left-1\/2/);
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
