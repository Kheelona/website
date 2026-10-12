import type { IsoDate, SitePath } from "@/content/types";
import { absoluteUrl, ORGANIZATION_ID, personId } from "../urls";
import { calendarDate, requireText } from "./shared";

/**
 * The BlogPosting node for a story (architecture §9.2, task 4.2): headline, description, image,
 * the module's stored publication and update dates (written from git history when the article
 * changes, never computed at build), the author, the language and the publisher by id.
 *
 * The author is a Person under their team-page id only when that id is one the site's Organization
 * node publishes (`knownAuthorIds`, from `personIds()`); any other byline is credited to the
 * Organization, so no node points at a team-page person who does not exist (task 2.13: "Guest
 * Writer" once became `…/team#guest-writer`).
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
  /** The person ids the Organization node publishes: `personIds(organizationFacts)`. */
  readonly knownAuthorIds: readonly string[];
  /** The article's language as a BCP 47 tag; `en-IN` when the article does not say. */
  readonly inLanguage?: string;
}

const DEFAULT_LANGUAGE = "en-IN";
/** A BCP 47 tag as the site writes them: language, optional script, optional region ("en-IN",
 *  "hi-IN", "hi-Latn-IN"). */
const LANGUAGE_TAG = /^[a-z]{2,3}(?:-[A-Z][a-z]{3})?(?:-[A-Z]{2})?$/;

/** The author node: the Person when the team page publishes them, else the Organization. */
function authorNode(name: string, knownIds: readonly string[]) {
  const id = personId(requireText(name, "BlogPosting author"));
  return knownIds.includes(id) ? { "@type": "Person" as const, "@id": id, name } : { "@id": ORGANIZATION_ID };
}

export function blogPostingNode(facts: BlogPostingFacts) {
  const published = calendarDate(facts.published, "BlogPosting published");
  const updated = calendarDate(facts.updated, "BlogPosting updated");
  if (updated < published) throw new Error(`BlogPosting updated ${updated} is before published ${published}`);
  const inLanguage = facts.inLanguage ?? DEFAULT_LANGUAGE;
  if (!LANGUAGE_TAG.test(inLanguage)) {
    throw new Error(`BlogPosting language "${inLanguage}" is not a BCP 47 tag such as "en-IN"`);
  }
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
    inLanguage,
    author: authorNode(facts.author, facts.knownAuthorIds),
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export type BlogPostingNode = ReturnType<typeof blogPostingNode>;
