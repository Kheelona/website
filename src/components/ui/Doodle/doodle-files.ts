/// <reference types="next/image-types/global" />
/* The one place the site references the DS doodle files (ADR-010; assets catalogue §1, "Doodles"): a still
 * doodle (a hero, D049 pick 2) is this file as a plain <img>. The drawn version is the generated inline SVG
 * (src/assets/doodles.generated.tsx, from the same files). The keys are the generated `DoodleName`s, so a
 * doodle added to scripts/assets/build-doodles.mjs fails the type check here until its file is listed.
 *
 * The reference above declares the static-import types Next writes into next-env.d.ts, which is git-ignored
 * and absent from a fresh clone (CI runs `tsc` before any `next build`).
 */
import chalkHeart from "@ds/assets/Doodles/chalk-heart.svg";
import chalkPlanet from "@ds/assets/Doodles/chalk-planet.svg";
import chalkQuestionMark from "@ds/assets/Doodles/chalk-question-mark.svg";
import chalkSparkLines from "@ds/assets/Doodles/chalk-spark-lines.svg";
import chalkSpeechBubble from "@ds/assets/Doodles/chalk-speech-bubble.svg";
import chalkStar from "@ds/assets/Doodles/chalk-star.svg";
import chalkThoughtCloud from "@ds/assets/Doodles/chalk-thought-cloud.svg";
import inkHeart from "@ds/assets/Doodles/ink-heart.svg";
import inkQuestionMark from "@ds/assets/Doodles/ink-question-mark.svg";
import inkSparkLines from "@ds/assets/Doodles/ink-spark-lines.svg";
import inkStar from "@ds/assets/Doodles/ink-star.svg";
import type { DoodleName } from "@/assets/doodles.generated";

/** A static SVG import: Next gives `{ src, width, height }`, Vite (Vitest, Storybook) may give the URL. */
type SvgImport = string | { readonly src: string };

const DOODLE_FILES: Readonly<Record<DoodleName, SvgImport>> = {
  "chalk-heart": chalkHeart,
  "chalk-planet": chalkPlanet,
  "chalk-question-mark": chalkQuestionMark,
  "chalk-spark-lines": chalkSparkLines,
  "chalk-speech-bubble": chalkSpeechBubble,
  "chalk-star": chalkStar,
  "chalk-thought-cloud": chalkThoughtCloud,
  "ink-heart": inkHeart,
  "ink-question-mark": inkQuestionMark,
  "ink-spark-lines": inkSparkLines,
  "ink-star": inkStar,
};

/** The URL of a static SVG import, whichever bundler resolved it. */
export function svgSrc(file: SvgImport): string {
  return typeof file === "string" ? file : file.src;
}

/** The served URL of a DS doodle file. */
export function doodleSrc(name: DoodleName): string {
  return svgSrc(DOODLE_FILES[name]);
}
