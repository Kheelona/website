import type { ReactNode } from "react";
import { RichText } from "@/components/ui/RichText/RichText";
import type { AddressStepCopy } from "./address-step.types";

export interface AddressStepProps {
  /** The heading and line for the order's state: no address yet, or saved (content/en-IN/store/confirmation.ts). */
  copy: AddressStepCopy;
  /** The checkout's AddressForm (a client island, logic frozen; ADR-013). */
  children: ReactNode;
  /** The section's anchor (the email's link lands on it). */
  id?: string;
  /** The h2's id, which names the section. */
  titleId?: string;
}

/**
 * The /thanks address step (task 5.16; store-confirmation.html fold 3): the `#address` section named by its h2 in the
 * store's heading style (`ks-h2`, StoreDetails, task 5.15), the line under it (`ks-thanks__intro`), then the form the
 * page passes in. address-step.css styles that form's layout (`ks-addr`: the PIN code and city pair from 720 px, the
 * button full width on phones only); its fields, list and button are the DS Field, Select and primary button.
 * Server component.
 */
export function AddressStep({ copy, children, id = "address", titleId = "address-title" }: AddressStepProps) {
  return (
    <section id={id} aria-labelledby={titleId}>
      <RichText as="h2" className="kh-title ks-h2" id={titleId} text={copy.heading} />
      <RichText as="p" className="kh-body ks-thanks__intro" text={copy.intro} />
      {children}
    </section>
  );
}
