import { describe, expect, it } from "vitest";
import { readRepoFile } from "../../../test/e2e/support/repo";
import { navigation } from "./navigation";

/* Navigation (architecture §6.1; strategy §4.4; mockup/partials/{nav,drawer,footer}.html): the
 * links, their order, the footer columns and lines, the store's policy links and the chrome's
 * own labels, exactly as the approved mockup prints them. */

const doc = (slug: string) => new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const sitePath = (href: string) =>
  `/${href.replace(/\.html/, "").replace(/^home$/, "").replace(/^meet-kheelu/, "products/kheelu")}`;
const links = (root: Element | null, selector = "a") =>
  Array.from(root?.querySelectorAll(selector) ?? []).map((a) => ({
    label: norm(a.textContent).replace(/ \(opens in a new tab\)$/, ""),
    href: sitePath(a.getAttribute("href") ?? ""),
  }));
const home = doc("home");

describe("the main links (laptop nav and phone drawer)", () => {
  it("are the four the nav shows, in order (PlayOS left the nav)", () => {
    expect(navigation.main).toEqual(links(home.querySelector(".kh-nav__links")));
    expect(navigation.main.map((l) => l.label)).toEqual(["Meet Kheelu", "Safety", "Stories", "Team"]);
  });

  it("are the same four in the drawer", () => {
    expect(navigation.main).toEqual(links(home.querySelector(".kh-drawer__links")));
  });
});

describe("the chrome's own labels", () => {
  it("name the nav, the menu, the drawer, the logo and the skip link as the mockup does", () => {
    expect(navigation.labels.nav).toBe(home.querySelector("nav.kh-nav")?.getAttribute("aria-label"));
    expect(navigation.labels.menu).toBe(home.querySelector(".kh-nav__menu")?.getAttribute("aria-label"));
    expect(navigation.labels.drawer).toBe(home.querySelector("dialog.kh-drawer")?.getAttribute("aria-label"));
    expect(navigation.labels.closeMenu).toBe(home.querySelector("[data-close-menu]")?.getAttribute("aria-label"));
    expect(navigation.labels.logoHome).toBe(home.querySelector(".kh-nav .kh-logo")?.getAttribute("alt"));
    expect(navigation.labels.logo).toBe(home.querySelector(".kh-footer .kh-logo")?.getAttribute("alt"));
    expect(navigation.labels.skip).toBe(norm(home.querySelector(".mk-skip")?.textContent));
    expect(navigation.labels.policies).toBe(doc("store").querySelector(".mk-policy")?.getAttribute("aria-label"));
  });
});

describe("the footer", () => {
  it("carries the promise and made lines (home.md, Footer)", () => {
    expect(navigation.footer.promise).toBe(norm(home.querySelector(".kh-footer__promise")?.textContent));
    expect(navigation.footer.made).toBe(norm(home.querySelector(".kh-footer__made")?.textContent));
  });

  it("carries the three columns, their titles and links in order (strategy §4.4)", () => {
    const columns = Array.from(home.querySelectorAll(".kh-footer__col")).map((col) => ({
      title: norm(col.querySelector("h2")?.textContent),
      links: links(col),
    }));
    expect(navigation.footer.columns.map(({ title, links: l }) => ({ title, links: l }))).toEqual(columns);
    expect(navigation.footer.columns.map((c) => c.id)).toEqual(["kheelu", "read", "help"]);
  });

  it("links the grievance officer line to the contact page (D032)", () => {
    expect([navigation.footer.grievance]).toEqual(links(home.querySelector(".kh-footer__legal"), "span:last-child a"));
  });
});

describe("the store's policy links", () => {
  it("are the five the store and the confirmation page print, in order", () => {
    for (const slug of ["store", "store-confirmation"]) {
      expect(navigation.policies, slug).toEqual(links(doc(slug).querySelector(".mk-policy")));
    }
  });
});
