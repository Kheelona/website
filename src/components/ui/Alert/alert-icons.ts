import { ICON_CHECK_CIRCLE, ICON_INFO, ICON_WARNING_CIRCLE } from "@/assets/icons.generated";

/* The DS's icon per Alert tone (bundle.js `STATUS_ICON`: info, check-circle, warning-circle twice), as the generated
 * named constants (task 2.11), never the map: the store's pay and address failures show in a danger Alert inside the
 * checkout forms' client islands (store copy), and a client chunk keeps only the constants it uses
 * (Field/field-icons.ts). Alert.test.tsx holds each tone's drawn path equal to the map's. */
export const ALERT_TONE_ICON = {
  info: ICON_INFO,
  success: ICON_CHECK_CIRCLE,
  warning: ICON_WARNING_CIRCLE,
  danger: ICON_WARNING_CIRCLE,
} as const;
