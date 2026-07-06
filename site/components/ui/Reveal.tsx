/** Calm scroll-in reveal (concept A motion language), CSS-driven.
 *  Server component: SSR HTML is fully visible (no-JS users and crawlers see
 *  everything). The `html.js [data-reveal]` rules in globals.css hide-and-slide
 *  only once JS is known to be present; RevealObserver flips `.reveal-in`. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      data-reveal
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
