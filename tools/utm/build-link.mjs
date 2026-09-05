#!/usr/bin/env node
/** Build a campaign URL that obeys docs/utm-conventions.md, or refuse to.
 *
 *  WHY A TOOL AND NOT JUST THE DOC. The Ahrefs export for the fortnight to
 *  2026-09-05 reads 100% "Direct / None" on utm_campaign and utm_term, with a
 *  Meta Pixel already running for paid social. An untagged click is untagged
 *  forever — attribution cannot be reconstructed after the fact — so the cost
 *  of a typo is a campaign that can never be read, not an error message.
 *
 *  The two mistakes this exists to stop are both silent. Casing drift splits
 *  one campaign into two rows in every analytics tool that exists
 *  (`Paid_Social` and `paid_social` are different strings). And a value from
 *  outside the scheme — a source of `fb`, a medium of `social` — reports
 *  cleanly and aggregates with nothing.
 *
 *  Usage:
 *    npm run utm -- --source=instagram --medium=paid_social \
 *                   --campaign=2026-10-launch --path=/products/kheelu \
 *                   --content=rabbit-hero-a
 *
 *  The vocabulary lives in docs/utm-conventions.md and a test asserts this
 *  file still agrees with it, so the doc stays the source of truth. */

export const SITE_URL = "https://kheelona.com";

export const SOURCES = [
  "facebook",
  "instagram",
  "google",
  "linkedin",
  "whatsapp",
  "youtube",
  "newsletter",
  "qr",
];

export const MEDIUMS = ["cpc", "paid_social", "organic_social", "email", "referral", "print"];

/** `<yyyy-mm>-<slug>`: the date prefix sorts chronologically and survives a
 *  theme being run again next quarter. */
export const CAMPAIGN_SHAPE = /^\d{4}-(0[1-9]|1[0-2])-[a-z0-9]+(?:-[a-z0-9]+)*$/;

const LOWER_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class UtmError extends Error {}

/** Returns the tagged URL, or throws UtmError with the reason. */
export function buildUtmUrl({ source, medium, campaign, path = "/", content, term }) {
  if (!SOURCES.includes(source)) {
    throw new UtmError(
      `utm_source "${source}" is not in the scheme. Use one of: ${SOURCES.join(", ")}.`,
    );
  }
  if (!MEDIUMS.includes(medium)) {
    throw new UtmError(
      `utm_medium "${medium}" is not in the scheme. Use one of: ${MEDIUMS.join(", ")}.`,
    );
  }
  if (!CAMPAIGN_SHAPE.test(campaign)) {
    throw new UtmError(
      `utm_campaign "${campaign}" must be <yyyy-mm>-<slug>, lowercase and hyphenated, e.g. 2026-10-launch.`,
    );
  }
  if (content !== undefined && !LOWER_SLUG.test(content)) {
    throw new UtmError(`utm_content "${content}" must be lowercase and hyphenated.`);
  }
  /* Rule: utm_term is paid search only. Anywhere else it is a field nobody
     reads, and it makes two otherwise identical URLs look like two campaigns. */
  if (term !== undefined && medium !== "cpc") {
    throw new UtmError(`utm_term belongs to paid search only, and utm_medium is "${medium}".`);
  }
  if (!path.startsWith("/")) {
    throw new UtmError(`--path must start with "/", got "${path}".`);
  }

  const url = new URL(path, SITE_URL);
  /* Rule 2, and the reason this refuses rather than warns: a UTM on a link
     from one page of kheelona.com to another starts a NEW session and throws
     away the attribution of the visit that was already in progress. */
  if ([...url.searchParams.keys()].some((k) => k.startsWith("utm_"))) {
    throw new UtmError("--path already carries UTM parameters. Pass a clean path.");
  }
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", campaign);
  if (content !== undefined) url.searchParams.set("utm_content", content);
  if (term !== undefined) url.searchParams.set("utm_term", term);
  return url.toString();
}

function main(argv) {
  const args = {};
  for (const arg of argv) {
    const match = /^--([a-z]+)=(.*)$/.exec(arg);
    if (!match) {
      console.error(`unrecognised argument: ${arg}`);
      process.exit(1);
    }
    args[match[1]] = match[2];
  }
  if (!args.source || !args.medium || !args.campaign) {
    console.error(
      "usage: npm run utm -- --source=<s> --medium=<m> --campaign=<yyyy-mm-slug>\n" +
        "                     [--path=/products/kheelu] [--content=<creative>] [--term=<keyword>]\n\n" +
        `sources: ${SOURCES.join(" ")}\nmediums: ${MEDIUMS.join(" ")}\n\n` +
        "The scheme and the reasoning are in docs/utm-conventions.md.",
    );
    process.exit(1);
  }
  try {
    console.log(buildUtmUrl(args));
  } catch (error) {
    if (error instanceof UtmError) {
      console.error(error.message);
      process.exit(1);
    }
    throw error;
  }
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) {
  main(process.argv.slice(2));
}
