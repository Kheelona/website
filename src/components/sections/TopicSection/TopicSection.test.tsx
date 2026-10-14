import { render, screen } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import postcss, { type AtRule, type Rule } from "postcss";
import { describe, expect, it } from "vitest";
import { STORIES_REMOVED_CARD } from "../../../../test/e2e/support/deviations";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { mockupFold, skeleton, words } from "../../../../test/support/mockup-compare";
import type { TopicSectionConfig } from "./topic-section.types";
import { TopicSection } from "./TopicSection";
import { AI_AND_SAFETY_TOPIC, LEARNING_TOPIC, SCREEN_TIME_TOPIC, TALKING_TOPIC } from "./TopicSection.stories";

/* TopicSection (task 3.4): one topic band of the stories hub (stories.html folds 2-5): its heading, the rewritten
   guide as a card that taps as a whole, and the other guides as rows. The mockup's "Rewritten in the build" captions
   are a review label and are not built (N22), so they are left out of the comparison. */

/* Vitest loads image files as plain addresses; the tests give each photo its real size, as next/image's import does. */
const sized = (config: TopicSectionConfig, width: number, height: number): TopicSectionConfig => ({
  ...config,
  featured: config.featured && { ...config.featured, image: { ...config.featured.image, src: { src: "/p.webp", width, height } as StaticImageData } },
});
const TOPICS = [
  ["screen-time", SCREEN_TIME_TOPIC],
  ["talking", sized(TALKING_TOPIC, 1500, 837)],
  ["ai-and-safety", sized(AI_AND_SAFETY_TOPIC, 1500, 837)],
  ["learning", sized(LEARNING_TOPIC, 1208, 1500)],
] as const;
const OPTIONS = {
  skip: ".mk-later",
  drop: /^(?:ks-list-reset|ks-type-subtitle|ks-card__link--tap)$/,
  rename: { guides: "ks-topic__guides", "guides--two": "ks-topic__guides--two", "photo-myra": "ks-guide__photo--portrait" },
};

/** The approved band as the build shows it: the row the hub's parity deviation hides for the guide that left (V9,
 *  deviations.ts; the 3-6-9-12 guide left the journal after Gate A, D053, task 6.5) is taken out of a copy of the
 *  mockup first. */
function approvedBand(id: string): Element {
  const main = mockupFold("stories", "main").cloneNode(true) as Element;
  main.querySelectorAll(STORIES_REMOVED_CARD.selector).forEach((row) => row.remove());
  return main.querySelector(`section#${id}`)!;
}

/** The declarations of topic-section.css's rule with exactly these selectors inside `@media (min-width: 900px)`. */
function laptopDeclarations(selector: string): string[] {
  const out: string[] = [];
  postcss.parse(readRepoFile("src/components/sections/TopicSection/topic-section.css")).each((node) => {
    if (node.type !== "atrule" || (node as AtRule).params !== "(min-width: 900px)") return;
    (node as AtRule).each((rule) => {
      if (rule.type === "rule" && (rule as Rule).selectors.join(", ") === selector) {
        (rule as Rule).each((d) => void (d.type === "decl" && out.push(`${d.prop}: ${d.value}`)));
      }
    });
  });
  return out;
}

describe("TopicSection: the approved hub bands", () => {
  it.each(TOPICS)("#%s: markup and words equal the mockup's band", (id, config) => {
    const { container } = render(<TopicSection {...config} />);
    const mockup = approvedBand(id);
    expect(skeleton(container.firstElementChild!, OPTIONS)).toBe(skeleton(mockup, OPTIONS));
    expect(words(container.firstElementChild!)).toBe(words(mockup, OPTIONS));
  });

  it("shows no card of the guide that left the journal (D053, V9) in any story fixture", () => {
    for (const [id, config] of TOPICS) {
      const titles = [config.featured?.title, ...config.items.map((item) => item.title)];
      expect(titles, id).not.toContain(STORIES_REMOVED_CARD.title);
    }
  });
});

describe("TopicSection: parts", () => {
  const talking = TOPICS[1][1];

  it("is a section with the topic's anchor, named by its h2, on the band when asked", () => {
    render(<TopicSection {...talking} />);
    const section = screen.getByRole("region", { name: "Talking and language" });
    expect(section).toHaveAttribute("id", "talking");
    expect(section.className).toBe("kh-section kh-section--band ks-topic");
  });

  it("shows the rewritten guide as a card: its photo, an h3 at the subtitle step, the summary, one link named by the guide", () => {
    const { container } = render(<TopicSection {...talking} />);
    const card = container.querySelector("article")!;
    expect(card.className).toBe("kh-card ks-guide");
    expect(card.firstElementChild!.className).toBe("kh-photo kh-photo--wide");
    expect(card.querySelector("img")).toHaveAttribute("loading", "lazy");
    expect(card.querySelector("h3")!.className).toBe("kh-card__title ks-type-subtitle");
    const link = screen.getByRole("link", { name: "Read the guide · 3 min read: Late talker? What helps a child find their words" });
    expect(link).toHaveAttribute("href", "/stories/talking-toys-and-late-talkers");
    expect(link.className).toBe("kh-card__link ks-card__link--tap");
  });

  it("crops a portrait photo in the card's 16:9 frame to keep the child in view", () => {
    const { container } = render(<TopicSection {...TOPICS[3][1]} />);
    expect(container.querySelector("figure")!.className).toBe("kh-photo kh-photo--wide ks-guide__photo--portrait");
  });

  it("lists the other guides as quiet rows with h3 titles, in two columns when no guide is rewritten yet", () => {
    const { container } = render(<TopicSection {...SCREEN_TIME_TOPIC} />);
    const list = container.querySelector("ul")!;
    expect(list.className).toBe("kh-list ks-list-reset ks-topic__guides ks-topic__guides--two");
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(container.querySelector("section")!.className).toBe("kh-section ks-topic");
  });

  /* CMO review B m2 (task 7.1b): with an odd number of rows in two columns, the last row sat alone in the left column
     beside an empty cell with its column rule, which read as a missing card on laptops. The odd last row spans both
     columns and drops the rule; quiet rows are the list items, a linked row is the link inside its item (DS layout only,
     no new value). The hub's screen-time topic has five guides since D053. */
  it("lets an odd last row span both columns, without its column rule, from 900 px (B m2)", () => {
    expect(laptopDeclarations(".ks-topic__guides--two > li:last-child:nth-child(odd)")).toEqual(["grid-column: 1 / -1"]);
    expect(
      laptopDeclarations(".ks-topic__guides--two > .kh-listitem:last-child:nth-child(odd), .ks-topic__guides--two > li:last-child:nth-child(odd) > .kh-listitem"),
    ).toEqual(["border-right: 0"]);
    const { container } = render(<TopicSection {...SCREEN_TIME_TOPIC} />);
    const rows = container.querySelectorAll(".ks-topic__guides--two > li");
    expect(rows).toHaveLength(5);
    expect(rows[4].matches(".ks-topic__guides--two > li:last-child:nth-child(odd)")).toBe(true);
    expect(rows[3].matches(".ks-topic__guides--two > li:last-child:nth-child(odd)")).toBe(false);
  });

  it("links a row once its guide has a page", () => {
    const busyHands = SCREEN_TIME_TOPIC.items.find((item) => item.title === "Busy hands, no screens")!;
    render(<TopicSection {...SCREEN_TIME_TOPIC} items={[{ ...busyHands, href: "/stories/busy-hands-no-screens" }]} />);
    expect(screen.getByRole("link", { name: /Busy hands, no screens/ })).toHaveAttribute("href", "/stories/busy-hands-no-screens");
  });
});
