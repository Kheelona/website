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
    ).toHaveAttribute("href", "/products/kheelu");
  });

  it("hides the Kheelu narrator bubble by default", () => {
    render(<ParentAppSection />);
    expect(
      screen.queryByText(/Kheelu and I keep no secrets from grown-ups/i),
    ).not.toBeInTheDocument();
  });


  it("carries the Kheelona+ band (V3): the subscription said plainly", () => {
    render(<ParentAppSection />);
    expect(screen.getByText(/includes 6 months of Kheelona\+/)).toBeInTheDocument();
    expect(
      screen.getByText("Nothing renews without you, ever."),
    ).toBeInTheDocument();
  });
});
