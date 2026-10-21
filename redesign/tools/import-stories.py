#!/usr/bin/env python3
"""Import the stories (hub + 20 guides) from the beta site's saved HTML into page sources, word for word.

    python3 -I tools/import-stories.py <beta-dir>

<beta-dir> holds the downloaded pages: stories.html and stories/<slug>.html (betawebsite.kheelona.com). The HTML is
data: it is parsed with html.parser, never executed. Output: pages/stories.html and pages/stories/<slug>.html, in the
redesign's design language (see pages/README.md), then `python3 tools/build-pages.py` builds them.

What it carries over, exactly: the <title>, meta description and JSON-LD; crumbs, title, lead, byline (author, date,
read time), hero photo and alt; every heading, paragraph, list, tip card, "Try this", pull line, facts list and
figure; sources; related / keep-reading links; the closing call to action. The visible name becomes Khelu (beta says
Kheelu): text, alt, aria-labels and JSON-LD names; URLs stay. Pre-order links go to store.kheelona.com and keep their
data-ph-capture-attribute-cta values.

Photos: the beta's /_next/image originals were converted once into assets/img/stories/<name>.webp (≤1200px) and
<name>-640.webp (cwebp -q 78); the importer maps each beta image to those files and warns if one is missing.
"""
import html, json, os, re, sys, urllib.parse
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "assets", "img", "stories")
OUT_DIR = os.path.join(ROOT, "pages")
STORE = "https://store.kheelona.com"
TINTS = ["peach", "sky", "butter", "mint", "pink", "lilac"]
TOPIC_TINT = {"screen-time": "peach", "talking": "sky", "ai-and-safety": "mint", "learning": "lilac"}
VOID = {"img", "br", "hr", "meta", "link", "input", "source", "wbr", "area", "col", "embed", "param", "track"}
warnings = []


# ---------------------------------------------------------------- a tiny DOM
class Node:
    __slots__ = ("tag", "attrs", "children", "parent")

    def __init__(self, tag, attrs=None, parent=None):
        self.tag, self.attrs, self.children, self.parent = tag, dict(attrs or {}), [], parent

    @property
    def cls(self):
        return set((self.attrs.get("class") or "").split())

    def has(self, c):
        return c in self.cls

    def els(self):
        return [c for c in self.children if isinstance(c, Node)]

    def walk(self):
        for c in self.children:
            if isinstance(c, Node):
                yield c
                yield from c.walk()

    def find(self, pred):
        return next((n for n in self.walk() if pred(n)), None)

    def findall(self, pred):
        return [n for n in self.walk() if pred(n)]

    def text(self):
        return "".join(c if isinstance(c, str) else ("" if c.tag in ("svg", "script", "style") else c.text()) for c in self.children)


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root")
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, [(k, v if v is not None else "") for k, v in attrs], self.cur)
        self.cur.children.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, [(k, v if v is not None else "") for k, v in attrs], self.cur))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not None and n.tag != tag:
            n = n.parent
        if n is not None and n.parent is not None:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


def parse(path):
    b = Builder()
    b.feed(open(path, encoding="utf-8").read())
    return b.root


by_tag = lambda t: (lambda n: n.tag == t)
by_cls = lambda c: (lambda n: n.has(c))


# ---------------------------------------------------------------- words
def khelu(s):
    """The toy's visible name is Khelu. Only called on visible text and names, never on URLs."""
    return s.replace("Kheelu", "Khelu")


def esc(s):
    return html.escape(s, quote=False)


def attr(s):
    return html.escape(s, quote=True)


def slugify(s, used):
    base = re.sub(r"[^a-z0-9]+", "-", s.lower().replace("’", "").replace("'", "")).strip("-")[:60].strip("-") or "part"
    out, i = base, 2
    while out in used:
        out, i = f"{base}-{i}", i + 1
    used.add(out)
    return out


def norm_ws(s):
    return re.sub(r"\s+", " ", s)


# ---------------------------------------------------------------- images
def local_img(src):
    """/_next/image?url=%2F_next%2F…%2Fname-web.hash.webp&w=… → ('name', exists)"""
    u = src
    if "url=" in src:
        u = urllib.parse.unquote(urllib.parse.parse_qs(urllib.parse.urlparse(src).query)["url"][0])
    fname = u.rsplit("/", 1)[-1]
    m = re.match(r"^(.*?)(?:-web)?\.[A-Za-z0-9_-]+\.(?:webp|png|jpe?g)$", fname)
    name = m.group(1) if m else fname.rsplit(".", 1)[0]
    if not os.path.exists(os.path.join(IMG_DIR, name + ".webp")):
        warnings.append(f"missing image assets/img/stories/{name}.webp (from {u})")
    return name


def img_tag(name, alt, w, h, sizes, eager=False, extra=""):
    has_small = os.path.exists(os.path.join(IMG_DIR, name + "-640.webp"))
    src = f"/assets/img/stories/{name}.webp"
    srcset = f' srcset="/assets/img/stories/{name}-640.webp 640w, {src} 1200w" sizes="{sizes}"' if has_small else ""
    load = ' fetchpriority="high"' if eager else ' loading="lazy" decoding="async"'
    return f'<img src="{src}"{srcset} width="{w}" height="{h}"{load} alt="{attr(khelu(alt))}"{extra}>'


# ---------------------------------------------------------------- inline + block rendering
class Ctx:
    def __init__(self, marks):
        self.marks = list(marks)  # highlight shades to use, in order
        self.ids = set()

    def mark(self):
        m = self.marks.pop(0)
        self.marks.append(m)
        return m


def href_of(a):
    h = a.attrs.get("href", "")
    if "betastore.kheelona.com" in h:
        h = STORE
    return h


def raw(n):
    """Serialise a node as-is (used for the beta's inline SVG icons)."""
    if isinstance(n, str):
        return esc(n)
    a = "".join(f' {k}="{attr(v)}"' for k, v in n.attrs.items() if k != "class")
    if n.tag in VOID:
        return f"<{n.tag}{a}>"
    return f"<{n.tag}{a}>" + "".join(raw(c) for c in n.children) + f"</{n.tag}>"


def inline(node, ctx):
    out = []
    for c in node.children:
        if isinstance(c, str):
            out.append(esc(khelu(c)))
            continue
        t, cl = c.tag, c.cls
        if t in ("svg", "script", "style"):
            continue
        if t == "a" and "ks-src" in cl:
            n = c.text().strip().strip("[]")
            out.append(f'<a class="cite" href="#src-{n}" aria-label="Source {n}">[{n}]</a>')
        elif t == "a":
            h = href_of(c)
            cta = c.attrs.get("data-ph-capture-attribute-cta")
            extra = f' data-ph-capture-attribute-cta="{attr(cta)}"' if cta else ""
            out.append(f'<a href="{attr(h)}"{extra}>{inline(c, ctx)}</a>')
        elif t in ("strong", "b"):
            out.append(f"<strong>{inline(c, ctx)}</strong>")
        elif t in ("em", "i"):
            out.append(f"<em>{inline(c, ctx)}</em>")
        elif t == "time":
            out.append(f'<time datetime="{attr(c.attrs.get("datetime", ""))}">{inline(c, ctx)}</time>')
        elif t == "br":
            out.append("<br>")
        elif t == "span" and "kh-hand" in cl:
            out.append(f'<span class="mark mark--{ctx.mark()}">{inline(c, ctx)}</span>')
        elif t == "span" and "ks-nowrap" in cl:
            out.append(f'<span class="nowrap">{inline(c, ctx)}</span>')
        elif t == "span" and "kh-sr" in cl:
            continue
        else:
            out.append(inline(c, ctx))
    return "".join(out)


def clean(s):
    return re.sub(r"\s+", " ", s).strip()


def figure(n, ctx, cls="fig"):
    img = n.find(by_tag("img"))
    name = local_img(img.attrs["src"])
    shape = "square" if n.has("kh-photo--square") else ("wide" if n.has("kh-photo--wide") else "tall")
    return (f'<figure class="{cls} {cls}--{shape}">'
            + img_tag(name, img.attrs.get("alt", ""), img.attrs.get("width", "1200"), img.attrs.get("height", "800"),
                      "(min-width: 1000px) 46rem, 100vw")
            + "</figure>")


def blocks(node, ctx, toc=None):
    out = []
    for c in node.els():
        t, cl = c.tag, c.cls
        if t in ("svg", "script", "style"):
            continue
        if t == "h2":
            hid = slugify(clean(khelu(c.text())), ctx.ids)
            if toc is not None:
                toc.append((hid, clean(khelu(c.text()))))
            out.append(f'<h2 id="{hid}">{clean(inline(c, ctx))}</h2>')
        elif t == "h3":
            out.append(f"<h3>{clean(inline(c, ctx))}</h3>")
        elif t == "p":
            kind = ' class="pull"' if "ks-gut" in cl else (' class="disclaimer"' if "ks-disclaimer" in cl else "")
            out.append(f"<p{kind}>{clean(inline(c, ctx))}</p>")
        elif t == "ul" and "ks-checks" in cl:
            out.append('<ul class="checks">' + "".join(f"<li>{clean(inline(li, ctx))}</li>" for li in c.els()) + "</ul>")
        elif t == "ul" and "ks-tips" in cl:
            out.append('<ul class="tips">' + "".join(f"<li>{clean(inline(li, ctx))}</li>" for li in c.els()) + "</ul>")
        elif t in ("ul", "ol"):
            out.append(f"<{t}>" + "".join(f"<li>{clean(inline(li, ctx))}</li>" for li in c.els()) + f"</{t}>")
        elif t == "div" and "ks-try" in cl:
            out.append('<div class="try">' + "".join(blocks(c, ctx)) + "</div>")
        elif t == "div" and "ks-questions" in cl:
            out.append('<div class="asks">' + "".join(blocks(c, ctx)) + "</div>")
        elif t == "div" and "kh-trust" in cl:
            items, figs = [], []
            for it in c.els():
                if it.tag == "figure":
                    figs.append(figure(it, ctx, "facts__fig"))
                    continue
                svg = it.find(by_tag("svg"))
                body = it.find(by_tag("p"))
                ico = f'<span class="facts__ico" aria-hidden="true">{raw(svg)}</span>' if svg else ""
                items.append(f"<li>{ico}<p>{clean(inline(body, ctx))}</p></li>")
            out.append('<div class="facts">' + '<ul class="facts__list">' + "".join(items) + "</ul>" + "".join(figs) + "</div>")
        elif t == "figure":
            out.append(figure(c, ctx))
        elif t == "table":
            out.append('<div class="tablewrap">' + raw(c) + "</div>")
            warnings.append("table copied raw: check it")
        else:
            warnings.append(f"unknown block <{t} class='{' '.join(cl)}'>: rendered its children")
            out.extend(blocks(c, ctx, toc))
    return out


# ---------------------------------------------------------------- page pieces
def jsonld(doc):
    """The page's JSON-LD blocks, with names changed to Khelu and URLs left alone."""
    def fix(v, key=None):
        if isinstance(v, dict):
            return {k: fix(x, k) for k, x in v.items()}
        if isinstance(v, list):
            return [fix(x, key) for x in v]
        if isinstance(v, str) and not re.match(r"^(https?:|/|mailto:)", v) and key not in ("@id", "url", "item", "image", "logo"):
            return khelu(v)
        return v
    out = []
    for s in doc.findall(lambda n: n.tag == "script" and n.attrs.get("type") == "application/ld+json"):
        data = fix(json.loads(s.text()))
        out.append('<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/") + "</script>")
    return "\n".join(out)


def head_meta(doc):
    title = doc.find(by_tag("title")).text().strip()
    desc = doc.find(lambda n: n.tag == "meta" and n.attrs.get("name") == "description").attrs["content"]
    return khelu(title), khelu(desc)


def khelu_art(size="13rem"):
    return ('<div class="closer__art" data-tilt aria-hidden="true">'
            '<div class="kheelu" data-kheelu><div class="kheelu__shadow"></div><div class="kheelu__body">'
            '<img class="kheelu__img" src="/assets/img/kheelu-480.webp" srcset="/assets/img/kheelu-480.webp 480w, /assets/img/kheelu-800.webp 800w" '
            'sizes="(max-width: 600px) 46vw, 13rem" width="480" height="586" loading="lazy" decoding="async" alt="">'
            '<span class="kheelu__eye kheelu__eye--l"><i class="kheelu__glint"></i><i class="kheelu__lid"></i></span>'
            '<span class="kheelu__eye kheelu__eye--r"><i class="kheelu__glint"></i><i class="kheelu__lid"></i></span>'
            "</div></div></div>")


def closer(sec, ctx):
    """The beta's #close section → .closer card (pre-order, price, trust, help, ghost link) beside a living Khelu."""
    h2 = sec.find(by_tag("h2"))
    lead = sec.find(by_cls("kh-heading__lead"))
    cta = sec.find(by_cls("ks-cta__button"))
    price = sec.find(by_cls("ks-price"))
    trust = sec.find(by_cls("ks-trust"))
    help_ = sec.find(by_cls("ks-help"))
    ghost = sec.find(by_cls("kh-btn--ghost"))
    art = sec.find(by_cls("kh-art"))
    label = khelu(art.attrs.get("aria-label", "")) if art else ""
    trust_html = "".join(f'<li><a href="{attr(href_of(a))}">{esc(clean(a.text()))}</a></li>' for a in trust.findall(by_tag("a")))
    return f"""<section class="closer" id="close" aria-labelledby="close-title">
  <div class="wrap">
    <div class="closer__card reveal">
      <div>
        <h2 class="h2" id="close-title" data-split>{clean(inline(h2, ctx))}</h2>
        <p class="lead">{clean(inline(lead, ctx))}</p>
        <div class="closer__actions">
          <a class="btn btn--primary" data-magnetic href="{STORE}" data-ph-capture-attribute-cta="{attr(cta.attrs.get('data-ph-capture-attribute-cta', ''))}">{esc(khelu(clean(cta.text())))} <span class="arrow" aria-hidden="true">→</span></a>
          <a class="btn btn--ghost" data-magnetic href="{attr(href_of(ghost))}">{esc(khelu(clean(ghost.text())))}</a>
        </div>
        <p class="price-line">{clean(inline(price, ctx))}</p>
        <ul class="trust">{trust_html}</ul>
        <p class="closer__help">{clean(inline(help_, ctx))}</p>
      </div>
      {khelu_art().replace('aria-hidden="true"', f'role="img" aria-label="{attr(label)}"', 1)}
    </div>
  </div>
</section>"""


def storycard(slug, title, sub, info, tint, tag=None, sizes="(min-width: 1100px) 22rem, (min-width: 640px) 45vw, 100vw"):
    tag_html = f'<span class="storycard__tag">{esc(tag)}</span>' if tag else ""
    sub_html = f"<p>{esc(khelu(sub))}</p>" if sub else ""
    return (f'<a class="storycard tint-{tint}" href="/stories/{slug}" data-tilt-card>'
            f'<span class="storycard__img">{img_tag(info["img"], "", info["w"], info["h"], sizes)}</span>'
            f'<span class="storycard__body">{tag_html}<h3>{esc(khelu(title))}</h3>{sub_html}'
            f'<span class="storycard__meta">{esc(info["read"])} <span class="storycard__go" aria-hidden="true">→</span></span></span></a>')


# ---------------------------------------------------------------- article
def read_article(path):
    doc = parse(path)
    main = doc.find(by_tag("main"))
    head = main.find(by_cls("ks-story-head"))
    crumbs = head.find(by_cls("ks-crumbs")).findall(by_tag("a"))
    topic_href, topic_title = crumbs[-1].attrs["href"], clean(crumbs[-1].text())
    byline = head.find(by_cls("ks-byline"))
    t = byline.find(by_tag("time"))
    spans = [s for s in byline.els() if s.tag == "span"]
    fig = head.find(by_tag("figure"))
    img = fig.find(by_tag("img"))
    return {
        "doc": doc, "main": main, "head": head,
        "slug": os.path.basename(path)[:-5],
        "topic": topic_href.split("#")[1], "topic_title": topic_title,
        "author": clean(byline.children[0]).rstrip(" ·") if isinstance(byline.children[0], str) else "",
        "date": clean(t.text()), "datetime": t.attrs.get("datetime", ""),
        "published": clean(spans[0].text()) if spans else "",
        "read": clean(spans[-1].text()),
        "h1": head.find(by_tag("h1")), "lead": head.find(by_cls("kh-heading__lead")),
        "img": local_img(img.attrs["src"]), "alt": img.attrs.get("alt", ""),
        "w": img.attrs.get("width", "1200"), "h": img.attrs.get("height", "800"),
        "wide": fig.has("kh-photo--wide"),
    }


def render_article(a, index, hub_cards, n):
    doc, main = a["doc"], a["main"]
    shade = TINTS[n % len(TINTS)]
    ctx = Ctx(TINTS[n % 6:] + TINTS[: n % 6])
    title, desc = head_meta(doc)
    topic_tint = TOPIC_TINT.get(a["topic"], "peach")

    # Body
    prose = main.find(by_cls("ks-prose"))
    toc, body = [], []
    for part in prose.els():
        cl = part.cls
        if "ks-answer" in cl:
            h2 = part.find(by_tag("h2"))
            hid = slugify(clean(khelu(h2.text())), ctx.ids)
            toc.append((hid, clean(khelu(h2.text()))))
            ps = [p for p in part.els() if p.tag == "p"]
            inner = "".join(
                f'<p class="{"disclaimer" if p.has("ks-disclaimer") else "answer__a"}">{clean(inline(p, ctx))}</p>' for p in ps)
            body.append(f'<section class="answer tint-butter" aria-labelledby="{hid}"><h2 class="answer__q" id="{hid}">{clean(inline(h2, ctx))}</h2>{inner}</section>')
        elif "ks-sources" in cl:
            hid = slugify("sources", ctx.ids)
            toc.append((hid, "Sources"))
            items = []
            for li in part.find(by_tag("ol")).els():
                num = li.find(by_cls("ks-notes__n"))
                rest = [s for s in li.els() if s is not num][0]
                items.append(f'<li id="{attr(li.attrs.get("id", ""))}"><span class="notes__n">{esc(clean(num.text()))}</span><span>{clean(inline(rest, ctx))}</span></li>')
            body.append(f'<section class="sources" aria-labelledby="{hid}"><h2 id="{hid}">Sources</h2><ol class="notes">{"".join(items)}</ol></section>')
        elif "ks-part" in cl:
            kind = "part part--khelu" if "ks-breakout" in cl else "part"
            h2 = part.find(lambda x: x.tag == "h2")
            inner = blocks(part, ctx, toc)
            lab = f' aria-labelledby="{toc[-1][0]}"' if h2 else ""
            tag = "section" if part.tag == "section" else "div"
            body.append(f'<{tag} class="{kind}"{lab}>' + "".join(inner) + f"</{tag}>")
        elif part.tag == "figure":
            body.append(figure(part, ctx))
        else:
            warnings.append(f"{a['slug']}: unknown body part {part.tag}.{' '.join(cl)}")
            body.extend(blocks(part, ctx, toc))

    # Related / keep reading / close
    related = main.find(lambda x: x.tag == "section" and x.has("ks-related") and not x.has("ks-keep"))
    keep = main.find(lambda x: x.tag == "section" and x.has("ks-keep"))
    close = main.find(lambda x: x.tag == "section" and x.attrs.get("id") == "close")

    def cards_from(sec, start):
        out = []
        for i, l in enumerate(sec.findall(by_cls("kh-listitem"))):
            slug = l.attrs["href"].rstrip("/").rsplit("/", 1)[-1]
            info = index[slug]
            sub = hub_cards.get(slug, {}).get("sub", "")
            out.append(storycard(slug, clean(l.text()), sub, info, TINTS[(start + i) % 6], info["topic_title"]))
        return "".join(out)

    tail = []
    if related:
        h = clean(related.find(by_tag("h2")).text())
        tail.append(f"""<section class="page-sec page-sec--soft related" aria-labelledby="related-title">
  <div class="wrap">
    <div class="shead"><h2 class="h2" id="related-title" data-split>{esc(h)}</h2></div>
    <div class="stories stories--three" data-stagger>{cards_from(related, n + 1)}</div>
  </div>
</section>""")
    if close:
        tail.append(closer(close, ctx))
    if keep:
        h = clean(keep.find(by_tag("h2")).text())
        btn = keep.find(by_cls("kh-btn"))
        tail.append(f"""<section class="closer keep" aria-labelledby="keep-title">
  <div class="wrap">
    <div class="closer__card keep__card reveal">
      <div class="keep__head">
        <h2 class="h2" id="keep-title" data-split>{esc(h)}</h2>
        <div class="closer__actions"><a class="btn btn--ghost" data-magnetic href="{attr(href_of(btn))}">{esc(clean(btn.text()))} <span class="arrow" aria-hidden="true">→</span></a></div>
      </div>
      <div class="stories stories--three" data-stagger>{cards_from(keep, n + 1)}</div>
    </div>
  </div>
</section>""")

    toc_html = "".join(f'<li><a href="#{i}">{esc(t)}</a></li>' for i, t in toc)
    hero_img = img_tag(a["img"], a["alt"], a["w"], a["h"], "(min-width: 900px) 40vw, 100vw", eager=True)
    meta = {"path": f"/stories/{a['slug']}", "title": title, "description": desc, "css": ["stories"], "js": ["stories"],
            "ogType": "article", "slug": "story"}
    by = [esc(a["author"])] if a["author"] else []
    by.append(f'<span class="nowrap">{esc(a["published"].replace(a["date"], "").strip())} <time datetime="{attr(a["datetime"])}">{esc(a["date"])}</time></span>')
    by.append(f'<span class="nowrap">{esc(a["read"])}</span>')
    byline = '<span class="story-meta__sep">&nbsp;· </span>'.join(by)
    return f"""<!--page
{json.dumps(meta, ensure_ascii=False)}
-->
<!-- Imported from betawebsite.kheelona.com/stories/{a['slug']} by tools/import-stories.py: words are the beta's; re-run the importer instead of editing by hand. -->
<head-extra>
{jsonld(doc)}
</head-extra>
<div class="readbar" aria-hidden="true"></div>
<article class="story" aria-labelledby="story-title">
<header class="ph story-hero">
  <div class="ph__glow" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="wrap ph__grid story-hero__grid">
    <div>
      <nav aria-label="Breadcrumb"><ol class="crumbs"><li><a href="/stories">Stories</a></li><li><a href="{attr(f'/stories#{a["topic"]}')}">{esc(a['topic_title'])}</a></li></ol></nav>
      <h1 class="display story-title" id="story-title" data-split>{clean(inline(a['h1'], ctx))}</h1>
      <p class="lead reveal">{clean(inline(a['lead'], ctx))}</p>
      <p class="story-meta reveal"><a class="story-meta__topic tint-{topic_tint}" href="/stories#{a['topic']}">{esc(a['topic_title'])}</a><span class="story-meta__by">{byline}</span></p>
    </div>
    <figure class="story-hero__fig story-hero__fig--{'wide' if a['wide'] else 'tall'} tint-{shade} reveal">{hero_img}</figure>
  </div>
</header>
<div class="page-sec story-body">
  <div class="wrap doc">
    <nav class="toc" aria-label="Contents"><details class="toc__fold" open><summary><p>Contents</p></summary><ol>{toc_html}</ol></details></nav>
    <div class="prose" data-read>
{chr(10).join(body)}
    </div>
  </div>
</div>
</article>
{chr(10).join(tail)}
"""


# ---------------------------------------------------------------- hub
def render_hub(path, index):
    doc = parse(path)
    main = doc.find(by_tag("main"))
    title, desc = head_meta(doc)
    ctx = Ctx(["sky", "peach", "butter", "mint", "pink", "lilac"])
    intro = main.find(by_cls("ks-journal-intro"))
    eyebrow = clean(intro.find(by_cls("kh-eyebrow")).text())
    h1 = intro.find(by_tag("h1"))
    lead = intro.find(by_cls("kh-heading__lead"))
    written = clean(intro.find(by_cls("ks-written")).text())
    topics_label = clean(intro.find(by_cls("ks-topics__label")).text())
    pills = "".join(
        f'<li><a href="{attr(a.attrs["href"])}" data-filter="{attr(a.attrs["href"][1:])}" class="tint-{TOPIC_TINT.get(a.attrs["href"][1:], "peach")}">{esc(clean(a.text()))}</a></li>'
        for a in intro.find(by_cls("ks-topics")).findall(by_tag("a")))

    sections, collage, k = [], [], 0
    for sec in main.findall(lambda x: x.tag == "section" and x.has("ks-topic")):
        tid = sec.attrs["id"]
        h2 = sec.find(by_tag("h2"))
        tlead = sec.find(by_cls("kh-heading__lead"))
        feat_html = ""
        feat = sec.find(by_cls("ks-guide"))
        if feat:
            img = feat.find(by_tag("img"))
            link = feat.find(by_tag("a"))
            slug = link.attrs["href"].rsplit("/", 1)[-1]
            info = index[slug]
            name = local_img(img.attrs["src"])
            collage.append((name, img.attrs.get("alt", ""), img.attrs.get("width"), img.attrs.get("height")))
            link_txt = clean("".join(c if isinstance(c, str) else "" for c in link.children))
            feat_html = (f'<a class="feature tint-{TOPIC_TINT.get(tid, "peach")} reveal" href="/stories/{slug}">'
                         f'<span class="feature__img">{img_tag(name, img.attrs.get("alt", ""), img.attrs.get("width"), img.attrs.get("height"), "(min-width: 900px) 34rem, 100vw")}</span>'
                         f'<span class="feature__body">'
                         f'<h3 class="h3">{esc(khelu(clean(feat.find(by_tag("h3")).text())))}</h3>'
                         f'<p>{esc(khelu(clean(feat.find(by_cls("kh-card__body")).text())))}</p>'
                         f'<span class="feature__link">{esc(link_txt)} <span class="arrow" aria-hidden="true">→</span></span></span></a>')
        cards = []
        for li in sec.findall(by_cls("kh-listitem")):
            slug = li.attrs["href"].rsplit("/", 1)[-1]
            cards.append(storycard(slug, clean(li.find(by_cls("kh-listitem__title")).text()),
                                   clean(li.find(by_cls("kh-listitem__sub")).text()), index[slug], TINTS[k % 6]))
            k += 1
        sections.append(f"""<section class="page-sec topic{' page-sec--soft' if len(sections) % 2 else ''}" id="{tid}" data-topic="{tid}" aria-labelledby="{tid}-title">
  <div class="wrap">
    <div class="shead"><h2 class="h2" id="{tid}-title" data-split>{esc(clean(h2.text()))}</h2><p class="lead reveal">{esc(khelu(clean(tlead.text())))}</p></div>
    {feat_html}
    <div class="stories stories--hub">{''.join(cards)}</div>
  </div>
</section>""")

    collage_html = "".join(
        f'<figure class="collage__card collage__card--{i + 1}">{img_tag(n, alt, w, h, "(min-width: 900px) 18rem, 50vw", eager=(i == 0))}</figure>'
        for i, (n, alt, w, h) in enumerate(collage))
    close = main.find(lambda x: x.tag == "section" and x.attrs.get("id") == "close")
    meta = {"path": "/stories", "title": title, "description": desc, "css": ["stories"], "js": ["stories"], "slug": "stories"}
    return f"""<!--page
{json.dumps(meta, ensure_ascii=False)}
-->
<!-- Imported from betawebsite.kheelona.com/stories by tools/import-stories.py: words are the beta's; re-run the importer instead of editing by hand. -->
<head-extra>
{jsonld(doc)}
</head-extra>
<section class="ph hub-hero" aria-labelledby="stories-title">
  <div class="ph__glow" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="wrap ph__grid">
    <div>
      <p class="eyebrow">{esc(eyebrow)}</p>
      <h1 class="display" id="stories-title" data-split>{clean(inline(h1, ctx))}</h1>
      <p class="lead reveal">{esc(khelu(clean(lead.text())))}</p>
      <p class="hub-hero__by reveal">{esc(written)}</p>
    </div>
    <div class="ph__visual collage" data-tilt aria-hidden="true">{collage_html}</div>
  </div>
</section>
<nav class="filter" aria-labelledby="topics-label">
  <div class="wrap filter__in">
    <p class="filter__label" id="topics-label">{esc(topics_label)}</p>
    <ul class="pills filter__pills">{pills}</ul>
  </div>
</nav>
<div class="topics" data-topics>
{chr(10).join(sections)}
</div>
{closer(close, ctx)}
"""


# ---------------------------------------------------------------- main
def main():
    if len(sys.argv) != 2:
        sys.exit("usage: python3 -I tools/import-stories.py <beta-dir with stories.html and stories/>")
    beta = sys.argv[1]
    art_dir = os.path.join(beta, "stories")
    slugs = sorted(f[:-5] for f in os.listdir(art_dir) if f.endswith(".html"))
    index = {s: read_article(os.path.join(art_dir, s + ".html")) for s in slugs}

    # The hub's own words for each guide (card title and line), used on related cards too.
    hub_doc = parse(os.path.join(beta, "stories.html"))
    hub_cards = {}
    for li in hub_doc.findall(by_cls("kh-listitem")):
        sub = li.find(by_cls("kh-listitem__sub"))
        hub_cards[li.attrs["href"].rsplit("/", 1)[-1]] = {"sub": clean(sub.text()) if sub else ""}
    for g in hub_doc.findall(by_cls("ks-guide")):
        hub_cards[g.find(by_tag("a")).attrs["href"].rsplit("/", 1)[-1]] = {"sub": clean(g.find(by_cls("kh-card__body")).text())}

    os.makedirs(os.path.join(OUT_DIR, "stories"), exist_ok=True)
    for n, s in enumerate(slugs):
        open(os.path.join(OUT_DIR, "stories", s + ".html"), "w", encoding="utf-8").write(render_article(index[s], index, hub_cards, n))
    open(os.path.join(OUT_DIR, "stories.html"), "w", encoding="utf-8").write(render_hub(os.path.join(beta, "stories.html"), index))
    print(f"wrote pages/stories.html and {len(slugs)} guides in pages/stories/")
    for w in dict.fromkeys(warnings):
        print("warning:", w)


if __name__ == "__main__":
    main()
