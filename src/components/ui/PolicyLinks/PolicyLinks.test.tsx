import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { asBuilt, canonical, mockupFold } from "../../../../test/support/mockup-compare";
import { PolicyLinks } from "./PolicyLinks";

/* PolicyLinks (task 2.5): the store's policy links, as `mk-policy` renders them in the approved store and
 * confirmation mockups (mockup/store.html and store-confirmation.html, store footer), ported as `ks-policy`. The mockup
 * is read and ported by the one harness (test/support/mockup-compare.ts): its page addresses are the routes they became. */

/** The mockup's links, at the routes its page addresses became (the store passes kheelona.com addresses from content). */
const LINKS = [
  { label: "Pre-order terms", href: "/terms" },
  { label: "Refunds and cancellation", href: "/refund" },
  { label: "Shipping and delivery", href: "/shipping" },
  { label: "Privacy", href: "/privacy" },
  { label: "Contact", href: "/contact" },
];
const NEW_TAB = " (opens in a new tab)";

describe("PolicyLinks", () => {
  it("is a labelled navigation landmark of links, each opening in a new tab and saying so", () => {
    render(<PolicyLinks label="Policies" links={LINKS} newTabNote={NEW_TAB} />);
    const nav = screen.getByRole("navigation", { name: "Policies" });
    expect(nav).toHaveClass("ks-policy");
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(5);
    links.forEach((a, i) => {
      expect(a).toHaveAttribute("href", LINKS[i].href);
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener");
      const note = a.querySelector(".kh-sr");
      expect(note).toHaveTextContent("(opens in a new tab)");
      expect(a.textContent).toBe(`${LINKS[i].label}${NEW_TAB}`);
    });
  });

  it("renders the links in the order given, and nothing for an empty list", () => {
    render(<PolicyLinks label="Policies" links={[LINKS[3], LINKS[0]]} newTabNote={NEW_TAB} />);
    expect(screen.getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["/privacy", "/terms"]);
    const empty = render(<PolicyLinks label="Other" links={[]} newTabNote={NEW_TAB} />);
    expect(empty.container.firstChild).toBeNull();
  });

  it("puts every link in the tab order, in the order given", async () => {
    const user = userEvent.setup();
    render(<PolicyLinks label="Policies" links={LINKS} newTabNote={NEW_TAB} />);
    for (const link of LINKS) {
      await user.tab();
      expect(document.activeElement).toHaveAttribute("href", link.href);
    }
  });

  it.each(["store", "store-confirmation"])("matches the approved mockup's policy links (%s)", (page) => {
    const { container } = render(<PolicyLinks label="Policies" links={LINKS} newTabNote={NEW_TAB} />);
    expect(canonical(container.firstElementChild!)).toBe(canonical(asBuilt(mockupFold(page, "nav.mk-policy"))));
  });
});
