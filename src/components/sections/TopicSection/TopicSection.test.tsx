import { render, screen } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it } from "vitest";
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

describe("TopicSection: the approved hub bands", () => {
  it.each(TOPICS)("#%s: markup and words equal the mockup's band", (id, config) => {
    const { container } = render(<TopicSection {...config} />);
    const mockup = mockupFold("stories", `section#${id}`);
    expect(skeleton(container.firstElementChild!, OPTIONS)).toBe(skeleton(mockup, OPTIONS));
    expect(words(container.firstElementChild!)).toBe(words(mockup, OPTIONS));
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
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(container.querySelector("section")!.className).toBe("kh-section ks-topic");
  });

  it("links a row once its guide has a page", () => {
    render(<TopicSection {...SCREEN_TIME_TOPIC} items={[{ ...SCREEN_TIME_TOPIC.items[4], href: "/stories/busy-hands-no-screens" }]} />);
    expect(screen.getByRole("link", { name: /Busy hands, no screens/ })).toHaveAttribute("href", "/stories/busy-hands-no-screens");
  });
});
