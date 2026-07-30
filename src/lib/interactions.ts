/** The interaction contract (V5-1, from the 2026-07-31 review).
 *
 *  WHY THIS FILE EXISTS. The review counted **two** `active:` states in the
 *  whole codebase, and `TiltCard` — the only card interaction — renders a plain
 *  div unless the device has a fine hover pointer. So on touch, which is where
 *  the primary customer is, 40 Home cards, 27 Lumi cards, 19 story cards, the
 *  feelings, the modes, the colorway swatches and every accordion row answered
 *  a tap with nothing at all. Hover coverage per route read 19 · 6 · 3 · 0 · 0
 *  · 0: two pages felt alive and the rest felt dead. That is not a styling
 *  detail, it is the difference between a surface that feels built and one that
 *  feels like a document.
 *
 *  THE LAW (website-steps §8.23-1): every tappable surface answers touch. New
 *  interactive surfaces compose these constants; hand-rolled hover/active
 *  classes are a review flag, and a hover-only affordance is incomplete by
 *  definition.
 *
 *  Motion discipline, unchanged from the house rules: transform and shadow
 *  only (never layout), the bouncy ease for press because it should feel
 *  physical, the calm ease for hover because it should feel unhurried, and
 *  `motion-reduce` neutralises both. Lift is `md:` and up on purpose — a
 *  hover state on a touch screen sticks after the tap and reads as a bug. */

/** Press feedback. THE mobile-critical one: a tap visibly answers. */
export const PRESS =
  "transition-transform duration-150 ease-(--ease-bounce) active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";

/** Hover lift for fine pointers. Pairs with PRESS, never with tilt. */
export const LIFT =
  "transition-[transform,box-shadow] duration-300 ease-(--ease-calm) md:hover:-translate-y-1 md:hover:shadow-(--shadow-room-sm) motion-reduce:transition-none motion-reduce:md:hover:translate-y-0";

/** The default for a clickable card: answers touch AND rewards a cursor. */
export const PRESS_LIFT = `${PRESS} ${LIFT}`;

/** Quieter variant for small controls (chips, swatches, accordion rows) where a
 *  full card lift would be too much movement for the element's size. */
export const PRESS_TINT =
  "transition-[transform,background-color,box-shadow] duration-150 ease-(--ease-bounce) active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";

/** Lift only while an expandable row is CLOSED. An open accordion row must stay
 *  put, or the content it just revealed jumps under the reader's eyes. Lives
 *  here rather than inline so the accordion variant is still part of the
 *  contract (used by ArchitectureStack). */
export const LIFT_WHEN_CLOSED =
  "transition-transform duration-300 ease-(--ease-calm) motion-reduce:transition-none data-[state=closed]:md:hover:-translate-y-0.5";
