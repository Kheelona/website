import Image from "next/image";
import type { Metadata } from "next";
import { storeEnv } from "@/lib/store/env";
import { sign } from "@/lib/store/signing";
import { resolveTier } from "@/lib/store/tiers";
import { PreorderForm, OrderSummary } from "@/features/preorder";
import { LUMI_ART } from "@/lib/lumi-art";
import {
  formatInr,
  LAUNCH_AMOUNT_PAISE,
  TOKEN_PRICE,
  SUPPORT_WHATSAPP_HREF,
} from "@/config/site";

/** The Ideabaaz Startup Fest page (§8.25-g, public-partner form).
 *
 *  A QR at a stall carries its signature in the URL; a partner page IS the
 *  link, so it signs its own tier here on the server and hands the signature
 *  to the form. That is a deliberate downgrade the founder chose with eyes
 *  open (2026-08-23): the page is exactly as public as a QR photographed into
 *  a group chat, which the event model already tolerates, and what contains it
 *  is the same pair as ever, the tier's expiry (31 August 2026) plus the
 *  founder's manual close, inside the global 500-unit count. The URL is shared
 *  by hand at the fest and referenced nowhere on the site; the store host is
 *  noindex besides.
 *
 *  Everything priced still happens server-side: `create-order` re-resolves the
 *  tier and reads the amount from `event_tiers`, so this page can only ever
 *  change sentences, never charges (§8.25-c-i). */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ideabaaz exclusive pre-order",
};

const IDEABAAZ_TIER = "ideabaaz";

export default async function IdeabaazPage() {
  const env = storeEnv();
  if (!env) {
    return (
      <Ended
        title="This page is not open yet."
        message="Our store is not switched on yet. Nothing is wrong at your end, and nothing has been charged."
      />
    );
  }

  const sig = sign(env.signingSecret, "event-link", IDEABAAZ_TIER);
  const result = await resolveTier(env, { tier: IDEABAAZ_TIER, signature: sig });

  if (!result.ok) {
    return (
      <Ended
        message={
          result.reason === "full"
            ? "The Ideabaaz allocation has all gone. You can still pre-order Lumi at the usual price."
            : "This price was for the Ideabaaz Startup Fest window, which has closed. You can still pre-order Lumi at the usual price."
        }
      />
    );
  }

  const amountLabel = formatInr(result.tier.amountPaise);
  /* What the ₹4,999 price still needs after this token: a ₹99 booking honestly
     reads ₹4,900, never the public ₹4,500. */
  const balanceLabel = formatInr(Math.max(0, LAUNCH_AMOUNT_PAISE - result.tier.amountPaise));

  return (
    <div className="mx-auto grid w-full max-w-[1100px] gap-10 px-6 py-10 md:grid-cols-[1fr_420px] md:py-14">
      <div>
        <div className="mb-6 flex items-start gap-5">
          <div>
            <PartnerChip className="mb-5" />
            <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-orange-ink">
              Exclusive for the Ideabaaz audience
            </p>
            <h1 className="max-w-[22ch] font-display text-[clamp(30px,4vw,44px)] font-extrabold leading-[1.08] text-ink-head">
              Reserve Lumi for{" "}
              <s aria-hidden="true" className="font-bold text-ink-muted decoration-[0.09em]">
                {TOKEN_PRICE}
              </s>{" "}
              {amountLabel}.
              <span className="sr-only">
                {" "}
                The usual booking price is {TOKEN_PRICE}.
              </span>
            </h1>
            <p className="mt-3 text-[16px] leading-[1.5] text-ink">
              The exclusive booking price for the Ideabaaz Startup Fest
              audience, until 31 August.
            </p>
          </div>
          <Image
            src={LUMI_ART.src}
            alt={LUMI_ART.alt}
            width={LUMI_ART.width}
            height={LUMI_ART.height}
            priority
            sizes="(max-width: 768px) 30vw, 200px"
            className="h-[120px] w-auto shrink-0 md:h-[180px]"
          />
        </div>

        <div className="max-w-[520px]">
          {/* Always the token shape, whatever the public mode is: an event
              token is a token, with the same balance-before-dispatch terms. */}
          <PreorderForm
            tier={result.tier.id}
            signature={sig}
            amountLabel={amountLabel}
            mode="token"
            balanceLabel={balanceLabel}
          />
        </div>
      </div>

      <aside className="md:sticky md:top-6 md:self-start md:pt-2">
        <OrderSummary
          amountLabel={amountLabel}
          tierLabel={result.tier.label}
          mode="token"
          balanceLabel={balanceLabel}
        />
      </aside>
    </div>
  );
}

/** The fest lockup as it appears on the launch posts: white lettering on its
 *  own black plate, so the plate is the chip. Never recolored (partner mark). */
function PartnerChip({ className }: { className?: string }) {
  return (
    <Image
      src="/partners/ideabaaz-startup-fest.png"
      alt="Ideabaaz Startup Fest"
      width={270}
      height={148}
      priority
      className={`h-[52px] w-auto rounded-[10px] ${className ?? ""}`}
    />
  );
}

/** Every not-for-sale state of this page: tier expired or closed by hand,
 *  allocation gone, or a deployment without store keys. Honest words plus the
 *  two ways forward, exactly like the signed event page's refusal. */
function Ended({
  title = "The Ideabaaz exclusive has ended.",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[640px] px-6 py-16 md:py-24">
      <PartnerChip className="mb-6" />
      <h1 className="mb-4 font-display text-[clamp(28px,4vw,38px)] font-extrabold leading-[1.1] text-ink-head">
        {title}
      </h1>
      <p className="mb-6 text-[17px] leading-[1.6] text-ink">{message}</p>
      <a
        href="/"
        className="inline-flex items-center justify-center rounded-full bg-action px-7 py-4 text-[17px] font-bold text-white shadow-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
      >
        Pre-order at the usual price
      </a>
      <p className="mt-4 text-[14px] text-ink-muted">
        Or{" "}
        <a
          href={SUPPORT_WHATSAPP_HREF}
          className="font-semibold text-ink-head underline underline-offset-4"
        >
          message us on WhatsApp
        </a>{" "}
        and a person will sort it out with you.
      </p>
    </div>
  );
}
