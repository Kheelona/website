import type { IconRef, RichTextString } from "@/content/types";
import type { SlotText } from "./slot-text";

/** One state's head on /thanks (paid, confirming, link needed): the eyebrow with its icon, the page's one h1, and the
 *  lede, whose slots take the order's amount and the email the confirmation went to (paid only). */
export interface ConfirmationHeadCopy {
  /** The DS icon before the eyebrow (store-confirmation.html fold 1: `check-circle` once paid). */
  readonly icon?: IconRef;
  readonly eyebrow: RichTextString;
  /** The page's one h1. */
  readonly heading: RichTextString;
  readonly lede: SlotText<"amount" | "email">;
}
