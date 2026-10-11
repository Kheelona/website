---
title: "D043: Every page gets a lightweight mockup first; the founder reviews the full set; approval of the set opens the full build"
type: decision
updated: 2026-10-11
sources: ["founder, 2026-10-11 ~11:20 PDT, in session (verbatim below)", D041-gate-a-round-1.md, ../../mockup/APPROVAL.md]
---

# D043: All pages as mockups before the build

**Founder, 2026-10-11 (verbatim):** "In the similar fashion, you should create all other pages. Now you
have a good understanding. So let's do that. let me know once all pages are ready, i can review them all
together. once all pages are approved in this light weight format, you can go-ahead and work on the full
website." Also: "ask me questions anytime, i am available".

| Item | Choice |
|---|---|
| Scope of Gate A | Widened from the homepage to every page in the URL plan ([strategy §5](../site/strategy.md)), each as a lightweight HTML mockup like `mockup/index.html` (DS classes and tokens only, phone first, copy from the Copywriter, CMO review, QA checks) |
| Review | The founder reviews all pages together, through the private artifact link |
| After approval | The founder's approval of the full set is Gate A; Phase 4 (architecture) and the full build follow without another stop until Gate B |
| Questions | Ask the founder any time (still website-only, D030) |

**Scope answers (founder, 2026-10-11, all the recommended options):**

| Item | Choice |
|---|---|
| Journal articles | One article template and three full rewrites (learning toys at 3, a safe AI toy, late talkers); the hub lists all 20; the other 17 are rewritten in the build |
| Legal pages | Full drafted text now (plain-English summary, then the full text) |
| Store | Mock the restyled store page and the confirmation page (presentation only, checkout logic unchanged) |
| Review format | One private link with a page index; pages link to each other like the real site |

**How the mockups are made.** Shared parts in `mockup/partials/`, one body per page in `mockup/pages/`,
assembled by `node mockup/build.mjs`; checks by `node mockup/tools/check.cjs` (screens at 360, 390 and
1440, sideways scroll, page errors, axe with the D041 exception reported apart). The homepage moved from
`mockup/index.html` to `mockup/home.html`; `mockup/index.html` is now the review index.

**Approved by.** Founder. **Date.** 2026-10-11.
