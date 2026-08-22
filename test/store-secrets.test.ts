import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The line between a public identifier and a secret (§8.25-y).
 *
 * This repo deliberately HARDCODES three third-party identifiers in
 * `config/site.ts`: the GA4 measurement id, the Ahrefs site key, and (until it
 * was retired) the Tally form URL. Each has a comment explaining that a public
 * client-side identifier is not a secret, and each of those comments is correct.
 *
 * They are also a precedent that must not be followed one step further. A
 * Razorpay key secret, a Supabase service-role key and our signing secret are
 * the opposite kind of thing: one of them in a client bundle is a stranger
 * reading every order, or minting ₹99 links, or charging our account.
 *
 * So this guards the boundary in both directions: no secret may be read through
 * `process.env.NEXT_PUBLIC_*`, and no secret value may be typed into a file that
 * ships to a browser.
 */

const ROOT = process.cwd();

const SECRET_NAMES = [
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_WEBHOOK_SECRET",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STORE_SIGNING_SECRET",
  "RESEND_API_KEY",
] as const;

const sourceFiles = execFileSync("git", ["ls-files", "src/**/*.ts", "src/**/*.tsx", "src/*.ts"], {
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean);

describe("store secrets stay secret", () => {
  it("never reads a secret through a NEXT_PUBLIC_ name", () => {
    for (const file of sourceFiles) {
      const text = readFileSync(join(ROOT, file), "utf8");
      for (const name of SECRET_NAMES) {
        expect(text, `${file} exposes ${name}`).not.toContain(`NEXT_PUBLIC_${name}`);
      }
    }
  });

  /* Every secret must be read in exactly one place. Scattered process.env reads
     are how a route ends up quietly working without the guard that decides
     whether the store is configured at all. */
  it("reads every secret only in lib/store/env.ts", () => {
    for (const file of sourceFiles) {
      if (file === "src/lib/store/env.ts") continue;
      const text = readFileSync(join(ROOT, file), "utf8");
      for (const name of SECRET_NAMES) {
        expect(text, `${file} reads ${name} directly instead of via storeEnv()`).not.toContain(
          `process.env.${name}`,
        );
      }
    }
  });

  it("keeps every secret out of any file marked \"use client\"", () => {
    for (const file of sourceFiles) {
      const text = readFileSync(join(ROOT, file), "utf8");
      if (!text.startsWith('"use client"')) continue;
      expect(text, `${file} is a client component and reads process.env`).not.toMatch(
        /process\.env\.(RAZORPAY|SUPABASE|STORE_SIGNING|RESEND)/,
      );
    }
  });

  it("documents every secret in .env.example, so nothing is discovered at 2am", () => {
    const example = readFileSync(join(ROOT, ".env.example"), "utf8");
    for (const name of [...SECRET_NAMES, "RAZORPAY_KEY_ID", "SUPABASE_URL"]) {
      expect(example, `${name} is undocumented`).toContain(name);
    }
  });

  it("commits no real values: .env.example is empty and .env is ignored", () => {
    const example = readFileSync(join(ROOT, ".env.example"), "utf8");
    // every assignment is blank, except the from-address, which is not a secret
    for (const line of example.split("\n")) {
      const match = /^([A-Z0-9_]+)=(.*)$/.exec(line);
      if (!match) continue;
      if (match[1] === "EMAIL_FROM") continue;
      expect(match[2], `${match[1]} has a value committed`).toBe("");
    }
    const ignored = readFileSync(join(ROOT, ".gitignore"), "utf8");
    expect(ignored).toMatch(/^\.env/m);
  });

  it("keeps the daily cron that stops Supabase pausing the project", () => {
    const vercel = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8")) as {
      crons?: { path: string }[];
    };
    expect(vercel.crons?.some((c) => c.path === "/api/health")).toBe(true);
  });
});
