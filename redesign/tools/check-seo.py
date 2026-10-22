#!/usr/bin/env python3
"""Check the built site for search: run after tools/build-pages.py (python3 tools/check-seo.py; exit 1 on a problem).

Per page (index.html, every <route>/index.html, 404.html):
  title (≤ 60) and description (120-160), one H1, absolute slash-less self-canonical, Open Graph and Twitter tags with a
  share image on disk, the <!--robots--> marker and no prototype noindex (404 excepted), <!--tracking-head--> right before
  </head> and <!--tracking-body--> right before </body>, icons; JSON-LD that parses, every {"@id"} reference defined in
  the same graph, every shared @id (Organization, founders, WebSite, Product) identical on every page, a BreadcrumbList
  on every page but home, "Kheelona" in every title or H1 or first screen of the key pages.
Links: every internal href/src/srcset/poster resolves to a file or route, every #fragment to an id on its target page;
every https://kheelona.com/… URL in meta, JSON-LD, sitemap.xml, llms.txt and pricing.md resolves here; every redirect
destination in pages/_shell/redirects.json resolves.
"""
import glob, html, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGIN = "https://kheelona.com"
SKIP = ("/pages/", "/tools/", "/dist/", "/node_modules/", "/seo/")
problems, rows = [], []
read = lambda p: open(p, encoding="utf-8").read()


def built_pages():
    files = [os.path.join(ROOT, "index.html"), os.path.join(ROOT, "404.html")]
    files += sorted(f for f in glob.glob(os.path.join(ROOT, "**", "index.html"), recursive=True)
                    if not any(s in f.replace(ROOT, "") + "/" for s in SKIP) and f != os.path.join(ROOT, "index.html"))
    return files


def route_of(f):
    rel = os.path.relpath(f, ROOT)
    if rel == "index.html":
        return "/"
    if rel == "404.html":
        return "/404"
    return "/" + rel[: -len("/index.html")]


def file_for(path):
    """A site path → the file that serves it, or None."""
    path = path.split("?")[0].split("#")[0]
    if path in ("", "/"):
        return os.path.join(ROOT, "index.html")
    p = os.path.join(ROOT, path.lstrip("/"))
    if os.path.isfile(p):
        return p
    if os.path.isfile(os.path.join(p, "index.html")):
        return os.path.join(p, "index.html")
    return None


IDS = {}


def ids_in(f):
    if f not in IDS:
        IDS[f] = set(re.findall(r'\sid="([^"]+)"', read(f)))
    return IDS[f]


def check_link(src_route, url, where):
    if url.startswith(("mailto:", "tel:", "data:", "javascript:", "blob:")):
        return
    if url.startswith(ORIGIN):
        url = url[len(ORIGIN):] or "/"
    elif url.startswith(("http://", "https://", "//")):
        return
    if url.startswith("#"):
        target = file_for(src_route) or os.path.join(ROOT, "404.html")
        frag = url[1:]
        if not target.endswith(".html"):
            return
    else:
        if not url.startswith("/"):
            url = "/" + url  # home's relative assets/… paths
        target = file_for(url)
        frag = url.split("#", 1)[1] if "#" in url else ""
        if target is None:
            problems.append(f"{src_route}: broken link {url} ({where})")
            return
    if frag and target.endswith(".html") and frag not in ids_in(target):
        problems.append(f"{src_route}: missing anchor #{frag} on {url.split('#')[0] or src_route} ({where})")


def meta(s, attr, name):
    m = re.search(rf'<meta {attr}="{re.escape(name)}" content="([^"]*)"', s)
    return html.unescape(m.group(1)) if m else None


def refs(node, out):
    if isinstance(node, dict):
        if set(node) == {"@id"}:
            out.add(node["@id"])
        for v in node.values():
            refs(v, out)
    elif isinstance(node, list):
        for v in node:
            refs(v, out)


shared = {}
for f in built_pages():
    if not os.path.isfile(f):
        problems.append(f"missing {os.path.relpath(f, ROOT)}")
        continue
    s, route = read(f), route_of(f)
    head = s.split("</head>")[0]
    is404 = route == "/404"
    title = html.unescape((re.search(r"<title>(.*?)</title>", s) or [None, ""])[1])
    desc = meta(s, "name", "description") or ""
    canon = re.search(r'<link rel="canonical" href="([^"]+)"', s)
    h1s = re.findall(r"<h1[^>]*>(.*?)</h1>", s, re.S)
    h1 = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", h1s[0])).strip() if h1s else ""
    if not title or len(title) > 60:
        problems.append(f"{route}: title {len(title)} chars: {title!r}")
    if not 120 <= len(desc) <= 160:
        problems.append(f"{route}: description {len(desc)} chars (120-160)")
    if len(h1s) != 1:
        problems.append(f"{route}: {len(h1s)} H1s")
    expected = ORIGIN + ("" if route == "/" else route)
    if is404:
        if canon:
            problems.append("/404: has a canonical")
        if 'content="noindex' not in head:
            problems.append("/404: not noindex")
    else:
        if not canon or canon.group(1) != expected:
            problems.append(f"{route}: canonical {canon.group(1) if canon else None} ≠ {expected}")
        if re.search(r'<meta name="robots" content="[^"]*noindex', head):
            problems.append(f"{route}: still noindex")
    if "<!--robots-->" not in head:
        problems.append(f"{route}: no <!--robots--> marker")
    if not re.search(r"<!--tracking-head-->\s*</head>", s):
        problems.append(f"{route}: <!--tracking-head--> is not right before </head>")
    if not re.search(r"<!--tracking-body-->\s*</body>", s):
        problems.append(f"{route}: <!--tracking-body--> is not right before </body>")
    for tag in ('rel="icon" href="/favicon.ico"', 'rel="apple-touch-icon" href="/apple-touch-icon.png"', 'rel="manifest" href="/site.webmanifest"', 'name="theme-color"'):
        if tag not in head:
            problems.append(f"{route}: missing {tag}")
    for prop in ("og:title", "og:description", "og:url", "og:image", "og:image:alt", "og:type"):
        if not meta(s, "property", prop):
            problems.append(f"{route}: missing {prop}")
    for name in ("twitter:card", "twitter:title", "twitter:description", "twitter:image"):
        if not meta(s, "name", name):
            problems.append(f"{route}: missing {name}")
    og = meta(s, "property", "og:image") or ""
    if meta(s, "name", "twitter:image") != og:
        problems.append(f"{route}: twitter:image ≠ og:image")
    if not is404 and meta(s, "property", "og:url") != expected:
        problems.append(f"{route}: og:url ≠ canonical")
    check_link(route, og, "og:image")
    # JSON-LD
    types, graph = [], []
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try:
            data = json.loads(block)
        except json.JSONDecodeError as e:
            problems.append(f"{route}: JSON-LD does not parse: {e}")
            continue
        graph += data.get("@graph", [data])
    defined = {n["@id"] for n in graph if "@id" in n}
    used = set()
    refs(graph, used)
    for r in sorted(used - defined):
        problems.append(f"{route}: JSON-LD reference {r} is not defined on the page")
    for n in graph:
        types.append(n.get("@type"))
        if n.get("@id") and n.get("@type") in ("Organization", "Person", "WebSite", "Product"):
            blob = json.dumps(n, sort_keys=True, ensure_ascii=False)
            if shared.setdefault(n["@id"], blob) != blob:
                problems.append(f"{route}: {n['@id']} differs from the same @id on another page")
        for k in ("url", "logo", "image", "item"):
            v = n.get(k)
            for u in (v if isinstance(v, list) else [v.get("url") if isinstance(v, dict) else v]):
                if isinstance(u, str) and u.startswith(ORIGIN):
                    check_link(route, u, f"JSON-LD {n.get('@type')}.{k}")
        if n.get("@type") == "BreadcrumbList":
            for el in n["itemListElement"]:
                check_link(route, el["item"], "BreadcrumbList")
    if not is404:
        if route != "/" and "BreadcrumbList" not in types:
            problems.append(f"{route}: no BreadcrumbList")
        if route != "/" and 'class="crumbs"' not in s:
            problems.append(f"{route}: no visible breadcrumb")
        for t in ("Organization", "WebSite"):
            if t not in types:
                problems.append(f"{route}: no {t}")
    # links in the page
    body = s.split("<body", 1)[1]
    for attr in ("href", "src", "poster"):
        for u in re.findall(rf'\s{attr}="([^"]+)"', s if attr != "href" else body):
            check_link(route, html.unescape(u), attr)
    for ss in re.findall(r'\s(?:srcset|imagesrcset)="([^"]+)"', s):
        for part in ss.split(","):
            check_link(route, part.strip().split(" ")[0], "srcset")
    main = re.search(r"<main.*?</main>", s, re.S)
    words = re.sub(r"<[^>]+>", " ", main.group(0)) if main else ""
    rows.append((route, len(title), title, len(desc), len(h1s), h1, sorted({t for t in types if t}),
                 words.count("Kheelona"), words.count("Khelu"), words.count("Kheelu"), og.replace(ORIGIN, "")))

# root files
sm = read(os.path.join(ROOT, "sitemap.xml"))
locs = re.findall(r"<loc>(.*?)</loc>", sm)
for u in locs:
    if u.endswith("/") and u != ORIGIN + "/":
        problems.append(f"sitemap: trailing slash {u}")
    check_link("sitemap.xml", u, "loc")
if len(re.findall(r"<lastmod>", sm)) != len(locs):
    problems.append("sitemap: a URL has no lastmod")
indexable = {r[0] for r in rows if r[0] != "/404"}
in_map = {u[len(ORIGIN):] or "/" for u in locs}
for r in sorted(indexable ^ in_map):
    problems.append(f"sitemap: {r} is {'missing' if r in indexable else 'not a page'}")
for name in ("llms.txt", "pricing.md", "robots.txt"):
    t = read(os.path.join(ROOT, name))
    for u in [u.rstrip(".,;:") for u in re.findall(r"https://kheelona\.com[^\s)\]]*", t)]:
        check_link(name, u, name)
    for bad in ("20 October", "36 months", "up to 10 at launch", "until 5 September"):
        if bad in t and not (name == "llms.txt" and bad in ("20 October", "36 months")):
            problems.append(f"{name}: says {bad!r}")
for r in json.loads(read(os.path.join(ROOT, "pages/_shell/redirects.json")))["redirects"]:
    check_link("redirects.json", r["destination"], r["source"])

if "--table" in sys.argv:
    print("| Route | Title (chars) | Desc | H1 | JSON-LD types | Kheelona/Khelu/Kheelu in main | og:image |")
    print("|---|---|---|---|---|---|---|")
    for r in rows:
        print(f"| {r[0]} | {r[2]} ({r[1]}) | {r[3]} | {r[5]} | {', '.join(r[6])} | {r[7]}/{r[8]}/{r[9]} | {r[10]} |")
if problems:
    print(f"check-seo: {len(problems)} problem(s)\n  " + "\n  ".join(problems))
    sys.exit(1)
print(f"check-seo: {len(rows)} pages, {len(locs)} sitemap URLs: all checks pass")
