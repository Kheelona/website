import type { MetadataRoute } from "next";
import { absoluteUrl } from "./urls";

/**
 * robots.txt (ADR-012, architecture §9.3), served by `src/app/robots.ts`.
 *
 * Everyone is allowed. The answer engines are also named, each in its own group: several of these
 * crawlers read only their own block, and an explicit allow keeps us in if a default ever changes.
 * Being quotable by them is a channel, not a risk. Bytespider is disallowed (D041 G7).
 *
 * The same file on every host, beta included: a crawler has to fetch a page to read its noindex
 * header, and a Disallow would hide it (lessons §6, "never pair Disallow with noindex").
 */

export const ALLOWED_AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
] as const;

export const BLOCKED_CRAWLERS = ["Bytespider"] as const;

export function robotsFile(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...ALLOWED_AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
      ...BLOCKED_CRAWLERS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
