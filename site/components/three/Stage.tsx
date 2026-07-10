"use client";

import ThreeStage from "./ThreeStage";
import AmbientStage from "./AmbientStage";
import type { Tier } from "@/lib/three/tier";

/** THE single dynamic entry for the whole three stack. Every dynamic import
 *  of a WebGL surface must go through this module: sibling dynamic entries
 *  (ThreeStage/AmbientStage, and LumiInset via LumiHero) made the bundler
 *  emit twin chunks that each carried their own copy of three/@react-three/
 *  fiber, and a Canvas whose children's hooks resolve to a different fiber
 *  copy never renders them -- the canvas sits inert at its default 300x150.
 *  One entry = one chunk = one fiber instance. */
export { default as LumiInset } from "../product/LumiInset";
export default function Stage({
  stage,
  tier,
  onReady,
  onFail,
}: {
  stage: "journey" | "ambient";
  tier: Tier;
  onReady: () => void;
  onFail: () => void;
}) {
  return stage === "ambient" ? (
    <AmbientStage tier={tier} onReady={onReady} onFail={onFail} />
  ) : (
    <ThreeStage tier={tier} onReady={onReady} onFail={onFail} />
  );
}
