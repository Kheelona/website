---
title: "D010: wiki/ and design-system/ are committed to the public repo"
type: decision
updated: 2026-10-10
sources: ["founder's answer to Q1, 2026-10-10", ../open-questions.md]
---

# D010: wiki/ and design-system/ are committed publicly

**Context.** [Q1](../open-questions.md): the repo is public; brief 4.8 required asking before
committing the wiki or the DS. Options were (a) make the repo private, (b) a separate private repo,
(c) commit both publicly. The CTO recommended (b).

**Choice: (c), the founder's answer on 2026-10-10.** Supersedes [D004](D004-internal-material-uncommitted.md).
The `.gitignore` guard is lifted, and the positioning `.docx` is exempted from the repo-wide `*.docx` rule.

**Checked before the first commit.**
- Secret scan of `wiki/` and `design-system/`: no keys or tokens (Razorpay, Stripe-style, PostHog
  personal, JWT, private keys, AWS, Slack, GitHub, Resend, bearer). The only `phc_` hits are
  PostHog's public project key, which ships to every browser anyway.
- Personal data: public addresses only, plus the founder's work email, which the founder accepted
  in Q1. Every phone-shaped number was a false positive (substrings of the pixel id and of SHA-256
  hashes) or the published support number. No file over 20 MB.

**Still never committed:** secrets, customer personal data, PostHog person-level data, and
investor material (`pitch-deck/` stays gitignored even though the folder is gone).

**Approved by.** Founder. **Date.** 2026-10-10.
