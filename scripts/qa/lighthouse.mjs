#!/usr/bin/env node
// Lighthouse medians (task 1.1; architecture §12, test plan §4.4, lessons §6).
//
//   node scripts/qa/lighthouse.mjs [--profile local|lp-tags|production] [--runs 3] [path ...]
//
// Mobile form factor (Lighthouse's default config), median of 3 runs per page, scored against the
// budget: >= 90 in Performance, Accessibility, Best Practices and SEO. Lighthouse 13.4.1 (pinned)
// is the baseline's version, so before and after compare.
//
// Profiles (which run counts, N18):
//   local       the local production build on http://localhost:3456 (no tags: hosts in no list)
//   lp-tags     the same build under the real hostnames, http://kheelona.com:3456 and
//               http://store.kheelona.com:3456 by Chrome host-resolver rules, so the tags load;
//               only their beacons are blocked. Authoritative for Performance, Best Practices, SEO.
//   production  https://kheelona.com and https://store.kheelona.com, after Gate B only.
// For local and lp-tags start the server first: npm run build && npx next start -p 3456.
//
// Pre-approved exceptions (working default B10), printed every run and never silent: store SEO
// about 66 (noindex on purpose); on lp-tags and production, Best Practices may fail only on the
// Meta pixel's third-party cookie (the third-party-cookies audit, and inspector-issues only while
// every issue it lists is a third-party-cookie phase-out issue), and on lp-tags the HTTPS audits
// flip on the http:// origin.
// Reports go to lighthouse-reports/<date>/ (git-ignored, D039). Exit 1 when a page misses.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const PAGES = [
  "/",
  "/products/kheelu",
  "store:/",
  "/ai-toys-for-kids-in-india",
  "/team",
  "/safety",
  "/stories",
  "/privacy",
  "/contact",
  "/stories/learning-toys-for-a-three-year-old",
];
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const THRESHOLD = 0.9;
const PORT = Number(process.env.KH_E2E_PORT ?? 3456);
/** Beacons blocked on lp-tags, so nothing is delivered (test plan §4.4). */
const BLOCKED = ["*google-analytics.com/g/collect*", "*analytics.google.com/g/collect*", "*facebook.com/tr*", "*/ingest/e/*", "*/ingest/s/*", "*/ingest/i/*", "*/ingest/batch*", "*analytics.ahrefs.com/api/*"];
/** Best Practices audits allowed to fail on tag-loading profiles (B10, N18). "inspector-issues"
 *  counts as allowed only when bestPracticesFailures() finds nothing in it but third-party-cookie
 *  issues; any other issue renames it, so it is never allowed. */
const ALLOWED_BP = { "lp-tags": ["third-party-cookies", "is-on-https", "inspector-issues", "redirects-http"], production: ["third-party-cookies", "inspector-issues"] };
const THIRD_PARTY_COOKIE = (issue) =>
  (issue.cookieWarningReasons ?? []).includes("WarnThirdPartyPhaseout") ||
  (issue.cookieExclusionReasons ?? []).includes("ExcludeThirdPartyPhaseout");

/** The failing weighted Best Practices audits of one run. inspector-issues is reported as itself
 *  only when every row is a Cookie row and every cookie issue behind it (the run's artifacts) is a
 *  third-party-cookie phase-out issue, which is the Meta pixel's cookie B10 accepts. The artifacts
 *  are internal to Lighthouse (pinned 13.4.1): if they are missing, the check fails closed. */
export function bestPracticesFailures(result) {
  const { lhr } = result;
  return lhr.categories["best-practices"].auditRefs
    .filter((r) => r.weight > 0 && (lhr.audits[r.id]?.score ?? 1) < 1)
    .map((r) => {
      if (r.id !== "inspector-issues") return r.id;
      const rows = lhr.audits[r.id].details?.items ?? [];
      const cookies = result.artifacts?.InspectorIssues?.cookieIssue ?? [];
      const onlyThirdPartyCookies = rows.length > 0 && rows.every((row) => row.issueType === "Cookie") && cookies.length > 0 && cookies.every(THIRD_PARTY_COOKIE);
      return onlyThirdPartyCookies ? r.id : "inspector-issues (not only third-party cookies)";
    });
}

function args() {
  const a = process.argv.slice(2);
  const take = (flag, fallback) => {
    const i = a.indexOf(flag);
    if (i < 0) return fallback;
    const v = a[i + 1];
    a.splice(i, 2);
    return v;
  };
  const profile = take("--profile", "local");
  const runs = Number(take("--runs", "3"));
  if (!["local", "lp-tags", "production"].includes(profile)) throw new Error(`unknown profile ${profile}`);
  return { profile, runs, pages: a.length ? a : PAGES };
}

function urlFor(profile, page) {
  const store = page.startsWith("store:");
  const path = store ? page.slice("store:".length) : page;
  if (profile === "local") return `${store ? `http://store.localhost:${PORT}` : `http://localhost:${PORT}`}${path}`;
  if (profile === "lp-tags") return `${store ? `http://store.kheelona.com:${PORT}` : `http://kheelona.com:${PORT}`}${path}`;
  return `${store ? "https://store.kheelona.com" : "https://kheelona.com"}${path}`;
}

const median = (xs) => {
  const s = [...xs].sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)];
};

async function main() {
  const { profile, runs, pages } = args();
  const flags = ["--headless=new", "--no-first-run", "--disable-extensions"];
  if (profile === "lp-tags") flags.push("--host-resolver-rules=MAP kheelona.com 127.0.0.1, MAP store.kheelona.com 127.0.0.1");
  const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: flags });
  const dir = join("lighthouse-reports", new Date().toISOString().slice(0, 10));
  mkdirSync(dir, { recursive: true });
  let failed = false;
  try {
    for (const page of pages) {
      const url = urlFor(profile, page);
      const scores = Object.fromEntries(CATEGORIES.map((c) => [c, []]));
      let lastBpFailures = [];
      for (let n = 1; n <= runs; n++) {
        const result = await lighthouse(url, {
          port: chrome.port,
          output: "json",
          logLevel: "error",
          onlyCategories: CATEGORIES,
          blockedUrlPatterns: profile === "lp-tags" ? BLOCKED : [],
        });
        const lhr = result.lhr;
        writeFileSync(join(dir, `${profile}-${page.replace(/[^a-z0-9]+/gi, "_") || "home"}-${n}.json`), result.report);
        for (const c of CATEGORIES) scores[c].push(lhr.categories[c]?.score ?? 0);
        lastBpFailures = bestPracticesFailures(result);
      }
      const med = Object.fromEntries(CATEGORIES.map((c) => [c, median(scores[c])]));
      const notes = [];
      for (const c of CATEGORIES) {
        if (med[c] >= THRESHOLD) continue;
        if (c === "seo" && page.startsWith("store:")) {
          notes.push(`store SEO ${Math.round(med[c] * 100)}: pre-approved exception (noindex on purpose, B10)`);
          continue;
        }
        const allowed = ALLOWED_BP[profile];
        if (c === "best-practices" && allowed && lastBpFailures.every((id) => allowed.includes(id))) {
          notes.push(`Best Practices ${Math.round(med[c] * 100)}: only ${lastBpFailures.join(", ")} (pre-approved, B10/N18)`);
          continue;
        }
        failed = true;
        notes.push(`${c} ${Math.round(med[c] * 100)} < ${THRESHOLD * 100}${c === "best-practices" ? ` (failing audits: ${lastBpFailures.join(", ")})` : ""}`);
      }
      console.log(
        `[lighthouse ${profile}] ${url}  ` + CATEGORIES.map((c) => `${c} ${Math.round(med[c] * 100)}`).join("  ") + (notes.length ? `\n  ${notes.join("\n  ")}` : ""),
      );
    }
  } finally {
    await chrome.kill();
  }
  console.log(`[lighthouse ${profile}] reports in ${dir}/`);
  process.exit(failed ? 1 : 0);
}

// Run only as a script, so bestPracticesFailures can be imported and checked on its own.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
