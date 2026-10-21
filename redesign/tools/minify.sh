#!/bin/bash
# Minify the hand-written CSS/JS that index.html loads (site.min.css, main.min.js). Run after editing either source.
set -euo pipefail
cd "$(dirname "$0")/.."
npx -y esbuild@0.24.0 assets/css/site.css --minify --outfile=assets/css/site.min.css --log-level=warning
npx -y esbuild@0.24.0 assets/js/main.js --minify --outfile=assets/js/main.min.js --log-level=warning
echo "minified"
