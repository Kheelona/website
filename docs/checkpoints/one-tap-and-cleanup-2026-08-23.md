# Checkpoint: one tap to the store, a blank for the age, and a repo cleanup (2026-08-23)

Three founder items on a live commercial site, all shipped and verified. Rollback point for this
round: `bb0b569`'s parent, `fac50d8`. The store's own rollback tag is unchanged:
**`v6-live-2026-08-22` = `0fb02fe`**, the last pre-store commit.

---

## 1. Every pre-order CTA reaches the store in one tap

**What changed.** `PREORDER_HREF` moved from `"#reserve"` to the absolute store URL. The navbar, the
hero, Compare, the Kheelu mobile dock, the 404 and the finale now all go to the same place in one tap.

**Why this is worth a checkpoint.** It inverts §8.25-b, a law written the day before. That law said the
finale is the ONLY outbound link and every other CTA anchors to it first, so a parent always reads the
price, the refund promise and the ship date before a payment form can open. That reason was sound. The
question was not "is the founder right that two taps is one too many" (they are, and it is their call)
but **"does anything a parent needs stop being said?"**

It does not, and the evidence is a render rather than an argument. The store page's own opening
paragraph, above its first field on a 390px phone:

> A screen-free talking friend for ages 2 to 5. ₹499 holds one at ₹4,999 and holds your place in the
> queue. Ships 1 October 2026, and refundable in full until it does.

Price, ship date, refund promise. `OrderSummary` then restates all three in full, with the balance and
the GST line, below the button. So the forced stop at the finale was buying a parent nothing and
costing completions on the one action this site exists for.

**The consequence is the part to remember.** The store page is now the first thing many parents read
about the offer, not the second. Weakening that paragraph is a conversion change from here, not a
wording change.

**What stayed.** `id="reserve"` is still on every page, because it is layout and not a route: the
mobile guide hides its dock while that section is on screen, and `LegalDoc` appends the finale to every
legal page. `test/preorder-cta.test.ts` fails if any `href` points at the anchor again.

## 2. The child's age is a blank, not a picker

A six-option dropdown ("Under 2" through "6 or older") had no honest answer for a child who is two and
a half, or for a parent buying for two children, and it cost a tap and a scroll on a phone for a fact
we read only when planning production. Validation is now as permissive as the email check already was:
"2.5", "nearly 4", "2 and 5" and "18 months" all pass, each named in a test. `CHILD_AGE_MAX` is
declared once and the route handler truncates at the same number, so the server cannot quietly edit an
answer the form accepted.

**What it dragged in, which is the more interesting half.** Free text is text we render into email
HTML, and `lib/email/templates.ts` escaped nothing. The audience is one parent plus us, so this is not
much of a scripting worry; it is a real correctness one, and it would have shown up on a customer
rather than in a test: a bare `&` in "Sneha & Raj" is invalid HTML that some clients mangle, and one
`<` swallows the rest of a receipt. Both emails now escape every customer-typed value on the way into
HTML and leave the plain-text half exactly as typed. Found by asking what free text implies, not by a
failure.

## 3. The cleanup

### Deleted

| What | Size | Why it was safe |
| --- | --- | --- |
| 44 vendored agent-skill files (`.agents/skills/`, `.claude/skills/`) | 296K | **The repo's own `.gitignore` has said since 2026-07-28 that these do not belong in git.** They were tracked before that rule existed, and a `.gitignore` entry does not untrack. `git rm --cached` only: they are still on disk and still working, and `skills-lock.json` carries a source and hash for each. |
| `public/product/lumi-{blue,green,pink}-2-old.png` | 3.8M | Superseded renders, "-old" in the name, zero references anywhere in the tree. Shipped in every deploy. |
| `public/product/lumi-{blue,green,pink}.jpeg` | 220K | The legacy Wix-era product photos the 2026-07 renders replaced. |
| `Design/product-images/generated-2026-07/og-2026-07-old.png` | — | Same, for the old OG image. |
| `docs/wireframes/2026-07/` | 3.7M, 24 files | The three hi-fi drafts (A First Light / B Kheelu's Tour / C Constellation). The founder picked B a month and **four rounds** ago; it was built in Next.js and has since been through V3, V4, V5 and V6. Its README still said "**Status: awaiting founder's pick**". The built HTML lives on `demo-website`, and the kit is in git history. |
| 340 lines from `WORKING.md` | — | Three superseded cold-restart blocks and the theme-B round's working notes, moved verbatim to `WORKING-history-2026-07.md`. That file is the one every resume reads first. |
| 53K from `project-state.json` | 80K → 28K | 28 closed round records and 17 settled blockers, moved verbatim to `docs/checkpoints/closed-rounds.md`. It is step 1 of the resume protocol, and a session read thirty finished rounds before reaching the live state. |

### Kept, deliberately

This is the more useful list, because each one looks deletable and is not.

- **`public/products/{lori,lua,robu}.png`** (2MB). A grep finds no consumer. `src/lib/family.ts` says in
  a comment that those characters stay published on kheelona.ai and *"their renders stay in
  `public/products/` untouched for parity"*. **The decision exists only in a code comment**, which is
  exactly how a naive cleanup deletes something on purpose.
- **`public/mascot/mascot-*.png`** (7 files, 2.8MB). A grep finds no consumer either, because they are
  loaded as `` `/mascot/mascot-${story.pose}.png` ``. They are on every journal page.
- **`3d-handoff/`**. The 3D journey is dormant, one prop away (`<StageGate stage="journey" />`), and
  these are the exact Janus-fix inputs that produced the good model, marked *do not re-cut*.
- **`docs/revamp-2026-07/` round specs** (BUILD-V3 through V6, `copy-v2.md`, `research.md`). The paper
  trail for copy on a live commercial site. The precedence order is documented; deleting provenance to
  save 100K of markdown is a bad trade.
- **`launch-video/`** and `public/video/launch.*`. The `LaunchVideo` component was retired in V4, but
  the film itself is an asset the founder may still want, and the Remotion source is how it is edited.
- **`docs/checkpoints/`**, all of it. Small, and it is the audit trail.
- **`public/app/profile.png`**. Unused, but it is one of a coherent set of three parent-app screenshots
  and it is not superseded by anything. Not every unused file is dead weight.

### Stale claims found while cleaning

Each of these was in a document a session or a visitor reads first:

1. **The README's opening sentence** described the offer as "at the launch price (₹4,999, ₹9,999 after
   launch, **no payment now**)" — the retired promise, on the front door, a day after the store went
   live. `test/preorder-copy.test.ts` never caught it because that scan is scoped to `src/`. The scan
   now also covers the README's front matter, and stops at `### Step 1` so the dated bullets below can
   still say what shipped in July.
2. **`WORKING.md`'s cold-restart header** said "PAID PRE-ORDERS ON A BRANCH". They are live.
3. **A mangled duplicate heading** in the same file (`### V6, which is what is actually live---`
   followed by the same heading again), left by a botched edit in the previous session.
4. **A test count of 279** in the verify command of that same block. It is 769.
5. **`sprint_status.S9`** in `project-state.json` still read "blocked on tally-form-url (founder)", and
   **S14** "blocked on founder Vercel auth". Tally is retired and the site has been live since July.
6. **The docs map** still called `store-go-live.md` the runbook "for taking the store live once the
   founder's keys exist" and pointed at "the never-yet-run test payment".
7. **The README's locked decisions** named `TallyEmbed.tsx`, a deleted component, and its project tree
   omitted `test/`, `tools/` and `supabase/` while describing `.env` as holding a dummy Tally URL.

---

## Gates

| Gate | Result |
| --- | --- |
| `npm test` | 770 passing, 90 files |
| `npx tsc --noEmit` | clean, checked on its own exit code |
| `npx next build` | exit 0, no error lines |
| `qa:sweep` (axe + voice lint, 15 routes × 390/1280) | 30/30 clean, exit 0 |
| Served HTML, all 13 marketing routes | zero CTAs at `#reserve`, `id="reserve"` present exactly once per route |
| Store page rendered at 390px and 1280px | read, not assumed |

## A harness bug this round exposed

`looksLocal()` in `tools/qa/lib/browser.mjs` treated port **3456** as the marker of a local server,
because that is the port the runbook names. Verifying this round needed a second server on 3457, since
the store renders its "opening shortly" state without env, and the store screenshot then spent 45
seconds trying to reach the real `store.kheelona.com` on a port nothing serves. Any explicit port now
counts as local; production URLs carry none. Second time this harness has been wrong about which host
to fake, and both times it failed by timing out rather than by returning a confident wrong answer.

## One new founder item

GA4 cross-domain measurement (FOUNDER-TODO section 0). Every pre-order button now crosses from
`kheelona.com` to `store.kheelona.com`, where before only the finale did. Without both hosts listed
under **Configure your domains**, GA4 counts that hop as a new session from a referral: the store looks
like it gets traffic from your own site, and the marketing pages get no credit for the conversion.
Nothing breaks either way and no data is lost. Two minutes in the dashboard, no deploy.
