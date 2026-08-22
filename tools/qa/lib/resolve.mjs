/** Find the browser tooling without depending on where npx happened to cache it.
 *
 *  Why this file exists: the harness used to live in a session scratchpad with
 *  the npx cache hash typed into every import. That hash changes, the scratchpad
 *  is deleted between sessions, and both together meant re-deriving the same
 *  five paths at the start of every visual review. Now the harness is in the
 *  repo and finds its own dependencies (§8.25-cc).
 *
 *  puppeteer-core and axe-core are NOT dependencies of this project on purpose:
 *  they are ~400MB of browser tooling for a dev-only harness, and Vercel would
 *  install them on every production build. They are borrowed from wherever they
 *  already are, and the error message says what to run if they are nowhere. */
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

function candidateRoots() {
  const roots = [join(process.cwd(), "node_modules")];
  const npxCache = join(homedir(), ".npm", "_npx");
  if (existsSync(npxCache)) {
    for (const entry of readdirSync(npxCache)) {
      roots.push(join(npxCache, entry, "node_modules"));
    }
  }
  return roots;
}

/** The first root that contains `relative`, or null. */
function findIn(relative) {
  for (const root of candidateRoots()) {
    const candidate = join(root, relative);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

export function puppeteerPath() {
  const found = findIn("puppeteer-core/lib/puppeteer/puppeteer-core.js");
  if (!found) {
    throw new Error(
      "puppeteer-core not found. Run `npx -y lighthouse@latest --help` once to " +
        "populate the npx cache (it pulls puppeteer-core and axe-core), or " +
        "`npm i -D puppeteer-core axe-core` if you would rather have them local.",
    );
  }
  return found;
}

export function axeSourcePath() {
  const found = findIn("axe-core/axe.min.js");
  if (!found) throw new Error("axe-core not found. See the note in puppeteerPath().");
  return found;
}

/** A real Chrome, in preference order. Chrome-for-Testing (the puppeteer cache)
 *  is listed first because it is version-pinned; the installed browser is the
 *  fallback and is what this project has actually used. */
export function chromePath() {
  const explicit = process.env.CHROME_PATH;
  if (explicit && existsSync(explicit)) return explicit;

  const cache = join(homedir(), ".cache", "puppeteer", "chrome");
  if (existsSync(cache)) {
    for (const version of readdirSync(cache).sort().reverse()) {
      const mac = join(cache, version, "chrome-mac-arm64", "Google Chrome for Testing.app",
        "Contents", "MacOS", "Google Chrome for Testing");
      if (existsSync(mac)) return mac;
      const macIntel = join(cache, version, "chrome-mac-x64", "Google Chrome for Testing.app",
        "Contents", "MacOS", "Google Chrome for Testing");
      if (existsSync(macIntel)) return macIntel;
      const linux = join(cache, version, "chrome-linux64", "chrome");
      if (existsSync(linux)) return linux;
    }
  }

  for (const installed of [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ]) {
    if (existsSync(installed)) return installed;
  }
  throw new Error("No Chrome found. Set CHROME_PATH to a Chrome or Chromium binary.");
}
