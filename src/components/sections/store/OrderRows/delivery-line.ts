/**
 * Which delivery row the /thanks order card prints (task 5.16; architecture §16.3, ADR-013, QA review N9).
 *
 * Founder question F12 is open: what a parent who reserved before 10 October 2026 should read about delivery. Until
 * it is answered, an order created before 10 October 2026, 00:00 in India keeps the line it was sold with ("Ships from
 * 20 October 2026", `SHIP_DATE_TEXT`, as the page printed it at the tag), and every later order reads the D023 line
 * ("Deliveries start mid-November"). The rule lives here, outside the frozen page: the page only passes the order's
 * `created_at`, which it already reads. Task 6.4 changes this file and the receipt email's labels together once F12 is
 * answered. The words come in from content; this module only picks.
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
