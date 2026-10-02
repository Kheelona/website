import { render, screen } from "@testing-library/react";
import { StickyReserveBar } from "./StickyReserveBar";
import { STORE_URL, TOKEN_PRICE } from "@/config/site";

describe("StickyReserveBar", () => {
  it("states the token and the ship date, and reaches the store in one tap", () => {
    render(<StickyReserveBar shipShort="20 Oct" />);
    expect(screen.getByText(`${TOKEN_PRICE} reserves Kheelu`)).toBeInTheDocument();
    expect(screen.getByText(/Ships 20 Oct\./)).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: "Reserve" });
    expect(cta).toHaveAttribute("href", STORE_URL);
    expect(cta).toHaveAttribute("data-ph-capture-attribute-cta", "sticky-bar");
  });

  it("is a phone-only bar", () => {
    const { container } = render(<StickyReserveBar shipShort="20 Oct" />);
    expect(container.firstElementChild!.className).toContain("min-[900px]:hidden");
  });
});
