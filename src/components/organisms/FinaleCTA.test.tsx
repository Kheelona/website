import { render, screen } from "@testing-library/react";
import { FinaleCTA, SHIP_DAY_TEXT } from "./FinaleCTA";
import { RESERVE_LABEL, STORE_URL, TOKEN_PRICE, WHATSAPP_SHARE_HREF } from "@/config/site";

describe("FinaleCTA (the mockup's accent band, 2026-10)", () => {
  it("renders the default headline and the token line inside a #reserve section", () => {
    const { container } = render(<FinaleCTA />);
    expect(
      screen.getByRole("heading", { level: 2, name: `Meet Kheelu on ${SHIP_DAY_TEXT}.` }),
    ).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Reserve for ${TOKEN_PRICE} today`))).toBeInTheDocument();
    expect(container.querySelector("section#reserve")).toBeInTheDocument();
  });

  it("derives the day from the ship date, so the two cannot disagree", () => {
    expect(SHIP_DAY_TEXT).toBe("20 October");
  });

  it("hands off to the store in one tap, tagged for PostHog", () => {
    render(<FinaleCTA />);
    const cta = screen.getByRole("link", { name: RESERVE_LABEL });
    expect(cta).toHaveAttribute("href", STORE_URL);
    expect(cta).toHaveAttribute("data-ph-capture-attribute-cta", "finale");
  });

  it("offers the WhatsApp share, and drops it when asked", () => {
    const { unmount } = render(<FinaleCTA />);
    expect(screen.getByRole("link", { name: "Share with a parent" })).toHaveAttribute(
      "href",
      WHATSAPP_SHARE_HREF,
    );
    unmount();
    render(<FinaleCTA share={false} />);
    expect(screen.queryByRole("link", { name: "Share with a parent" })).toBeNull();
  });

  it("takes a page's own title, line and placement", () => {
    render(<FinaleCTA title="Reserve your Kheelu." line="Fully refundable." track="product-foot" />);
    expect(screen.getByRole("heading", { name: "Reserve your Kheelu." })).toBeInTheDocument();
    expect(screen.getByText("Fully refundable.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: RESERVE_LABEL })).toHaveAttribute(
      "data-ph-capture-attribute-cta",
      "product-foot",
    );
  });

  it("uses the fixed-colour button variants, so the band reads the same in dark mode", () => {
    render(<FinaleCTA />);
    expect(screen.getByRole("link", { name: RESERVE_LABEL }).className).toContain("bg-[#1e2340]");
  });

  it("renders only the band when bare, for a caller that owns the section", () => {
    const { container } = render(<FinaleCTA bare />);
    expect(container.querySelector("section")).toBeNull();
    expect(container.querySelector(".kh-final")).toBeInTheDocument();
  });
});
