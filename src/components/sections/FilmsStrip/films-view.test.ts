import { describe, expect, it } from "vitest";
import { focusedTile, INITIAL_VIEW, positionText, stripView } from "./films-view";

/* The films strip's arithmetic (task 3.3; mockup.js section 4; architecture §11.2 row 8): where the strip is, whether
 * a button is at its end (tolerant of half a tile), what the position line reads, and which film is in focus. The
 * numbers are the strip's real layouts: 80% tiles with a 16 px gap on a 360 px phone (328 px track), three tiles on a
 * 1440 px laptop (944 px track, mockup.css:83, 90). */

const phone = (scrollLeft: number) => {
  const tile = 0.8 * 328;
  return { scrollLeft, clientWidth: 328, tileWidth: tile, pitch: tile + 16, count: 7, scrollWidth: 7 * tile + 6 * 16 };
};
const laptop = (scrollLeft: number) => ({ scrollLeft, clientWidth: 944, tileWidth: 304, pitch: 320, count: 7, scrollWidth: 7 * 304 + 6 * 16 });

describe("stripView", () => {
  it("phone: one film shown, so the position names one film; the start disables Previous", () => {
    expect(stripView(phone(0))).toEqual({ from: 1, to: 1, atStart: true, atEnd: false });
    expect(stripView(phone(278.4 * 3))).toEqual({ from: 4, to: 4, atStart: false, atEnd: false });
  });

  it("phone: at the end the last film is shown and Next is disabled", () => {
    const end = phone(0).scrollWidth - 328;
    expect(stripView(phone(end))).toEqual({ from: 7, to: 7, atStart: false, atEnd: true });
  });

  it("laptop: three films shown at rest (1–3), then 2–4, and 5–7 at the end", () => {
    expect(stripView(laptop(0))).toEqual({ from: 1, to: 3, atStart: true, atEnd: false });
    expect(stripView(laptop(320))).toEqual({ from: 2, to: 4, atStart: false, atEnd: false });
    expect(stripView(laptop(1280))).toEqual({ from: 5, to: 7, atStart: false, atEnd: true });
  });

  it("tolerates half a tile at each end (a snap that stops a few pixels short still counts as the end)", () => {
    expect(stripView(laptop(159)).atStart).toBe(true);
    expect(stripView(laptop(161)).atStart).toBe(false);
    expect(stripView(laptop(1280 - 159))).toMatchObject({ atEnd: true, from: 5 });
    expect(stripView(laptop(1280 - 161)).atEnd).toBe(false);
  });

  it("disables both buttons when every film fits", () => {
    expect(stripView({ scrollLeft: 0, clientWidth: 1000, tileWidth: 300, pitch: 316, count: 3, scrollWidth: 932 })).toEqual({
      from: 1,
      to: 3,
      atStart: true,
      atEnd: true,
    });
  });

  it("keeps the first paint's view while the strip has no layout yet", () => {
    expect(stripView({ scrollLeft: 0, clientWidth: 0, tileWidth: 0, pitch: 0, count: 7, scrollWidth: 0 })).toEqual(INITIAL_VIEW);
  });
});

describe("positionText", () => {
  it("reads '1 of 7' on a phone and '1–3 of 7' on a laptop (en dash), with the content's word", () => {
    expect(positionText({ from: 1, to: 1, atStart: true, atEnd: false }, 7, "of")).toBe("1 of 7");
    expect(positionText({ from: 1, to: 3, atStart: true, atEnd: false }, 7, "of")).toBe("1–3 of 7");
  });
});

describe("focusedTile", () => {
  it("is the film most inside the central band; none when nothing is inside it", () => {
    const order = ["a", "b", "c"];
    expect(focusedTile(new Map([["a", 40], ["b", 260], ["c", 0]]), order)).toBe("b");
    expect(focusedTile(new Map([["a", 0], ["b", 0]]), order)).toBeNull();
    expect(focusedTile(new Map(), order)).toBeNull();
  });

  it("breaks a tie in the strip's order", () => {
    expect(focusedTile(new Map([["c", 100], ["b", 100]]), ["a", "b", "c"])).toBe("b");
  });
});
