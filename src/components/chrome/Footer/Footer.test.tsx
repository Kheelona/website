import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FOOTER_LEGAL, groupFooterLinks } from "../../../../test/e2e/support/deviations";
import { Footer, type FooterProps } from "./Footer";

/* Footer (task 3.1): the DS Footer as mockup/partials/footer.html writes it. The full element parity with the
 * mockup (every class, link and line, from content) is SiteShell.test.tsx's; this covers the parts and their
 * accessibility contract with fixture props. */

const PROPS: FooterProps = {
  logoAlt: "Kheelona",
  promise: "Press to talk. No open internet. You read every conversation.",
  made: "Designed by parents in Bengaluru. Made in India.",
  columns: [
    { id: "kheelu", title: "Kheelu", links: [{ label: "Meet Kheelu", href: "/products/kheelu" }] },
    {
      id: "help",
      title: "Help",
      links: [
        { label: "Contact", href: "/contact" },
        { label: "Privacy", href: "/privacy" },
      ],
    },
  ],
  seller: { entity: "© 2026 Entity", address: "1 Road", contact: <a href="https://wa.me/91">WhatsApp</a> },
  grievance: { label: "Grievance officer", href: "/contact" },
};

const CSS = readFileSync("src/components/chrome/Footer/footer.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

describe("Footer", () => {
  it("is the page's contentinfo landmark in the DS footer", () => {
    render(<Footer {...PROPS} />);
    expect(screen.getByRole("contentinfo")).toHaveClass("kh-footer");
  });

  it("opens with the logo (not a link), the promise and the made-in line", () => {
    const { container } = render(<Footer {...PROPS} />);
    const top = container.querySelector(".kh-footer__top")!;
    const [logo, promise, made] = Array.from(top.children);
    expect(logo.tagName).toBe("IMG");
    expect(logo).toHaveClass("kh-logo");
    expect(logo).toHaveAttribute("alt", "Kheelona");
    expect(logo.closest("a")).toBeNull();
    expect(promise).toHaveClass("kh-footer__promise");
    expect(promise).toHaveTextContent(PROPS.promise);
    expect(made).toHaveClass("kh-footer__made");
    expect(made).toHaveTextContent(PROPS.made);
  });

  it("gives each column a level-two heading and its links in order", () => {
    const { container } = render(<Footer {...PROPS} />);
    const cols = container.querySelectorAll(".kh-footer__cols > .kh-footer__col");
    expect(cols).toHaveLength(2);
    expect(within(cols[1] as HTMLElement).getByRole("heading", { level: 2 })).toHaveTextContent("Help");
    expect(within(cols[1] as HTMLElement).getAllByRole("link").map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Contact", "/contact"],
      ["Privacy", "/privacy"],
    ]);
  });

  /* Three seller lines: the mockup's GSTIN line came off the website (D063 item 3, D064 item 11; task Q2.3). Since task
     Q2.16 (consistency review QAL-1) the contact line and the grievance officer link are one group, so they wrap
     together: at 1280 px "Grievance officer" fell alone onto a third line, at 1024 px the contact floated at the right
     edge between the address and it. */
  it("prints the seller lines, then the contact line and the grievance officer link as one group of the legal row", () => {
    const { container } = render(<Footer {...PROPS} />);
    const parts = Array.from(container.querySelectorAll(".kh-footer__legal > *"));
    expect(parts.map((p) => `${p.tagName}.${p.className}`)).toEqual(["SPAN.", "SPAN.", "SPAN.ks-footer__links"]);
    expect(parts.map((p) => p.textContent)).toEqual(["© 2026 Entity", "1 Road", "WhatsAppGrievance officer"]);
    expect(within(parts[2] as HTMLElement).getAllByRole("link").map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["WhatsApp", "https://wa.me/91"],
      ["Grievance officer", "/contact"],
    ]);
  });

  /* The legal row's links in the DS link colour, each a full tap target (CMO M9), now without moving the line (task
     Q2.16, QAL-1): mockup.css:126 centred each link's words in a 48 px inline-flex box, which set them 16 px below the
     copyright and the address on the same row at 1440 px. Each link's own padding makes the 48 px (--tap-min: its 16 px
     line and a space-4 above and below), and its negative margins give the line its height back, as the store footer's
     links do (store-footer.css). The group wraps its two parts a space-6 apart, so their 48 px targets never overlap
     where it wraps (343 px and narrower), and a space-4 apart side by side, the row's own column gap. */
  it("keeps each legal link a full tap target on the seller lines' baseline, and the group's targets apart", () => {
    const rule = (selector: string) =>
      new RegExp(`(?:^|})\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`).exec(CSS)?.[1].replace(/\s+/g, " ").trim();
    expect(rule(".kh-footer__legal a")).toBe(
      "display: inline-block; padding-block: var(--space-4); margin-block: calc(var(--space-4) * -1); color: var(--link);",
    );
    expect(rule(".ks-footer__links")).toBe("display: flex; flex-wrap: wrap; gap: var(--space-6) var(--space-4);");
    const [line, space4, tapMin] = [16, 16, 48];
    expect(line + 2 * space4).toBe(tapMin);
    expect(CSS).not.toContain("inline-flex");
  });

  /* The chrome's parity tests hold the build's footer to the mockup's (SiteShell.test.tsx and not-found.test.tsx
     element by element, chrome.spec.ts pixel by pixel). The grouped legal row is one shared rule of deviations.ts
     (FOOTER_LEGAL, task Q2.16): groupFooterLinks groups the mockup's contact and grievance spans as SellerLines does, and
     the rules chrome.spec.ts gives the mockup's footer are footer.css's own, after undoing mockup.css:126's 48 px box. */
  it("hands the chrome's parity tests the build's legal row: the mockup's spans grouped as built, footer.css's own rules", () => {
    const legalRules = (css: string) =>
      [...css.matchAll(/(\.kh-footer__legal a|\.ks-footer__links)\s*\{([^}]*)\}/g)].map((m) => `${m[1]} { ${m[2].replace(/\s+/g, " ").trim()} }`);
    expect(legalRules(CSS)).toHaveLength(2);
    expect(legalRules(FOOTER_LEGAL.rules)).toEqual(legalRules(CSS));
    expect(FOOTER_LEGAL.undo).toBe(".kh-footer__legal a { min-height: 0; }");
    expect(FOOTER_LEGAL.approvedBy).toMatch(/Q2\.16.*QAL-1/);

    const mockup = document.createElement("footer");
    mockup.innerHTML = `<div class="kh-footer__legal">
      <span>© 2026 Entity</span>
      <span>1 Road</span>
      <span><a href="https://wa.me/91">WhatsApp</a></span>
      <span><a href="/contact">Grievance officer</a></span>
    </div>`;
    expect(groupFooterLinks(mockup)).toBe(mockup);
    const { container } = render(<Footer {...PROPS} />);
    const markup = (el: Element) => el.innerHTML.replace(/>\s+</g, "><").trim();
    expect(markup(mockup.querySelector(".kh-footer__legal")!)).toBe(markup(container.querySelector(".kh-footer__legal")!));
    /* A row in any other shape is a mistake, never a silent pass. */
    mockup.innerHTML = `<div class="kh-footer__legal"><span>© 2026 Entity</span><span>1 Road</span></div>`;
    expect(() => groupFooterLinks(mockup)).toThrow(/kh-footer__legal/);
  });

  /* D064 item 6 (task Q2.4): the gaps between a column's links tightened. The DS stacks them as 48 px rows (bundle.css
     .kh-footer__col a: 12 px above and below a 24 px line); the rows become 44 px, the smallest tap target the site keeps
     (tasks.md SPA 4), still made of the link's own padding, never margins, so the space between two links is always one
     of them to tap: 10 px (space-2 and half a space-1) above and below the 24 px line. */
  it("tightens each column's links to 44 px rows of their own padding, never margins", () => {
    const rule = /\.kh-footer__col a \{([^}]*)\}/.exec(CSS)?.[1].replace(/\s+/g, " ").trim();
    expect(rule).toBe("padding-block: calc(var(--space-2) + var(--space-1) / 2);");
    expect(CSS).not.toMatch(/\.kh-footer__col[^{]*\{[^}]*margin/);
    const [space1, space2, line] = [4, 8, 24];
    expect(line + 2 * (space2 + space1 / 2)).toBe(44);
  });

  /* The selling update (task Q2.12; the main session's ruling on the footer on laptops): with a mouse or a trackpad (a
     fine pointer that hovers) the column links sit closer, 32 px rows (a space-1 above and below the 24 px line), so a
     column reads as one list; every link stays a target of at least 24 x 24 px (WCAG 2.2 SC 2.5.8, its full column wide),
     and a touch screen keeps the 44 px rows above. Still the link's own padding, never a margin. */
  it("tightens the column links to 32 px rows on pointer-fine devices only, never under WCAG 2.5.8's 24 px", () => {
    const query = /@media \(hover: hover\) and \(pointer: fine\) \{\s*([^{}]*\{[^}]*\})\s*\}/.exec(CSS)?.[1].replace(/\s+/g, " ").trim();
    expect(query).toBe(".kh-footer__col a { padding-block: var(--space-1); }");
    /* The touch rows stay the first, unqueried rule. */
    expect(CSS.indexOf(".kh-footer__col a {")).toBeLessThan(CSS.indexOf("@media (hover: hover) and (pointer: fine)"));
    const [space1, line, target] = [4, 24, 24];
    expect(line + 2 * space1).toBe(32);
    expect(line + 2 * space1).toBeGreaterThanOrEqual(target);
  });
});
