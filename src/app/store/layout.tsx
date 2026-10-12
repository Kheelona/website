import type { Metadata } from "next";
import { StoreShell } from "@/layouts/StoreShell/StoreShell";

/** The store's own chrome (architecture §16.1; presentation only, ADR-013).
 *
 *  Deliberately not the marketing navbar. A parent on this page has already
 *  decided; nav tabs are ways to leave. What replaces them is what a person
 *  needs mid-payment: proof of who they are paying, and a way to reach a human.
 *  StoreShell renders the store header and footer of the approved store mockup
 *  (mockup/store.html), with the policy links on the marketing site of this
 *  build (MARKETING_ORIGIN: one canonical copy of each policy, on the domain
 *  that ranks; the beta site on beta).
 *
 *  NOINDEX, and not by accident: the store is a transactional endpoint, and
 *  letting it into the index would put a thin checkout page into competition
 *  with /products/kheelu.
 *
 *  This route sits under the root layout, so the fonts, the tokens and the
 *  measurement tools are already in place. Nothing is duplicated here. */
export const metadata: Metadata = {
  title: "Pre-order Kheelu",
  robots: { index: false, follow: false },
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreShell>{children}</StoreShell>
  );
}
