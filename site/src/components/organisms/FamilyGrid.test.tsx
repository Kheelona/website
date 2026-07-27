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

  it("carries an age chip per body so the row reads as an arc to 14", () => {
    render(<FamilyGrid />);
    expect(screen.getByText("Ages 2 to 5")).toBeInTheDocument();
    expect(screen.getByText("Ages 5 to 14")).toBeInTheDocument();
    expect(screen.getByText("Ages 2 to 14")).toBeInTheDocument();
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

  it("shows a calm placeholder, never a stand-in render, where art is gated (V3-c)", () => {
    render(<FamilyGrid />);
    expect(screen.getByRole("img", { name: "The Kheelu Speaker, coming soon" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Kheelona AI books, coming soon" })).toBeInTheDocument();
    // only Lumi has real art
    const realImages = screen.getAllByRole("img").filter((el) => el.tagName === "IMG");
    expect(realImages.length).toBe(1);
  });

  it("keeps list semantics (li children of the ul)", () => {
    const { container } = render(<FamilyGrid />);
    expect(container.querySelectorAll("ul > li").length).toBe(3);
  });
});
