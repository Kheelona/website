import { render, screen } from "@testing-library/react";
import { Compare } from "./Compare";

describe("Compare", () => {
  it("renders the section heading and honest lede", () => {
    render(<Compare />);
    expect(
      screen.getByRole("heading", { name: /How Lumi compares/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/A simple, honest look at what is out there\./i),
    ).toBeInTheDocument();
  });

  it("renders the comparison table with the Lumi column", () => {
    render(<Compare />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Lumi" }),
    ).toBeInTheDocument();
  });

  it("offers the reserve CTA with the launch-price caption", () => {
    render(<Compare />);
    expect(
      screen.getByRole("link", { name: /Reserve Lumi at ₹4,999/i }),
    ).toHaveAttribute("href", "#reserve");
    expect(
      screen.getByText(/₹9,999 after launch\. No payment now\./i),
    ).toBeInTheDocument();
  });
});
