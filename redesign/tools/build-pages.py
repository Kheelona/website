#!/usr/bin/env python3
"""Build every page other than home: pages/<route>.html → <route>/index.html, wrapped in the shared shell
(pages/_shell: nav, footer, bottom bar), so the nav and footer never drift between pages. It also writes the search
files at the redesign root and keeps home's JSON-LD in step (one source: pages/_shell/seo.json).

A page source starts with a JSON block in a comment, then optional <head-extra>…</head-extra> (JSON-LD, preloads), then
the contents of <main>:

    <!--page
    {"path": "/team", "title": "…", "description": "…", "css": ["team"], "js": ["team"], "updated": "2026-10-22",
     "ogImage": "/og/….jpg", "ogImageAlt": "…"}
    -->
    <head-extra><script type="application/ld+json">…</script></head-extra>
    <section class="ph">…</section>

Optional meta: "updated" (the day the page's words last changed: sitemap lastmod and the WebPage's dateModified),
"crumb" (its breadcrumb name; default from seo.json "crumbs"), "ogImage"/"ogImageAlt", "ogType", "output" (a file name
at the root instead of <route>/index.html, e.g. 404.html), "noindex" and "sitemap": false. Generated stories also carry
"published", "author" and "topic" (tools/generate-stories.mjs).

What the build does for search (SEO / AEO / GEO):
- Every <head>: title, description, a `<!--robots-->` marker (the Next app writes `noindex` there on non-production
  hosts; production stays index, follow), an absolute slash-less canonical, Open Graph + Twitter with a share image that
  exists here, icons, the manifest, and `<!--tracking-head-->` right before </head>; `<!--tracking-body-->` right before
  </body> (the Next app injects GA4, PostHog, Ahrefs and the Meta pixel there).
- JSON-LD, one graph per page: the site's Organization, founders (Person), WebSite and, on home and the product page, the
  Product + Offer from seo.json (the same @ids everywhere); a WebPage node (ContactPage, AboutPage, CollectionPage…)
  with its BreadcrumbList; the page's own nodes (FAQPage, HowTo, BlogPosting) kept, Organization/WebSite copies
  dropped. /stories gets a Blog of every guide. Home's FAQPage is read from its visible questions.
- A visible breadcrumb (`nav > ol.crumbs`) on every page but home.
- Root files: sitemap.xml, robots.txt, llms.txt, pricing.md (from pages/_shell/llms.txt and pricing.md), 404.html,
  site.webmanifest, manifest.json (every route, its file, title, lastmod and share image, the static files, and the
  redirect map, for the Next app), and stories/<slug>.jpg (production's per-article share path).
- Guards: one H1 per page, every FAQPage question visible on its page, titles ≤ 60 characters, every share image on
  disk. A failure stops the build.

Usage: python3 tools/build-pages.py   (run from website/redesign; then serve the folder and open /team etc.)
"""
import html, json, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "pages")
SHELL = os.path.join(SRC, "_shell")
read = lambda p: open(p, encoding="utf-8").read()


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


NAV, FOOTER, AFTER = (read(os.path.join(SHELL, f)) for f in ("nav.html", "footer.html", "after.html"))
FACTS = json.loads(read(os.path.join(SHELL, "facts.json")))
SEO = json.loads(read(os.path.join(SHELL, "seo.json")))
ORIGIN = SEO["origin"]
ORG_ID, WEBSITE_ID, PRODUCT_ID = ORIGIN + "/#organization", ORIGIN + "/#website", SEO["product"]["@id"]
PAGE_TYPES = ("WebPage", "AboutPage", "ContactPage", "CollectionPage", "FAQPage", "ItemPage", "ProfilePage")
LD_RE = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.S)
BLOG_NAME = "Kheelona parenting guides"
errors = []


def apply_facts(text):
    """Owner-confirmed facts win over the beta wording (pages/_shell/facts.json)."""
    for old, new in FACTS["replace"]:
        text = text.replace(old, new)
    for pattern in FACTS.get("remove_regex", []):
        text = re.sub(pattern, "", text, flags=re.S)
    return text


def absolute(path):
    """An absolute, slash-less URL on the production origin (home is the bare origin)."""
    if path.startswith("http"):
        return path
    return ORIGIN + ("" if path == "/" else path)


def ld_script(nodes):
    data = json.dumps({"@context": "https://schema.org", "@graph": nodes}, ensure_ascii=False, separators=(",", ":"))
    return '<script type="application/ld+json">' + data.replace("</", "<\\/") + "</script>"


def text_of(fragment):
    """Visible words of an HTML fragment, entities decoded, whitespace collapsed."""
    t = re.sub(r"<sup>.*?</sup>", "", fragment, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html.unescape(t)).strip().replace(" .", ".").replace(" ,", ",").replace(" :", ":")


def norm(s):
    return re.sub(r"[^a-z0-9]+", " ", html.unescape(s).replace("‑", "-").lower()).strip()


def nav_for(path):
    """Mark the nav link for this page (and for a story, the Stories link) with aria-current."""
    out = NAV
    for href in ("/products/kheelu", "/safety", "/stories", "/team"):
        if path == href or path.startswith(href + "/"):
            out = out.replace(f'<a href="{href}">', f'<a href="{href}" aria-current="page">')
    return out


WATCH_FILM = ('<button class="btn btn--ghost ctabar__watch" data-magnetic type="button" '
              'data-video="/video/moments/learning-by-asking.mp4" data-ph-capture-attribute-cta="hero-film">'
              '<span class="play" aria-hidden="true"><svg viewBox="0 0 10 12"><path d="M0 0l10 6-10 6z"/></svg></span>'
              '<span class="label-long">Watch Khelu ask · 0:30</span><span class="label-short">Watch</span></button>')


def after_for(path):
    """The bar after the footer: "Watch" only on the product page, where it plays the 0:30 film in place (home has its own
    bar, in index.html); every other page shows the price and Pre-order only."""
    return AFTER.replace("<!--ctabar-watch-->", WATCH_FILM if path == "/products/kheelu" else "")


# ── the page model ─────────────────────────────────────────────────────────────────────────────────────────
def parse(src):
    s = read(src)
    m = re.match(r"\s*<!--page\s*(\{.*?\})\s*-->", s, re.S)
    if not m:
        sys.exit(f"{src}: missing <!--page {{…}} --> block")
    meta = json.loads(apply_facts(m.group(1)))
    s = s[m.end():]
    head = ""
    h = re.search(r"<head-extra>(.*?)</head-extra>", s, re.S)
    if h:
        head, s = h.group(1), s[: h.start()] + s[h.end():]
    head, body = apply_facts(head), apply_facts(s)
    nodes = []
    for block in LD_RE.findall(head):
        try:
            data = json.loads(block)
        except json.JSONDecodeError as e:
            sys.exit(f"{src}: JSON-LD does not parse: {e}")
        for n in data.get("@graph", [data]):
            # One source for the site's entities and the breadcrumb: seo.json and this build.
            if n.get("@id") in (ORG_ID, WEBSITE_ID, PRODUCT_ID) or n.get("@type") in ("Organization", "WebSite", "Product", "BreadcrumbList"):
                continue
            nodes.append(n)
    head = LD_RE.sub("", head).strip()
    path = meta["path"]
    meta.setdefault("ogType", "website")
    if not meta.get("updated") and SEO.get("updated", {}).get(path):
        meta["updated"] = SEO["updated"][path]
    return {"src": src, "meta": meta, "head": head, "body": body, "nodes": nodes, "path": path, "url": absolute(path),
            "article": path.startswith("/stories/")}


def share_image(page):
    meta = page["meta"]
    img = meta.get("ogImage")
    if not img:
        post = next((n for n in page["nodes"] if n.get("@type") == "BlogPosting"), None)
        img = post.get("image") if post else None
        if isinstance(img, dict):
            img = img.get("url")
        if img and img.startswith(ORIGIN):
            img = img[len(ORIGIN):]
    img = img or SEO["defaultOg"]["image"]
    local = not img.startswith("http")
    if local and not os.path.isfile(os.path.join(ROOT, img.lstrip("/"))):
        errors.append(f"{page['path']}: share image {img} is not on disk (run bash tools/build-seo-images.sh)")
    return {"path": img, "url": absolute(img), "local": local, "alt": meta.get("ogImageAlt") or SEO["defaultOg"]["alt"]}


def crumbs_for(page):
    """[(name, path)] from home to this page; an article goes Home › Stories › its topic › itself."""
    meta, path = page["meta"], page["path"]
    items = [("Home", "/")]
    if page["article"]:
        items.append((SEO["crumbs"]["/stories"], "/stories"))
        topic = meta.get("topic")
        if topic:
            items.append((topic["title"], f"/stories#{topic['id']}"))
        items.append((meta.get("crumb") or re.sub(r"\s*·\s*Kheelona$", "", meta["title"]), path))
    else:
        items.append((meta.get("crumb") or SEO["crumbs"].get(path) or re.sub(r"\s*·\s*Kheelona$", "", meta["title"]), path))
    return items


def crumbs_html(items, show_last=True):
    """The visible trail. A guide stops at its topic (its H1 follows straight after); other pages end on themselves."""
    lis = []
    if not show_last:
        items = items[:-1]
        return '<nav aria-label="Breadcrumb"><ol class="crumbs">' + "".join(
            f'<li><a href="{p}">{html.escape(n)}</a></li>' for n, p in items) + "</ol></nav>"
    for i, (name, path) in enumerate(items):
        if i == len(items) - 1:
            lis.append(f'<li aria-current="page">{html.escape(name)}</li>')
        else:
            lis.append(f'<li><a href="{path}">{html.escape(name)}</a></li>')
    return f'<nav aria-label="Breadcrumb"><ol class="crumbs">{"".join(lis)}</ol></nav>'


def place_crumbs(body, items, article=False):
    """Replace the page's own breadcrumb, or put one above the hero's eyebrow (or its H1)."""
    nav = crumbs_html(items, show_last=not article)
    own = re.search(r'(?:<nav aria-label="Breadcrumb">\s*)?<ol class="crumbs[^"]*">.*?</ol>(?:\s*</nav>)?', body, re.S)
    if own:
        return body[: own.start()] + nav + body[own.end():]
    h1 = re.search(r"<h1[\s>]", body)
    if not h1:
        return body
    before = body[: h1.start()]
    eyebrow = re.search(r'<p class="eyebrow[^"]*">[^<]*(?:<[^>]+>[^<]*)*?</p>\s*$', before)
    at = eyebrow.start() if eyebrow else h1.start()
    indent = re.search(r"[ \t]*$", body[:at]).group(0)
    return body[:at] + nav + "\n" + indent + body[at:]


def breadcrumb_node(page, items):
    els = []
    for i, (name, path) in enumerate(items, 1):
        el = {"@type": "ListItem", "position": i, "name": name}
        if i < len(items):
            el["item"] = absolute(path)
        else:
            el["item"] = page["url"]
        els.append(el)
    return {"@type": "BreadcrumbList", "@id": page["url"] + "#breadcrumb", "itemListElement": els}


def person(node):
    """A founder reference (by @id or name) as the same full Person node every page carries."""
    for p in SEO["people"]:
        if node.get("@id") == p["@id"] or node.get("name") == p["name"]:
            return {"@id": p["@id"]}
    return node


def page_graph(page, img, items, extra=()):
    meta, url = page["meta"], page["url"]
    nodes = [dict(n) for n in page["nodes"]]
    web = next((n for n in nodes if n.get("@type") in PAGE_TYPES and n.get("@type") != "FAQPage"), None)
    if web is None:
        web = {"@type": "CollectionPage" if page["path"] == "/stories" else "WebPage"}
        nodes.insert(0, web)
    web.update({"@id": url + "#webpage", "url": url, "name": re.sub(r"\s*·\s*Kheelona$", "", meta["title"]),
                "description": meta["description"], "isPartOf": {"@id": WEBSITE_ID}, "inLanguage": SEO["locale"],
                "primaryImageOfPage": {"@type": "ImageObject", "url": img["url"], **({"width": 1200, "height": 630} if img["local"] else {})}})
    if items:
        web["breadcrumb"] = {"@id": url + "#breadcrumb"}
    if meta.get("updated"):
        web["dateModified"] = meta["updated"]
    if meta.get("published"):
        web["datePublished"] = meta["published"]
    if page["path"] == "/products/kheelu":
        web["mainEntity"] = {"@id": PRODUCT_ID}
    if page["path"] == "/team":
        web["about"] = {"@id": ORG_ID}
    for n in nodes:
        t = n.get("@type")
        if t == "FAQPage":
            n.setdefault("@id", url + "#faq")
            n.setdefault("isPartOf", {"@id": url + "#webpage"})
        elif t == "HowTo":
            n.setdefault("@id", url + "#howto")
        elif t == "BlogPosting":
            n["mainEntityOfPage"] = {"@id": url + "#webpage"}
            n["isPartOf"] = {"@type": "Blog", "@id": ORIGIN + "/stories#blog", "name": BLOG_NAME, "url": ORIGIN + "/stories"}
            n["publisher"] = {"@id": ORG_ID}
            if isinstance(n.get("author"), dict):
                n["author"] = person(n["author"])
            if img["local"]:
                n["image"] = {"@type": "ImageObject", "url": img["url"], "width": 1200, "height": 630}
    graph = [SEO["organization"], *SEO["people"], SEO["website"]]
    if page["path"] == "/products/kheelu":
        graph.append(SEO["product"])
    graph += nodes + list(extra)
    if items:
        graph.append(breadcrumb_node(page, items))
    return graph


def blog_node(articles):
    """/stories: the Blog and every guide in it, newest change first."""
    posts = []
    for a in sorted(articles, key=lambda a: (a["meta"].get("updated", ""), a["path"]), reverse=True):
        bp = next(n for n in a["nodes"] if n.get("@type") == "BlogPosting")
        img = share_image(a)
        posts.append({k: v for k, v in {
            "@type": "BlogPosting", "@id": a["url"] + "#article", "url": a["url"], "headline": bp.get("headline"),
            "description": bp.get("description"), "datePublished": bp.get("datePublished"), "dateModified": bp.get("dateModified"),
            "author": person(bp["author"]) if isinstance(bp.get("author"), dict) else {"@id": ORG_ID},
            "image": img["url"], "inLanguage": SEO["locale"]}.items() if v})
    return {"@type": "Blog", "@id": ORIGIN + "/stories#blog", "url": ORIGIN + "/stories", "name": BLOG_NAME,
            "description": "Parenting guides for 3 to 7 year olds: screen time, talking and language, learning and play, and AI toys and safety.",
            "inLanguage": SEO["locale"], "publisher": {"@id": ORG_ID}, "mainEntityOfPage": {"@id": ORIGIN + "/stories#webpage"},
            "blogPost": posts}


# ── the <head> ─────────────────────────────────────────────────────────────────────────────────────────────
def icons():
    return """<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">"""


def head_meta(meta, url, img, canonical=True):
    t, d = html.escape(meta["title"]), html.escape(meta["description"])
    alt = html.escape(img["alt"])
    dims = '\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">' if img["local"] else ""
    article = ""
    if meta.get("ogType") == "article":
        article = "".join(f'\n<meta property="article:{k}" content="{html.escape(v)}">' for k, v in (
            ("published_time", meta.get("published")), ("modified_time", meta.get("updated")),
            ("author", meta.get("author")), ("section", (meta.get("topic") or {}).get("title"))) if v)
    robots = '<meta name="robots" content="noindex">\n<!--robots-->' if meta.get("noindex") else "<!--robots-->"
    canon = f'\n<link rel="canonical" href="{url}">' if canonical else ""
    return f"""<title>{t}</title>
<meta name="description" content="{d}">
{robots}{canon}
<meta property="og:title" content="{t}">
<meta property="og:description" content="{d}">
<meta property="og:url" content="{url}">
<meta property="og:site_name" content="{SEO['siteName']}">
<meta property="og:locale" content="en_IN">
<meta property="og:type" content="{meta.get('ogType', 'website')}">
<meta property="og:image" content="{img['url']}">{dims}
<meta property="og:image:alt" content="{alt}">{article}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{t}">
<meta name="twitter:description" content="{d}">
<meta name="twitter:image" content="{img['url']}">
<meta name="twitter:image:alt" content="{alt}">
<meta name="theme-color" content="{SEO['themeColor']}">
{icons()}"""


def render(page, graph):
    meta, path = page["meta"], page["path"]
    img = page["img"]
    css = "".join(f'\n<link rel="stylesheet" href="/assets/css/pages/{c}.css">' for c in meta.get("css", []))
    js = "".join(f'\n<script src="/assets/js/pages/{j}.js" defer></script>' for j in meta.get("js", []))
    js += "".join(f'\n<script type="module" src="/assets/js/pages/{m}.js"></script>' for m in meta.get("modules", []))
    head_extra = (page["head"] + "\n" if page["head"] else "") + (ld_script(graph) if graph else "")
    return f"""<!doctype html>
<html lang="en-IN" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
{head_meta(meta, page['url'], img, canonical=not meta.get('noindex'))}
<link rel="preload" href="/assets/fonts/glory-var-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/instrument-sans-var-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.min.css">
<link rel="stylesheet" href="/assets/css/pages.css">{css}
<script>document.documentElement.classList.replace('no-js','js')</script>
{head_extra}
<!--tracking-head-->
</head>
<body class="page page--{meta.get('slug', path.strip('/').replace('/', '-') or 'home')}">
<a class="skip" href="#main">Skip to content</a>

{nav_for(path)}
<main id="main">
{page['body'].strip()}
</main>

{FOOTER}
{after_for(path)}
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/lenis.min.js" defer></script>
<script src="/assets/js/main.min.js" defer></script>
<script src="/assets/js/pages.js" defer></script>{js}
<!--tracking-body-->
</body>
</html>
"""


# ── guards ─────────────────────────────────────────────────────────────────────────────────────────────────
def check(path, title, body, graph):
    h1s = len(re.findall(r"<h1[\s>]", body))
    if h1s != 1:
        errors.append(f"{path}: {h1s} H1s (one per page)")
    if len(title) > 60:
        errors.append(f"{path}: title is {len(title)} characters (≤ 60): {title}")
    visible = norm(text_of(body))
    for n in graph:
        if n.get("@type") == "FAQPage":
            for q in n["mainEntity"]:
                if norm(q["name"]) not in visible:
                    errors.append(f"{path}: FAQ question not visible on the page: {q['name']}")


# ── home (index.html is hand-written; only its JSON-LD block is kept in step here) ───────────────────────────
def home_faq(body):
    qs = []
    for m in re.finditer(r'<details name="faq"[^>]*>\s*<summary>(.*?)</summary>(.*?)</details>', body, re.S):
        qs.append({"@type": "Question", "name": text_of(m.group(1)), "acceptedAnswer": {"@type": "Answer", "text": text_of(m.group(2))}})
    return qs


def sync_home():
    p = os.path.join(ROOT, "index.html")
    s = read(p)
    m = re.search(r"<!--seo:jsonld-->.*?<!--/seo:jsonld-->", s, re.S)
    if not m:
        errors.append("index.html: no <!--seo:jsonld--> … <!--/seo:jsonld--> block")
        return None
    body = re.search(r"<main.*?</main>", s, re.S).group(0)
    H = SEO["home"]
    title = html.unescape(re.search(r"<title>(.*?)</title>", s).group(1))
    desc = html.unescape(re.search(r'<meta name="description" content="(.*?)"', s).group(1))
    img = {"url": absolute(SEO["defaultOg"]["image"]), "local": True}
    web = {"@type": "WebPage", "@id": ORIGIN + "/#webpage", "url": ORIGIN, "name": title, "description": desc,
           "isPartOf": {"@id": WEBSITE_ID}, "about": {"@id": ORG_ID}, "mainEntity": {"@id": PRODUCT_ID}, "inLanguage": SEO["locale"],
           "primaryImageOfPage": {"@type": "ImageObject", "url": img["url"], "width": 1200, "height": 630}, "dateModified": H["updated"]}
    faq = {"@type": "FAQPage", "@id": ORIGIN + "/#faq", "isPartOf": {"@id": ORIGIN + "/#webpage"}, "mainEntity": home_faq(body)}
    graph = [SEO["organization"], *SEO["people"], SEO["website"], web, SEO["product"], faq]
    block = "<!--seo:jsonld-->\n" + ld_script(graph) + "\n<!--/seo:jsonld-->"
    if s[m.start():m.end()] != block:
        write(p, s[: m.start()] + block + s[m.end():])
    check("/", title, body, graph)
    for marker in ("<!--robots-->", "<!--tracking-head-->\n</head>", "<!--tracking-body-->\n</body>"):
        if marker not in s:
            errors.append(f"index.html: missing {marker!r}")
    return {"path": "/", "file": "index.html", "title": title, "description": desc, "lastmod": H["updated"],
            "ogImage": SEO["defaultOg"]["image"], "type": "home", "priority": H.get("priority", 1.0)}


# ── root files ─────────────────────────────────────────────────────────────────────────────────────────────
def sitemap(routes):
    rows = []
    for r in routes:
        if not r["indexable"]:
            continue
        lm = f"\n<lastmod>{r['lastmod']}</lastmod>" if r.get("lastmod") else ""
        rows.append(f"<url>\n<loc>{absolute(r['path'])}</loc>{lm}\n<priority>{r['priority']}</priority>\n</url>")
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(rows) + "\n</urlset>\n"


def robots_txt():
    """Everyone is allowed; the answer engines are named too (each reads only its own group); Bytespider is not
    (beta's src/lib/seo/robots.ts, D041 G7). No Disallow for preview hosts: they send noindex instead, and a crawler
    has to fetch a page to read it."""
    groups = ["User-Agent: *\nAllow: /"]
    groups += [f"User-Agent: {ua}\nAllow: /" for ua in SEO["robots"]["allow"]]
    groups += [f"User-Agent: {ua}\nDisallow: /" for ua in SEO["robots"]["disallow"]]
    return "\n\n".join(groups) + f"\n\nSitemap: {ORIGIN}/sitemap.xml\n"


def machine_file(name, routes, articles):
    """llms.txt / pricing.md from their templates: {{pages}}, {{guides}} and {{articles}} are filled from the build."""
    t = read(os.path.join(SHELL, name))
    listed = sorted((r for r in routes if r["indexable"] and r["type"] != "article"), key=lambda r: (-r["priority"], r["path"]))
    pages = "\n".join(f"- [{r['label']}]({absolute(r['path'])})" for r in listed)
    topics, seen = [], set()
    for a in articles:
        tp = a["meta"].get("topic")
        if tp and tp["id"] not in seen:
            seen.add(tp["id"])
            topics.append(tp)
    guides = "\n".join(f"- [{tp['title']}]({ORIGIN}/stories#{tp['id']})" for tp in topics)
    short = lambda title: re.sub(r"\s*·\s*Kheelona$", "", title)  # outside the f-string: Python 3.9 (Vercel's build image)
    arts = "\n".join(f"- [{short(a['meta']['title'])}]({a['url']}): {a['meta']['description']}"
                     for a in sorted(articles, key=lambda a: a["path"]))
    return t.replace("{{pages}}", pages).replace("{{guides}}", guides).replace("{{articles}}", arts)


def webmanifest():
    return json.dumps({
        "name": "Kheelona", "short_name": "Kheelona", "description": "Khelu by Kheelona: a screen-free plush toy that talks, for ages 3 to 7.",
        "start_url": "/", "scope": "/", "display": "browser", "lang": "en-IN",
        "background_color": "#ffffff", "theme_color": SEO["themeColor"],
        "icons": [{"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
                  {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
                  {"src": "/icon.svg", "sizes": "any", "type": "image/svg+xml"}]}, indent=1, ensure_ascii=False) + "\n"


STATIC = ["sitemap.xml", "robots.txt", "llms.txt", "pricing.md", "404.html", "site.webmanifest", "favicon.ico", "icon.svg",
          "icon.png", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "apple-icon.png", "og.png", "og/",
          "media/", "brand/", "product/lumi.png", "assets/"]


def redirects():
    p = os.path.join(SHELL, "redirects.json")
    return json.loads(read(p))["redirects"] if os.path.isfile(p) else []


# ── main ───────────────────────────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    pages = []
    for d, dirs, files in os.walk(SRC):
        dirs.sort()
        if os.path.basename(d) == "_shell":
            continue
        for f in sorted(files):
            if f.endswith(".html"):
                pages.append(parse(os.path.join(d, f)))
    articles = [p for p in pages if p["article"]]
    routes = []
    home = sync_home()
    if home:
        routes.append({**home, "indexable": True, "label": SEO["siteName"]})
    for page in sorted(pages, key=lambda p: (p["article"], p["path"])):
        meta = page["meta"]
        page["img"] = share_image(page)
        items = None if meta.get("noindex") else crumbs_for(page)
        if items:
            page["body"] = place_crumbs(page["body"], items, page["article"])
        extra = [blog_node(articles)] if page["path"] == "/stories" else []
        graph = None if meta.get("noindex") else page_graph(page, page["img"], items, extra)
        out = meta.get("output") or os.path.join(page["path"].strip("/"), "index.html")
        write(os.path.join(ROOT, out), render(page, graph))
        check(page["path"], meta["title"], page["body"], graph or [])
        if page["article"] and page["img"]["local"]:
            # Production's per-article share path, /stories/<slug>.jpg, for old shares and caches.
            shutil.copyfile(os.path.join(ROOT, page["img"]["path"].lstrip("/")), os.path.join(ROOT, page["path"].lstrip("/") + ".jpg"))
        routes.append({"path": page["path"], "file": out, "title": meta["title"], "description": meta["description"],
                       "lastmod": meta.get("updated"), "ogImage": page["img"]["path"], "type": "article" if page["article"] else ("404" if meta.get("noindex") else "page"),
                       "indexable": not meta.get("noindex") and meta.get("sitemap", True),
                       "priority": SEO["priority"]["article"] if page["article"] else SEO["priority"].get(page["path"], 0.5),
                       "label": meta.get("crumb") or SEO["crumbs"].get(page["path"]) or meta["title"]})
    # Stale per-article share copies (a post that left the dashboard).
    live = {p["path"].rsplit("/", 1)[1] + ".jpg" for p in articles}
    for f in os.listdir(os.path.join(ROOT, "stories")):
        if f.endswith(".jpg") and f not in live:
            os.remove(os.path.join(ROOT, "stories", f))
    write(os.path.join(ROOT, "sitemap.xml"), sitemap(routes))
    write(os.path.join(ROOT, "robots.txt"), robots_txt())
    write(os.path.join(ROOT, "llms.txt"), machine_file("llms.txt", routes, articles))
    write(os.path.join(ROOT, "pricing.md"), machine_file("pricing.md", routes, articles))
    write(os.path.join(ROOT, "site.webmanifest"), webmanifest())
    write(os.path.join(ROOT, "manifest.json"), json.dumps({
        "_about": "For the Next app that serves this folder (built by tools/build-pages.py; do not edit). routes: every page, "
                  "its file, title, lastmod and share image; markers: where the app writes robots and tracking; "
                  "machineFiles: served as-is with these content types; static: the other public files and folders; "
                  "redirects: one-hop permanent redirects to recreate (query strings kept, trailing slash stripped first).",
        "origin": ORIGIN,
        "markers": {"robots": "<!--robots-->", "trackingHead": "<!--tracking-head-->", "trackingBody": "<!--tracking-body-->"},
        "routes": [{k: r[k] for k in ("path", "file", "type", "indexable", "title", "lastmod", "ogImage")} for r in routes],
        "machineFiles": {"/sitemap.xml": "application/xml; charset=utf-8", "/robots.txt": "text/plain; charset=utf-8",
                         "/llms.txt": "text/plain; charset=utf-8", "/pricing.md": "text/markdown; charset=utf-8",
                         "/site.webmanifest": "application/manifest+json"},
        "notFound": "404.html",
        "static": STATIC + ["stories/*.jpg"],
        "doNotServe": ["pages/", "tools/", "seo/", "README.md", "manifest.json"],
        "redirects": redirects(),
    }, indent=1, ensure_ascii=False) + "\n")
    if errors:
        print("build-pages: FAILED\n  " + "\n  ".join(errors), file=sys.stderr)
        sys.exit(1)
    built = [r["path"] for r in routes if r["path"] != "/"]
    print(f"built {len(built)} pages: " + ", ".join(sorted(built)))
    print("wrote sitemap.xml (%d URLs), robots.txt, llms.txt, pricing.md, site.webmanifest, manifest.json; synced index.html JSON-LD"
          % sum(1 for r in routes if r["indexable"]))
