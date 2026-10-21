#!/usr/bin/env python3
"""Build every page other than home: pages/<route>.html → <route>/index.html, wrapped in the shared shell
(pages/_shell: nav, footer, bottom bar), so the nav and footer never drift between pages.

A page source starts with a JSON block in a comment, then optional <head-extra>…</head-extra> (JSON-LD), then the
contents of <main>:

    <!--page
    {"path": "/team", "title": "…", "description": "…", "css": ["team"], "js": ["team"],
     "ogImageAlt": "…"}
    -->
    <head-extra><script type="application/ld+json">…</script></head-extra>
    <section class="ph">…</section>

Usage: python3 tools/build-pages.py   (run from website/redesign; then serve the folder and open /team etc.)
"""
import html, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "pages")
SHELL = os.path.join(SRC, "_shell")
read = lambda p: open(p, encoding="utf-8").read()

NAV, FOOTER, AFTER = (read(os.path.join(SHELL, f)) for f in ("nav.html", "footer.html", "after.html"))
FACTS = json.loads(read(os.path.join(SHELL, "facts.json")))


def apply_facts(text):
    """Owner-confirmed facts win over the beta wording (pages/_shell/facts.json)."""
    for old, new in FACTS["replace"]:
        text = text.replace(old, new)
    for pattern in FACTS.get("remove_regex", []):
        text = re.sub(pattern, "", text, flags=re.S)
    return text
OG_IMAGE = "https://kheelona.com/og/kheelu.jpg"
OG_ALT = "Khelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy."


def nav_for(path):
    """Mark the nav link for this page (and for a story, the Stories link) with aria-current."""
    out = NAV
    for href in ("/products/kheelu", "/safety", "/stories", "/team"):
        if path == href or path.startswith(href + "/"):
            out = out.replace(f'<a href="{href}">', f'<a href="{href}" aria-current="page">')
    return out


def page(meta, head_extra, body):
    path = meta["path"]
    url = "https://kheelona.com" + (path if path != "/" else "")
    t, d = html.escape(meta["title"]), html.escape(meta["description"])
    alt = html.escape(meta.get("ogImageAlt", OG_ALT))
    css = "".join(f'\n<link rel="stylesheet" href="/assets/css/pages/{c}.css">' for c in meta.get("css", []))
    js = "".join(f'\n<script src="/assets/js/pages/{j}.js" defer></script>' for j in meta.get("js", []))
    js += "".join(f'\n<script type="module" src="/assets/js/pages/{m}.js"></script>' for m in meta.get("modules", []))
    return f"""<!doctype html>
<html lang="en-IN" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{t}</title>
<meta name="description" content="{d}">
<!-- Prototype: kept out of search until it replaces the live page (production uses index, follow). -->
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{d}">
<meta property="og:url" content="{url}">
<meta property="og:site_name" content="Kheelona">
<meta property="og:locale" content="en_IN">
<meta property="og:image" content="{OG_IMAGE}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{alt}">
<meta property="og:type" content="{meta.get('ogType', 'website')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{t}">
<meta name="twitter:description" content="{d}">
<meta name="twitter:image" content="{OG_IMAGE}">
<meta name="twitter:image:alt" content="{alt}">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="/assets/img/kheelu-240.webp" type="image/webp">
<link rel="preload" href="/assets/fonts/inter-tight-var-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.min.css">
<link rel="stylesheet" href="/assets/css/pages.css">{css}
<script>document.documentElement.classList.replace('no-js','js')</script>
{head_extra.strip()}
<!-- Tracking (unchanged at integration): Meta Pixel 1051265191046395, GA4 and PostHog load from the site shell, never in this prototype. Every button keeps its data-ph-capture-attribute-cta value. -->
</head>
<body class="page page--{meta.get('slug', path.strip('/').replace('/', '-') or 'home')}">
<a class="skip" href="#main">Skip to content</a>

{nav_for(path)}
<main id="main">
{body.strip()}
</main>

{FOOTER}
{AFTER}
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/lenis.min.js" defer></script>
<script src="/assets/js/main.min.js" defer></script>
<script src="/assets/js/pages.js" defer></script>{js}
</body>
</html>
"""


def build(src):
    s = read(src)
    m = re.match(r"\s*<!--page\s*(\{.*?\})\s*-->", s, re.S)
    if not m:
        sys.exit(f"{src}: missing <!--page {{…}} --> block")
    meta = json.loads(m.group(1))
    s = s[m.end():]
    head = ""
    h = re.search(r"<head-extra>(.*?)</head-extra>", s, re.S)
    if h:
        head, s = h.group(1), s[: h.start()] + s[h.end():]
    out_dir = os.path.join(ROOT, meta["path"].strip("/"))
    os.makedirs(out_dir, exist_ok=True)
    meta = json.loads(apply_facts(json.dumps(meta, ensure_ascii=False)))
    open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8").write(page(meta, apply_facts(head), apply_facts(s)))
    return meta["path"]


if __name__ == "__main__":
    built = []
    for d, _, files in os.walk(SRC):
        if os.path.basename(d) == "_shell":
            continue
        for f in sorted(files):
            if f.endswith(".html"):
                built.append(build(os.path.join(d, f)))
    print(f"built {len(built)} pages: " + ", ".join(sorted(built)))
