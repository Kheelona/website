#!/usr/bin/env bash
# Share images, product images and icons that search engines, social cards and old links ask for (needs ffmpeg).
#
#   bash tools/build-seo-images.sh        run from anywhere; writes into website/redesign
#
# Only the CURRENT toy is ever rendered: every toy image comes from code/Khelu_By_Kheelona.png (never the previous toy's
# packshot or close-ups). The paths are the ones production and old shares already use, so they keep resolving:
#   og/kheelu.jpg            1200×630  default share card (every page without its own)
#   og.png                   1200×630  Organization `image` (production path)
#   media/kheelu-front.jpg   1200×1200 Product `image` (beta path, white ground for shopping surfaces)
#   product/lumi.png         640×640   production's old product image path, now the current toy
#   og/<photo>.jpg           1200×630  one per story photo: beta's curated crops (copied once from origin/beta), or a
#                                      centre crop of assets/img/stories/<photo>.webp for a photo beta never had
#   brand/logo-mark.png, favicon.ico, icon.svg, icon.png, icon-192.png, icon-512.png, apple-touch-icon.png,
#   apple-icon.png           the Kheelona mark (design-system/project/assets/Logo on origin/beta)
# tools/build-pages.py copies each article's card to stories/<slug>.jpg (production's per-article share path).
set -euo pipefail
cd "$(dirname "$0")/.."
TOY="../../Khelu_By_Kheelona.png"
[[ -f "$TOY" ]] || { echo "build-seo-images: $TOY not found" >&2; exit 1; }
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
mkdir -p og media product brand
CREAM=0xFBF5EB

# The toy, cropped to the plush (the same crop tools/build-assets.sh uses for kheelu-*.webp).
ffmpeg -v error -y -i "$TOY" -vf "crop=1696:2070:41:144" -pix_fmt rgba "$TMP/toy.png"

card() { # $1 out, $2 w, $3 h, $4 toy height, $5 ground colour, $6 extra encoder args
  ffmpeg -v error -y -f lavfi -i "color=c=$5:s=$2x$3" -i "$TMP/toy.png" \
    -filter_complex "[1]scale=-1:$4:flags=lanczos[t];[0][t]overlay=(W-w)/2:(H-h)/2:format=auto,format=rgb24" \
    -frames:v 1 $6 "$1"
}
card og/kheelu.jpg 1200 630 570 $CREAM "-q:v 3"
card og.png 1200 630 570 $CREAM "-compression_level 9"
card media/kheelu-front.jpg 1200 1200 1080 white "-q:v 3"
card product/lumi.png 640 640 576 white "-compression_level 9"

# Story photos: beta's curated 1200×630 crops, else a centre crop of the redesign's own WebP.
BETA_OG=$(git -C .. ls-tree --name-only origin/beta public/og/ 2>/dev/null || true)
for webp in assets/img/stories/*.webp; do
  key=$(basename "$webp" .webp); [[ "$key" == *-640 ]] && continue
  [[ -f "og/$key.jpg" ]] && continue
  if grep -qx "public/og/$key.jpg" <<<"$BETA_OG"; then git -C .. show "origin/beta:public/og/$key.jpg" > "og/$key.jpg"
  else ffmpeg -v error -y -i "$webp" -vf "scale=1200:630:force_original_aspect_ratio=increase:flags=lanczos,crop=1200:630" -q:v 3 "og/$key.jpg"; fi
done

# The Kheelona mark (not the toy): logo and icons.
logo() { git -C .. show "origin/beta:$1"; }
logo public/brand/logo-mark.png > brand/logo-mark.png
logo src/app/favicon.ico > favicon.ico
logo design-system/project/assets/Logo/kheelona-app-icon.svg > icon.svg
logo design-system/project/assets/Logo/apple-touch-icon-180.png > apple-touch-icon.png
cp apple-touch-icon.png apple-icon.png
logo design-system/project/assets/Logo/app-icon-512.png > icon-512.png
ffmpeg -v error -y -i icon-512.png -vf scale=192:192:flags=lanczos icon-192.png
logo src/app/icon.png > icon.png
echo "build-seo-images: og/ ($(ls og | wc -l | tr -d ' ') cards), og.png, media/kheelu-front.jpg, product/lumi.png, brand/logo-mark.png, icons"
