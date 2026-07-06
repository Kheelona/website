# Copy Reference (Phase 5 compile)

The source of truth for all rendered copy is the component/page code itself; this file records provenance, deviations, and where each page's copy lives. All copy passed voice-lint §1.7 (zero em-dashes; en-dash unused; no hype; exact names; second person present tense) and was audited by an independent copywriter review (2026-07-06, grade B+ → fixes applied, see `docs/checkpoints/executive-review-round-1.md`).

## Home `/` — VERBATIM from `kheelona homepage website content.pdf`
Copy lives in `site/components/sections/home/*.tsx`. Blue-box copy reproduced exactly, with these sanctioned/recorded deviations:
1. "Rs." → "₹" site-wide (prompt §1.10).
2. S09 Parent voices: section headline is built but UNMOUNTED until real testimonials exist (claims register §1.9; empty placeholders read as vaporware per CMO review).
3. S11 Footer CTA: the PDF's `[BUTTON] Join the pre-order list` is implemented as the inline Tally reservation form + surrounding verbatim copy (deliberate conversion decision). The button label lives on in nav/CTAs.
4. PDF label colors (brand green/terracotta small caps) rendered as Instrument Serif italic 24px in orange-deep: WCAG AA at label sizes (a11y gate).

## Drafted pages (AI copy per prompt §5.2, founder may redline anytime)
- **/products/lumi** — `site/app/products/lumi/page.tsx`: hero, conversation demo script, five-feelings-deeper cards, parent-app features, box list + honest specs deferral, price block ("Under ₹4 a day" is locked fact §1.8), 10 FAQs. Keywords woven: talking toys, robot toy, educational toys, cognitive development toy for toddlers, voice toy (languages FAQ), toys for kids.
- **/playos** — `site/app/playos/page.tsx`: parent-first H1, voice path (4 steps), privacy cards, family roadmap ("One soul. Many bodies."), quiet kheelona.ai line. Keywords: brain development toys, cognitive development toy for toddlers, smart toys.
- **/safety** — `site/app/safety/page.tsx`: hero, body (no physical claims pre-certification), four word-rules, voice-data cards, parent keys, 4 AEO FAQs. Keywords: AI toys, safe AI toy, toy to reduce screen time for toddlers in India.
- **/team** — `site/app/team/page.tsx`: manifesto, three founder cards (locked facts §1.8: 14 patents filed; built at Intel; services firm unnamed), four beliefs (prompt's sample anchors, split into em-dash-free sentences), gentle close.
- **/stories** + 14 articles — `site/lib/stories.ts` (4 seed pieces: "Why three to six are the years that matter most", "Screen-free does not mean silent", "How children learn by talking", "What to look for in a safe AI toy") + `site/lib/stories-expansion.ts` (10 keyword-researched pieces, 2026-07-06: screen-time guideline, tantrums, seven-day phone plan, get-your-child-talking, speech-delay reassurance, sharp-brain, vocabulary, bilingual India, should-kids-use-AI, busy-hands). Each ends with a soft invite or no product mention at all; WHO/AAP claims attributed; speech article defers to professionals. All 14 verified 0% AI / 100% human on QuillBot AI Detector v7.1.0 (see qa-report content-expansion entry).
- **/privacy, /terms** — plain-language drafts; COUNSEL REVIEW REQUIRED before launch (flagged in code).
- **/setup** — four steps, wake word/charger details deferred to final specs.
- **Microcopy** — nav/footer/sticky bar/Tally panel in `site/components/layout/*` and `ui/TallyEmbed.tsx`. Pre-launch panel copy: "The pre-order list opens here soon. ₹4,999 held for you, no payment now. We hold the price, you hold your place."
- **404** — `site/app/not-found.tsx` ("This page wandered off.").

## CTA label system (principled two-label rule)
- "Reserve Lumi at ₹4,999" at desire peaks (heroes, price block, post-product moments).
- "Join the pre-order list" in nav, utility slots, and PlayOS.
- Sticky mobile bar: "Reserve at ₹4,999. No payment now."
