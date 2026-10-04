import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import { FOOTER_LINKS, GSTIN, LEGAL_ENTITY, SUPPORT_WHATSAPP_HREF } from "@/config/site";

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

  it("names the seller of record from the same constants the store prints", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toContain(LEGAL_ENTITY);
    expect(container.textContent).toContain(`GSTIN ${GSTIN}`);
  });

  it("says the WhatsApp line takes messages only (support law)", () => {
    const { container } = render(<Footer />);
    expect(screen.getByRole("link", { name: "+91 91875 46483" })).toHaveAttribute(
      "href",
      SUPPORT_WHATSAPP_HREF,
    );
    expect(container.textContent).toMatch(/messages only/);
  });

  it("never claims where Kheelu is made (manufacture has never been published)", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).not.toMatch(/Made in/);
  });
});
