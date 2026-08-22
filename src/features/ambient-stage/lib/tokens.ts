/** JS mirror of the locked design tokens in app/globals.css @theme.
 *  Keep in sync by hand; tokens are locked (Design/Kheelona-Design-System-v3
 *  since CS3 Phase A, 2026-08-23), drift risk low — and the build gate
 *  (tools/tokens/check-tokens.mjs) fails on drift for the mapped rows. */
export const TOKENS = {
  orange: "#EF762F",
  /* Retired in v3 (no --kh-orange-deep). Kept while its ~8 accent call sites
     drain to orange-ink in Phase B, then deleted with them. */
  orangeDeep: "#D85F1B",
  yellow: "#F1A23B",
  blue: "#29A0D7",
  /* Retired in v3 (the logo redraw removed its blue). Dormant mirror only. */
  blueSoft: "#3AA4E5",
  teal: "#1ABC9C",
  purple: "#8B5BFF",
  ink: "#44403C",
  cream: "#F9F8F6",
  cool: "#E2F3FA",
  sun: "#FCEEDA",
  white: "#FFFFFF",
  /* R5 white-label fills (sanctioned deviations, see globals.css) */
  orangeCta: "#C25210",
  tealDeep: "#0F766E",
  /* R9 small-text orange (kickers; 4.5:1 on every wash) */
  orangeInk: "#B54A0D",
} as const;

/** The sky/wash color the world holds at each Home beat (the wash-handoff
 *  timeline: same journey the flat site told with opaque section washes).
 *  Phase A moved the endpoint washes to the v3 values; the INTERMEDIATE
 *  stops (path/film/teal-light) were curated between the OLD washes and are
 *  flagged for re-curation in Phase B — the stage is dormant, so nothing
 *  paints them today. */
export const BEAT_WASHES: string[] = [
  "#F9F8F6", // 0 hero: the cream clearing
  "#FFF9F1", // 1 staged intro: the path opens (re-curate, Phase B)
  "#FFFDF9", // 2 film (re-curate, Phase B)
  "#FFFFFF", // 3 why we exist: over the hill
  "#E2F3FA", // 4 feelings grove: cool
  "#FFFFFF", // 5 lumi's home
  "#E2F3FA", // 6 playos sky
  "#FFFFFF", // 7 the plateau (compare)
  "#D9F4EC", // 8 safety garden: teal light (re-curate, Phase B)
  "#FCEEDA", // 9 journal meadow: sun
  "#C25210", // 10 finale: sunset orange (orange-cta: white text at any size)
];
