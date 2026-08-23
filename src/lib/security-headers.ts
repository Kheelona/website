/** The response headers this site sends, in one place (F-03, security-review.md).
 *
 *  WHY THIS EXISTS. Until 2026-08-23 both hosts sent exactly one security
 *  header, and that one came from the platform: HSTS. No CSP, nothing about
 *  framing, nothing about sniffing or referrers. On a marketing site that is
 *  untidy. On a page where a parent types their name, their number and their
 *  email and then pays, it is the missing control: nothing said which scripts
 *  were allowed to run beside that form, and nothing said where a script was
 *  allowed to send what it read. Card skimming is exactly that shape of attack.
 *
 *  ONE POLICY FOR BOTH HOSTS, on purpose. Host-matched headers are possible in
 *  next.config, but "the checkout got the marketing policy" is a failure mode
 *  worth designing out entirely. The cost is that the marketing pages are also
 *  permitted to load Razorpay, which they never do. That is a cost of nothing.
 *
 *  THE HONEST LIMITATION: `script-src` carries 'unsafe-inline'. Next's own
 *  inline bootstrap scripts differ per page, so the alternatives are a per
 *  request nonce or hashes, and a nonce forces every page into dynamic
 *  rendering (documented in next/dist/docs/01-app/02-guides/content-security-policy.md).
 *  This site has 31 statically prerendered pages and an LCP law that the hero
 *  image owns the first paint, so that is a real trade rather than a shrug. What
 *  survives the compromise is most of what matters against skimming: an injected
 *  `<script src=…>` from an unknown origin is still refused, and `connect-src`,
 *  `img-src` and `form-action` mean a script that does somehow run has nowhere
 *  to send what it steals. Tightening further means moving the measurement tags
 *  out of the root layout so the store alone can take a nonce, which is a
 *  structural change and a separate decision.
 *
 *  ROLLED OUT IN TWO STEPS (founder's call): Report-Only first, so real traffic
 *  tells us what the policy would have broken, then enforcing. A wrong CSP on a
 *  live checkout looks to a parent exactly like a broken checkout. */

/** Where violation reports go. A route in this app, so no third party learns
 *  our traffic and no new service has to be paid for. */
export const CSP_REPORT_PATH = "/api/csp-report";

/** The name used by `report-to` and by the Reporting-Endpoints header. */
export const CSP_REPORT_GROUP = "csp";

/** PHASE. "report" observes and blocks nothing; "enforce" blocks.
 *
 *  Currently "report" (2026-08-23). Flipping this to "enforce" is a deliberate,
 *  separate deploy, made after the reports from real traffic have been read.
 *  test/security-headers.test.ts asserts which phase is live so the change can
 *  never be an accident. */
export const CSP_PHASE: "report" | "enforce" = "report";

/** Every origin this site legitimately talks to, grouped by what it is for, so
 *  the reason each one is here survives the next edit. */
const SOURCES = {
  /** Ahrefs Web Analytics: a script in the head, and its own collector. */
  ahrefs: "https://analytics.ahrefs.com",
  /** GA4 via gtag. The tag loads from googletagmanager and reports to
   *  google-analytics, including regional collectors. */
  googleTag: "https://www.googletagmanager.com",
  googleCollect: [
    "https://www.google-analytics.com",
    "https://*.analytics.google.com",
    "https://*.google-analytics.com",
  ],
  /** Vercel Web Analytics posts to a same-origin obfuscated path, so 'self'
   *  covers it. This is its documented fallback host, kept because a blocked
   *  beacon would be silent. */
  vercel: "https://vitals.vercel-insights.com",
  /** Razorpay Checkout: the script, its frames, its own telemetry, and the
   *  short-domain it uses for some payment methods. Wildcarded on purpose. A
   *  payment provider's own subdomains change without telling us, and the
   *  point of the directive is to exclude origins that are NOT theirs. */
  razorpay: ["https://*.razorpay.com", "https://*.rzp.io"],
  /** Google Pay renders inside Razorpay's flow on Android. */
  googlePay: "https://pay.google.com",
} as const;

function directive(name: string, ...values: (string | readonly string[])[]): string {
  return `${name} ${values.flat().join(" ")}`;
}

/** The policy string. `dev` adds the two allowances React needs in development
 *  and must never be true in a production build. */
export function contentSecurityPolicy(dev = false): string {
  return [
    directive("default-src", "'self'"),
    directive("base-uri", "'self'"),
    /* No plugins, ever. The cheapest directive in the list. */
    directive("object-src", "'none'"),
    /* Nothing may frame this site. A checkout inside somebody else's iframe is
       a phishing overlay waiting to happen, and no page here needs embedding. */
    directive("frame-ancestors", "'none'"),
    /* Razorpay is allowed a form target because some bank and UPI flows post
       out of the checkout. Everything else must post back to us. */
    directive("form-action", "'self'", SOURCES.razorpay),
    directive(
      "script-src",
      "'self'",
      /* See the header comment: this is the known compromise. */
      "'unsafe-inline'",
      /* WASM compilation, for the 3D stage's decoders. Narrow: WebAssembly
         cannot reach the DOM, so this is not 'unsafe-eval' by another name. */
      "'wasm-unsafe-eval'",
      dev ? "'unsafe-eval'" : [],
      SOURCES.ahrefs,
      SOURCES.googleTag,
      SOURCES.razorpay,
    ),
    /* next/font emits an inline @font-face block, and React inlines styles. */
    directive("style-src", "'self'", "'unsafe-inline'"),
    directive("img-src", "'self'", "data:", "blob:", SOURCES.googleCollect, SOURCES.razorpay),
    directive("font-src", "'self'", "data:"),
    directive("media-src", "'self'"),
    directive("worker-src", "'self'", "blob:"),
    directive("frame-src", "'self'", SOURCES.razorpay, SOURCES.googlePay),
    directive(
      "connect-src",
      "'self'",
      SOURCES.ahrefs,
      SOURCES.googleTag,
      SOURCES.googleCollect,
      SOURCES.vercel,
      SOURCES.razorpay,
    ),
    directive("manifest-src", "'self'"),
    "upgrade-insecure-requests",
    /* Both spellings: report-uri is deprecated and is the only one Safari and
       older Chrome understand, report-to is the current one. */
    `report-uri ${CSP_REPORT_PATH}`,
    `report-to ${CSP_REPORT_GROUP}`,
  ].join("; ");
}

export type HeaderPair = { key: string; value: string };

/** HSTS, with subdomains (F-09, founder-approved 2026-08-23).
 *
 *  The platform already sent `max-age=63072000` on its own. What this adds is
 *  `includeSubDomains`, which is the half that matters: without it, a subdomain
 *  served over plain HTTP is a place to put a page that looks like ours and
 *  reads cookies scoped to the parent domain.
 *
 *  IT WAS CHECKED BEFORE IT WAS ENABLED, and the check found something. This
 *  domain has four subdomains, two of them nothing to do with this repo, and
 *  `admin.kheelona.com` was serving a Firebase default certificate that did not
 *  cover it, so it was reachable only by clicking through a TLS warning (F-15).
 *  Since HSTS makes a certificate warning impossible to click through, turning
 *  this on then would have hard-blocked that panel for two years per browser.
 *  It was fixed first. All five hosts now present certificates that validate:
 *  the apex, www, store, api and admin.
 *
 *  `preload` is deliberately NOT here. That means submission to a list baked
 *  into browser binaries, and coming back off it takes months. It needs its own
 *  decision, not a ride along with this one. */
const HSTS = "max-age=63072000; includeSubDomains";

/** Everything sent on every HTML response. */
export function securityHeaders(dev = false): HeaderPair[] {
  return [
    { key: "Strict-Transport-Security", value: HSTS },
    {
      key: CSP_PHASE === "enforce" ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only",
      value: contentSecurityPolicy(dev),
    },
    {
      key: "Reporting-Endpoints",
      value: `${CSP_REPORT_GROUP}="${CSP_REPORT_PATH}"`,
    },
    /* Belt to the CSP's braces: frame-ancestors is the modern control, and this
       is the one every browser has understood for fifteen years. */
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    /* The browser default on modern engines, stated explicitly so it does not
       depend on a default: cross-origin requests carry the origin and never the
       path. Store URLs are the reason to care. */
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    /* Three capabilities this site has no use for. Deliberately NOT restricting
       `payment`, which Razorpay's flow can use on Android. */
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  ];
}
