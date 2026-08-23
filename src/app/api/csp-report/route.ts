import { rateLimit, clientKey } from "@/lib/store/rate-limit";

/** Where Content-Security-Policy violations land (F-03).
 *
 *  The policy ships Report-Only first, and Report-Only with nowhere to report
 *  is a policy nobody reads: violations would appear only in the console of
 *  whichever parent hit them. So the reports come here and go into the platform
 *  log, which is the same place every other store failure is already read from.
 *
 *  THREE THINGS THIS ROUTE MUST NOT BECOME. A way to flood our logs: it is rate
 *  limited per caller, and the body is capped. A way to inject into them: only
 *  three known fields are logged, each stripped of control characters and cut
 *  short, never the raw body. And a way to leak a URL: the document URI is
 *  logged WITHOUT its query string, because an event link carries a signature
 *  in one (§8.25-g) and a log is not the place for it.
 *
 *  It touches no database and answers 204 either way. A report is telemetry, and
 *  telemetry must never be able to cost us anything. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Reports arrive in bursts when a policy is wrong, which is exactly when we
 *  want a few and not thousands. */
const REPORTS_PER_MINUTE = 30;
const MAX_BODY_CHARS = 8_000;

type Report = Record<string, unknown>;

export async function POST(request: Request) {
  if (!rateLimit(`csp-report:${clientKey(request)}`, REPORTS_PER_MINUTE).allowed) {
    return new Response(null, { status: 429 });
  }

  const raw = (await request.text().catch(() => "")).slice(0, MAX_BODY_CHARS);
  if (!raw) return new Response(null, { status: 204 });

  for (const report of parse(raw)) {
    console.warn(
      "[csp] blocked=%s directive=%s on=%s",
      field(report, ["blocked-uri", "blockedURL"]),
      field(report, ["effective-directive", "violated-directive", "effectiveDirective"]),
      field(report, ["document-uri", "documentURL"]),
    );
  }

  return new Response(null, { status: 204 });
}

/** Two wire formats exist: the old `{"csp-report": {...}}` object that
 *  report-uri sends, and the array of `{type, body}` envelopes that the
 *  Reporting API sends. Both, because we ask for both. */
export function parse(raw: string): Report[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed
        .map((entry) => (entry as { body?: Report }).body ?? (entry as Report))
        .filter((entry): entry is Report => Boolean(entry) && typeof entry === "object");
    }
    if (parsed && typeof parsed === "object") {
      const wrapped = (parsed as { "csp-report"?: Report })["csp-report"];
      return [wrapped ?? (parsed as Report)];
    }
  } catch {
    /* A malformed report is not worth a line in the log. */
  }
  return [];
}

/** One field, safe to print: no control characters, no query string, capped.
 *
 *  Filtered by code point rather than by a regex with escapes in it, so what
 *  this removes is legible: everything below space, plus DEL. A newline is how
 *  one attacker-controlled string becomes two log entries. A hyphen is just a
 *  URL, and must survive. */
export function field(report: Report, names: string[]): string {
  for (const name of names) {
    const value = report[name];
    if (typeof value === "string" && value) {
      const printable = [...value]
        .filter((character) => {
          const code = character.codePointAt(0) ?? 0;
          return code >= 0x20 && code !== 0x7f;
        })
        .join("");
      return printable.split("?")[0].slice(0, 200);
    }
  }
  return "-";
}
