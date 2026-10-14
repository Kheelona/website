import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { articlePageCopy } from "@/content/en-IN/stories/articles";
import type { Article } from "@/content/types";
import type { Post } from "@/lib/journal/post";
import { journalToArticles } from "@/lib/journal/to-article";
import { buildOffer } from "@/lib/offer/offer";
import fixture from "../../../../test/fixtures/journal/block-kinds.fixture.json";
import { VOCABULARY } from "../../../../test/fixtures/journal/vocabulary";
import { AnswerSection } from "../AnswerSection/AnswerSection";
import { SourcesSection } from "../SourcesSection/SourcesSection";
import { ArticleBody } from "./ArticleBody";

/* ArticleBody on the journal's fixture posts (task 8b.2d; ADR-014, journal-pipeline §5): each post of
 * test/fixtures/journal/block-kinds.fixture.json through the adapter (src/lib/journal/to-article.ts) into the reading
 * column, as the article template lays it out (the answer first, the sources last), so a block kind a dashboard post
 * can hold is seen as the page sets it before any post uses it. Fixture words, not approved copy. The uploaded cover's
 * and the video's posts are left out: their images come from the dashboard's and YouTube's hosts, which a story never
 * contacts (their markup is held by to-article.test.ts and VideoEmbed's own stories). test/e2e/journal-figure.spec.ts
 * measures the "Photos" story at the three approved widths. */

const { articles } = journalToArticles((fixture as { posts: Post[] }).posts, VOCABULARY);
const bySlug = (slug: string): Article => articles.find((a) => a.slug === slug)!;
/** The page's offer, for an amount or the delivery line in a post's text (the paragraphs post prints both). */
const OFFER = buildOffer("token");

function Column({ slug }: { slug: string }) {
  const article = bySlug(slug);
  const { sources, videoLabel } = articlePageCopy;
  return (
    <main>
      <ArticleBody
        blocks={article.body}
        offer={OFFER}
        sourceLabel={sources.marker}
        videoLabel={videoLabel}
        before={article.answer && <AnswerSection variant="article" {...article.answer} offer={OFFER} sourceLabel={sources.marker} />}
        after={<SourcesSection variant="article" label={sources.title} sources={article.sources} />}
      />
    </main>
  );
}

const meta = {
  title: "Sections/ArticleBody/Journal fixtures",
  component: Column,
} satisfies Meta<typeof Column>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Lead-ins, a gut line, links, a hard break, an amount and the delivery line; detail lines in the answer card. */
export const Paragraphs: Story = { args: { slug: "kind-paragraphs" } };
/** Parts by their h2s, an anchor, an h3, a rule, the age note last. */
export const Headings: Story = { args: { slug: "kind-headings" } };
/** Bullets with a lead-in, checks, tips with their icons, numbered steps. */
export const Lists: Story = { args: { slug: "kind-lists" } };
/** A facts list with its icons and titles, the belly photo inside it, its part breaking out from 1200 px. */
export const Facts: Story = { args: { slug: "kind-facts" } };
/** A callout and a group of questions. */
export const Blockquotes: Story = { args: { slug: "kind-blockquotes" } };
/** A photo inside a part, with its caption and the column's space below it, and a wide photo between parts. */
export const Photos: Story = { args: { slug: "kind-images" } };
/** A guide on the talking topic: D025's line under the answer. */
export const Talking: Story = { args: { slug: "kind-talking" } };
