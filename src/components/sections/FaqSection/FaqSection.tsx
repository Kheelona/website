import clsx from "clsx";
import type { FaqItem, LeadText, Offer, ProseBlock } from "@/content/types";
import { SectionLinkRow, SectionTitle } from "@/components/sections/FeatureSplit/section-parts";
import { FaqList } from "@/components/ui/FaqList/FaqList";
import { HelpLine } from "@/components/ui/HelpLine/HelpLine";
import { Icon } from "@/components/ui/Icon/Icon";
import { Container, Section, Split } from "@/components/ui/Layout/Layout";
import { Photo } from "@/components/ui/Photo/Photo";
import { RichText, type SourceMarkerOptions } from "@/components/ui/RichText/RichText";
import { SourcesNote } from "@/components/ui/SourceMarker/SourcesNote";
import type { FaqSectionProps } from "./faq-section.types";

export type { FaqSectionConfig, FaqSectionProps } from "./faq-section.types";

/**
 * The FAQ fold (task 3.3; components §2; DS FAQ through `FaqList`). Three layouts of the approved mockup:
 * - `default`: the heading column (`ks-faq-head`) beside the questions, which reveal once on scroll; then, on the
 *   product page, the D025 line (`ks-faq__disclaimer`, its own name: the article disclaimer is another block,
 *   mockup-css-mapping §6.2), the source note and the help line; on Home the "See all questions" link
 *   (home.html and meet-kheelu.html fold 8);
 * - `photo`: heading, photo and questions on one grid, the photo under the questions on phones and under the
 *   heading on laptops (`ks-faq-photo`; safety.html fold 7, ai-toys-for-kids-in-india.html fold 5); the inline
 *   sources arrive in `notes`;
 * - `store`: the store's h2 (`ks-h2`, the store's section heading, StoreDetails) and the questions at the column's
 *   width (store.html fold 5).
 * The questions open with the native `<details>` (D049 pick 7 animates them through FaqList's class contract).
 * The page keeps the `#faq` fragment ("See all questions" links to it). The FAQPage JSON-LD is the page
 * template's, built from the same items with `faqPlainItems`.
 */
export function FaqSection(props: FaqSectionProps) {
  const { offer } = props;
  const markers = props.variant === "store" ? undefined : props.sourceMarker;
  const list = (options: { reveal?: boolean; firstOpen?: boolean }) => (
    <FaqList items={faqItems(props.items, offer, markers ? { label: markers } : undefined)} sign={<Icon name="plus" />} {...options} />
  );

  if (props.variant === "store") {
    return (
      <section className="ks-faq" aria-labelledby={props.heading.id}>
        <RichText as="h2" className="kh-title ks-h2" id={props.heading.id} text={props.heading.title} offer={offer} />
        {list({})}
      </section>
    );
  }

  const { heading, id = "faq", band } = props;
  const title = <SectionTitle heading={heading} offer={offer} className={props.variant === "photo" ? "ks-faq-photo__head" : undefined} />;

  if (props.variant === "photo") {
    const { photo } = props;
    return (
      <Section id={id} band={band} labelledBy={heading.id}>
        <Container className="ks-faq-photo">
          {title}
          <Photo
            image={photo.image}
            sizes={photo.sizes}
            variant={photo.variant}
            reveal
            className={clsx("ks-faq-photo__photo", photo.clamp && "ks-faq-photo__photo--clamp")}
          />
          <div className="ks-faq-photo__body">
            {list({ firstOpen: props.firstOpen })}
            {props.notes}
            <SectionLinkRow link={props.more} />
          </div>
        </Container>
      </Section>
    );
  }

  const { disclaimer, sources, help } = props;
  return (
    <Section id={id} band={band} labelledBy={heading.id}>
      <Container>
        <Split wide="end">
          <div className="ks-faq-head">{title}</div>
          <div>
            {list({ reveal: true })}
            {disclaimer && (
              <p className="kh-body-s ks-faq__disclaimer">
                <Icon name={disclaimer.icon} />
                <RichText as="span" text={disclaimer.text} offer={offer} />
              </p>
            )}
            {sources && <SourcesNote label={sources.label} sources={sources.items} className="ks-faq__sources" />}
            {props.notes}
            {help && (
              <HelpLine
                icon={help.icon && <Icon name={help.icon} />}
                lead={help.lead === undefined ? undefined : <RichText text={help.lead} offer={offer} />}
                contact={<RichText text={help.contact} offer={offer} />}
                className="ks-faq__help"
              />
            )}
            <SectionLinkRow link={props.more} />
          </div>
        </Split>
      </Container>
    </Section>
  );
}

/** The page's FAQ items as FaqList rows: every string through RichText, prices from the offer. */
function faqItems(items: readonly FaqItem[], offer: Offer | undefined, sources: SourceMarkerOptions | undefined) {
  return items.map((item) => ({
    id: item.id,
    question: <RichText text={item.question} offer={offer} />,
    answer: <RichText text={item.answer} offer={offer} sources={sources} />,
    detail: item.detail?.map((block, i) => <DetailBlock key={i} block={block} offer={offer} sources={sources} />),
  }));
}

interface DetailProps {
  block: ProseBlock;
  offer: Offer | undefined;
  sources: SourceMarkerOptions | undefined;
}

/** A bold lead, a space, then the text (`<strong>Replies:</strong> its answers…`, safety.html fold 7). */
function Lead({ value, offer, sources }: { value: LeadText } & Omit<DetailProps, "block">) {
  return (
    <>
      {value.lead !== undefined && (
        <strong>
          <RichText text={value.lead} offer={offer} sources={sources} />
        </strong>
      )}
      {value.lead !== undefined && value.text !== undefined && " "}
      {value.text !== undefined && <RichText text={value.text} offer={offer} sources={sources} />}
    </>
  );
}

/** The blocks an FAQ answer may hold after its first paragraph: paragraphs, and bullet lists (safety.css:47-48). */
function DetailBlock({ block, offer, sources }: DetailProps) {
  if (block.kind === "p") {
    return (
      <p>
        <Lead value={block} offer={offer} sources={sources} />
      </p>
    );
  }
  if (block.kind === "list" && (block.variant ?? "bullets") === "bullets") {
    return (
      <ul className="ks-faq__list">
        {block.items.map((item, i) => (
          <li key={i}>{typeof item === "string" ? <RichText text={item} offer={offer} sources={sources} /> : <Lead value={item} offer={offer} sources={sources} />}</li>
        ))}
      </ul>
    );
  }
  throw new Error(`FaqSection: an FAQ answer's detail holds paragraphs and bullet lists only, not a ${block.kind} block`);
}
