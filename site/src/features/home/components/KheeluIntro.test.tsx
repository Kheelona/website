import { render, screen } from "@testing-library/react";
import { KheeluIntro } from "./KheeluIntro";

describe("KheeluIntro", () => {
  it("renders Kheelu's self-introduction heading", () => {
    render(<KheeluIntro />);
    expect(
      screen.getByRole("heading", { name: /Hi! I'm Kheelu\./i }),
    ).toBeInTheDocument();
  });

  it("lists all four trait chips", () => {
    render(<KheeluIntro />);
    for (const label of [
      "Naturally Curious",
      "Kind & Caring",
      "Smart Explorer",
      "Playful & Fun",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("shows the winking mascot image", () => {
    render(<KheeluIntro />);
    expect(
      screen.getByAltText(/Kheelu, the Kheelona mascot, winking with a thumbs up/i),
    ).toHaveAttribute("src", "/mascot/mascot-hero-wink.png");
  });
});
