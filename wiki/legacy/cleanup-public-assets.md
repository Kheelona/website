---
title: Clean-up list, every file in public/
type: legacy-cleanup
updated: 2026-10-10
cites_at: archive/pre-reset-2026-10-10
sources:
  - "git ls-tree -r -l archive/pre-reset-2026-10-10 public (73 files, 42,278,427 bytes), 2026-10-10"
  - "git grep for each path, then each basename, over the production code at archive/pre-reset-2026-10-10 (evidence EV1 on the clean-up list); dynamic paths read by hand"
  - "PostHog project 617632, read-only: metaads_ad_creatives and actions/insights checks (evidence EV14, EV15 on the clean-up list), 2026-10-11 01:30-01:40 UTC"
---

# Clean-up list, every file in `public/`

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

The per-file appendix of the [clean-up list](cleanup.md). The groups, reasons and evidence
numbers (EV1 to EV15) are there; this page only lists the files.

**73 files, 42,278,427 bytes.** 6 DELETE-NOW, 36 DELETE-WITH-REBUILD, 2 KEEP URL (replace the
file), 29 FOUNDER (waiting on [open questions](../open-questions.md) G3). Sizes match
`git ls-tree -l` at the tag file for file.

References are production code only (tests and stories excluded), from EV1 with the path, then the
basename; dynamic paths were read by hand. The 6 DELETE-NOW files are also named by no Meta ad
creative and by no PostHog action or insight (EV14, EV15). Sizes in bytes.

| File | Bytes | Referenced by (under `src/` unless stated) | Recommendation |
|---|---|---|---|
| `public/app/dashboard.png` | 41,474 | features/home/components/ParentAppSection.tsx | DELETE-WITH-REBUILD |
| `public/app/onboarding.png` | 65,108 | app/(site)/setup/page.tsx | DELETE-WITH-REBUILD |
| `public/app/profile.png` | 51,701 | none | DELETE-NOW |
| `public/brand/kheelona-mark.svg` | 4,560 | only tools/brand/render-icons.mjs:23 (icon generator input) | DELETE-WITH-REBUILD |
| `public/brand/kheelona-wordmark.svg` | 27,165 | app/store/layout.tsx, components/organisms/Navbar.tsx | DELETE-WITH-REBUILD |
| `public/brand/logo-mark.png` | 11,320 | lib/seo.ts | KEEP URL, replace file |
| `public/mascot/mascot-bliss.png` | 336,285 | dynamic: lib/kheelu-poses.ts:20, features/home/components/Journal.tsx:54, app/(site)/stories/page.tsx:135, app/(site)/stories/[slug]/page.tsx:209 | DELETE-WITH-REBUILD |
| `public/mascot/mascot-curious.png` | 451,261 | dynamic: lib/kheelu-poses.ts:20, features/home/components/Journal.tsx:54, app/(site)/stories/page.tsx:135, app/(site)/stories/[slug]/page.tsx:209 | DELETE-WITH-REBUILD |
| `public/mascot/mascot-grumpy.png` | 484,123 | dynamic: lib/kheelu-poses.ts:20, features/home/components/Journal.tsx:54, app/(site)/stories/page.tsx:135, app/(site)/stories/[slug]/page.tsx:209 | DELETE-WITH-REBUILD |
| `public/mascot/mascot-hero-wink.png` | 417,162 | dynamic: lib/kheelu-poses.ts:20, features/home/components/Journal.tsx:54, app/(site)/stories/page.tsx:135, app/(site)/stories/[slug]/page.tsx:209 | DELETE-WITH-REBUILD |
| `public/mascot/mascot-joy.png` | 410,296 | dynamic: lib/kheelu-poses.ts:20, features/home/components/Journal.tsx:54, app/(site)/stories/page.tsx:135, app/(site)/stories/[slug]/page.tsx:209 | DELETE-WITH-REBUILD |
| `public/mascot/mascot-sad.png` | 393,123 | dynamic: lib/kheelu-poses.ts:20, features/home/components/Journal.tsx:54, app/(site)/stories/page.tsx:135, app/(site)/stories/[slug]/page.tsx:209 | DELETE-WITH-REBUILD |
| `public/mascot/mascot-silly.png` | 389,964 | dynamic: lib/kheelu-poses.ts:20, features/home/components/Journal.tsx:54, app/(site)/stories/page.tsx:135, app/(site)/stories/[slug]/page.tsx:209 | DELETE-WITH-REBUILD |
| `public/models/kheelona-mascot.glb` | 1,445,816 | features/ambient-stage/components/actors.tsx (unreachable) | DELETE-NOW (with ambient-stage) |
| `public/models/lumi-plush.glb` | 478,864 | features/ambient-stage/components/actors.tsx (unreachable) | DELETE-NOW (with ambient-stage) |
| `public/og.png` | 213,681 | app/layout.tsx, lib/seo.ts, proxy.ts | KEEP URL, replace file |
| `public/partners/ideabaaz-startup-fest.png` | 7,121 | app/store/ideabaaz/page.tsx | FOUNDER ([G3](../open-questions.md)) |
| `public/product/lumi.png` | 2,028,885 | lib/kheelu-art.ts | DELETE-WITH-REBUILD |
| `public/products/ai-book.png` | 1,424,417 | lib/family.ts | DELETE-WITH-REBUILD |
| `public/products/kheelu-speaker.png` | 793,608 | lib/family.ts | DELETE-WITH-REBUILD |
| `public/products/lori.png` | 527,790 | none | DELETE-NOW |
| `public/products/lua.png` | 799,535 | none | DELETE-NOW |
| `public/products/magic-box.png` | 396,027 | app/(site)/playos/page.tsx | DELETE-WITH-REBUILD |
| `public/products/robu.png` | 698,831 | none | DELETE-NOW |
| `public/recognition/karnataka-seal.png` | 49,805 | components/organisms/RecognitionStrip.tsx | FOUNDER ([G3](../open-questions.md)) |
| `public/recognition/nasscom.png` | 56,327 | components/organisms/RecognitionStrip.tsx | FOUNDER ([G3](../open-questions.md)) |
| `public/recognition/nvidia-inception.png` | 25,239 | components/organisms/RecognitionStrip.tsx | FOUNDER ([G3](../open-questions.md)) |
| `public/stories/a-toy-that-talks-vs-a-toy-that-listens.jpg` | 163,986 | lib/stories-expansion.ts | DELETE-WITH-REBUILD |
| `public/stories/brain-development-toys-for-a-2-year-old.jpg` | 166,160 | lib/stories-expansion.ts | DELETE-WITH-REBUILD |
| `public/stories/busy-hands-no-screens.jpg` | 271,670 | lib/stories-expansion.ts | DELETE-WITH-REBUILD |
| `public/stories/does-a-three-year-old-need-an-ai-tutor.jpg` | 218,654 | lib/stories-expansion.ts | DELETE-WITH-REBUILD |
| `public/stories/how-children-collect-words.jpg` | 229,049 | lib/stories-expansion.ts | DELETE-WITH-REBUILD |
| `public/stories/how-children-learn-by-talking.jpg` | 270,146 | lib/stories.ts | DELETE-WITH-REBUILD |
| `public/stories/how-much-screen-time-for-a-3-to-6-year-old.jpg` | 242,439 | lib/stories-expansion.ts | DELETE-WITH-REBUILD |
| `public/stories/how-to-get-your-child-talking.jpg` | 202,234 | lib/stories-expansion.ts | DELETE-WITH-REBUILD |
| `public/stories/raising-a-bilingual-child-in-india.jpg` | 239,024 | lib/stories-expansion.ts | DELETE-WITH-REBUILD |
| `public/stories/screen-free-does-not-mean-silent.jpg` | 311,624 | lib/stories.ts | DELETE-WITH-REBUILD |
| `public/stories/screen-time-and-tantrums.jpg` | 205,247 | lib/stories-expansion.ts | DELETE-WITH-REBUILD |
| `public/stories/screen-time-rules-parents-swear-by.jpg` | 233,287 | lib/stories-expansion.ts | DELETE-WITH-REBUILD |
| `public/stories/should-kids-use-ai.jpg` | 181,875 | lib/stories-expansion.ts | DELETE-WITH-REBUILD |
| `public/stories/talking-late-or-talking-little.jpg` | 198,452 | lib/stories-expansion.ts | DELETE-WITH-REBUILD |
| `public/stories/talking-toys-and-late-talkers.jpg` | 208,810 | lib/stories-expansion.ts | DELETE-WITH-REBUILD |
| `public/stories/the-gentle-way-off-the-phone.jpg` | 134,667 | lib/stories-expansion.ts | DELETE-WITH-REBUILD |
| `public/stories/what-actually-builds-a-sharp-brain.jpg` | 219,314 | lib/stories-expansion.ts | DELETE-WITH-REBUILD |
| `public/stories/what-to-look-for-in-a-safe-ai-toy.jpg` | 230,214 | lib/stories.ts | DELETE-WITH-REBUILD |
| `public/stories/why-three-to-six-are-the-years-that-matter-most.jpg` | 270,923 | lib/stories.ts | DELETE-WITH-REBUILD |
| `public/team/aman.jpg` | 36,314 | app/(site)/team/page.tsx | FOUNDER ([G3](../open-questions.md)) |
| `public/team/apoorva.jpg` | 28,888 | app/(site)/team/page.tsx | FOUNDER ([G3](../open-questions.md)) |
| `public/team/kashyap.jpg` | 39,482 | app/(site)/team/page.tsx | FOUNDER ([G3](../open-questions.md)) |
| `public/team/ria.jpg` | 38,715 | app/(site)/team/page.tsx | FOUNDER ([G3](../open-questions.md)) |
| `public/video/launch-poster.jpg` | 43,673 | lib/seo.ts:268-269 (LAUNCH_VIDEO, imported only by its test) | DELETE-WITH-REBUILD |
| `public/video/launch.mp4` | 2,912,635 | lib/seo.ts:268-269 (LAUNCH_VIDEO, imported only by its test); test/video-assets.test.ts:164 fixture | DELETE-WITH-REBUILD |
| `public/video/moments/a-father-speaks.jpg` | 140,534 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/a-father-speaks.mp4` | 3,144,491 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/a-father-speaks.webp` | 371,792 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/a-mother-joins-in.jpg` | 139,932 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/a-mother-joins-in.mp4` | 2,882,730 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/a-mother-joins-in.webp` | 300,712 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/a-parent-speaks.jpg` | 97,999 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/a-parent-speaks.mp4` | 3,886,752 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/a-parent-speaks.webp` | 337,588 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/a-story-in-two-languages.jpg` | 107,997 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/a-story-in-two-languages.mp4` | 2,677,271 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/a-story-in-two-languages.webp` | 356,304 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/counting-out-loud.jpg` | 110,322 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/counting-out-loud.mp4` | 2,194,029 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/counting-out-loud.webp` | 277,128 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/first-conversations.jpg` | 79,766 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/first-conversations.mp4` | 3,140,506 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/first-conversations.webp` | 314,652 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/learning-by-asking.jpg` | 85,360 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/learning-by-asking.mp4` | 2,035,824 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
| `public/video/moments/learning-by-asking.webp` | 269,768 | lib/video-moments.ts | FOUNDER ([G3](../open-questions.md)) |
