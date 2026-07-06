import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { MascotScene } from "@/components/mascot/MascotScene";
import { FinaleCTA } from "@/components/sections/home/FinaleCTA";

export const metadata: Metadata = {
  title: "Setup: day one with Lumi",
  description:
    "How simple day one will be: charge Lumi, open the parent app, set your languages and topics, and let your child say hello.",
  alternates: { canonical: "/setup" },
};

/* Copy per prompt §5.2: show how simple day one will be. Steps stay generic
   until final specs land (TODO claims-specs: wake word, charger details). */

const STEPS = [
  { n: "01", title: "Unbox and charge.", body: "Lumi arrives ready. Plug in the charger and let it drink while you do the next step.", color: "text-orange-deep" },
  { n: "02", title: "Open the parent app.", body: "Set the languages you speak at home, pick the topics that are open, and set quiet hours. Five minutes, once.", color: "text-blue" },
  { n: "03", title: "Teach the hello.", body: "Show your child how to wake Lumi up. One word, one friend, no manual required.", color: "text-teal" },
  { n: "04", title: "Step back and listen.", body: "The first conversation belongs to them. You can read it later in the app, and smile.", color: "text-purple" },
] as const;

export default function SetupPage() {
  return (
    <>
      <Section wash="cool">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-20">
          <Reveal mode="rise">
            <Eyebrow>Day one</Eyebrow>
            <h1 className="mb-5 font-display text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1.08] text-ink-head">
              Set up in minutes. Then get out of the way.
            </h1>
            <p className="max-w-[56ch] text-[clamp(18px,1.6vw,21px)]">
              Lumi is made for homes, not IT departments. Day one is four small
              steps, and only one of them is yours to do alone.
            </p>
          </Reveal>
          <Reveal className="flex justify-center">
            <MascotScene pose="joy" width={300} parallax={34} priority />
          </Reveal>
        </Container>
      </Section>

      <Section wash="white">
        <CurveDivider from="cool" />
        <Container className="py-16 md:py-20">
          <ol className="border-t border-line">
            {STEPS.map((s) => (
              <Reveal as="li" key={s.n} className="grid items-start gap-5 border-b border-line py-8 md:grid-cols-[90px_1fr_1.4fr] md:gap-7">
                  <span aria-hidden="true" className={`font-display text-4xl font-extrabold ${s.color}`}>
                    {s.n}
                  </span>
                  <h2 className="font-display text-[24px] font-extrabold leading-tight text-ink-head">
                    {s.title}
                  </h2>
                <p className="text-[16.5px]">{s.body}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-8">
            {/* TODO(claims-specs): add wake word + charger details when final. */}
            <p className="max-w-[62ch] text-[16px] text-ink-muted">
              The exact wake word and charger details will be published here
              with the final specs, before Lumi ships.
            </p>
          </Reveal>
        </Container>
      </Section>

      <FinaleCTA variant="compact" from="white" />
    </>
  );
}
