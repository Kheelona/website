---
title: "D040: The seven parent films move to the new site; film captions; no endorsement-disclosure line"
type: decision
updated: 2026-10-11
sources: [../raw/feedback/2026-10-11-gate-a-answers.md, ../site/pages/home.md, ../product/claims.md, ../product/legal-requirements.md, ../legacy/settled-decisions.md]
---

# D040: The seven parent films move to the new site

**Context.** Gate A item G3 asked whether the seven consented parent films on the live site
(`public/video/moments/`, labels in `src/lib/video-moments.ts` at tag `archive/pre-reset-2026-10-10`)
may move to the new site. The mockup showed an illustrative exchange instead
([home.md fold 2 variant b](../site/pages/home.md)).

**Founder, 2026-10-11** ([raw](../raw/feedback/2026-10-11-gate-a-answers.md)): "testimonial videos are
missing add that in the artifact, if not full then place holder for sure", then "you should add the one
we have on our webiste to the new website."

| Item | Choice |
|---|---|
| Films | All seven move to the new site, in fold 2 of Home ([home.md variant a](../site/pages/home.md)); the illustrative exchange leaves Home (kept for the product-page outline) |
| Consent | The founder's 2026-09-19 statement stands: written parental consent is held for every child ([settled decisions](../legacy/settled-decisions.md)); the signed records stay with the founder |
| Film 6 caption | "In AI mode, Arha switches to English, and Kheelu switches with her." The founder: "Arha was talking to the toy in the AI mode and AI mode changed the language not story mode" (so D027 holds: Story mode does not adapt) |
| Film 1 label | Keep "Learning by asking" (founder's choice over the legal review's L7 caution on learning claims) |
| Burned-in subtitles with em dashes | Ship as they are (the founder's 2026-09-19 call stands) |
| Endorsement disclosure (did the families get Kheelu free?) | Not asked further: "Ignore this line of wording. Mention something like kids love it and parents approve it. Do proper copy writing." The Copywriter writes a proof line from what the films show |

**Risk recorded.** The CCPA endorsement guidelines (2022) expect a material connection behind an
endorsement to be disclosed ([legal requirements](../product/legal-requirements.md), H8/ECOM-16). Films 3
and 7 are parents speaking to camera. If any family received Kheelu free or discounted, the site would
not say so. Accepted by the founder by direction; the proof line must claim only what the films show.

**Tracking.** The play buttons keep the live labels ("Play: {chip}. {caption}", "Previous video",
"Next video"), so PostHog's autocapture counts stay comparable with the audit's "Play:" measure
([audit](../research/posthog-audit.md#customer-films-q27)). No new event names.

**Approved by.** Founder. **Date.** 2026-10-11.
