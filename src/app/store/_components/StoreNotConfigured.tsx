import { WhatsAppFloat } from "@/components/chrome/WhatsAppFloat/WhatsAppFloat";
import { Button } from "@/components/ui/Button/Button";
import { seller } from "@/content/en-IN/seller";
import { eventPage } from "@/content/en-IN/store/event-page";
import { storePage } from "@/content/en-IN/store/store-page";
import { NotFoundPanel } from "./NotFoundPanel";

/** The store before its keys are in place, and on beta, which never takes a payment (D051): the store's one panel
 *  (NotFoundPanel) with the store page's approved words (store.md, "Store not switched on"): the title and lead, the
 *  WhatsApp button as its action, then the note; and the store's WhatsApp bubble. No payments line: nothing can be paid.
 *
 *  Task 6.3 composed it inside the store page; task 7.1c moved it here, unchanged, so every store page that would sell
 *  renders the same state: the store page and the event page /e/<tier> (CMO review C m3, where the event page had only a
 *  muted link and still printed the payments line). Server component. */
export function StoreNotConfigured() {
  const copy = storePage.notConfigured;
  return (
    <>
      <NotFoundPanel
        copy={eventPage.notConfigured}
        title={copy.title}
        body={copy.body}
        action={
          <Button variant="secondary" href={seller.support.whatsapp} icon="whatsapp-logo">
            {copy.action}
          </Button>
        }
        note={copy.note}
      />
      <WhatsAppFloat href={seller.support.whatsapp} chat={seller.chat} context="store" />
    </>
  );
}
