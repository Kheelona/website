import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

/** Home S06b (founder-requested 2026-07-10): the shop shelf. Three SKUs as
 *  quiet e-commerce cards; every card leads to the Lumi page (there is no
 *  cart pre-launch — the reserve list is the buy). Cutouts from the sanctioned
 *  product pipeline (Design/product-images/generated-2026-07). */
const SKUS = [
  {
    name: "Lumi Green",
    img: "/product/lumi-green.png",
    tint: "bg-teal/15",
    alt: "Lumi Green, the pastel green Lumi plush with a striped party hat",
    w: 1473,
    h: 1954,
  },
  {
    name: "Lumi Pink",
    img: "/product/lumi-pink.png",
    tint: "bg-purple/15",
    alt: "Lumi Pink, the soft pink Lumi plush with a striped party hat",
    w: 617,
    h: 932,
  },
  {
    name: "Lumi Blue",
    img: "/product/lumi-blue.png",
    tint: "bg-blue/15",
    alt: "Lumi Blue, the sky blue Lumi plush with a striped party hat",
    w: 1113,
    h: 1600,
  },
] as const;

export function PickYourLumi() {
  return (
    <Section wash="cream" id="pick-your-lumi">
      <CurveDivider from="white" />
      <Container className="pb-16 pt-6 md:pb-20 md:pt-8">
        <Reveal>
          <Eyebrow>Pick your Lumi</Eyebrow>
          <h2 className="mb-4 max-w-[18ch] font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
            One friend, three colors.
          </h2>
          <p className="mb-10 max-w-[56ch] text-[clamp(18px,1.6vw,21px)]">
            Every Lumi listens, talks, and grows with your child. You just
            pick the color.
          </p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-3">
          {SKUS.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.06}>
              <TiltCard className="h-full">
                <Link
                  href="/products/lumi"
                  aria-label={`${s.name}: see Lumi and reserve at ₹4,999`}
                  className="block h-full overflow-hidden rounded-(--radius-card) border border-line-soft bg-white transition-shadow duration-300 ease-(--ease-calm) hover:shadow-[0_16px_32px_rgba(216,95,27,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                >
                  <div className={`grid h-[250px] place-items-center p-6 ${s.tint}`}>
                    <Image
                      src={s.img}
                      alt={s.alt}
                      width={s.w}
                      height={s.h}
                      sizes="(max-width: 640px) 80vw, 300px"
                      className="h-[200px] w-auto object-contain transition-transform duration-300 ease-(--ease-bounce) group-hover:-translate-y-1"
                    />
                  </div>
                  <div className="flex items-baseline justify-between gap-3 p-6">
                    <h3 className="font-display text-[22px] font-extrabold text-ink-head">
                      {s.name}
                    </h3>
                    <p className="text-[16px] font-bold text-orange-deep">
                      ₹4,999 at launch
                    </p>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-6 text-[15px] text-ink-muted">
            ₹9,999 after launch. No payment now. We hold the price, you hold
            your place.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
