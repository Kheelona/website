import {
  LANGUAGES_LINE,
  LUMI_LANGUAGES,
  PRICE_HOLD_LINE,
  CAP_LINE,
} from "@/config/site";

describe("config copy constants (BUILD-V6)", () => {
  it("derives LANGUAGES_LINE from LUMI_LANGUAGES so the list has one source", () => {
    const expected = `${LUMI_LANGUAGES.slice(0, -1).join(", ")}, and ${LUMI_LANGUAGES.at(-1)}`;
    expect(LANGUAGES_LINE).toBe(expected);
    // the exact published string must not drift while deriving it
    expect(LANGUAGES_LINE).toBe(
      "English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish, and French",
    );
  });

  it("PRICE_HOLD_LINE is the one sanctioned hold sentence", () => {
    expect(PRICE_HOLD_LINE).toBe("We hold the price, you hold your place.");
    // the finale lede is CAP_LINE + hold line; neither may contain the other
    expect(CAP_LINE).not.toContain(PRICE_HOLD_LINE);
  });
});
