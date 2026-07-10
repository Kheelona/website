import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StageGate } from "@/components/three/StageGate";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Kheelona collects when you join the Lumi pre-order list, what we do with it, and the promises we make about your child's data.",
  alternates: { canonical: "/privacy" },
};

/* TODO(counsel-review): plain-language draft per prompt §5.2. This page MUST
   be reviewed by counsel before launch (launch checklist gate). */

const SECTIONS = [
  {
    h: "What we collect when you join the list",
    ps: [
      "When you reserve Lumi, we ask for your name, your email, your WhatsApp number, your child's birth month, and your city. We also ask for your consent before we contact you on WhatsApp.",
      "That is the whole list. We do not ask for payment details, because there is no payment.",
    ],
  },
  {
    h: "Why we ask for it",
    ps: [
      "Your email and WhatsApp number let us tell you about your reservation: the price hold, the ship date when it is announced, and your place in line.",
      "Your child's birth month helps us plan for the right ages. Your city helps us plan delivery. Neither is ever used to profile your child.",
    ],
  },
  {
    h: "Where it lives",
    ps: [
      "Pre-order details are stored with Tally, the form service that runs our list, and are accessible only to the Kheelona team.",
    ],
  },
  {
    h: "What we never do",
    ps: [
      "We never sell your data. We never sell your child's data. We do not run ads with it, trade it, or share it with anyone who is not helping us deliver Lumi to you.",
    ],
  },
  {
    h: "Leaving the list",
    ps: [
      "You can leave the pre-order list anytime, and we will delete your details on request. Reply to any email we have sent you and ask. That is all it takes.",
    ],
  },
  {
    h: "When Lumi ships",
    ps: [
      "The product itself follows stricter rules, explained in plain words on our Safety page: conversations stay in your region, nothing is collected without parent consent, any conversation can be deleted in one tap, and your child's voice data is never sold.",
      "A full product privacy policy will be published here before Lumi ships.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <Section wash="cream">
        <Container className="py-14 md:py-16">
          <div className="mx-auto max-w-[760px]">
            <Eyebrow>The fine print, unfine</Eyebrow>
            <h1 className="mb-4 font-display text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1.1] text-ink-head">
              Privacy, in plain words.
            </h1>
            <p className="text-[18px]">
              This page covers the pre-order list. It is written to be read,
              not skimmed past.
            </p>
          </div>
        </Container>
      </Section>
      <Section wash="white">
        <CurveDivider from="cream" />
        <Container className="py-12 md:py-16">
          <div className="mx-auto max-w-[720px]">
            {SECTIONS.map((s) => (
              <div key={s.h}>
                <h2 className="mb-3 mt-9 font-display text-[24px] font-extrabold text-ink-head">
                  {s.h}
                </h2>
                {s.ps.map((p, i) => (
                  <p key={i} className="mb-4 text-[17px] leading-[1.65]">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <StageGate stage="ambient" />
    </>
  );
}
