import { render, screen } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it } from "vitest";
import { mockupFold, skeleton, words } from "../../../../test/support/mockup-compare";
import { ArticleHead } from "./ArticleHead";
import { LATE_TALKERS_HEAD, LEARNING_TOYS_HEAD, SAFE_AI_TOY_HEAD } from "./ArticleHead.stories";

/* ArticleHead (task 3.4): fold 1 of the article mockups (story-*.html): crumbs, the h1 at the DS display-l step from
   1024 px (an inner step span, mapping row 81), the lead, the byline with its date, and the head photo. */

/* Vitest loads image files as plain addresses; the tests give each photo its real size, as next/image's import does. */
const sized = (width: number, height: number) => ({ src: "/photo.webp", width, height }) as StaticImageData;
const withSize = (config: typeof LEARNING_TOYS_HEAD, width: number, height: number) => ({
  ...config,
  head: { ...config.head, image: { ...config.head.image!, src: sized(width, height) } },
});
const HEADS = [
  ["story-learning-toys-for-a-three-year-old", withSize(LEARNING_TOYS_HEAD, 1208, 1500)],
  ["story-what-to-look-for-in-a-safe-ai-toy", withSize(SAFE_AI_TOY_HEAD, 1500, 837)],
  ["story-talking-toys-and-late-talkers", withSize(LATE_TALKERS_HEAD, 1500, 837)],
] as const;
const OPTIONS = { drop: /^ks-type-/, unwrap: ".ks-heading__step" };

describe("ArticleHead: the approved heads", () => {
  it.each(HEADS)("%s: markup and words equal the mockup's fold 1", (slug, config) => {
    const { container } = render(<ArticleHead {...config} />);
    const mockup = mockupFold(slug, ".mk-story-head");
    expect(skeleton(container.firstElementChild!, OPTIONS)).toBe(skeleton(mockup, OPTIONS));
    expect(words(container.firstElementChild!)).toBe(words(mockup));
  });
});

describe("ArticleHead: parts", () => {
  const [, learning] = HEADS[0];
  const [, safe] = HEADS[1];

  it("is the band header of the first screen, carrying the hero's first-screen spacing", () => {
    const { container } = render(<ArticleHead {...learning} />);
    const header = container.firstElementChild!;
    expect(header.tagName).toBe("HEADER");
    expect(header.className).toBe("kh-section kh-section--band ks-hero ks-story-head");
  });

  it("names the trail as the content says and links the hub and the topic", () => {
    render(<ArticleHead {...learning} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav.querySelectorAll("a")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Learning and play" })).toHaveAttribute("href", "/stories#learning");
  });

  it("has the one h1, with its id for the article's name, and the display-l step from 1024 px on an inner span", () => {
    render(<ArticleHead {...learning} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveAttribute("id", "story-title");
    expect(h1).toHaveAccessibleName("Learning toys for a 3-year-old, skill by skill");
    expect(h1.firstElementChild!.className).toBe("ks-heading__step ks-type-display-l@xl");
  });

  it("prints the byline with the stored date as the DS writes it, and the date machine-readable", () => {
    const { container } = render(<ArticleHead {...learning} />);
    const byline = container.querySelector(".ks-byline")!;
    expect(byline.className).toBe("kh-body-s ks-byline");
    expect(byline.textContent).toBe("The Kheelona team · First published 11 Sep 2026 · 4 min read");
    expect(byline.querySelector("time")).toHaveAttribute("dateTime", "2026-09-11");
  });

  it("puts a portrait photo in the DS 4:5 frame beside the wider words; a wide photo in the 16:9 frame, even columns", () => {
    const portrait = render(<ArticleHead {...learning} />).container;
    expect(portrait.querySelector(".kh-split")!.className).toBe("kh-split kh-split--wide-start");
    expect(portrait.querySelector("figure")!.className).toBe("kh-photo");
    const wide = render(<ArticleHead {...safe} />).container;
    expect(wide.querySelector(".kh-split")!.className).toBe("kh-split");
    expect(wide.querySelector("figure")!.className).toBe("kh-photo kh-photo--wide");
  });

  it("loads the head photo as the page's one LCP image", () => {
    const { container } = render(<ArticleHead {...learning} />);
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("fetchpriority", "high");
  });

  it("renders the words alone, without a split, for an article with no photo and no read time yet", () => {
    const { container } = render(
      <ArticleHead
        head={{ title: "Busy hands, no screens", author: "The Kheelona team" }}
        published="2025-11-02"
        trail={learning.trail}
        labels={{ breadcrumb: "Breadcrumb", published: "First published" }}
      />,
    );
    expect(container.querySelector(".kh-split, figure")).toBeNull();
    expect(container.querySelector(".ks-byline")!.textContent).toBe("The Kheelona team · First published 2 Nov 2025");
  });
});
