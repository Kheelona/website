import Image from "next/image";
import { storeReady } from "@/lib/store/env";
import { launchTier } from "@/lib/store/tiers";
import { PreorderForm, OrderSummary } from "@/features/preorder";
import {
  isPreorderOpen,
  formatInr,
  LAUNCH_PRICE,
  LATER_PRICE,
  TOKEN_PRICE,
  PREORDER_DEADLINE_TEXT,
  SHIP_DATE_TEXT,
  LUMI_AGES,
  SUPPORT_WHATSAPP_HREF,
} from "@/config/site";

/** store.kheelona.com (§8.25-w).
 *
 *  Three states, all real, none of them a stack trace:
 *
 *   1. OPEN: the price panel and the form. This is the page.
 *   2. CLOSED, past the deadline: the pre-order price no longer exists, so the
 *      page says so and offers the one honest next step. There is no "notify me"
 *      box, because a box that only pretends to save an address would be the
 *      dishonest option: WhatsApp reaches a person who will actually answer.
 *   3. NOT CONFIGURED: deployed before the keys are in the dashboard. Says
 *      "shortly" rather than failing, which is what let this ship before the
 *      founder had finished with Razorpay.
 *
 *  Rendered on the server, form and all, so the price a parent reads is in the
 *  HTML rather than assembled by a script that might not run. */
export const dynamic = "force-dynamic";

export default function StorePage() {
  const open = isPreorderOpen();
  const ready = storeReady();
  const tier = launchTier();

  if (!open) return <ClosedState />;
  if (!ready) return <NotConfiguredState />;

  return (
    <div className="mx-auto grid w-full max-w-[1100px] gap-10 px-6 py-10 md:grid-cols-[1fr_420px] md:py-14">
      <div>
        <div className="mb-6 flex items-start gap-5">
          <div>
            <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-orange-ink">
              Pre-order
            </p>
            <h1 className="max-w-[20ch] font-display text-[clamp(30px,4vw,44px)] font-extrabold leading-[1.08] text-ink-head">
              Reserve Lumi for {TOKEN_PRICE}.
            </h1>
          </div>
          {/* Small on purpose: the form is what this page is for, and a full
              hero plush would push it below the fold on a phone. The image is
              here to reassure, not to sell again. */}
          <Image
            src="/product/lumi-blue-2.png"
            alt="Lumi, the sky blue talking plush with a speaker in its tummy and a striped party hat"
            width={1234}
            height={1600}
            priority
            sizes="(max-width: 768px) 30vw, 200px"
            className="h-[120px] w-auto shrink-0 md:h-[180px]"
          />
        </div>

        <p className="mb-8 max-w-[52ch] text-[17px] leading-[1.6] text-ink">
          A screen-free talking friend for ages {LUMI_AGES}. {TOKEN_PRICE} holds
          one at {LAUNCH_PRICE} and holds your place in the queue. Ships{" "}
          {SHIP_DATE_TEXT}, and refundable in full until it does.
        </p>

        <div className="max-w-[520px]">
          <PreorderForm tier={tier.id} amountLabel={formatInr(tier.amountPaise)} />
        </div>
      </div>

      <aside className="md:sticky md:top-6 md:self-start md:pt-2">
        <OrderSummary amountLabel={formatInr(tier.amountPaise)} tierLabel={tier.label} />
      </aside>
    </div>
  );
}

function ClosedState() {
  return (
    <div className="mx-auto w-full max-w-[640px] px-6 py-16 md:py-24">
      <h1 className="mb-4 font-display text-[clamp(30px,4vw,42px)] font-extrabold leading-[1.1] text-ink-head">
        Pre-order pricing has closed.
      </h1>
      <p className="mb-6 text-[17px] leading-[1.6] text-ink">
        The {LAUNCH_PRICE} price was for pre-orders placed before{" "}
        {PREORDER_DEADLINE_TEXT}. Lumi goes on general sale at {LATER_PRICE}, and
        we would rather tell you the day it does than take money for a queue that
        no longer exists.
      </p>
      <a
        href={SUPPORT_WHATSAPP_HREF}
        className="inline-flex items-center justify-center rounded-full bg-action px-7 py-4 text-[17px] font-bold text-ink-head shadow-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
      >
        Message us on WhatsApp
      </a>
      <p className="mt-4 text-[14px] text-ink-muted">
        A person answers, and we will tell you the moment Lumi is on sale.
      </p>
    </div>
  );
}

function NotConfiguredState() {
  return (
    <div className="mx-auto w-full max-w-[640px] px-6 py-16 md:py-24">
      <h1 className="mb-4 font-display text-[clamp(30px,4vw,42px)] font-extrabold leading-[1.1] text-ink-head">
        Pre-orders open here shortly.
      </h1>
      <p className="mb-6 text-[17px] leading-[1.6] text-ink">
        Our store is not switched on yet. Nothing is wrong at your end, and
        nothing has been charged.
      </p>
      <a
        href={SUPPORT_WHATSAPP_HREF}
        className="inline-flex items-center justify-center rounded-full bg-action px-7 py-4 text-[17px] font-bold text-ink-head shadow-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
      >
        Message us on WhatsApp
      </a>
      <p className="mt-4 text-[14px] text-ink-muted">
        We will reserve one for you by hand in the meantime.
      </p>
    </div>
  );
}
