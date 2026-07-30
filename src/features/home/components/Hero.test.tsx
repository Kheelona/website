import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero (V4, team feedback 2026-07-30)", () => {
  it("renders the two-line tutor H1 (founder decision D2)", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Your kid.s favourite tutor[\s\S]*Their best friend first/i,
      }),
    ).toBeInTheDocument();
  });

  it("keeps the priority plush image as the LCP element", () => {
    render(<Hero />);
    const plush = screen.getByAltText(/Lumi, the sky blue talking plush toy/i);
    expect(plush).toBeInTheDocument();
    expect(plush).toHaveAttribute("src", "/product/lumi-blue-2.png");
  });

  it("shows Kheelu talking to Lumi with named alt text", () => {
    render(<Hero />);
    expect(
      screen.getByAltText(/Kheelu, the Kheelona mascot, winking beside Lumi/i),
    ).toBeInTheDocument();
  });

  it("offers exactly ONE button, and the cap line rides under it (team items 7 and 10)", () => {
    render(<Hero />);
    expect(
      screen.getByRole("link", { name: /Reserve Lumi at ₹4,999/i }),
    ).toHaveAttribute("href", "#reserve");
    expect(screen.queryByRole("link", { name: "Meet Kheelu" })).toBeNull();
    // promoted, not buried: the chip carries the whole offer line
    const cap = screen.getByText(/First 500 units at ₹4,999/i);
    expect(cap.className).toContain("bg-yellow/15");
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
