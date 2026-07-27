/** Calm scroll-in reveal (concept A motion language), CSS-driven.
 *  Server component: SSR HTML is fully visible (no-JS users and crawlers see
 *  everything). The `html.js [data-reveal]` rules in globals.css hide-and-slide
 *  only once JS is known to be present; RevealObserver flips `.reveal-in`.
 *  `as` keeps list semantics valid (ul/ol must contain li directly). */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  mode = "rise",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
  /** "rise" never hides content (no opacity), so fast scrolling can never
   *  land on a blank viewport; opt into "fade" only for small elements
   *  inside an already-visible section. */
  mode?: "fade" | "rise";
}) {
  return (
    <Tag
      data-reveal={mode}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
