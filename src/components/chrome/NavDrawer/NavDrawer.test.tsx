import { readFileSync } from "node:fs";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { ICON_CARET_RIGHT, ICON_X } from "@/assets/icons.generated";
import { STORE_URL } from "@/config/site";
import { buildOffer } from "@/lib/offer/offer";
import { NavDrawer, type NavDrawerProps } from "./NavDrawer";

/* NavDrawer (task 3.1; D049 pick 5): the DS NavDrawer as a native modal <dialog>, exactly as
 * mockup/partials/drawer.html writes it, with the mockup.js behaviour (a link, the close button or the backdrop
 * closes it; Escape is the dialog's own). The panel's slide is motion.css's. Full element parity with
 * mockup/home.html: SiteShell.test.tsx. */

/* jsdom has no <dialog> behaviour: a minimal showModal and close. */
beforeAll(() => {
  const proto = HTMLDialogElement.prototype as HTMLDialogElement & Record<string, unknown>;
  proto.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  proto.close ??= function (this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

const offer = buildOffer("token");
const PROPS: NavDrawerProps = {
  id: "menu",
  label: "Menu",
  navLabel: "Main",
  logo: { alt: "Kheelona, home", href: "/" },
  closeLabel: "Close menu",
  links: [
    { label: "Meet Kheelu", href: "/products/kheelu" },
    { label: "Safety", href: "/safety" },
  ],
  ctaLabel: "Pre-order Kheelu",
  offer,
  note: "Deliveries start mid-November · 7-day returns, no questions asked",
};

const CSS = readFileSync("src/components/chrome/NavDrawer/nav-drawer.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ");

function dialogOf(container: HTMLElement): HTMLDialogElement {
  const dialog = container.querySelector("dialog");
  if (!(dialog instanceof HTMLDialogElement)) throw new Error("no <dialog>");
  return dialog;
}

describe("NavDrawer", () => {
  it("is a closed DS drawer dialog, named and addressable by the menu button", () => {
    const { container } = render(<NavDrawer {...PROPS} />);
    const dialog = dialogOf(container);
    expect(dialog).toHaveClass("kh-drawer");
    expect(dialog).toHaveAttribute("id", "menu");
    expect(dialog).toHaveAttribute("aria-label", "Menu");
    expect(dialog).not.toHaveAttribute("open");
    expect(dialog.children).toHaveLength(1);
    expect(dialog.firstElementChild).toHaveClass("kh-drawer__panel");
  });

  it("heads the panel with the logo home and the close button (its title as the mockup's)", () => {
    const { container } = render(<NavDrawer {...PROPS} />);
    const head = container.querySelector(".kh-drawer__panel > .kh-drawer__head") as HTMLElement;
    const [logo, close] = Array.from(head.children);
    expect(logo).toHaveClass("kh-logo-link");
    expect(logo).toHaveAttribute("href", "/");
    expect(within(logo as HTMLElement).getByRole("img", { name: "Kheelona, home", hidden: true })).toHaveClass("kh-logo");
    expect(close.tagName).toBe("BUTTON");
    expect(close.className).toBe("kh-iconbtn");
    expect(close).toHaveAttribute("aria-label", "Close menu");
    expect(close).toHaveAttribute("title", "Close menu");
    expect(close.querySelector("path")).toHaveAttribute("d", ICON_X);
  });

  it("lists the links in a named navigation, each with its label in a span and a chevron", () => {
    const { container } = render(<NavDrawer {...PROPS} />);
    const links = container.querySelector(".kh-drawer__panel > nav.kh-drawer__links") as HTMLElement;
    expect(links).toHaveAttribute("aria-label", "Main");
    const anchors = Array.from(links.children);
    expect(anchors.map((a) => [a.tagName, a.className, a.getAttribute("href"), a.querySelector("span")?.textContent])).toEqual([
      ["A", "kh-drawer__link", "/products/kheelu", "Meet Kheelu"],
      ["A", "kh-drawer__link", "/safety", "Safety"],
    ]);
    const chevron = anchors[0].querySelector("svg")!;
    expect(chevron.getAttribute("class")).toBe("kh-icon kh-drawer__chev");
    expect(chevron).toHaveAttribute("aria-hidden", "true");
    expect(chevron.querySelector("path")).toHaveAttribute("d", ICON_CARET_RIGHT);
  });

  it("ends with the large full-width chilli button and the two notes: the price sentence, then delivery and returns", () => {
    const { container } = render(<NavDrawer {...PROPS} />);
    const cta = container.querySelector(".kh-drawer__panel > .kh-drawer__cta") as HTMLElement;
    const [button, price, note] = Array.from(cta.children);
    expect(button.className.split(/\s+/)).toEqual(["kh-btn", "kh-btn--cta", "kh-btn--l", "kh-btn--block"]);
    expect(button).toHaveAttribute("href", STORE_URL);
    expect(button).toHaveAttribute("data-ph-capture-attribute-cta", "navbar-mobile");
    expect(button).toHaveTextContent("Pre-order Kheelu");
    expect(price.className).toBe("kh-drawer__note");
    expect(price.textContent).toBe(
      "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST).",
    );
    expect(note.className).toBe("kh-drawer__note");
    expect(note.textContent).toBe("Deliveries start mid-November · 7-day returns, no questions asked");
  });

  it("follows the offer's mode: the full-mode sentence when the store has moved to full price", () => {
    const { container } = render(<NavDrawer {...PROPS} offer={buildOffer("full")} />);
    expect(container.querySelector(".kh-drawer__note")?.textContent).toBe("₹7,999 (incl. GST), paid in full when you order.");
  });

  it("closes from the close button, from any link, and from the backdrop, but not from a click inside the panel", () => {
    const { container } = render(<NavDrawer {...PROPS} />);
    const dialog = dialogOf(container);
    const cases: Array<[string, Element, boolean]> = [
      ["the close button", screen.getByRole("button", { name: "Close menu", hidden: true }), false],
      ["a drawer link", container.querySelector(".kh-drawer__link")!, false],
      ["the chilli button", container.querySelector(".kh-btn--cta")!, false],
      ["the logo", container.querySelector(".kh-logo")!, false],
      ["the backdrop (the dialog itself)", dialog, false],
      ["a note inside the panel", container.querySelector(".kh-drawer__note")!, true],
      ["the panel", container.querySelector(".kh-drawer__panel")!, true],
    ];
    for (const [what, target, staysOpen] of cases) {
      dialog.showModal();
      fireEvent.click(target);
      expect(dialog.hasAttribute("open"), what).toBe(staysOpen);
      dialog.close();
    }
  });

  it("lays the dialog over the whole screen with the DS scrim behind it (mockup.css:61-62)", () => {
    expect(CSS).toContain(
      "dialog.kh-drawer { width: 100%; max-width: none; height: 100%; max-height: none; margin: 0; padding: 0; border: 0; background: transparent; }",
    );
    expect(CSS).toContain("dialog.kh-drawer::backdrop { background: var(--scrim); }");
    expect(CSS).not.toMatch(/animation|transition/);
  });
});
