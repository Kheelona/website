import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import { FOOTER_LINKS } from "@/config/site";

describe("Footer", () => {
  it("renders as a contentinfo landmark with the Kheelona wordmark", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("Kheelona")).toBeInTheDocument();
  });

  it("renders every configured footer link with a crawlable href", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: "Footer" });
    for (const l of FOOTER_LINKS) {
      const link = screen.getByRole("link", { name: l.label });
      expect(nav).toContainElement(link);
      expect(link).toHaveAttribute("href", l.href);
    }
  });

  it("points partners at the sister site kheelona.ai", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: "kheelona.ai" });
    expect(link).toHaveAttribute("href", "https://kheelona.ai");
  });

  it("signs the work with its provenance (V3)", () => {
    render(<Footer />);
    expect(screen.getByText("Designed by parents in Bengaluru.")).toBeInTheDocument();
  });
});
