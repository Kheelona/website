import type { IsoDate } from "@/content/types";

/**
 * The one delivery value for new orders (D023), rendered wherever a delivery line appears: the
 * `{delivery}` token, trust items, the offer card and the sticky bar. Never an arrival date or a
 * transit time (D022's guardrail). Production keeps "20 October 2026" until Gate B (D011).
 */
export const DELIVERY_TEXT = "Deliveries start mid-November";

/** The exact date the delivery line stands for, in schema only: Product `availabilityStarts` (D037). */
export const DELIVERY_SCHEMA_DATE = "2026-11-15" satisfies IsoDate;
