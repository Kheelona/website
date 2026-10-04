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
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("The first families are already talking.");
    expect(heading.textContent).not.toMatch(/\bten\b|\b10\b|\b15\b|families test/i);
  });

  it("renders two cards when asked (the Kheelu page variant)", () => {
    render(<ParentQuotes bare count={2} />);
    expect(screen.getByText("Shweta")).toBeInTheDocument();
    expect(screen.queryByText("Gaurav")).toBeNull();
  });

  it("bare mode is content-only, for composition inside a Room", () => {
    const { container } = render(<ParentQuotes bare />);
    expect(container.querySelector("[data-wash]")).toBeNull();
  });

  it("heads each card with a short line that restates its quote (content doc v7)", () => {
    render(<ParentQuotes bare />);
    for (const t of ["She tells Kheelu about her day", "Rhymes across generations", "Less screen time"]) {
      expect(screen.getByRole("heading", { level: 3, name: t })).toBeInTheDocument();
    }
  });

  it("makes no count claim in any card headline either", () => {
    render(<ParentQuotes bare />);
    for (const h of screen.getAllByRole("heading", { level: 3 })) {
      expect(h.textContent).not.toMatch(/\d/);
    }
  });
});
