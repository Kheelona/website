import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The terms of the Lumi pre-order reservation: what the price hold means, what you are committing to (nothing), and how the list works.",
  alternates: { canonical: "/terms" },
};

/* TODO(counsel-review): plain-language draft per prompt §5.2. This page MUST
   be reviewed by counsel before launch (launch checklist gate). */

const SECTIONS = [
  {
    h: "What a reservation is",
    ps: [
      "Joining the pre-order list reserves your place in line and holds the launch price of ₹4,999 for you. The price after launch is ₹9,999.",
      "A reservation is not a purchase. You pay nothing now, and nothing is charged automatically, ever.",
    ],
  },
  {
    h: "What you are committing to",
    ps: [
      "Nothing. When Lumi is ready to ship, we will contact you with the details, and you decide then whether to buy at your held price. If you say no, that is completely fine.",
    ],
  },
  {
    h: "The price hold",
    ps: [
      "The ₹4,999 price is held for everyone who joins the list before launch. If our launch plans change in a way that affects the hold, we will tell you directly before anything else happens.",
    ],
  },
  {
    h: "Leaving the list",
    ps: [
      "You can leave anytime. Your place goes to the next family and your details are deleted on request, as described on the Privacy page.",
    ],
  },
  {
    h: "The boring but honest part",
    ps: [
      "Lumi is still being finished. Dates, specifications, and availability can change while we complete testing and certification. We will communicate every change that affects your reservation.",
      "Full terms of sale, including delivery, returns, and warranty, will be published before anyone is asked to pay anything.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <>
      <Section wash="cream">
        <Container className="py-14 md:py-16">
          <div className="mx-auto max-w-[760px]">
            <Eyebrow>The fine print, unfine</Eyebrow>
            <h1 className="mb-4 font-display text-[clamp(34px,4vw,52px)] font-extrabold leading-[1.1] text-ink-head">
              Reservation terms, in plain words.
            </h1>
            <p className="text-[18px]">
              A fair deal should survive being written clearly. Here is ours.
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
    </>
  );
}
