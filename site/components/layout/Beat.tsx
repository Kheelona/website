/** A content beat on the journey: the DOM anchor the 3D stage keys off.
 *  The beat registry measures every [data-beat] rect; scroll position inside
 *  a beat drives the camera through the matching place in the world.
 *  `anchor` adds an id for chapter-nav targets on beats whose inner Section
 *  does not already carry one. */
export function Beat({
  id,
  anchor,
  children,
}: {
  id: string;
  anchor?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-beat={id} id={anchor}>
      {children}
    </div>
  );
}
