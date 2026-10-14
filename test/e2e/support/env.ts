/* Where the e2e harness points (task 1.1; test plan §1.1, §2.2).
 *
 * L (local production build): `next start -p 3456` serves both hosts. The marketing site answers
 * on http://localhost:3456 and the store on http://store.localhost:3456 (Chromium resolves every
 * *.localhost name to 127.0.0.1, so no hosts file is touched; src/lib/store/host.ts treats
 * store.localhost as the store host). Those names are in no tracking host list, so no tag loads.
 * LP (tracking probe): the real origins are served from the same local server through Playwright
 * routing (lp.ts), and every other host is mapped by DNS to lp.ts's local TLS proxy (task 7.1e), so the
 * host gates open while nothing leaves the machine.
 */

export const PORT = Number(process.env.KH_E2E_PORT ?? 3456);
export const STORYBOOK_PORT = Number(process.env.KH_STORYBOOK_PORT ?? 6007);

/** `KH_E2E_TARGET=beta` points the same specs at the two beta hosts (task 7.2); no local server. */
export const TARGET: "local" | "beta" = process.env.KH_E2E_TARGET === "beta" ? "beta" : "local";

export const ORIGINS: { marketing: string; store: string } =
  TARGET === "beta"
    ? { marketing: "https://betawebsite.kheelona.com", store: "https://betastore.kheelona.com" }
    : { marketing: `http://localhost:${PORT}`, store: `http://store.localhost:${PORT}` };
export type Host = "marketing" | "store";

/** The Host header each origin's server sees, for requests made from Node (not the browser). */
export const HOST_HEADERS: Record<Host, string> = {
  marketing: new URL(ORIGINS.marketing).host,
  store: new URL(ORIGINS.store).host,
};
/** Node cannot be trusted to resolve *.localhost, so Node-side requests go to 127.0.0.1 with a Host header. */
export const NODE_ORIGIN = TARGET === "beta" ? null : `http://127.0.0.1:${PORT}`;

/** The production origins (what the buttons link to on L; STORE_URL in src/config/site.ts). */
export const REAL_ORIGINS = {
  marketing: "https://kheelona.com",
  store: "https://store.kheelona.com",
} as const;

/** The two beta hosts (D048). The protection-bypass header goes to these two only (N5). */
export const BETA_HOSTS = ["betawebsite.kheelona.com", "betastore.kheelona.com"] as const;

/** `KH_PARITY_TARGET=mockup` compares the mockup with itself: the harness calibration. */
export const PARITY_TARGET: "build" | "mockup" = process.env.KH_PARITY_TARGET === "mockup" ? "mockup" : "build";

/** `KH_SLUGS=home,safety` limits the page specs to those mockup slugs (set by run-spec.mjs). */
export const SLUG_FILTER: readonly string[] | null = process.env.KH_SLUGS
  ? process.env.KH_SLUGS.split(",").map((s) => s.trim()).filter(Boolean)
  : null;

/** The bypass secret for beta runs (task 7.2), read from the environment only, never a file. */
export const BYPASS_SECRET = process.env.VERCEL_AUTOMATION_BYPASS_SECRET ?? "";

/** Where Lighthouse and harness reports go: git-ignored, local only (D039). */
export const REPORT_DIR = "test-results";
