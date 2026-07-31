import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero (V6, the growth-arc round)", () => {
  it("renders the two-line outcome-arc H1 (BUILD-V6 D1, founder-approved)", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /A best friend at 2[\s\S]*A head start by 5/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Lumi listens, remembers, and grows with your child\. Stories, numbers, and the languages you speak at home, at their pace\./,
      ),
    ).toBeInTheDocument();
  });

  it("keeps the priority hero artwork as the LCP element (REV-a final art)", () => {
    render(<Hero />);
    const art = screen.getByAltText(/kneeling to whisper a secret to Lumi/i);
    expect(art).toBeInTheDocument();
    expect(art).toHaveAttribute("src", "/hero/kheelu-lumi.png");
  });

  it("offers exactly ONE button, and the cap line rides under it (team items 7 and 10)", () => {
    render(<Hero />);
    expect(
      screen.getByRole("link", { name: /Reserve Lumi at ₹4,999/i }),
    ).toHaveAttribute("href", "#reserve");
    expect(screen.queryByRole("link", { name: "Meet Kheelu" })).toBeNull();
    /* Promoted, not buried: the chip carries the whole offer line and must be
       lifted OFF the warm backdrop. V5-5 moved it from bg-yellow/15 (nearly the
       same value as the page behind it) to a white card with a keyline. */
    const cap = screen.getByText(/First 500 units at ₹4,999/i);
    expect(cap.className).toContain("bg-white");
    expect(cap.className).toMatch(/border|shadow/);
  });

  it("carries Lumi's own age band", () => {
    render(<Hero />);
    expect(screen.getByText("For ages 2 to 5")).toBeInTheDocument();
  });

  it("renders no floating fact bubbles (team items 2 to 4)", () => {
    render(<Hero />);
    for (const t of ["No screen, ever.", "Up to 10 home languages.", "You read every word."]) {
      expect(screen.queryByText(t)).toBeNull();
    }
  });

  it("greets through the guide via data attributes", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section")!;
    expect(section).toHaveAttribute("data-guide", "hero-wink");
    expect(section.getAttribute("data-say")).toMatch(/Kheelu/);
  });
});
