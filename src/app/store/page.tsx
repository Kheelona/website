import Image from "next/image";
import { storeEnv } from "@/lib/store/env";
import { launchTier, fullTier } from "@/lib/store/tiers";
import { preorderMode } from "@/lib/store/mode";
import { PreorderForm, OrderSummary } from "@/features/preorder";
import { KHEELU_ART } from "@/lib/kheelu-art";
import { VideoMoments } from "@/components/organisms/VideoMoments";
import { VIDEO_MOMENTS, hasVideoMoments } from "@/lib/video-moments";
import {
  formatInr,
  FULL_PRICE,
  TOKEN_PRICE,
  SUPPORT_WHATSAPP_HREF,
} from "@/config/site";

/** store.kheelona.com (§8.25-w, mode-gated since §8.26).
 *
 *  Three states, all real, none of them a stack trace:
 *
 *   1. TOKEN MODE: fewer than the capped units are paid, so ₹499 reserves one
 *      at the pre-order price. The price panel and the form. This is the page.
 *   2. FULL MODE: the capped units are gone. Same page, same form, but the
 *      offer is the launch price paid once, upfront. There is no "closed"
 *      state any more — the store always sells at SOME price, decided here on
 *      the server from the live count (never by the client, §8.25-c-i).
 *   3. NOT CONFIGURED: deployed before the keys are in the dashboard. Says
 *      "shortly" rather than failing, which is what let this ship before the
 *      founder had finished with Razorpay.
 *
 *  Rendered on the server, form and all, so the price a parent reads is in the
 *  HTML rather than assembled by a script that might not run.
 *
 *  NO PROSE PARAGRAPH, BY FOUNDER DECISION (2026-08-24). This page used to
 *  carry a mode-aware paragraph under the heading ("A screen-free talking
 *  friend for ages 3+. ₹499 holds one of the first 500 units at ₹4,999 ...").
 *  It was removed with its twin on /store/ideabaaz. Do not restore it as a
 *  fix: §8.25-b used to cite it by name as the reason one-tap CTAs are safe,
 *  and that section now records where the three facts live instead — the price
 *  in the h1, the refund promise in PreorderForm's line under the submit
 *  button, and all four including the ship date in OrderSummary. On a phone
 *  OrderSummary stacks BELOW the form, so the ship date is now first read
 *  after it rather than before. That is the known cost of this decision. */
export const dynamic = "force-dynamic";

export default async function StorePage() {
  const env = storeEnv();
  if (!env) return <NotConfiguredState />;

  const mode = await preorderMode(env);
  const tier = mode === "token" ? launchTier() : fullTier();

  return (
    <>
    <div className="mx-auto grid w-full max-w-[1100px] gap-10 px-6 py-10 md:grid-cols-[1fr_420px] md:py-14">
      <div>
        <div className="mb-6 flex items-start gap-5">
          <div>
            <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-orange-ink">
              Pre-order
            </p>
            <h1 className="max-w-[20ch] font-display text-[clamp(30px,4vw,44px)] font-extrabold leading-[1.08] text-ink-head">
              {mode === "token"
                ? `Reserve Kheelu for ${TOKEN_PRICE}.`
                : `Pre-order Kheelu for ${FULL_PRICE}.`}
            </h1>
          </div>
          {/* Small on purpose: the form is what this page is for, and a full
              hero plush would push it below the fold on a phone. The image is
              here to reassure, not to sell again. */}
          <Image
            src={KHEELU_ART.src}
            alt={KHEELU_ART.alt}
            width={KHEELU_ART.width}
            height={KHEELU_ART.height}
            priority
            sizes="(max-width: 768px) 30vw, 200px"
            className="h-[120px] w-auto shrink-0 md:h-[180px]"
          />
        </div>

        <div className="max-w-[520px]">
          <PreorderForm
            tier={tier.id}
            amountLabel={formatInr(tier.amountPaise)}
            mode={mode}
          />
        </div>
      </div>

      <aside className="md:sticky md:top-6 md:self-start md:pt-2">
        <OrderSummary
          amountLabel={formatInr(tier.amountPaise)}
          tierLabel={tier.label}
          mode={mode}
        />
      </aside>
    </div>

    {/* Real families on film (§8.37).

        BELOW THE WHOLE GRID, not under the form, and the reason is this
        page's own mobile stacking. The header above records that removing
        the prose paragraph left OrderSummary below the form on a phone, so
        the ship date is already "first read after the form". Dropping a
        video carousel between them would push the refund promise, the
        balance due and the ship date beneath it, on the page that takes
        money. Here the desktop result is what was asked for and the phone
        order stays heading, form, summary, films.

        Nothing in this section can reach the payment path: it takes no
        props from the tier, renders no price, and mounts no <video> until
        a visitor asks for one. */}
    {hasVideoMoments() && (
      <section className="mx-auto w-full max-w-[1100px] border-t border-line px-6 py-10 md:py-14">
        <h2 className="mb-2 font-display text-[clamp(22px,2.6vw,30px)] font-extrabold leading-tight text-ink-head">
          Families already using Kheelu.
        </h2>
        <p className="mb-8 max-w-[52ch] text-[16px] leading-relaxed text-ink">
          Real children in real homes. Press play on any of them.
        </p>
        <VideoMoments moments={VIDEO_MOMENTS} />
      </section>
    )}
    </>
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
        className="inline-flex items-center justify-center rounded-full bg-action px-7 py-4 text-[17px] font-bold text-white shadow-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
      >
        Message us on WhatsApp
      </a>
      <p className="mt-4 text-[14px] text-ink-muted">
        We will reserve one for you by hand in the meantime.
      </p>
    </div>
  );
}
