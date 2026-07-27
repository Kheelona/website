import { render, screen } from "@testing-library/react";
import { ParentAppSection } from "./ParentAppSection";

describe("ParentAppSection", () => {
  it("renders the heading and app chips", () => {
    render(<ParentAppSection />);
    expect(
      screen.getByRole("heading", { name: /You can see the learning/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Conversation log")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /See what the app shows you/i }),
    ).toHaveAttribute("href", "/products/lumi");
  });

  it("hides the Kheelu narrator bubble by default", () => {
    render(<ParentAppSection />);
    expect(
      screen.queryByText(/Lumi and I keep no secrets from grown-ups/i),
    ).not.toBeInTheDocument();
  });

  it("shows the Kheelu narrator bubble when kheelu is set", () => {
    render(<ParentAppSection kheelu />);
    expect(
      screen.getByText(/Lumi and I keep no secrets from grown-ups/i),
    ).toBeInTheDocument();
  });
});
