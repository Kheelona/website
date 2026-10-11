---
name: project-kheelona-com-build-prompt
description: "Live state of kheelona.com — the Kheelu rename, the agency audit, the dependency sweep, and the verification habits that keep catching what green tests miss"
metadata: 
  node_type: memory
  type: project
  originSessionId: c18a33df-85f4-4428-ba52-64ddb36817ff
  modified: 2026-09-05T13:55:34.166Z
---

**🟢 2026-09-06: EVERY 404 RENDERS ON THE SERVER NOW (§8.34 a–h, checkpoint
`blank-404s-2026-09-06.md`, rollback tag `pre-blank-404-fix-2026-09-06` = `95ad817`). DEPLOYED AND
VERIFIED ON PRODUCTION; `main` at `5e7d2a1`.** 1112 tests.

**A thrown `notFound()` NEVER server-renders in Next 16.** It takes the error path
(`getErrorRSCPayload`) and answers with an empty `<html id="__next_error__">` — no stylesheet, no
text, no `lang`. Four routes did this in production, including `kheelona.com/stories/<unknown-slug>`
and `/thanks` for someone who had **paid us**. A routing-level 404 renders fine, which is why
`kheelona.com/typo` was always OK. 16.3.4 is latest; no upstream fix. **So: on a route reachable by
mistyping a URL, do not throw** — `dynamicParams = false`, or render the page and let the proxy carry
the status via **`NextResponse.rewrite(url, { status: 404 })`**, which works and is the only way to
get a 404 that both renders and carries the right code.

`STORE_PAGES` in `lib/store/host.ts` now lists the store's real pages; adding a store page means
adding it there, and the tightening direction 404s a live checkout page. Guarded by a test that
**walks `src/app/store/`** rather than restating the list. `/404-store-path` is deleted.
`npm run utm` builds campaign links or refuses; writing its guard revealed that `create-order`
**already** records `utm_` values onto the order row.

**🔴 TWO THINGS THE LOCAL MACHINE CANNOT TELL YOU (§8.34-f, §8.34-g), both learned the hard way on
2026-09-06.** (1) **`NextResponse.rewrite(url, {status:404})` honours the destination under `next
start` and does NOT on Vercel** — the edge sees the 4xx, discards the destination and serves its own
`/404`, which here is the MARKETING 404. It shipped that way for one deploy. Tell: `x-matched-path:
/404`. So the store's dead ends answer **200** with the store's own chrome; the host is noindex and
not in the sitemap, so nothing reads the status. `STORE_PAGES` was added for that status and removed
with it. **`next start` is not the deployment target, and this repo cannot deploy.**
(2) **Every measurement tag is host-gated, so a LOCAL Lighthouse score is a score for a page missing
three of its four tags.** Production reads **BP 74 against a 90 gate**; local reads 96 on the same
build. Control: production with facebook blocked = 96, +googletagmanager blocked = 96. **The Meta
Pixel costs 22 points, GA4 zero**; ~19 of those are `third-party-cookies` (its `fr` cookie), which no
configuration passes — so **BP cannot reach 90 while the pixel runs.** Founder's call, like §8.29.
**And: Lighthouse's `errors-in-console` audit reads CSP Report-Only violations off the console** —
far faster than the Vercel log. It found that enforcing the CSP today would BREAK the Meta Pixel
(`www.facebook.com` missing from `frame-src` and `form-action`) and part of GA4
(`www.googletagmanager.com` missing from `img-src`).

**⚠ THE REPO IS PUBLIC AND THAT IS NOW AN OPEN FOUNDER QUESTION.** I pushed the founder's untracked
`pitch-deck/` (197 files, 103MB, pre-seed investor deck + financial model) to it with `git add -A`;
rewritten and force-pushed inside ~10 min, 0 forks/0 stars, no credentials, files intact on disk,
now gitignored. **NEVER `git add -A` here** — see [[feedback-never-git-add-all]]. Going private stops
future access but cannot undo a copy already taken. The stronger standalone argument: `security-review.md`
is a live findings register for a site that takes payments.

**GSC "Review snippets: 4 valid" is ANSWERED**: all four are `/contact`, item "Lumi - AI-Powered
Talking Toy", last detected 27 Jul 2026 — the day before this site went live. Legacy Wix, decaying
15→12→7→4. Nothing to fix.

**Third round running where the VERIFICATION TOOL was the broken thing:** the claim-path probe
returned 200 and I suspected my own proxy change; the probe had minted the full 43-char HMAC while
`sign()` truncates to 16. Suspect the probe before the code.


**🟢 2026-09-05: TWO ROUNDS SHIPPED, DEPLOYED, AND VERIFIED THREE WAYS.** The product is **Kheelu**
(was Lumi) at `/products/kheelu`; `/products/lumi` 308s there permanently. `npm audit` reads **0 on
both manifests**. 1084 tests. Records: `docs/checkpoints/agency-audit-2026-09-05.md` +
`dependency-sweep-2026-09-05.md`; laws §8.32 + §8.33; rollback tags
`pre-kheelu-rename-2026-09-05` and `pre-dependency-bump-2026-09-05`.

**THE HABIT THAT MATTERED MORE THAN ANY FIX.** Five defects shipped past a fully green suite this
session, and every one was found by looking at a real artefact — served HTML, a crawl report, a
screenshot, a build log:

- `preorder-copy.test.ts` banned one *phrasing* and let **eight** live instances of "a pre-order is
  free" through, including inside FAQPage JSON-LD.
- `metadata-lengths.test.ts` modelled Next's title template wrongly (a **route group IS a metadata
  segment**) and reported green while production served `… · Kheelona · Kheelona` for months.
- `Organization` + `WebSite` were emitted **twice per page**; nothing counted them.
- **`og:image` was missing on all 31 pages** — Next merges metadata *shallowly*, so `pageMeta`'s
  `openGraph: {url}` deleted the layout's. Every WhatsApp/Facebook/LinkedIn share rendered a blank
  card. Invisible to tests, tsc, axe, voice lint *and* Lighthouse.
- One story had **fourteen syntax errors** because nothing in the repo parses `*.stories.tsx`.

**So: a green suite is the null result for anything framework-shaped.** `test/setup.ts` mocks every
Next surface. The gate is before/after diffs of what the build *emits* and what the server *answers*
— route manifest, normalized head markup, generated CSS, `.next/static` content-hash digest, a curl
matrix over `src/proxy.ts` (which has **no adapter test** despite carrying the 303 + HttpOnly cookie
on the paid-order path), and `qa:payment`. Capture the baseline BEFORE touching anything.

**DEPENDENCY TRAPS (§8.33).** `--save-exact` is mandatory — `save-prefix` is `^`, there is no
`.npmrc`, so a plain `npm install next@X` silently destroys the exact pin. A bare `npm install`
would move **23** packages including `@supabase/supabase-js` on the payment path. `npm update
--package-lock-only` is a **silent no-op**. Zero `overrides`, deliberately: `next@16.2.12` pinned
postcss at *exactly* 8.4.31, so an override would ship an untested combination. The floor test now
walks `package-lock.json` and checks **every copy** — the old one couldn't see
`node_modules/next/node_modules/postcss@8.4.31`.

**VERIFICATION TOOLS ARE CODE AND GET THE SAME SCEPTICISM.** My capture script double-counted JSON-LD
because grepping HTML also searches the RSC payload (§8.25-bb). An `esbuild --loader=tsx` invocation
(stdin-only syntax) reported all 68 stories broken when the real answer was one. And a fix for a
comment-syntax bug itself contained one (`**/` + `*.stories.tsx` closes a block comment).

**AGENTS CAN FABRICATE.** An adversarial QA review invented `GHSA-2xp9-vwfh-vxw4` "CVSS 9.5 RCE" —
the ID 404s. Its *method* was sound and worth keeping; its facts were not. Spot-check cited IDs.

**AHREFS + GSC, 2026-09-05.** Ahrefs fresh crawl: OG incomplete 31→0, schema error gone, warnings
45→13, Health 100. GSC: sitemap Success 31 pages; `/products/kheelu` **indexed**, and Google's own
parse shows `name: Kheelu by Kheelona` with `@id` still `/products/lumi#product` — third-party proof
that keeping the `@id` stable across a rename works. `/products/lumi` not yet re-crawled (31 Aug), so
the 308 isn't registered; indexing requested. **Ahrefs Web Analytics ≠ Site Audit** — the CSV export
has no crawl/keyword/backlink data; Site Audit lives in the dashboard.

**SCRIPTED PRODUCTION CHECKS WORK AGAIN** — the 2026-09-01 Attack Challenge Mode 403 on `/api/health`
is gone. Plain curl with a browser UA returns real JSON. That is how everything above was verified.

**AI SEARCH IS ~47% OF SEARCH TRAFFIC** (ChatGPT 66–74 visitors vs Google's 75, 394s duration). And
a quarter to a third of "visitors" are bots — Mountain View was the #1 city, ahead of Bengaluru,
which is what `/privacy`'s odd traffic was. Segment before concluding.

**OPEN, ALL FOUNDER'S:** the mascot says "Hi, I'm Kheelu" on the home page beside a differently-drawn
product also called Kheelu — **PARKED by founder decision**, and it is ONE stale line, not an art
problem (13 other places already treat them as separate). The store's 404 has never carried a
stylesheet. D08 specs. UTM adoption before ad spend (`docs/utm-conventions.md`). The `http://www`
two-hop chain in Vercel. And 4 unexplained "Review snippets" in GSC on a site that publishes none.

**Vercel is the founder's** — never the CLI. Deleting the `demo-website` **branch did not take the
preview host down**; the Vercel *project* had to go. A preview host is not retired by anything in
this repo.
