#!/bin/bash
# Builds every web-ready asset for the redesign prototype from the source files.
# Run from website/redesign: bash tools/build-assets.sh
# Needs ffmpeg + cwebp (Homebrew). Sources are read, never modified.
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

# 2) Logo.
cp "$CODE/Kheelona_Logo.svg" "$IMG/kheelona-logo.svg"

# 3) Parent-app screens (already WebP in the site).
for s in transcript activity privacy; do cp "$SITE/src/assets/app/app-$s.webp" "$IMG/app-$s.webp"; done

# 4) Lifestyle photos (illustrative), 960w WebP.
for p in myra-01-breakfast-why kabir-03-homework-desk ira-03-festive-evening-song myra-03-bedtime-cuddle tara-02-evening-with-amma advik-02-whispering-to-kheelu; do
  ffmpeg -v error -y -i "$DS/Photo library/$p-web.webp" -vf "scale=960:-2:flags=lanczos" "$TMP/$p.png"
  cwebp -quiet -q 78 -m 6 "$TMP/$p.png" -o "$IMG/$p.webp"
done

# 5) Real-family films: full file (played on tap) + 6s silent preview loop + poster.
# macOS ships bash 3.2 (no associative arrays): "id:start-second" pairs.
for pair in learning-by-asking:4 a-mother-joins-in:6 a-father-speaks:8 first-conversations:5 counting-out-loud:6 a-story-in-two-languages:9 a-parent-speaks:10; do
  id=${pair%%:*}; start=${pair##*:}
  src="$SITE/public/video/moments/$id.mp4"
  cp "$src" "$VID/$id.mp4"
  ffmpeg -v error -y -ss "$start" -t 6 -i "$src" -an -vf "scale=432:-2,fps=24" -c:v libx264 -profile:v main -crf 28 -preset slow -movflags +faststart -pix_fmt yuv420p "$VID/$id-loop.mp4"
  ffmpeg -v error -y -ss "$start" -i "$src" -frames:v 1 -vf "scale=432:-2" "$TMP/$id.png"
  cwebp -quiet -q 72 "$TMP/$id.png" -o "$IMG/poster-$id.webp"
done
cp "$SITE/public/video/expert/expert-clip.mp4" "$VID/expert-clip.mp4"
ffmpeg -v error -y -ss 3 -i "$VID/expert-clip.mp4" -frames:v 1 -vf "scale=960:-2" "$TMP/expert.png"
cwebp -quiet -q 75 "$TMP/expert.png" -o "$IMG/poster-expert.webp"

# 6) Recognition marks.
for r in nvidia-inception karnataka-seal nasscom; do cp "$SITE/public/recognition/$r.png" "$IMG/$r.png"; done

# 7) Toy-button sounds (from the launch film's SFX), tiny AAC files played only when a visitor taps a button.
AUD=assets/audio; mkdir -p "$AUD"; SFX="$CODE/kheelu-launch-film/public/kheelu/audio/sfx"
for pair in listen:0 tap:0 tick:0 toggle:0 delete:0 pop:0 musicbox:4; do
  id=${pair%%:*}; len=${pair##*:}; T=""; [ "$len" != 0 ] && T="-t $len -af afade=t=out:st=$((len-1)):d=1"
  ffmpeg -v error -y -i "$SFX/$id.wav" $T -ac 1 -c:a aac -b:a 64k "$AUD/$id.m4a"
done

rm -rf "$TMP"
echo "assets built:"; du -sh "$IMG" "$VID" "$AUD"
