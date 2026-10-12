import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockupFold, skeleton, words } from "../ArticleBody/__fixtures__/approved-fold";
import { SOURCE_LABEL } from "../ArticleBody/ArticleBody.stories";
import { AnswerSection } from "./AnswerSection";
import { LATE_TALKERS_ANSWER, LEARNING_TOYS_ANSWER, SAFE_AI_TOY_ANSWER, TEAM_ANSWER } from "./AnswerSection.stories";

/* AnswerSection (task 3.4): the answer-first block (architecture §9.5) of the three article mockups (fold 2, a tinted
   card first in the reading column) and of team.html (fold 2, its own band). Its configuration is the content's
   `Answer` shape, so test/guards/answer-length.test.ts holds every answer it is given in content to 40-60 words. */

const ARTICLES = [
  ["story-learning-toys-for-a-three-year-old", LEARNING_TOYS_ANSWER],
  ["story-what-to-look-for-in-a-safe-ai-toy", SAFE_AI_TOY_ANSWER],
  ["story-talking-toys-and-late-talkers", LATE_TALKERS_ANSWER],
] as const;
const DROP = { drop: /^ks-src--article$/ };

describe("AnswerSection: article", () => {
  it.each(ARTICLES)("%s: markup and words equal the mockup's answer card", (slug, answer) => {
    const { container } = render(<AnswerSection {...answer} variant="article" sourceLabel={SOURCE_LABEL} />);
    const mockup = mockupFold(slug, ".mk-answer");
    expect(skeleton(container.firstElementChild!, DROP)).toBe(skeleton(mockup, DROP));
    expect(words(container.firstElementChild!)).toBe(words(mockup));
  });

  it("is a tinted Sunshine card section named by its question, the answer as its first paragraph", () => {
    render(<AnswerSection {...SAFE_AI_TOY_ANSWER} variant="article" />);
    const card = screen.getByRole("region", { name: "What should you look for in a safe AI toy?" });
    expect(card.className).toBe("kh-card kh-card--tint kh-tone-sun ks-answer");
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.className).toBe("kh-title");
    expect(card.querySelector("h2 + p")?.textContent).toMatch(/^Look for mechanisms you can check/);
  });

  it("marks sources with the article marker and renders the detail blocks after the answer", () => {
    const { container } = render(<AnswerSection {...LATE_TALKERS_ANSWER} variant="article" sourceLabel={SOURCE_LABEL} />);
    expect(screen.getByRole("link", { name: "Source 1" }).className).toBe("ks-src ks-src--article");
    expect(container.querySelector("p:last-child")?.className).toBe("kh-body-s ks-disclaimer");
  });

  it("takes the heading id it is given, for the block's name", () => {
    render(<AnswerSection {...SAFE_AI_TOY_ANSWER} variant="article" id="answer" />);
    expect(screen.getByRole("heading")).toHaveAttribute("id", "answer");
    expect(screen.getByRole("region")).toHaveAttribute("aria-labelledby", "answer");
  });
});

describe("AnswerSection: team", () => {
  it("markup and words equal team.html fold 2", () => {
    const { container } = render(<AnswerSection {...TEAM_ANSWER} variant="team" />);
    const mockup = mockupFold("team", "section[aria-labelledby='who-title']");
    expect(skeleton(container.firstElementChild!)).toBe(skeleton(mockup));
    expect(words(container.firstElementChild!)).toBe(words(mockup));
  });

  it("is a band section named by the question, the answer a large paragraph beside it", () => {
    render(<AnswerSection {...TEAM_ANSWER} variant="team" />);
    const section = screen.getByRole("region", { name: "Who makes Kheelu?" });
    expect(section.className).toBe("kh-section kh-section--band");
    expect(section.querySelector(".kh-split")?.className).toBe("kh-split kh-split--wide-end ks-team-who");
    expect(section.querySelector("p")?.className).toBe("kh-body-l ks-team-answer");
    expect(screen.getByRole("link", { name: "hello@kheelona.com" })).toHaveAttribute("href", "mailto:hello@kheelona.com");
  });

  it("takes no detail: the approved team answer is one paragraph (type-checked)", () => {
    // @ts-expect-error the team variant has no detail (team.html fold 2)
    render(<AnswerSection {...TEAM_ANSWER} variant="team" detail={[{ kind: "p", text: "More." }]} />);
  });
});
