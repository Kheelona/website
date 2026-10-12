import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PolicyLinks } from "./PolicyLinks";

/* PolicyLinks (task 2.5): the store's policy links, as `mk-policy` renders them in the approved store and
 * confirmation mockups (mockup/store.html and store-confirmation.html, store footer), ported as `ks-policy`. */

function mockupElement(page: string, selector: string): Element {
  const doc = new DOMParser().parseFromString(readFileSync(`mockup/${page}.html`, "utf8"), "text/html");
  const el = doc.querySelector(selector);
  if (!el) throw new Error(`${selector} is not in mockup/${page}.html`);
  return tidy(el.cloneNode(true) as Element);
}

function tidy<T extends Node>(node: T): T {
  node.normalize();
  const walk = (n: Node) => {
    for (const child of [...n.childNodes]) {
      if (child.nodeType === 8 || (child.nodeType === 3 && !(child.textContent ?? "").trim())) child.remove();
      else if (child.nodeType === 1) walk(child);
    }
    if (n instanceof Element && n.hasAttribute("class")) n.setAttribute("class", n.getAttribute("class")!.replace(/\bmk-/g, "ks-"));
  };
  walk(node);
  return node;
}

/** The mockup's links (its relative hrefs; the store passes kheelona.com addresses from content). */
const LINKS = [
  { label: "Pre-order terms", href: "terms.html" },
  { label: "Refunds and cancellation", href: "refund.html" },
  { label: "Shipping and delivery", href: "shipping.html" },
  { label: "Privacy", href: "privacy.html" },
  { label: "Contact", href: "contact.html" },
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
    expect(screen.getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["privacy.html", "terms.html"]);
    const empty = render(<PolicyLinks label="Other" links={[]} newTabNote={NEW_TAB} />);
    expect(empty.container.firstChild).toBeNull();
  });

  it.each(["store", "store-confirmation"])("matches the approved mockup's policy links (%s)", (page) => {
    const { container } = render(<PolicyLinks label="Policies" links={LINKS} newTabNote={NEW_TAB} />);
    const built = tidy(container.firstElementChild!.cloneNode(true) as Element);
    const mockup = mockupElement(page, "nav.mk-policy");
    expect(built.isEqualNode(mockup), `built:\n${built.outerHTML}\nmockup:\n${mockup.outerHTML}`).toBe(true);
  });
});
