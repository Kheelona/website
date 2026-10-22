#!/bin/bash
# Builds every web-ready asset for the redesign from the source files, on this Mac (the local asset step).
# Run from website/redesign: bash tools/build-assets.sh. Its outputs are COMMITTED (redesign/.gitignore): a deploy build
# (tools/build-site.sh, on Vercel with Node + Python only) never encodes media, it only reads these files.
# Needs ffmpeg + cwebp (Homebrew) and the source media outside the repo. Sources are read, never modified.
set -euo pipefail
cd "$(dirname "$0")/.."
CODE=../..                                   # kheelona/code
SITE=..                                      # website/
DS="$SITE/design-system/project/assets"
IMG=assets/img; VID=assets/video; TMP=$(mktemp -d)
mkdir -p "$IMG" "$VID"

# 1) Product: trim to the alpha box (+24px), then 3 responsive WebP widths with alpha.
ffmpeg -v error -y -i "$CODE/Khelu_By_Kheelona.png" -vf "crop=1696:2070:41:144" -pix_fmt rgba "$TMP/kheelu.png"
for w in 1200 800 480; do
  ffmpeg -v error -y -i "$TMP/kheelu.png" -vf "scale=$w:-1:flags=lanczos" -pix_fmt rgba "$TMP/k$w.png"
  cwebp -quiet -q 80 -alpha_q 90 -m 6 "$TMP/k$w.png" -o "$IMG/kheelu-$w.webp"
done
# Small square for the buy pill / share card.
ffmpeg -v error -y -i "$TMP/kheelu.png" -vf "scale=240:-1:flags=lanczos" -pix_fmt rgba "$TMP/k240.png"
cwebp -quiet -q 82 -alpha_q 90 "$TMP/k240.png" -o "$IMG/kheelu-240.webp"

# Close-up of the tummy unit and a studio packshot, both from the current toy photo (never the previous toy's photos).
mkdir -p "$IMG/product"
ffmpeg -v error -y -i "$CODE/Khelu_By_Kheelona.png" -vf "crop=900:900:461:973" "$TMP/tummy.png"
for w in 800 480; do ffmpeg -v error -y -i "$TMP/tummy.png" -vf "scale=$w:-1:flags=lanczos" "$TMP/t$w.png"; cwebp -quiet -q 82 "$TMP/t$w.png" -o "$IMG/product/khelu-tummy-$w.webp"; done
ffmpeg -v error -y -f lavfi -i "color=c=0xF7F1EA:s=1200x1200" -i "$TMP/kheelu.png" -filter_complex "[1]scale=-1:1040:flags=lanczos[k];[0][k]overlay=(W-w)/2:H-h-60:format=auto" -frames:v 1 "$TMP/studio.png"
for w in 1200 720; do ffmpeg -v error -y -i "$TMP/studio.png" -vf "scale=$w:-1:flags=lanczos" "$TMP/s$w.png"; cwebp -quiet -q 80 "$TMP/s$w.png" -o "$IMG/product/khelu-studio-$w.webp"; done

# 2) Logo.
cp "$CODE/Kheelona_Logo.svg" "$IMG/kheelona-logo.svg"

# 3) Parent-app screens: the v1.0.5 App Store frames (code/UI Images_ mobile app), cropped to the app card only.
APPSRC="$CODE/UI Images_ mobile app"
while IFS="|" read -r id name y0 y1; do
  ffmpeg -v error -y -i "$APPSRC/v1.0.5 · App Store — $name.png" -vf "crop=1070:$((y1 - y0 + 1)):68:$y0,scale=720:-1:flags=lanczos" "$TMP/app-$id.png"
  cwebp -quiet -q 84 -m 6 "$TMP/app-$id.png" -o "$IMG/app-$id.webp"
done <<'LIST'
home|01 — Home|246|1792
curiosity|02 — Activity|334|1703
offline|03 — Play offline|240|1797
privacy-centre|04 — Privacy|308|1730
profile|05 — Profile|288|1750
LIST
# The privacy centre without its green banner ("…chats are seen only by you. Never sold, never used for ads."): the site
# may not show that line (D044, D035, D038). Source rows 570-843 are cut out; the rest is stitched together.
ffmpeg -v error -y -i "$APPSRC/v1.0.5 · App Store — 04 — Privacy.png" -filter_complex "[0]crop=1070:262:68:308[a];[0]crop=1070:888:68:843[b];[a][b]vstack,scale=720:-1:flags=lanczos" "$TMP/app-privacy-centre.png"
cwebp -quiet -q 84 -m 6 "$TMP/app-privacy-centre.png" -o "$IMG/app-privacy-centre.webp"

# 4) Lifestyle photos (illustrative), 960w WebP.
for p in myra-01-breakfast-why kabir-03-homework-desk ira-03-festive-evening-song myra-03-bedtime-cuddle tara-02-evening-with-amma advik-02-whispering-to-kheelu; do
  ffmpeg -v error -y -i "$DS/Photo library/$p-web.webp" -vf "scale=960:-2:flags=lanczos" "$TMP/$p.png"
  cwebp -quiet -q 78 -m 6 "$TMP/$p.png" -o "$IMG/$p.webp"
done

# 5) Real-family films: a 6s silent preview loop + poster each. The full films (played on tap) are NOT copied: pages
# play the files the Next app already serves, /video/moments/<id>.mp4 and /video/expert/expert-clip.mp4 (public/video,
# committed once; redesign/video links there for the local server).
# macOS ships bash 3.2 (no associative arrays): "id:start-second" pairs.
for pair in learning-by-asking:4 a-mother-joins-in:6 a-father-speaks:8 first-conversations:5 counting-out-loud:6 a-story-in-two-languages:9 a-parent-speaks:10; do
  id=${pair%%:*}; start=${pair##*:}
  src="$SITE/public/video/moments/$id.mp4"
  ffmpeg -v error -y -ss "$start" -t 6 -i "$src" -an -vf "scale=432:-2,fps=24" -c:v libx264 -profile:v main -crf 28 -preset slow -movflags +faststart -pix_fmt yuv420p "$VID/$id-loop.mp4"
  ffmpeg -v error -y -ss "$start" -i "$src" -frames:v 1 -vf "scale=432:-2" "$TMP/$id.png"
  cwebp -quiet -q 72 "$TMP/$id.png" -o "$IMG/poster-$id.webp"
done
ffmpeg -v error -y -ss 3 -i "$SITE/public/video/expert/expert-clip.mp4" -frames:v 1 -vf "scale=960:-2" "$TMP/expert.png"
cwebp -quiet -q 75 "$TMP/expert.png" -o "$IMG/poster-expert.webp"

# 6) Recognition marks.
for r in nvidia-inception karnataka-seal nasscom; do cp "$SITE/public/recognition/$r.png" "$IMG/$r.png"; done

# 7) Toy-button sounds (from the launch film's SFX), tiny AAC files played only when a visitor taps a button.
AUD=assets/audio; mkdir -p "$AUD"; SFX="$CODE/kheelu-launch-film/public/kheelu/audio/sfx"
for pair in listen:0 tap:0 tick:0 toggle:0 delete:0 pop:0 musicbox:4; do
  id=${pair%%:*}; len=${pair##*:}; T=""; [ "$len" != 0 ] && T="-t $len -af afade=t=out:st=$((len-1)):d=1"
  ffmpeg -v error -y -i "$SFX/$id.wav" $T -ac 1 -c:a aac -b:a 64k "$AUD/$id.m4a"
done

# 8) Khelu's real voice: the firmware's recorded cue lines (the exact clips the toy plays), as small AAC files.
#    Source of truth: iot-firmware/esp32s3_voice_assistant_idf/assets/cues/manifest.json ("_says" = the words).
CUES="$CODE/iot-firmware/esp32s3_voice_assistant_idf/assets/cues"; mkdir -p "$AUD/toy"
for c in wake_ack server_connected sleep idle_stop daily_limit; do
  ffmpeg -v error -y -i "$CUES/$c.wav" -ac 1 -ar 24000 -c:a aac -b:a 64k "$AUD/toy/$c.m4a"
done
# Pipeline A (Gemini Live, voice "Kore") clips, when present: drop WAVs into assets/audio/pipeline-a-src/ and they are encoded too.
# The fleet's default profile voice is Kore (backend prompts.constant.js). Its sample lives in the media bucket.
if command -v gsutil >/dev/null 2>&1; then mkdir -p "$AUD/pipeline-a-src"; gsutil -q cp "gs://kheelona/media/voice-samples/gemini/Kore-*.wav" "$AUD/pipeline-a-src/hello.wav" 2>/dev/null || echo "  (Pipeline A sample not fetched: run gcloud auth login)"; fi
if [ -d "$AUD/pipeline-a-src" ]; then for f in "$AUD"/pipeline-a-src/*.wav; do [ -e "$f" ] || continue; n=$(basename "$f" .wav); ffmpeg -v error -y -i "$f" -ac 1 -ar 24000 -c:a aac -b:a 64k "$AUD/toy/pa-$n.m4a"; done; fi

rm -rf "$TMP"

# 9) The images the deploy build serves but never encodes (a Vercel build has no cwebp): responsive variants, PNG → WebP
#    and SVGO output, into assets/gen/ (indexed by assets/gen/variants.json). Re-run this line alone after changing a
#    page's images: node tools/optimize.mjs --make-variants (it builds dist/ too, and removes unused variants).
python3 tools/build-pages.py >/dev/null
node tools/optimize.mjs --make-variants
echo "assets built (commit them: they are the site's media):"; du -sh "$IMG" "$VID" "$AUD" assets/gen
