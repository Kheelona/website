import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { isTestOrStory, listFiles, readRepoFile } from "../../../test/e2e/support/repo";
import type { StoreShell } from "./StoreShell";

/* The test store's strip (D071 (K-182), T2): "TEST MODE: no real payments" at the very top of every store page on a beta
 * build (betastore.kheelona.com, Razorpay Test Mode), and on no other build. StoreShell is rendered by src/app/store/layout.tsx
 * around the store page, /thanks, the event and partner pages and the store's 404, so one shell test covers them all.
 * The production side is also proved on the built output (T2 dev log: the production HTML has no strip and no
 * production client chunk holds the string). */

const STRIP = "TEST MODE: no real payments";

/** StoreShell imported afresh, so src/config/env.ts reads the stubbed KH_SITE_ENV (as the build inlines it). */
async function shellFor(env: string): Promise<typeof StoreShell> {
  vi.resetModules();
  vi.stubEnv("KH_SITE_ENV", env);
  return (await import("./StoreShell")).StoreShell;
}

async function renderShell(env: string) {
  const Shell = await shellFor(env);
  return render(
    <Shell>
      <p>store page</p>
    </Shell>,
  );
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("TestModeStrip: only on a beta build", () => {
  it("shows the exact line once on beta, as a DS warning Alert", async () => {
    const { container } = await renderShell("beta");
    expect(container.textContent?.split(STRIP).length).toBe(2);
    const strip = container.querySelector(".ks-test-mode")!;
    expect(strip.textContent).toBe(STRIP);
    const alert = strip.querySelector(".kh-alert")!;
    expect(alert).toHaveClass("kh-alert--warning");
    expect(alert).not.toHaveClass("kh-alert--danger");
    expect(alert).toHaveAttribute("role", "status");
    expect(screen.getByText(STRIP)).toHaveClass("kh-alert__title");
  });

  it.each(["production", "preview", "development"])("is absent from the %s build's markup", async (env) => {
    const { container } = await renderShell(env);
    expect(container.textContent).not.toContain("TEST MODE");
    expect(container.textContent).not.toContain("no real payments");
    expect(container.querySelector(".ks-test-mode, .kh-alert")).toBeNull();
    expect(container.innerHTML).not.toContain("ks-test-mode");
  });

  it("is absent when no environment is set (a plain test run reads development)", async () => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.stubEnv("KH_SITE_ENV", "");
    const { StoreShell: Shell } = await import("./StoreShell");
    const { container } = render(
      <Shell>
        <p>store page</p>
      </Shell>,
    );
    expect(container.querySelector(".ks-test-mode")).toBeNull();
  });

  it("an unknown value is ignored, so it never shows the strip", async () => {
    const { container } = await renderShell("staging");
    expect(container.querySelector(".ks-test-mode")).toBeNull();
  });
});

describe("TestModeStrip: placement and behaviour on beta", () => {
  it("sits after the skip link and before the store header, so the skip link is still first in tab order", async () => {
    const { container } = await renderShell("beta");
    expect(Array.from(container.children).map((el) => el.tagName.toLowerCase() + (el.className ? `.${el.className.split(" ")[0]}` : ""))).toEqual([
      "script",
      "a.kh-btn",
      "div.ks-test-mode",
      "header.kh-nav",
      "main",
      "footer.kh-footer",
    ]);
    const first = container.querySelector<HTMLElement>("a, button, input, [tabindex]")!;
    expect(first).toHaveClass("kh-btn");
    expect(first.getAttribute("href")).toBe("#main");
  });

  it("is static: nothing in it can be focused or dismissed", async () => {
    const { container } = await renderShell("beta");
    const strip = container.querySelector(".ks-test-mode")!;
    expect(strip.querySelectorAll("a, button, input, select, textarea, [tabindex]")).toHaveLength(0);
    expect(strip.querySelector("[style]")).toBeNull();
    // The DS icon is decoration: the line is the only text.
    expect(strip.textContent).toBe(STRIP);
  });

  it("has no accessibility violations (axe-core, WCAG 2.x A and AA; colour contrast is measured in the built page, jsdom has no layout)", async () => {
    const { container } = await renderShell("beta");
    const strip = container.querySelector<HTMLElement>(".ks-test-mode")!;
    const result = await axe.run(strip, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
      rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
    });
    expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(" | ")}`)).toEqual([]);
  });
});

describe("TestModeStrip: stays out of the way and out of the browser", () => {
  const css = readRepoFile("src/layouts/StoreShell/test-mode-strip.css");

  it("is in normal flow: its CSS never fixes, sticks or lifts it above the page", () => {
    expect(css).not.toMatch(/position\s*:/);
    expect(css).not.toMatch(/z-index\s*:/);
  });

  it("is a server component: no client directive, no hook, no script", () => {
    const tsx = readRepoFile("src/layouts/StoreShell/TestModeStrip.tsx");
    expect(tsx).not.toMatch(/["']use client["']/);
    expect(tsx).not.toMatch(/\buse[A-Z]\w*\(/);
    expect(tsx).not.toMatch(/<script/);
    expect(readRepoFile("src/layouts/StoreShell/StoreShell.tsx")).not.toMatch(/["']use client["']/);
  });

  it("the line lives in one content module, and only the strip imports it", () => {
    const files = listFiles(["src"]).filter((p) => /\.[cm]?[jt]sx?$/.test(p) && !isTestOrStory(p));
    expect(files.filter((p) => /strip:\s*"TEST MODE: no real payments"/.test(readRepoFile(p)))).toEqual(["src/content/en-IN/store/test-mode.ts"]);
    expect(files.filter((p) => readRepoFile(p).includes("store/test-mode"))).toEqual(["src/layouts/StoreShell/TestModeStrip.tsx"]);
  });
});
