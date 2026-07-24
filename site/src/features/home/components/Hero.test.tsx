import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the H1 promise", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /understand[\s\S]*their heart/i,
      }),
    ).toBeInTheDocument();
  });

  it("keeps the priority plush image (the LCP element)", () => {
    render(<Hero />);
    const plush = screen.getByAltText(/Lumi, the sky blue talking plush toy/i);
    expect(plush).toBeInTheDocument();
    expect(plush).toHaveAttribute("src", "/product/lumi-blue-2.png");
  });

  it("offers the reserve CTA with the launch-cap line", () => {
    render(<Hero />);
    expect(
      screen.getByRole("link", { name: /Reserve Lumi at ₹4,999/i }),
    ).toHaveAttribute("href", "#reserve");
    expect(
      screen.getByText(/First 500 units at ₹4,999/i),
    ).toBeInTheDocument();
  });

  it("embeds the sample conversation demo", () => {
    render(<Hero />);
    expect(
      screen.getByRole("log", {
        name: /A sample conversation between a child and Lumi/i,
      }),
    ).toBeInTheDocument();
  });
});
