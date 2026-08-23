import { notFound } from "next/navigation";
import { storeEnv } from "@/lib/store/env";
import { db } from "@/lib/store/db";
import { verifyAddressToken } from "@/lib/store/signing";
import { isOrderRef } from "@/lib/store/order-ref";
import { FULL_TIER } from "@/lib/store/mode";
import { AddressForm } from "@/features/preorder";
import {
  formatInr,
  BALANCE_PRICE,
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
 *  It reads the order rather than trusting the URL, so it can tell the truth
 *  about a payment that Razorpay has confirmed to the browser but whose webhook
 *  has not landed yet. That gap is usually a second or two and occasionally
 *  longer, and "we are confirming" is a better answer than a page that claims
 *  something it has not checked. */
export const dynamic = "force-dynamic";

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; t?: string }>;
}) {
  const { ref, t } = await searchParams;
  const env = storeEnv();

  if (!env || !ref || !t || !isOrderRef(ref) || !verifyAddressToken(env.signingSecret, ref, t)) {
    /* A 404 rather than an explanation. A bad or expired token must not confirm
       that a given order reference exists. */
    notFound();
  }

  const { data } = await db(env)
    .from("preorders")
    .select("*")
    .eq("order_ref", ref)
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
        {paid ? "Your Lumi is reserved." : "Thank you. We are confirming it now."}
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
          <Row label="Due on dispatch" value={`${BALANCE_PRICE}, of the ${LAUNCH_PRICE} price`} />
        )}
        <Row label="Ships from" value={SHIP_DATE_TEXT} />
      </dl>

      <h2 className="mb-3 font-display text-[24px] font-extrabold text-ink-head">
        {order.address ? "Your delivery address" : "Where should it go?"}
      </h2>
      <p className="mb-6 max-w-[52ch] text-[16px] leading-[1.6] text-ink">
        {order.address
          ? "This is where your Lumi will go. Change it any time before dispatch."
          : "One last thing, and it takes under a minute. If you would rather do it later, the link in your email brings you straight back here."}
      </p>

      <AddressForm orderRef={order.order_ref} token={t} existing={order.address} />

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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
      <dt className="text-[15px] text-ink-muted">{label}</dt>
      <dd className="font-display text-[17px] font-extrabold text-ink-head">{value}</dd>
    </div>
  );
}
