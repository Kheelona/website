import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

/**
 * A 404 has to RENDER on the server, not just return the right number.
 *
 * WHY THIS EXISTS. On 2026-09-06 every 404 reached by a thrown `notFound()`
 * was serving a blank page. `curl` returned the right status and then this:
 *
 *     <html id="__next_error__"><head>…</head><body></body></html>
 *
 * No stylesheet, no text, no `lang`. The content only appeared once JavaScript
 * had downloaded, parsed and hydrated — and never at all if it did not.
 *
 * The cause is in Next itself, not in this app. `notFound()` throws, the throw
 * is caught in `app-render`, and the catch builds its reply with
 * `getErrorRSCPayload`, whose own comment says it "is the data necessary to
 * render <AppRouter /> when an error state is triggered" — a client-rendered
 * shell. A path that simply matches no route never enters that path and server
 * renders normally, which is why `kheelona.com/typo` was always fine while
 * `kheelona.com/stories/typo` was not. 16.3.4 is the latest release; there is
 * no upstream fix to wait for.
 *
 * So the law is: on a route a visitor can reach by mistyping a URL, do not
 * throw. Let the router 404 (a static param list), or render the page.
 */

const read = (p: string) => readFileSync(p, "utf8");

describe("a dynamic route with a known param list refuses unknown ones at the router", () => {
  const stories = "src/app/(site)/stories/[slug]/page.tsx";

  it("stories declares dynamicParams = false", () => {
    /* Without it, /stories/<unknown> renders on demand, hits `notFound()` and
       serves the blank shell. With it the slug never matches a route at all,
       and the full marketing 404 is streamed. */
    expect(read(stories)).toMatch(/^export const dynamicParams = false;$/m);
  });

  it("every route that lists its params refuses the ones it did not list", () => {
    const routes = execFileSync("git", ["ls-files", "src/app/**/page.tsx"], { encoding: "utf8" })
      .split("\n")
      .filter(Boolean)
      .filter((f) => /\[[^\]]+\]/.test(f));
    const listed = routes.filter((f) => read(f).includes("generateStaticParams"));
    /* Guard the guard: an empty list would pass this vacuously. */
    expect(listed.length).toBeGreaterThan(0);
    for (const file of listed) {
      expect(read(file), `${file} lists its params but still accepts others`).toMatch(
        /export const dynamicParams = false;/,
      );
    }
  });
});

describe("nothing on the store host throws a 404", () => {
  /* The store is where a thrown 404 costs most: its reader may have paid us
     and be looking for their own order, on a host whose whole job is to take
     money. Three of its dead ends rendered nothing at all until 2026-09-06.
     The status now comes from the proxy (see store-host.test.ts) and the pages
     render, so a `notFound()` reappearing here would silently reintroduce the
     blank page while every test stayed green. */
  const storeFiles = execFileSync("git", ["ls-files", "src/app/store"], { encoding: "utf8" })
    .split("\n")
    .filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"));

  it("finds the store's files at all", () => {
    expect(storeFiles.length).toBeGreaterThan(4);
    expect(storeFiles).toContain("src/app/store/thanks/page.tsx");
  });

  it.each(storeFiles)("%s does not call notFound()", (file) => {
    const source = read(file).replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
    expect(source, `${file} throws a 404 that will never server-render`).not.toMatch(
      /\bnotFound\s*\(/,
    );
  });

  it("keeps the boundary anyway, wearing the store's chrome", () => {
    /* Belt and braces: if a future change does throw, it must not land on the
       root not-found, which is the marketing site's. */
    expect(read("src/app/store/not-found.tsx")).toContain("NotFoundPanel");
  });
});
