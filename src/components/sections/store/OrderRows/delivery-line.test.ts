import { describe, expect, it } from "vitest";
import { DELIVERY_LINE_CUTOFF, deliveryLine, type DeliveryLines } from "./delivery-line";

/* The /thanks delivery row (task 5.16; architecture §16.3, ADR-013, QA review N9, founder question F12): an order
   created before 10 October 2026, 00:00 in India keeps the line it was sold with, "Ships from 20 October 2026"; a later
   order reads the D023 line. The words come in from content; this module only picks. */

const LINES: DeliveryLines = {
  early: { term: "Ships from", value: "20 October 2026" },
  current: { term: "Delivery", value: "Deliveries start mid-November" },
};

describe("deliveryLine", () => {
  it("puts the cutoff at 10 October 2026, 00:00 IST (18:30 UTC the day before)", () => {
    expect(DELIVERY_LINE_CUTOFF).toBe(Date.UTC(2026, 9, 9, 18, 30));
  });

  it("keeps an order placed before the cutoff on the date it was sold with", () => {
    expect(deliveryLine("2026-08-23T00:00:00+00:00", LINES)).toBe(LINES.early);
    // The last microsecond before midnight in India, as PostgREST prints a timestamptz.
    expect(deliveryLine("2026-10-09T18:29:59.999999+00:00", LINES)).toBe(LINES.early);
    expect(deliveryLine("2026-10-09T23:59:59+05:30", LINES)).toBe(LINES.early);
  });

  it("gives an order placed at or after the cutoff the D023 line", () => {
    expect(deliveryLine("2026-10-09T18:30:00+00:00", LINES)).toBe(LINES.current);
    expect(deliveryLine("2026-10-10T00:00:00+05:30", LINES)).toBe(LINES.current);
    expect(deliveryLine("2026-10-12 10:23:45.123456+00", LINES)).toBe(LINES.current);
  });

  it("gives the D023 line when the order's date is missing or unreadable (never a date it cannot prove)", () => {
    expect(deliveryLine(undefined, LINES)).toBe(LINES.current);
    expect(deliveryLine(null, LINES)).toBe(LINES.current);
    expect(deliveryLine("", LINES)).toBe(LINES.current);
    expect(deliveryLine("not a date", LINES)).toBe(LINES.current);
  });
});
