import { KHEELU_AGES } from "@/config/site";
import { GROWTH_ARC, GROWTH_HEDGE, GROWTH_CLOSING, HERO_PROMISE } from "./growth-arc";

describe("growth-arc data (BUILD-V6 D2, re-anchored at 3+ on 2026-08-23)", () => {
  it("anchors the arc at the published entry age, with an open end", () => {
    /* Founder decision #8: the site says "3+" with no ceiling, so the arc
       starts at the entry age and its last stage is deliberately unnumbered.
       If KHEELU_AGES ever changes shape again, this is the test that asks the
       arc to move with it. */
    expect(KHEELU_AGES).toBe("3+");
    expect(GROWTH_ARC[0]!.kicker).toBe("At 3 years");
    expect(GROWTH_ARC.at(-1)!.kicker).toBe("Every year after");
  });

  it("keeps the hero promise anchored at the same entry age", () => {
    /* One promise, two pages (V6 law), one source since the re-anchor: the
       hero renders the halves, PacePanel joins them. */
    expect(HERO_PROMISE).toEqual(["A best friend at 3.", "A head start for school."]);
  });

  it("ships four stages, a hedge, and the tutor re-homing line", () => {
    expect(GROWTH_ARC).toHaveLength(4);
    for (const s of GROWTH_ARC) {
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.body.length).toBeGreaterThan(0);
    }
    expect(GROWTH_HEDGE).toBe(
      "Every child grows at their own pace. Kheelu follows theirs.",
    );
    expect(GROWTH_CLOSING).toBe(
      "A best friend the whole way. A tutor whenever they need one.",
    );
  });
});
