import { clsx } from "clsx";
import type { ReactNode } from "react";

/**
 * Term and value rows (DS gap G-11, composed): the product page's spec table (`mk-specs`, meet-kheelu.html fold 7),
 * its stacked declarations (`mk-specs mk-specs--stack`) and the confirmation's order rows (`mk-order__rows`,
 * store-confirmation.html fold 2). Values take `RichText` (placeholders, links, amounts).
 */
export type DefinitionListVariant = "specs" | "stack" | "order";

const VARIANT_CLASSES: Record<DefinitionListVariant, string> = {
  specs: "ks-specs",
  stack: "ks-specs ks-specs--stack",
  order: "ks-order__rows",
};

export interface DefinitionListRow {
  term: ReactNode;
  value: ReactNode;
}

export interface DefinitionListProps {
  rows: readonly DefinitionListRow[];
  variant?: DefinitionListVariant;
  /** The parent's composition class, added after the variant's classes. */
  className?: string;
}

export function DefinitionList({ rows, variant = "specs", className }: DefinitionListProps) {
  return (
    <dl className={clsx(VARIANT_CLASSES[variant], className)}>
      {rows.map((row, i) => (
        <div key={i}>
          <dt>{row.term}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
