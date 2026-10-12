import type { IsoDate, SitePath } from "@/content/types";
import { absoluteUrl, ORGANIZATION_ID, personId } from "../urls";
import { calendarDate, requireText } from "./shared";

/**
 * The BlogPosting node for a story (architecture §9.2, task 4.2): headline, description, image,
 * the module's stored publication and update dates (written from git history when the article
 * changes, never computed at build), the author by name and team-page id, and the publisher by id.
 */
export interface BlogPostingFacts {
  readonly path: SitePath;
  readonly headline: string;
  readonly description: string;
  /** A stable image URL: the article's Open Graph card or its head image. */
  readonly image: SitePath;
  readonly published: IsoDate;
  readonly updated: IsoDate;
  /** The byline as the page prints it. */
  readonly author: string;
}

export function blogPostingNode(facts: BlogPostingFacts) {
  const published = calendarDate(facts.published, "BlogPosting published");
  const updated = calendarDate(facts.updated, "BlogPosting updated");
  if (updated < published) throw new Error(`BlogPosting updated ${updated} is before published ${published}`);
  const url = absoluteUrl(facts.path);
  return {
    "@type": "BlogPosting" as const,
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: url,
    headline: requireText(facts.headline, "BlogPosting headline"),
    description: requireText(facts.description, "BlogPosting description"),
    image: absoluteUrl(facts.image),
    datePublished: published,
    dateModified: updated,
    inLanguage: "en-IN",
    author: { "@type": "Person" as const, "@id": personId(facts.author), name: facts.author },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export type BlogPostingNode = ReturnType<typeof blogPostingNode>;
