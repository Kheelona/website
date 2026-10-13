import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { confirmation } from "@/content/en-IN/store/confirmation";
import { mockupFold, skeleton, words } from "../../../../../test/support/mockup-compare";
import { SAMPLE_ORDER } from "../ConfirmationHead/ConfirmationHead.stories";
import { OrderRows } from "./OrderRows";

/* OrderRows (task 5.16): /thanks fold 2 (store-confirmation.html), the four facts a parent screenshots, every value from
   the order row (the page derives them, as it did at the tag) and the delivery row chosen by the order's date
   (delivery-line.ts; N9, F12). The mockup's value markers and its order-number placeholder are sample data. */

const OPTIONS = { unwrap: "[data-src], .mk-placeholder" };
const AFTER_CUTOFF = "2026-10-12T10:23:45.123456+00:00";
const BEFORE_CUTOFF = "2026-09-20T08:00:00+00:00";

const terms = (container: HTMLElement) => Array.from(container.querySelectorAll("dt")).map((dt) => dt.textContent);
const values = (container: HTMLElement) => Array.from(container.querySelectorAll("dd")).map((dd) => dd.textContent);

describe("OrderRows", () => {
  it("markup and words equal store-confirmation.html fold 2 for a token order placed after 10 October", () => {
    const { container } = render(
      <OrderRows
        copy={confirmation.order}
        orderRef={SAMPLE_ORDER.orderRef}
        paid={SAMPLE_ORDER.amount}
        balance={SAMPLE_ORDER.balance}
        price={SAMPLE_ORDER.price}
        createdAt={AFTER_CUTOFF}
      />,
    );
    const mockup = mockupFold("store-confirmation", "section[aria-labelledby='order-title']");
    expect(skeleton(container.firstElementChild!, OPTIONS)).toBe(skeleton(mockup, OPTIONS));
    expect(words(container.firstElementChild!)).toBe(words(mockup));
  });

  it("is a DS card named by its h2, the rows a DefinitionList in the order variant", () => {
    const { container } = render(
      <OrderRows copy={confirmation.order} orderRef="KH-A2B3-C4D5" paid="₹499" balance="₹4,500" price="₹4,999" createdAt={AFTER_CUTOFF} />,
    );
    const card = screen.getByRole("region", { name: "Your order" });
    expect(card.className).toBe("kh-card ks-order");
    expect(screen.getByRole("heading", { level: 2 }).className).toBe("kh-card__title");
    expect(container.querySelector("dl")!.className).toBe("ks-order__rows");
    expect(terms(container)).toEqual(["Order number", "Paid today", "Due before delivery", "Delivery"]);
    expect(values(container)).toEqual(["KH-A2B3-C4D5", "₹499", "₹4,500, of the ₹4,999 price (incl. GST)", "Deliveries start mid-November"]);
  });

  it("tells a full-payment order it owes nothing", () => {
    const { container } = render(
      <OrderRows copy={confirmation.order} orderRef="KH-A2B3-C4D5" paid="₹7,999" balance={null} price="₹4,999" createdAt={AFTER_CUTOFF} />,
    );
    expect(values(container)[2]).toBe("Nothing. You have paid in full");
  });

  it("keeps an order placed before 10 October on the date it was sold with (N9, F12)", () => {
    const { container } = render(
      <OrderRows copy={confirmation.order} orderRef="KH-A2B3-C4D5" paid="₹499" balance="₹4,500" price="₹4,999" createdAt={BEFORE_CUTOFF} />,
    );
    expect(terms(container)[3]).toBe("Ships from");
    expect(values(container)[3]).toBe("20 October 2026");
  });

  it("gives an order with no readable date the D023 line", () => {
    const { container } = render(
      <OrderRows copy={confirmation.order} orderRef="KH-A2B3-C4D5" paid="₹499" balance="₹4,500" price="₹4,999" createdAt={undefined} />,
    );
    expect(terms(container)[3]).toBe("Delivery");
  });

  it("prints every value as plain text", () => {
    const { container } = render(
      <OrderRows copy={confirmation.order} orderRef="<i>KH</i>" paid="₹499" balance="₹4,500" price="₹4,999" createdAt={AFTER_CUTOFF} />,
    );
    const first = container.querySelector("dd")!;
    expect(first.children).toHaveLength(0);
    expect(first.textContent).toBe("<i>KH</i>");
  });
});
