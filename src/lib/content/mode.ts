import type { ByMode, ModeVariant, OfferMode } from "@/content/types";

/** True for `{ token, full }` and nothing else, so a table that merely has those
 *  keys among others (the offer's prices) is never mistaken for a variant. */
export function isModeVariant<T>(value: ByMode<T> | unknown): value is ModeVariant<T> {
  if (typeof value !== "object" || value === null) return false;
  const keys = Object.keys(value);
  return keys.length === 2 && keys.includes("token") && keys.includes("full");
}

/** The version of `value` for `mode`. A value that changes with the mode needs a
 *  mode: rendering one without the offer would publish the wrong price wording. */
export function pickMode<T>(value: ByMode<T>, mode: OfferMode | undefined): T {
  if (!isModeVariant<T>(value)) return value as T;
  if (mode === undefined) {
    throw new Error(
      "This content changes with the offer mode (token or full); pass the offer to render it.",
    );
  }
  return value[mode];
}
