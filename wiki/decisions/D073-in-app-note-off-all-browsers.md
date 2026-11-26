---
title: "D073: the store's in-app browser note is switched off for every browser (supersedes D056 item 3 for this note)"
type: decision
updated: 2026-11-26
sources: ["the founder's choice in chat, 2026-11-26 (one-by-one sign-off: checkout and store code); growth-team decision 2026-11-26-test-payments-marked-passed-track-real-users", D056-founder-answers-built-page-reviews-2026-10-14.md, D070-conversion-bug-fixes-2026-11-24.md, D071-test-store-razorpay-test-mode.md, ../site/pages/store.md, ../qa/deviations.md, "src/content/en-IN/store/in-app-note.ts (the switch)", "src/components/ui/InAppBrowserNote/InAppBrowserNote.tsx"]
---

# D073: the store's in-app browser note is switched off for every browser

> **Supersedes [D056](D056-founder-answers-built-page-reviews-2026-10-14.md) item 3** (switch the in-app browser note on, 2026-10-14)
> for this note only. The rest of D056 stands.

**Context.** The store showed "Paying by UPI? Open this page in Chrome or Safari." (with a "Copy link" button) to a parent
inside the Instagram, Facebook/Messenger or WhatsApp browser. It shipped switched on in task 7.1c (D056 item 3) because a
payment started in those browsers could be lost when the parent left for a UPI app. B2 (#36, merged 24 November) then
made the payment itself safe there: for those user agents the store sends Razorpay's own return route instead of the
in-page sheet and handler (D070). D070 said the notice would go "app by app once the test payments pass", and D071 gave the
test store (the beta build, Razorpay Test Mode) to run those payments on.

**What was tested.** The founder paid on the test store from an iPhone (Safari, the LinkedIn browser and the Instagram
browser) on 25 November, and from an Android phone (Chrome, the Instagram browser and the LinkedIn browser) on 26 November;
the remaining browsers were accepted on the founder's basic test. All of it was marked passed on 26 November 2026.

**Options.** The growth team recommended switching the note off only for the browsers that were tested (Instagram and
LinkedIn), and keeping it for the untested ones (WhatsApp, Facebook/Messenger). The founder chose **all in-app browsers**.

**Choice.** `inAppNote.enabled` in `src/content/en-IN/store/in-app-note.ts` goes from `true` to `false`, for every in-app
browser. That is the whole change:

| Part | Now |
|---|---|
| The note's words (title, body, button, confirmation) | Unchanged, kept in the content module so the switch can go back on |
| `InAppBrowserNote` | Returns nothing while the switch is off, so the store's server HTML no longer carries the note's words and no browser renders `.ks-inapp` |
| The in-app user-agent check (`isInAppBrowser`) | Unchanged: it still feeds B2's redirect checkout, which is what keeps an in-app payment from being lost |
| `ks-inapp__action` (the CSS) | Kept: the pay-recovery notice uses it |
| Page, checkout, tracking, design system, mockups | Untouched |

Real in-app store payments are watched after the merge (growth-team card K-186: paid with the address saved, window
closed, failed, and paid with no address).

**If B2 is ever reverted, this note comes back in the same release.** Without B2, an in-app browser goes back to the in-page
sheet and handler, which is the original failure, and the note was its only guard. Revert this change (or set
`enabled: true`, with the tests and records below) in the same release as the B2 revert. The two changes share no file, so
they revert in either order.

**Records.** `wiki/site/pages/store.md` (Fold 2 notes, the phone order, the sources row, "Changes after approval (C2)");
`wiki/qa/deviations.md` (V25 retired, V73 added); the in-app rules in `test/e2e/support/deviations.ts` now cite V73 and
this decision (the mockup still prints the note as an example, so its `.mk-inapp` hide and its text rule stay); a dated
update line in D070 at the C2 sentence.

**Approved by** the founder, in chat on 2026-11-26. Action C2 (K-177).

**Rollback.** Revert the pull request, or set `enabled: true` in `in-app-note.ts` with the tests and records. The note then
shows again in the Instagram, Facebook/Messenger and WhatsApp browsers exactly as before. No data, schema, URL or
environment variable changes either way.
