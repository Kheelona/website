/** JS mirror of the locked design tokens in app/globals.css @theme.
 *  Keep in sync by hand; tokens are locked (Design/design-system), drift risk low. */
export const TOKENS = {
  orange: "#EF762F",
  orangeDeep: "#D85F1B",
  yellow: "#F1A23B",
  blue: "#29A0D7",
  blueSoft: "#3AA4E5",
  teal: "#1ABC9C",
  purple: "#8B5BFF",
  ink: "#272727",
  cream: "#FFF7EE",
  cool: "#EAF6FC",
  sun: "#FDF1E2",
  white: "#FFFFFF",
} as const;

/** The sky/wash color the world holds at each Home beat (the wash-handoff
 *  timeline: same journey the flat site told with opaque section washes). */
export const BEAT_WASHES: string[] = [
  "#FFF7EE", // 0 hero: the cream clearing
  "#FFF9F1", // 1 staged intro: the path opens
  "#FFFDF9", // 2 film
  "#FFFFFF", // 3 why we exist: over the hill
  "#EAF6FC", // 4 feelings grove: cool
  "#FFFFFF", // 5 lumi's home
  "#EAF6FC", // 6 playos sky
  "#FFFFFF", // 7 the plateau (compare)
  "#D9F4EC", // 8 safety garden: teal light
  "#FDF1E2", // 9 journal meadow: sun
  "#D85F1B", // 10 finale: sunset orange (deep: white large type stays legal)
];
