import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/** Home S04. Card copy verbatim. Visual rework (2026-07-07): the five
 *  feelings stand together on one soft ground as a cast lineup, with a color
 *  tick per feeling, instead of five identical tinted cards. The Sad card
 *  uses the closest available render (a scared pose); TODO: swap when the 3D
 *  artist provides a true Sad pose. */
const FEELINGS = [
  { name: "Curious", line: "Asks why. Chases ideas. Wants to know what is around the corner.", img: "curious", tick: "bg-blue", alt: "The mascot with wide, curious eyes", h: "h-[130px] md:h-[150px]", lift: "md:mb-2", iw: 505, ih: 595 },
  { name: "Grumpy", line: "Has opinions. Not always wrong. Needs to be heard, not hushed.", img: "grumpy", tick: "bg-orange", alt: "The mascot frowning with hands on hips", h: "h-[150px] md:h-[178px]", lift: "md:mb-8", iw: 459, ih: 757 },
  { name: "Sad", line: "Sits with you. Does not rush past. Makes space for the hard moments.", img: "sad", tick: "bg-purple", alt: "The mascot holding its cheeks through a hard moment", h: "h-[140px] md:h-[164px]", lift: "md:mb-0", iw: 430, ih: 664 },
  { name: "Silly", line: "Cannot sit still. Turns everything into a game. Laughter is learning too.", img: "silly", tick: "bg-yellow", alt: "The mascot laughing with its head thrown back", h: "h-[150px] md:h-[172px]", lift: "md:mb-10", iw: 468, ih: 649 },
  { name: "Joy", line: "Lights up. Celebrates. Reminds your child that they are wonderful.", img: "joy", tick: "bg-teal", alt: "The mascot dancing with one arm in the air", h: "h-[155px] md:h-[186px]", lift: "md:mb-4", iw: 513, ih: 696 },
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
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-x-[6%] bottom-[86px] hidden h-[90px] rounded-[50%] bg-[radial-gradient(ellipse,rgba(41,160,215,0.14)_0%,transparent_70%)] md:block"
          />
          <ul className="relative grid grid-cols-2 items-end gap-x-4 gap-y-12 sm:grid-cols-3 md:flex md:items-end md:justify-between md:gap-2">
            {FEELINGS.map((f, i) => (
              <Reveal
                as="li"
                key={f.name}
                delay={i * 0.07}
                className={cn("group text-center md:flex-1", f.lift)}
              >
                <Image
                  src={`/mascot/mascot-${f.img}.png`}
                  alt={f.alt}
                  width={200}
                  height={Math.round((200 * f.ih) / f.iw)}
                  // rendered ~110-140px wide (height-capped): a real sizes
                  // value keeps phones from pulling the 640w variant
                  sizes="150px"
                  className={cn(
                    "mx-auto w-auto object-contain drop-shadow-[0_14px_18px_rgba(41,160,215,0.18)] transition-transform duration-300 ease-(--ease-bounce) group-hover:-translate-y-2",
                    f.h,
                  )}
                />
                <span aria-hidden="true" className={cn("mx-auto mt-5 block h-1.5 w-9 rounded-full", f.tick)} />
                <h3 className="mt-3 font-display text-2xl font-extrabold text-ink-head">
                  {f.name}
                </h3>
                <p className="mx-auto mt-1 max-w-[24ch] text-[14.5px] leading-snug text-ink">
                  {f.line}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
