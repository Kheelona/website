import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders as a crawlable link with its label and href", () => {
    render(<Button href="/reserve">Reserve Kheelu</Button>);
    const link = screen.getByRole("link", { name: "Reserve Kheelu" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/reserve");
  });

  it("primary variant carries the brand action fill and a WHITE label (§8.29)", () => {
    render(<Button href="#">Go</Button>);
    const link = screen.getByRole("link");
    expect(link.className).toContain("bg-action");
    /* Founder decision 2026-08-24, reversing V4 D1: white on #EF762F, knowingly
       at 2.88:1. The arithmetic and the acceptance live in
       test/contrast-tokens.test.ts; this only pins what the atom renders. */
    expect(link.className).toContain("text-white");
    expect(link.className).not.toContain("text-ink-head");
    // the white keyline stays retired: V4 removed it, and §8.29 does not undo that
    expect(link.className).not.toContain("border-white");
  });

  it("ghost variant uses the outlined ink treatment, not the fill", () => {
    render(
      <Button href="#" variant="ghost">
        Go
      </Button>,
    );
    const link = screen.getByRole("link");
    expect(link.className).toContain("border-ink-head");
    expect(link.className).not.toContain("bg-action");
  });

  it("holds one line from sm up but wraps below it, so long labels stay on screen", () => {
    render(<Button href="#">See the parent app on the Kheelu page</Button>);
    const cls = screen.getByRole("link").className;
    expect(cls).toContain("whitespace-nowrap");
    expect(cls).toContain("max-sm:whitespace-normal");
  });

  it("emits a ripple element on pointer-down when motion is allowed", async () => {
    const user = userEvent.setup();
    render(<Button href="#">Go</Button>);
    const link = screen.getByRole("link");
    await user.pointer({ target: link, keys: "[MouseLeft>]" });
    expect(link.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
});

/** TELLING ONE CTA FROM ANOTHER IN POSTHOG (§8.40, 2026-09-20).
 *
 *  Every pre-order CTA on this site renders the SAME label and the SAME href, by
 *  law (§8.25-b: one verb, one destination). That is right for a visitor and
 *  useless for analytics: the home page alone carries five of them, so
 *  autocapture recorded five indistinguishable clicks on "Pre-order Kheelu" and
 *  the founder could not see which one people actually tap.
 *
 *  `data-ph-capture-attribute-<name>` is the mechanism, read out of the
 *  installed SDK rather than its docs: posthog-js promotes it to a TOP-LEVEL
 *  event property, where an ordinary attribute would only appear nested inside
 *  `$elements` as `attr__data-attr` and be far harder to break a funnel down by. */
describe("Button placement tracking", () => {
  it("promotes the placement to a top-level PostHog property", () => {
    render(
      <Button href="https://store.kheelona.com" track="hero">
        Pre-order Kheelu
      </Button>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("data-ph-capture-attribute-cta", "hero");
  });

  /* Opt-in. Most buttons on the site are navigation, and tagging all of them
     would bury the handful that mean money. */
  it("adds nothing at all when no placement is given", () => {
    render(<Button href="/team">Meet the team</Button>);
    expect(screen.getByRole("link").getAttributeNames()).not.toContain(
      "data-ph-capture-attribute-cta",
    );
  });

  /* It must not become a visible label or an accessible name: this is a
     measurement hook, and qa:sweep runs axe over the rendered markup. */
  it("does not change what the button says or announces", () => {
    render(
      <Button href="https://store.kheelona.com" track="navbar">
        Pre-order Kheelu
      </Button>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName("Pre-order Kheelu");
    expect(link.textContent).toBe("Pre-order Kheelu");
  });
});
