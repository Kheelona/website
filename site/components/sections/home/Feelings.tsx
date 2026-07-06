import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/** Home S04. Card copy verbatim. The Sad card uses the closest available render
 *  (a scared pose); TODO: swap when the 3D artist provides a true Sad pose. */
const FEELINGS = [
  { name: "Curious", line: "Asks why. Chases ideas. Wants to know what is around the corner.", img: "curious", tint: "bg-blue/15", alt: "The mascot with wide, curious eyes" },
  { name: "Grumpy", line: "Has opinions. Not always wrong. Needs to be heard, not hushed.", img: "grumpy", tint: "bg-orange/15", alt: "The mascot frowning with hands on hips" },
  { name: "Sad", line: "Sits with you. Does not rush past. Makes space for the hard moments.", img: "sad", tint: "bg-purple/15", alt: "The mascot holding its cheeks through a hard moment" },
  { name: "Silly", line: "Cannot sit still. Turns everything into a game. Laughter is learning too.", img: "silly", tint: "bg-yellow/15", alt: "The mascot laughing with its head thrown back" },
  { name: "Joy", line: "Lights up. Celebrates. Reminds your child that they are wonderful.", img: "joy", tint: "bg-teal/15", alt: "The mascot dancing with one arm in the air" },
] as const;

export function Feelings() {
  return (
    <Section wash="cool">
      <CurveDivider from="white" />
      <Container className="py-16 md:py-20">
        <Reveal>
          <Eyebrow color="text-blue">Meet the feelings</Eyebrow>
          <h2 className="max-w-[18ch] font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
            Learning starts with feeling understood.
          </h2>
          <p className="mb-12 mt-4 max-w-[62ch] text-[clamp(18px,1.6vw,21px)]">
            Lumi knows five feelings. They are the engine behind everything
            your child learns.
          </p>
        </Reveal>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {FEELINGS.map((f, i) => (
            <Reveal as="li" key={f.name} delay={i * 0.06} className={cn(i % 2 === 0 && "lg:mt-6")}>
              <div
                className={cn(
                  "h-full rounded-(--radius-card) p-5 pb-6 text-center transition-transform duration-300 ease-(--ease-bounce) hover:-translate-y-2",
                  f.tint,
                )}
              >
                <Image
                  src={`/mascot/mascot-${f.img}.png`}
                  alt={f.alt}
                  width={200}
                  height={260}
                  className="mx-auto mb-3 h-[150px] w-auto object-contain"
                />
                <h3 className="mb-2 font-display text-2xl font-extrabold text-ink-head">
                  {f.name}
                </h3>
                <p className="text-[15px] leading-snug text-ink-muted">{f.line}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
