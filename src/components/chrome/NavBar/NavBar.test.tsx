import { readFileSync } from "node:fs";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ICON_LIST } from "@/assets/icons.generated";
import { STORE_URL } from "@/config/site";
import { NavBar, type NavBarProps } from "./NavBar";

/* NavBar (task 3.1): the DS NavBar as mockup/partials/nav.html writes it: logo home, the four links (the current
 * page's marked, as mockup/build.mjs marks the page's "active" link), the chilli button from 1024 px only (G-06, D041)
 * and the phone menu button that opens the drawer dialog. The full element parity with mockup/home.html is
 * SiteShell.test.tsx's. */

const nav = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

/* jsdom has no <dialog> behaviour: a minimal showModal and close, with the close event the button listens for. */
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
afterEach(() => {
  nav.pathname = "/";
  document.body.innerHTML = "";
});

const PROPS: NavBarProps = {
  label: "Main",
  logo: { alt: "Kheelona, home", href: "/" },
  links: [
    { label: "Meet Kheelu", href: "/products/kheelu" },
    { label: "Safety", href: "/safety" },
    { label: "Stories", href: "/stories" },
    { label: "Team", href: "/team" },
  ],
  ctaLabel: "Pre-order Kheelu",
  menu: { label: "Menu", controls: "menu" },
};

const CSS = readFileSync("src/components/chrome/NavBar/nav-bar.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ");

describe("NavBar", () => {
  it("is the main navigation landmark, opening with the logo linking home", () => {
    render(<NavBar {...PROPS} />);
    const landmark = screen.getByRole("navigation", { name: "Main" });
    expect(landmark).toHaveClass("kh-nav");
    const home = within(landmark).getByRole("link", { name: "Kheelona, home" });
    expect(home).toHaveClass("kh-logo-link");
    expect(home).toHaveAttribute("href", "/");
    expect(landmark.firstElementChild).toBe(home);
  });

  it("lists the four links in order in kh-nav__links", () => {
    const { container } = render(<NavBar {...PROPS} />);
    const links = Array.from(container.querySelectorAll(".kh-nav__links > a"));
    expect(links.map((a) => [a.className, a.textContent, a.getAttribute("href")])).toEqual(
      PROPS.links.map((l) => ["kh-nav__link", l.label, l.href]),
    );
  });

  it.each([
    ["/", null],
    ["/products/kheelu", "Meet Kheelu"],
    ["/safety", "Safety"],
    ["/stories", "Stories"],
    ["/stories/learning-toys-for-a-three-year-old", "Stories"],
    ["/team", "Team"],
    ["/setup", null],
    ["/safety-net", null],
  ])("on %s marks %s as the current page, and nothing else", (pathname, current) => {
    nav.pathname = pathname;
    const { container } = render(<NavBar {...PROPS} />);
    const marked = Array.from(container.querySelectorAll('.kh-nav__link[aria-current="page"]')).map((a) => a.textContent);
    expect(marked).toEqual(current ? [current] : []);
  });

  it("ends with the small chilli button to the store, hidden below 1024 px (ks-nav-cta)", () => {
    const { container } = render(<NavBar {...PROPS} />);
    const end = container.querySelector(".kh-nav__end")!;
    const cta = within(end as HTMLElement).getByRole("link", { name: "Pre-order Kheelu" });
    expect(cta.className.split(/\s+/)).toEqual(["kh-btn", "kh-btn--cta", "kh-btn--s", "ks-nav-cta"]);
    expect(cta).toHaveAttribute("href", STORE_URL);
    expect(cta).toHaveAttribute("data-ph-capture-attribute-cta", "navbar");
    expect(CSS).toContain(".ks-nav-cta { display: none; }");
    expect(CSS).toContain("@media (min-width: 1024px) { .ks-nav-cta { display: inline-flex; } }");
  });

  it("ends with the phone menu button: named, collapsed, controlling the drawer, drawing the list icon", () => {
    render(<NavBar {...PROPS} />);
    const button = screen.getByRole("button", { name: "Menu" });
    expect(button).toHaveClass("kh-nav__menu");
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "menu");
    expect(button.querySelector("svg path")).toHaveAttribute("d", ICON_LIST);
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(button.parentElement).toHaveClass("kh-nav__end");
    expect(button.parentElement!.lastElementChild).toBe(button);
  });

  it("opens the drawer dialog as a modal and reports it expanded, then collapsed again when it closes", async () => {
    const dialog = document.createElement("dialog");
    dialog.id = "menu";
    document.body.append(dialog);
    const showModal = vi.spyOn(dialog, "showModal");
    render(<NavBar {...PROPS} />);
    const button = screen.getByRole("button", { name: "Menu" });
    await userEvent.click(button);
    expect(showModal).toHaveBeenCalledOnce();
    expect(dialog).toHaveAttribute("open");
    expect(button).toHaveAttribute("aria-expanded", "true");
    act(() => dialog.close());
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("does nothing when the dialog it controls is missing", async () => {
    render(<NavBar {...PROPS} />);
    const button = screen.getByRole("button", { name: "Menu" });
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});

/* Vercel re-renders Home in its runtime under the route segments ["", "index"], so usePathname() reads "/index" on the
   server and "/" in the browser (task 8c.7; CMO wave 8c review m1). The current link reads the path through useSitePath
   (src/lib/site-path.ts), so the server HTML marks what the browser marks. A link to Home makes the difference visible
   (the approved four links have none). */
describe("NavBar: the page path as Vercel's runtime render gives it (task 8c.7)", () => {
  const WITH_HOME: NavBarProps = { ...PROPS, links: [{ label: "Home", href: "/" }, ...PROPS.links] };
  const serverHtml = (props: NavBarProps, pathname: string) => {
    nav.pathname = pathname;
    return renderToString(<NavBar {...props} />);
  };

  it.each([
    ["the approved links", "/index", "/", PROPS],
    ["a link to Home", "/index", "/", WITH_HOME],
    ["a link to Home", "/stories/index", "/stories", WITH_HOME],
  ] as const)("with %s, renders on %s exactly as on %s", (_, runtime, browser, props) => {
    expect(serverHtml(props, runtime)).toBe(serverHtml(props, browser));
  });

  it('marks Home\'s link on /index, as on "/"', () => {
    nav.pathname = "/index";
    const { container } = render(<NavBar {...WITH_HOME} />);
    expect(Array.from(container.querySelectorAll('.kh-nav__link[aria-current="page"]')).map((a) => a.textContent)).toEqual(["Home"]);
  });

  it("hydrates the server HTML rendered as /index in the browser at / without a mismatch (React #418)", async () => {
    const container = document.createElement("div");
    container.innerHTML = serverHtml(WITH_HOME, "/index");
    document.body.appendChild(container);
    nav.pathname = "/";
    const recoverable = vi.fn();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(container, <NavBar {...WITH_HOME} />, { onRecoverableError: recoverable });
    });
    expect(recoverable).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    act(() => root?.unmount());
    consoleError.mockRestore();
  });
});
