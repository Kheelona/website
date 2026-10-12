import { readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { render, screen } from "@testing-library/react";
import ts from "typescript";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildOffer } from "@/lib/offer/offer";
import { ROOT } from "../../test/e2e/support/repo";
import { isStillLegacy } from "../../test/guards/legacy-paths";
import { mockupDiff, mockupPage } from "../../test/support/mockup-compare";
import NotFound, { metadata } from "./not-found";

/* The root not-found page (task 5.10; structure §3.1, §5; architecture §9.4): every unmatched URL of the marketing site
 * renders it, answering 404 (Next marks it noindex). It sits outside the (site) route group, so it renders the site
 * shell itself, with no buy bar (404.html meta `"buybar": false`) and with the WhatsApp bubble (D050), and fills it with
 * its content module (src/content/en-IN/pages/not-found.ts) through PageTemplate. Compared here element by element
 * with the approved mockup (mockup/404.html): chrome and both folds. The HTTP status, noindex and server rendering
 * are test/e2e/redirects.spec.ts's and test/not-found-ssr.test.ts's. */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));
const nav = vi.hoisted(() => ({ pathname: "/kh-no-such-page" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));
afterEach(() => {
  getOffer.mockReset();
});

const mockup = mockupPage("404");
/** As SiteShell.test.tsx: the mockup's script hook and image sources are not markup; the build's documented additions
 *  (the CTA block's button and centred trust line, the list reset; CloseSection, CtaBlock and List) are not the
 *  mockup's. */
const differences = mockupDiff({
  ignore: ["data-open-menu", "src", "width", "inert"],
  dropClasses: ["ks-cta__button", "ks-trustline--center", "ks-list-reset"],
});

async function page(mode: "token" | "full" = "token") {
  getOffer.mockResolvedValue(buildOffer(mode));
  return render(await NotFound());
}

describe("not-found: the metadata (404.md, At a glance)", () => {
  it("is the copy page's title, whole (no template suffix), and its description", () => {
    expect(metadata.title).toEqual({ absolute: "Page not found · Kheelona" });
    expect(metadata.description).toBe(
      "We can’t find that page. Meet Kheelu, the screen-free plush toy for ages 3 to 7, read our guides for parents, or talk to the team.",
    );
  });

  it("sets no robots, canonical or share card: the page answers 404, Next marks it noindex, and the root's beta rule stands", () => {
    expect(Object.keys(metadata).sort()).toEqual(["description", "title"]);
  });
});

describe("not-found: the page equals the approved mockup (mockup/404.html)", () => {
  it.each([
    ["skip link", "a.kh-btn--secondary", "a.ks-skip"],
    ["navigation", "nav.kh-nav", "nav.kh-nav"],
    ["footer", "footer.kh-footer", "footer.kh-footer"],
    ["menu drawer", "dialog.kh-drawer", "dialog.kh-drawer"],
  ])("chrome: %s", async (_name, mockupSelector, builtSelector) => {
    const { container } = await page();
    const ref = mockup.querySelector(mockupSelector);
    const built = container.querySelector(builtSelector);
    expect(ref, mockupSelector).not.toBeNull();
    expect(built, builtSelector).not.toBeNull();
    expect(differences(built!, ref!)).toEqual([]);
  });

  it("main: fold 1, the empty state, and fold 2, the centred close, in order", async () => {
    const { container } = await page();
    const main = container.querySelector("main#main")!;
    const ref = mockup.querySelector("main")!;
    expect(differences(main, ref)).toEqual([]);
  });

  it("has one h1, the empty state's, and no buy bar (the mockup's meta: buybar false)", async () => {
    const { container } = await page();
    expect(screen.getAllByRole("heading", { level: 1 }).map((h) => h.textContent)).toEqual(["We can’t find that page."]);
    expect(container.querySelector(".kh-buybar")).toBeNull();
  });
});

describe("not-found: what the mockup did not have", () => {
  it("renders the WhatsApp bubble with the site's text (D050)", async () => {
    await page();
    const bubble = screen.getByRole("link", { name: "Chat with us on WhatsApp" });
    expect(bubble).toHaveClass("ks-wa");
    expect(bubble).toHaveAttribute("data-ph-capture-attribute-cta", "whatsapp-float");
    expect(new URL(bubble.getAttribute("href")!).searchParams.get("text")).toBe("Hi Kheelona! I have a question about Kheelu.");
  });

  it("follows the live offer: full mode prints the full price in the close and the drawer", async () => {
    const { container } = await page("full");
    const sentence = "₹7,999 (incl. GST), paid in full when you order.";
    expect(container.querySelector("#close .kh-body-s")?.textContent).toBe(sentence);
    expect(container.querySelector(".kh-drawer__note")?.textContent).toBe(sentence);
  });

  it("carries the page's CTA values only: navbar, navbar-mobile, finale and the bubble's", async () => {
    const { container } = await page();
    const values = Array.from(container.querySelectorAll("[data-ph-capture-attribute-cta]")).map((el) => el.getAttribute("data-ph-capture-attribute-cta"));
    expect([...new Set(values)].sort()).toEqual(["finale", "navbar", "navbar-mobile", "whatsapp-float"]);
    expect(container.querySelectorAll('main [data-ph-capture-attribute-cta="finale"]')).toHaveLength(1);
  });
});

/** Every src/ module the file loads, directly or through the modules it loads, resolved as tsconfig.json resolves
 *  them (`@/`, relative paths, index files); packages, stylesheets and assets are not followed. Type-only imports
 *  count too: a legacy type is still a legacy module (6.3 deletes them). */
function reachableFrom(entry: string): string[] {
  const { config } = ts.readConfigFile(join(ROOT, "tsconfig.json"), ts.sys.readFile);
  const { options } = ts.convertCompilerOptionsFromJson(config.compilerOptions, ROOT);
  const resolution = { ...options, baseUrl: ROOT };
  const cache = ts.createModuleResolutionCache(ROOT, (name) => name, resolution);
  const seen = new Set<string>();
  const queue = [entry];
  for (let file = queue.pop(); file !== undefined; file = queue.pop()) {
    if (seen.has(file)) continue;
    seen.add(file);
    for (const { fileName } of ts.preProcessFile(readFileSync(join(ROOT, file), "utf8"), true, true).importedFiles) {
      const resolved = ts.resolveModuleName(fileName, join(ROOT, file), resolution, ts.sys, cache).resolvedModule;
      if (resolved === undefined || resolved.isExternalLibraryImport) continue;
      const path = relative(ROOT, resolved.resolvedFileName).split(sep).join("/");
      if (path.startsWith("src/")) queue.push(path);
    }
  }
  return [...seen].sort();
}

describe("not-found: the route file", () => {
  const source = readFileSync("src/app/not-found.tsx", "utf8");
  const imports = [...source.matchAll(/^import[^"]*"([^"]+)";$/gm)].map((m) => m[1]);

  /* The root not-found is rendered into every route's tree (Next passes it to the root boundary), so every client
     module it reaches sits in every route's client reference manifest: the legacy page's chunks were about 34 KB of
     every new route's JavaScript (tasks.md "Wave 4 close"). Reaching only new-design modules keeps them out until
     6.3 deletes the legacy code. */
  it("reaches no legacy module, directly or through the modules it loads (test/guards/legacy-paths.ts)", () => {
    const reached = reachableFrom("src/app/not-found.tsx");
    /* Guard the guard: the walk follows `@/` imports into the shell, the template and the sections. */
    expect(reached).toEqual(
      expect.arrayContaining([
        "src/content/en-IN/pages/not-found.ts",
        "src/layouts/SiteShell/SiteShell.tsx",
        "src/layouts/PageTemplate/PageTemplate.tsx",
        "src/components/sections/EmptyStateSection/EmptyStateSection.tsx",
        "src/components/chrome/WhatsAppFloat/WhatsAppFloat.tsx",
      ]),
    );
    expect(reached.filter(isStillLegacy)).toEqual([]);
  }, 30_000);

  it("stays thin: no copy typed in it, the words come from the content module", () => {
    expect(imports).toContain("@/content/en-IN/pages/not-found");
    expect(source).not.toMatch(/We can|Page not found|Looking for/);
  });
});
