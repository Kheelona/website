import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { CompareTable } from "@/components/molecules/CompareTable";
import { PREORDER_HREF, RESERVE_LABEL, PRICE_CAPTION, KHEELU_AGES, SUPPORT_WHATSAPP_HREF } from "@/config/site";
import { COMPARISON_COLUMNS, COMPARISON_ROWS } from "@/lib/comparison";

/** The honest-comparison moment (kept by founder brief pointer 6; table
 *  wording went parent-first in M2). `bare` renders content-only for the
 *  Room grammar; the legacy Section shell remains for non-room routes.
 *
 *  CMO merge (2026-10-04, content doc v7 screen 6): the comparison a parent
 *  is actually making, against the product TYPES they might buy instead, from
 *  `lib/comparison.ts` (no brand is named). The tutor line stays: it is one of
 *  the four places that narrative is allowed (V6). */
export function Compare({ bare = false }: { bare?: boolean }) {
  const content = (
    <>
      <Reveal>
        <SectionHeading
          title="Thinking of a smart speaker or a tablet instead?"
          titleClassName="mb-3 max-w-[22ch]"
          lede={`They all talk or play. This is how they differ for a child aged ${KHEELU_AGES}.`}
          ledeClassName="mb-10 max-w-[58ch]"
        />
        <CompareTable columns={COMPARISON_COLUMNS} rows={COMPARISON_ROWS} />
        {/* The doc asks for every cell to be date-stamped against current
            products; until the team supplies checked figures, the table says
            what it is based on and invites a correction instead. */}
        <p className="mt-4 text-[15px] text-ink-muted">
          Based on typical products in each group. See something out of date?{" "}
          <a
            href={SUPPORT_WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
          >
            Tell us on WhatsApp
          </a>
          .
        </p>
      </Reveal>
      {/* the table is the conviction peak; give it an action (UX panel
          2026-07-10). R9: reassurance trimmed — the full line lives at the
          hero and finale only. */}
      <Reveal className="mt-10">
        {/* V3: the line that reframes the price against what a parent already
            pays for tutoring, without attacking tutors (the Khanmigo lesson —
            position as always-available, not as cheaper) */}
        <p className="mb-6 max-w-[42ch] font-display text-[19px] font-bold text-ink-head">
          A tutor runs out of time and patience. Kheelu does not.
        </p>
        <Button href={PREORDER_HREF} track="compare">{RESERVE_LABEL}</Button>
        <p className="mt-4 text-[15px] text-ink-muted">{PRICE_CAPTION}</p>
      </Reveal>
    </>
  );

  if (bare) return content;

  return (
    <Section wash="white">
      <Container className="pb-12 pt-16 md:pb-14 md:pt-20">{content}</Container>
    </Section>
  );
}
