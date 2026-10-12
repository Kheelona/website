/* The DS icons the form controls draw: Field's error line (warning-circle), Select's caret (caret-down) and
 * Checkbox's tick (check); Alert takes its tone icons from the same constants (Alert/alert-icons.ts).
 *
 * Re-exports of the generated constants (task 2.11), never copies and never the map: the checkout forms are client
 * islands (ADR-003) and import these controls, so whatever the controls import ships to the browser. A production
 * build keeps only the constants a client chunk uses; `ICON_PATHS` would bring all 76
 * (test/guards/client-icons.test.ts; field-icons.test.ts holds these equal to the map). */
export { ICON_CARET_DOWN, ICON_CHECK, ICON_VIEWBOX, ICON_WARNING_CIRCLE } from "@/assets/icons.generated";
