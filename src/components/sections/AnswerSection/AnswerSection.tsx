import { Card } from "@/components/ui/Card/Card";
import { Heading } from "@/components/ui/Heading/Heading";
import { Container, Section, Split } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import { ProseBlocks, type ProseContext } from "../ArticleBody/ProseBlocks";
import type { AnswerSectionConfig } from "./answer-section.types";

/**
 * The answer-first block (task 3.4; architecture §9.5): the question as a heading, the 40-60 word answer as the first
 * paragraph, then any detail. `article` is the tinted Sunshine card at the head of an article's reading column
 * (story-*.html fold 2: pass it to ArticleBody as `before`); its source markers take the article variant. `team` is
 * the team page's band with the question beside the answer (team.html fold 2). Server component.
 */
export type AnswerSectionProps = AnswerSectionConfig & ProseContext;

export function AnswerSection(props: AnswerSectionProps) {
  const { question, answer, offer, sourceLabel } = props;
  if (props.variant === "team") {
    const id = props.id ?? "who-title";
    return (
      <Section band labelledBy={id}>
        <Container>
          <Split wide="end" className="ks-team-who">
            <Heading title={question} id={id} offer={offer} />
            <RichText as="p" className="kh-body-l ks-team-answer" text={answer} offer={offer} />
          </Split>
        </Container>
      </Section>
    );
  }
  const id = props.id ?? "answer-title";
  const sources = sourceLabel === undefined ? undefined : { label: sourceLabel, variant: "article" as const };
  return (
    <Card as="section" variant="tint" tone="sun" className="ks-answer" labelledBy={id}>
      <RichText as="h2" className="kh-title" id={id} text={question} offer={offer} />
      <RichText as="p" text={answer} offer={offer} sources={sources} />
      {props.detail && <ProseBlocks blocks={props.detail} offer={offer} sourceLabel={sourceLabel} />}
    </Card>
  );
}
