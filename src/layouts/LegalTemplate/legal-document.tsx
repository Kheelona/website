import clsx from "clsx";
import { Fragment, type ReactNode } from "react";
import { asIconName } from "@/components/sections/ArticleBody/content-icon";
import { ProseBlocks } from "@/components/sections/ArticleBody/ProseBlocks";
import { GrievanceBlock } from "@/components/sections/GrievanceBlock/GrievanceBlock";
import { SellerBlock } from "@/components/sections/SellerBlock/SellerBlock";
import { CompareTable } from "@/components/ui/CompareTable/CompareTable";
import { Icon } from "@/components/ui/Icon/Icon";
import { Container, Section } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import { seller } from "@/content/en-IN/seller";
import type { LeadText, Offer } from "@/content/types";
import { grievanceOfficerLine, legalSellerSentence } from "@/lib/content/seller-lines";
import type { LegalGroup, LegalPage, LegalPageBlock, LegalPagePart, LegalTemplateCopy, LegalVariant } from "./legal-template.types";

/* The document of a legal page (task 4.3): the contents list beside the numbered parts, as the four approved pages lay
 * it out (privacy.html, terms.html, refund.html, shipping.html: `mk-doc`, `mk-toc`, `mk-doc__part`). Every word from the
 * page's content; the grievance and seller lines from seller.ts through src/lib/content/seller-lines.ts, never retyped.
 * Server component. */

interface Ctx {
  readonly variant: LegalVariant;
  readonly copy: LegalTemplateCopy;
  readonly offer: Offer;
}

/** A line that may open with a bold label: the label, a space, the rest (the mockup's `<strong>` leads). */
function Lead({ item, offer }: { item: LeadText; offer: Offer }) {
  return (
    <>
      {item.lead !== undefined && (
        <strong>
          <RichText text={item.lead} offer={offer} />
        </strong>
      )}
      {item.lead !== undefined && item.text !== undefined && " "}
      {item.text !== undefined && <RichText text={item.text} offer={offer} />}
    </>
  );
}

/** One block of a part, as the legal mockups mark it up; prose kinds the legal pages share with the articles (bullet
 *  lists, quotes, figures) go through ArticleBody's ProseBlocks. */
function Block({ block, ctx }: { block: LegalPageBlock; ctx: Ctx }): ReactNode {
  const { variant, copy, offer } = ctx;
  const notice = variant === "notice";
  switch (block.kind) {
    case "p":
      return (
        <p id={block.id}>
          <Lead item={block} offer={offer} />
        </p>
      );
    case "h3":
      // Notice subheadings step up to kh-title's 24/30 from 1024 px (refund.css:70; mapping rows 50-51).
      return <RichText as="h3" className={clsx("kh-subtitle", notice && "ks-type-title@xl")} text={block.text} offer={offer} />;
    case "list":
      if (block.variant !== "steps") return <ProseBlocks blocks={[block]} offer={offer} />;
      // Numbered by the ks-step counter in a Sunshine circle (refund.css:52-54; mapping §6.4).
      return (
        <ol className="ks-doc__steps" role="list">
          {block.items.map((item, i) => (
            <li key={i}>
              <Lead item={typeof item === "string" ? { text: item } : item} offer={offer} />
            </li>
          ))}
        </ol>
      );
    case "callout":
      // A short remedy line set apart (refund.html:94): the card is the paragraph itself.
      return (
        <p className={clsx("kh-card kh-card--tint", `kh-tone-${block.tone ?? "sun"}`, "ks-doc__callout")}>
          <Icon name={asIconName(block.icon)} />
          <Lead item={block} offer={offer} />
        </p>
      );
    case "tools":
      // One quiet block per measuring tool (privacy.html part 5; mapping §6.3).
      return (
        <div className="ks-tools">
          {block.tools.map((tool, i) => (
            <div key={i} className="ks-tool">
              <RichText as="h3" className="kh-subtitle" text={tool.name} offer={offer} />
              <Blocks blocks={tool.blocks} ctx={ctx} />
            </div>
          ))}
        </div>
      );
    case "recipients":
      // One stacked row per recipient on phones, the DS table from 720 px (privacy.html part 7).
      return (
        <>
          <ul className="ks-recips" role="list">
            {block.rows.map((row, i) => (
              <li key={i}>
                <RichText as="p" className="kh-label" text={row.who} offer={offer} />
                <p className="kh-body-s">
                  <span className="ks-recips__k">{block.keys.what}</span> <RichText text={row.what} offer={offer} />
                </p>
                <p className="kh-body-s">
                  <span className="ks-recips__k">{block.keys.where}</span> <RichText text={row.where} offer={offer} />
                </p>
              </li>
            ))}
          </ul>
          <CompareTable
            label={block.label}
            firstColumn={block.headings.who}
            columns={[block.headings.what, block.headings.where]}
            rows={block.rows.map((row) => ({
              label: <RichText text={row.who} offer={offer} />,
              cells: [{ text: <RichText text={row.what} offer={offer} /> }, { text: <RichText text={row.where} offer={offer} /> }],
            }))}
            className="ks-recips-table"
          />
        </>
      );
    case "grievance":
      // D032 verbatim, with the complaint-reference line on all four pages; notice keeps "Co-Founder" whole.
      return <GrievanceBlock context="legal" line={grievanceOfficerLine(seller, { nowrap: notice })} note={copy.grievanceNote} className="ks-doc__card" />;
    case "seller":
      // A card with the page's bold lead (reference), or a plain line with its phrases kept together (notice).
      return notice ? (
        <SellerBlock context="legal" line={{ lead: block.lead, text: legalSellerSentence(seller, { nowrap: true }) }} card={false} />
      ) : (
        <SellerBlock context="legal" line={{ lead: block.lead, text: legalSellerSentence(seller) }} className="ks-doc__card" />
      );
    case "card":
      return (
        <div className="kh-card ks-doc__card">
          <p>
            <Lead item={block} offer={offer} />
          </p>
        </div>
      );
    default:
      return <ProseBlocks blocks={[block]} offer={offer} />;
  }
}

function Blocks({ blocks, ctx }: { blocks: readonly LegalPageBlock[]; ctx: Ctx }) {
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

/** The contents list's words: the part's own, or its title without the closing full stop. */
const contentsLabel = (part: LegalPagePart) => part.contents ?? part.title.replace(/\.$/, "");

interface Numbered {
  readonly part: LegalPagePart;
  /** Counted through the whole document, across groups (terms: 1-16). */
  readonly n: number;
}
interface Run {
  readonly group?: LegalGroup;
  readonly parts: readonly Numbered[];
}

/** Consecutive parts with the same `group` share one contents heading and one eyebrow (terms.html). */
function runsOf(doc: LegalPage): Run[] {
  const runs: { group?: LegalGroup; parts: Numbered[] }[] = [];
  doc.parts.forEach((part, i) => {
    const last = runs.at(-1);
    if (last && last.group?.label === part.group) {
      last.parts.push({ part, n: i + 1 });
      return;
    }
    const group = part.group === undefined ? undefined : doc.groups?.find((g) => g.label === part.group);
    if (part.group !== undefined && group === undefined) {
      throw new Error(`The part "${part.id}" belongs to the group "${part.group}", which has no entry in the page's groups (its eyebrow).`);
    }
    runs.push({ group, parts: [{ part, n: i + 1 }] });
  });
  return runs;
}

const groupId = (i: number) => `toc-part-${i + 1}`;

/** "On this page": a jump list to every part (terms: in its three groups). */
function Contents({ runs, ctx }: { runs: readonly Run[]; ctx: Ctx }) {
  const grouped = runs.some((run) => run.group !== undefined);
  return (
    <nav className={clsx("kh-card ks-toc", grouped && "ks-toc--groups")} aria-labelledby="toc-title">
      <RichText as="h2" className="kh-eyebrow" id="toc-title" text={ctx.copy.contents} />
      {runs.map((run, i) => (
        <Fragment key={i}>
          {run.group && <RichText as="h3" className="kh-label-s ks-toc__group" id={groupId(i)} text={run.group.label} />}
          <ol role="list" aria-labelledby={run.group && groupId(i)}>
            {run.parts.map(({ part, n }) => (
              <li key={part.id}>
                <a href={`#${part.id}`}>
                  <span className="ks-toc__n">{n}.</span>
                  <RichText as="span" text={contentsLabel(part)} offer={ctx.offer} />
                </a>
              </li>
            ))}
          </ol>
        </Fragment>
      ))}
    </nav>
  );
}

/** One numbered part. Reference: the section is the anchor and its number is muted (privacy.css:29, 32); notice: the
 *  heading is the anchor, its number plain, and it steps up to 32/38 at 700 from 1024 px (refund.css:37, 69; §6.5). */
function Part({ part, n, ctx }: Numbered & { ctx: Ctx }) {
  const { offer } = ctx;
  const title = <RichText text={part.title} offer={offer} />;
  const answer = part.answer !== undefined && (
    <RichText as="p" className="ks-doc__answer ks-type-body-l ks-type-lead@xl" text={part.answer} offer={offer} />
  );
  if (ctx.variant === "notice") {
    return (
      <section className="ks-doc__part" aria-labelledby={part.id}>
        <h2 className="kh-title ks-type-headline@xl" id={part.id}>
          {n}. {title}
        </h2>
        {answer}
        <Blocks blocks={part.blocks} ctx={ctx} />
      </section>
    );
  }
  const titleId = `${part.id}-title`;
  return (
    <section className="ks-doc__part" id={part.id} aria-labelledby={titleId}>
      <h2 className="kh-title" id={titleId}>
        <span className="ks-doc__n">{n}.</span> {title}
      </h2>
      {answer}
      <Blocks blocks={part.blocks} ctx={ctx} />
    </section>
  );
}

export interface LegalDocumentProps extends Ctx {
  readonly doc: LegalPage;
}

/** The contents list and the parts (privacy.html fold 3 and the full policy; refund.html folds 3 and 4). */
export function LegalDocument({ doc, ...ctx }: LegalDocumentProps) {
  const runs = runsOf(doc);
  return (
    <Section as="div" className={clsx("ks-doc", `ks-doc--${ctx.variant}`)}>
      <Container className="ks-doc__grid">
        <Contents runs={runs} ctx={ctx} />
        <div className="ks-doc__body ks-type-body ks-type-body-l@xl">
          {runs.map((run, i) => (
            <Fragment key={i}>
              {run.group && <RichText as="p" className="kh-eyebrow ks-doc__group" text={run.group.eyebrow} offer={ctx.offer} />}
              {run.parts.map(({ part, n }) => (
                <Part key={part.id} part={part} n={n} ctx={ctx} />
              ))}
            </Fragment>
          ))}
        </div>
      </Container>
    </Section>
  );
}
