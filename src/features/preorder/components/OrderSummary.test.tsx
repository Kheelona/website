import { render, screen } from "@testing-library/react";
import { OrderSummary } from "./OrderSummary";
import { BALANCE_PRICE, LAUNCH_PRICE, FULL_PRICE, SHIP_DATE_TEXT } from "@/config/site";

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

  it("derives the balance for an event token, so ₹99 today reads ₹4,900 on dispatch", () => {
    /* 2026-08-23, the Ideabaaz page: the balance is what the ₹4,999 price
       still needs after THIS token, not the public ₹4,500. */
    render(
      <OrderSummary amountLabel="₹99" tierLabel="Ideabaaz exclusive price" balanceLabel="₹4,900" />,
    );
    expect(screen.getByText("₹4,900 on dispatch")).toBeInTheDocument();
    expect(screen.queryByText(`${BALANCE_PRICE} on dispatch`)).toBeNull();
  });

  it("says the whole price is paid in the full-payment shape, with no balance line (§8.26)", () => {
    render(<OrderSummary amountLabel={FULL_PRICE} tierLabel="Launch price" mode="full" />);
    expect(screen.getByText(`${FULL_PRICE} today`)).toBeInTheDocument();
    expect(screen.getByText("Nothing due on dispatch")).toBeInTheDocument();
    expect(screen.queryByText(`${BALANCE_PRICE} on dispatch`)).toBeNull();
    // the refund and nothing-automatic promises survive the shape change
    expect(screen.getByText("Refundable in full")).toBeInTheDocument();
    expect(screen.getByText(/nothing automatic/i)).toBeInTheDocument();
  });
});
