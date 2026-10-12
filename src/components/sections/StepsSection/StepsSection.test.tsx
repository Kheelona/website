import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildOffer } from "@/lib/offer/offer";
import { mockupFold, skeleton, words } from "../ArticleBody/__fixtures__/approved-fold";
import { StepsSection, StepsTip } from "./StepsSection";
import { GUIDE_CHECKS, SETUP_STEPS, SETUP_TIP, THANKS_STEPS } from "./StepsSection.stories";

/* StepsSection (task 3.4): the DS StepLoop under its heading in the three approved placements: the buyer's guide's five
   checks (ai-toys-for-kids-in-india.html fold 2), setup's four steps (setup.html fold 3) and the confirmation's next
   steps (store-confirmation.html fold 4); and setup's Wi-Fi tip (StepsTip, setup.html fold 2). */

const offer = buildOffer("token");
/* The mockup marks where an amount comes from with a span (data-src), mockup-only markup (N22): unwrapped. StepLoop
   (task 2.4) named the two page layouts as its own variants. */
const OPTIONS = { unwrap: "[data-src]", rename: { "gd-checks": "ks-steps--checks", "steps-4": "ks-steps--four" } };

describe("StepsSection: the approved placements", () => {
  it.each([
    ["checks", GUIDE_CHECKS, "ai-toys-for-kids-in-india", "section[aria-labelledby='checks-title']"],
    ["four", SETUP_STEPS, "setup", "section#connect"],
    ["thanks", THANKS_STEPS, "store-confirmation", "section[aria-labelledby='next-title']"],
  ] as const)("%s: markup and words equal the mockup", (_variant, config, slug, selector) => {
    const { container } = render(<StepsSection {...config} offer={offer} />);
    const mockup = mockupFold(slug, selector);
    expect(skeleton(container.firstElementChild!, OPTIONS)).toBe(skeleton(mockup, OPTIONS));
    expect(words(container.firstElementChild!)).toBe(words(mockup));
  });
});

describe("StepsSection: parts", () => {
  it("checks: a band section named by its heading, the five checks revealed once on scroll, then the ghost link", () => {
    const { container } = render(<StepsSection {...GUIDE_CHECKS} />);
    const section = screen.getByRole("region", { name: "Five things to check before you buy an AI toy." });
    expect(section.className).toBe("kh-section kh-section--band");
    const list = container.querySelector("ol")!;
    expect(list.className).toBe("kh-steps ks-steps--checks");
    expect(list).toHaveAttribute("data-reveal");
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    const link = screen.getByRole("link", { name: "Read more: what to look for in a safe AI toy" });
    expect(link.className).toBe("kh-btn kh-btn--ghost");
    expect(link).toHaveAttribute("href", "/stories/what-to-look-for-in-a-safe-ai-toy");
    expect(link).not.toHaveAttribute("data-ph-capture-attribute-cta");
  });

  it("four: the setup section keeps its anchor and its step tones, and nothing moves", () => {
    const { container } = render(<StepsSection {...SETUP_STEPS} />);
    expect(container.firstElementChild).toHaveAttribute("id", "connect");
    const list = container.querySelector("ol")!;
    expect(list.className).toBe("kh-steps ks-steps--four");
    expect(list).not.toHaveAttribute("data-reveal");
    expect([...list.children].map((li) => li.className)).toEqual(["kh-step kh-tone-sun", "kh-step kh-tone-blue", "kh-step kh-tone-chilli", "kh-step kh-tone-sun"]);
  });

  it("thanks: a plain section in the confirmation's column, its heading the store's h2, the balance from the offer", () => {
    const { container } = render(<StepsSection {...THANKS_STEPS} offer={offer} />);
    const section = container.firstElementChild!;
    expect(section.tagName).toBe("SECTION");
    expect(section.className).toBe("");
    expect(screen.getByRole("heading", { level: 2 }).className).toBe("kh-title ks-h2");
    expect(container.querySelector("ol")!.className).toBe("kh-steps ks-thanks__steps");
    expect(screen.getByText(/we send a payment link for the/).textContent).toContain(offer.prices.balance);
  });

  it("takes the heading id it is given", () => {
    render(<StepsSection {...SETUP_STEPS} heading={{ ...SETUP_STEPS.heading, id: "wifi" }} />);
    expect(screen.getByRole("region")).toHaveAttribute("aria-labelledby", "wifi");
  });
});

describe("StepsTip", () => {
  it("is setup's Wi-Fi tip as setup.html fold 2 prints it", () => {
    const { container } = render(<StepsTip text={SETUP_TIP} />);
    const mockup = mockupFold("setup", ".mk-setup-tip");
    expect(skeleton(container.firstElementChild!)).toBe(skeleton(mockup));
    expect(words(container.firstElementChild!)).toBe(words(mockup));
    expect(container.firstElementChild!.className).toBe("kh-body-l ks-setup-tip");
  });
});
