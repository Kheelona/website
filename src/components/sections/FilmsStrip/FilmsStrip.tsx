import { SectionLinkRow, SectionTitle } from "@/components/sections/FeatureSplit/section-parts";
import { Container, Section, SectionHead } from "@/components/ui/Layout/Layout";
import { Quote } from "@/components/ui/Quote/Quote";
import { RichText } from "@/components/ui/RichText/RichText";
import { FilmsStripIsland, type QuotedFilms } from "./FilmsStrip.client";
import type { FilmQuotes, FilmTile, FilmsStripProps } from "./films-strip.types";

export type { FilmQuote, FilmQuotes, FilmsStripConfig, FilmsStripProps } from "./films-strip.types";

/** One film tile: 80% of the column on phones, a third of the strip from 720 px, which stops at 944 px from 1024 px
 *  (mockup.css:41, 83, 90). */
const POSTER_SIZES = "(min-width: 1024px) 304px, (min-width: 720px) calc((100vw - 64px) / 3), calc((100vw - 32px) * 0.8)";

/** Each quote's DS quote card (ui/Quote, a server component), rendered here and handed to the island beside its film's
 *  id, so the island only adds the button that plays it. A quote of a film the strip does not show fails the render. */
function quotedFilms(quotes: FilmQuotes, films: readonly FilmTile[]): QuotedFilms {
  return {
    watch: quotes.watch,
    items: quotes.items.map((q) => {
      if (!films.some((f) => f.id === q.film)) {
        throw new Error(`FilmsStrip: the quote of ${q.name} plays the film "${q.film}", which the strip does not show`);
      }
      return { film: q.film, card: <Quote quote={q.quote} cite={{ name: q.name, role: q.role }} tone={q.tone} /> };
    }),
  };
}

/**
 * The parent films (task 3.3; components §2; D040; architecture §5.2, §10, §11.2 row 8). This server part renders the
 * band section, the centred heading, the revealing wrap (a server element with a static class, the authoring rule of
 * architecture §11.3), the proof line and whatever follows the strip (the CTA block in `after`, or the store's link,
 * a `Button` rendered here through `SectionLinkRow`). The strip itself, its controls and playback are the client island
 * (`FilmsStrip.client.tsx`), which draws its icons with `IconButton`, `Glyph` and the named `ICON_*` constants and never
 * imports `Icon`, `Button` or `PreorderButton` (test/guards/client-icons.test.ts). Where the page gives `quotes`
 * (Home and the product page, task 8c.3, D061 item 4), parents' own words follow the controls, each card rendered here
 * and its "Watch the film" button by the island, which plays that film in the strip.
 */
export function FilmsStrip({ id, heading, films, labels, proof, posters, link, quotes, after, offer }: FilmsStripProps) {
  return (
    <Section id={id} band labelledBy={heading.id}>
      <Container>
        <SectionHead>
          <SectionTitle heading={heading} align="center" offer={offer} />
        </SectionHead>
        <div className="ks-films-wrap" data-reveal="">
          <FilmsStripIsland
            films={films}
            labels={labels}
            posters={posters}
            sizes={POSTER_SIZES}
            quotes={quotes === undefined ? undefined : quotedFilms(quotes, films)}
          >
            {proof && <RichText as="p" className={`kh-${proof.size} ks-films-proof`} text={proof.text} offer={offer} />}
          </FilmsStripIsland>
        </div>
        {after}
        <SectionLinkRow link={link} center />
      </Container>
    </Section>
  );
}
