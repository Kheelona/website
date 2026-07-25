import { render, screen } from "@testing-library/react";
import { FamilyGrid } from "./FamilyGrid";

describe("FamilyGrid", () => {
  it("shows all four companions from the single family source", () => {
    render(<FamilyGrid />);
    for (const name of ["Lumi", "Lori", "Lua", "Robu"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
  });

  it("links only Lumi, and links the whole card", () => {
    render(<FamilyGrid />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(1);
    expect(links[0]).toHaveAttribute("href", "/products/lumi");
    expect(links[0]).toHaveAccessibleName(/Reserve at ₹4,999|reserve at ₹4,999/);
  });

  it("marks the not-yet companions as coming soon", () => {
    render(<FamilyGrid />);
    expect(screen.getAllByText("Coming soon").length).toBe(3);
  });

  it("keeps list semantics (li children of the ul)", () => {
    const { container } = render(<FamilyGrid />);
    expect(container.querySelectorAll("ul > li").length).toBe(4);
  });
});
