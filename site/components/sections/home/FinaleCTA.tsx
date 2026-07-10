import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Reveal } from "@/components/ui/Reveal";
import { KheeluSays } from "@/components/ui/KheeluSays";
import { TallyEmbed } from "@/components/ui/TallyEmbed";

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
  { img: "/product/lumi-green.png", h: "h-[160px]", mobile: true },
  { img: "/product/lumi-blue.png", h: "h-[180px]", mobile: true },
  { img: "/product/lumi-pink.png", h: "h-[160px]", mobile: true },
  { img: "/mascot/mascot-silly.png", h: "h-[145px]", mobile: false },
] as const;

export function FinaleCTA({
  variant = "full",
  from = "white",
  kheeluLine,
}: {
  variant?: "full" | "compact";
  from?: "white" | "cream" | "cool" | "sun";
  kheeluLine?: string;
}) {
  return (
    <Section wash="orange" id="reserve" className="overflow-x-clip">
      <CurveDivider from={from} />
      <Container
        className={variant === "full" ? "pt-10 md:pt-14" : "pb-16 pt-8 md:pb-20"}
      >
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
            ₹4,999 for the first 500 units. ₹9,999 after launch. No payment
            now. We hold the price, you hold your place.
          </p>
        </Reveal>
        {kheeluLine && <KheeluSays line={kheeluLine} className="mb-2" />}
        <Reveal className="max-w-[680px] text-left">
          <TallyEmbed />
          {/* Founder to confirm wording matches the Tally consent copy. */}
          <p className="mt-3 text-[15px] font-medium text-white">
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
