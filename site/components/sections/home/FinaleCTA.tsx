import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Reveal } from "@/components/ui/Reveal";
import { TallyEmbed } from "@/components/ui/TallyEmbed";

/** The conversion finale (Concept C treatment), id="reserve" on every page.
 *  `variant="full"` (Home, Lumi): big headline + character lineup.
 *  `variant="compact"` (other pages): the ask + the form, no spectacle,
 *  so the moment stays a moment (design-review verdict). Copy verbatim.
 *  Body copy is bold ≥19px: white on orange passes WCAG large-text 3:1. */
const LINEUP = [
  { img: "/mascot/mascot-grumpy.png", h: "h-[150px]", mobile: false },
  { img: "/mascot/mascot-hero-wink.png", h: "h-[180px]", mobile: true },
  { img: "/product/lumi-blue.png", h: "h-[165px]", mobile: true },
  { img: "/mascot/mascot-silly.png", h: "h-[160px]", mobile: false },
  { img: "/mascot/mascot-joy.png", h: "h-[175px]", mobile: true },
] as const;

export function FinaleCTA({
  variant = "full",
  from = "white",
}: {
  variant?: "full" | "compact";
  from?: "white" | "cream" | "cool" | "sun";
}) {
  return (
    <Section wash="orange" id="reserve" className="overflow-x-clip">
      <CurveDivider from={from} />
      <Container
        className={variant === "full" ? "pt-10 text-center md:pt-14" : "pb-16 pt-8 text-center md:pb-20"}
      >
        <Reveal>
          <h2
            className={
              variant === "full"
                ? "mx-auto mb-4 max-w-[16ch] font-display text-[clamp(36px,4.6vw,60px)] font-extrabold leading-[1.05] text-white"
                : "mx-auto mb-4 max-w-[22ch] font-display text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.1] text-white"
            }
          >
            Reserve Lumi before the price goes up.
          </h2>
          <p className="mx-auto mb-8 max-w-[50ch] text-[19px] font-semibold text-white md:text-[21px]">
            ₹4,999 launch price. ₹9,999 after launch. No payment now. We hold
            the price, you hold your place.
          </p>
        </Reveal>
        <Reveal className="mx-auto max-w-[680px] text-left">
          <TallyEmbed />
          {/* Founder to confirm wording matches the Tally consent copy. */}
          <p className="mt-3 text-center text-[15px] font-medium text-white">
            Your WhatsApp number is only for updates about your reservation.
            You can leave the list anytime.
          </p>
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
      </Container>
    </Section>
  );
}
