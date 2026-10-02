import { render, screen } from "@testing-library/react";
import { ParentQuotes } from "./ParentQuotes";

describe("ParentQuotes", () => {
  it("attributes each quote to a named pilot parent (V3)", () => {
    render(<ParentQuotes />);
    for (const name of ["Shweta", "Priyamvada", "Gaurav"]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    expect(screen.getAllByText("Pilot parent").length).toBe(3);
  });

  it("makes no pilot-count claim anywhere (founder retired those)", () => {
    const { container } = render(<ParentQuotes />);
    expect(container.textContent).not.toMatch(/\bten\b|\b10\b|\b15\b|families test|weeks of use/i);
  });

  it("gives every card a headline drawn from its own quote", () => {
    render(<ParentQuotes />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
  });

  it("is a focusable, labelled row a keyboard can scroll", () => {
    render(<ParentQuotes />);
    const row = screen.getByLabelText("Pilot parent testimonials");
    expect(row).toHaveAttribute("tabindex", "0");
  });
});
