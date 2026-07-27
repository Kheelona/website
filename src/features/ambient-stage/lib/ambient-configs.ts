import { TOKENS } from "./tokens";
import type { ShapeKind } from "@/lib/shape-paths";

/** Per-route dressing for the interior ambient stages (§8.13). Wash colors
 *  are NOT configured here — they are measured from the page's own
 *  [data-wash] sections (lib/three/ambient.ts). This file is only the
 *  route's personality: shape density, palette, one optional accent.
 *  `enabled: false` is the instant per-route revert switch. */

export type AmbientAccent = {
  kind: ShapeKind;
  color: string;
  position: [number, number, number];
  scale: number;
  floatPhase?: number;
};

export type AmbientConfig = {
  enabled: boolean;
  /** shape count for the full tier (lite gets ~60%) */
  density: number;
  palette: string[];
  accents: AmbientAccent[];
};

/* R5 palette discipline (founder 2026-07-10, 80/20 rule): shape dressing
   leans on the primary trio (yellow/blue/orange); teal and purple appear at
   most once per palette so secondaries stay the seasoning, not the meal.
   Densities retuned R6 (founder: shapes back to 'present but polite'): home 11, interiors 9-10, legal 4. */
const CALM_PALETTE = [TOKENS.yellow, TOKENS.blueSoft, TOKENS.orange, TOKENS.teal];

const CONFIGS: Record<string, AmbientConfig> = {
  // Home (R5): the journey retired in favor of this calm room. Two soft
  // clouds up high, a modest field far from the copy column.
  "/": {
    enabled: true,
    density: 11,
    palette: CALM_PALETTE,
    accents: [
      { kind: "squircle", color: TOKENS.white, position: [-3.5, 3.2, -10], scale: 1.5, floatPhase: 2 },
      { kind: "squircle", color: TOKENS.white, position: [3.7, 3.6, -12], scale: 1.8, floatPhase: 4.5 },
      // R7 corner cluster (the kheelona.ai background language in 3D):
      // a tight rotated trio tucked into the lower-right corner
      { kind: "flower4", color: TOKENS.yellow, position: [4.2, -2.6, -8], scale: 0.9, floatPhase: 1.1 },
      { kind: "triangle5", color: TOKENS.blueSoft, position: [4.9, -3.3, -9], scale: 0.6, floatPhase: 2.7 },
      { kind: "flower3", color: TOKENS.orange, position: [5.5, -2.1, -10], scale: 0.7, floatPhase: 4.1 },
    ],
  },
  "/playos": {
    enabled: true,
    density: 10,
    palette: [TOKENS.blueSoft, TOKENS.yellow, TOKENS.teal],
    accents: [
      // the PlayOS sky: soft clouds, echoing the home beat
      { kind: "squircle", color: TOKENS.cream, position: [-3.4, 3.0, -9], scale: 1.4, floatPhase: 2 },
      { kind: "squircle", color: TOKENS.cream, position: [3.6, 3.5, -11], scale: 1.7, floatPhase: 4.5 },
      // R7 corner cluster, lower-left
      { kind: "flower4", color: TOKENS.teal, position: [-4.6, -2.8, -9], scale: 0.8, floatPhase: 1.9 },
      { kind: "triangle5", color: TOKENS.yellow, position: [-5.3, -2.0, -10], scale: 0.55, floatPhase: 3.6 },
    ],
  },
  "/safety": {
    enabled: true,
    density: 9,
    palette: [TOKENS.teal, TOKENS.blueSoft, TOKENS.yellow],
    accents: [
      // the sheltering canopy from the safety garden
      { kind: "flower5", color: TOKENS.teal, position: [2.9, 3.9, -8], scale: 2.6, floatPhase: 1 },
    ],
  },
  "/setup": {
    enabled: true,
    density: 9,
    palette: CALM_PALETTE,
    accents: [
      { kind: "squircle", color: TOKENS.blueSoft, position: [-3.2, 2.6, -9], scale: 0.9, floatPhase: 3 },
    ],
  },
  "/team": {
    enabled: true,
    density: 9,
    palette: [TOKENS.yellow, TOKENS.orange, TOKENS.blueSoft],
    accents: [
      { kind: "flower13", color: TOKENS.yellow, position: [3.3, 3.1, -10], scale: 1.1, floatPhase: 2.4 },
      // R7 corner cluster, upper-left
      { kind: "polygon", color: TOKENS.blueSoft, position: [-4.4, 3.4, -9], scale: 0.8, floatPhase: 0.8 },
      { kind: "flower3", color: TOKENS.yellow, position: [-5.1, 2.6, -10], scale: 0.6, floatPhase: 3.2 },
    ],
  },
  "/stories": {
    enabled: true,
    density: 10,
    palette: CALM_PALETTE,
    accents: [
      // a small flower cluster for the journal meadow
      { kind: "flower5", color: TOKENS.purple, position: [-3.1, 0.5, -7], scale: 0.5, floatPhase: 0.5 },
      { kind: "flower13", color: TOKENS.yellow, position: [-2.5, 0.4, -8], scale: 0.4, floatPhase: 1.6 },
    ],
  },
  // legal pages: nearly bare on purpose — quiet room, a whisper of brand
  "/privacy": { enabled: true, density: 4, palette: CALM_PALETTE, accents: [] },
  "/terms": { enabled: true, density: 4, palette: CALM_PALETTE, accents: [] },
};

/** Longest-prefix match so /stories/[slug] inherits /stories. */
export function ambientConfigFor(pathname: string): AmbientConfig | null {
  let best: AmbientConfig | null = null;
  let bestLen = 0;
  for (const [prefix, cfg] of Object.entries(CONFIGS)) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      if (prefix.length > bestLen) {
        best = cfg;
        bestLen = prefix.length;
      }
    }
  }
  return best && best.enabled ? best : null;
}
