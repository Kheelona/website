import Image from "next/image";
import { notFound } from "next/navigation";
import { storeEnv } from "@/lib/store/env";
import { resolveTier, tierRefusalMessage } from "@/lib/store/tiers";
import { PreorderForm, OrderSummary } from "@/features/preorder";
import { LUMI_ART } from "@/lib/lumi-art";
import {
  formatInr,
  LAUNCH_AMOUNT_PAISE,
  LAUNCH_PRICE,
  SHIP_DATE_TEXT,
  LUMI_AGES,
  SUPPORT_WHATSAPP_HREF,
} from "@/config/site";

/** Event pricing, behind a signed link (§8.25-g).
 *
 *  What a QR code at a stall points at. The signature stops anyone minting a
 *  cheap link by guessing a slug; the cap and the expiry in `event_tiers` are
 *  what contain the leak a signature cannot prevent, because a printed QR code
 *  can be photographed and forwarded to a group chat. The honest security model
 *  is: unguessable, and worthless once the event is over or the allocation is
 *  gone.
 *
 *  The price is read from the database on the server, here and again inside
 *  create-order. The URL carries which event, never how much. */
export const dynamic = "force-dynamic";

export default async function EventPage({
  params,
  searchParams,
}: {
  params: Promise<{ event: string }>;
  searchParams: Promise<{ sig?: string }>;
}) {
  const [{ event }, { sig }] = await Promise.all([params, searchParams]);
  const env = storeEnv();
  if (!env) notFound();

  const result = await resolveTier(env, { tier: event, signature: sig ?? null });

  if (!result.ok) {
    return (
      <div className="mx-auto w-full max-w-[640px] px-6 py-16 md:py-24">
        <h1 className="mb-4 font-display text-[clamp(28px,4vw,38px)] font-extrabold leading-[1.1] text-ink-head">
          That link will not work.
        </h1>
        <p className="mb-6 text-[17px] leading-[1.6] text-ink">
          {tierRefusalMessage(result.reason)}
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-action px-7 py-4 text-[17px] font-bold text-white shadow-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        >
          Pre-order at the usual price
        </a>
        <p className="mt-4 text-[14px] text-ink-muted">
          Or{" "}
          <a href={SUPPORT_WHATSAPP_HREF} className="font-semibold text-ink-head underline underline-offset-4">
            message us on WhatsApp
          </a>{" "}
          and a person will sort it out with you.
        </p>
      </div>
    );
  }

  const amountLabel = formatInr(result.tier.amountPaise);
  /* What the ₹4,999 price still needs after THIS token, so a ₹99 event booking
     honestly reads ₹4,900 rather than the public ₹4,500 (2026-08-23). */
  const balanceLabel = formatInr(Math.max(0, LAUNCH_AMOUNT_PAISE - result.tier.amountPaise));

  return (
    <div className="mx-auto grid w-full max-w-[1100px] gap-10 px-6 py-10 md:grid-cols-[1fr_420px] md:py-14">
      <div>
        <div className="mb-6 flex items-start gap-5">
          <div>
            <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-orange-ink">
              {result.tier.label}
            </p>
            <h1 className="max-w-[20ch] font-display text-[clamp(30px,4vw,44px)] font-extrabold leading-[1.08] text-ink-head">
              Reserve Lumi for {amountLabel}.
            </h1>
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

        <p className="mb-8 max-w-[52ch] text-[17px] leading-[1.6] text-ink">
          A screen-free talking friend for ages {LUMI_AGES}. {amountLabel} today
          holds one at {LAUNCH_PRICE}, ships {SHIP_DATE_TEXT}, and is refundable
          in full until it does.
        </p>

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
