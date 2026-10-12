// The build hooks are wired (task 2.9; ADR-011 "where they run", architecture §14, structure §1).
//
// scripts/run-steps.mjs (task 1.1) runs every scripts/steps/<hook>/NN-name.mjs in name order, and
// stops at the first that fails. A guard only blocks a deploy if its step file exists, the runner
// accepts its name, and the hook actually runs around the production build. This test pins all
// three for the steps the deploy depends on: DS checksums (prebuild 10, task 1.1), compose.css
// (prebuild 20, task 1.2), and the placeholder guard on src/ (prebuild 30) and on the prerendered
// output (postbuild 10), both task 2.9.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const REPO = join(__dirname, "..", "..");
const STEPS = join(REPO, "scripts", "steps");

const REQUIRED = [
  "prebuild/10-ds-checksums.mjs",
  "prebuild/20-compose-css.mjs",
  "prebuild/30-placeholders.mjs",
  "postbuild/10-placeholders-html.mjs",
];

/* The runner's own naming rule (scripts/run-steps.mjs): a misnamed .mjs stops the hook. */
const STEP_NAME = /^\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.mjs$/;

const pkg = JSON.parse(readFileSync(join(REPO, "package.json"), "utf8")) as { scripts: Record<string, string> };

describe("the build steps the deploy depends on", () => {
  it.each(REQUIRED)("%s exists", (step) => {
    expect(existsSync(join(STEPS, step)), `scripts/steps/${step} is missing`).toBe(true);
  });

  it.each(["predev", "prebuild", "postbuild"])("every .mjs in %s/ is named as the runner requires", (hook) => {
    const dir = join(STEPS, hook);
    const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".mjs")) : [];
    for (const f of files) expect(f, `${hook}/${f}`).toMatch(STEP_NAME);
  });

  it("runs the placeholder steps after DS checksums and compose.css, in name order", () => {
    const prebuild = readdirSync(join(STEPS, "prebuild")).filter((f) => f.endsWith(".mjs")).sort();
    expect(prebuild.indexOf("30-placeholders.mjs")).toBeGreaterThan(prebuild.indexOf("20-compose-css.mjs"));
    expect(prebuild.indexOf("20-compose-css.mjs")).toBeGreaterThan(prebuild.indexOf("10-ds-checksums.mjs"));
  });
});

describe("the hooks run around the production build", () => {
  it("npm runs prebuild and postbuild around build, and both call the step runner", () => {
    expect(pkg.scripts.build).toBe("next build");
    expect(pkg.scripts.prebuild).toBe("node scripts/run-steps.mjs prebuild");
    expect(pkg.scripts.postbuild).toBe("node scripts/run-steps.mjs postbuild");
  });

  it("vercel.json leaves the build command to package.json, so Vercel's npm run build runs the hooks", () => {
    const vercel = JSON.parse(readFileSync(join(REPO, "vercel.json"), "utf8")) as { buildCommand?: string };
    expect([undefined, "npm run build"]).toContain(vercel.buildCommand);
  });

  it("no .npmrc switches lifecycle scripts off", () => {
    const npmrc = join(REPO, ".npmrc");
    const text = existsSync(npmrc) ? readFileSync(npmrc, "utf8") : "";
    expect(text).not.toMatch(/^\s*ignore-scripts\s*=\s*true/m);
  });
});
