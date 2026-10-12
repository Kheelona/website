import { SectionLinkRow, SectionTitle } from "@/components/sections/FeatureSplit/section-parts";
import { Card } from "@/components/ui/Card/Card";
import { Icon } from "@/components/ui/Icon/Icon";
import { LanguageChips } from "@/components/ui/LanguageChips/LanguageChips";
import { Cols, Container, Section, SectionHead } from "@/components/ui/Layout/Layout";
import { Photo } from "@/components/ui/Photo/Photo";
import { RichText } from "@/components/ui/RichText/RichText";
import { TickList } from "@/components/ui/TickList/TickList";
import type { Copy } from "@/content/types";
import type { ModesSectionProps } from "./modes-section.types";

export type { ModesSectionConfig, ModesSectionProps } from "./modes-section.types";

/** The heading's photo: the narrow column of the 7:5 section-head split from 900 px, the full column below. */
const PHOTO_SIZES = "(min-width: 1296px) 480px, (min-width: 900px) 40vw, calc(100vw - 32px)";
/** The Good to know photo: at most 176 px, 224 px from 720 px (meet-kheelu.css:34, 37). */
const KNOW_SIZES = "(min-width: 720px) 224px, 176px";

/**
 * The modes and languages fold (task 3.3; components §2): the heading beside a photo (`kh-section__head` as a 7:5
 * split), the three mode cards (`Cols` of `Card`s; the card with `id` carries the fragment on its title, Story mode's
 * `#story-mode`), the languages (`LanguageChips` under a `kh-subtitle`) and the closing ghost link. The section keeps
 * `id="modes"`. On the product page the cards become compact rows on phones (`ks-modes`, the words grouped beside the
 * icon) and the Good to know card follows the languages (`ks-know`: tick lines beside the tummy-unit photo). The
 * photo, the cards and the Good to know card reveal once on scroll (home.html and meet-kheelu.html fold 4).
 */
export function ModesSection({ variant, id = "modes", heading, photo, modes, languages, know, link, offer }: ModesSectionProps) {
  const product = variant === "product";
  const text = (copy: Copy) => <RichText text={copy} offer={offer} />;
  return (
    <Section id={id} band labelledBy={heading.id}>
      <Container>
        <SectionHead split="start">
          <SectionTitle heading={heading} offer={offer} />
          <Photo image={photo.image} sizes={PHOTO_SIZES} variant={photo.wide ? "wide" : undefined} xl reveal />
        </SectionHead>
        <Cols count={3} reveal className={product ? "ks-modes" : undefined}>
          {modes.map((mode, i) => (
            <Card
              key={i}
              tone={mode.tone}
              variant={mode.tint ? "tint" : "plain"}
              icon={<Icon name={mode.icon} />}
              title={text(mode.title)}
              titleId={mode.id}
              body={text(mode.body)}
              groupText={product}
            />
          ))}
        </Cols>
        <RichText as="h3" className="kh-subtitle" text={languages.title} offer={offer} />
        <LanguageChips languages={languages.items} note={languages.note === undefined ? undefined : text(languages.note)} />
        {know && (
          <Card
            tone="sun"
            variant="tint"
            className="ks-know"
            labelledBy={know.id}
            reveal
            title={text(know.title)}
            titleId={know.id}
            groupText
            groupClassName="ks-know__text"
            after={<Photo bare image={know.image} sizes={KNOW_SIZES} className="ks-know__img" />}
          >
            <TickList items={know.items.map((item) => ({ icon: <Icon name={item.icon} />, text: text(item.text) }))} />
          </Card>
        )}
        <SectionLinkRow link={link} />
      </Container>
    </Section>
  );
}
