import type { ReactNode } from "react";
import { PolicyLinks, type PolicyLink } from "@/components/ui/PolicyLinks/PolicyLinks";
import { SellerLines } from "@/components/ui/SellerLines/SellerLines";

export interface StoreFooterProps {
  /** The policy links' landmark name, the links (marketing-site addresses: MARKETING_ORIGIN + path) and the note each
   *  link reads to screen readers, since each opens in a new tab so a half-filled form survives. */
  policies: { label: string; links: readonly PolicyLink[]; newTabNote: string };
  /** The seller lines, printed in the store's order (`SellerLines` store variant); no GSTIN and no number (D063 items
   *  2-3). */
  seller: { entity: ReactNode; address: ReactNode; contact: ReactNode };
  /** D032's published grievance line, without the number on the store (D063 item 2). */
  grievance: ReactNode;
  /** D042's payments line for the store footer, when the shell has it. */
  payments?: ReactNode;
  /** "© 2026 Kheelona Robotics Private Limited". */
  copyright: ReactNode;
}

/**
 * The store's footer (mockup/store.html fold 7, shared with the confirmation page): who is being paid and the legally
 * required ways to reach a person and complain. The DS footer (`kh-footer`) holding, in the container grid, the
 * policy links (`PolicyLinks`), the seller address (`SellerLines` store variant; `ks-store-foot__seller`, because the
 * mockup's `mk-seller` names a different block on the contact page, mockup-css-mapping §6.2), the grievance line,
 * the payments line and the copyright. store-footer.css ports store.css:13-19 and :23-27.
 */
export function StoreFooter({ policies, seller, grievance, payments, copyright }: StoreFooterProps) {
  return (
    <footer className="kh-footer ks-store-foot">
      <div className="kh-container ks-store-foot__in">
        <PolicyLinks label={policies.label} links={policies.links} newTabNote={policies.newTabNote} />
        <SellerLines variant="store" className="ks-store-foot__seller" {...seller} />
        <p className="kh-body-s">{grievance}</p>
        {payments !== undefined && <p className="kh-body-s">{payments}</p>}
        <p className="kh-footer__legal">{copyright}</p>
      </div>
    </footer>
  );
}
