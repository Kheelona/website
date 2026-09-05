import { render, screen } from "@testing-library/react";
import { Family } from "./Family";

describe("Family (Home pipeline room)", () => {
  it("leads with the one-friend-many-friends story (V6 QA N2: 'bodies' is platform language, kept off the parent-facing Home)", () => {
    render(<Family />);
    expect(
      screen.getByRole("heading", { name: "One friend inside. More friends on the way." }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Starts talking at 3. Still teaching for years."),
    ).toBeInTheDocument();
  });

  it("shows the three pipeline bodies with Kheelu as the only link", () => {
    render(<Family />);
    for (const name of ["Kheelu", "Kheelu Speaker", "AI books"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(1);
    expect(links[0]).toHaveAttribute("href", "/products/kheelu");
  });

  it("marks the two unbuilt bodies as coming soon", () => {
    render(<Family />);
    expect(screen.getAllByText("Coming soon").length).toBe(2);
  });
});
