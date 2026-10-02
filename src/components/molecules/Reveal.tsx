/** Layout wrapper that used to carry the scroll-in reveal.
 *
 *  Redesign 2026-10: the mockup is still, so the reveal motion and its
 *  observer were removed. The wrapper stays because ~25 call sites use it for
 *  spacing and list semantics (`as="li"` keeps ul/ol valid). It renders plain
 *  markup: nothing is hidden, ever, with or without JS. */
export function Reveal({
  children,
  delay: _delay,
  className,
  as: Tag = "div",
  mode: _mode,
}: {
  children: React.ReactNode;
  /** @deprecated No effect since the 2026-10 redesign. */
  delay?: number;
  className?: string;
  as?: "div" | "li";
  /** @deprecated No effect since the 2026-10 redesign. */
  mode?: "fade" | "rise";
}) {
  return <Tag className={className}>{children}</Tag>;
}
