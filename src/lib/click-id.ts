/** Meta's ad click id, kept so a blocked pixel cannot lose it (§8.41, 2026-09-20).
 *
 *  WHY. `fbc` is the click id Meta uses to tie a conversion back to the
 *  advertisement that caused it, and the Conversions API can only send it if
 *  Meta's own pixel has already set the `_fbc` cookie. A browser that blocks the
 *  pixel loses it entirely, and Events Manager reports exactly that: "your
 *  server is sending low coverage of fbc". Rebuilding it from the `fbclid` on
 *  the landing URL costs nothing and needs no script to have run first.
 *
 *  🔴 WHAT IS STORED IS THE RAW `fbclid`, NEVER A BUILT `fbc`. This is the main
 *  risk control of the round, and it is structural rather than a convention
 *  somebody has to remember. Storing a rebuilt value would leave two things in
 *  the codebase that both look like an `fbc`, plus a rule about which one wins —
 *  and rules get forgotten at the next edit. Storing the raw input means there
 *  is exactly ONE place that builds an `fbc` (`buildFbc` below), and
 *  `readFbAttrib` calls it only when Meta's own cookie is absent. There is no
 *  competing value to pick wrongly, because ours is not an `fbc` until the
 *  moment one is needed. The cookie is named for what it holds, not for what it
 *  becomes, for the same reason.
 *
 *  A NOTE ON WHAT THIS IS NOT FIXING. `_fbc` was suspected of being a cross-host
 *  casualty like the UTM bug of the same day — set on the apex, unreadable on
 *  the store host where `create-order` runs. Measured in a real browser on
 *  production instead of assumed: it is scoped to `.kheelona.com` and IS
 *  readable there. So this adds resilience; it does not repair a routing bug. */

export const CLICK_ID_COOKIE = "kh_fbclid";

/** The raw click, as it arrived. */
export type StoredClick = { id: string; ts: number };

/** Meta's own alphabet for an fbclid, capped so a query string cannot become an
 *  oversized cookie. Anything outside this is refused rather than trimmed: a
 *  truncated click id is not a smaller click id, it is a wrong one. */
const CLICK_ID = /^[A-Za-z0-9_-]{1,512}$/;

/** The second component of an `fbc`, and the easiest thing here to get quietly
 *  wrong. It is the SUBDOMAIN INDEX of the host the cookie belongs to: 0 would
 *  mean `com`, 1 means `kheelona.com`, 2 would mean `www.kheelona.com`. Ours is
 *  set on `.kheelona.com`, and a production sample read straight off Meta's own
 *  cookie was `fb.1.1789902131589.…`. A wrong index is not an error anywhere —
 *  it is simply a click id Meta can never match. */
const SUBDOMAIN_INDEX = 1;

function validId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim();
  return CLICK_ID.test(id) ? id : null;
}

/** The click a landing URL carries, or null when there is none to keep. */
export function clickIdFromUrl(url: URL, now: number): StoredClick | null {
  const id = validId(url.searchParams.get("fbclid"));
  return id ? { id, ts: now } : null;
}

/** 🔴 THE ONE PLACE AN `fbc` IS EVER BUILT.
 *
 *  Returns null rather than a best effort, because **a missing `fbc` is strictly
 *  safer than a malformed one**: with no value Meta falls back to its other
 *  signals, while a broken value is accepted with a 200 and silently matches
 *  nothing at all. There is no error anywhere in that second case, which is what
 *  makes it worth refusing outright. */
export function buildFbc(click: StoredClick): string | null {
  const id = validId(click.id);
  if (!id) return null;
  if (!Number.isInteger(click.ts) || click.ts <= 0) return null;
  return `fb.${SUBDOMAIN_INDEX}.${click.ts}.${id}`;
}

/** The click remembered at landing, read off the request.
 *
 *  A cookie is client-suppliable, so it is validated exactly as hard as the URL
 *  was: it must never be able to put a broken id into a Meta payload. */
export function readClickIdCookie(request: Request): StoredClick | null {
  const header = request.headers.get("cookie");
  if (!header) return null;

  const raw = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CLICK_ID_COOKIE}=`))
    ?.slice(CLICK_ID_COOKIE.length + 1);
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(decodeURIComponent(raw));
  } catch {
    /* A truncated or stale cookie is an ordinary thing, not an error. It costs
       the attribution, never the order. */
    return null;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

  const source = parsed as Record<string, unknown>;
  const id = validId(source.id);
  const ts = source.ts;
  if (!id || typeof ts !== "number" || !Number.isInteger(ts) || ts <= 0) return null;
  return { id, ts };
}

/** Does a value still have the shape of an `fbc`? (§8.41)
 *
 *  THE ONE RISK NO TEST CAN PREVENT is Meta changing the format, after which our
 *  builder would keep producing values that are accepted with a 200 and match
 *  nobody, forever, in silence. `readFbAttrib` checks Meta's own `_fbc` against
 *  this and logs once when it stops matching, so that day arrives as a line
 *  naming the cause rather than as an unexplained fall in match quality.
 *
 *  🔴 SHAPE, NOT VALUE, and the distinction is the whole design. Two different
 *  `fbc` VALUES in one request are perfectly legitimate: a visitor who clicks a
 *  second advertisement gets a fresh `_fbc` from Meta while we still hold the
 *  first click. Comparing values would fire constantly and be ignored inside a
 *  week, which is worse than not logging at all.
 *
 *  The subdomain index is deliberately left loose — `www.kheelona.com` would
 *  legitimately produce a 2 — because only the FORMAT is being watched here. */
const FBC_SHAPE = /^fb\.\d+\.\d+\..+$/;

export function looksLikeFbc(value: string): boolean {
  return FBC_SHAPE.test(value);
}
