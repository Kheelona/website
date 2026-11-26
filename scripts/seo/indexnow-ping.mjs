#!/usr/bin/env node
/**
 * IndexNow ping (K-206, the founder's "Bing now + IndexNow in PR B", 27 Nov 2026): tells Bing and the other IndexNow
 * engines which kheelona.com URLs changed, right after a production deploy.
 *
 *   node scripts/seo/indexnow-ping.mjs              URLs in the LIVE sitemap whose <lastmod> is within the last 2 days
 *   node scripts/seo/indexnow-ping.mjs --days 7     a wider window
 *   node scripts/seo/indexnow-ping.mjs <url> …      exactly these kheelona.com URLs
 *   add --dry-run                                   print the request, send nothing
 *
 * The key is public by design (IndexNow proves site ownership by serving it): it is the one file public/<32 hex>.txt,
 * served at https://kheelona.com/<key>.txt. No secret, no dependency. Run by .github/workflows/indexnow.yml after a
 * successful Vercel Production deployment, or by hand. Exits non-zero when the key file is not live yet or the API
 * refuses the request, so a failed ping shows as a failed run.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const HOST = "kheelona.com";
export const ORIGIN = `https://${HOST}`;
export const ENDPOINT = "https://api.indexnow.org/indexnow";
const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), "../../public");

/** The key: the content of the single public/<key>.txt file, which must equal its own name. */
export function readKey(dir = PUBLIC) {
  const files = readdirSync(dir).filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  if (files.length !== 1) throw new Error(`expected one IndexNow key file in public/, found ${files.length}`);
  const key = readFileSync(join(dir, files[0]), "utf8").trim();
  if (`${key}.txt` !== files[0]) throw new Error(`public/${files[0]} must contain exactly its own name`);
  return key;
}

/** Today's date in India (YYYY-MM-DD), the zone the site's lastmod dates are written in. */
export function todayIST(now = new Date()) {
  return new Date(now.getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

/** URLs on this host whose <lastmod> falls within the last `days` days (today counts as day 1). */
export function changedUrls(sitemapXml, today, days = 2) {
  const from = new Date(`${today}T00:00:00Z`);
  from.setUTCDate(from.getUTCDate() - (days - 1));
  const since = from.toISOString().slice(0, 10);
  const out = [];
  for (const m of sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(m[1])?.[1].trim();
    const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(m[1])?.[1].trim().slice(0, 10);
    if (loc && lastmod && lastmod >= since && lastmod <= today && new URL(loc).host === HOST) out.push(loc);
  }
  return [...new Set(out)];
}

/** The request body IndexNow expects (one host per request). */
export function payload(key, urls) {
  for (const u of urls) if (new URL(u).host !== HOST) throw new Error(`not a ${HOST} URL: ${u}`);
  return { host: HOST, key, keyLocation: `${ORIGIN}/${key}.txt`, urlList: urls };
}

async function main(argv) {
  const dry = argv.includes("--dry-run");
  const d = argv.indexOf("--days");
  const days = d >= 0 ? Number(argv[d + 1]) : 2;
  if (!Number.isInteger(days) || days < 1 || days > 30) throw new Error(`--days must be a whole number from 1 to 30`);
  const explicit = argv.filter((a, i) => /^https?:\/\//.test(a) && argv[i - 1] !== "--days");
  const key = readKey();
  let urls = explicit;
  if (!urls.length) {
    const res = await fetch(`${ORIGIN}/sitemap.xml`, { headers: { "user-agent": "kheelona-indexnow" } });
    if (!res.ok) throw new Error(`sitemap.xml answered ${res.status}`);
    urls = changedUrls(await res.text(), todayIST(), days);
  }
  if (!urls.length) return console.log(`indexnow: no URL changed in the last ${days} day(s); nothing sent`);
  const body = payload(key, urls);
  console.log(`indexnow: ${urls.length} URL(s)\n  ${urls.join("\n  ")}`);
  if (dry) return console.log(`indexnow: --dry-run, would POST ${ENDPOINT}\n${JSON.stringify(body, null, 1)}`);
  const live = await fetch(body.keyLocation, { headers: { "user-agent": "kheelona-indexnow" } });
  if (!live.ok || (await live.text()).trim() !== key) throw new Error(`${body.keyLocation} does not serve the key yet (${live.status})`);
  const res = await fetch(ENDPOINT, { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify(body) });
  console.log(`indexnow: ${ENDPOINT} answered ${res.status}`);
  if (res.status !== 200 && res.status !== 202) throw new Error(`IndexNow refused the request (${res.status}): ${await res.text()}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((e) => { console.error(`indexnow: ${e.message}`); process.exit(1); });
}
