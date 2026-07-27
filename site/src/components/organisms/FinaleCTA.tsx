import Image from "next/image";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { TallyEmbed } from "@/components/molecules/TallyEmbed";
import {
  LAUNCH_PRICE,
  LATER_PRICE,
  KHEELONA_PLUS_SHORT,
  WHATSAPP_SHARE_HREF,
  WHATSAPP_SHARE_LABEL,
} from "@/config/site";

/** The conversion finale (Concept C treatment), id="reserve" on every page.
 *  `variant="full"` (Home, Lumi): big headline + lineup.
 *  `variant="compact"` (other pages): the ask + the form, no spectacle,
 *  so the moment stays a moment (design-review verdict). Copy verbatim
 *  except the R9 cap line (founder-supplied "first 500 units").
 *  R9 lineup is product-forward (reviewer: "4 squirrels and 1 dino" read as
 *  brand confusion): the three Lumi SKUs center-stage, Blue tallest, Kheelu
 *  celebrating at the edges. `kheeluLine` mounts the narrator bubble —
 *  Home passes it; other pages keep their single Kheelu moment elsewhere.
 *  Contrast (R5): the band is orange-cta (#C25210, white 4.66:1), so every
 *  line here can be white at any size, including the 15px consent print. */
const LINEUP = [
  { img: "/mascot/mascot-joy.png", h: "h-[145px]", mobile: false },
  { img: "/product/lumi-green-2.png", h: "h-[160px]", mobile: true },
  { img: "/product/lumi-blue-2.png", h: "h-[180px]", mobile: true },
  { img: "/product/lumi-pink-2.png", h: "h-[160px]", mobile: true },
  { img: "/mascot/mascot-silly.png", h: "h-[145px]", mobile: false },
] as const;

export function FinaleCTA({
  variant = "full",
  bare = false,
  share = true,
}: {
  variant?: "full" | "compact";
  /** Revamp M2: content-only, for composition inside a Room fill="orange"
   *  (the Room then owns id="reserve" and the white-text paint). */
  bare?: boolean;
  /** V3: the WhatsApp share line under the consent print. */
  share?: boolean;
}) {
  const content = (
    <>
      <Reveal>
          <h2
            className={
              variant === "full"
                ? "mb-4 max-w-[16ch] font-display text-[clamp(36px,4.6vw,60px)] font-extrabold leading-[1.05] text-white"
                : "mb-4 max-w-[22ch] font-display text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.1] text-white"
            }
          >
            Reserve Lumi before the price goes up.
          </h2>
          <p className="mb-8 max-w-[50ch] text-[19px] font-bold text-white md:text-[21px]">
            {LAUNCH_PRICE} for the first 500 units. {LATER_PRICE} after
            launch. No payment now. We hold the price, you hold your place.
          </p>
        </Reveal>
        <Reveal className="max-w-[680px] text-left">
          {/* V3: the deal on the subscription, said before the form and not
              after the purchase (gate V3-b keeps the price out) */}
          <p className="mb-4 text-[15px] font-medium text-white">
            {KHEELONA_PLUS_SHORT}
          </p>
          <TallyEmbed />
          {/* Founder to confirm wording matches the Tally consent copy. */}
          <p className="mt-3 text-[15px] font-medium text-white">
            Your WhatsApp number is only for updates about your reservation.
            You can leave the list anytime.
          </p>
          {/* V3: the one growth loop a pre-launch site can honestly run —
              WhatsApp is where Indian parents already pass things along, and it
              needs no backend, no counter, and no invented numbers. */}
          {share && (
            <p className="mt-5 text-[15px] font-medium text-white">
              <a
                href={WHATSAPP_SHARE_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                {WHATSAPP_SHARE_LABEL}
              </a>
            </p>
          )}
        </Reveal>
      {variant === "full" && (
        <div
          aria-hidden="true"
          className="mt-12 flex items-end justify-center gap-[5vw] md:gap-[4vw]"
        >
          {LINEUP.map((m) => (
            <Image
              key={m.img}
              src={m.img}
              alt=""
              width={200}
              height={280}
              className={`w-auto translate-y-[3px] ${m.h} ${m.mobile ? "" : "hidden sm:block"}`}
            />
          ))}
        </div>
      )}
    </>
  );

  if (bare) return content;

  return (
    <Section wash="orange" id="reserve" className="overflow-x-clip">
      <Container
        className={variant === "full" ? "pt-10 md:pt-14" : "pb-16 pt-8 md:pb-20"}
      >
        {content}
      </Container>
    </Section>
  );
}
