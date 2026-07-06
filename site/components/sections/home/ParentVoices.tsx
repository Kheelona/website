import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

/** Home S09. Testimonials are PENDING per the claims register (§1.9):
 *  real quote, parent name, child age, city, with consent, founder to provide.
 *  TODO(claims-testimonials): replace the three placeholders. Launch gate
 *  requires zero placeholders; this section is hidden from prod nav flows
 *  only by content, never fabricated. */
export function ParentVoices() {
  return (
    <Section wash="cream">
      <Container className="py-16 md:py-20">
        <Reveal>
          <Eyebrow color="text-orange-deep">What parents are saying</Eyebrow>
          <h2 className="mb-10 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
            Families who have met Lumi.
          </h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Reveal key={n} delay={n * 0.06}>
              <div className="flex h-full min-h-[180px] flex-col justify-center gap-2 rounded-(--radius-card) border-[1.5px] border-dashed border-line bg-white p-7">
                <span className="text-[13px] font-bold uppercase tracking-wider text-orange-deep">
                  Testimonial pending
                </span>
                <p className="text-[15px] text-ink-muted">
                  Real quote, parent name, child age, and city. Founder to
                  provide, with consent.
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
