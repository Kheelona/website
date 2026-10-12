import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockupFold, skeleton, words } from "../../../../test/support/mockup-compare";
import { FoundersSection } from "./FoundersSection";
import { FOUNDERS } from "./FoundersSection.stories";

/* FoundersSection (task 3.4): the team page's founder cards (team.html fold 3), composed from FeatureCard and Avatar
   (the DS has no founder card). The backgrounds are proof-gated (D038, F11): while gated they render nothing on any
   environment, so the comparison leaves out the mockup's background lines, which show their placeholder. */

/* The card link's tap target is Card's shared rule (G-01), which replaces the mockup's own founder-link class. */
const OPTIONS = { skip: ".mk-founder__bg", rename: { founder__link: "" }, drop: /^ks-card__link--tap$/ };
const ungated = { ...FOUNDERS, founders: FOUNDERS.founders.map((f) => ({ ...f, bio: f.bio && { text: f.bio.text } })) };

describe("FoundersSection: the approved fold, backgrounds gated", () => {
  it("markup and words equal team.html fold 3 without the gated background lines", () => {
    const { container } = render(<FoundersSection {...FOUNDERS} />);
    const mockup = mockupFold("team", "section[aria-labelledby='founders-title']");
    expect(skeleton(container.firstElementChild!, OPTIONS)).toBe(skeleton(mockup, OPTIONS));
    expect(words(container.firstElementChild!)).toBe(words(mockup, OPTIONS));
  });
});

describe("FoundersSection: parts", () => {
  it("is a section named by its heading, three cards in DS columns", () => {
    const { container } = render(<FoundersSection {...FOUNDERS} />);
    expect(screen.getByRole("region", { name: "The Kheelona founders." })).toBeInTheDocument();
    expect(container.querySelector(".kh-cols")!.className).toBe("kh-cols kh-cols--3");
    expect(container.querySelectorAll("article.kh-card.ks-founder")).toHaveLength(3);
  });

  it("puts the hidden initials badge beside the visible name and role, so the name is read once", () => {
    render(<FoundersSection {...FOUNDERS} />);
    const card = screen.getByRole("heading", { name: "Kashyap C.R" }).closest("article")!;
    const badge = card.querySelector(".kh-avatar")!;
    expect(badge.className).toBe("kh-avatar kh-avatar--xl kh-tone-sun");
    expect(badge).toHaveAttribute("aria-hidden", "true");
    expect(badge.textContent).toBe("KC");
    expect(card.querySelector(".ks-founder__role")!.className).toBe("kh-label-s ks-founder__role");
  });

  it("shows the photo placeholder visibly while B24 is open", () => {
    const { container } = render(<FoundersSection {...FOUNDERS} />);
    const lines = [...container.querySelectorAll(".ks-founder__photo")];
    expect(lines).toHaveLength(3);
    expect(lines[0].className).toBe("kh-caption ks-founder__photo");
    expect(lines[0].textContent).toBe("[PLACEHOLDER B24: founder photo]");
  });

  it("renders no background while it is gated, and nothing of its words", () => {
    const { container } = render(<FoundersSection {...FOUNDERS} />);
    expect(container.querySelector(".ks-founder__bg")).toBeNull();
    expect(container.textContent).not.toMatch(/background, shown once its proof is filed/);
  });

  it("renders the background line once its gate is lifted", () => {
    const { container } = render(<FoundersSection {...ungated} />);
    const bios = [...container.querySelectorAll(".ks-founder__bg")];
    expect(bios.map((b) => b.className)).toEqual(["kh-body-s ks-founder__bg", "kh-body-s ks-founder__bg", "kh-body-s ks-founder__bg"]);
    expect(bios[1].previousElementSibling!.className).toBe("kh-card__body");
  });

  it("shows an approved photo in the badge's place and drops the placeholder line", () => {
    const withPhoto = { ...FOUNDERS, founders: FOUNDERS.founders.map((f) => ({ ...f, photo: { src: "/team/x.jpg" as const, width: 400, height: 400, alt: "" } })) };
    const { container } = render(<FoundersSection {...withPhoto} />);
    expect(container.querySelector(".ks-founder__photo")).toBeNull();
    expect(container.querySelector(".kh-avatar img")).toHaveAttribute("src", "/team/x.jpg");
  });

  it("ends each card on its profile link, a full tap target with the arrow", () => {
    render(<FoundersSection {...FOUNDERS} />);
    const link = screen.getByRole("link", { name: "Aman on LinkedIn" });
    expect(link).toHaveAttribute("href", "https://www.linkedin.com/in/aman-soni-6b17b6223/");
    expect(link.className).toBe("kh-card__link ks-card__link--tap");
    expect(within(link).getByText("Aman on LinkedIn")).toBeInTheDocument();
    expect(link.lastElementChild!.matches("svg.kh-icon")).toBe(true);
  });

  it("gives the name the person's fragment, so a byline can point at it", () => {
    render(<FoundersSection {...FOUNDERS} founders={[{ ...FOUNDERS.founders[1], anchor: "aman-soni" }]} />);
    expect(screen.getByRole("heading", { name: "Aman Soni" })).toHaveAttribute("id", "aman-soni");
  });
});
