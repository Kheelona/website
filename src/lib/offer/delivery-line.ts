/**
 * Which delivery row an order prints: the /thanks order card and the receipt email (task 5.16; architecture §16.3,
 * ADR-013, QA review N9; moved here from sections/store/OrderRows by task 6.4 so `lib/email` never imports a section,
 * structure §6).
 *
 * Founder question F12, answered 2026-10-14 (D054 item 1; task 6.4): keep the split as built. An order created before
 * 10 October 2026, 00:00 in India keeps the line it was sold with ("Ships from 20 October 2026", `SHIP_DATE_TEXT`, as
 * the page printed it at the tag; the founder talks to those customers personally), and every later order reads the
 * D023 line ("Deliveries start mid-November"). An order whose date is missing or unreadable reads the D023 line
 * (open question P8, confirmed by the same answer). The rule lives here, outside the frozen page: the page only passes
 * the order's `created_at`, which it already reads. The words come in from the caller; this module only picks.
 *
 * The receipt email (`src/lib/email/templates.ts`, frozen; its reviewed diff cites D054 item 1) picks its delivery row
 * with this same function and the same two lines, so the receipt and the /thanks card never disagree about an order
 * (test/email-delivery-line.test.ts). Pure, and never throws: the receipt is built inside `notifyPaid`'s never-throw rule.
 */

/** One row of the order card: its label and its value. */
export interface DeliveryRow {
  readonly term: string;
  readonly value: string;
}

/** The two delivery rows: for orders placed before the cutoff (`early`), and for every order since (`current`). */
export interface DeliveryLines {
  readonly early: DeliveryRow;
  readonly current: DeliveryRow;
}

/** 10 October 2026, 00:00 in India (IST, UTC+05:30), in epoch milliseconds. */
export const DELIVERY_LINE_CUTOFF = Date.parse("2026-10-10T00:00:00+05:30");

/**
 * The row for an order created at `createdAt` (the row's `created_at`, a timestamp as PostgREST prints it). A missing
 * or unreadable date reads as a current order: the early line is a promise the page prints only when the order's own
 * date proves it was made before the cutoff.
 */
export function deliveryLine(createdAt: string | null | undefined, lines: DeliveryLines): DeliveryRow {
  const at = createdAt ? Date.parse(createdAt) : Number.NaN;
  return Number.isFinite(at) && at < DELIVERY_LINE_CUTOFF ? lines.early : lines.current;
}
