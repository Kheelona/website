import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MARKETING_ORIGIN } from "@/config/env";
import { confirmation } from "@/content/en-IN/store/confirmation";
import { mockupFold, skeleton, words } from "../../../../../test/support/mockup-compare";
import { HelpBlock } from "./HelpBlock";

/* HelpBlock (task 5.16): /thanks fold 5 (store-confirmation.html): a person to reach, quoting the order, the undo in
   plain words, and the refund page. On the store host a policy page is the marketing site's (as the store footer's
   links, StoreShell), so the mockup's "refund.html" is read as MARKETING_ORIGIN + /refund. */

function asOnTheStore(fold: Element): Element {
  const copy = fold.cloneNode(true) as Element;
  copy.querySelector('a[href="refund.html"]')!.setAttribute("href", `${MARKETING_ORIGIN}/refund`);
  return copy;
}

describe("HelpBlock", () => {
  it("markup and words equal store-confirmation.html fold 5", () => {
    const { container } = render(<HelpBlock copy={confirmation.help} />);
    const mockup = asOnTheStore(mockupFold("store-confirmation", "section[aria-labelledby='help-title']"));
    expect(skeleton(container.firstElementChild!)).toBe(skeleton(mockup));
    expect(words(container.firstElementChild!)).toBe(words(mockup));
  });

  it("is a section named by its h2 in the store's heading style, the help line with the WhatsApp icon", () => {
    const { container } = render(<HelpBlock copy={confirmation.help} />);
    expect(screen.getByRole("region", { name: "Need anything?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 }).className).toBe("kh-title ks-h2");
    const line = container.querySelector(".ks-help")!;
    expect(line.className).toBe("kh-body ks-help");
    expect(line.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", "https://wa.me/919187546483");
    expect(screen.getByRole("link", { name: "call +91 91875 46483" })).toHaveAttribute("href", "tel:+919187546483");
    expect(screen.getByRole("link", { name: "hello@kheelona.com" })).toHaveAttribute("href", "mailto:hello@kheelona.com");
  });

  it("links the refund page on the marketing site, same tab, as a ghost link flush with the text", () => {
    render(<HelpBlock copy={confirmation.help} />);
    const refund = screen.getByRole("link", { name: "Refunds and returns" });
    expect(refund).toHaveAttribute("href", `${MARKETING_ORIGIN}/refund`);
    expect(refund).not.toHaveAttribute("target");
    expect(refund.className).toBe("kh-btn kh-btn--ghost ks-ghost-start");
    expect(refund).not.toHaveAttribute("data-ph-capture-attribute-cta");
  });

  it("sets the undo apart as a muted paragraph", () => {
    const { container } = render(<HelpBlock copy={confirmation.help} />);
    const undo = container.querySelector(".ks-thanks__help")!.children[1];
    expect(undo.className).toBe("kh-body ks-muted");
    expect(undo.textContent).toMatch(/^Changed your mind\?/);
  });
});
