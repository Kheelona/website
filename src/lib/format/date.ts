import type { IsoDate } from "@/content/types";

/**
 * The one date formatter, with the design system's two formats (DS README,
 * "Dates"): "20 Oct 2026" in UI (bylines, labels, rows) and "20 October 2026" in
 * long copy. Never 10/20/2026.
 *
 * Month names come from these tables, not Intl: Intl's en-IN short form of
 * September is "Sept", and the approved mockups print "Sep". A stored date is a
 * calendar day, so it is read as written and never shifted by the server's time
 * zone.
 */

export type DateStyle = "ui" | "long";

const LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Formats a stored `YYYY-MM-DD` date. Throws a RangeError for anything else. */
export function formatDate(date: IsoDate, style: DateStyle): string {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const [year, month, day] = parts === null ? [0, 0, 0] : parts.slice(1).map(Number);
  if (parts === null || month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    throw new RangeError(`"${date}" is not a calendar date written as YYYY-MM-DD.`);
  }
  const name = LONG[month - 1];
  return `${day} ${style === "ui" ? name.slice(0, 3) : name} ${year}`;
}
