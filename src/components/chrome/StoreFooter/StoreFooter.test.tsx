import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StoreFooter, type StoreFooterProps } from "./StoreFooter";

/* StoreFooter (task 3.1): the store's footer, mockup/store.html fold 7 (shared with store-confirmation.html): the
 * policy links (to the marketing site, each in a new tab), the seller block, the grievance line, the payments line and
 * the copyright. Element parity with the mockup, from content: StoreShell.test.tsx. */

const PROPS: StoreFooterProps = {
  policies: {
    label: "Policies",
    newTabNote: " (opens in a new tab)",
    links: [
      { label: "Pre-order terms", href: "https://kheelona.com/terms" },
      { label: "Contact", href: "https://kheelona.com/contact" },
    ],
  },
  seller: { entity: "Entity Ltd", address: "1 Road", contact: <a href="https://wa.me/91">WhatsApp</a> },
  grievance: "Grievance Officer: A Person.",
  copyright: "© 2026 Entity Ltd",
};

const CSS = readFileSync("src/components/chrome/StoreFooter/store-footer.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ");

describe("StoreFooter", () => {
  it("is the page's contentinfo in the DS footer, its content in the container grid", () => {
    render(<StoreFooter {...PROPS} />);
    const footer = screen.getByRole("contentinfo");
    expect(footer.className).toBe("kh-footer ks-store-foot");
    expect(footer.firstElementChild!.className).toBe("kh-container ks-store-foot__in");
  });

  it("prints, in order: the policy links, the seller address, the grievance line, the copyright", () => {
    const { container } = render(<StoreFooter {...PROPS} />);
    const parts = Array.from(container.querySelector(".ks-store-foot__in")!.children);
    expect(parts.map((p) => [p.tagName, p.className])).toEqual([
      ["NAV", "ks-policy"],
      ["ADDRESS", "kh-body-s ks-store-foot__seller"],
      ["P", "kh-body-s"],
      ["P", "kh-footer__legal"],
    ]);
    expect(parts[2].textContent).toBe("Grievance Officer: A Person.");
    expect(parts[3].textContent).toBe("© 2026 Entity Ltd");
  });

  it("opens each policy link in a new tab and says so to screen readers", () => {
    render(<StoreFooter {...PROPS} />);
    const nav = screen.getByRole("navigation", { name: "Policies" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((a) => [a.getAttribute("href"), a.getAttribute("target"), a.textContent])).toEqual([
      ["https://kheelona.com/terms", "_blank", "Pre-order terms (opens in a new tab)"],
      ["https://kheelona.com/contact", "_blank", "Contact (opens in a new tab)"],
    ]);
  });

  /* The mockup's GSTIN line came off the website (D063 item 3, D064 item 11; task Q2.3). */
  it("prints the seller block in the store's order: entity in bold, address, contact", () => {
    const { container } = render(<StoreFooter {...PROPS} />);
    const address = container.querySelector("address")!;
    expect(address.querySelector("strong")).toHaveTextContent("Entity Ltd");
    expect(address.querySelectorAll("br")).toHaveLength(2);
    expect(address.textContent).toBe("Entity Ltd1 RoadWhatsApp");
  });

  it("adds the payments line before the copyright when it is given", () => {
    const { container } = render(<StoreFooter {...PROPS} payments={<>No payment fees.</>} />);
    const parts = Array.from(container.querySelector(".ks-store-foot__in")!.children);
    expect(parts.map((p) => p.textContent).slice(2)).toEqual(["Grievance Officer: A Person.", "No payment fees.", "© 2026 Entity Ltd"]);
    expect(parts[3].className).toBe("kh-body-s");
  });

  it("keeps the muted measure, the link boxes and the laptop grid of store.css:13-27", () => {
    expect(CSS).toContain(".ks-store-foot { padding-inline: var(--space-4); border-top: var(--stroke-hair) solid var(--border); }");
    expect(CSS).toContain(".ks-store-foot__in { display: grid; gap: var(--space-5); align-items: start; }");
    expect(CSS).toContain(".ks-store-foot p, .ks-store-foot__seller { margin: 0; max-width: var(--measure); color: var(--text-muted); }");
    expect(CSS).toContain(".ks-store-foot__seller { font-style: normal; }");
    expect(CSS).toContain(".ks-store-foot__seller strong { color: var(--text); }");
    expect(CSS).toContain(
      ".ks-store-foot .kh-body-s a { color: var(--link); padding-block: var(--space-1); margin-block: calc(var(--space-1) * -1); }",
    );
    expect(CSS).toContain(".ks-store-foot .kh-footer__legal { max-width: none; }");
    expect(CSS).toContain(
      "@media (min-width: 1024px) { .ks-store-foot { padding-inline: var(--space-7); } .ks-store-foot__in { grid-template-columns: repeat(3, minmax(0, 1fr)); column-gap: var(--space-7); } .ks-store-foot__in > .ks-policy, .ks-store-foot__in > .kh-footer__legal { grid-column: 1 / -1; } }",
    );
  });
});
