import { clsx } from "clsx";
import type { ReactNode } from "react";

/**
 * The four seller lines (legal entity, GSTIN, registered address, contact), printed character for character the
 * same wherever they appear (components §1, §2 SellerBlock). The shells and SellerBlock pass them from
 * content/en-IN/seller.ts; the contact slot takes `RichText` (the phone and email links).
 *
 * Three approved shapes, each its page's order:
 * - `footer`: four spans, entity, GSTIN, address, contact, inside the footer's `kh-footer__legal` row
 *   (partials/footer.html); the footer adds its own lines after them.
 * - `block`: the contact page's `<address class="kh-body-l">`, the entity in `strong.kh-title`, then the same three
 *   lines as spans, in the footer's order (contact.html fold 4).
 * - `store`: the store footer's `<address class="kh-body-s">`, the entity in `strong`, then address, GSTIN and
 *   contact, broken by `<br>` (store.html fold 7).
 */
export type SellerLinesVariant = "footer" | "block" | "store";

export interface SellerLinesProps {
  entity: ReactNode;
  gstin: ReactNode;
  address: ReactNode;
  contact: ReactNode;
  variant?: SellerLinesVariant;
  /** The parent's composition class on the `<address>` (block and store), added after the DS class. */
  className?: string;
}

export function SellerLines({ entity, gstin, address, contact, variant = "footer", className }: SellerLinesProps) {
  if (variant === "store") {
    return (
      <address className={clsx("kh-body-s", className)}>
        <strong>{entity}</strong>
        <br />
        {address}
        <br />
        {gstin}
        <br />
        {contact}
      </address>
    );
  }
  const lines = (
    <>
      <span>{gstin}</span>
      <span>{address}</span>
      <span>{contact}</span>
    </>
  );
  if (variant === "block") {
    return (
      <address className={clsx("kh-body-l", className)}>
        <strong className="kh-title">{entity}</strong>
        {lines}
      </address>
    );
  }
  return (
    <>
      <span>{entity}</span>
      {lines}
    </>
  );
}
