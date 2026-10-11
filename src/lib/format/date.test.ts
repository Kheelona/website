import { afterEach, describe, expect, it } from "vitest";
import type { IsoDate } from "@/content/types";
import { formatDate } from "./date";

describe("formatDate: the design system's two date formats (README, Dates)", () => {
  it('writes "20 Oct 2026" in UI', () => {
    expect(formatDate("2026-10-20", "ui")).toBe("20 Oct 2026");
  });

  it('writes "20 October 2026" in long copy', () => {
    expect(formatDate("2026-10-20", "long")).toBe("20 October 2026");
  });

  /* The approved article mockups print "11 Sep 2026". Intl's en-IN short month
     is "Sept", so the formatter must not lean on Intl for month names. */
  it('writes September as "Sep" in UI, as the approved article bylines do', () => {
    expect(formatDate("2026-09-11", "ui")).toBe("11 Sep 2026");
  });

  it("writes the day without a leading zero", () => {
    expect(formatDate("2026-06-01", "ui")).toBe("1 Jun 2026");
    expect(formatDate("2026-06-01", "long")).toBe("1 June 2026");
  });

  it("names every month", () => {
    const mid = (m: number) => `2026-${String(m + 1).padStart(2, "0")}-15` as IsoDate;
    const short = Array.from({ length: 12 }, (_, m) => formatDate(mid(m), "ui"));
    const long = Array.from({ length: 12 }, (_, m) => formatDate(mid(m), "long"));
    expect(short.map((d) => d.split(" ")[1])).toEqual([
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]);
    expect(long.map((d) => d.split(" ")[1])).toEqual([
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ]);
  });

  it("accepts a leap day in a leap year", () => {
    expect(formatDate("2028-02-29", "long")).toBe("29 February 2028");
  });

  it.each(["2026-13-01", "2026-02-29", "2026-04-31", "2026-2-3", "20 Oct 2026", "", "2026-10-20T10:00:00Z"])(
    "refuses %j, which is not a real calendar date written as YYYY-MM-DD",
    (value) => {
      expect(() => formatDate(value as IsoDate, "ui")).toThrow(RangeError);
    },
  );
});

describe("formatDate and the server's time zone", () => {
  const original = process.env.TZ;
  afterEach(() => {
    process.env.TZ = original;
  });

  /* A stored date is a calendar day, not an instant: a build machine west of
     Greenwich must not print 14 Nov for the 15 Nov schema date. */
  it("prints the stored day whatever the time zone", () => {
    process.env.TZ = "America/Los_Angeles";
    expect(formatDate("2026-11-15", "ui")).toBe("15 Nov 2026");
    process.env.TZ = "Pacific/Kiritimati";
    expect(formatDate("2026-11-15", "long")).toBe("15 November 2026");
  });
});
