import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { storeEnv } from "@/lib/store/env";
import { db } from "@/lib/store/db";
import { verifyAddressToken } from "@/lib/store/signing";
import { THANKS_COOKIE, parseThanksSession } from "@/lib/store/thanks-session";
import { FULL_TIER } from "@/lib/store/mode";
import { AddressForm } from "@/features/preorder";
import {
  formatInr,
  LAUNCH_AMOUNT_PAISE,
  LAUNCH_PRICE,
  SHIP_DATE_TEXT,
  SUPPORT_WHATSAPP_HREF,
  SUPPORT_WHATSAPP_DISPLAY,
} from "@/config/site";
import type { PreorderRow } from "@/lib/store/db";

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
 *  something it has not checked. */
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

  if (!data) notFound();
  const order = data as PreorderRow;
  const paid = order.status === "paid";

  return (
    <div className="mx-auto w-full max-w-[680px] px-6 py-10 md:py-14">
      <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-orange-ink">
        {paid ? "Pre-order confirmed" : "Confirming your payment"}
      </p>
      <h1 className="mb-4 max-w-[24ch] font-display text-[clamp(30px,4vw,42px)] font-extrabold leading-[1.08] text-ink-head">
        {paid ? "Your Kheelu is reserved." : "Thank you. We are confirming it now."}
      </h1>

      <p className="mb-6 max-w-[52ch] text-[17px] leading-[1.6] text-ink">
        {paid ? (
          <>
            We have your {formatInr(order.amount_paise)}, and your place in the
            queue is held from the moment you paid. Your confirmation is on its
            way to {order.email}.
          </>
        ) : (
          <>
            Your payment is with our provider and we are waiting for their
            confirmation, which usually takes a few seconds. Nothing is lost if
            you refresh, and your order number is below either way.
          </>
        )}
      </p>

      {/* Every line derives from the ORDER ROW, never from the store's current
          mode: a token holder revisiting after the cap flips must still read
          exactly what they agreed to (§8.26). */}
      <dl className="mb-9 grid gap-3 rounded-(--radius-card) border border-line bg-white p-5">
        <Row label="Order number" value={order.order_ref} />
        <Row label="Paid today" value={formatInr(order.amount_paise)} />
        {order.tier === FULL_TIER ? (
          <Row label="Due on dispatch" value="Nothing. You have paid in full" />
        ) : (
          /* Derived from the row, not the public constant: a ₹99 event token
             owes ₹4,900, and a ₹499 token keeps reading ₹4,500 to the byte. */
          <Row
            label="Due on dispatch"
            value={`${formatInr(Math.max(0, LAUNCH_AMOUNT_PAISE - order.amount_paise))}, of the ${LAUNCH_PRICE} price`}
          />
        )}
        <Row label="Ships from" value={SHIP_DATE_TEXT} />
      </dl>

      <h2 className="mb-3 font-display text-[24px] font-extrabold text-ink-head">
        {order.address ? "Your delivery address" : "Where should it go?"}
      </h2>
      <p className="mb-6 max-w-[52ch] text-[16px] leading-[1.6] text-ink">
        {order.address
          ? "This is where your Kheelu will go. Change it any time before dispatch."
          : "One last thing, and it takes under a minute. If you would rather do it later, the link in your email brings you straight back here."}
      </p>

      <AddressForm orderRef={order.order_ref} token={session.token} existing={order.address} />

      <p className="mt-10 text-[15px] text-ink-muted">
        Anything at all, message us on WhatsApp at{" "}
        <a
          href={SUPPORT_WHATSAPP_HREF}
          className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        >
          {SUPPORT_WHATSAPP_DISPLAY}
        </a>
        , quoting {order.order_ref}.
      </p>
    </div>
  );
}

/** What a person sees at a bare /thanks: a stale link, a cookie that has aged
 *  out, or simply somebody who typed the URL. It promises nothing about whether
 *  any order exists, and it always offers a human. */
function LinkNeeded() {
  return (
    <div className="mx-auto w-full max-w-[680px] px-6 py-10 md:py-14">
      <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-orange-ink">
        Your pre-order is safe
      </p>
      <h1 className="mb-4 max-w-[24ch] font-display text-[clamp(30px,4vw,42px)] font-extrabold leading-[1.08] text-ink-head">
        We need your link again.
      </h1>
      <p className="mb-6 max-w-[52ch] text-[17px] leading-[1.6] text-ink">
        This page opens from the link in your confirmation email, and that link
        has either expired or was opened somewhere else. Open the most recent
        email from us and tap it again, and you will land back here.
      </p>
      <p className="max-w-[52ch] text-[16px] leading-[1.6] text-ink">
        Cannot find the email? Message us on WhatsApp at{" "}
        <a
          href={SUPPORT_WHATSAPP_HREF}
          className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        >
          {SUPPORT_WHATSAPP_DISPLAY}
        </a>{" "}
        and a person will pull up your order and add your address for you.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
      <dt className="text-[15px] text-ink-muted">{label}</dt>
      <dd className="font-display text-[17px] font-extrabold text-ink-head">{value}</dd>
    </div>
  );
}
