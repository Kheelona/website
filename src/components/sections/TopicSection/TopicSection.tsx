import { clsx } from "clsx";
import { Card } from "@/components/ui/Card/Card";
import { Heading } from "@/components/ui/Heading/Heading";
import { Icon } from "@/components/ui/Icon/Icon";
import { Container, Section, SectionHead } from "@/components/ui/Layout/Layout";
import { List } from "@/components/ui/List/List";
import { Photo } from "@/components/ui/Photo/Photo";
import { imageRatio } from "@/components/ui/Photo/image";
import { RichText } from "@/components/ui/RichText/RichText";
import type { TopicGuideCard, TopicSectionConfig } from "./topic-section.types";

/**
 * One topic band of the stories hub (task 3.4; stories.html folds 2-5): a section with the topic's anchor, named by
 * its h2 and lead; the rewritten guide as a card (photo, title at the DS subtitle step, summary, one link that taps
 * the whole card and names the guide for screen readers), beside the topic's other guides from 900 px; those are DS
 * rows with h3 titles, quiet until their guide has a page. With no rewritten guide the rows run in two columns. A
 * portrait photo in the card's 16:9 frame is cropped to keep the child in view (stories.css:33, ported for any
 * portrait photo). Server component.
 */
export type TopicSectionProps = TopicSectionConfig;

/** The card fills the 5/12 column from 900 px (about 440 px inside its padding at 1440). */
const CARD_SIZES = "(min-width: 1024px) 440px, (min-width: 900px) 34vw, calc(100vw - 80px)";

function GuideCard({ guide }: { guide: TopicGuideCard }) {
  const portrait = imageRatio(guide.image) > 1;
  return (
    <Card
      className="ks-guide"
      media={<Photo image={guide.image} variant="wide" className={portrait ? "ks-guide__photo--portrait" : undefined} sizes={CARD_SIZES} />}
      title={<RichText text={guide.title} />}
      titleType="subtitle"
      body={<RichText text={guide.summary} />}
      link={{
        href: guide.href,
        label: (
          <>
            {guide.linkLabel}
            <span className="kh-sr">
              {": "}
              <RichText text={guide.title} />
            </span>
          </>
        ),
        icon: <Icon name="arrow-right" />,
        tap: true,
      }}
    />
  );
}

export function TopicSection({ topic, featured, items, band }: TopicSectionProps) {
  const titleId = `${topic.id}-title`;
  return (
    <Section id={topic.id} band={band} className="ks-topic" labelledBy={titleId}>
      <Container>
        <SectionHead>
          <Heading title={topic.title} lead={topic.lead} id={titleId} />
        </SectionHead>
        <div className="ks-topic__grid">
          {featured && <GuideCard guide={featured} />}
          <List
            titleAs="h3"
            className={clsx("ks-topic__guides", featured === undefined && "ks-topic__guides--two")}
            items={items.map((item) => ({ title: <RichText text={item.title} />, sub: <RichText text={item.summary} />, href: item.href }))}
          />
        </div>
      </Container>
    </Section>
  );
}
