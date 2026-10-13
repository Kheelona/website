import { Card } from "@/components/ui/Card/Card";
import { DefinitionList } from "@/components/ui/DefinitionList/DefinitionList";
import { RichText } from "@/components/ui/RichText/RichText";
import { fillSlots } from "../ConfirmationHead/slot-text";
import { deliveryLine } from "@/lib/offer/delivery-line";
import type { OrderRowsCopy } from "./order-rows.types";

export interface OrderRowsProps {
  /** The card's words (content/en-IN/store/confirmation.ts `order`). */
  copy: OrderRowsCopy;
  /** The order reference, from the row. */
  orderRef: string;
  /** What was paid, formatted from the row. */
  paid: string;
  /** What is still due, formatted from the row; null for a full-payment order. */
  balance: string | null;
  /** The price the balance is part of. */
  price: string;
  /** The row's `created_at`: it picks the delivery row (lib/offer/delivery-line.ts). */
  createdAt: string | null | undefined;
  /** The h2's id, which names the card. */
  id?: string;
}

/**
 * The /thanks order card (task 5.16; store-confirmation.html fold 2; DS gap G-11: a DS card and a description list):
 * order number, paid today, due before delivery, delivery. Every value comes from the order row through the page,
 * which derives them as it did at the freeze tag, never from the store's current mode; this section only words them.
 * The delivery row is chosen by the order's date (lib/offer/delivery-line.ts; N9, F12). Values print as plain text.
 * Server component.
 */
export function OrderRows({ copy, orderRef, paid, balance, price, createdAt, id = "order-title" }: OrderRowsProps) {
  const delivery = deliveryLine(createdAt, copy.delivery);
  return (
    <Card as="section" className="ks-order" labelledBy={id} title={<RichText text={copy.heading} />} titleAs="h2" titleId={id}>
      <DefinitionList
        variant="order"
        rows={[
          { term: copy.number, value: orderRef },
          { term: copy.paid, value: paid },
          { term: copy.due.term, value: balance === null ? copy.due.nothing : fillSlots(copy.due.balance, { balance, price }) },
          { term: delivery.term, value: delivery.value },
        ]}
      />
    </Card>
  );
}
