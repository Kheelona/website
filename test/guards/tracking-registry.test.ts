import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  AHREFS_ANALYTICS_KEY,
  GA4_MEASUREMENT_ID,
  META_PIXEL_ID,
  POSTHOG_ASSET_PROXY_PATH,
  POSTHOG_KEY,
  POSTHOG_PROXY_PATH,
} from "@/config/site";
import { CAMPAIGN_KEYS } from "@/lib/campaign";
import type { PreorderRow } from "@/lib/store/db";
import { purchasePayload } from "@/lib/store/meta-capi";
import { purchaseConfirmedEvent } from "@/lib/store/posthog-server";
import { CTAS, CTA_IDS, CTA_VALUES, RESERVED_CTA_VALUES, type CtaValue } from "@/lib/tracking/cta";
import { DESTINATIONS, type DestinationKey } from "@/lib/tracking/destinations";
import { EVENTS, STAMPED_PROPERTIES, type TrackedEvent } from "@/lib/tracking/events";

/**
 * TRACKING REGISTRY GUARD (task 1.4; ADR-006; architecture §8.2-8.3; QA review N2).
 *
 * The three registries in src/lib/tracking/ are data, and this guard proves them equal to
 * the documents and code they come from, in both directions:
 *
 * - wiki/site/tracking-inventory.md, which records production at tag
 *   archive/pre-reset-2026-10-10: every destination (the 17 rows of "At a glance"), every
 *   public ID, every existing event and parameter, and the eight existing cta values.
 * - wiki/engineering/architecture.md §8.2-8.3: each destination's kind and gate, the new
 *   events (B11), the new cta values (incl. whatsapp-float, D050) and every status.
 * - The frozen server payload builders (meta-capi.ts, posthog-server.ts), because the
 *   inventory states the server payloads in prose: the registry must list exactly the
 *   parameters those builders send.
 * - The approved mockups: where each cta value sits.
 *
 * So it fails when a name, an ID or a parameter is edited, or a row goes missing, on either
 * side. When the inventory changes for a real reason (a founder decision), change the
 * registry in the same commit; never loosen this file to make it pass.
 */

const ROOT = process.cwd();
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");
const INVENTORY = read("wiki/site/tracking-inventory.md");
const ARCHITECTURE = read("wiki/engineering/architecture.md");

/* ── Markdown readers (test-only) ────────────────────────────────────────── */

/** From the heading line starting with `heading` to the next heading of the same or a higher level. */
function section(md: string, heading: string): string {
  const lines = md.split("\n");
  const level = (line: string) => /^(#+) /.exec(line)?.[1].length ?? 0;
  const start = lines.findIndex((l) => l.startsWith(heading));
  if (start < 0) throw new Error(`Heading not found: "${heading}"`);
  const own = level(lines[start]);
  const end = lines.findIndex((l, i) => i > start && level(l) > 0 && level(l) <= own);
  return lines.slice(start, end < 0 ? undefined : end).join("\n");
}

/** Markdown with code ticks and bold removed, whitespace collapsed. */
const plain = (s: string) => s.replace(/\*\*/g, "").replace(/`/g, "").replace(/\s+/g, " ").trim();

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split(/(?<!\\)\|/)
    .map((c) => c.trim());

/** Body rows of the pipe table in `text` whose header reads exactly `header` (plain text). */
function table(text: string, header: string[]): string[][] {
  const lines = text.split("\n");
  const at = lines.findIndex(
    (l) => l.trim().startsWith("|") && cells(l).map(plain).join("|") === header.join("|"),
  );
  if (at < 0) throw new Error(`Table not found: | ${header.join(" | ")} |`);
  const rows: string[][] = [];
  for (let i = at + 2; i < lines.length && lines[i].trim().startsWith("|"); i++) rows.push(cells(lines[i]));
  return rows;
}

/** One top-level bullet (`- **Label…`) with its continuation lines and sub-bullets. */
function bullet(text: string, label: string): string {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => l.startsWith(`- **${label}`));
  if (start < 0) throw new Error(`Bullet not found: "- **${label}"`);
  const end = lines.findIndex((l, i) => i > start && (l.startsWith("- ") || l.startsWith("#") || l.trim() === ""));
  return lines.slice(start, end < 0 ? undefined : end).join("\n");
}

/** The text with every parenthetical aside removed (they hold units, file refs and notes). */
function withoutAsides(s: string): string {
  let out = s;
  for (let prev = ""; prev !== out; ) {
    prev = out;
    out = out.replace(/\([^()]*\)/g, "");
  }
  return out;
}

/** Every code-font token, in order. */
const code = (s: string) => [...s.matchAll(/`([^`]+)`/g)].map((m) => m[1]);

type InventoryParam = { name: string; hasLiteral: boolean; literal?: unknown };

/** `name` or `name: <literal>`; the literal counts only when it is JSON (a fixed value). */
function param(token: string): InventoryParam {
  const at = token.indexOf(": ");
  if (at < 0) return { name: token, hasLiteral: false };
  const name = token.slice(0, at);
  try {
    return { name, hasLiteral: true, literal: JSON.parse(token.slice(at + 2)) };
  } catch {
    return { name, hasLiteral: false };
  }
}

const paramsOf = (cell: string) => code(withoutAsides(cell)).map(param);
const literalsOf = (ps: InventoryParam[]) =>
  Object.fromEntries(ps.filter((p) => p.hasLiteral).map((p) => [p.name, p.literal]));

/* ── Registry readers ────────────────────────────────────────────────────── */

const destination = (row: number) => DESTINATIONS.find((d) => d.row === row);
const eventsTo = (key: DestinationKey) => EVENTS.filter((e) => e.destinations.includes(key));
const only = (events: readonly TrackedEvent[], name: string) => {
  const hits = events.filter((e) => e.name === name);
  expect(hits, `expected exactly one registry entry named ${name}`).toHaveLength(1);
  return hits[0];
};
const sorted = (xs: readonly string[]) => [...xs].sort();

/** Dotted paths of every leaf of a plain object (arrays count as leaves). */
function leaves(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? leaves(v as Record<string, unknown>, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );
}
const at = (obj: Record<string, unknown>, path: string): unknown =>
  path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], obj);
const leafName = (path: string) => path.split(".").pop() as string;

/* ── 1. Destinations ─────────────────────────────────────────────────────── */

const GLANCE = table(section(INVENTORY, "## At a glance"), [
  "#",
  "Destination",
  "Public ID",
  "Loads from",
  "Host-gated?",
  "Live evidence",
]);
const ARCH_DESTINATIONS = table(section(ARCHITECTURE, "### 8.2 "), [
  "#",
  "Destination",
  "ID",
  "Kind",
  "Gate",
  "Events in this registry",
]);

describe("destinations.ts: the inventory's At a glance table, row for row (N2)", () => {
  it("has the 17 inventory rows, in the inventory's order, and no other", () => {
    expect(GLANCE).toHaveLength(17);
    expect(DESTINATIONS.map((d) => d.row)).toEqual(GLANCE.map((r) => Number(r[0])));
  });

  it("uses unique keys", () => {
    expect(new Set(DESTINATIONS.map((d) => d.key)).size).toBe(DESTINATIONS.length);
  });

  it.each(GLANCE)("row %s: name and every public ID as the inventory states them", (n, name, publicId) => {
    const d = destination(Number(n));
    expect(d, `inventory row ${n} (${plain(name)}) is missing from destinations.ts`).toBeDefined();
    expect(d?.name).toBe(plain(name));
    expect(d?.ids, `IDs of row ${n} differ from the inventory`).toEqual([...code(name), ...code(publicId)]);
    expect(d?.status).toBe("existing");
  });

  it.each(ARCH_DESTINATIONS)("row %s: ID, kind and gate as architecture §8.2", (n, _name, id, kind, gate) => {
    const d = destination(Number(n));
    expect(d, `architecture row ${n} is missing from destinations.ts`).toBeDefined();
    expect(d?.id).toBe(plain(id));
    expect(d?.kind).toBe(plain(kind));
    expect(d?.gate).toBe(plain(gate));
    for (const token of code(id)) expect(d?.ids).toContain(token);
  });

  it("has events exactly for the destinations architecture §8.2 gives events", () => {
    expect(ARCH_DESTINATIONS).toHaveLength(GLANCE.length);
    for (const [n, , , , , events] of ARCH_DESTINATIONS) {
      const d = destination(Number(n));
      const none = /^(none|carries)\b/.test(plain(events));
      expect(eventsTo(d!.key).length > 0, `${d!.key}: architecture says "${plain(events)}"`).toBe(!none);
    }
  });

  it("names the same IDs the gates and the layout use (src/config/site.ts)", () => {
    const ids = (key: DestinationKey) => DESTINATIONS.find((d) => d.key === key)?.ids;
    expect(ids("ahrefs-web-analytics")).toEqual([AHREFS_ANALYTICS_KEY]);
    expect(ids("ga4")).toEqual([GA4_MEASUREMENT_ID]);
    expect(ids("meta-pixel")).toEqual([META_PIXEL_ID]);
    expect(ids("posthog-browser")).toContain(POSTHOG_KEY);
    expect(ids("posthog-proxy")).toEqual([POSTHOG_PROXY_PATH, POSTHOG_ASSET_PROXY_PATH]);
  });
});

/* ── 2. Events: existing, from the inventory ─────────────────────────────── */

const GA4_TABLE = table(section(INVENTORY, "## 3. "), ["Event", "Parameters", "Fired at", "Triggered by"]);
const META_TABLE = table(section(INVENTORY, "## 4. "), ["Event", "Parameters", "eventID", "Fired at", "When"]);
const SNAPSHOT = table(section(INVENTORY, "## Live snapshot"), [
  "Event",
  "Count",
  "Hosts",
  "First / last seen (UTC)",
]);
/* The server payloads are prose in the inventory: read only the bullets that state them. */
const CAPI_EVENT = bullet(section(INVENTORY, "## 5. "), "Event:");
const POSTHOG_SERVER_EVENT = bullet(section(INVENTORY, "## 7. "), "Event:");
const POSTHOG_SERVER_PAYLOAD = bullet(section(INVENTORY, "## 7. "), "Payload");

/** Inventory literals that are deliberately NOT fixed in the registry, each with its reason. */
const NOT_FIXED: Record<string, string> = {
  "ViewContent.value":
    "the offer headline in rupees, read from the offer (architecture §8.2, ADR-005, B9); 4999 in token mode",
};

function expectFixedAsInventory(e: TrackedEvent, ps: InventoryParam[]) {
  const literals = literalsOf(ps);
  for (const key of Object.keys(literals)) if (`${e.name}.${key}` in NOT_FIXED) delete literals[key];
  expect(e.fixed ?? {}, `${e.name}: fixed values differ from the inventory's literals`).toEqual(literals);
}

describe("events.ts: existing events equal the inventory", () => {
  it("every (name, destination) pair is registered once", () => {
    const pairs = EVENTS.flatMap((e) => e.destinations.map((d) => `${d}:${e.name}`));
    expect(new Set(pairs).size).toBe(pairs.length);
  });

  it("automatic pageviews: Vercel Web Analytics and Ahrefs (inventory §1-2, N2)", () => {
    for (const [heading, key] of [
      ["## 1. ", "vercel-web-analytics"],
      ["## 2. ", "ahrefs-web-analytics"],
    ] as const) {
      expect(section(INVENTORY, heading)).toContain("automatic pageviews only");
      expect(eventsTo(key).map((e) => [e.name, e.automatic, e.params.length, e.status])).toEqual([
        ["pageview", true, 0, "existing"],
      ]);
    }
  });

  it("GA4: page_view is its only automatic event (inventory §3)", () => {
    expect(section(INVENTORY, "## 3. ")).toContain("`page_view` from `gtag('config')`");
    expect(eventsTo("ga4").filter((e) => e.automatic).map((e) => e.name)).toEqual(["page_view"]);
  });

  it("GA4: the custom events, by name, each with its parameters in order", () => {
    expect(GA4_TABLE.length).toBeGreaterThan(0);
    const expected = GA4_TABLE.map(([event, ps]) => [code(event)[0], paramsOf(ps).map((p) => p.name)]);
    const actual = eventsTo("ga4")
      .filter((e) => !e.automatic && e.status === "existing")
      .map((e) => [e.name, [...e.params]]);
    expect(sorted(actual.map(([n]) => n as string))).toEqual(sorted(expected.map(([n]) => n as string)));
    for (const [name, params] of expected) {
      expect(only(eventsTo("ga4"), name as string).params, `${name} parameters`).toEqual(params);
    }
  });

  it.each(GA4_TABLE)("GA4 %s: fixed values as the inventory's literals, status existing", (event, ps) => {
    const e = only(eventsTo("ga4"), code(event)[0]);
    expect(e.status).toBe("existing");
    expectFixedAsInventory(e, paramsOf(ps));
  });

  it("PostHog receives the same custom events and parameters as GA4 (inventory §6)", () => {
    expect(section(INVENTORY, "## 6. ")).toContain("same six names and parameters as GA4");
    for (const [event] of GA4_TABLE) {
      expect(only(eventsTo("ga4"), code(event)[0]).destinations).toContain("posthog-browser");
    }
  });

  it("Meta Pixel: the events, by name, each with its parameters in order and its eventID", () => {
    expect(META_TABLE.length).toBeGreaterThan(0);
    const names = [...new Set(META_TABLE.map(([event]) => code(event)[0]))];
    expect(sorted(eventsTo("meta-pixel").map((e) => e.name))).toEqual(sorted(names));
    for (const [event, ps, eventId] of META_TABLE) {
      const e = only(eventsTo("meta-pixel"), code(event)[0]);
      expect(e.params, `${e.name} parameters`).toEqual(paramsOf(ps).map((p) => p.name));
      expect(e.eventId, `${e.name} eventID`).toBe(plain(eventId) === "none" ? undefined : code(eventId)[0]);
      expect(e.status).toBe("existing");
      expectFixedAsInventory(e, paramsOf(ps));
    }
  });

  it("PostHog SDK events equal those the live snapshot shows (setup tests excluded)", () => {
    const seen = SNAPSHOT.filter((r) => !r[3].includes("setup tests")).flatMap((r) => code(r[0]));
    const sdk = seen.filter((n) => n.startsWith("$"));
    expect(sdk.length).toBeGreaterThan(0);
    expect(sorted(eventsTo("posthog-browser").filter((e) => e.automatic).map((e) => e.name))).toEqual(sorted(sdk));
    const registered = new Set<string>(EVENTS.map((e) => e.name));
    for (const n of seen) expect(registered.has(n), `${n} is seen live but not registered`).toBe(true);
  });

  it("registers no one-off setup-test event", () => {
    const setup = SNAPSHOT.filter((r) => r[3].includes("setup tests")).flatMap((r) => code(r[0]));
    expect(setup.length).toBeGreaterThan(0);
    for (const n of setup) expect(EVENTS.map((e) => e.name)).not.toContain(n);
  });

  it("$autocapture carries cta, promoted from data-ph-capture-attribute-cta (inventory §6)", () => {
    expect(section(INVENTORY, "## 6. ")).toContain("top-level `cta` property on `$autocapture`");
    expect(only(eventsTo("posthog-browser"), "$autocapture").params).toEqual(["cta"]);
  });
});

/* ── 3. Server events: the inventory's prose and the frozen builders ─────── */

const REF = "KH-TEST-0001";
const order = (): PreorderRow => ({
  id: 1,
  order_ref: REF,
  tier: "launch",
  amount_paise: 49_900,
  status: "paid",
  parent_name: "Test Parent",
  phone: "+919000000000",
  email: "parent@example.com",
  child_age: "4",
  wa_consent: true,
  terms_accepted_at: null,
  address: null,
  rzp_order_id: "order_test",
  rzp_payment_id: "pay_test",
  balance_status: "due",
  utm: Object.fromEntries(CAMPAIGN_KEYS.map((k) => [k, "test"])),
  fb_attrib: { fbp: "fb.1.1.1", fbc: "fb.1.1.test", ip: "203.0.113.9", ua: "Mozilla/5.0" },
  ph_distinct_id: "device-test",
  created_at: "2026-10-01T00:00:00.000Z",
  paid_at: "2026-10-01T00:00:00.000Z",
});

describe("events.ts: server events", () => {
  const capi = () => only(eventsTo("meta-capi"), "Purchase");
  const confirmed = () => only(eventsTo("posthog-server"), "purchase_confirmed");

  it("Meta CAPI sends one event, Purchase (inventory §5)", () => {
    expect(CAPI_EVENT).toContain("one name only, `Purchase`");
    expect(eventsTo("meta-capi").map((e) => [e.name, e.status])).toEqual([["Purchase", "existing"]]);
  });

  it("CAPI Purchase: parameters are exactly what the frozen purchasePayload sends", () => {
    const { event_name, ...event } = purchasePayload(order(), "TOKEN").data[0];
    expect(event_name).toBe("Purchase");
    expect(sorted(capi().params)).toEqual(sorted(leaves(event)));
  });

  it("CAPI Purchase: every parameter is named in inventory §5", () => {
    const named = new Set(code(CAPI_EVENT).map((t) => param(t).name));
    for (const p of capi().params) expect(named.has(leafName(p)), `${p} is not in inventory §5`).toBe(true);
  });

  it("CAPI Purchase: fixed values and the dedup key equal the payload and the inventory", () => {
    const event = purchasePayload(order(), "TOKEN").data[0];
    const fixed = capi().fixed ?? {};
    for (const [path, value] of Object.entries(fixed)) expect(at(event, path), path).toEqual(value);
    expect(Object.fromEntries(Object.entries(fixed).map(([p, v]) => [leafName(p), v]))).toEqual(
      literalsOf(code(CAPI_EVENT).map(param)),
    );
    expect(capi().eventId?.replace("<order ref>", REF)).toBe(event.event_id);
    expect(only(eventsTo("meta-pixel"), "Purchase").eventId).toBe(capi().eventId);
  });

  it("PostHog server sends one event, purchase_confirmed (inventory §7)", () => {
    expect(code(POSTHOG_SERVER_EVENT)).toContain("purchase_confirmed");
    expect(eventsTo("posthog-server").map((e) => [e.name, e.status])).toEqual([["purchase_confirmed", "existing"]]);
  });

  it("purchase_confirmed: parameters are exactly the frozen builder's (env only as the registered addition)", () => {
    const event = purchaseConfirmedEvent(order());
    expect(event.event).toBe("purchase_confirmed");
    const added = (confirmed().added ?? []).map((a) => a.name);
    expect(sorted(Object.keys(event.properties).filter((k) => !added.includes(k)))).toEqual(
      sorted(confirmed().params),
    );
  });

  it("purchase_confirmed: every parameter is named in inventory §7 (utm_* covers the campaign keys)", () => {
    const named = code(POSTHOG_SERVER_PAYLOAD).map((t) => param(t).name);
    const covered = (p: string) =>
      named.some((n) => n === p || (n.endsWith("*") && p.startsWith(n.slice(0, -1))));
    for (const p of confirmed().params) expect(covered(p), `${p} is not in inventory §7`).toBe(true);
  });

  it("purchase_confirmed: fixed values equal the builder and the inventory", () => {
    const { properties } = purchaseConfirmedEvent(order());
    const fixed = confirmed().fixed ?? {};
    for (const [k, v] of Object.entries(fixed)) expect(properties[k], k).toEqual(v);
    expect(fixed).toEqual(literalsOf(code(POSTHOG_SERVER_PAYLOAD).map(param)));
  });

  it("purchase_confirmed: env (SITE_ENV) on non-production builds is registered as new (architecture §8.2, N4)", () => {
    const row = table(section(ARCHITECTURE, "### 8.2 "), [
      "Event",
      "Destinations",
      "Parameters (unchanged)",
      "Fired by",
      "Status",
    ]).find(([event]) => code(event)[0] === "purchase_confirmed");
    expect(row?.[2]).toContain("`env: SITE_ENV`");
    expect(confirmed().added?.map((a) => [a.name, a.value, a.status])).toEqual([["env", "SITE_ENV", "new"]]);
  });
});

/* ── 4. Events: the plan's rows, the new events and the stamps ───────────── */

const ARCH_EVENTS = table(section(ARCHITECTURE, "### 8.2 "), [
  "Event",
  "Destinations",
  "Parameters (unchanged)",
  "Fired by",
  "Status",
]);
const DESTINATION_LABELS: Record<string, DestinationKey> = {
  "Vercel WA": "vercel-web-analytics",
  Ahrefs: "ahrefs-web-analytics",
  GA4: "ga4",
  Meta: "meta-pixel",
  "Meta server": "meta-capi",
  PostHog: "posthog-browser",
  "PostHog server": "posthog-server",
};

type Pair = { name: string; destination: DestinationKey; status: "existing" | "new"; params: string[] };

/** One architecture row as (name, destination) pairs; "a / b" pairs names with destination groups. */
function archPairs([event, destinations, params, , status]: string[]): Pair[] {
  /* "replay" is session recording, not an event name, so only code-font names count. */
  const names = withoutAsides(event)
    .split(" / ")
    .map((g) => (code(g).length > 0 ? code(g) : [plain(g)]));
  const groups = withoutAsides(destinations)
    .split(" / ")
    .map((g) => g.split(",").map((label) => plain(label)));
  if (names.length !== groups.length && groups.length !== 1) {
    throw new Error(`Cannot pair names and destinations in: ${event} | ${destinations}`);
  }
  const state = plain(status).startsWith("New") ? "new" : "existing";
  return names.flatMap((group, i) =>
    group.flatMap((name) =>
      (groups[groups.length === 1 ? 0 : i] ?? []).map((label) => {
        const destination = DESTINATION_LABELS[label];
        if (!destination) throw new Error(`Unknown destination label "${label}" in architecture §8.2`);
        return { name, destination, status: state, params: paramsOf(params).map((p) => p.name) } as Pair;
      }),
    ),
  );
}

describe("events.ts: architecture §8.2 and the new events", () => {
  const pairs = ARCH_EVENTS.flatMap(archPairs);

  it("registers every (event, destination) pair of architecture §8.2 with its status", () => {
    expect(pairs.length).toBeGreaterThan(0);
    for (const p of pairs) {
      const hit = EVENTS.find((e) => e.name === p.name && e.destinations.includes(p.destination));
      expect(hit, `${p.name} → ${p.destination} is not registered`).toBeDefined();
      expect(hit?.status, `${p.name} → ${p.destination} status`).toBe(p.status);
    }
  });

  it("the new events are exactly architecture's new rows, with their destinations and parameters", () => {
    const planned = pairs.filter((p) => p.status === "new");
    expect(planned.length).toBeGreaterThan(0);
    const registered = EVENTS.filter((e) => e.status === "new").flatMap((e) =>
      e.destinations.map((d) => `${d}:${e.name}`),
    );
    expect(sorted(registered)).toEqual(sorted(planned.map((p) => `${p.destination}:${p.name}`)));
    for (const p of planned) {
      expect(only(EVENTS, p.name).params, `${p.name} parameters`).toEqual(p.params);
    }
  });

  it("Meta never receives a new event (architecture §8.2)", () => {
    expect(section(ARCHITECTURE, "### 8.2 ")).toContain("No event fires Meta for the three new names");
    for (const e of EVENTS.filter((x) => x.status === "new")) {
      expect(e.destinations.filter((d) => d.startsWith("meta")), e.name).toEqual([]);
    }
  });

  it("PostHog stamps: env beta through before_send, and the internal flag, both new (D048 N3, B46)", () => {
    const s8 = section(ARCHITECTURE, "## 8. ");
    expect(s8).toContain('stamping `env: "beta"`');
    expect(s8).toContain("`register({ internal: true })`");
    expect(STAMPED_PROPERTIES.map((p) => [p.destination, p.name, p.value, p.status])).toEqual([
      ["posthog-browser", "env", "beta", "new"],
      ["posthog-browser", "internal", true, "new"],
    ]);
  });
});

/* ── 5. CTA values ───────────────────────────────────────────────────────── */

const INVENTORY_CTAS = table(section(INVENTORY, "## 6. "), ["cta value", "Where", "File"]);
const ARCH_CTAS = table(section(ARCHITECTURE, "### 8.3 "), ["Value", "Status", "Element", "Pages"]);

/** The Pages cell of architecture §8.3 as registry placements. */
function placements(cell: string): string[] {
  const text = plain(withoutAsides(cell));
  const out = code(withoutAsides(cell)).filter((t) => t.startsWith("/"));
  if (text.includes("articles with a close")) out.push("articles-with-close");
  if (/\b404\b/.test(text)) out.push("not-found");
  if (text.includes("every marketing page")) out.push("every-marketing-page");
  else if (text.includes("every page")) out.push("every-page");
  return out;
}

describe("cta.ts: the cta values", () => {
  const spec = (v: string) => CTAS[v as CtaValue];

  it("keeps the eight existing values byte for byte (inventory §6)", () => {
    const existing = INVENTORY_CTAS.map(([value]) => code(value)[0]);
    expect(existing).toHaveLength(8);
    expect(sorted(CTA_VALUES.filter((v) => CTAS[v].status === "existing"))).toEqual(sorted(existing));
  });

  it("holds exactly the values of architecture §8.3, no more and no fewer", () => {
    const planned = ARCH_CTAS.flatMap(([values]) => code(values));
    expect(sorted(CTA_VALUES)).toEqual(sorted(planned));
  });

  it.each(ARCH_CTAS)("architecture §8.3 %s: status, reserved, role and pages", (values, status, element, pages) => {
    const state = plain(status);
    const where = placements(pages);
    const union = new Set<string>();
    for (const v of code(values)) {
      const s = spec(v);
      expect(s, `${v} is missing from cta.ts`).toBeDefined();
      expect(s.status, `${v} status`).toBe(state.startsWith("New") ? "new" : "existing");
      expect(s.reserved, `${v} reserved`).toBe(state.includes("reserved"));
      const role = /WhatsApp bubble/.test(element) ? "chat" : state.includes("secondary") ? "secondary" : "preorder";
      expect(s.role, `${v} role`).toBe(role);
      for (const p of s.pages) {
        expect(where, `${v} is placed on ${p}, which architecture §8.3 does not list`).toContain(p);
        union.add(p);
      }
    }
    expect(sorted([...union]), `pages of ${plain(values)}`).toEqual(sorted(where));
  });

  it("reserves home-arc and compare, and never offers them as a CtaId", () => {
    expect(sorted(RESERVED_CTA_VALUES)).toEqual(["compare", "home-arc"]);
    const reserved = new Set<string>(RESERVED_CTA_VALUES);
    expect(sorted(CTA_IDS)).toEqual(sorted(CTA_VALUES.filter((v) => !reserved.has(v))));
    for (const v of RESERVED_CTA_VALUES) expect(CTAS[v].pages).toEqual([]);
  });

  it("whatsapp-float is the D050 bubble: new, every page", () => {
    expect(read("wiki/decisions/D050-whatsapp-chat-button.md")).toContain(
      'data-ph-capture-attribute-cta="whatsapp-float"',
    );
    expect(spec("whatsapp-float")).toMatchObject({ status: "new", reserved: false, role: "chat", pages: ["every-page"] });
  });

  it("spells every value in kebab-case (structure §2)", () => {
    for (const v of CTA_VALUES) expect(v).toMatch(/^[a-z]+(-[a-z]+)*$/);
  });
});

/* ── 6. CTA placements against the approved mockups ──────────────────────── */

/** The built mockup pages (partials inlined), by route (structure §5). */
const MOCKUP_PAGES: { route: string; file: string; marketing: boolean }[] = [
  { route: "/", file: "home", marketing: true },
  { route: "/products/kheelu", file: "meet-kheelu", marketing: true },
  { route: "/safety", file: "safety", marketing: true },
  { route: "/ai-toys-for-kids-in-india", file: "ai-toys-for-kids-in-india", marketing: true },
  { route: "/stories", file: "stories", marketing: true },
  {
    route: "/stories/learning-toys-for-a-three-year-old",
    file: "story-learning-toys-for-a-three-year-old",
    marketing: true,
  },
  {
    route: "/stories/what-to-look-for-in-a-safe-ai-toy",
    file: "story-what-to-look-for-in-a-safe-ai-toy",
    marketing: true,
  },
  { route: "/stories/talking-toys-and-late-talkers", file: "story-talking-toys-and-late-talkers", marketing: true },
  { route: "/team", file: "team", marketing: true },
  { route: "/setup", file: "setup", marketing: true },
  { route: "/contact", file: "contact", marketing: true },
  { route: "/privacy", file: "privacy", marketing: true },
  { route: "/terms", file: "terms", marketing: true },
  { route: "/refund", file: "refund", marketing: true },
  { route: "/shipping", file: "shipping", marketing: true },
  { route: "not-found", file: "404", marketing: true },
  { route: "store.kheelona.com/", file: "store", marketing: false },
  { route: "store.kheelona.com/thanks", file: "store-confirmation", marketing: false },
];

/** Articles whose close carries the CTA; the late-talkers article closes with no CTA (B5, structure §5). */
const ARTICLES_WITH_CLOSE = [
  "/stories/learning-toys-for-a-three-year-old",
  "/stories/what-to-look-for-in-a-safe-ai-toy",
];

describe("cta.ts: placements match the approved mockups", () => {
  it("places values only on routes that have an approved mockup", () => {
    const routes = new Set(MOCKUP_PAGES.map((p) => p.route));
    for (const v of CTA_VALUES) {
      for (const p of CTAS[v].pages.filter((x) => x.startsWith("/"))) {
        expect(routes.has(p), `${v} is placed on ${p}, which has no mockup page`).toBe(true);
      }
    }
  });

  it.each(MOCKUP_PAGES)("mockup $file carries exactly the values the registry places on $route", (page) => {
    const html = read(`mockup/${page.file}.html`);
    const found = [...new Set([...html.matchAll(/data-ph-capture-attribute-cta="([^"]+)"/g)].map((m) => m[1]))];
    const expected = CTA_VALUES.filter((v) => {
      const where: readonly string[] = CTAS[v].pages;
      return (
        where.includes(page.route) ||
        (page.marketing && where.includes("every-marketing-page")) ||
        (ARTICLES_WITH_CLOSE.includes(page.route) && where.includes("articles-with-close"))
      );
      /* "every-page" (the D050 bubble) is not in the mockups: D050 came after Gate A. */
    });
    expect(sorted(found)).toEqual(sorted(expected));
  });
});
