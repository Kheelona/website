import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  contentSecurityPolicy,
  securityHeaders,
  CSP_PHASE,
  CSP_REPORT_PATH,
} from "@/lib/security-headers";

/**
 * The response headers, as a contract (F-03, security-review.md).
 *
 * Headers are the easiest security control to lose: nobody sees them in a
 * browser, no page looks different when one disappears, and a config refactor
 * can drop the whole block without a single test going red. Before 2026-08-23
 * this site sent exactly one, and nothing here noticed for a month of taking
 * money. So the policy is asserted rather than trusted.
 *
 * These tests are about SHAPE, not taste. Each one names the attack it is
 * standing in the way of, so a future edit that has to relax something can tell
 * what it is spending.
 */

const ROOT = process.cwd();
const policy = contentSecurityPolicy();
const headers = securityHeaders();
const byKey = (key: string) => headers.find((h) => h.key === key)?.value;

/** The directive's value, or undefined. */
function directive(name: string): string | undefined {
  const found = policy.split("; ").find((part) => part === name || part.startsWith(`${name} `));
  return found === undefined ? undefined : found.slice(name.length).trim();
}

describe("the content security policy", () => {
  it("defaults to refusing anything we did not name", () => {
    expect(directive("default-src")).toBe("'self'");
  });

  it("lets nothing frame this site, in both spellings", () => {
    /* A checkout inside a stranger's iframe is a phishing overlay. */
    expect(directive("frame-ancestors")).toBe("'none'");
    expect(byKey("X-Frame-Options")).toBe("DENY");
  });

  it("refuses plugins and refuses to have its base rewritten", () => {
    /* A rewritten <base> turns every relative script URL on the page into an
       attacker's URL, which is a skimmer with no injected script at all. */
    expect(directive("object-src")).toBe("'none'");
    expect(directive("base-uri")).toBe("'self'");
  });

  it("never allows eval in a production policy", () => {
    expect(policy).not.toContain("'unsafe-eval'");
    /* WASM compilation is a separate, narrower allowance and is expected. */
    expect(policy).toContain("'wasm-unsafe-eval'");
  });

  it("allows eval only in development, where React needs it", () => {
    expect(contentSecurityPolicy(true)).toContain("'unsafe-eval'");
  });

  /* The anti-skimming half of the policy. Even with 'unsafe-inline' on scripts
     (the documented compromise), a script that runs has to have somewhere to
     send what it read, and these three directives are that somewhere. */
  it("bounds where anything on the page may send data", () => {
    for (const name of ["connect-src", "img-src", "form-action"]) {
      const value = directive(name);
      expect(value, `${name} is missing`).toBeTruthy();
      expect(value, `${name} allows anything`).not.toContain("*;");
      expect(value!.startsWith("'self'"), `${name} does not start from self`).toBe(true);
    }
  });

  it("names every origin this site actually loads, and no wildcard host", () => {
    /* If one of these is dropped, the site quietly stops measuring or, worse,
       the checkout script is blocked the day the policy starts enforcing. */
    for (const host of [
      "https://analytics.ahrefs.com",
      "https://www.googletagmanager.com",
      "https://*.razorpay.com",
    ]) {
      expect(policy, `${host} is not allowed anywhere`).toContain(host);
    }
    /* A bare * or https: in script-src would make the whole exercise theatre. */
    const scripts = directive("script-src")!;
    expect(scripts).not.toMatch(/(^| )\*( |$)/);
    expect(scripts).not.toContain(" https: ");
  });

  it("sends violations somewhere we can read them, in both spellings", () => {
    expect(policy).toContain(`report-uri ${CSP_REPORT_PATH}`);
    expect(policy).toContain("report-to csp");
    expect(byKey("Reporting-Endpoints")).toBe(`csp="${CSP_REPORT_PATH}"`);
  });

  /* The rollout state, asserted so that flipping it is a deliberate edit with a
     test change beside it, and never a side effect of something else. The
     founder's sequence is Report-Only, read the reports, then enforce. */
  it("is in the rollout phase the engagement recorded", () => {
    expect(CSP_PHASE).toBe("report");
    expect(byKey("Content-Security-Policy-Report-Only")).toBeTruthy();
    expect(byKey("Content-Security-Policy")).toBeUndefined();
  });

  it("has a collector route to report to", () => {
    const files = execFileSync("git", ["ls-files", "src/app/api"], { encoding: "utf8" });
    expect(files).toContain(`src/app${CSP_REPORT_PATH}/route.ts`);
  });
});

describe("the rest of the security headers", () => {
  /* F-09. The platform sent max-age on its own; includeSubDomains is the half
     that matters, because a subdomain reachable over plain HTTP is a place to
     serve something that looks like us. Enabled only after F-15 was fixed:
     admin.kheelona.com had a certificate that did not cover it, and HSTS makes
     a certificate warning impossible to click through. */
  it("binds every subdomain to HTTPS, for two years", () => {
    const hsts = byKey("Strict-Transport-Security")!;
    expect(hsts).toContain("includeSubDomains");
    expect(Number(/max-age=(\d+)/.exec(hsts)![1])).toBeGreaterThanOrEqual(31_536_000);
  });

  it("does not claim a preload entry nobody submitted", () => {
    /* preload means a list compiled into browser binaries, and removal from it
       takes months. It is a separate decision, not a ride along with the one
       above. Asserted so it cannot be added absent-mindedly. */
    expect(byKey("Strict-Transport-Security")).not.toContain("preload");
  });

  it("stops content-type sniffing", () => {
    expect(byKey("X-Content-Type-Options")).toBe("nosniff");
  });

  it("keeps a full URL from travelling to another origin as a referrer", () => {
    expect(byKey("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
  });

  it("gives away three capabilities this site has no use for", () => {
    const permissions = byKey("Permissions-Policy")!;
    for (const feature of ["camera=()", "microphone=()", "geolocation=()"]) {
      expect(permissions).toContain(feature);
    }
    /* Deliberately NOT payment: Razorpay's Android flow can use it. */
    expect(permissions).not.toContain("payment=()");
  });

  it("is actually wired into next.config, not just exported", () => {
    /* The one failure this whole file cannot otherwise catch: a perfect policy
       that no response carries. Read as text, the same way
       redirects-vs-assets.test.ts reads the redirect table. */
    const config = readFileSync(join(ROOT, "next.config.ts"), "utf8");
    expect(config).toContain("securityHeaders");
    expect(config).toMatch(/async headers\(\)/);
    expect(config).toContain("poweredByHeader: false");
  });
});
