import { render, screen } from "@testing-library/react";
import { ParentQuotes } from "./ParentQuotes";

describe("ParentQuotes", () => {
  it("attributes each quote to a named pilot parent (V3)", () => {
    render(<ParentQuotes bare />);
    for (const name of ["Shweta", "Priyamvada", "Gaurav"]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    expect(screen.getAllByText("Pilot parent").length).toBe(3);
  });

  it("makes no pilot-count claim in its heading (founder retired those)", () => {
    render(<ParentQuotes bare />);
    const heading = screen.getByRole("heading");
    expect(heading.textContent).toBe("The first families are already talking.");
    expect(heading.textContent).not.toMatch(/\bten\b|\b10\b|\b15\b|families test/i);
  });

  it("renders two cards when asked (the Lumi page variant)", () => {
    render(<ParentQuotes bare count={2} />);
    expect(screen.getByText("Shweta")).toBeInTheDocument();
    expect(screen.queryByText("Gaurav")).toBeNull();
  });

  it("bare mode is content-only, for composition inside a Room", () => {
    const { container } = render(<ParentQuotes bare />);
    expect(container.querySelector("[data-wash]")).toBeNull();
  });
});
