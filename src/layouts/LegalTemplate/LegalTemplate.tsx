import clsx from "clsx";
import { Fragment } from "react";
import { ArtBoard } from "@/components/ui/ArtBoard/ArtBoard";
import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { Heading } from "@/components/ui/Heading/Heading";
import { HelpLine } from "@/components/ui/HelpLine/HelpLine";
import { asIconName, Icon } from "@/components/ui/Icon/Icon";
import { Actions, Container, Section, SectionHead, Split } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import { Sticker } from "@/components/ui/Sticker/Sticker";
import { TrustList } from "@/components/ui/TrustList/TrustList";
import type { LinkRef, Offer } from "@/content/types";
import { formatDate } from "@/lib/format/date";
import { CTA_IDS, type CtaId } from "@/lib/tracking/cta";
import { LegalDocument } from "./legal-document";
import type { LegalPage, LegalTemplateCopy, LegalTemplateProps, LegalVariant } from "./legal-template.types";

/**
 * The legal pages' template (task 4.3; architecture §5.2 "Legal layout"; structure §5): privacy, terms, refund and
 * shipping, in the approved mockups' order. The draft note while the document is a draft, the hero and the last-updated
 * line; the short version (a trust list, or terms' numbered points); the contents list beside the numbered parts
 * (tools and recipients on privacy, the seller and grievance blocks from seller.ts); the close. No pre-order button and
 * nothing that moves (strategy §5, policy row; D049: the hero is still).
 *
 * One CSS file (legal-template.css) replaces the four mockup copies as two families behind `variant`
 * (mockup-css-mapping §6.1): `reference` (privacy, terms) and `notice` (refund, shipping). The template renders the
 * page's sections straight into the shell's <main>, as the mockup does, so each block carries the family modifier
 * its rules need. Server component; every word from content.
 */

/** The notice hero's board: the narrow column of the 7:5 split from 900 px (bundle.css:1136-1139; the board is hidden
 *  below 900 px, refund.css:17). (1200 − 48) × 5/12 = 480 from 1296 px; with 48 px gutters from 1024 px; 16 below. */
const DOC_ART_SIZES = "(min-width: 1296px) 480px, (min-width: 1024px) calc(41.67vw - 60px), calc(41.67vw - 33px)";

/** A close action's tracking value, refused unless it is a registered value an element may carry (src/lib/tracking/cta.ts);
 *  the Button refuses a value whose role is not secondary. */
function ctaOf(action: LinkRef): CtaId | undefined {
  if (action.cta === undefined) return undefined;
  if (!(CTA_IDS as readonly string[]).includes(action.cta)) {
    throw new Error(`"${action.cta}" is not a tracking value an element may carry (src/lib/tracking/cta.ts).`);
  }
  return action.cta as CtaId;
}

function Updated({ doc, copy }: { doc: LegalPage; copy: LegalTemplateCopy }) {
  const date = doc.approvedOn;
  return (
    <p className="kh-body-s ks-updated">
      <RichText text={copy.updated} /> {typeof date === "string" ? formatDate(date, "long") : <RichText text={date} />}
    </p>
  );
}

function DraftNote({ variant, copy }: { variant: LegalVariant; copy: LegalTemplateCopy }) {
  if (variant === "reference") return <RichText as="p" className="kh-body-s ks-draft" text={copy.draftNote} />;
  return (
    <p className="kh-body-s ks-draft ks-draft--notice">
      <Icon name="info" />
      <RichText as="span" text={copy.draftNote} />
    </p>
  );
}

/** Fold 0 and 1: the draft note, the hero heading (the page's one h1) and the last-updated line; on a notice page
 *  Kheelu's note on a board beside them from 900 px. */
function LegalHero({ doc, variant, copy, offer }: LegalTemplateProps) {
  const titleId = `${doc.slug}-title`;
  const words = (
    <>
      {doc.status === "draft" && <DraftNote variant={variant} copy={copy} />}
      <Heading hero level={1} eyebrow={doc.hero.eyebrow} title={doc.hero.title} lead={doc.hero.lead} id={titleId} offer={offer} />
      <Updated doc={doc} copy={copy} />
    </>
  );
  const art = doc.hero.art;
  return (
    <Section labelledBy={titleId} className={clsx("ks-hero", variant === "reference" && "ks-doc-hero")}>
      <Container>
        {art ? (
          <Split wide="start">
            <div>{words}</div>
            <ArtBoard
              hero
              tone={art.tone}
              label={art.label}
              layers={art.layers}
              sizes={DOC_ART_SIZES}
              ratio="4 / 3"
              className="ks-doc-art"
              sticker={art.sticker && <Sticker as="p" {...art.sticker} />}
            />
          </Split>
        ) : (
          words
        )}
      </Container>
    </Section>
  );
}

/** Fold 2: the short version, a trust list or terms' numbered points in a Sunshine panel; on a notice page the help
 *  line under it. */
function LegalSummary({ doc, variant, offer }: LegalTemplateProps) {
  const { summary } = doc;
  return (
    <Section band labelledBy="short-title" className={clsx("ks-doc-summary", variant === "notice" && "ks-doc-summary--notice")}>
      <Container>
        <SectionHead>
          <Heading title={summary.title} id="short-title" offer={offer} />
        </SectionHead>
        {summary.kind === "trust" ? (
          <TrustList
            items={summary.items.map((item) => ({
              icon: <Icon name={asIconName(item.icon)} />,
              title: item.title === undefined ? undefined : <RichText text={item.title} offer={offer} />,
              body: <RichText text={item.body} offer={offer} />,
            }))}
          />
        ) : (
          <Card as="div" variant="tint" tone="sun" className="ks-short-panel">
            <ol className="ks-short kh-body-l" role="list">
              {summary.points.map((point, i) => (
                <li key={i}>
                  {point.lead !== undefined && (
                    <strong>
                      <RichText text={point.lead} offer={offer} />
                    </strong>
                  )}
                  {point.lead !== undefined && point.text !== undefined && " "}
                  {point.text !== undefined && <RichText text={point.text} offer={offer} />}
                </li>
              ))}
            </ol>
          </Card>
        )}
        {doc.help !== undefined && (
          <HelpLine size="body" icon={<Icon name="whatsapp-logo" />} contact={<RichText text={doc.help} offer={offer} />} className="ks-doc-help" />
        )}
      </Container>
    </Section>
  );
}

/** The close: one tinted card, centred. Reference: blue, the secondary button, the related pages and the help line;
 *  notice: Sunshine, a heading, the secondary button with its tracking value and a ghost link. No pre-order button. */
function LegalClose({ doc, variant, offer }: LegalTemplateProps) {
  const close = doc.close;
  if (close === undefined) return null;
  const titled = close.title !== undefined;
  return (
    <Section
      as={titled ? "section" : "div"}
      labelledBy={titled ? "close-title" : undefined}
      className={clsx("ks-doc-close", `ks-doc-close--${variant}`)}
    >
      <Container>
        <Card as="div" variant="tint" tone={variant === "reference" ? "blue" : "sun"}>
          {titled && <Heading align="center" title={close.title!} lead={close.lead} id="close-title" offer={offer} />}
          <Actions center>
            {close.actions.map((action, i) =>
              i === 0 ? (
                <Button key={i} variant="secondary" href={action.href} iconEnd="arrow-right" cta={ctaOf(action)}>
                  {action.label}
                </Button>
              ) : (
                <Fragment key={i}>
                  {" "}
                  <Button variant="ghost" href={action.href} cta={ctaOf(action)}>
                    {action.label}
                  </Button>
                </Fragment>
              ),
            )}
          </Actions>
          {close.also && <AlsoRead also={close.also} offer={offer} />}
          {close.help !== undefined && <HelpLine icon={<Icon name="whatsapp-logo" />} contact={<RichText text={close.help} offer={offer} />} />}
        </Card>
      </Container>
    </Section>
  );
}

/** "Also read:" and the related pages, spaced by the row's gap (privacy.css:53-56). */
function AlsoRead({ also, offer }: { also: NonNullable<NonNullable<LegalPage["close"]>["also"]>; offer: Offer }) {
  return (
    <p className="kh-body-s ks-also">
      <RichText as="span" className="ks-also__label" text={also.label} />
      {also.links.map((link) => (
        <Fragment key={link.href}>
          {" "}
          <RichText text={`[${link.label}](${link.href})`} offer={offer} />
        </Fragment>
      ))}
    </p>
  );
}

export function LegalTemplate(props: LegalTemplateProps) {
  return (
    <>
      <LegalHero {...props} />
      <LegalSummary {...props} />
      <LegalDocument doc={props.doc} variant={props.variant} copy={props.copy} offer={props.offer} />
      <LegalClose {...props} />
    </>
  );
}
