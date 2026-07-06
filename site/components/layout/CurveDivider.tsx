const FILLS: Record<string, string> = {
  white: "#ffffff",
  cream: "#fff7ee",
  cool: "#eaf6fc",
  teal: "#1abc9c",
  orange: "#ef762f",
};

/** Soft curved seam between two washes (concept A language).
 *  Render it INSIDE the lower section, at its top, with `from` = the wash above. */
export function CurveDivider({
  from,
  flip = false,
}: {
  from: keyof typeof FILLS;
  flip?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 70"
      preserveAspectRatio="none"
      className="block h-[46px] w-full md:h-[70px]"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M0,0 C480,70 960,70 1440,0 L1440,0 L0,0 Z" fill={FILLS[from]} />
    </svg>
  );
}
