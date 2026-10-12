import { describe, expect, it } from "vitest";
import { parseArgs, scorePage } from "../scripts/qa/lighthouse.mjs";

/* scripts/qa/lighthouse.mjs verdicts (task 1.1b item 3; architecture §12, test plan §4.4, lessons §6).
 *
 * Gating is the simulated median (Lighthouse's default throttling, PageSpeed's method). Devtools-
 * throttled medians are recorded and printed, with a warning below budget, and never gate. The Best
 * Practices allowance (B10, N18) applies only when EVERY run's failing audits are in the profile's
 * allowed list; the union of failing audits is printed.
 */

type Run = { scores: Record<string, number>; bpFailures: string[] };
const run = (bp: number, bpFailures: string[] = [], perf = 0.95): Run => ({
  scores: { performance: perf, accessibility: 0.98, "best-practices": bp, seo: 0.95 },
  bpFailures,
});

describe("lighthouse verdict: Best Practices allowance", () => {
  it("is refused when any run fails an audit outside the allowed list, even if the last run is clean", () => {
    const v = scorePage({
      profile: "lp-tags",
      page: "/",
      method: "simulate",
      runs: [run(0.78, ["errors-in-console", "third-party-cookies"]), run(0.78, ["third-party-cookies"]), run(0.78, ["third-party-cookies"])],
    });
    expect(v.failed).toBe(true);
    expect(v.notes.join("\n")).toMatch(/best-practices 78 < 90/);
    expect(v.notes.join("\n")).toContain("errors-in-console");
  });

  it("applies when every run's failing audits are allowed, and prints their union", () => {
    const v = scorePage({
      profile: "lp-tags",
      page: "/",
      method: "simulate",
      runs: [run(0.78, ["third-party-cookies"]), run(0.78, ["is-on-https", "third-party-cookies"]), run(0.78, ["inspector-issues"])],
    });
    expect(v.failed).toBe(false);
    const note = v.notes.join("\n");
    expect(note).toMatch(/pre-approved/);
    expect(note).toContain("inspector-issues, is-on-https, third-party-cookies");
    expect(v.bpUnion).toEqual(["inspector-issues", "is-on-https", "third-party-cookies"]);
  });

  it("never applies on the local profile, which has no allowed list", () => {
    const v = scorePage({ profile: "local", page: "/", method: "simulate", runs: [run(0.78, ["third-party-cookies"]), run(0.78, ["third-party-cookies"]), run(0.78, ["third-party-cookies"])] });
    expect(v.failed).toBe(true);
  });
});

describe("lighthouse verdict: gating is the simulated median", () => {
  const slow = [run(1, [], 0.82), run(1, [], 0.7), run(1, [], 0.95)];

  it("takes the median of the runs", () => {
    expect(scorePage({ profile: "local", page: "/", method: "simulate", runs: slow }).medians.performance).toBe(0.82);
  });

  it("fails the page on a simulated median below budget", () => {
    const v = scorePage({ profile: "local", page: "/", method: "simulate", runs: slow });
    expect(v.gating).toBe(true);
    expect(v.failed).toBe(true);
    expect(v.notes.join("\n")).toMatch(/performance 82 < 90/);
  });

  it("records a devtools median below budget as a warning, never a failure", () => {
    const v = scorePage({ profile: "local", page: "/", method: "devtools", runs: slow });
    expect(v.gating).toBe(false);
    expect(v.failed).toBe(false);
    expect(v.notes.join("\n")).toMatch(/warning: performance 82 < 90 \(devtools, recorded, not gating\)/);
  });

  it("keeps the pre-approved store SEO exception", () => {
    const store = [run(1), run(1), run(1)].map((r) => ({ ...r, scores: { ...r.scores, seo: 0.66 } }));
    const v = scorePage({ profile: "local", page: "store:/", method: "simulate", runs: store });
    expect(v.failed).toBe(false);
    expect(v.notes.join("\n")).toMatch(/store SEO 66: pre-approved/);
  });
});

describe("lighthouse command line", () => {
  it("runs both throttling methods by default, the gating one first", () => {
    expect(parseArgs([]).methods).toEqual(["simulate", "devtools"]);
    expect(parseArgs(["--throttling", "devtools"]).methods).toEqual(["devtools"]);
  });
});
