import { SectionTitle } from "@/components/sections/FeatureSplit/section-parts";
import { FilmClipIsland } from "@/components/sections/FilmsStrip/FilmsStrip.client";
import { LanguageChips } from "@/components/ui/LanguageChips/LanguageChips";
import { Container, Section, Split } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import type { Offer } from "@/content/types";
import type { LanguagesSectionConfig } from "./languages-section.types";

export type { LanguagesFilm, LanguagesSectionConfig } from "./languages-section.types";

/** The film's width: 272 px on phones and tablets, 300 px beside the words from 900 px (languages-section.css). */
const FILM_SIZES = "(min-width: 900px) 300px, 272px";

export type LanguagesSectionProps = LanguagesSectionConfig & {
  /** For any amount in the words (none today); every line goes through RichText. */
  readonly offer?: Offer;
};

/**
 * "Does it speak ours?" (task Q2.9; the D2C plan v2 §2 fold 4, D064 item 9): the heading with the languages in its lead,
 * the DS LanguageChips (each language in its own script, its `lang` for screen readers), and beside them one real film
 * that shows Kheelu switching languages, played in place: the expert clip's frame (FilmsStrip's `FilmClipIsland`) upright
 * for a phone recording, poster first and lazy, no `<video>` before the tap, its caption under it, visible before the
 * tap. Never a cast photo beside it (the plan's ruling 1). No button: the fold answers a question. The words come first
 * in the split, so on a phone the languages come before the film. Server component; the film is the strip's island.
 */
export function LanguagesSection({ id, band, heading, languages, film, offer }: LanguagesSectionProps) {
  return (
    <Section id={id} band={band} labelledBy={heading.id}>
      <Container>
        <Split wide="start" className="ks-langs-split">
          <div>
            <SectionTitle heading={heading} offer={offer} />
            <LanguageChips languages={languages} className="ks-langs-chips" />
          </div>
          <figure className="ks-clip ks-langs-film" data-reveal="">
            <FilmClipIsland film={film} sizes={FILM_SIZES} portrait />
            <figcaption className="ks-clip__credit">
              <RichText as="p" className="kh-body" text={film.caption} offer={offer} />
            </figcaption>
          </figure>
        </Split>
      </Container>
    </Section>
  );
}
