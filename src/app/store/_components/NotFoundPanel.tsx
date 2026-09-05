import { SUPPORT_WHATSAPP_HREF } from "@/config/site";

/** What the store shows when the page a visitor asked for is not there.
 *
 *  One component in four places (§8.34-b): the `not-found.tsx` boundary, the
 *  `[...rest]` catch-all that answers a mistyped URL, the confirmation page
 *  when the order behind a valid link will not load, and the event page when
 *  the store is not configured. They were four different dead ends before, and
 *  three of them rendered nothing at all.
 *
 *  It offers a person rather than only a link home, because someone reading it
 *  may have paid us and be unable to reach their own order. */
export function NotFoundPanel({
  title = "That page is not here.",
  body = "The link may have expired, or it may never have been ours. If you were trying to reach an order you have already placed, we can open it for you.",
  cta = true,
}: {
  title?: string;
  body?: string;
  /** Off for a reader who has already paid: sending them to buy again is the
   *  wrong offer, and the WhatsApp line below is the only useful next step. */
  cta?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-[640px] px-6 py-16 md:py-24">
      <h1 className="mb-4 font-display text-[clamp(28px,4vw,38px)] font-extrabold leading-[1.1] text-ink-head">
        {title}
      </h1>
      <p className="mb-6 max-w-[46ch] text-[17px] leading-[1.6] text-ink">{body}</p>
      {cta ? (
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-action px-7 py-4 text-[17px] font-bold text-white shadow-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        >
          Go to the pre-order page
        </a>
      ) : null}
      {/* "Or" only reads as a second option when there is a first one. */}
      <p className={`${cta ? "mt-4 " : ""}text-[14px] text-ink-muted`}>
        {cta ? "Or " : ""}
        <a
          href={SUPPORT_WHATSAPP_HREF}
          className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        >
          {cta ? "message us on WhatsApp" : "Message us on WhatsApp"}
        </a>{" "}
        with your order number and a person will find it.
      </p>
    </div>
  );
}
