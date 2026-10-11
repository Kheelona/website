---
title: "D039: Repo and setup answers: raw files stay local, repo website set, Kheelona India unrelated, no Google Ads, no linked assets, security defaults accepted, no YouTube channel yet"
type: decision
updated: 2026-10-11
sources: ["founder's answers to the raw-files question, C3, C9, C10, C14, C16, C17, C19, 2026-10-11 05:55-06:05 PDT", ../open-questions.md]
---

# D039: Repo and setup answers

| Item | Founder's answer | Done / effect |
|---|---|---|
| ~101 MB of raw screenshots and Lighthouse/QA captures (`wiki/raw/research/benchmarks/**`, `wiki/raw/qa/`) | Continue local for now | Left uncommitted; no `.gitignore` change; stage by name as always. Not backed up by git (the founder may copy the folder elsewhere) |
| C16 the public repo's website field (dead Vercel URL) | Set it to https://kheelona.com | Done 2026-10-11 with `gh repo edit Kheelona/website --homepage https://kheelona.com`; `gh repo view` confirms |
| C14 "Kheelona India" (cradle mobiles, Amazon.in, @kheelona_india) | Not connected | Entity facts (Organization schema, About, llms.txt) state who Kheelona Robotics is, so search and AI answers can tell the two apart; the site never refers to the other seller |
| C3 Google Ads, Merchant Center, product feed | None of them | No feed or Google Ads tag to keep for parity |
| C9 kheelona.com asset URLs linked from social or partners | No | Old asset URLs may be removed when the new site replaces them |
| C10 security defaults | Accept all | CSP stays Report-Only with an identical policy through launch; the four latent checkout issues stay untouched (checkout logic unchanged) with fixes proposed after launch; `/.well-known/security.txt` is published |
| C19 an official YouTube channel | Not now | Films stay self-hosted; no YouTube link in v1 |
| C17 Supabase region | Unknown; the founder checks later | Phase 4 (architecture) needs it; still open |

**Approved by.** Founder. **Date.** 2026-10-11.
