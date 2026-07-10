import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";

/** R9: Kheelu introduces himself (founder mandate 2026-07-10: the site is
 *  told by Kheelu). Greeting, one-liner, and the four traits are verbatim
 *  from the founder's Kheelu card — the card's contractions are sanctioned
 *  character voice (copy-reference.md). Chip tints follow the card's icon
 *  hues mapped to brand tokens. */
const TRAITS = [
  { label: "Naturally Curious", tint: "bg-blue/15" },
  { label: "Kind & Caring", tint: "bg-orange/15" },
  { label: "Smart Explorer", tint: "bg-teal/15" },
  { label: "Playful & Fun", tint: "bg-yellow/15" },
] as const;

export function KheeluIntro() {
  return (
    <Section wash="white" id="kheelu">
      <Container className="pb-14 pt-2 md:pb-16">
        <div className="grid items-center gap-8 md:grid-cols-[220px_1fr] md:gap-12">
          <Reveal className="flex justify-center md:justify-start">
            <Image
              src="/mascot/mascot-hero-wink.png"
              alt="Kheelu, the Kheelona mascot, winking with a thumbs up"
              width={384}
              height={737}
              sizes="(max-width: 768px) 40vw, 200px"
              className="h-[240px] w-auto md:h-[300px]"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mb-4 font-display text-[clamp(30px,3.6vw,44px)] font-extrabold leading-[1.08] text-ink-head">
              Hi! I&apos;m <span className="text-orange-deep">Kheelu</span>.
            </h2>
            <p className="mb-6 max-w-[46ch] text-[clamp(18px,1.7vw,22px)]">
              I love asking questions, discovering new things and learning
              together with you!
            </p>
            <ul className="mb-6 flex max-w-[560px] flex-wrap gap-2.5">
              {TRAITS.map((t) => (
                <li
                  key={t.label}
                  className={`rounded-full px-4 py-2 text-[14.5px] font-bold text-ink-head ${t.tint}`}
                >
                  {t.label}
                </li>
              ))}
            </ul>
            <p className="text-[17px] font-bold text-ink-head">
              Let me show you around.
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
