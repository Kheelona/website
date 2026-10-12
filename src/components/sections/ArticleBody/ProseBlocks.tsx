import { Fragment, type ReactNode } from "react";
import { Card } from "@/components/ui/Card/Card";
import { Photo } from "@/components/ui/Photo/Photo";
import { Quote } from "@/components/ui/Quote/Quote";
import { RichText, type RichTextTag } from "@/components/ui/RichText/RichText";
import { TrustList } from "@/components/ui/TrustList/TrustList";
import type { FigureBlock, IconRef, LeadText, ListBlock, ListItem, Offer, ProseBlock, RichTextString } from "@/content/types";
import { ContentIcon } from "./content-icon";

/**
 * The prose blocks of the content model (src/content/types.ts, "Prose blocks"), rendered as the three approved
 * article mockups mark them up (story-*.html). ArticleBody renders a part's blocks with it, and AnswerSection the
 * detail under an answer. Every string goes through `RichText`; source markers take the article variant (kept on one
 * line, stories.css:72). Spacing and type are ArticleBody's (article-body.css).
 */

/** The reading column's width (article-body.css `.ks-col`: 1200 × 7 / 12 = 700) inside the 16 px phone padding. */
export const PROSE_SIZES = "(min-width: 732px) 700px, calc(100vw - 32px)";
/** The belly unit inside the facts list: 192 px, 160 px from 1200 px (stories.css:100, 160). */
const BELLY_SIZES = "(min-width: 1200px) 160px, 192px";

export interface ProseContext {
  /** The page's offer, for any amount or delivery line in the text. */
  offer?: Offer;
  /** The word before a source marker's number ("Source"), from content; needed when the text carries markers. */
  sourceLabel?: string;
}

function rich(ctx: ProseContext, text: RichTextString, as?: RichTextTag, className?: string) {
  const sources = ctx.sourceLabel === undefined ? undefined : { label: ctx.sourceLabel, variant: "article" as const };
  return <RichText text={text} offer={ctx.offer} sources={sources} as={as} className={className} />;
}

/** A line that may open with a bold label: the label, a space, the rest. */
function Lead({ item, ctx }: { item: LeadText; ctx: ProseContext }) {
  return (
    <>
      {item.lead !== undefined && <strong>{rich(ctx, item.lead)}</strong>}
      {item.lead !== undefined && item.text !== undefined && " "}
      {item.text !== undefined && rich(ctx, item.text)}
    </>
  );
}

function asLead(item: ListItem): LeadText & { icon?: IconRef } {
  return typeof item === "string" ? { text: item } : item;
}

function itemIcon(list: ListBlock, item: LeadText & { icon?: IconRef }): IconRef {
  if (item.icon !== undefined) return item.icon;
  if (list.variant === "checks") return "check";
  throw new Error(`A tip needs its icon (story-talking-toys-and-late-talkers.html fold 6): "${item.text ?? item.lead}"`);
}

/** Bullets and numbered steps as plain lists; checks with a tick each; tips in a tinted card, each with its icon. */
function List({ block, ctx }: { block: ListBlock; ctx: ProseContext }) {
  const iconed = block.variant === "checks" || block.variant === "tips";
  const items = block.items.map((raw, i) => {
    const item = asLead(raw);
    return iconed ? (
      <li key={i}>
        <ContentIcon name={itemIcon(block, item)} />
        <span>
          <Lead item={item} ctx={ctx} />
        </span>
      </li>
    ) : (
      <li key={i}>
        <Lead item={item} ctx={ctx} />
      </li>
    );
  });
  if (block.variant === "steps") return <ol>{items}</ol>;
  if (block.variant === "checks") return <ul className="ks-checks">{items}</ul>;
  if (block.variant === "tips") return <ul className="kh-card kh-card--tint kh-tone-sun ks-tips">{items}</ul>;
  return <ul>{items}</ul>;
}

/** A DS photo in the reading column (lazy: an article's one eager image is its head photo). */
export function ProseFigure({ block, ctx }: { block: FigureBlock; ctx: ProseContext }) {
  return <Photo image={block.image} variant={block.variant} caption={block.caption && rich(ctx, block.caption)} sizes={PROSE_SIZES} />;
}

function Block({ block, ctx }: { block: ProseBlock; ctx: ProseContext }): ReactNode {
  switch (block.kind) {
    case "p":
      return (
        <p className={block.variant === "gut" ? "ks-gut" : undefined}>
          <Lead item={block} ctx={ctx} />
        </p>
      );
    case "h3":
      return rich(ctx, block.text, "h3", "kh-subtitle");
    case "list":
      return <List block={block} ctx={ctx} />;
    case "questions":
      return (
        <div className="ks-questions">
          {block.items.map((q, i) => (
            <Fragment key={i}>
              {rich(ctx, q.question, "h3", "kh-subtitle")}
              {q.answer.map((a, j) => (
                <Fragment key={j}>{rich(ctx, a, "p")}</Fragment>
              ))}
            </Fragment>
          ))}
        </div>
      );
    case "quote":
      if (block.cite === undefined) {
        throw new Error(`A quote block names who said it (DS Testimonial: real words of real people): "${block.quote}"`);
      }
      return <Quote quote={rich(ctx, block.quote)} cite={{ name: rich(ctx, block.cite) }} />;
    case "callout":
      return (
        <Card as="div" variant="tint" tone={block.tone ?? "sun"} className="ks-try">
          <ContentIcon name={block.icon} />
          <p>
            <Lead item={block} ctx={ctx} />
          </p>
        </Card>
      );
    case "figure":
      return <ProseFigure block={block} ctx={ctx} />;
    case "facts":
      return (
        <TrustList
          variant="facts"
          bodyType="body"
          className="ks-facts-list"
          items={block.items.map((item) => ({
            icon: <ContentIcon name={item.icon} />,
            title: item.title === undefined ? undefined : rich(ctx, item.title),
            body: rich(ctx, item.body),
          }))}
        >
          {block.figure && <Photo image={block.figure} variant="square" className="ks-belly" sizes={BELLY_SIZES} />}
        </TrustList>
      );
    case "disclaimer":
      return rich(ctx, block.text, "p", "kh-body-s ks-disclaimer");
    default: {
      const unknown: never = block;
      throw new Error(`No approved markup for the prose block ${JSON.stringify(unknown)}`);
    }
  }
}

export interface ProseBlocksProps extends ProseContext {
  blocks: readonly ProseBlock[];
}

/** A run of prose blocks, in order, with no wrapper of their own. */
export function ProseBlocks({ blocks, ...ctx }: ProseBlocksProps) {
  return (
    <>
      {blocks.map((block, i) => (
        <Fragment key={i}>
          <Block block={block} ctx={ctx} />
        </Fragment>
      ))}
    </>
  );
}
