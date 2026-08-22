import { render, screen } from "@testing-library/react";
import { FamilyGrid } from "./FamilyGrid";

describe("FamilyGrid", () => {
  it("shows the three pipeline bodies from the single family source", () => {
    render(<FamilyGrid />);
    for (const name of ["Lumi", "Kheelu Speaker", "AI books"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
  });

  it("has retired the .com companion lineup (Lori, Lua, Robu)", () => {
    render(<FamilyGrid />);
    for (const gone of ["Lori", "Lua", "Robu"]) {
      expect(screen.queryByRole("heading", { name: gone })).toBeNull();
    }
  });

  it("carries an age chip per body so the row still reads as an arc", () => {
    /* Open-ended "N+" chips since the 3+ repositioning (2026-08-23): no
       published ceiling anywhere, and two of the three share "3+". */
    render(<FamilyGrid />);
    expect(screen.getAllByText("Ages 3+").length).toBe(2);
    expect(screen.getByText("Ages 5+")).toBeInTheDocument();
  });

  it("links only Lumi, and links the whole card", () => {
    render(<FamilyGrid />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(1);
    expect(links[0]).toHaveAttribute("href", "/products/lumi");
  });

  it("marks the not-yet bodies as coming soon", () => {
    render(<FamilyGrid />);
    expect(screen.getAllByText("Coming soon").length).toBe(2);
  });

  it("renders real art for all three bodies (V3-c cleared 2026-07-31)", () => {
    render(<FamilyGrid />);
    // founder-generated renders through the house cutout pipeline — the
    // "In the workshop" placeholder branch stays in code for FUTURE members
    // but no current card uses it
    expect(screen.queryByText("In the workshop")).toBeNull();
    const realImages = screen.getAllByRole("img").filter((el) => el.tagName === "IMG");
    expect(realImages.length).toBe(3);
    expect(
      screen.getByRole("img", { name: /Kheelu Speaker: a friendly robot-shaped speaker/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /AI book: a sturdy white talking book/i }),
    ).toBeInTheDocument();
  });

  it("keeps list semantics (li children of the ul)", () => {
    const { container } = render(<FamilyGrid />);
    expect(container.querySelectorAll("ul > li").length).toBe(3);
  });
});
