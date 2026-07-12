import { render, screen } from "@testing-library/react";
import { StickyMobileCTA } from "./StickyMobileCTA";

describe("StickyMobileCTA", () => {
  it("renders the reserve bar pointing at the pre-order anchor", () => {
    // #reserve is absent here, so the bar stays visible (its default state).
    render(<StickyMobileCTA />);
    const link = screen.getByRole("link", {
      name: /Reserve at ₹4,999\. No payment now\./i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#reserve");
  });

  it("carries the white-on-orange CTA treatment", () => {
    render(<StickyMobileCTA />);
    const link = screen.getByRole("link");
    expect(link.className).toContain("bg-orange-cta");
    expect(link.className).toContain("text-white");
  });
});
