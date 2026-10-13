import type { RichTextString, SitePath } from "@/content/types";

/** The confirmation's last fold (store-confirmation.html fold 5): a person to reach, quoting the order, the undo in
 *  plain words, and the refund page. */
export interface HelpBlockCopy {
  readonly heading: RichTextString;
  /** The help line: the WhatsApp and call links and the words after them (seller.ts `help.contact`, then the page's). */
  readonly contact: RichTextString;
  /** "Changed your mind? …" */
  readonly undo: RichTextString;
  /** The refund policy, a page of the marketing site (the section puts it on `MARKETING_ORIGIN`). */
  readonly refund: { readonly label: string; readonly href: SitePath };
}
