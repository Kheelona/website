import { render, screen } from "@testing-library/react";
import { FinaleCTA } from "./FinaleCTA";
import { PREORDER_LABEL, STORE_URL } from "@/config/site";

describe("FinaleCTA", () => {
  it("renders the pre-order headline and the price ask inside a #reserve section", () => {
    const { container } = render(<FinaleCTA />);
    expect(
      screen.getByRole("heading", { name: /Pre-order Lumi before the price goes up/i }),
    ).toBeInTheDocument();
    // V6 D11: the lede is exactly the offer line + the hold promise — one
    // wording, one source, no drift between the price surfaces.
    expect(
      screen.getByText(
        "₹499 reserves yours at ₹4,999. ₹9,999 after 30 September 2026. We hold the price, you hold your place.",
      ),
    ).toBeInTheDocument();
    expect(container.querySelector("#reserve")).toBeInTheDocument();
  });

  /* §8.25-b: this is the ONE outbound link to the store on the whole marketing
     site. Every other CTA anchors to #reserve first, so a parent reads the
     price, the refund promise and the ship date before a payment form opens.
     If a second outbound store link ever appears, that law has been broken. */
  it("hands off to the store, and is the only place that does", () => {
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
    expect(screen.getByText("Ships 1 October 2026")).toBeInTheDocument();
    // the retired free-list promise must never come back on a paid page
    expect(screen.queryByText(/No payment/i)).toBeNull();
  });

  it("renders no decorative lineup in any variant (V4: the ask is the moment)", () => {
    const { container: full } = render(<FinaleCTA variant="full" />);
    const { container: compact } = render(<FinaleCTA variant="compact" />);
    expect(full.querySelectorAll("img").length).toBe(0);
    expect(compact.querySelectorAll("img").length).toBe(0);
  });

  it("sets the finale in ink on a white shell, never white-on-orange (V4 D5)", () => {
    const { container } = render(<FinaleCTA />);
    const heading = container.querySelector("h2")!;
    expect(heading.className).toContain("text-ink-head");
    expect(container.innerHTML).not.toContain("text-white");
    expect(container.querySelector("section")?.className).toContain("bg-white");
  });
});
