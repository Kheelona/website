import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { Heading } from "@/components/ui/Heading/Heading";
import { Icon } from "@/components/ui/Icon/Icon";
import { Container, Section, Split } from "@/components/ui/Layout/Layout";
import { Photo } from "@/components/ui/Photo/Photo";
import { imageRatio } from "@/components/ui/Photo/image";
import { formatDate } from "@/lib/format/date";
import type { ArticleHeadConfig } from "./article-head.types";

/**
 * An article's head (task 3.4; story-*.html fold 1): the band header of the first screen with the crumbs, the one h1
 * (the DS hero heading, stepped to display-l from 1024 px on an inner span, mapping row 81), the lead, the byline and
 * the head photo, the page's one LCP image. The photo's own shape sets the layout, as the approved heads do: a portrait
 * photo sits in the DS 4:5 frame beside the wider words (`kh-split--wide-start`); a wide one in the 16:9 frame, in
 * two even columns. An article with no photo yet shows the words alone. It carries `ks-hero`, the hero's first-screen
 * spacing (HeroSection, task 3.3; the mockup's hero hook on the same element). Server component.
 */
export type ArticleHeadProps = ArticleHeadConfig;

/** Two columns from 900 px: the 4:5 photo at most 384 px wide (article-head.css); the 16:9 photo half the content. */
const PORTRAIT_SIZES = "(min-width: 900px) 384px, calc(100vw - 32px)";
const WIDE_SIZES = "(min-width: 1024px) 584px, (min-width: 900px) 50vw, calc(100vw - 32px)";

export function ArticleHead({ head, published, trail, labels, titleId = "story-title" }: ArticleHeadProps) {
  const words = (
    <div>
      <Breadcrumbs trail={trail} label={labels.breadcrumb} separator={<Icon name="caret-right" />} />
      <Heading as="div" hero level={1} id={titleId} title={head.title} lead={head.lead} titleStepXl="display-l" />
      <p className="kh-body-s ks-byline">
        {`${head.author} · `}
        <span className="ks-nowrap">
          {`${labels.published} `}
          <time dateTime={published}>{formatDate(published, "ui")}</time>
        </span>
        {labels.readTime !== undefined && (
          <>
            {" · "}
            <span className="ks-nowrap">{labels.readTime}</span>
          </>
        )}
      </p>
    </div>
  );
  const portrait = head.image !== undefined && imageRatio(head.image) > 1;
  return (
    <Section as="header" band className="ks-hero ks-story-head">
      <Container>
        {head.image === undefined ? (
          words
        ) : (
          <Split wide={portrait ? "start" : undefined}>
            {words}
            <Photo image={head.image} variant={portrait ? undefined : "wide"} sizes={portrait ? PORTRAIT_SIZES : WIDE_SIZES} lcp />
          </Split>
        )}
      </Container>
    </Section>
  );
}
