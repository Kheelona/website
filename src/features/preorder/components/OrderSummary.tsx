import { ContentIcon } from "@/components/ui/Icon/Icon";
import { checkoutPrices, checkoutWords } from "@/components/sections/store/StoreDetails/checkout-words";
import type { OrderSummaryCopy } from "@/components/sections/store/StoreDetails/store-details.types";
import { BALANCE_PRICE, SHIP_DATE_TEXT } from "@/config/site";
import { orderSummaryCopy } from "@/content/en-IN/store/store-page";

/** What a parent is agreeing to, on the page where they agree to it (§8.25-u).
 *
 *  Server-rendered and static: this is the page's most important text and it must
 *  be in the HTML, not assembled by a script. It is also the answer to the
 *  question the marketing site cannot fully settle, because the marketing site
 *  is not where the money moves: what exactly leaves my account today, what
 *  leaves it later, and what happens if I change my mind.
 *
 *  Two shapes since §8.26. "token": ₹499 now, the balance by a link before
 *  dispatch. "full": the whole price now and nothing afterwards. The mode is
 *  decided by the server with the tier; this component only words it. Event
 *  pages always render the token shape — an event token is a token.
 *
 *  RESTYLED ON THE DESIGN SYSTEM (task 5.15; ADR-013: markup, classes, copy and
 *  presentation imports only; store.md fold 4): the agreement card of the approved
 *  mockup, a DS card of rows each with its DS icon tile, its bold head and its
 *  note, then the small print (DS gap G-11, composed; `ks-agree` is StoreDetails'
 *  CSS). The words come from content, their amounts from the labels the server
 *  formatted (checkout-words.ts). The tier's own label is no longer printed: the
 *  first row's note says what the advance is part of instead (store.md fold 4). */
export function OrderSummary({
  amountLabel,
  mode = "token",
  balanceLabel = BALANCE_PRICE,
  delivery = `Ships ${SHIP_DATE_TEXT}`,
  copy = orderSummaryCopy,
}: {
  amountLabel: string;
  /** The tier's own name (src/lib/store/tiers.ts). Passed by every caller and no
   *  longer printed since the restyle (store.md fold 4). */
  tierLabel: string;
  mode?: "token" | "full";
  /** What is still owed before dispatch, already formatted by the server.
   *  Defaults to the public ₹4,500; event pages pass the derived figure
   *  (₹4,999 minus the token actually paid), so a ₹99 booking honestly reads
   *  ₹4,900 (2026-08-23, the Ideabaaz page). Like `amountLabel`, this is a
   *  label decided server-side — it changes sentences, never charges. */
  balanceLabel?: string;
  /** The delivery row's head. The store page passes the D023 delivery line
   *  ("Deliveries start mid-November", content/en-IN/delivery.ts). Without it
   *  the row keeps the ship date the checkout printed before the reset, which
   *  the event and partner pages show until task 6.1 restyles them and F12
   *  settles existing orders (architecture §16.3). */
  delivery?: string;
  /** The card's words: the store's by default (store.md fold 4). */
  copy?: OrderSummaryCopy;
}) {
  const prices = checkoutPrices(mode, amountLabel, balanceLabel);
  const words = (text: string) => checkoutWords(text, prices);
  const rows = [...copy.rows[mode], { icon: copy.delivery.icon, head: delivery, note: copy.delivery.note }];

  return (
    <section className="kh-card ks-agree" aria-labelledby={copy.titleId}>
      <h2 className="kh-card__title" id={copy.titleId}>
        {copy.title}
      </h2>
      <ul className="ks-agree__list">
        {rows.map((row) => (
          <li key={row.icon}>
            <span className="kh-listitem__icon">
              <ContentIcon name={row.icon} />
            </span>
            <div>
              <p className="kh-label">{words(row.head)}</p>
              <p className="kh-body-s ks-muted">{words(row.note)}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="kh-body-s ks-muted ks-agree__fine">{words(copy.fine[mode])}</p>
    </section>
  );
}
