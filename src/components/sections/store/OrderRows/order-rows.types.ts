import type { RichTextString } from "@/content/types";
import type { SlotText } from "../ConfirmationHead/slot-text";
import type { DeliveryLines } from "@/lib/offer/delivery-line";

/** The order card's words (store-confirmation.html fold 2): its heading, the row labels, the balance sentence around
 *  the order's balance and the price it is part of, the full-payment line, and the two delivery rows (the choice
 *  between them is lib/offer/delivery-line.ts's, by the order's date). */
export interface OrderRowsCopy {
  readonly heading: RichTextString;
  readonly number: string;
  readonly paid: string;
  readonly due: {
    readonly term: string;
    /** A token order: what is still due, of the price (from the row, never the store's mode). */
    readonly balance: SlotText<"balance" | "price">;
    /** A full-payment order. */
    readonly nothing: string;
  };
  readonly delivery: DeliveryLines;
}
