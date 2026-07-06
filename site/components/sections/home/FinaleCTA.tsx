import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";
import { TallyEmbed } from "@/components/ui/TallyEmbed";

/** Home S11, in the approved Concept C treatment: saturated orange finale with
 *  the character lineup along the bottom edge. Carries the inline reserve flow
 *  (id="reserve" is the target of every pre-order CTA). Copy verbatim. */
const LINEUP = [
  { img: "/mascot/mascot-grumpy.png", h: "h-[110px] md:h-[150px]" },
  { img: "/mascot/mascot-hero-wink.png", h: "h-[130px] md:h-[180px]" },
  { img: "/product/lumi-blue.png", h: "h-[120px] md:h-[165px]" },
  { img: "/mascot/mascot-silly.png", h: "h-[120px] md:h-[160px]" },
  { img: "/mascot/mascot-joy.png", h: "h-[130px] md:h-[175px]" },
] as const;

export function FinaleCTA() {
  return (
    <Section wash="orange" id="reserve" className="overflow-x-clip pt-20 md:pt-24">
      <Container className="text-center">
        <Reveal>
          <h2 className="mx-auto mb-4 max-w-[16ch] font-display text-[clamp(36px,4.6vw,60px)] font-extrabold leading-[1.05] text-white">
            Reserve Lumi before the price goes up.
          </h2>
          <p className="mx-auto mb-9 max-w-[50ch] text-[clamp(18px,1.6vw,21px)] text-white/95">
            ₹4,999 launch price. ₹9,999 after launch. No payment now. We hold
            the price, you hold your place.
          </p>
        </Reveal>
        <Reveal className="mx-auto max-w-[680px] text-left">
          <TallyEmbed />
        </Reveal>
        <div
          aria-hidden="true"
          className="mt-14 flex items-end justify-center gap-[4vw]"
        >
          {LINEUP.map((m) => (
            <Image
              key={m.img}
              src={m.img}
              alt=""
              width={200}
              height={280}
              className={`w-auto translate-y-[3px] ${m.h}`}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
