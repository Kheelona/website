import { render, screen } from "@testing-library/react";
import { Compare } from "./Compare";
import { STORE_URL } from "@/config/site";

describe("Compare", () => {
  it("asks the question a parent is actually weighing (content doc v7)", () => {
    render(<Compare />);
    expect(
      screen.getByRole("heading", { name: "Thinking of a smart speaker or a tablet instead?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("They all talk or play. This is how they differ for a child aged 3+."),
    ).toBeInTheDocument();
  });

  it("compares product types, never brands, and says what it is based on", () => {
    render(<Compare />);
    for (const col of ["Smart speaker", "Tablet or phone", "Robot toy with a screen"]) {
      expect(screen.getByRole("columnheader", { name: col })).toBeInTheDocument();
    }
    expect(screen.getByText(/Based on typical products in each group/)).toBeInTheDocument();
  });

  it("keeps the tutor line (one of its four sanctioned places, V6)", () => {
    render(<Compare />);
    expect(screen.getByText("A tutor runs out of time and patience. Kheelu does not.")).toBeInTheDocument();
  });

  it("renders the comparison table with the Kheelu column", () => {
    render(<Compare />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Kheelu" }),
    ).toBeInTheDocument();
  });

  it("offers the reserve CTA with the token-price caption, under the compare cta value", () => {
    render(<Compare />);
    const cta = screen.getByRole("link", { name: "Reserve Kheelu for ₹499" });
    expect(cta).toHaveAttribute("href", STORE_URL);
    expect(cta).toHaveAttribute("data-ph-capture-attribute-cta", "compare");
    expect(
      screen.getByText(/₹499 now, ₹4,500 on dispatch\. Fully refundable until we ship\./i),
    ).toBeInTheDocument();
  });
});
