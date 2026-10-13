import type { RichTextString } from "@/content/types";

/** The address step's heading and line (store-confirmation.html fold 3): one pair with no address yet, one once saved. */
export interface AddressStepCopy {
  readonly heading: RichTextString;
  readonly intro: RichTextString;
}

/** The address form's words (src/features/preorder/components/AddressForm.tsx, restyled in task 5.16): the five
 *  labels by field name, the state list's first option, the button and its busy label, the reassurance under it,
 *  and the saved state. Plain text: the form is a client island and prints them as they are. */
export interface AddressFormCopy {
  readonly labels: {
    readonly line1: string;
    readonly line2: string;
    readonly pincode: string;
    readonly city: string;
    readonly state: string;
  };
  readonly statePlaceholder: string;
  readonly save: string;
  readonly saving: string;
  readonly reassurance: string;
  readonly saved: {
    readonly title: string;
    /** The words before the WhatsApp link, the link's words, and the words after it. */
    readonly before: string;
    readonly link: string;
    readonly after: string;
    readonly change: string;
  };
}
