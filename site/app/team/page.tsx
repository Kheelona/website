import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { MascotScene } from "@/components/mascot/MascotScene";
import { FinaleCTA } from "@/components/sections/home/FinaleCTA";

export const metadata: Metadata = {
  title: "Team: the parents who build",
  description:
    "Meet the people behind Kheelona and Lumi, the screen-free AI robot toy: a founder, a CTO with 14 patents filed, and a hardware chief who built at Intel.",
  alternates: { canonical: "/team" },
};

/* Copy per prompt §5.2: honest, personal, a little vulnerable. Founder facts
   are locked (§1.8): name Intel, leave the services firm unnamed.
   TODO(claims-backed-by): "backed by" band pending investor names/logos. */

const FOUNDERS = [
  {
    name: "Apoorva Sahu",
    role: "Founder and CEO",
    line: "The business and the trust.",
    body: "Apoorva holds the promise this brand makes to your family: no screens, no shortcuts, no fine print.",
    tint: "bg-orange/15",
  },
  {
    name: "Aman Soni",
    role: "Co-founder and CTO",
    line: "The brain.",
    body: "Aman builds PlayOS, the voice engine behind Lumi. 14 patents filed, all in service of one conversation with one child.",
    tint: "bg-blue/15",
  },
  {
    name: "Kashyap C.R",
    role: "Co-founder and Chief Hardware Officer",
    line: "The body.",
    body: "Kashyap makes Lumi something small hands reach for. He built hardware at Intel before he built it for children.",
    tint: "bg-teal/15",
  },
] as const;

const BELIEFS = [
  "Screen-free is not nostalgia. It is the next product.",
  "Safety is not a feature. It is the whole product.",
  "A toy should be kept, not outgrown.",
  "The parent holds the keys. Always.",
] as const;

export default function TeamPage() {
  return (
    <>
      {/* Manifesto hero */}
      <Section wash="cream">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-20">
          <Reveal mode="rise">
            <Eyebrow>The team</Eyebrow>
            <h1 className="mb-5 max-w-[18ch] font-display text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1.08] text-ink-head">
              We are parents who build. So we built the thing we wanted.
            </h1>
            <p className="max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              We watched our own children reach for screens and felt the same
              knot you feel. We build AI robot toys because we wanted a better
              answer in our own homes: a friend that listens, talks back, and
              leaves the screen out of it.
            </p>
          </Reveal>
          <Reveal className="flex justify-center">
            <MascotScene pose="silly" width={300} parallax={34} />
          </Reveal>
        </Container>
      </Section>

      {/* Founder cards */}
      <Section wash="white">
        <CurveDivider from="cream" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <h2 className="mb-3 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              Three people, one promise.
            </h2>
            <p className="mb-11 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              You are trusting us near your child. You should know who we are.
            </p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {FOUNDERS.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.06}>
                <div className={`h-full rounded-(--radius-card) p-8 ${f.tint}`}>
                  <p className="mb-1 font-accent text-[20px] italic text-ink-muted">{f.line}</p>
                  <h3 className="font-display text-[26px] font-extrabold text-ink-head">
                    {f.name}
                  </h3>
                  <p className="mb-3 text-[15px] font-semibold text-ink-muted">{f.role}</p>
                  <p className="text-[16px]">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* What we believe */}
      <Section wash="cool">
        <CurveDivider from="white" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <h2 className="mb-11 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              What we believe.
            </h2>
          </Reveal>
          <ol className="border-t border-line">
            {BELIEFS.map((b, i) => (
              <Reveal as="li" key={b} className="grid items-center gap-4 border-b border-line py-7 md:grid-cols-[80px_1fr]">
                  <span aria-hidden="true" className="font-display text-4xl font-extrabold text-blue">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-[clamp(20px,2.2vw,26px)] font-extrabold text-ink-head">
                    {b}
                  </p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Gentle close */}
      <Section wash="cream">
        <CurveDivider from="cool" />
        <Container className="py-14 text-center md:py-16">
          <Reveal>
            <p className="mx-auto max-w-[52ch] text-[clamp(19px,1.8vw,23px)]">
              If you have read this far, you care the way we care. Save your
              place in line, and grow with us.
            </p>
          </Reveal>
        </Container>
      </Section>

      <FinaleCTA variant="compact" from="cream" />
    </>
  );
}
