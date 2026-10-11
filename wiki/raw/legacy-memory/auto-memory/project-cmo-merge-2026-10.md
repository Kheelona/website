---
name: project-cmo-merge-2026-10
description: The CMO's sales-first redesign merged onto our own design system on branch redesign-mockup-2026-10 (PR #16); founder decisions of 2026-10-04 and what is still open
metadata:
  type: project
---

**2026-10-04: built and verified locally on branch `redesign-mockup-2026-10` (PR #16), pushed for the founder's Vercel-preview review; NOT merged to main yet.** Record in the repo: `docs/checkpoints/cmo-merge-2026-10.md`, laws §8.42 a-h, rollback tag `pre-cmo-merge-2026-10` = `77552ff` (local only).

Founder decisions 2026-10-04 (settled, do not re-ask): keep `/products/kheelu`, `/team` ("Our story" label), `/contact`; only `/how` and `/faq` new. Retire the Kheelu guide, add a sticky reserve bar, keep reveals/backdrop. CONFIRMED: no camera; Kheelu says it is a toy and never asks for a secret; voice only to Kheelona's own servers in India. NOT confirmed: "talking is free for life" (banned). Brain claims research-anchored ("conversation helps a young brain grow; Kheelu gives more of it"). The design system stays v3; the CMO's v4 swap was dropped. "The microphone is off. Not muted. Off." is retired everywhere (wake-word wording).

**Why:** the CMO branch mixed content with a design swap; the founder wanted the content, our DS, and zero SEO/analytics breakage.
**How to apply:** if resuming, read the checkpoint's last section and Technical-Todo's "THE CMO MERGE" block. After merge: production checks (recorder loads on store, not /thanks), GSC indexing for /how /faq, remap PostHog cta insights (home-reserve, sticky-bar new), retire `test/analytics-freeze.test.ts`. Port 3456 is held by a stale 2026-09-20 server; this round used 3460.

Related: [[brand-kheelu-lumi-law]] · [[project-posthog-2026-09]] · [[project-meta-pixel-2026-09]] · [[feedback-analytics-carry-forward]]
