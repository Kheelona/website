import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StoreHeader } from "./StoreHeader";

/* StoreHeader (task 3.1): the store's own header, mockup/store.html fold 0 (shared with store-confirmation.html):
 * the logo linking to the marketing site and a person to reach, no site nav (live store chrome by design). Element
 * parity with the mockup, from content: StoreShell.test.tsx. */

const help = (
  <>
    <a href="https://wa.me/919187546483">WhatsApp</a> or <a href="tel:+919187546483">call</a>
  </>
);
const CSS = readFileSync("src/components/chrome/StoreHeader/store-header.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ");

describe("StoreHeader", () => {
  it("is the page's banner in the DS nav look, its content in the container", () => {
    const { container } = render(
      <StoreHeader logo={{ alt: "Kheelona", href: "https://kheelona.com", linkLabel: "Kheelona home" }} help={{ lead: "Need help?", contact: help }} />,
    );
    const banner = screen.getByRole("banner");
    expect(banner.className).toBe("kh-nav ks-store-head");
    expect(banner.children).toHaveLength(1);
    expect(banner.firstElementChild!.className).toBe("kh-container ks-store-head__in");
    expect(container.querySelectorAll("nav")).toHaveLength(0);
  });

  it("links the logo to the marketing site under its own name", () => {
    render(<StoreHeader logo={{ alt: "Kheelona", href: "https://kheelona.com", linkLabel: "Kheelona home" }} help={{ lead: "Need help?", contact: help }} />);
    const link = screen.getByRole("link", { name: "Kheelona home" });
    expect(link).toHaveClass("kh-logo-link");
    expect(link).toHaveAttribute("href", "https://kheelona.com");
    expect(within(link).getByRole("img")).toHaveAttribute("alt", "Kheelona");
  });

  it("offers a person: the help line with WhatsApp and call, at the end of the row", () => {
    render(<StoreHeader logo={{ alt: "Kheelona", href: "https://kheelona.com", linkLabel: "Kheelona home" }} help={{ lead: "Need help?", contact: help }} />);
    const line = screen.getByText("Need help?", { exact: false });
    expect(line.tagName).toBe("P");
    expect(line.className).toBe("kh-body-s ks-help ks-store-head__help");
    expect(line.textContent).toBe("Need help? WhatsApp or call");
    expect(within(line).getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["https://wa.me/919187546483", "tel:+919187546483"]);
  });

  it("lines up with the content container (store.css:9-11, :24)", () => {
    expect(CSS).toContain(".ks-store-head { padding-inline: var(--space-4); }");
    expect(CSS).toContain(".ks-store-head__in { display: flex; align-items: center; gap: var(--space-4); }");
    expect(CSS).toContain(".ks-store-head__help { margin: 0 0 0 auto; text-align: right; }");
    expect(CSS).toContain("@media (min-width: 1024px) { .ks-store-head { padding-inline: var(--space-7); } }");
  });
});
