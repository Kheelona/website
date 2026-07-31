import { LUMI_AGES } from "@/config/site";
import {
  GROWTH_ARC,
  GROWTH_HEDGE,
  GROWTH_CLOSING,
  lumiAgeEndpoints,
} from "./growth-arc";

describe("growth-arc data (BUILD-V6 D2)", () => {
  it("parses the LUMI_AGES endpoints", () => {
    expect(lumiAgeEndpoints()).toEqual(["2", "5"]);
  });

  it("cannot drift from LUMI_AGES: first kicker starts the band, last ends it", () => {
    const [start, end] = lumiAgeEndpoints();
    expect(LUMI_AGES).toBe(`${start} to ${end}`);
    expect(GROWTH_ARC[0]!.kicker).toBe(`At ${start} years`);
    expect(GROWTH_ARC.at(-1)!.kicker).toBe(`By ${end} years`);
  });

  it("ships four stages, a hedge, and the tutor re-homing line", () => {
    expect(GROWTH_ARC).toHaveLength(4);
    for (const s of GROWTH_ARC) {
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.body.length).toBeGreaterThan(0);
    }
    expect(GROWTH_HEDGE).toBe(
      "Every child grows at their own pace. Lumi follows theirs.",
    );
    expect(GROWTH_CLOSING).toBe(
      "A best friend the whole way. A tutor whenever they need one.",
    );
  });
});
