# The dependency sweep: 38 Dependabot alerts to zero (2026-09-05)

**Commits:** `0e91ea8` (next) → `bd67455` (dev transitives) → `0ccf0da` (browserslist) →
`756aa6f` (a story that never parsed) → `97b5dab` (Storybook) → merge `33a69c9`;
then `2b214ff` → merge `1e886f3` for `launch-video/`.
**Rollback tag:** `pre-dependency-bump-2026-09-05` = `a03871f`.
**Status:** merged to `main`, pushed, **NOT deployed**. The founder takes it live manually.

---

## The headline number was two numbers

38 open alerts, 33 high. They span **two npm projects**:

| Manifest | Alerts | Reaches a visitor? |
|---|---|---|
| `package-lock.json` (the website) | 18 (15 high, 3 medium) | yes |
| `launch-video/package-lock.json` | 20 (18 high, 1 medium, 1 low) | **no** |

`launch-video/` is the standalone Remotion project that rendered the "Two friends" film. It is
`private: true`, excluded from the root `tsconfig.json`, had no `node_modules` in this checkout, and
is no part of `next build`. Its 20 alerts were never the website's.

**Both manifests now read `found 0 vulnerabilities`.**

---

## The decision that had already been made for us

`security-review.md:218` recorded a founder decision in August: patch-only inside Next 16.2.x,
explicitly **not** 16.3.x, because *"a minor bump on a live payment site is a separate decision with
its own regression risk."*

**16.2.12 is the last 16.2.x release ever published.** The policy had no path left.

Worth stating precisely, because it is the opposite of alarming: **`next` carries no advisory of its
own.** `npm audit` shows `next.via === ["postcss","sharp"]` — it was flagged for what it bundles,
which is exactly the residual risk commit `120271f` accepted in August with the note that both would
*"clear on their own when we next take a minor version."* That note came due. The sharp advisory's
own wording is *"those processing **untrusted input** are affected"*, and this app configures no
`remotePatterns`, so only our own files in `public/` ever reach the optimizer.

Founder approved the minor on 2026-09-05.

---

## Zero overrides, and that was a decision

`npm install next@16.3.4 eslint-config-next@16.3.4 --save-exact` cleared four advisories in one
command: `postcss` 8.4.31 removed and 8.5.16 → 8.5.23, `nanoid` → 3.3.18, `sharp` → 0.35.4 with
libvips 1.2.4 → 1.3.3.

An override would have been **actively wrong**, not merely inelegant. `next@16.2.12` pinned `postcss`
at *exactly* `8.4.31`, and the patched `sharp` line `>=0.35.0` does not satisfy Next's declared
`^0.34.5`. Overriding either would have shipped a combination the framework's own maintainers never
tested, on the CSS pipeline and the image optimizer of a site that takes money. 16.3.4 declares both
patched versions itself.

The dev-chain stragglers needed no override either: every one was already satisfiable inside the
range its parent declares. The lockfile simply had not been refreshed.

`image-size` was the one package where an override was **impossible** — its vulnerable range is
literally `*`, so no patched version exists at any number. Storybook 10.6.0 absorbed
`vite-plugin-storybook-nextjs` and swapped it for `probe-image-size`. That upgrade was not one option
among several; it was the only route.

---

## Two traps worth carrying forward

**`--save-exact` is mandatory in this repo.** `npm config get save-prefix` is `^`, `save-exact` is
`false`, and there is no `.npmrc`. So a plain `npm install next@16.3.4` writes `"^16.3.4"` and
silently converts a deliberate exact pin into a range. A test now asserts both framework pins are
exact strings.

**`npm update --package-lock-only` is a silent no-op.** Verified on npm 11.6.2: the same command
without the flag reports 11 changes; with it, "up to date in 467ms". A project with no
`node_modules` — which `launch-video/` was — cannot be fixed by the obvious lockfile-only command.

---

## The floor test needed restructuring, not new numbers

`test/dependency-floor.test.ts` could only floor a package named in `package.json`, and read only the
hoisted `node_modules/<name>`. Both limits mattered here:

- Six of the eight packages are transitive and could not be floored at all.
- It would have read `node_modules/postcss@8.5.16` and **never seen
  `node_modules/next/node_modules/postcss@8.4.31`** — the copy that was actually vulnerable and the
  entire reason for the bump. *A floor that checks one of two copies is a floor that lies.*

`TRANSITIVE_FLOORS` now walks `package-lock.json` (committed, needs no install, and the same artefact
Dependabot reads) and asserts **every** matching path. Two mechanisms are new:

- **Per-major floors.** `brace-expansion` was patched separately on two lines, and a flat floor is
  arithmetically impossible: `atLeast("1.1.18", "5.0.9")` is false, so flooring at 5.0.9 fails the
  legitimate 1.x copy while flooring at 1.1.18 waves a vulnerable 5.0.7 through.
- **A floor can be an absence.** `image-size` is asserted *absent*, because "no version of this is
  ever safe" is not a number.

Written first and proven red: 13 assertions failed on the un-bumped tree before anything was
installed.

---

## A latent bug the upgrade revealed rather than caused

`PageHero.stories.tsx` wrapped a note as a JSX comment in expression position:

```jsx
media: (
  { /* Real aspect: … */ }
  <img … />
),
```

That form is only valid as a JSX **child**. In expression position it parses as an empty object
literal followed by an element. TypeScript reports fourteen syntax errors on the file.

**Nothing in this repo reads story files.** `tsconfig.json` excludes them, so neither `tsc --noEmit`
nor `next build` touches one; Vitest only loads the stories a test imports; and Storybook 10.5.0's
indexer tolerated it. 10.6.0 made it a hard build failure.

`test/stories-parse.test.ts` now parses all 68 with the TypeScript compiler already in
devDependencies, and asserts it found the files first so a broken glob cannot make it pass vacuously.

*A story is the component catalog this repo requires for every component (COMPONENT_GUIDELINES §2).
A catalog entry that cannot parse is not in the catalog.*

---

## Verification

The suite is the **weakest** evidence here and it is worth saying why: `test/setup.ts` mocks
`next/link`, `next/image`, `next/navigation`, `next/dynamic`, `motion/react` and the whole 3D stack.
It could not have failed from a framework bump no matter what broke. So the gate is built on
before/after diffs of what the build emits and what the server answers.

| Gate | Before | After |
|---|---|---|
| Vitest | 1002 pass, 107 files | **1084 pass, 108 files** |
| `tsc --noEmit` | 0 | **0** |
| `npm run build` | 0 | **0** |
| `qa:sweep` | clean 34/34, 79 accepted | **clean 34/34, 79 accepted** |
| `qa:payment` | clean | **clean, zero CSP violations** |
| Lighthouse home | 99/96/96/100 | **100/96/96/100** |
| Lighthouse product | 99/96/96/100 | **100/96/96/100** |
| Lighthouse store | 90/96/96/66 | **99/96/96/66** |
| npm audit, site | 11 groups | **0** |
| npm audit, launch-video | 8 groups | **0** |

**Diffs that are the real gate:**

- Route surface identical: 21 redirects, 1 headers entry, rewrites unchanged.
- Runtime surface **identical to the pre-everything baseline** — the whole proxy matrix, all 18
  redirects with destinations, the hero's 8-width srcset and `imageSizes`, `crossorigin` on all three
  font preloads.
- Generated CSS **byte-identical** at 60164 bytes across every commit, which also covers
  autoprefixing when `caniuse-lite` moved.
- Emitted bundle byte-identical across commits 2, 3 and 4 — the proof that the dev-chain lifts and
  Storybook reached nothing that ships.
- Production dependency tree identical across the Storybook bump.
- The LCP element is still the plush `<img>` on home and product.
- **The signed-claim path re-driven attribute by attribute**: 303, `Location: /thanks` with the query
  stripped, `Set-Cookie: kh_order=…; Path=/thanks; Max-Age=7200; Secure; HttpOnly; SameSite=lax`,
  `cache-control: private, no-store`. This is the highest-consequence path in the app and it has no
  test behind it — `store-host.test.ts` covers the pure function, not the adapter.

The emitted-head diff found exactly one change, investigated and **not a regression**: the store's
404 page lost a `<link rel=preload as=style>`. See below.

---

## Two findings that are not this change's fault

**1. The store's 404 page has never been styled.** `404-store-path.html` carries **0** stylesheet
links, before and after — while the marketing 404 carries 1. The bump merely removed a preload for a
stylesheet the page never applied. Pre-existing; logged for the founder. Not fixed here because
nothing in `src/` may move in a dependency commit, or the revert stops being atomic.

**2. The Kheelu naming collision is user-visible, and an earlier note in this repo said it was not.**
`src/features/home/components/Hero.tsx:22` has the mascot say **"Hi, I'm Kheelu. Come in, I'll show
you around."** — a Foxy-Deer introducing itself as Kheelu, on the same screen as a cream rabbit
labelled Kheelu. The 2026-09-05 rename record claimed the mascot's name reached users "only through
two `aria-label`s". That was wrong, and the correction matters because the art-reconciliation item
was rated non-urgent on the strength of it. Founder item: say lines are founder-approved copy.

---

## Deliberately not done

The CSP enforce flip (separate founder gate, and unlike this it cannot be undone by promoting a
previous deployment); any major the ranges correctly exclude (`eslint` 10, `vitest` 5, `jsdom` 30,
`typescript` 7 — a Vitest major would change the measuring instrument in the same commit as the
thing measured); a bare `npm install`, which would have moved **23** packages including
`@supabase/supabase-js` on the payment path and `lucide-react` across 17 minors; and any real-money
payment test.

A `.github/dependabot.yml` would not have helped: it configures version-update PRs, not security
alerts, which come from the dependency graph and cannot be filtered by config.
