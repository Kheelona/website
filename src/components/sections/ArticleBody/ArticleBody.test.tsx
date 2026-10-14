import { fireEvent, render, screen, within } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it } from "vitest";
import type { ArticlePart, ProseBlock, VideoBlock } from "@/content/types";
import { ARTICLE_CLAIM_FIXES } from "../../../../test/e2e/support/deviations";
import type { PageFacts } from "../../../../test/e2e/support/page-facts";
import { mockupFold, skeleton, words } from "../../../../test/support/mockup-compare";
import { withFacts } from "../../../../test/support/mockup-facts";
import { ArticleBody } from "./ArticleBody";
import { LATE_TALKERS_BODY, LEARNING_TOYS_BODY, SAFE_AI_TOY_BODY, SOURCE_LABEL, VIDEO_LABEL } from "./ArticleBody.stories";

/* ArticleBody (task 3.4): the reading column of the three article mockups, every block type they use, type by
   ks-type-* steps (mockup-css-mapping rows 71-72, 83-84), no pixel sizes. */

const ARTICLES = [
  ["story-learning-toys-for-a-three-year-old", LEARNING_TOYS_BODY],
  ["story-what-to-look-for-in-a-safe-ai-toy", SAFE_AI_TOY_BODY],
  ["story-talking-toys-and-late-talkers", LATE_TALKERS_BODY],
] as const;

/* The answer and the sources sit in the same column in the mockup; they are AnswerSection and SourcesSection. The
   build adds the type steps (rows 71-72) and the article marker variant (stories.css:72 as SourceMarker's
   `ks-src--article`, mapping §6.2); nothing else may differ. */
const SLOTS = ".mk-answer, .mk-sources";
const OPTIONS = { skip: SLOTS, drop: /^(?:ks-type-.*|ks-src--article)$/ };

/** An approved article's reading column through its accepted changes since Gate A, as approved-articles.test.tsx reads
 *  it (task 8b.1d): the frozen mockup (D046) with the article's claim fixes applied first (deviations.ts
 *  ARTICLE_CLAIM_FIXES: the safe-AI-toy guide's, D058, deviations.md V37), and its in-text link to the data-law guide
 *  read as the copy page's real URL (copy page fold 4, "Links"; the mockup links the hub's topic). The other two
 *  approved articles have neither, so theirs is the mockup's column as it is. */
function approvedColumn(slug: string): Element {
  const fold = mockupFold(slug, ".mk-story-body").cloneNode(true) as Element;
  fold.querySelectorAll('.mk-part a[href="stories.html#ai-and-safety"]').forEach((a) => a.setAttribute("href", "/stories/ai-toys-and-indias-data-law"));
  return withFacts(fold, (ARTICLE_CLAIM_FIXES as Readonly<Record<string, PageFacts>>)[slug]?.edits ?? []);
}

const BELLY = { src: { src: "/belly.png", width: 389, height: 397 } as StaticImageData, alt: "Kheelu’s tummy unit up close." };
const VIDEO: VideoBlock = { kind: "video", provider: "youtube", videoId: "M7lc1UVf-VE", title: "Setting up Kheelu", caption: "Press play to [set it up](/setup)." };
const one = (blocks: readonly ProseBlock[], extra: Partial<ArticlePart> = {}) => (
  <ArticleBody blocks={[{ kind: "part", title: "A part", ...extra, blocks }]} sourceLabel={SOURCE_LABEL} />
);
const column = (c: HTMLElement) => c.querySelector(".ks-prose")!;

describe("ArticleBody: the approved reading column", () => {
  it.each(ARTICLES)("%s: markup equals the mockup's prose column, through its accepted changes", (slug, blocks) => {
    const { container } = render(<ArticleBody blocks={blocks} sourceLabel={SOURCE_LABEL} />);
    expect(skeleton(container.firstElementChild!, OPTIONS)).toBe(skeleton(approvedColumn(slug), OPTIONS));
  });

  it.each(ARTICLES)("%s: words equal the mockup's through its accepted changes, markers included", (slug, blocks) => {
    const { container } = render(<ArticleBody blocks={blocks} sourceLabel={SOURCE_LABEL} />);
    expect(words(container.firstElementChild!)).toBe(words(approvedColumn(slug), { skip: SLOTS }));
  });

  it("holds the safe-AI-toy guide to its claim fixes: the frozen column with them is not the mockup's own", () => {
    const slug = "story-what-to-look-for-in-a-safe-ai-toy";
    expect(words(approvedColumn(slug), { skip: SLOTS })).not.toBe(words(mockupFold(slug, ".mk-story-body"), { skip: SLOTS }));
  });

  it("is a div section holding the one reading column, with the body type steps instead of pixel sizes", () => {
    const { container } = render(<ArticleBody blocks={LEARNING_TOYS_BODY} sourceLabel={SOURCE_LABEL} />);
    const section = container.firstElementChild!;
    expect(section.tagName).toBe("DIV");
    expect(section.className).toBe("kh-section ks-story-body");
    expect(section.firstElementChild!.className).toBe("kh-container ks-col ks-prose ks-type-body ks-type-body-l@xl");
  });

  it("puts the answer first and the sources last, inside the column", () => {
    const { container } = render(
      <ArticleBody blocks={LATE_TALKERS_BODY} sourceLabel={SOURCE_LABEL} before={<section id="answer" />} after={<section id="sources" />} />,
    );
    const kids = [...column(container).children];
    expect(kids[0].id).toBe("answer");
    expect(kids[kids.length - 1].id).toBe("sources");
    expect(kids).toHaveLength(LATE_TALKERS_BODY.length + 2);
  });
});

describe("ArticleBody: parts", () => {
  it("names a titled part by its h2 and keeps a fragment other pages link to", () => {
    const { container } = render(<ArticleBody blocks={LEARNING_TOYS_BODY} sourceLabel={SOURCE_LABEL} />);
    const brain = container.querySelector("#brain-development")!;
    expect(brain.tagName).toBe("SECTION");
    expect(brain).toHaveAccessibleName("Brain development toys for a 3-year-old: what the label means");
    const titles = [...container.querySelectorAll("h2")];
    expect(titles.every((h) => h.className === "kh-title" && h.id)).toBe(true);
    expect(new Set(titles.map((h) => h.id)).size).toBe(titles.length);
  });

  it("renders an untitled part as a plain div, and a breakout part with its hook", () => {
    const { container } = render(<ArticleBody blocks={[...LATE_TALKERS_BODY.slice(0, 1), ...SAFE_AI_TOY_BODY.slice(2)]} sourceLabel={SOURCE_LABEL} />);
    const [opening, breakout] = [...column(container).children];
    expect(opening.outerHTML.startsWith('<div class="ks-part">')).toBe(true);
    expect(breakout.className).toBe("ks-part ks-breakout");
  });

  it("renders a photo between parts as a lazy DS photo sized to the column", () => {
    const { container } = render(<ArticleBody blocks={LEARNING_TOYS_BODY} sourceLabel={SOURCE_LABEL} />);
    const figure = column(container).querySelector(":scope > figure")!;
    expect(figure.className).toBe("kh-photo kh-photo--wide");
    const img = figure.querySelector("img")!;
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img.getAttribute("sizes")).toMatch(/700px/);
  });
});

describe("ArticleBody: every block type", () => {
  it("p: plain, with a bold lead-in, and the plain-words gut line", () => {
    const { container } = render(
      one([
        { kind: "p", text: "Plain." },
        { kind: "p", lead: "Try this:", text: "pause." },
        { kind: "p", variant: "gut", text: "If your gut says ask, ask." },
      ]),
    );
    const ps = [...container.querySelectorAll(".ks-part > p")];
    expect(ps.map((p) => p.outerHTML)).toEqual(["<p>Plain.</p>", "<p><strong>Try this:</strong> pause.</p>", '<p class="ks-gut">If your gut says ask, ask.</p>']);
  });

  it("h3: a DS subtitle", () => {
    const { container } = render(one([{ kind: "h3", text: "Myth 1" }]));
    expect(container.querySelector(".ks-part > h3")!.outerHTML).toBe('<h3 class="kh-subtitle">Myth 1</h3>');
  });

  it("list: bullets and steps as plain lists, checks with a tick each, tips in a tinted card with their own icons", () => {
    const { container } = render(
      one([
        { kind: "list", items: ["One", { lead: "Two:", text: "more" }] },
        { kind: "list", variant: "steps", items: ["First"] },
        { kind: "list", variant: "checks", items: ["Check the age."] },
        { kind: "list", variant: "tips", items: [{ icon: "clock", text: "Wait." }] },
      ]),
    );
    const [bullets, steps, checks, tips] = [...container.querySelectorAll(".ks-part > ul, .ks-part > ol")];
    expect(bullets.outerHTML).toBe("<ul><li>One</li><li><strong>Two:</strong> more</li></ul>");
    expect(steps.outerHTML).toBe("<ol><li>First</li></ol>");
    expect(checks.className).toBe("ks-checks");
    expect(checks.querySelector("li > svg.kh-icon[aria-hidden='true'] + span")?.textContent).toBe("Check the age.");
    expect(tips.className).toBe("kh-card kh-card--tint kh-tone-sun ks-tips");
    expect(tips.querySelector("li > svg.kh-icon + span")?.textContent).toBe("Wait.");
  });

  it("list: a tip without its icon, or an icon the DS does not have, fails the render", () => {
    expect(() => render(one([{ kind: "list", variant: "tips", items: ["No icon"] }]))).toThrow(/tip needs its icon/);
    expect(() => render(one([{ kind: "list", variant: "tips", items: [{ icon: "linkedin-logo", text: "x" }] }]))).toThrow(/design-system icons/);
  });

  it("questions: each question a DS subtitle, then its paragraphs", () => {
    const { container } = render(one([{ kind: "questions", items: [{ question: "When is it on?", answer: ["Only after a press.", "Then off."] }] }]));
    const block = container.querySelector(".ks-questions")!;
    expect([...block.children].map((c) => `${c.tagName}${c.className ? `.${c.className}` : ""}`)).toEqual(["H3.kh-subtitle", "P", "P"]);
  });

  it("quote: the DS quote card naming who said it; a quote without a name fails (real words of real people)", () => {
    const { container } = render(one([{ kind: "quote", quote: "It is the trust.", cite: "Apoorva Sahu" }]));
    const figure = container.querySelector("figure.kh-quote")!;
    expect(within(figure as HTMLElement).getByText("It is the trust.").tagName).toBe("BLOCKQUOTE");
    expect(figure.querySelector(".kh-quote__name")?.textContent).toBe("Apoorva Sahu");
    expect(() => render(one([{ kind: "quote", quote: "Unattributed." }]))).toThrow(/names who said it/);
  });

  it("callout: a tinted card in its tone (Sunshine by default), the icon first, the line with its bold lead-in", () => {
    const { container } = render(
      one([
        { kind: "callout", icon: "book-open", lead: "Try this:", text: "pause." },
        { kind: "callout", icon: "info", tone: "blue", text: "Blue." },
      ]),
    );
    const [sun, blue] = [...container.querySelectorAll(".ks-try")];
    expect(sun.className).toBe("kh-card kh-card--tint kh-tone-sun ks-try");
    expect(sun.tagName).toBe("DIV");
    expect([...sun.children].map((c) => c.tagName)).toEqual(["svg", "P"]);
    expect(sun.querySelector("p")!.innerHTML).toBe("<strong>Try this:</strong> pause.");
    expect(blue.className).toBe("kh-card kh-card--tint kh-tone-blue ks-try");
  });

  it("figure: a DS photo in its variant, with its caption", () => {
    const { container } = render(one([{ kind: "figure", variant: "square", image: BELLY, caption: "The tummy unit." }]));
    const figure = container.querySelector(".ks-part > figure")!;
    expect(figure.className).toBe("kh-photo kh-photo--square");
    expect(figure.querySelector("figcaption")?.textContent).toBe("The tummy unit.");
  });

  it("facts: the DS trust list with bold lead-ins at the body step, and the belly photo as its last cell", () => {
    const { container } = render(one([{ kind: "facts", items: [{ icon: "eye", title: "Every conversation.", body: "Read it." }], figure: BELLY }]));
    const list = container.querySelector(".kh-trust")!;
    expect(list.className).toBe("kh-trust ks-facts-list");
    expect(list.querySelector(".kh-trust__body")!.className).toBe("kh-trust__body ks-type-body");
    expect(list.querySelector(".kh-label")?.textContent).toBe("Every conversation.");
    const belly = list.lastElementChild!;
    expect(belly.className).toBe("kh-photo kh-photo--square ks-belly");
    expect(belly.querySelector("img")).toHaveAttribute("loading", "lazy");
  });

  it("disclaimer: the quiet D025 line", () => {
    const { container } = render(one([{ kind: "disclaimer", text: "Kheelu is a toy, not a therapy or treatment." }]));
    expect(container.querySelector(".ks-part > p")!.className).toBe("kh-body-s ks-disclaimer");
  });

  /* A journal post's video (task 8b.2c; D057 item 1; journal-pipeline §5.1, §7): ui/VideoEmbed, a still in the DS frame
     at 16:9 sized to the column, with the play button named by the content's word and the video's title; the caption
     through the content syntax like any other line; the player only after the press. */
  it("video: a still in the DS frame sized to the column, the play button named by the content's word, the player on the press", async () => {
    const { container } = render(
      <ArticleBody
        blocks={[{ kind: "part", title: "A part", blocks: [VIDEO] }]}
        sourceLabel={SOURCE_LABEL}
        videoLabel={VIDEO_LABEL}
      />,
    );
    const figure = container.querySelector(".ks-part > figure")!;
    expect(figure.className).toBe("kh-photo kh-photo--wide ks-video");
    expect(figure.querySelector("img")!.getAttribute("sizes")).toMatch(/700px/);
    expect(figure.querySelector("figcaption")!.innerHTML).toBe('Press play to <a href="/setup">set it up</a>.');
    expect(container.querySelector("iframe")).toBeNull();
    fireEvent.click(await screen.findByRole("button", { name: "Play video: Setting up Kheelu" }));
    expect(figure.querySelector("iframe")).toHaveAttribute("title", "Setting up Kheelu");
  });

  it("video: refuses one without the content's play word, rather than typing one", () => {
    expect(() => render(one([VIDEO]))).toThrow(/play word/);
  });
});

describe("ArticleBody: links and source markers", () => {
  it("marks sources with the article marker (kept on one line), named by the content's word", () => {
    render(<ArticleBody blocks={LEARNING_TOYS_BODY} sourceLabel={SOURCE_LABEL} />);
    const marker = screen.getAllByRole("link", { name: "Source 1" })[0];
    expect(marker).toHaveAttribute("href", "#src-1");
    expect(marker.className).toBe("ks-src ks-src--article");
  });

  it("routes site links through the site and leaves the rest plain", () => {
    render(<ArticleBody blocks={SAFE_AI_TOY_BODY} sourceLabel={SOURCE_LABEL} />);
    expect(screen.getByRole("link", { name: "Safety page" })).toHaveAttribute("href", "/safety");
    expect(screen.getByRole("link", { name: "call +91 91875 46483" })).toHaveAttribute("href", "tel:+919187546483");
  });

  it("refuses a marker without the content's marker word, rather than guessing one", () => {
    expect(() => render(<ArticleBody blocks={LEARNING_TOYS_BODY} />)).toThrow(/source marker/);
  });
});
