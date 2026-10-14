import { AnswerSection } from "@/components/sections/AnswerSection/AnswerSection";
import { ArticleBody } from "@/components/sections/ArticleBody/ArticleBody";
import { ArticleHead } from "@/components/sections/ArticleHead/ArticleHead";
import { CloseSection } from "@/components/sections/CloseSection/CloseSection";
import { RelatedGuides } from "@/components/sections/RelatedGuides/RelatedGuides";
import { SourcesSection } from "@/components/sections/SourcesSection/SourcesSection";
import { cta } from "@/content/en-IN/cta";
import { seller } from "@/content/en-IN/seller";
import { articlePageCopy } from "@/content/en-IN/stories/articles";
import { trustItems } from "@/content/en-IN/trust";
import type { Article, Offer } from "@/content/types";
import { jsonLd } from "@/lib/seo/jsonld";
import { articleGraph, articleTrail, closeArt, relatedGuides } from "./article-page";

export { articleMeta } from "./article-page";

/** The h1's id, which names the article. */
const TITLE_ID = "story-title";

export interface ArticleTemplateProps {
  /** The article, from the journal registry (src/content/en-IN/stories/journal.ts). */
  readonly article: Article;
  /** The live offer: the close's price sentence, and any amount in the text. */
  readonly offer: Offer;
}

/**
 * An article page (task 4.2; structure §5; story-*.html), from its content module alone. The article, named by its h1:
 * the head (crumbs to the hub and the topic, byline with the stored first-published date and the read time, the head
 * photo as the page's LCP image), then the reading column (the answer first, the parts and their photos, the numbered
 * sources last). Then the close the module names: `journal`, the related guides band and the journal close with the
 * pre-order button (`finale`); or `keep`, the keep-reading close with no pre-order button (B5). Last, the page's own
 * graph: BlogPosting and BreadcrumbList (architecture §9.2). Nothing reveals (no article mockup has `data-reveal`); the
 * phone buy bar is the shell's, on the articles whose close carries the button (sticky-bar-paths.ts). Server component.
 */
export function ArticleTemplate({ article, offer }: ArticleTemplateProps) {
  const copy = articlePageCopy;
  const related = relatedGuides(article);
  const { readMinutes } = article.head;
  const sourceLabel = copy.sources.marker;
  return (
    <>
      <article className="ks-story" aria-labelledby={TITLE_ID}>
        <ArticleHead
          head={article.head}
          published={article.published}
          trail={articleTrail(article)}
          labels={{
            breadcrumb: copy.crumbs.label,
            published: copy.byline.published,
            readTime: readMinutes === undefined ? undefined : copy.byline.readTime(readMinutes),
          }}
          titleId={TITLE_ID}
        />
        <ArticleBody
          blocks={article.body}
          offer={offer}
          sourceLabel={sourceLabel}
          videoLabel={copy.videoLabel}
          before={article.answer && <AnswerSection variant="article" {...article.answer} offer={offer} sourceLabel={sourceLabel} />}
          after={<SourcesSection variant="article" label={copy.sources.title} sources={article.sources} />}
        />
      </article>
      {article.close === "journal" ? (
        <>
          <RelatedGuides variant="related" title={copy.related.title} items={related} />
          <CloseSection
            variant="journal"
            heading={copy.close.heading}
            cta={{
              cta: copy.close.cta,
              arrow: true,
              block: true,
              trust: copy.close.trust.map((id) => trustItems[id]),
              helpLine: true,
              secondary: copy.close.secondary,
            }}
            art={closeArt(article)}
            offer={offer}
            ctaLabel={cta.preorder}
            help={seller.help}
          />
        </>
      ) : (
        <RelatedGuides variant="keep" title={copy.keep.title} items={related} action={copy.keep.action} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleGraph(article, offer)) }} />
    </>
  );
}
