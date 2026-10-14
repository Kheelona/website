import clsx from "clsx";
import type { ReactNode } from "react";
import { AppScreens } from "@/components/ui/AppScreens/AppScreens";
import { ArtBoard } from "@/components/ui/ArtBoard/ArtBoard";
import { Card } from "@/components/ui/Card/Card";
import { ChipList } from "@/components/ui/Chip/Chip";
import { Icon } from "@/components/ui/Icon/Icon";
import { ImaginationFrame } from "@/components/ui/ImaginationFrame/ImaginationFrame";
import { Cols, Container, Section, SectionHead, Split } from "@/components/ui/Layout/Layout";
import { Photo } from "@/components/ui/Photo/Photo";
import { Quote } from "@/components/ui/Quote/Quote";
import { RichText } from "@/components/ui/RichText/RichText";
import { SourcesNote } from "@/components/ui/SourceMarker/SourcesNote";
import { Sticker } from "@/components/ui/Sticker/Sticker";
import { TrustList } from "@/components/ui/TrustList/TrustList";
import type { Copy, Offer } from "@/content/types";
import type { FeatureItem, FeatureMedia, FeatureSplitConfig, FeatureSplitProps } from "./feature-split.types";
import { SectionLinkRow, SectionTitle } from "./section-parts";

export type { FeatureSplitConfig, FeatureSplitProps } from "./feature-split.types";

/** Rendered widths: the narrow column of a 7:5 split from 900 px (480 px at the 1200 px content max), the full column
 *  below; the plush board stops at 480 px on tablets (ks-art--clamp). */
const NARROW_COLUMN = "(min-width: 1296px) 480px, (min-width: 900px) 40vw, calc(100vw - 32px)";
const PLUSH_BOARD = "(min-width: 1296px) 480px, (min-width: 900px) 40vw, (min-width: 720px) 480px, calc(100vw - 32px)";
/** One phone: half of Home's 576 px row, of the product page's 536 px row (mockup.css:149, meet-kheelu.css:50), the
 *  safety page's 272/300 px phone (safety.css:26, 29). */
const SCREEN_SIZES = {
  home: "(min-width: 900px) 280px, calc((100vw - 48px) / 2)",
  product: "(min-width: 900px) 260px, calc((100vw - 48px) / 2)",
  safety: "(min-width: 900px) 300px, 272px",
} as const;
/** The setup photos: the tummy-unit crop up to 384 px, the phone screenshot at 288 px (setup.css:30, 33). */
const FIT_SIZES = { belly: "(min-width: 416px) 384px, calc(100vw - 32px)", shot: "288px" } as const;

type Text = (copy: Copy) => ReactNode;

/**
 * Words beside media (task 3.3; components §2): a DS split with a heading and a body slot (rich text, `Card`,
 * `TrustList`, `Quote`, `SourcesNote`) beside a media slot (`ImaginationFrame`, `AppScreens`, `Photo`, `ArtBoard`),
 * in the layouts the approved mockup uses (see feature-split.types.ts). The /safety layout renders the DS device
 * through `AppScreens variant="safety"` and never restyles it (its values live in app-screens.css). Media and word
 * blocks reveal once on scroll where the mockup marks them; links are ghost links with their arrow, or secondary
 * buttons with their icon first.
 */
export function FeatureSplit(props: FeatureSplitProps) {
  const { offer } = props;
  const text: Text = (copy) => <RichText text={copy} offer={offer} />;

  if (props.variant === "pair") {
    return (
      <Section as="div" id={props.id} band={props.band}>
        <Container>
          <Cols count={2} className="ks-sf-pair">
            {props.cards.map((card) => (
              <Card key={card.heading.id} as="section" labelledBy={card.heading.id} reveal>
                <SectionTitle heading={card.heading} offer={offer} />
                <Paragraphs copy={card.copy} offer={offer} />
                <SectionLinkRow link={card.link} />
              </Card>
            ))}
          </Cols>
        </Container>
      </Section>
    );
  }

  const { heading, id, band } = props;
  const title = <SectionTitle heading={heading} offer={offer} />;
  return (
    <Section id={id} band={band} labelledBy={heading.id}>
      <Container>
        <Body config={props} title={title} text={text} offer={offer} after={props.after} />
      </Container>
    </Section>
  );
}

function Body({
  config,
  title,
  text,
  offer,
  after,
}: {
  config: Exclude<FeatureSplitConfig, { variant: "pair" }>;
  title: ReactNode;
  text: Text;
  offer: Offer | undefined;
  after: ReactNode;
}) {
  switch (config.variant) {
    case "imagination": {
      const { card, frame, sources } = config;
      const markers = sources ? { label: sources.marker } : undefined;
      return (
        <>
          <SectionHead>{title}</SectionHead>
          <Split wide="start">
            <Cols reveal>
              <RichText as="p" className="kh-body-l" text={config.text} offer={offer} sources={markers} />
              <div>
                <Card tone={card.tone} variant={card.tint ? "tint" : "plain"} icon={<Icon name={card.icon} />} title={text(card.title)} body={text(card.body)} />
                {config.aside !== undefined && <RichText as="p" className="kh-body-s" text={config.aside} offer={offer} />}
              </div>
            </Cols>
            <ImaginationFrame
              photo={frame.photo}
              sizes={NARROW_COLUMN}
              doodles={frame.doodles}
              question={frame.question === undefined ? undefined : text(frame.question)}
              zoom={frame.zoom}
              reveal
            />
          </Split>
          {sources && <SourcesNote label={sources.label} sources={sources.items} />}
          <SectionLinkRow link={config.link} center />
        </>
      );
    }
    case "app-screens":
      return <AppScreensBody config={config} title={title} text={text} />;
    case "photo": {
      const { media, split } = config;
      const words = (
        <>
          {config.text !== undefined && <RichText as="p" className="kh-body-l ks-gd-plush-text" text={config.text} offer={offer} />}
          {config.copy && <Paragraphs copy={config.copy} offer={offer} className="ks-feature-copy" />}
        </>
      );
      if (!media) {
        return (
          <Split wide={split} className="ks-setup-split">
            {title}
            {words}
          </Split>
        );
      }
      return (
        <Split wide={split}>
          <div>
            {title}
            {words}
            <SectionLinkRow link={config.link} />
          </div>
          <Media media={media} text={text} />
        </Split>
      );
    }
    case "ticks":
      return (
        <>
          <SectionHead>{title}</SectionHead>
          <TrustList items={trustItems(config.items, text)} />
          {after}
        </>
      );
    case "quote": {
      const { quote } = config;
      return (
        <>
          <Split>
            <div>
              {title}
              <Paragraphs copy={config.copy} offer={offer} className="ks-feature-copy" subtitle={config.subtitle} />
            </div>
            <Quote
              quote={text(quote.text)}
              cite={{ name: text(quote.name), role: quote.role === undefined ? undefined : text(quote.role), initials: quote.initials, photo: quote.photo }}
              tone={quote.tone}
            />
          </Split>
          <SectionLinkRow link={config.link} />
        </>
      );
    }
  }
}

function AppScreensBody({ config, title, text }: { config: Extract<FeatureSplitConfig, { variant: "app-screens" }>; title: ReactNode; text: Text }) {
  const { placement, screens, items, skills, note, link } = config;
  const caption = screens.caption === undefined ? undefined : text(screens.caption);
  let media: ReactNode;
  if (placement === "safety") {
    if (screens.images.length !== 1) throw new Error("FeatureSplit: the safety page's parent controls show one screen (AppScreens `safety`)");
    media = <AppScreens variant="safety" screens={[screens.images[0]]} sizes={SCREEN_SIZES.safety} caption={caption} reveal />;
  } else {
    media = <AppScreens variant={placement} screens={screens.images} sizes={SCREEN_SIZES[placement]} caption={caption} reveal />;
  }
  const list = items && <TrustList items={trustItems(items, text)} reveal={placement === "safety"} className={placement === "safety" ? "ks-sf-controls" : undefined} />;

  if (placement === "home") {
    // Home fold 5: the heading over the split; the lines and the link reveal together beside the phones.
    return (
      <>
        <SectionHead>{title}</SectionHead>
        <Split>
          <div data-reveal="">
            {list}
            <SectionLinkRow link={link} />
          </div>
          {media}
        </Split>
      </>
    );
  }
  if (placement === "product") {
    // Product fold 5: words, skills and note; the phones span both rows on laptops; the link sits under the words.
    return (
      <Split className="ks-app-split">
        <div>
          {title}
          {skills && <ChipList label={skills.label} items={skills.items} tone="sun" className="ks-skills" />}
          {note !== undefined && <p className="kh-body-s ks-app-note">{text(note)}</p>}
        </div>
        {media}
        <SectionLinkRow link={link} />
      </Split>
    );
  }
  // Safety fold 4: the parent controls under the heading, beside the one privacy screen in the DS frame.
  return (
    <Split wide="start">
      <div>
        {title}
        {list}
        <SectionLinkRow link={link} />
      </div>
      {media}
    </Split>
  );
}

/** Paragraphs in `kh-body-l`, bare or in a measured block, with an optional closing line in the subtitle style. */
function Paragraphs({ copy, offer, className, subtitle }: { copy: readonly Copy[]; offer: Offer | undefined; className?: string; subtitle?: Copy }) {
  const lines = (
    <>
      {copy.map((line, i) => (
        <RichText key={i} as="p" className="kh-body-l" text={line} offer={offer} />
      ))}
      {subtitle !== undefined && <RichText as="p" className="kh-subtitle" text={subtitle} offer={offer} />}
    </>
  );
  return className ? <div className={className}>{lines}</div> : lines;
}

function Media({ media, text }: { media: FeatureMedia; text: Text }) {
  if (media.kind === "art") {
    const { art, plush } = media;
    return (
      <ArtBoard
        tone={art.tone}
        label={art.label}
        layers={art.layers}
        sizes={plush ? PLUSH_BOARD : NARROW_COLUMN}
        sticker={art.sticker && <Sticker {...art.sticker} />}
        clamp={plush}
        reveal
        className={plush ? "ks-gd-plush-art" : undefined}
      />
    );
  }
  return (
    <Photo
      image={media.image}
      sizes={media.fit ? FIT_SIZES[media.fit] : NARROW_COLUMN}
      variant={media.variant}
      ratio={media.ratio}
      caption={media.caption === undefined ? undefined : text(media.caption)}
      className={clsx(media.fit && `ks-setup-${media.fit}`)}
    />
  );
}

function trustItems(items: readonly FeatureItem[], text: Text) {
  return items.map((item) => ({
    icon: <Icon name={item.icon} />,
    title: item.title === undefined ? undefined : text(item.title),
    body: text(item.body),
  }));
}
