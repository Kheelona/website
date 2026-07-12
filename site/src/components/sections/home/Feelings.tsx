import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { KheeluSays } from "@/components/ui/KheeluSays";
import { cn } from "@/lib/cn";

/** Home S04. Card copy verbatim. R5 rework (founder 2026-07-10): each feeling
 *  lives in its own boxed card (design-system card recipe: white surface,
 *  hairline border, no shadow) instead of the free-standing cast lineup.
 *  R8 (founder): per-feeling 15% tints (the /products/lumi recipe) and one
 *  exact render height for every pose so the row reads in sync.
 *  R9 re-map (founder: no new art, truest labels): Sad now uses the serene
 *  eyes-closed render — it reads "sits with you, makes space", where the old
 *  scared pose read panic (reviewer finding). The scared render moved to the
 *  narrator bubble above ("I will act them out for you"). Kheelu is named in
 *  every alt (reviewer: the mascot was mistaken for the product). */
const FEELINGS = [
  { name: "Curious", card: "bg-blue/15", line: "Asks why. Chases ideas. Wants to know what is around the corner.", img: "curious", tick: "bg-blue", alt: "Kheelu sitting with wide, curious eyes behind his glasses", iw: 505, ih: 595 },
  { name: "Grumpy", card: "bg-orange/15", line: "Has opinions. Not always wrong. Needs to be heard, not hushed.", img: "grumpy", tick: "bg-orange", alt: "Kheelu frowning with his fists on his hips", iw: 459, ih: 757 },
  { name: "Sad", card: "bg-purple/15", line: "Sits with you. Does not rush past. Makes space for the hard moments.", img: "bliss", tick: "bg-purple", alt: "Kheelu standing quietly with his eyes closed", iw: 423, ih: 726 },
  { name: "Silly", card: "bg-yellow/15", line: "Cannot sit still. Turns everything into a game. Laughter is learning too.", img: "silly", tick: "bg-yellow", alt: "Kheelu laughing with his head thrown back", iw: 468, ih: 649 },
  { name: "Joy", card: "bg-teal/15", line: "Lights up. Celebrates. Reminds your child that they are wonderful.", img: "joy", tick: "bg-teal", alt: "Kheelu dancing with one arm in the air", iw: 513, ih: 696 },
] as const;

export function Feelings() {
  return (
    <Section wash="cool">
      <CurveDivider from="white" flip />
      <Container className="py-16 md:py-20">
        <Reveal>
          <KheeluSays
            line="These are the five feelings Lumi understands. I will act them out for you."
            pose="sad"
          />
          <SectionHeading
            eyebrow="Meet the feelings"
            title="Learning starts with feeling understood."
            titleClassName="max-w-[18ch]"
            lede="Lumi knows five feelings. They are the engine behind everything your child learns."
            ledeClassName="mb-14 mt-4 max-w-[62ch]"
          />
        </Reveal>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {FEELINGS.map((f, i) => (
            <Reveal as="li" key={f.name} delay={i * 0.07}>
              <Card className={cn("group border border-line-soft p-5", f.card)}>
              <div className="grid h-[150px] place-items-center md:h-[165px]">
                <Image
                  src={`/mascot/mascot-${f.img}.png`}
                  alt={f.alt}
                  width={200}
                  height={Math.round((200 * f.ih) / f.iw)}
                  // rendered ~110-140px wide (height-capped): a real sizes
                  // value keeps phones from pulling the 640w variant
                  sizes="150px"
                  className="h-[130px] w-auto object-contain transition-transform duration-300 ease-(--ease-bounce) group-hover:-translate-y-1 md:h-[145px]"
                />
              </div>
              <span aria-hidden="true" className={cn("mt-4 block h-1.5 w-9 rounded-full", f.tick)} />
              <h3 className="mt-3 font-display text-2xl font-extrabold text-ink-head">
                {f.name}
              </h3>
              <p className="mt-1 text-[15px] leading-snug text-ink">
                {f.line}
              </p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
