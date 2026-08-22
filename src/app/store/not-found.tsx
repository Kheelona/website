import { SUPPORT_WHATSAPP_HREF } from "@/config/site";

/** The store's own 404 (§8.25-z).
 *
 *  Without this, `notFound()` from a store page would find the root not-found,
 *  which wears the full marketing chrome: a navbar whose CTA points at
 *  `#reserve`, an anchor the store host has no page for. A dead end inside a
 *  dead end.
 *
 *  It is reached by an expired or wrong address link as well as a mistyped URL,
 *  which is why it offers a person rather than only a link home: someone here
 *  may have paid us and be unable to reach their own order. */
export default function StoreNotFound() {
  return (
    <div className="mx-auto w-full max-w-[640px] px-6 py-16 md:py-24">
      <h1 className="mb-4 font-display text-[clamp(28px,4vw,38px)] font-extrabold leading-[1.1] text-ink-head">
        That page is not here.
      </h1>
      <p className="mb-6 max-w-[46ch] text-[17px] leading-[1.6] text-ink">
        The link may have expired, or it may never have been ours. If you were
        trying to reach an order you have already placed, we can open it for you.
      </p>
      <a
        href="/"
        className="inline-flex items-center justify-center rounded-full bg-action px-7 py-4 text-[17px] font-bold text-ink-head shadow-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
      >
        Go to the pre-order page
      </a>
      <p className="mt-4 text-[14px] text-ink-muted">
        Or{" "}
        <a
          href={SUPPORT_WHATSAPP_HREF}
          className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        >
          message us on WhatsApp
        </a>{" "}
        with your order number and a person will find it.
      </p>
    </div>
  );
}
