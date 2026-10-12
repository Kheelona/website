import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockupFold, skeleton, words } from "../../../../test/support/mockup-compare";
import { RelatedGuides } from "./RelatedGuides";
import { LATE_TALKERS_KEEP, LEARNING_TOYS_RELATED, SAFE_AI_TOY_RELATED } from "./RelatedGuides.stories";

/* RelatedGuides (task 3.4): the related guides band under an article (story-*.html) and the late-talker article's
   keep-reading close (B5: no pre-order button), DS list rows that wrap, centred on the reading column. */

const DROP = { drop: /^ks-list-reset$/ };

describe("RelatedGuides: related", () => {
  it.each([
    ["story-learning-toys-for-a-three-year-old", LEARNING_TOYS_RELATED],
    ["story-what-to-look-for-in-a-safe-ai-toy", SAFE_AI_TOY_RELATED],
  ] as const)("%s: markup and words equal the mockup's related band", (slug, config) => {
    const { container } = render(<RelatedGuides {...config} />);
    const mockup = mockupFold(slug, ".mk-related");
    expect(skeleton(container.firstElementChild!, DROP)).toBe(skeleton(mockup, DROP));
    expect(words(container.firstElementChild!)).toBe(words(mockup));
  });

  it("is a band section named by its heading, on the reading column, each row one link with the chevron", () => {
    render(<RelatedGuides {...LEARNING_TOYS_RELATED} />);
    const section = screen.getByRole("region", { name: "Related guides" });
    expect(section.className).toBe("kh-section kh-section--band ks-related");
    expect(section.querySelector(".kh-container")!.className).toBe("kh-container ks-col");
    const row = screen.getByRole("link", { name: "A toy that talks is not a toy that listens" });
    expect(row.className).toBe("kh-listitem");
    expect(row).toHaveAttribute("href", "/stories#talking");
    expect(row.lastElementChild!.matches("svg.kh-icon[aria-hidden='true']")).toBe(true);
  });
});

describe("RelatedGuides: keep", () => {
  it("markup and words equal the late-talker close", () => {
    const { container } = render(<RelatedGuides {...LATE_TALKERS_KEEP} />);
    const mockup = mockupFold("story-talking-toys-and-late-talkers", ".mk-keep");
    expect(skeleton(container.firstElementChild!, DROP)).toBe(skeleton(mockup, DROP));
    expect(words(container.firstElementChild!)).toBe(words(mockup));
  });

  it("is a tinted card on the page surface, ending on the hub as a full-width secondary button and no pre-order button", () => {
    const { container } = render(<RelatedGuides {...LATE_TALKERS_KEEP} />);
    const section = screen.getByRole("region", { name: "Keep reading" });
    expect(section.className).toBe("kh-section ks-related ks-keep");
    expect(section.querySelector(".kh-card")!.className).toBe("kh-card kh-card--tint kh-tone-sun ks-keep__card");
    const button = screen.getByRole("link", { name: "All guides for parents of 3 to 7 year olds" });
    expect(button.className).toBe("kh-btn kh-btn--secondary kh-btn--block");
    expect(button).toHaveAttribute("href", "/stories");
    expect(container.querySelector(".kh-btn--cta, [data-ph-capture-attribute-cta]")).toBeNull();
  });

  it("takes the heading id it is given", () => {
    render(<RelatedGuides {...LATE_TALKERS_KEEP} id="more" />);
    expect(screen.getByRole("region")).toHaveAttribute("aria-labelledby", "more");
  });
});
