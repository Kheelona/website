import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DEFAULT_OG } from "@/content/en-IN/organization";
import { articles } from "@/content/en-IN/stories/articles";
import type { Article } from "@/content/types";
import { ArticleTemplate, articleMeta } from "@/layouts/ArticleTemplate/ArticleTemplate";
import { buildOffer } from "@/lib/offer/offer";

/* The brief's scalability test, article half (brief §6; architecture §5.4; task 4.2, N26): a story is a content module
 * and nothing else. A fixture article written in the content model alone (the shape a rewrite of a waiting guide takes,
 * tasks 5.17-5.19: answer first, titled parts with a fragment, a photo between parts, a checks list, questions, a tinted
 * callout, numbered sources with markers, a founder's byline) renders as a whole page through the article template, with
 * its metadata and structured data, and no component, template or route edit. Fixture words only; never shipped. */

const fixture: Article = {
  slug: "how-children-collect-words",
  meta: {
    title: "How children collect words · Kheelona",
    description: "A fixture article for the scalability test: one module, rendered as a whole page with no code change.",
    og: DEFAULT_OG,
  },
  card: { title: "How children collect words", summary: "A fixture summary for the hub card." },
  related: ["talking-late-or-talking-little", "a-toy-that-talks-vs-a-toy-that-listens", "talking-toys-and-late-talkers"],
  published: "2026-07-28",
  updated: "2026-10-12",
  head: {
    title: "How children {hand:collect words}",
    lead: "A fixture lead under the heading.",
    author: "Apoorva Sahu",
    readMinutes: 6,
    image: { src: "/og/kheelu.jpg", width: 1200, height: 630, alt: "A fixture photo for the article head." },
  },
  answer: {
    question: "How do children collect words?",
    answer:
      "A fixture answer of the answer-first block, long enough to read as one, with a source marker after its first claim.[^1] It opens the reading column, before the first part, and the marker links to the first note at the foot of the column.",
  },
  body: [
    {
      kind: "part",
      id: "at-home",
      title: "Words at {nowrap:home}",
      blocks: [
        { kind: "p", text: "A fixture paragraph citing the second note.[^2]" },
        { kind: "list", variant: "checks", items: ["A first check.", "A second check."] },
      ],
    },
    { kind: "figure", image: { src: "/og/kheelu.jpg", width: 1200, height: 630, alt: "A fixture photo between the parts." }, variant: "wide" },
    {
      kind: "part",
      title: "Questions to ask",
      blocks: [
        { kind: "questions", items: [{ question: "A fixture question?", answer: ["A fixture answer."] }] },
        { kind: "callout", icon: "book-open", lead: "Try this:", text: "a fixture tip." },
      ],
    },
  ],
  sources: [
    { citation: "Fixture source one, 2026.", href: "https://example.org/one" },
    { citation: "Fixture source two, 2026.", href: "https://example.org/two" },
  ],
  close: "journal",
};

const page = (article: Article) => render(<ArticleTemplate article={article} offer={buildOffer("token")} />).container;

describe("scalability: a new article is a content module and nothing else", () => {
  it("renders the head from the module: crumbs to its hub topic, the h1 with its accent, the lead, the byline", () => {
    const container = page(fixture);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("How children collect words");
    expect(h1.querySelector(".kh-hand")?.textContent).toBe("collect words");
    expect(container.querySelector(".ks-story-head .kh-heading__lead")?.textContent).toBe("A fixture lead under the heading.");
    expect(container.querySelector(".ks-byline")?.textContent).toBe("Apoorva Sahu · First published 28 Jul 2026 · 6 min read");
    const crumbs = within(screen.getByRole("navigation", { name: "Breadcrumb" })).getAllByRole("link");
    expect(crumbs.map((a) => a.getAttribute("href"))).toEqual(["/stories", "/stories#talking"]);
  });

  it("renders the reading column in order: the answer, the titled parts and the photo between them, the sources last", () => {
    const container = page(fixture);
    const column = container.querySelector(".ks-story-body > .kh-container")!;
    expect([...column.children].map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join(".")}`)).toEqual([
      "section.kh-card.kh-card--tint.kh-tone-sun.ks-answer",
      "section.ks-part",
      "figure.kh-photo.kh-photo--wide",
      "section.ks-part",
      "section.ks-sources",
    ]);
    expect(screen.getByRole("region", { name: "How do children collect words?" })).toBe(column.children[0]);
    expect(screen.getByRole("region", { name: "Words at home" })).toHaveAttribute("id", "at-home");
    expect(container.querySelectorAll(".ks-checks li")).toHaveLength(2);
    expect(container.querySelector(".ks-questions")).not.toBeNull();
    expect(container.querySelector(".ks-try")?.textContent).toBe("Try this: a fixture tip.");
  });

  it("links each source marker to its numbered note", () => {
    page(fixture);
    expect(screen.getByRole("link", { name: "Source 1" })).toHaveAttribute("href", "#src-1");
    expect(screen.getByRole("link", { name: "Source 2" })).toHaveAttribute("href", "#src-2");
    const notes = screen.getByRole("region", { name: "Sources" });
    expect(within(notes).getAllByRole("listitem").map((li) => li.id)).toEqual(["src-1", "src-2"]);
    expect(within(notes).getByRole("link", { name: "https://example.org/two" })).toHaveAttribute("href", "https://example.org/two");
  });

  it("closes with the related guides by their own titles and the journal close with the pre-order button", () => {
    const container = page(fixture);
    const related = within(screen.getByRole("region", { name: "Related guides" })).getAllByRole("link");
    expect(related.map((a) => [a.textContent, a.getAttribute("href")])).toEqual(
      fixture.related.map((slug) => [articles[slug as keyof typeof articles].card.title, `/stories/${slug}`]),
    );
    expect(container.querySelector("#close [data-ph-capture-attribute-cta='finale']")).not.toBeNull();
  });

  it("takes the keep-reading close instead when the module says keep: no pre-order button (B5)", () => {
    const container = page({ ...fixture, close: "keep" });
    expect(screen.getByRole("region", { name: "Keep reading" })).toBeInTheDocument();
    expect(container.querySelector(".kh-btn--cta, #close")).toBeNull();
  });

  it("gives the page its structured data and metadata from the module: the founder as the Person, the stored dates", () => {
    const container = page(fixture);
    const graph = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!) as { "@graph": Record<string, unknown>[] };
    const [posting, breadcrumbs] = graph["@graph"];
    expect(posting).toMatchObject({
      "@type": "BlogPosting",
      url: "https://kheelona.com/stories/how-children-collect-words",
      headline: "How children collect words",
      datePublished: "2026-07-28",
      dateModified: "2026-10-12",
      author: { "@type": "Person", "@id": "https://kheelona.com/team#apoorva-sahu", name: "Apoorva Sahu" },
    });
    expect(breadcrumbs).toMatchObject({ "@type": "BreadcrumbList", itemListElement: [{ name: "Stories" }, { name: "Talking and language" }] });
    expect(articleMeta(fixture)).toMatchObject({
      title: { absolute: "How children collect words · Kheelona" },
      alternates: { canonical: "/stories/how-children-collect-words" },
      openGraph: { type: "article", publishedTime: "2026-07-28", modifiedTime: "2026-10-12", authors: ["Apoorva Sahu"] },
    });
  });
});
