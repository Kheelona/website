/** Theme-B site backdrop (revamp M1): ONE fixed, CSS-only warm sky behind
 *  every route — the "connected site" canvas the rooms float on. Replaces the
 *  ambient three.js stage as the page's atmosphere (the canvas feature stays
 *  dormant, same law as the 3D journey). Decorative: aria-hidden, no pointer
 *  events, negative z so it always paints behind content (main is z-10).
 *  The drifting blob is motion-gated in globals.css. */
export function SiteBackdrop() {
  return (
    <div
      aria-hidden="true"
      data-backdrop
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="site-backdrop-base absolute inset-0" />
      <div className="site-backdrop-tint-warm absolute inset-0" />
      <div className="site-backdrop-tint-cool absolute inset-0" />
      <div className="site-backdrop-blob absolute left-[8%] top-[18%] h-[55vmax] w-[55vmax] rounded-full" />
    </div>
  );
}
