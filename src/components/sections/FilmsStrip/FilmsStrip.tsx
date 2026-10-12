import { Button } from "@/components/ui/Button/Button";
import { Heading } from "@/components/ui/Heading/Heading";
import { Actions, Container, Section, SectionHead } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import { FilmsStripIsland } from "./FilmsStrip.client";
import type { FilmsStripProps } from "./films-strip.types";

export type { FilmsStripConfig, FilmsStripProps } from "./films-strip.types";

/** One film tile: 80% of the column on phones, a third of the strip from 720 px, which stops at 944 px from 1024 px
 *  (mockup.css:41, 83, 90). */
const POSTER_SIZES = "(min-width: 1024px) 304px, (min-width: 720px) calc((100vw - 64px) / 3), calc((100vw - 32px) * 0.8)";

/**
 * The parent films (task 3.3; components §2; D040; architecture §5.2, §10, §11.2 row 8). This server part renders the
 * band section, the centred heading, the revealing wrap (a server element with a static class, the authoring rule of
 * architecture §11.3), the proof line and whatever follows the strip (the CTA block in `after`, or the store's link,
 * a `Button` rendered here). The strip itself, its controls and playback are the client island
 * (`FilmsStrip.client.tsx`), which draws its icons with `IconButton` and the named `ICON_*` constants and never
 * imports `Icon`, `Button` or `PreorderButton` (test/guards/client-icons.test.ts).
 */
export function FilmsStrip({ id, heading, films, labels, proof, posters, link, after, offer }: FilmsStripProps) {
  return (
    <Section id={id} band labelledBy={heading.id}>
      <Container>
        <SectionHead>
          <Heading eyebrow={heading.eyebrow} title={heading.title} lead={heading.lead} align="center" id={heading.id} offer={offer} />
        </SectionHead>
        <div className="ks-films-wrap" data-reveal="">
          <FilmsStripIsland films={films} labels={labels} posters={posters} sizes={POSTER_SIZES}>
            {proof && <RichText as="p" className={`kh-${proof.size} ks-films-proof`} text={proof.text} offer={offer} />}
          </FilmsStripIsland>
        </div>
        {after}
        {link && (
          <Actions center>
            <Button variant="ghost" href={link.href} iconEnd={link.icon ?? "arrow-right"}>
              {link.label}
            </Button>
          </Actions>
        )}
      </Container>
    </Section>
  );
}
