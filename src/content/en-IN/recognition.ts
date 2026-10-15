import type { RecognitionStripConfig } from "@/components/sections/RecognitionStrip/recognition-strip.types";
import { teamPage } from "./pages/team";

/**
 * The "Recognised by." strip's placement config (task 8c.3; D061's rulings, D054 item 20): the /team strip as built
 * (task 6.6), shown on Home after the films and on the product page after the films, before the offer. Its heading,
 * programmes and marks live once, in the team page's fold (pages/team.ts: names only, no relationship, B26; never
 * "Backed by"), and are read from there, so the three pages always show the same strip. The marks load lazily
 * (RecognitionStrip draws them through Photo's bare form).
 */
function teamStrip(): RecognitionStripConfig {
  const fold = teamPage.sections.find((s) => s.kind === "recognition-strip");
  if (fold?.kind !== "recognition-strip") throw new Error("the team page lists no recognition strip");
  return fold.config;
}

export const recognitionStrip: RecognitionStripConfig = teamStrip();

/** The strip as a small label over the row, no heading (RecognitionStrip `label`; the D2C plan v2 §2 fold 2 and §3 fold
 *  4, the CMO's m10): Home and the product page show it in the same words, from here. */
export const recognitionLabel: RecognitionStripConfig = { ...recognitionStrip, title: "Recognised by", variant: "label" };
