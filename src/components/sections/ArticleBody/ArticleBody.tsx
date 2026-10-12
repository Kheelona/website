import { clsx } from "clsx";
import type { ReactNode } from "react";
import { Container, Section } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import type { ArticlePart } from "@/content/types";
import type { ArticleBodyConfig } from "./article-body.types";
import { ProseBlocks, ProseFigure, type ProseContext } from "./ProseBlocks";

/**
 * The article's reading column (task 3.4; story-*.html, the `div.kh-section` after the head): one centred column
 * (`ks-col`, 7/12 of the DS content width) set at the DS body step, body-l from 1024 px (`ks-type-*` steps,
 * mockup-css-mapping rows 71-72 and 83-84; no pixel sizes). It holds the answer (`before`, AnswerSection), the
 * article's parts and photos, then the sources (`after`, SourcesSection), spaced as one column. A titled part is a
 * section named by its h2 (`ks-part`, with its fragment id when other pages link to it); an untitled part is a plain
 * div; a `breakout` part lets its facts list widen out of the column from 1200 px. Server component.
 */
export interface ArticleBodyProps extends ArticleBodyConfig, ProseContext {
  /** First in the column: the answer block (AnswerSection, variant `article`). */
  before?: ReactNode;
  /** Last in the column: the numbered sources (SourcesSection). */
  after?: ReactNode;
}

function Part({ part, index, ctx }: { part: ArticlePart; index: number; ctx: ProseContext }) {
  const className = clsx("ks-part", part.variant === "breakout" && "ks-breakout");
  const blocks = <ProseBlocks blocks={part.blocks} {...ctx} />;
  if (part.title === undefined) {
    return (
      <div className={className} id={part.id}>
        {blocks}
      </div>
    );
  }
  const titleId = `${part.id ?? `story-part-${index + 1}`}-title`;
  return (
    <section className={className} id={part.id} aria-labelledby={titleId}>
      <RichText as="h2" className="kh-title" id={titleId} text={part.title} offer={ctx.offer} />
      {blocks}
    </section>
  );
}

export function ArticleBody({ blocks, before, after, ...ctx }: ArticleBodyProps) {
  return (
    <Section as="div" className="ks-story-body">
      <Container className="ks-col ks-prose ks-type-body ks-type-body-l@xl">
        {before}
        {blocks.map((block, i) =>
          block.kind === "part" ? <Part key={i} part={block} index={i} ctx={ctx} /> : <ProseFigure key={i} block={block} ctx={ctx} />,
        )}
        {after}
      </Container>
    </Section>
  );
}
