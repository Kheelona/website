#!/usr/bin/env node
/** Generate the signed link (and QR payload) for an event tier.
 *
 *  Run: STORE_SIGNING_SECRET=... npm run event-link -- blr-sep-expo
 *
 *  The signature must be produced by the same secret the server verifies with,
 *  which is why this reads the environment rather than taking a key argument:
 *  a key on a command line ends up in a shell history file.
 *
 *  It deliberately does NOT touch the database. Creating the tier row (amount,
 *  cap, expiry) is a dashboard step, and keeping the two apart means an
 *  accidental run of this script cannot invent a price. */
import { createHmac } from "node:crypto";

const [tierId] = process.argv.slice(2);
const secret = process.env.STORE_SIGNING_SECRET;

if (!tierId) {
  console.error("usage: npm run event-link -- <tier-id>       (e.g. blr-sep-expo)");
  process.exit(1);
}
if (!secret || secret.includes("DUMMY")) {
  console.error("STORE_SIGNING_SECRET is not set. Use the same value as the deployment,");
  console.error("or the link will not verify.");
  process.exit(1);
}
if (!/^[a-z0-9][a-z0-9-]{1,62}$/.test(tierId)) {
  console.error("A tier id should be lowercase letters, numbers and hyphens: blr-sep-expo");
  process.exit(1);
}

/** Must stay identical to sign() in src/lib/store/signing.ts: same purpose
 *  label, same digest, same 16-character truncation. */
const signature = createHmac("sha256", secret)
  .update(`event-link:${tierId}`)
  .digest("base64url")
  .slice(0, 16);

const url = `https://store.kheelona.com/e/${tierId}?sig=${signature}`;

console.log("");
console.log(`  tier      ${tierId}`);
console.log(`  link      ${url}`);
console.log("");
console.log("  Before this works, insert the tier in Supabase (table event_tiers):");
console.log("");
console.log(
  `    insert into event_tiers (id, label, amount_paise, cap, expires_on)\n` +
    `    values ('${tierId}', 'Event price', 9900, 100, '2026-09-30');`,
);
console.log("");
console.log("  The cap and the expiry are what contain a forwarded QR code, so set both.");
console.log("");
