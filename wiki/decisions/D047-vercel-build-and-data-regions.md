---
title: "D047: Vercel build command not overridden (keep it off); Supabase in ap-southeast-2 until moved before launch; toy server and memory on GCP in India"
type: decision
updated: 2026-10-11
sources: ["founder, 2026-10-11 ~14:20 PDT, in session (C8, C17)", ../open-questions.md]
---

# D047: Vercel build command and data regions

**Founder (verbatim):** "Vercel it's not on. Do you want me on swithc it on? Supabase region is
ap-southeast-2, will switch it before we ship the product. For server & memory we are using GCP, that is
in India."

| Item | Answer | Effect |
|---|---|---|
| C8 Vercel build-command override | Off | **Keep it off** (main session's answer to the founder's question): Vercel then runs `package.json`'s `build` script, which the reset changes in the repo; no dashboard change needed |
| C17 Supabase region | ap-southeast-2 (Sydney); the founder moves it before launch | Phase 4: plan the store's server functions for an Indian region and the Supabase move (data migration, keys and env unchanged in name). **Launch blocker until moved:** /privacy must name where order data is stored; today that is Australia, not India |
| The toy's server and memory | GCP, in India | Consistent with "servers in India" on Home (D020); /privacy names GCP India for conversation data |

**Approved by.** Founder. **Date.** 2026-10-11.
