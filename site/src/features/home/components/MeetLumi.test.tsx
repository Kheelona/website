import { render, screen } from "@testing-library/react";
import { MeetLumi } from "./MeetLumi";

describe("MeetLumi", () => {
  it("renders the section heading", () => {
    render(<MeetLumi />);
    expect(
      screen.getByRole("heading", {
        name: /Meet Lumi\. The friend who listens first\./i,
      }),
    ).toBeInTheDocument();
  });

  it("shows all three SKU colours as cards", () => {
    render(<MeetLumi />);
    for (const name of ["Lumi Green", "Lumi Pink", "Lumi Blue"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
  });

  it("links every SKU card to the Lumi product page", () => {
    render(<MeetLumi />);
    const skuLink = screen.getByRole("link", {
      name: /Lumi Blue: see Lumi and reserve/i,
    });
    expect(skuLink).toHaveAttribute("href", "/products/lumi");
  });
});
