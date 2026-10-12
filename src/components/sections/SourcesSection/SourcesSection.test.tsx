import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockupFold, skeleton, words } from "../ArticleBody/__fixtures__/approved-fold";
import { SourcesSection } from "./SourcesSection";
import { GUIDE_SOURCES, LATE_TALKERS_SOURCES, LEARNING_TOYS_SOURCES, SAFE_AI_TOY_SOURCES, SOURCES_LABEL } from "./SourcesSection.stories";

/* SourcesSection (task 3.4; D026, DS gap G-18): the numbered notes at the foot of each article mockup and the buyer's
   guide's inline note (ai-toys-for-kids-in-india.html fold 5). Each note is the target of its markers (#src-n). */

const ARTICLES = [
  ["story-learning-toys-for-a-three-year-old", LEARNING_TOYS_SOURCES],
  ["story-what-to-look-for-in-a-safe-ai-toy", SAFE_AI_TOY_SOURCES],
  ["story-talking-toys-and-late-talkers", LATE_TALKERS_SOURCES],
] as const;

describe("SourcesSection: article", () => {
  it.each(ARTICLES)("%s: markup and words equal the mockup's notes", (slug, sources) => {
    const { container } = render(<SourcesSection variant="article" label={SOURCES_LABEL} sources={sources} />);
    const mockup = mockupFold(slug, ".mk-sources");
    expect(skeleton(container.firstElementChild!)).toBe(skeleton(mockup));
    expect(words(container.firstElementChild!)).toBe(words(mockup));
  });

  it("is a section named by its subtitle; each note is its marker's target, the full address as its link", () => {
    render(<SourcesSection variant="article" label={SOURCES_LABEL} sources={SAFE_AI_TOY_SOURCES} />);
    const section = screen.getByRole("region", { name: "Sources" });
    expect(section.className).toBe("ks-sources");
    expect(screen.getByRole("heading", { level: 2 }).className).toBe("kh-subtitle");
    const notes = [...section.querySelectorAll("ol.ks-notes.kh-body-s > li")];
    expect(notes.map((li) => li.id)).toEqual(["src-1", "src-2", "src-3"]);
    expect(notes[0].querySelector(".ks-notes__n")?.textContent).toBe("[1]");
    const link = screen.getByRole("link", { name: SAFE_AI_TOY_SOURCES[0].href });
    expect(link).toHaveAttribute("href", SAFE_AI_TOY_SOURCES[0].href);
  });

  it("takes the heading id it is given", () => {
    render(<SourcesSection variant="article" label={SOURCES_LABEL} sources={SAFE_AI_TOY_SOURCES} id="notes" />);
    expect(screen.getByRole("region")).toHaveAttribute("aria-labelledby", "notes");
  });

  it("renders nothing without sources (an article waiting for its rewrite)", () => {
    const { container } = render(<SourcesSection variant="article" label={SOURCES_LABEL} sources={[]} />);
    expect(container.innerHTML).toBe("");
  });
});

describe("SourcesSection: inline (the buyer's guide)", () => {
  it("markup and words equal the guide's note", () => {
    const { container } = render(<SourcesSection variant="inline" label={SOURCES_LABEL} sources={GUIDE_SOURCES} />);
    const mockup = mockupFold("ai-toys-for-kids-in-india", ".mk-gd-sources");
    expect(skeleton(container.firstElementChild!)).toBe(skeleton(mockup));
    expect(words(container.firstElementChild!)).toBe(words(mockup));
  });

  it("opens with the bold label and links each note by the site's name", () => {
    const { container } = render(<SourcesSection variant="inline" label={SOURCES_LABEL} sources={GUIDE_SOURCES} />);
    expect(container.firstElementChild!.className).toBe("ks-gd-sources");
    expect(container.querySelector("#src-1 > strong")?.textContent).toBe("Sources");
    expect(screen.getByRole("link", { name: "doi.org" })).toHaveAttribute("href", GUIDE_SOURCES[1].href);
  });
});
