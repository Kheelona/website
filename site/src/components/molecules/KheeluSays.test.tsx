import { render, screen } from "@testing-library/react";
import { KheeluSays } from "./KheeluSays";

describe("KheeluSays", () => {
  it("renders Kheelu's spoken line", () => {
    render(<KheeluSays line="Let me show you around." />);
    expect(screen.getByText("Let me show you around.")).toBeInTheDocument();
  });

  it("renders the decorative mascot image for the default pose", () => {
    const { container } = render(<KheeluSays line="Hi there." />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/mascot/mascot-hero-wink.png");
    // decorative: the speech is the real text, so alt is empty
    expect(img).toHaveAttribute("alt", "");
  });

  it("swaps the mascot art by pose", () => {
    const { container } = render(<KheeluSays line="Wondering?" pose="curious" />);
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "/mascot/mascot-curious.png",
    );
  });

  it("merges className onto the wrapper", () => {
    const { container } = render(<KheeluSays line="Hi." className="mt-10" />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "mt-10",
    );
  });
});
