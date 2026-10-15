import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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

  /* Three seller lines: the mockup's GSTIN line came off the website (D063 item 3, D064 item 11; task Q2.3). */
  it("prints the seller lines, then the grievance officer link, each in its own span of the legal row", () => {
    const { container } = render(<Footer {...PROPS} />);
    const spans = Array.from(container.querySelectorAll(".kh-footer__legal > span"));
    expect(spans.map((s) => s.textContent)).toEqual(["© 2026 Entity", "1 Road", "WhatsApp", "Grievance officer"]);
    expect(within(spans[3] as HTMLElement).getByRole("link")).toHaveAttribute("href", "/contact");
  });

  it("gives the legal row's links the DS link colour and a full tap height (mockup.css:126)", () => {
    expect(CSS.replace(/\s+/g, " ")).toContain(
      ".kh-footer__legal a { display: inline-flex; align-items: center; min-height: var(--tap-min); color: var(--link); }",
    );
  });
});
