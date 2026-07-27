import type { MetadataRoute } from "next";

/** V3 (AEO plumbing, research.md): the answer engines get an explicit welcome.
 *  Our whole differentiator is that the honest answer is the best answer in
 *  this category, so being quotable by ChatGPT, Perplexity, Claude and Google's
 *  AI surfaces is a distribution channel, not a risk. Named agents are listed
 *  even though `*` already allows them: several of these crawlers only read
 *  their own block, and an explicit allow is how you avoid being excluded by a
 *  future default. */
const AI_AGENTS = [
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
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: "https://kheelona.com/sitemap.xml",
  };
}
