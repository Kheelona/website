import { ICON_WARNING_CIRCLE } from "@/components/ui/Field/field-icons";

/* The DS's icon per Alert tone (bundle.js `STATUS_ICON`: info, check-circle, warning-circle twice), as path data.
 * Copies, not reads of the generated map, for the reason in Field/field-icons.ts: the store's pay and address
 * failures show in a danger Alert inside the checkout forms' client islands (store copy). Alert.test.tsx holds
 * each tone's drawn path equal to the map's. */

/** DS `info`: the info tone's icon (the store's in-app note). */
const ICON_INFO =
  "M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z";

/** DS `check-circle`: the success tone's icon. */
const ICON_CHECK_CIRCLE =
  "M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z";

export const ALERT_TONE_ICON = {
  info: ICON_INFO,
  success: ICON_CHECK_CIRCLE,
  warning: ICON_WARNING_CIRCLE,
  danger: ICON_WARNING_CIRCLE,
} as const;
