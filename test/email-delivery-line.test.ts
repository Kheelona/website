import { describe, expect, it } from "vitest";
import { SHIP_DATE_TEXT } from "@/config/site";
import { deliveryLine } from "@/lib/offer/delivery-line";
import { DELIVERY_TEXT } from "@/content/en-IN/delivery";
import { confirmation } from "@/content/en-IN/store/confirmation";
import { preorderAckEmail, type AckInput } from "@/lib/email/templates";
import { THANKS_PAID } from "./fixtures/store/thanks-paid";

/* The receipt email's order-number label and delivery row follow the /thanks order card (task 6.4; F12 answered,
 * D054 item 1; D023; D028).
 *
 * The receipt is sent once, at payment, so after launch every receipt belongs to a new order. An order created before
 * 10 October 2026, 00:00 in India keeps the line it was sold with, "Ships from: 20 October 2026" (SHIP_DATE_TEXT); every
 * later order reads the D023 line, "Delivery: Deliveries start mid-November". A missing or unreadable date reads the
 * D023 line too (P8): the receipt never promises a date the order's own row does not prove. The rule is the /thanks
 * card's own (src/lib/offer/delivery-line.ts), so the two cannot drift.
 *
 * This lives outside src/lib/email/ because that folder is frozen and cannot gain a file (checkout-freeze); the frozen
 * templates.test.ts still pins the early line through its own fixture (created 2026-08-22). */

/** The /thanks paid-state order (test/fixtures/store/thanks-paid.ts), with the name the receipt greets. */
function receipt(createdAt: string) {
  const order: AckInput["order"] = { ...THANKS_PAID.order, parent_name: "Priya Menon", created_at: createdAt };
  return preorderAckEmail({ order, addressUrl: "https://store.kheelona.com/thanks?x=1" });
}

const EARLY = ["2026-08-22T10:00:00Z", "2026-10-09T18:29:59.999999+00:00", "2026-10-09T23:59:59+05:30"];
const CURRENT = [THANKS_PAID.order.created_at, "2026-10-09T18:30:00+00:00", "2026-10-10T00:00:00+05:30", "2026-11-20 08:00:00+00"];

describe("the receipt's delivery row (D054 item 1, D023)", () => {
  it.each(CURRENT)("reads the D023 line for an order created at %s (on or after 10 October, IST)", (createdAt) => {
    const email = receipt(createdAt);
    expect(email.text).toContain(`Delivery: ${DELIVERY_TEXT}`);
    expect(email.html).toContain(`<strong>Delivery</strong> ${DELIVERY_TEXT}`);
    for (const part of [email.html, email.text]) {
      expect(part).not.toContain(SHIP_DATE_TEXT);
      expect(part).not.toMatch(/Ships from/);
    }
  });

  it.each(EARLY)("keeps the line it was sold with for an order created at %s (before 10 October, IST)", (createdAt) => {
    const email = receipt(createdAt);
    expect(email.text).toContain(`Ships from: ${SHIP_DATE_TEXT}`);
    expect(email.html).toContain(`<strong>Ships from</strong> ${SHIP_DATE_TEXT}`);
    for (const part of [email.html, email.text]) expect(part).not.toContain(DELIVERY_TEXT);
  });

  it.each(["", "not a date"])("reads the D023 line when the order's date is unreadable (%j)", (createdAt) => {
    const email = receipt(createdAt);
    expect(email.text).toContain(`Delivery: ${DELIVERY_TEXT}`);
    for (const part of [email.html, email.text]) expect(part).not.toContain(SHIP_DATE_TEXT);
  });

  it("labels the order number as the /thanks order card does (D028)", () => {
    const email = receipt(THANKS_PAID.order.created_at);
    expect(email.text).toContain(`\n${confirmation.order.number}: ${THANKS_PAID.order.order_ref}\n`);
    expect(email.html).toContain(`<strong>${confirmation.order.number}</strong> ${THANKS_PAID.order.order_ref}</p>`);
  });

  it("prints the same row as the /thanks order card for the same order", () => {
    for (const createdAt of [...EARLY, ...CURRENT]) {
      const row = deliveryLine(createdAt, confirmation.order.delivery);
      const email = receipt(createdAt);
      expect(email.text, createdAt).toContain(`\n${row.term}: ${row.value}\n`);
      expect(email.html, createdAt).toContain(`<strong>${row.term}</strong> ${row.value}</p>`);
    }
  });
});
