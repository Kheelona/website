import { render, screen } from "@testing-library/react";
import { ReadNext } from "./ReadNext";
import { STORIES, getRelatedStories, getStory } from "@/lib/stories";

describe("ReadNext", () => {
  const stories = getRelatedStories("how-much-screen-time-for-a-3-to-6-year-old");

  it("offers three more reads", () => {
    render(<ReadNext stories={stories} />);
    expect(screen.getAllByRole("link").length).toBe(3);
  });

  it("links each card to its article, which is the whole point of the block", () => {
    render(<ReadNext stories={stories} />);
    for (const story of stories) {
      expect(
        screen.getByRole("link", { name: new RegExp(story.title, "i") }),
      ).toHaveAttribute("href", `/stories/${story.slug}`);
    }
  });

  it("names the theme and the length so the choice is informed", () => {
    render(<ReadNext stories={stories} />);
    /* getAllByText: theme-first selection means the cards usually SHARE a
       theme, which is the block working as intended. */
    expect(screen.getAllByText(stories[0].theme).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(`${stories[0].minutes} minute read`).length,
    ).toBeGreaterThan(0);
  });

  it("renders nothing at all rather than a heading over an empty row", () => {
    const { container } = render(<ReadNext stories={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  /* §8.18: a pointer-tracked transform under a whole-card link drops the click.
     The card must answer a tap instead, via the shared contract. */
  it("never wraps its whole-card links in tilt", () => {
    const { container } = render(<ReadNext stories={stories} />);
    expect(container.querySelector("[data-tilt]")).toBeNull();
    expect(screen.getAllByRole("link")[0].className).toContain("active:scale-");
  });

  it("puts the links in the markup, not behind JavaScript", () => {
    /* The FAQ shipped 1 of 8 answers to any reader without JS (§8.24-6). This
       block is server-rendered for the same reason: the crawlers it is built
       for do not all run scripts. */
    const { container } = render(<ReadNext stories={stories} />);
    expect(container.querySelectorAll('a[href^="/stories/"]').length).toBe(3);
  });
});

describe("getRelatedStories", () => {
  it("offers three for every article in the journal, with no dead ends", () => {
    for (const story of STORIES) {
      expect(
        getRelatedStories(story.slug).length,
        `${story.slug} has too few related stories`,
      ).toBe(3);
    }
  });

  it("never offers an article to itself", () => {
    for (const story of STORIES) {
      expect(getRelatedStories(story.slug).map((s) => s.slug)).not.toContain(story.slug);
    }
  });

  it("never repeats an article inside one block", () => {
    for (const story of STORIES) {
      const slugs = getRelatedStories(story.slug).map((s) => s.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("always offers a true neighbour to an article that has one", () => {
    /* The reader-facing promise, and the reason the ring reaches backwards as
       well as forwards. Looking only forwards left the last article of every
       theme group with three cross-theme cards and nothing of its own. Themes
       holding a single article are excluded because there is nothing to offer. */
    const themeSize = new Map<string, number>();
    for (const s of STORIES) themeSize.set(s.theme, (themeSize.get(s.theme) ?? 0) + 1);

    for (const story of STORIES) {
      if ((themeSize.get(story.theme) ?? 0) < 2) continue;
      const themes = getRelatedStories(story.slug).map((s) => s.theme);
      expect(themes, `${story.slug} was offered nothing from its own theme`).toContain(
        story.theme,
      );
    }
  });

  it("still fills three when an article is alone in its theme", () => {
    /* "Safety" and "Languages at home" hold exactly one article each. A
       theme-only selector left both with an EMPTY block and, worse, with zero
       incoming links, because nothing in the larger themes ever reached them. */
    expect(getRelatedStories("what-to-look-for-in-a-safe-ai-toy").length).toBe(3);
    expect(getRelatedStories("raising-a-bilingual-child-in-india").length).toBe(3);
  });

  it("is deterministic, so the link graph is the same in every build", () => {
    const once = getRelatedStories("should-kids-use-ai").map((s) => s.slug);
    const twice = getRelatedStories("should-kids-use-ai").map((s) => s.slug);
    expect(once).toEqual(twice);
  });

  it("returns nothing for a slug that is not in the journal", () => {
    expect(getRelatedStories("no-such-article")).toEqual([]);
  });
});
