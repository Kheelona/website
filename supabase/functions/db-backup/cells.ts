import { MAX_CELL_CHARS } from "./config.ts";

/** A database value as the text of one sheet cell. Null is an empty cell; JSON values (address, utm, fb_attrib, payload)
 *  become their JSON text; numbers and booleans become plain text a CSV import reads back. */
export function toCellText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
  return JSON.stringify(value);
}

export type FittedCell = { text: string; truncated: boolean };

/** The marker that ends a cut value, so a reader can see it was cut and how much was lost. */
export const truncationMarker = (kept: number, total: number) => ` [TRUNCATED: ${kept} of ${total} characters kept]`;

/** The text itself when it fits in one cell, else what fits, ending in a visible marker (never silently cut). The result
 *  is never longer than the limit and never ends in half a surrogate pair. */
export function fitCell(text: string, limit: number = MAX_CELL_CHARS): FittedCell {
  if (text.length <= limit) return { text, truncated: false };
  const total = text.length;
  // The marker states how many characters were kept, so settle on a length that is consistent with it.
  let kept = limit - truncationMarker(total, total).length;
  for (let i = 0; i < 3; i++) kept = limit - truncationMarker(kept, total).length;
  while (kept > 0 && kept + truncationMarker(kept, total).length > limit) kept -= 1;
  kept = Math.max(0, kept);
  const code = text.charCodeAt(kept - 1);
  if (kept > 0 && code >= 0xd800 && code <= 0xdbff) kept -= 1;
  return { text: text.slice(0, kept) + truncationMarker(kept, total), truncated: true };
}
