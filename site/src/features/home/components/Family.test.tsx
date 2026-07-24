import { render, screen } from "@testing-library/react";
import { Family } from "./Family";

describe("Family", () => {
  it("renders the family heading and the age range line", () => {
    render(<Family />);
    expect(
      screen.getByRole("heading", { name: "Meet the family. Lumi comes first." }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Made for a three-year-old. Still a friend at ten."),
    ).toBeInTheDocument();
  });

  it("shows all four companions with Lumi as the only link", () => {
    render(<Family />);
    for (const name of ["Lumi", "Lori", "Lua", "Robu"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(1);
    expect(links[0]).toHaveAttribute("href", "/products/lumi");
  });

  it("marks the not-yet companions as coming soon", () => {
    render(<Family />);
    expect(screen.getAllByText("Coming soon").length).toBe(3);
  });
});
