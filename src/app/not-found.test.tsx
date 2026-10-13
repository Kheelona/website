import { readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import vm from "node:vm";
import { render, screen } from "@testing-library/react";
import ts from "typescript";
import { afterEach, describe, expect, it, vi } from "vitest";
import { stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import { buildOffer } from "@/lib/offer/offer";
import { freshBuiltPages } from "../../test/e2e/support/page-checks";
import { ROOT } from "../../test/e2e/support/repo";
import { isStillLegacy } from "../../test/guards/legacy-paths";
import { mockupDiff, mockupPage } from "../../test/support/mockup-compare";
import NotFound, { metadata } from "./not-found";

/* The root not-found page (task 5.10; structure §3.1, §5; architecture §9.4): every unmatched URL of the marketing site
 * renders it, answering 404 (Next marks it noindex). It sits outside the (site) route group, so it renders the site
 * shell itself, with no buy bar (404.html meta `"buybar": false`) and with the WhatsApp bubble (D050), and fills it with
 * its content module (src/content/en-IN/pages/not-found.ts), each fold by its section (not through PageTemplate: see
 * the route file and "the route file" below). Compared here element by element
 * with the approved mockup (mockup/404.html): chrome and both folds. The HTTP status, noindex and server rendering
 * are test/e2e/redirects.spec.ts's and test/not-found-ssr.test.ts's. */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));
const nav = vi.hoisted(() => ({ pathname: "/kh-no-such-page" }));
/** The URL the page is rendered at unless a test says otherwise: one that matches no route. */
const UNMATCHED = nav.pathname;
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

  it("has one h1, the empty state's, and no buy bar at the unmatched URL", async () => {
    const { container } = await page();
    expect(screen.getAllByRole("heading", { level: 1 }).map((h) => h.textContent)).toEqual(["We can’t find that page."]);
    expect(container.querySelector(".kh-buybar")).toBeNull();
  });

  /* The bar renders only where the page's path is one the shell was handed (StickyBuyBar.client.tsx), so an unmatched
     URL alone would hide a bar the route wrongly passed. Rendered at every path that carries the bar on the site, the
     404 still shows none: the route hands the shell no bar paths (the mockup's meta: buybar false). */
  it("hands the shell no bar paths: no buy bar even at a path where the site carries one", async () => {
    const paths = stickyBarPaths();
    expect(paths, "the site carries the bar somewhere").toContain("/");
    try {
      for (const path of paths) {
        nav.pathname = path;
        const { container, unmount } = await page();
        expect(container.querySelector(".kh-buybar"), path).toBeNull();
        expect(container.querySelector('[data-ph-capture-attribute-cta="sticky-bar"]'), path).toBeNull();
        unmount();
      }
    } finally {
      nav.pathname = UNMATCHED;
    }
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

/** The specifiers one module names: every import, re-export and `import()`, type-only ones included. */
type ImportsOf = (file: string, text: string) => string[];
const everyImport: ImportsOf = (_file, text) => ts.preProcessFile(text, true, true).importedFiles.map((f) => f.fileName);

/** Only what the module loads at run time: `import type`, `export type` and imports whose every name is a type are
 *  erased by the compiler (tsconfig.json has no verbatimModuleSyntax), so they put no module in the bundle. */
const runtimeImports: ImportsOf = (file, text) => {
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const out: string[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const clause = node.importClause;
      const bindings = clause?.namedBindings;
      const onlyTypes =
        clause !== undefined &&
        (clause.isTypeOnly || (!clause.name && bindings !== undefined && ts.isNamedImports(bindings) && bindings.elements.every((el) => el.isTypeOnly)));
      if (!onlyTypes) out.push(node.moduleSpecifier.text);
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const clause = node.exportClause;
      const onlyTypes = node.isTypeOnly || (clause !== undefined && ts.isNamedExports(clause) && clause.elements.every((el) => el.isTypeOnly));
      if (!onlyTypes) out.push(node.moduleSpecifier.text);
    } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const [arg] = node.arguments;
      if (arg !== undefined && ts.isStringLiteralLike(arg)) out.push(arg.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
};

/** Every src/ module the file loads, directly or through the modules it loads, resolved as tsconfig.json resolves
 *  them (`@/`, relative paths, index files); packages, stylesheets and assets are not followed. By default type-only
 *  imports count too: a legacy type is still a legacy module (6.3 deletes them). */
function reachableFrom(entry: string, importsOf: ImportsOf = everyImport): string[] {
  const { config } = ts.readConfigFile(join(ROOT, "tsconfig.json"), ts.sys.readFile);
  const { options } = ts.convertCompilerOptionsFromJson(config.compilerOptions, ROOT);
  const resolution = { ...options, baseUrl: ROOT };
  const cache = ts.createModuleResolutionCache(ROOT, (name) => name, resolution);
  const seen = new Set<string>();
  const queue = [entry];
  for (let file = queue.pop(); file !== undefined; file = queue.pop()) {
    if (seen.has(file)) continue;
    seen.add(file);
    for (const fileName of importsOf(file, readFileSync(join(ROOT, file), "utf8"))) {
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
    /* Guard the guard: the walk follows `@/` imports into the shell and the sections, and type-only ones (the content
       module's PageContent) into the section registry. */
    expect(reached).toEqual(
      expect.arrayContaining([
        "src/content/en-IN/pages/not-found.ts",
        "src/layouts/SiteShell/SiteShell.tsx",
        "src/layouts/sections-registry.ts",
        "src/components/sections/EmptyStateSection/EmptyStateSection.tsx",
        "src/components/sections/CloseSection/CloseSection.tsx",
        "src/components/chrome/WhatsAppFloat/WhatsAppFloat.tsx",
      ]),
    );
    expect(reached.filter(isStillLegacy)).toEqual([]);
  }, 30_000);

  /* The same reason, for the new design's own client islands: whatever the not-found loads at run time loads on every
     route, so it reaches no client module (a "use client" file) beyond its shell's (the nav, the drawer, the buy bar's
     controller, the motion observer). The section registry would add every island a page may use (FilmsStrip,
     Tabs): the 404 renders neither (perf-budget; the 5.10 review). */
  it("reaches no client module beyond its site shell's (no FilmsStrip, no Tabs on every route)", () => {
    const USE_CLIENT = /^(?:\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*["']use client["']/;
    const islands = (entry: string) =>
      reachableFrom(entry, runtimeImports).filter((file) => USE_CLIENT.test(readFileSync(join(ROOT, file), "utf8")));
    const shell = islands("src/layouts/SiteShell/SiteShell.tsx");
    /* Guard the guard: the shell's islands are seen, so an empty difference means something, and the walk follows
       run-time imports into the sections (the section registry, which the route does not load, reaches both). */
    expect(shell).toContain("src/components/chrome/NavDrawer/NavDrawer.client.tsx");
    expect(islands("src/layouts/sections-registry.ts")).toEqual(
      expect.arrayContaining(["src/components/sections/FilmsStrip/FilmsStrip.client.tsx", "src/components/ui/Tabs/Tabs.client.tsx"]),
    );
    const reached = islands("src/app/not-found.tsx");
    expect(reached).not.toContain("src/components/sections/FilmsStrip/FilmsStrip.client.tsx");
    expect(reached).not.toContain("src/components/ui/Tabs/Tabs.client.tsx");
    expect(reached.filter((file) => !shell.includes(file))).toEqual([]);
  }, 30_000);

  it("hands the site shell no buy-bar paths (404.html meta: buybar false)", () => {
    expect(source).toMatch(/<SiteShell offer=\{offer\}>/);
    expect(source).not.toMatch(/stickyBar/);
  });

  it("stays thin: no copy typed in it, the words come from the content module", () => {
    expect(imports).toContain("@/content/en-IN/pages/not-found");
    expect(source).not.toMatch(/We can|Page not found|Looking for/);
  });
});

/** A route's client reference manifest, as perf-budget.spec.ts reads it from the local build: the client modules it can
 *  load (keyed `[project]/<path>`) and the chunks of each entry of its tree (layouts, the not-found boundary, the page). */
type ClientManifest = {
  clientModules?: Record<string, unknown>;
  entryJSFiles?: Record<string, string[]>;
};
const NOT_FOUND_ENTRY = "[project]/src/app/not-found";

function clientManifests(): Map<string, ClientManifest> {
  const app = join(ROOT, ".next", "server", "app");
  const out = new Map<string, ClientManifest>();
  for (const rel of readdirSync(app, { recursive: true, encoding: "utf8" }).filter((f) => f.endsWith("_client-reference-manifest.js"))) {
    const sandbox = vm.createContext({});
    vm.runInContext(readFileSync(join(app, rel), "utf8"), sandbox);
    for (const [route, manifest] of Object.entries((sandbox as { __RSC_MANIFEST?: Record<string, ClientManifest> }).__RSC_MANIFEST ?? {})) {
      out.set(route, manifest);
    }
  }
  return out;
}

const built = freshBuiltPages();

describe.skipIf(built === null)("not-found: the last build (when newer than src/)", () => {
  /* The acceptance of task 5.10 on the build itself. Every route's tree holds the root not-found boundary, so its
     manifest lists the not-found entry's chunks: before this task they carried the legacy page's client modules
     (atoms/Button, organisms/Navbar, molecules/RevealObserver, organisms/KheeluGuide; four chunks, 35.2 KB transferred
     on /stories/screen-time-and-tantrums). The not-found route's own manifest holds only the root layout's and the
     not-found's client modules, so it shows what those chunks carry; every (site) route lists the same chunks. */
  it("maps no legacy client module into the not-found's chunks, and every (site) route lists those chunks only", () => {
    const manifests = clientManifests();
    const own = manifests.get("/_not-found/page");
    expect(own, "the build has the not-found route's client reference manifest").toBeDefined();
    const modules = Object.keys(own!.clientModules ?? {}).map((key) => key.replace(/^\[project\]\//, "").replace(/ <[^>]*>$/, ""));
    expect(modules.filter(isStillLegacy)).toEqual([]);
    /* Guard the guard: the manifest names src/ modules (the root layout's tracking gates among them). */
    expect(modules).toContain("src/components/tracking/PostHogGate.tsx");
    /* No island the 404 does not render: these chunks load on every route (the 5.10 review: about 11 KB). */
    expect(modules).not.toContain("src/components/sections/FilmsStrip/FilmsStrip.client.tsx");
    expect(modules).not.toContain("src/components/ui/Tabs/Tabs.client.tsx");
    const chunks = own!.entryJSFiles?.[NOT_FOUND_ENTRY];
    expect(chunks?.length).toBeGreaterThan(0);
    const site = [...manifests].filter(([route]) => route.startsWith("/(site)/"));
    expect(site.length, "the build has (site) routes").toBeGreaterThan(0);
    for (const [route, manifest] of site) expect(manifest.entryJSFiles?.[NOT_FOUND_ENTRY], route).toEqual(chunks);
  });

  /* What every unmatched URL is served: the prerendered not-found, rendered on the server (the page's own h1 in the
     HTML), answering 404, marked noindex by Next, with the copy page's title and description and no canonical. */
  it("prerenders the page as a 404, noindex, with its title, description and h1, and no canonical", () => {
    const app = join(ROOT, ".next", "server", "app");
    const status = (JSON.parse(readFileSync(join(app, "_not-found.meta"), "utf8")) as { status?: number }).status;
    const html = readFileSync(join(app, "_not-found.html"), "utf8");
    const head = html.slice(0, html.indexOf("</head>"));
    expect(status).toBe(404);
    expect(head).toMatch(/<meta name="robots" content="noindex"\/>/);
    expect(head).toContain("<title>Page not found · Kheelona</title>");
    expect(head).toContain(`<meta name="description" content="${metadata.description as string}"/>`);
    expect(head).not.toMatch(/rel="canonical"/);
    expect(html).toMatch(/<h1 class="kh-heading__title" id="nf-title">We can’t find that page\.<\/h1>/);
  });
});

if (built === null) console.log("[not-found] no build newer than src/: the client-reference manifest check runs after `npm run build`.");
