import Image from "next/image";
import { storeEnv } from "@/lib/store/env";
import { launchTier, fullTier } from "@/lib/store/tiers";
import { preorderMode } from "@/lib/store/mode";
import { PreorderForm, OrderSummary } from "@/features/preorder";
import { KHEELU_ART } from "@/lib/kheelu-art";
import { VideoMoments } from "@/components/organisms/VideoMoments";
import { VIDEO_MOMENTS, hasVideoMoments, videoLede } from "@/lib/video-moments";
import {
  formatInr,
  FULL_PRICE,
  TOKEN_PRICE,
  SUPPORT_WHATSAPP_HREF,
  KHEELU_AGES,
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
    {/* Redesign 2026-10: the mockup's single reserve column. The summary now
        sits ABOVE the form, so on a phone the refund promise, the balance and
        the ship date are read before a parent types anything, which undoes
        the cost recorded in the header comment above. */}
    <div className="mx-auto flex w-full max-w-[620px] flex-col gap-[22px] px-5 pb-16 pt-7 md:pt-12">
      <div>
        <p className="kh-kicker mb-2">Pre-order</p>
        <h1 className="kh-h2">
          {mode === "token"
            ? `Reserve Kheelu for ${TOKEN_PRICE}.`
            : `Pre-order Kheelu for ${FULL_PRICE}.`}
        </h1>
      </div>

      <div className="flex items-center gap-4 rounded-[22px] border border-line bg-surface p-[22px]">
        {/* Small on purpose: the form is what this page is for. The image is
            here to reassure, not to sell again. */}
        <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-blush">
          <Image
            src={KHEELU_ART.src}
            alt={KHEELU_ART.alt}
            width={KHEELU_ART.width}
            height={KHEELU_ART.height}
            priority
            sizes="96px"
            className="h-[84px] w-auto"
          />
        </span>
        <div className="flex flex-col gap-1">
          <b className="text-[18px] text-ink-head">Kheelu, cream</b>
          <span className="kh-note">The screen-free AI toy, ages {KHEELU_AGES}</span>
        </div>
      </div>

      <OrderSummary
        amountLabel={formatInr(tier.amountPaise)}
        tierLabel={tier.label}
        mode={mode}
      />

      <div>
        <h2 className="mb-4 font-display text-[22px] font-semibold text-ink-head">Your details</h2>
        <PreorderForm
          tier={tier.id}
          amountLabel={formatInr(tier.amountPaise)}
          mode={mode}
        />
      </div>
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
      <section className="border-t border-line bg-surface py-[52px] md:py-[84px]">
      <div className="kh-wrap">
        <h2 className="mb-2 font-display text-[clamp(22px,2.6vw,30px)] font-semibold leading-tight text-ink-head">
          Families already using Kheelu.
        </h2>
        <p className="mb-8 max-w-[52ch] text-[16px] leading-relaxed text-ink">
          {videoLede()}
        </p>
        <VideoMoments moments={VIDEO_MOMENTS} />
      </div>
      </section>
    )}
    </>
  );
}

function NotConfiguredState() {
  return (
    <div className="mx-auto w-full max-w-[640px] px-6 py-16 md:py-24">
      <h1 className="mb-4 font-display text-[clamp(30px,4vw,42px)] font-semibold leading-[1.1] text-ink-head">
        Pre-orders open here shortly.
      </h1>
      <p className="mb-6 text-[17px] leading-[1.6] text-ink">
        Our store is not switched on yet. Nothing is wrong at your end, and
        nothing has been charged.
      </p>
      <a
        href={SUPPORT_WHATSAPP_HREF}
        className="inline-flex items-center justify-center rounded-full min-h-[52px] bg-action px-6 text-[17px] font-semibold text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
      >
        Message us on WhatsApp
      </a>
      <p className="mt-4 text-[14px] text-ink-muted">
        We will reserve one for you by hand in the meantime.
      </p>
    </div>
  );
}
