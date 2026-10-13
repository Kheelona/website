import type { Metadata } from "next";
import { cookies } from "next/headers";
import { storeEnv } from "@/lib/store/env";
import { db } from "@/lib/store/db";
import { verifyAddressToken } from "@/lib/store/signing";
import { THANKS_COOKIE, THANKS_PATH, parseThanksSession } from "@/lib/store/thanks-session";
import { FULL_TIER } from "@/lib/store/mode";
import { AddressForm } from "@/features/preorder";
import {
  formatInr,
  LAUNCH_AMOUNT_PAISE,
  LAUNCH_PRICE,
} from "@/config/site";
import type { PreorderRow } from "@/lib/store/db";
import { NotFoundPanel } from "../_components/NotFoundPanel";
import { WhatsAppFloat } from "@/components/chrome/WhatsAppFloat/WhatsAppFloat";
import { StepsSection } from "@/components/sections/StepsSection/StepsSection";
import { AddressStep } from "@/components/sections/store/AddressStep/AddressStep";
import { ConfirmationHead } from "@/components/sections/store/ConfirmationHead/ConfirmationHead";
import { fillSteps } from "@/components/sections/store/ConfirmationHead/slot-text";
import { HelpBlock } from "@/components/sections/store/HelpBlock/HelpBlock";
import { OrderRows } from "@/components/sections/store/OrderRows/OrderRows";
import { STORE_ORIGIN } from "@/config/env";
import { seller } from "@/content/en-IN/seller";
import { confirmation } from "@/content/en-IN/store/confirmation";
import { pageMeta } from "@/lib/seo/metadata";

/** The confirmation, and the address step (§8.25-x).
 *
 *  Reached twice: seconds after paying, and weeks later from the link in the
 *  acknowledgement email. Same page both times, because it is the same job.
 *
 *  AUTHORISED BY THE SIGNED TOKEN, never by the order reference alone. There are
 *  no accounts here, so the token is the only thing that proves the person
 *  reading this is the person who paid. Without that rule, a reference visible
 *  in a screenshot would show a stranger a family's delivery address.
 *
 *  THE TOKEN ARRIVES IN A COOKIE, NOT IN THE URL (F-01, 2026-08-23). It reaches
 *  this host once as `?ref=&t=`, and `src/proxy.ts` consumes that on arrival:
 *  the value moves into an HttpOnly cookie and the browser lands here on a
 *  clean `/thanks`. The reason is this page's own furniture. It inherits three
 *  measurement tags from the root layout, and each of them reports the URL it
 *  loaded on, so a token in the query string was a thirty-day credential for
 *  one family's order being written into an analytics property. See
 *  lib/store/thanks-session.ts. Nothing else about the model moved: same
 *  signed token, same verification, and /api/preorder/address still takes it in
 *  the POST body.
 *
 *  ⚑ NO META `Purchase` FIRES ON THIS PAGE, AND IT KEEPS BEING REPORTED THAT ONE
 *  DOES (three times by 2026-09-02, twice by the same reviewer). Purchase fires
 *  from Razorpay's success handler in `features/preorder/components/PreorderForm.tsx`,
 *  which never renders here — this page renders `AddressForm`, whose only
 *  analytics call is `addressSaved`. So a parent returning from the email link,
 *  at any interval, cannot produce a second conversion, and the re-fire guard
 *  that keeps getting proposed would be dead code on a page that fires nothing.
 *
 *  WHY IT LOOKS TRUE, which is the useful half: `Purchase`, `eventID` and
 *  `thanks` all appear in the SAME built JavaScript chunk, because Next groups
 *  routes into shared chunks. Co-location in a chunk is not a call site.
 *  Grep the source, not the bundle (§8.30-p).
 *
 *  It reads the order rather than trusting the URL, so it can tell the truth
 *  about a payment that Razorpay has confirmed to the browser but whose webhook
 *  has not landed yet. That gap is usually a second or two and occasionally
 *  longer, and "we are confirming" is a better answer than a page that claims
 *  something it has not checked.
 *
 *  RESTYLED IN TASK 5.16 (ADR-013: markup, classes, copy and presentation
 *  imports only). The approved mockup (mockup/pages/store-confirmation.html)
 *  in five folds, each a section: ConfirmationHead, OrderRows, AddressStep
 *  around the AddressForm, StepsSection (what happens next) and HelpBlock,
 *  then the /thanks WhatsApp bubble (D050, with ph-no-capture). The words are
 *  src/content/en-IN/store/confirmation.ts; every amount, the email and the
 *  order number are still read and derived HERE from the order row, exactly as
 *  before, and handed to the sections as values. The one rule that moved out
 *  is the delivery row's choice by order date (N9, F12 open), in
 *  sections/store/OrderRows/delivery-line.ts: this page passes `created_at`.
 *
 *  Metadata through pageMeta (title, description, share card), with the
 *  canonical and the share URL on the store host, as the store page sets its
 *  own: this page's URL is the store's, never the marketing origin's. No robots
 *  key: the store layout's noindex stands (a page-level one would replace it). */
const { title, description, openGraph, twitter } = pageMeta({ ...confirmation.meta, path: THANKS_PATH });

export const metadata: Metadata = { title, description, alternates: { canonical: `${STORE_ORIGIN}${THANKS_PATH}` }, openGraph: { ...openGraph, url: `${STORE_ORIGIN}${THANKS_PATH}` }, twitter };

export const dynamic = "force-dynamic";

export default async function ThanksPage() {
  const env = storeEnv();
  const session = parseThanksSession((await cookies()).get(THANKS_COOKIE)?.value);

  if (
    !env ||
    !session ||
    !verifyAddressToken(env.signingSecret, session.orderRef, session.token)
  ) {
    /* No reference in the URL any more, so there is nothing here to confirm or
       deny: a plain page that says how to get back in beats the old 404, which
       a parent whose cookie had aged out could reach after paying us. */
    return <LinkNeeded />;
  }

  const { data } = await db(env)
    .from("preorders")
    .select("*")
    .eq("order_ref", session.orderRef)
    .maybeSingle();

  /* A valid signed link whose order will not load. It reaches here two ways:
     the row is genuinely gone, or the query failed (maybeSingle returns a null
     `data` for both). Either way the reader has PAID us, so this renders a
     page instead of throwing: a thrown 404 answers with an empty document that
     stays blank until JavaScript hydrates (§8.34-a), and blank is the worst
     thing to show someone looking for money they have already sent.
     Distinguishing "no row" from "query failed" is worth doing and is logged
     in Technical-Todo.md; it does not change what this reader is told. */
  if (!data) {
    return (
      <>
        <NotFoundPanel title={confirmation.cannotOpen.title} body={confirmation.cannotOpen.body} cta={false} />
        <ThanksBubble />
      </>
    );
  }
  const order = data as PreorderRow;
  const paid = order.status === "paid";

  /* ph-no-capture / ph-mask cover THE WHOLE PAGE, not the individual lines
     that happen to carry a detail today (§8.38).

     Session replay is already switched off for this route wholesale
     (POSTHOG_REPLAY_DENY_PATHS), but AUTOCAPTURE still runs here, and
     autocapture reports the text of whatever a person taps. This page prints
     an email address, an order number and a delivery address, so tapping any
     of them would otherwise put it in an event.

     Marking the container rather than the fields is the same judgement as
     denying the route rather than masking its nodes: posthog-js walks an
     element's ancestors looking for `ph-no-capture` (verified in the SDK's own
     `io()`), so everything inside is covered — including the next row somebody
     adds to the summary without thinking about analytics. A per-field list
     would be correct today and quietly wrong at the next edit. */
  return (
    <>
      <div className="ph-no-capture ph-mask kh-section ks-thanks">
        <div className="ks-thanks__col">
          <ConfirmationHead
            copy={paid ? confirmation.head.paid : confirmation.head.created}
            amount={formatInr(order.amount_paise)}
            email={order.email}
          />

          {/* Every line derives from the ORDER ROW, never from the store's current
              mode: a token holder revisiting after the cap flips must still read
              exactly what they agreed to (§8.26). The balance is derived from the
              row, not the public constant: a ₹99 event token owes ₹4,900, and a
              ₹499 token keeps reading ₹4,500 to the byte. */}
          <OrderRows
            copy={confirmation.order}
            orderRef={order.order_ref}
            paid={formatInr(order.amount_paise)}
            balance={order.tier === FULL_TIER ? null : formatInr(Math.max(0, LAUNCH_AMOUNT_PAISE - order.amount_paise))}
            price={LAUNCH_PRICE}
            createdAt={order.created_at}
          />

          <AddressStep copy={order.address ? confirmation.address.saved : confirmation.address.empty}>
            <AddressForm orderRef={order.order_ref} token={session.token} existing={order.address} />
          </AddressStep>

          {/* Step 2 names the same balance as the order card, from the same row. */}
          <StepsSection
            variant="thanks"
            heading={confirmation.next.heading}
            steps={
              order.tier === FULL_TIER
                ? fillSteps(confirmation.next.full)
                : fillSteps(confirmation.next.token, { balance: formatInr(Math.max(0, LAUNCH_AMOUNT_PAISE - order.amount_paise)) })
            }
          />

          <HelpBlock copy={confirmation.help} />
        </div>
      </div>
      <ThanksBubble />
    </>
  );
}

/** What a person sees at a bare /thanks: a stale link, a cookie that has aged
 *  out, or simply somebody who typed the URL. It promises nothing about whether
 *  any order exists, and it always offers a human. */
function LinkNeeded() {
  return (
    <>
      <div className="kh-section ks-thanks">
        <div className="ks-thanks__col">
          <ConfirmationHead copy={confirmation.head.linkNeeded} help={confirmation.linkNeededHelp} />
        </div>
      </div>
      <ThanksBubble />
    </>
  );
}

/** The /thanks WhatsApp bubble (D050): the page's own pre-filled text, never an
 *  order detail, and `ph-no-capture` on the link so this page keeps zero
 *  autocapture events (tracking inventory row 18). In every state, since a
 *  layout cannot know its page. */
function ThanksBubble() {
  return <WhatsAppFloat href={seller.support.whatsapp} chat={seller.chat} context="thanks" />;
}
