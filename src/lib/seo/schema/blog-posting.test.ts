import { describe, expect, it } from "vitest";
import { blogPostingNode, type BlogPostingFacts } from "./blog-posting";

const article: BlogPostingFacts = {
  path: "/stories/learning-toys-for-a-three-year-old",
  headline: "Learning toys for a 3-year-old, skill by skill",
  description: "What a 3-year-old is working on, and which kinds of toys serve each part of it.",
  image: "/og/kheelu.jpg",
  published: "2026-07-28",
  updated: "2026-10-11",
  author: "Ria Mangala Rewari",
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
});
