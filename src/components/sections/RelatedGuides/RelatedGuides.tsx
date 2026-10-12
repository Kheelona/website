import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { Heading } from "@/components/ui/Heading/Heading";
import { Icon } from "@/components/ui/Icon/Icon";
import { Actions, Container, Section, SectionHead } from "@/components/ui/Layout/Layout";
import { List } from "@/components/ui/List/List";
import { RichText } from "@/components/ui/RichText/RichText";
import type { RelatedGuidesConfig } from "./related-guides.types";

/**
 * The guides an article leads to (task 3.4; story-*.html): DS list rows that wrap, each one link ending on the
 * chevron, centred on the reading column (`ks-col`, ArticleBody's). `related` is the band under an article with a
 * close; `keep` is the keep-reading close of the late-talker article (B5): the rows in a tinted Sunshine card, then
 * the hub as a full-width secondary button (inline from 720 px), and no pre-order button. Server component.
 */
export type RelatedGuidesProps = RelatedGuidesConfig;

export function RelatedGuides({ variant, title, items, action, id }: RelatedGuidesProps) {
  const keep = variant === "keep";
  const titleId = id ?? (keep ? "keep-title" : "related-title");
  const content = (
    <>
      <SectionHead>
        <Heading title={title} id={titleId} />
      </SectionHead>
      <List bareChevron chevron={<Icon name="caret-right" />} items={items.map((item) => ({ title: <RichText text={item.title} />, href: item.href }))} />
      {action && (
        <Actions>
          <Button variant="secondary" block href={action.href} iconEnd="arrow-right">
            {action.label}
          </Button>
        </Actions>
      )}
    </>
  );
  return (
    <Section band={!keep} className={keep ? "ks-related ks-keep" : "ks-related"} labelledBy={titleId}>
      <Container className="ks-col">
        {keep ? (
          <Card as="div" variant="tint" tone="sun" className="ks-keep__card">
            {content}
          </Card>
        ) : (
          content
        )}
      </Container>
    </Section>
  );
}
