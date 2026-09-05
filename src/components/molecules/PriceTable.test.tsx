import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PriceTable } from "./PriceTable";
import {
  LAUNCH_PRICE,
  FULL_PRICE,
  TOKEN_PRICE,
  BALANCE_PRICE,
  SHIP_DATE_TEXT,
} from "@/config/site";

/** The table exists to make one specific misreading impossible: taking the ₹499
 *  for the price of the toy. These assertions are about that, not about markup
 *  for its own sake. */
describe("PriceTable", () => {
  it("names every amount beside the words that say what it is", () => {
    render(<PriceTable />);
    const rowFor = (label: RegExp) =>
      within(screen.getByRole("row", { name: label }));

    expect(rowFor(/total price/i).getByText(LAUNCH_PRICE)).toBeInTheDocument();
    expect(rowFor(/refundable deposit today/i).getByText(TOKEN_PRICE)).toBeInTheDocument();
    expect(rowFor(/balance due at dispatch/i).getByText(BALANCE_PRICE)).toBeInTheDocument();
    expect(rowFor(/once the first 500 units are gone/i).getByText(FULL_PRICE)).toBeInTheDocument();
    expect(rowFor(/shipping starts/i).getByText(SHIP_DATE_TEXT)).toBeInTheDocument();
  });

  /* The deposit and the price must never be the same number on this table, and
     the deposit must never be the row a skimmer reads as the total. Both are
     derivation facts, so this fails the day someone types a figure by hand. */
  it("keeps the deposit distinct from the price, and makes them add up", () => {
    render(<PriceTable />);
    expect(TOKEN_PRICE).not.toBe(LAUNCH_PRICE);
    const rupees = (s: string) => Number(s.replace(/[^0-9]/g, ""));
    expect(rupees(TOKEN_PRICE) + rupees(BALANCE_PRICE)).toBe(rupees(LAUNCH_PRICE));
  });

  it("says dispatch rather than delivery, so the date cannot be read as arrival", () => {
    render(<PriceTable />);
    expect(screen.getByText(/dispatch rather than\s+when it arrives/i)).toBeInTheDocument();
  });

  it("uses row headers, so a parser can pair a label with its amount", () => {
    render(<PriceTable />);
    const headers = screen.getAllByRole("rowheader");
    expect(headers).toHaveLength(6);
  });

  it("points at the refund and shipping policies", () => {
    render(<PriceTable />);
    expect(screen.getByRole("link", { name: /refund policy/i })).toHaveAttribute("href", "/refund");
    expect(screen.getByRole("link", { name: /shipping details/i })).toHaveAttribute("href", "/shipping");
  });
});
