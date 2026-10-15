import { readFileSync } from "node:fs";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import postcss, { type AtRule, type Rule } from "postcss";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ICON_LIST } from "@/assets/icons.generated";
import { STORE_URL } from "@/config/site";
import { NavBar, type NavBarProps } from "./NavBar";

/* NavBar (task 3.1): the DS NavBar as mockup/partials/nav.html writes it: logo home, the four links (the current
 * page's marked, as mockup/build.mjs marks the page's "active" link), the chilli button and the phone menu button that
 * opens the drawer dialog. The full element parity with mockup/home.html is SiteShell.test.tsx's.
 * Task Q2.5 (main-session ruling 2 of the selling update): from 900 px, where the DS shows the four links and the phone
 * buy bar is gone, the bar sticks to the top with its chilli button (until then the button came at 1024 px, so neither
 * it nor the bar showed from 900 to 1023 px); and the link's hover line slides in (D064 item 10). */

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

const SOURCE = readFileSync("src/components/chrome/NavBar/nav-bar.css", "utf8");
const CSS = SOURCE.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ");
const BUNDLE = readFileSync("design-system/project/components/bundle.css", "utf8");
const TOKENS = readFileSync("design-system/project/tokens.css", "utf8");
/** The DS's laptop width for the nav: where bundle.css shows the links and hides the menu button. */
const BUNDLE_BREAKPOINT = `(${/@media \(([^)]+)\) \{\s*\.kh-nav__links \{ display: flex; \}/.exec(BUNDLE)?.[1]})`;
const WIDE = "(min-width: 900px)";

/** nav-bar.css's rules: selector, the @media they sit in (if any) and their declarations. */
function rules(): Array<{ selector: string; media?: string; decls: Record<string, string> }> {
  const out: Array<{ selector: string; media?: string; decls: Record<string, string> }> = [];
  postcss.parse(SOURCE).walkRules((rule: Rule) => {
    const media = rule.parent?.type === "atrule" ? (rule.parent as AtRule).params : undefined;
    const decls: Record<string, string> = {};
    rule.walkDecls((d) => {
      decls[d.prop] = d.value;
    });
    out.push({ selector: rule.selector.replace(/\s+/g, " "), media, decls });
  });
  return out;
}

/** The declarations nav-bar.css gives `selector` (in `media`, or outside any @media), merged in source order. */
function declsOf(selector: string, media?: string): Record<string, string> {
  return Object.assign(
    {},
    ...rules()
      .filter((r) => r.media === media && r.selector.split(",").map((s) => s.trim()).includes(selector))
      .map((r) => r.decls),
  );
}

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

  it("ends with the small chilli button to the store, hidden below 900 px (ks-nav-cta)", () => {
    const { container } = render(<NavBar {...PROPS} />);
    const end = container.querySelector(".kh-nav__end")!;
    const cta = within(end as HTMLElement).getByRole("link", { name: "Pre-order Kheelu" });
    expect(cta.className.split(/\s+/)).toEqual(["kh-btn", "kh-btn--cta", "kh-btn--s", "ks-nav-cta"]);
    expect(cta).toHaveAttribute("href", STORE_URL);
    expect(cta).toHaveAttribute("data-ph-capture-attribute-cta", "navbar");
    expect(declsOf(".ks-nav-cta")).toEqual({ display: "none" });
    expect(declsOf(".ks-nav-cta", WIDE)).toEqual({ display: "inline-flex" });
    expect(CSS).not.toContain("1024px");
  });

  /* Task Q2.5: the bar sticks from 900 px, the DS's own laptop width (bundle.css: the links show and the menu button
     goes at 900 px; the phone buy bar is phone-only, hidden from 900 px), so a buy button is always in view on a laptop. */
  it("sticks to the top from 900 px on the DS sticky layer, never on phones and never the store's header", () => {
    expect(BUNDLE_BREAKPOINT).toBe(WIDE);
    expect(declsOf("nav.kh-nav", WIDE)).toEqual({ position: "sticky", top: "0", "z-index": "var(--z-sticky)" });
    // Only the marketing nav: the store's header is a `header.kh-nav` (StoreHeader) and stays where it is.
    expect(rules().filter((r) => r.selector.split(",").some((s) => /(^|\s)\.kh-nav(?![\w-])/.test(s.trim())))).toEqual([]);
    expect(rules().filter((r) => r.media !== WIDE && r.decls.position === "sticky")).toEqual([]);
  });

  /* Q2.5 review: the room the stuck bar takes is one value, --ks-nav-clearance, set only where the bar sticks. The
     page's scroll padding reads it, and so does any of the page's own sticky elements (the legal contents panel), so
     each sits below the bar on a laptop and where it always did without the bar (a phone, a story with no nav). */
  it("lands an in-page jump below the sticky bar: scroll-padding-top equals the DS bar's height, from 900 px only", () => {
    const html = declsOf("html:has(> body > nav.kh-nav)", WIDE);
    expect(html).toEqual({ "--ks-nav-clearance": "calc(var(--space-8) + var(--space-2))", "scroll-padding-top": "var(--ks-nav-clearance)" });
    expect(rules().filter((r) => r.media !== WIDE && "--ks-nav-clearance" in r.decls)).toEqual([]);
    const navHeight = Number(/\.kh-nav \{[^}]*min-height: (\d+)px/.exec(BUNDLE)![1]);
    const space = (n: number) => Number(new RegExp(`--space-${n}: (\\d+)px`).exec(TOKENS)![1]);
    expect(space(8) + space(2)).toBe(navHeight);
  });

  /* D064 item 10: a text link's underline slides in. The nav link's hover line is the DS's (bundle.css: a sun line
     --stroke-focus thick on the link's bottom edge); it is drawn by ::after, resting at no width, which motion.css grows
     from the left on hover (pointer devices) and keyboard focus. The current page's ink line stays the DS's border. */
  it("draws the link's hover line as the DS's, on ::after at rest with no width, and none on the current page's link", () => {
    expect(declsOf(".kh-nav__link::after")).toEqual({
      content: '""',
      position: "absolute",
      left: "0",
      right: "0",
      bottom: "calc(var(--stroke-focus) * -1)",
      height: "var(--stroke-focus)",
      background: "var(--sun-500)",
      transform: "scaleX(var(--ks-stroke-start))",
      "transform-origin": "left center",
      "pointer-events": "none",
    });
    expect(BUNDLE).toMatch(/\.kh-nav__link:hover \{ border-bottom-color: var\(--sun-500\); \}/);
    expect(BUNDLE).toMatch(/\.kh-nav__link \{[^}]*border-bottom: var\(--stroke-focus\) solid transparent/);
    expect(declsOf('.kh-nav__link:not([aria-current="page"]):hover')).toEqual({ "border-bottom-color": "transparent" });
    expect(declsOf('.kh-nav__link[aria-current="page"]::after')).toEqual({ content: "none" });
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
   server and "/" in the browser (task 8c.7; CMO wave 8c review m1). The current link reads the path through usePagePath
   (src/lib/page-path.ts), so the server HTML marks what the browser marks. A link to Home makes the difference visible
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
    try {
      await act(async () => {
        root = hydrateRoot(container, <NavBar {...WITH_HOME} />, { onRecoverableError: recoverable });
      });
      expect(recoverable).not.toHaveBeenCalled();
      expect(consoleError).not.toHaveBeenCalled();
    } finally {
      // A failed expect must not leave a hydrated root, its container or a muted console.error to the tests after it.
      act(() => root?.unmount());
      container.remove();
      consoleError.mockRestore();
    }
  });
});
