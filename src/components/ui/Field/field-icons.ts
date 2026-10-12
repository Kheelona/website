/* The DS icons the form controls draw: Field's error line (warning-circle), Select's caret (caret-down) and
 * Checkbox's tick (check); Alert takes warning-circle from here too (Alert/alert-icons.ts).
 *
 * Why copies: the checkout forms are client islands (ADR-003) and import these controls, so whatever the controls
 * import ships to the browser. The generated map (src/assets/icons.generated.ts, `ICON_PATHS`) is about 30 KB and
 * is never tree-shaken: one icon read from it ships all 76 (assets catalogue, Icons row). Each path here is the DS
 * icon's own, held equal to the map by field-icons.test.ts (the map is held equal to design-system/ by
 * test/guards/generated-icons.test.ts). If build-icons.mjs ever emits one export per icon, these become
 * re-exports of it. */

/** The viewBox every DS icon shares. */
export const ICON_VIEWBOX = "0 0 256 256";

/** DS `warning-circle` (Phosphor Bold): the error line's icon. */
export const ICON_WARNING_CIRCLE =
  "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z";

/** DS `caret-down`: the select's caret. */
export const ICON_CARET_DOWN =
  "M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z";

/** DS `check`: the checkbox's tick. */
export const ICON_CHECK =
  "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z";
