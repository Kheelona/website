import { render, screen } from "@testing-library/react";
import { OrderSummary } from "./OrderSummary";
import { BALANCE_PRICE, LAUNCH_PRICE, SHIP_DATE_TEXT } from "@/config/site";

describe("OrderSummary", () => {
  it("answers what leaves the account today, and what leaves it later", () => {
    render(<OrderSummary amountLabel="₹499" tierLabel="Pre-order price" />);
    expect(screen.getByText("₹499 today")).toBeInTheDocument();
    expect(screen.getByText(`${BALANCE_PRICE} on dispatch`)).toBeInTheDocument();
    expect(screen.getByText(`Ships ${SHIP_DATE_TEXT}`)).toBeInTheDocument();
  });

  it("promises the refund on the page where the money moves", () => {
    render(<OrderSummary amountLabel="₹499" tierLabel="Pre-order price" />);
    expect(screen.getByText("Refundable in full")).toBeInTheDocument();
    expect(screen.getByText(/no reason needed/i)).toBeInTheDocument();
  });

  it("promises nothing automatic, which is the fear a saved card creates", () => {
    render(<OrderSummary amountLabel="₹499" tierLabel="Pre-order price" />);
    expect(screen.getByText(/Never automatic/i)).toBeInTheDocument();
  });

  it("shows the event label when the price is an event price", () => {
    render(<OrderSummary amountLabel="₹99" tierLabel="Bangalore expo price" />);
    expect(screen.getByText("₹99 today")).toBeInTheDocument();
    expect(screen.getByText("Bangalore expo price")).toBeInTheDocument();
    // and the full price is still stated, so the deal is legible as a deal
    expect(screen.getAllByText(new RegExp(LAUNCH_PRICE)).length).toBeGreaterThan(0);
  });
});
