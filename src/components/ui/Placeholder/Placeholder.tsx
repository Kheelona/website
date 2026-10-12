import type { Placeholder as OpenFact } from "@/content/types";
import { placeholderText } from "@/lib/content/placeholder";

export type PlaceholderProps = Pick<OpenFact, "id" | "note">;

/**
 * A fact the founder has not supplied yet, marked in place so it stays visible on beta until it exists
 * (brief §4.2; ADR-004). The marker text comes from src/lib/content/placeholder.ts, the one place its
 * syntax lives; the production build refuses any page that still renders one (task 2.9). Ported from the
 * mockup's dashed placeholder style.
 */
export function Placeholder({ id, note }: PlaceholderProps) {
  return <span className="ks-placeholder">{placeholderText({ id, note })}</span>;
}
