#!/usr/bin/env bash
# The one command for a deployable build of the redesign: a complete static site in redesign/dist/.
#
#   bash tools/build-site.sh                 stories from the committed snapshot (BLOG_SYNC=off), then build + optimise
#   BLOG_SYNC=on bash tools/build-site.sh    refresh the stories from the dashboard API first
#   CSS_MODE=link bash tools/build-site.sh   link one hashed stylesheet per page instead of inlining it
#
# 1. tools/publish-stories.sh: sync the dashboard's posts (the live rule), generate /stories, build every page
#    (python3 tools/build-pages.py runs inside it).
# 2. node tools/optimize.mjs: bundle, minify, responsive images, content-hashed assets → dist/ (sources untouched).
# Serve dist/ at the site root. Cache rules: dist/asset-manifest.json → "cache".
# Needs only Node ≥ 22 (with the website's npm devDependencies: esbuild, pinned) and python3, so it runs in a
# git-triggered Vercel build. It never encodes media: every image, loop, poster, audio clip and responsive variant is
# committed (made on a Mac by tools/build-assets.sh), and optimize.mjs fails, listing them, if one is missing or stale.
set -euo pipefail
cd "$(dirname "$0")/.."
export BLOG_SYNC="${BLOG_SYNC:-off}"

for f in assets/img/kheelu-800.webp assets/video/learning-by-asking-loop.mp4 assets/gen/variants.json \
         ../public/video/moments/learning-by-asking.mp4 ../public/video/expert/expert-clip.mp4; do
  [[ -f "$f" ]] || { echo "build-site: $f is missing (committed media; made by bash tools/build-assets.sh)." >&2; exit 1; }
done

bash tools/publish-stories.sh
node tools/optimize.mjs
echo "build-site: dist/ is ready ($(du -sh dist | cut -f1))"
