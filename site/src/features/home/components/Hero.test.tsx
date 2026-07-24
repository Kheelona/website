import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero (revamp M2)", () => {
  it("renders the two-line H1 promise", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /A friend who listens[\s\S]*Made by people you can trust/i,
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

  it("offers the reserve CTA, the Meet Kheelu anchor, and the cap line", () => {
    render(<Hero />);
    expect(
      screen.getByRole("link", { name: /Reserve Lumi at ₹4,999/i }),
    ).toHaveAttribute("href", "#reserve");
    expect(screen.getByRole("link", { name: "Meet Kheelu" })).toHaveAttribute(
      "href",
      "#warm",
    );
    expect(screen.getByText(/First 500 units at ₹4,999/i)).toBeInTheDocument();
  });

  it("carries the widened age range", () => {
    render(<Hero />);
    expect(screen.getByText("For ages 3 to 10")).toBeInTheDocument();
  });

  it("renders the SSR fact bubbles (no opacity hiding)", () => {
    render(<Hero />);
    for (const t of ["No screen, ever.", "Up to 10 home languages.", "You read every word."]) {
      expect(screen.getByText(t)).toBeInTheDocument();
    }
  });

  it("greets through the guide via data attributes", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section")!;
    expect(section).toHaveAttribute("data-guide", "hero-wink");
    expect(section.getAttribute("data-say")).toMatch(/Kheelu/);
  });
});
