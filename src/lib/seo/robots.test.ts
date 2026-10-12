import { afterEach, describe, expect, it, vi } from "vitest";
/* Next's own serialiser for robots.ts (the function its metadata route runs), so the text below
   is the file crawlers receive, not just the object we return. */
import { resolveRobots } from "next/dist/build/webpack/loaders/metadata/resolve-route-data";

/* robots.txt per architecture §9.3 and D041: everyone allowed; the named AI crawlers allowed in
   their own groups (several read only their own block); Bytespider disallowed; the sitemap on the
   production origin. Written out by hand: this is the snapshot the plan asks for. */
const EXPECTED = `User-Agent: *
Allow: /

User-Agent: GPTBot
Allow: /

User-Agent: OAI-SearchBot
Allow: /

User-Agent: ChatGPT-User
Allow: /

User-Agent: PerplexityBot
Allow: /

User-Agent: Perplexity-User
Allow: /

User-Agent: ClaudeBot
Allow: /

User-Agent: Claude-User
Allow: /

User-Agent: Claude-SearchBot
Allow: /

User-Agent: Google-Extended
Allow: /

User-Agent: Applebot-Extended
Allow: /

User-Agent: CCBot
Allow: /

User-Agent: Bytespider
Disallow: /

Sitemap: https://kheelona.com/sitemap.xml
`;

async function servedRobotsTxt(): Promise<string> {
  const { default: robots } = await import("@/app/robots");
  return resolveRobots(robots());
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("robots.txt", () => {
  it("serves exactly the approved file", async () => {
    expect(await servedRobotsTxt()).toBe(EXPECTED);
  });

  /* Beta keeps the same file: crawlers must be able to fetch a page to read its noindex header,
     and Disallow next to noindex hides the noindex (ADR-012; lessons §6). */
  it("is the same file on the beta hosts", async () => {
    vi.stubEnv("KH_SITE_ENV", "beta");
    vi.resetModules();
    const { SITE_ENV } = await import("@/config/env");
    expect(SITE_ENV).toBe("beta");
    expect(await servedRobotsTxt()).toBe(EXPECTED);
  });
});
