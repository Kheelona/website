import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/cn";

/** Home S04. Card copy verbatim. R5 rework (founder 2026-07-10): each feeling
 *  lives in its own boxed card (design-system card recipe: white surface,
 *  hairline border, no shadow) instead of the free-standing cast lineup.
 *  The Sad card uses the closest available render (a scared pose); TODO:
 *  swap when the 3D artist provides a true Sad pose. */
const FEELINGS = [
  { name: "Curious", line: "Asks why. Chases ideas. Wants to know what is around the corner.", img: "curious", tick: "bg-blue", alt: "The mascot with wide, curious eyes", iw: 505, ih: 595 },
  { name: "Grumpy", line: "Has opinions. Not always wrong. Needs to be heard, not hushed.", img: "grumpy", tick: "bg-orange", alt: "The mascot frowning with hands on hips", iw: 459, ih: 757 },
  { name: "Sad", line: "Sits with you. Does not rush past. Makes space for the hard moments.", img: "sad", tick: "bg-purple", alt: "The mascot holding its cheeks through a hard moment", iw: 430, ih: 664 },
  { name: "Silly", line: "Cannot sit still. Turns everything into a game. Laughter is learning too.", img: "silly", tick: "bg-yellow", alt: "The mascot laughing with its head thrown back", iw: 468, ih: 649 },
  { name: "Joy", line: "Lights up. Celebrates. Reminds your child that they are wonderful.", img: "joy", tick: "bg-teal", alt: "The mascot dancing with one arm in the air", iw: 513, ih: 696 },
] as const;

export function Feelings() {
  return (
    <Section wash="cool">
      <CurveDivider from="white" flip />
      <Container className="py-16 md:py-20">
        <Reveal>
          <Eyebrow>Meet the feelings</Eyebrow>
          <h2 className="max-w-[18ch] font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
            Learning starts with feeling understood.
          </h2>
          <p className="mb-14 mt-4 max-w-[62ch] text-[clamp(18px,1.6vw,21px)]">
            Lumi knows five feelings. They are the engine behind everything
            your child learns.
          </p>
        </Reveal>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {FEELINGS.map((f, i) => (
            <Reveal as="li" key={f.name} delay={i * 0.07}>
              <TiltCard className="group h-full rounded-(--radius-card) border border-line-soft bg-white p-5">
              <div className="grid h-[150px] place-items-center md:h-[170px]">
                <Image
                  src={`/mascot/mascot-${f.img}.png`}
                  alt={f.alt}
                  width={200}
                  height={Math.round((200 * f.ih) / f.iw)}
                  // rendered ~110-140px wide (height-capped): a real sizes
                  // value keeps phones from pulling the 640w variant
                  sizes="150px"
                  className="max-h-full w-auto object-contain transition-transform duration-300 ease-(--ease-bounce) group-hover:-translate-y-1"
                />
              </div>
              <span aria-hidden="true" className={cn("mt-4 block h-1.5 w-9 rounded-full", f.tick)} />
              <h3 className="mt-3 font-display text-2xl font-extrabold text-ink-head">
                {f.name}
              </h3>
              <p className="mt-1 text-[14.5px] leading-snug text-ink">
                {f.line}
              </p>
              </TiltCard>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
