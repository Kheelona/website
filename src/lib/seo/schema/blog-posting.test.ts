import { describe, expect, it } from "vitest";
import { blogPostingNode, type BlogPostingFacts } from "./blog-posting";

/** The person ids the page's Organization node publishes (its founders and employees), as the
 *  caller hands them over from `personIds(organizationFacts)`. */
const TEAM_IDS = ["https://kheelona.com/team#apoorva-sahu", "https://kheelona.com/team#ria-mangala-rewari"];

const article: BlogPostingFacts = {
  path: "/stories/learning-toys-for-a-three-year-old",
  headline: "Learning toys for a 3-year-old, skill by skill",
  description: "What a 3-year-old is working on, and which kinds of toys serve each part of it.",
  image: "/og/kheelu.jpg",
  published: "2026-07-28",
  updated: "2026-10-11",
  author: "Ria Mangala Rewari",
  knownAuthorIds: TEAM_IDS,
};

describe("blogPostingNode", () => {
  it("builds the article node with its stored dates, its author and the publisher", () => {
    expect(blogPostingNode(article)).toEqual({
      "@type": "BlogPosting",
      "@id": "https://kheelona.com/stories/learning-toys-for-a-three-year-old#article",
      url: "https://kheelona.com/stories/learning-toys-for-a-three-year-old",
      mainEntityOfPage: "https://kheelona.com/stories/learning-toys-for-a-three-year-old",
      headline: "Learning toys for a 3-year-old, skill by skill",
      description: "What a 3-year-old is working on, and which kinds of toys serve each part of it.",
      image: "https://kheelona.com/og/kheelu.jpg",
      datePublished: "2026-07-28",
      dateModified: "2026-10-11",
      inLanguage: "en-IN",
      author: { "@type": "Person", "@id": "https://kheelona.com/team#ria-mangala-rewari", name: "Ria Mangala Rewari" },
      publisher: { "@id": "https://kheelona.com/#organization" },
    });
  });

  /* Dates are stored in the article module from git history, never computed at build (lessons §6:
     `new Date()` told Google every page changed on every deploy). */
  it("refuses an update older than the publication", () => {
    expect(() => blogPostingNode({ ...article, published: "2026-10-11", updated: "2026-07-28" })).toThrow(/updated/);
  });

  it("refuses a date that is not a calendar date", () => {
    expect(() => blogPostingNode({ ...article, published: "2026-13-01" })).toThrow(/date/);
    expect(() => blogPostingNode({ ...article, updated: "2026-10-1" as never })).toThrow(/date/);
  });

  it("refuses an empty headline", () => {
    expect(() => blogPostingNode({ ...article, headline: "  " })).toThrow(/headline/i);
  });

  /* Task 2.13 (the 2.7 review's probe): any byline became a team-page id, so "Guest Writer" got
     https://kheelona.com/team#guest-writer, a person the team page never shows. The author's id
     comes only from the ids the Organization node publishes; anyone else is credited to the
     Organization, which the shell declares on every page. */
  it("credits a byline that is not on the team page to the Organization", () => {
    expect(blogPostingNode({ ...article, author: "Guest Writer" }).author).toEqual({ "@id": "https://kheelona.com/#organization" });
    expect(JSON.stringify(blogPostingNode({ ...article, author: "Guest Writer" }))).not.toContain("team#");
  });

  it("credits every byline to the Organization when no team id is known", () => {
    expect(blogPostingNode({ ...article, knownAuthorIds: [] }).author).toEqual({ "@id": "https://kheelona.com/#organization" });
  });

  it("matches a known author by the id the team page publishes for the name", () => {
    expect(blogPostingNode({ ...article, author: "Apoorva Sahu" }).author).toEqual({
      "@type": "Person",
      "@id": "https://kheelona.com/team#apoorva-sahu",
      name: "Apoorva Sahu",
    });
  });

  it("takes the language as data, en-IN when the article does not say", () => {
    expect(blogPostingNode(article).inLanguage).toBe("en-IN");
    expect(blogPostingNode({ ...article, inLanguage: "hi-IN" }).inLanguage).toBe("hi-IN");
  });

  it.each(["", "english", "en_IN", "EN-in", "en-IN "])("refuses a language that is not a BCP 47 tag (%j)", (inLanguage) => {
    expect(() => blogPostingNode({ ...article, inLanguage })).toThrow(/language/i);
  });
});
