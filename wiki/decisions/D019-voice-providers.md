---
title: "D019: A child's voice is processed by multiple outside providers; 'only our own servers' is retired"
type: decision
updated: 2026-10-10
sources: ["founder's answer to R3, 2026-10-10: '(b) we have multiple provider'", ../product/claims.md, ../product/facts.md]
---

# D019: Voice processing uses outside providers

**New fact (founder, 2026-10-10).** Kheelu's voice processing uses **multiple outside providers**
(for example speech-to-text or the AI model). This supersedes the 2026-10-04 confirmation.

**Consequences for copy, schema and `llms.txt`:**
- BANNED on the new site: "Your child's voice goes only to Kheelona's own servers, in India", any
  "only our own servers" or "never leaves Kheelona" wording, and the `/playos` line "Nothing rented
  that matters" (and its "own the model" family). The live site keeps them until Gate B
  ([D011](D011-production-held-until-gate-b.md)), a known accepted risk.
- No privacy line about processing is published until the facts behind it are confirmed: where
  providers process (India or other countries), whether they keep audio or transcripts, whether
  they may train on them, and whether contracts bind them. Asked next; also feeds F2 and F5 and
  the DPDP lines on `/privacy`.
- The listening mechanism stays publishable ([D018](D018-wake-up-button.md)): it is about when
  the microphone is on, not where audio goes.

**To apply:** facts.md (voice path row), claims.md (the confirmed-claims row and section 7), with
D016-D018 after the completion run.

**Approved by.** Founder (the fact). **Date.** 2026-10-10.
