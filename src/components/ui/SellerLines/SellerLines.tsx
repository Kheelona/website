import { clsx } from "clsx";
import type { ReactNode } from "react";

/**
 * The seller lines (legal entity, registered address, contact), printed character for character the same wherever they
 * appear (components §1, §2 SellerBlock). The shells and SellerBlock pass them from content/en-IN/seller.ts; the contact
 * slot takes `RichText` (the WhatsApp, email and, on /contact only, phone links). The mockups' GSTIN line came off the
 * website (D063 item 3, D064 item 11; task Q2.3), so no shape prints one.
 *
 * Three approved shapes, each its page's order:
 * - `footer`: three spans, entity, address, contact, inside the footer's `kh-footer__legal` row
 *   (partials/footer.html); the footer adds its own lines after them.
 * - `block`: the contact page's `<address class="kh-body-l">`, the entity in `strong.kh-title`, then the other two
 *   lines as spans, in the footer's order (contact.html fold 4).
 * - `store`: the store footer's `<address class="kh-body-s">`, the entity in `strong`, then address and contact, broken
 *   by `<br>` (store.html fold 7).
 */
export type SellerLinesVariant = "footer" | "block" | "store";

export interface SellerLinesProps {
  entity: ReactNode;
  address: ReactNode;
  contact: ReactNode;
  variant?: SellerLinesVariant;
  /** The parent's composition class on the `<address>` (block and store), added after the DS class. */
  className?: string;
}

export function SellerLines({ entity, address, contact, variant = "footer", className }: SellerLinesProps) {
  if (variant === "store") {
    return (
      <address className={clsx("kh-body-s", className)}>
        <strong>{entity}</strong>
        <br />
        {address}
        <br />
        {contact}
      </address>
    );
  }
  const lines = (
    <>
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
