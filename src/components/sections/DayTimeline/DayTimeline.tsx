import { AppScreens } from "@/components/ui/AppScreens/AppScreens";
import { Chip } from "@/components/ui/Chip/Chip";
import { Icon } from "@/components/ui/Icon/Icon";
import { Container, Section, Split } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import type { Offer } from "@/content/types";
import { SectionTitle } from "../FeatureSplit/section-parts";
import type { DayTimelineConfig } from "./day-timeline.types";

export type { DayMoment, DayTimelineConfig } from "./day-timeline.types";

/** The one phone screen: 232 px under 900 px (day-timeline.css), 300 from 900 px (AppScreens `safety`, the DS device). */
const SCREEN_SIZES = "(min-width: 900px) 300px, 232px";

export type DayTimelineProps = DayTimelineConfig & {
  /** For any amount in the words (none today); every line goes through RichText. */
  readonly offer?: Offer;
};

/**
 * A day with Kheelu (task Q2.9; the D2C plan v2 §2 fold 9): when a family would use it, and that it is not all day. The
 * heading, then a 7:5 split from 900 px: on the left the moments as one ordered list read top to bottom, a timeline of
 * DS icon circles in their tones joined by a hairline, each moment an h3, its line and its mode as a DS chip, then the
 * closing line; on the right one real parent-app screen in the DS device (AppScreens `safety`, the activity screen,
 * D044) with its caption. On phones the screen follows the words. The list and the screen fade in once on scroll
 * (D049 pick 1). No button. Server component.
 */
export function DayTimeline({ id, band, heading, moments, closing, screen, offer }: DayTimelineProps) {
  const caption = screen.caption === undefined ? undefined : <RichText text={screen.caption} offer={offer} />;
  return (
    <Section id={id} band={band} labelledBy={heading.id}>
      <Container>
        <Split wide="start" className="ks-day-split">
          <div>
            <SectionTitle heading={heading} offer={offer} />
            <ol className="ks-day ks-list-reset" role="list" data-reveal="">
              {moments.map((moment, i) => (
                <li key={i} className={`ks-day__moment kh-tone-${moment.tone}`}>
                  <span className="ks-day__icon" aria-hidden="true">
                    <Icon name={moment.icon} />
                  </span>
                  <div className="ks-day__words">
                    <RichText as="h3" className="kh-label ks-day__when" text={moment.when} offer={offer} />
                    <RichText as="p" className="kh-body ks-day__line" text={moment.line} offer={offer} />
                    <Chip label={moment.mode} />
                  </div>
                </li>
              ))}
            </ol>
            {closing !== undefined && <RichText as="p" className="kh-body-l ks-day__closing" text={closing} offer={offer} />}
          </div>
          <AppScreens variant="safety" screens={[screen.image]} sizes={SCREEN_SIZES} caption={caption} reveal />
        </Split>
      </Container>
    </Section>
  );
}
