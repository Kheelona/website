import { render, screen } from "@testing-library/react";
import { FinaleCTA } from "./FinaleCTA";
import { PREORDER_LABEL, STORE_URL } from "@/config/site";

describe("FinaleCTA", () => {
  it("renders the pre-order headline and the price ask inside a #reserve section", () => {
    const { container } = render(<FinaleCTA />);
    expect(
      screen.getByRole("heading", { name: /Pre-order Kheelu before the price goes up/i }),
    ).toBeInTheDocument();
    // V6 D11: the lede is exactly the offer line + the hold promise — one
    // wording, one source, no drift between the price surfaces.
    expect(
      screen.getByText(
        "₹499 reserves one of the first 500 units at ₹4,999. ₹7,999 once they are gone. We hold the price, you hold your place.",
      ),
    ).toBeInTheDocument();
    expect(container.querySelector("#reserve")).toBeInTheDocument();
  });

  /* §8.25-b as revised 2026-08-23: every CTA on the site now goes straight to
     the store, so this is no longer the only way out. It is still the one that
     argues the case first, and it still hands off to the same absolute URL —
     test/preorder-cta.test.ts holds the rest of the site to it. */
  it("hands off to the store", () => {
    render(<FinaleCTA />);
    expect(screen.getByRole("link", { name: PREORDER_LABEL })).toHaveAttribute(
      "href",
      STORE_URL,
    );
  });

  it("keeps the three reassurances a paid reservation needs", () => {
    render(<FinaleCTA />);
    expect(screen.getByText("Fully refundable")).toBeInTheDocument();
    expect(screen.getByText("₹499 now, ₹4,500 later")).toBeInTheDocument();
    expect(screen.getByText("Ships 20 October 2026")).toBeInTheDocument();
    // the retired free-list promise must never come back on a paid page
    expect(screen.queryByText(/No payment/i)).toBeNull();
  });

  it("renders no decorative lineup in any variant (V4: the ask is the moment)", () => {
    const { container: full } = render(<FinaleCTA variant="full" />);
    const { container: compact } = render(<FinaleCTA variant="compact" />);
    expect(full.querySelectorAll("img").length).toBe(0);
    expect(compact.querySelectorAll("img").length).toBe(0);
  });

  it("sets the finale room in ink on a white shell (V4 D5)", () => {
    const { container } = render(<FinaleCTA />);
    const heading = container.querySelector("h2")!;
    expect(heading.className).toContain("text-ink-head");
    expect(container.querySelector("section")?.className).toContain("bg-white");
  });

  /* D5 is about the ROOM, not the button in it. This used to assert that the
     finale's markup contained no `text-white` at all, which worked only while
     the CTA carried an ink label. §8.29 made every action fill white-labelled
     (2026-08-24), so that blanket assertion would now fail on the button it was
     never aimed at. Narrowed to what D5 actually decided: the shell and its
     copy stay ink-on-white, and any white text inside must sit on the orange
     fill. */
  it("keeps every white label on the action fill, never on the white shell (D5 + §8.29)", () => {
    const { container } = render(<FinaleCTA />);
    for (const el of container.querySelectorAll('[class*="text-white"]')) {
      expect(
        el.className.includes("bg-action") || el.className.includes("bg-ink-head"),
        `white text on a non-action surface: ${el.className}`,
      ).toBe(true);
    }
  });
});
