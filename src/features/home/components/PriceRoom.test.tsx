import { render, screen } from "@testing-library/react";
import { PriceRoom } from "./PriceRoom";
import { STORE_URL, RESERVE_LABEL } from "@/config/site";

describe("PriceRoom", () => {
  it("leads with the token, from config", () => {
    render(<PriceRoom />);
    expect(
      screen.getByRole("heading", { level: 2, name: "₹499 today. Nothing more until it ships." }),
    ).toBeInTheDocument();
  });

  it("states the whole offer in the shared PriceTable", () => {
    render(<PriceRoom />);
    expect(screen.getByRole("table", { name: /Kheelu price, deposit and dispatch/ })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: /Refundable deposit today/ })).toBeInTheDocument();
  });

  it("makes the three published promises", () => {
    render(<PriceRoom />);
    expect(screen.getByText("Change your mind?")).toBeInTheDocument();
    expect(screen.getByText("No extras at checkout.")).toBeInTheDocument();
    expect(screen.getByText("First in line.")).toBeInTheDocument();
  });

  it("reserves under the home-reserve cta value", () => {
    render(<PriceRoom />);
    const cta = screen.getByRole("link", { name: RESERVE_LABEL });
    expect(cta).toHaveAttribute("href", STORE_URL);
    expect(cta).toHaveAttribute("data-ph-capture-attribute-cta", "home-reserve");
  });

  it("carries the Kheelona+ band with its footnote-2 marker, and no ₹ amount for it", () => {
    const { container } = render(<PriceRoom />);
    expect(container.querySelector('a[href="#fn-kheelona-plus"]')).not.toBeNull();
    expect(container.textContent).not.toMatch(/Kheelona\+[^.]*₹/);
  });
});
