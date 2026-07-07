# Launch film v2 — three story variants (2026-07-07)

Founder brief: emotion and visuals first, minimal text, Lumi and the mascot together, story-teller framing. All on-screen text is verbatim site copy (voice-lint clean). ~20s each, 1920×1080\@30fps, silent (site slot autoplays muted). Shots generated with Gemini Veo (image-to-video) seeded from the regenerated Lumi renders + existing mascot renders + photoshoot frames; assembled and graded in Remotion.

**Veo child-depiction caution**: scenes avoid direct photoreal child faces (policy risk); children appear as hands, over-shoulder, or silhouette. The toy is the star.

## Approved on-screen text pool (verbatim from site)
- "The smartest way to grow your child's brain is to understand their heart."
- "Lumi is a screen-free AI robot toy that listens first, then talks back. Really talks."
- "In the years a brain grows fastest."
- "The more Lumi understands how your child feels, the more they learn."
- "In all 10 languages you speak at home."
- "Meet Lumi." (LaunchVideo v1 sanctioned line)
- "Screen-free. A real conversation." (LaunchVideo v1 sanctioned line)
- End card: "Reserve Lumi at ₹4,999" + "₹9,999 after launch. No payment now."

## V1 — "The first hello" (intimate, warm)
Arc: an ordinary evening becomes a first conversation.
1. (0–4s) Warm lamplit room, evening. Lumi sits on a rug facing us, soft focus pull. No text.
2. (4–8s) A small hand reaches in and touches Lumi's paw. Text: "Listens first, then talks back."
3. (8–13s) Lumi in close-up, gentle tilt as if replying; warm light blooms. Text: "Really talks."
4. (13–17s) Wide: child silhouette hugging Lumi by a window, dusk. Text: "In the years a brain grows fastest."
5. (17–20s) End card on cream: logo, CTA lines.

## V2 — "Two friends" (playful, energetic)
Arc: the mascot leads Lumi through a day of feelings.
1. (0–4s) Mascot peeks from frame edge on sunshine yellow, waves. Text: "Meet Lumi."
2. (4–9s) Lumi and mascot side by side on a playmat; mascot bounces, Lumi tilts toward it. No text.
3. (9–14s) Quick cuts: mascot joy pose / Lumi close-up / mascot curious pose / Lumi paw-up. Text: "The more Lumi understands how your child feels, the more they learn."
4. (14–17s) Both characters settle together, facing camera. Text: "In all 10 languages you speak at home."
5. (17–20s) End card: orange finale style, character lineup, CTA lines.

## V3 — "The quiet one" (cinematic, minimal)
Arc: slow beauty film; one line only.
1. (0–6s) Macro dolly across Lumi's fabric texture, studio light, dust motes. No text.
2. (6–11s) Slow orbit around Lumi on seamless white; horn stripes catch the light. No text.
3. (11–15s) Lumi on a child's bookshelf at golden hour, slight breeze in curtains. Text: "Screen-free. A real conversation."
4. (15–20s) Cut to black, then end card: "Reserve Lumi at ₹4,999" / "₹9,999 after launch. No payment now."

## Status (2026-07-08: SHIPPED)
- FilmTwoFriendsVeo (750f/25s, from founder's Veo clips in public/veo/, muted) is LIVE at site/public/video/launch.mp4 (3MB crf30) + new poster. Master: out/film-v2-two-friends-veo.mp4. Optional Cuddle shot extends it later (~900f, slot between Play and end card).
- The three motion-design drafts + old ProductFilm/LaunchTeaser were deleted in the 2026-07-08 cleanup (recoverable from git where committed); their designs remain documented below.

## Old status (2026-07-07 evening)
- [x] Blue renders regenerated (Gemini, faithful, 1792×2400)
- [~] Veo shots: orbit.mp4 generated in Gemini (chat "Plush Toy Orbit Video Generation"), download blocked by Chrome download permissions; founder to download manually → drop into `launch-video/public/veo/orbit.mp4`, flip `VEO_ORBIT=true` in FilmQuietOne.tsx, re-render
- [x] Remotion assembly: FilmFirstHello / FilmTwoFriends / FilmQuietOne registered, motion-design base (no Veo dependency)
- [~] 3 renders delivered to founder; winner ships to site/public/video/

## Veo integration notes
- Veo clips slot into `launch-video/public/veo/` (orbit.mp4, hands.mp4). Each film has a `VEO_*` const at the top; flip to true when the clip exists and re-render.
- Veo prompt used for orbit: slow cinematic orbit, toy unchanged, white seamless bg, dust motes, 8s.
- Gemini Pro plan has a daily Veo cap; remaining shots (hands touch for V1, duo bounce for V2) queue after founder review of the drafts.
