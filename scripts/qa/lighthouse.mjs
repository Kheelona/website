#!/usr/bin/env node
// Lighthouse medians (task 1.1; architecture §12, test plan §4.4, lessons §6).
//
//   node scripts/qa/lighthouse.mjs [--profile local|lp-tags|production] [--runs 3]
//                                  [--throttling simulate|devtools|both] [path ...]
//
// Mobile form factor (Lighthouse's default config), median of 3 runs per page, scored against the
// budget: >= 90 in Performance, Accessibility, Best Practices and SEO. Lighthouse 13.4.1 (pinned)
// is the baseline's version, so before and after compare.
//
// Throttling (test plan §1.2, lessons §6: "record devtools-throttled and simulated runs"): by
// default both Lighthouse's simulated throttling and devtools throttling run, each with its own
// report files and its own medians. GATING = THE SIMULATED MEDIAN (Lighthouse's default,
// PageSpeed's method; main session 2026-10-12, task 1.1b): only a simulated median below budget
// fails the run. Devtools medians are recorded and printed, with a warning below budget, and
// never gate.
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
// flip on the http:// origin. The Best Practices allowance holds only when EVERY run's failing
// audits are in the allowed list; the union of failing audits over the runs is printed.
// Reports go to lighthouse-reports/<date>/<profile>-<method>-<page>-<n>.json (git-ignored, D039).
// Exit 1 when a page misses the budget on the simulated median.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

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
const METHODS = ["simulate", "devtools"];
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

/** The command line: profile, runs, throttling methods (default both) and pages. */
export function parseArgs(argv) {
  const a = [...argv];
  const take = (flag, fallback) => {
    const i = a.indexOf(flag);
    if (i < 0) return fallback;
    const v = a[i + 1];
    a.splice(i, 2);
    return v;
  };
  const profile = take("--profile", "local");
  const runs = Number(take("--runs", "3"));
  const throttling = take("--throttling", "both");
  if (!["local", "lp-tags", "production"].includes(profile)) throw new Error(`unknown profile ${profile}`);
  if (![...METHODS, "both"].includes(throttling)) throw new Error(`unknown --throttling ${throttling} (simulate, devtools or both)`);
  return { profile, runs, methods: throttling === "both" ? METHODS : [throttling], pages: a.length ? a : PAGES };
}

/** One report file per profile, throttling method, page and run. */
export function reportName(profile, method, page, n) {
  return `${profile}-${method}-${page.replace(/[^a-z0-9]+/gi, "_").replace(/^_$/, "") || "home"}-${n}.json`;
}

/** The Lighthouse flags of one run. */
export function lighthouseFlags(profile, method, port) {
  return {
    port,
    output: "json",
    logLevel: "error",
    onlyCategories: CATEGORIES,
    throttlingMethod: method,
    blockedUrlPatterns: profile === "lp-tags" ? BLOCKED : [],
  };
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

/** The method whose medians gate (task 1.1b, main session 2026-10-12): Lighthouse's default
 *  simulated throttling, PageSpeed's method. Devtools medians are recorded, never gating. */
export const GATING_METHOD = "simulate";

/** One page's verdict for one throttling method, from its runs ({ scores, bpFailures } each).
 *  A category misses when its median is under THRESHOLD, apart from the pre-approved store SEO
 *  and, on tag-loading profiles, a Best Practices median whose every run failed only allowed
 *  audits (one run with any other failing audit refuses the allowance; the union is printed).
 *  A miss fails the page only on the gating method; on devtools it is printed as a warning. */
export function scorePage({ profile, page, method, runs }) {
  const medians = Object.fromEntries(CATEGORIES.map((c) => [c, median(runs.map((r) => r.scores[c] ?? 0))]));
  const bpUnion = [...new Set(runs.flatMap((r) => r.bpFailures))].sort();
  const allowed = ALLOWED_BP[profile];
  const everyRunAllowed = !!allowed && runs.every((r) => r.bpFailures.every((id) => allowed.includes(id)));
  const gating = method === GATING_METHOD;
  const notes = [];
  let failed = false;
  for (const c of CATEGORIES) {
    const score = Math.round(medians[c] * 100);
    if (medians[c] >= THRESHOLD) continue;
    if (c === "seo" && page.startsWith("store:")) {
      notes.push(`store SEO ${score}: pre-approved exception (noindex on purpose, B10)`);
      continue;
    }
    if (c === "best-practices" && everyRunAllowed) {
      notes.push(`Best Practices ${score}: every run failed only ${bpUnion.join(", ")} (pre-approved, B10/N18)`);
      continue;
    }
    const miss = `${c} ${score} < ${THRESHOLD * 100}${c === "best-practices" ? ` (failing audits over ${runs.length} run(s): ${bpUnion.join(", ") || "none"})` : ""}`;
    if (gating) {
      failed = true;
      notes.push(miss);
    } else {
      notes.push(`warning: ${miss} (${method}, recorded, not gating)`);
    }
  }
  return { medians, gating, failed, notes, bpUnion };
}

async function main() {
  const { profile, runs, methods, pages } = parseArgs(process.argv.slice(2));
  // Loaded here, not at the top, so the verdict functions import without Chrome or Lighthouse.
  const { chromium } = await import("@playwright/test");
  const chromeLauncher = await import("chrome-launcher");
  const { default: lighthouse } = await import("lighthouse");
  const flags = ["--headless=new", "--no-first-run", "--disable-extensions"];
  if (profile === "lp-tags") flags.push("--host-resolver-rules=MAP kheelona.com 127.0.0.1, MAP store.kheelona.com 127.0.0.1");
  const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: flags });
  const dir = join("lighthouse-reports", new Date().toISOString().slice(0, 10));
  mkdirSync(dir, { recursive: true });
  let failed = false;
  try {
    for (const page of pages) {
      const url = urlFor(profile, page);
      for (const method of methods) {
        const results = [];
        for (let n = 1; n <= runs; n++) {
          const result = await lighthouse(url, lighthouseFlags(profile, method, chrome.port));
          writeFileSync(join(dir, reportName(profile, method, page, n)), result.report);
          results.push({
            scores: Object.fromEntries(CATEGORIES.map((c) => [c, result.lhr.categories[c]?.score ?? 0])),
            bpFailures: bestPracticesFailures(result),
          });
        }
        const v = scorePage({ profile, page, method, runs: results });
        failed ||= v.failed;
        console.log(
          `[lighthouse ${profile} ${method}${v.gating ? ", gating" : ", recorded"}] ${url}  ` +
            CATEGORIES.map((c) => `${c} ${Math.round(v.medians[c] * 100)}`).join("  ") +
            (v.notes.length ? `\n  ${v.notes.join("\n  ")}` : ""),
        );
      }
    }
  } finally {
    await chrome.kill();
  }
  console.log(`[lighthouse ${profile}] ${methods.join(" and ")} throttling; the ${GATING_METHOD} median gates; reports in ${dir}/`);
  if (!methods.includes(GATING_METHOD)) console.log(`[lighthouse ${profile}] warning: no ${GATING_METHOD} run, so nothing gated; this run is a record only.`);
  process.exit(failed ? 1 : 0);
}

// Run only as a script, so bestPracticesFailures can be imported and checked on its own.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
