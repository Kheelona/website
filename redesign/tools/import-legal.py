#!/usr/bin/env python3
"""Import a legal page (privacy, terms, refund, shipping) from the live beta site's HTML into a page source, so no
legal word is ever retyped by hand.

    python3 -I tools/import-legal.py <beta-html-dir> <pages-dir> [privacy terms refund shipping]

<beta-html-dir> holds the saved beta pages (privacy.html, terms.html, refund.html, shipping.html). The HTML is
downloaded data: it is parsed with html.parser and never executed. For each page this writes <pages-dir>/<page>.html
in the redesign's source format (see pages/README.md): the hero, the short version, the table of contents, the full
document body (headings with their ids, paragraphs, lists, tables, cards, links) and the closing card.

What changes on the way through, and nothing else:
- the visible product name: "Kheelu" becomes "Khelu" in text (URLs and ids keep "kheelu");
- pre-order links go to https://store.kheelona.com (not betastore); data-ph-capture-attribute-cta values are kept;
- the beta's markup and classes become the redesign's (.ph, .toc, .prose, .callout, .tablewrap…);
- privacy's list of data handlers is shown once, as a table (the beta renders the same rows twice: a list on phones
  and a table on laptops); on phones the table's rows stack as cards (assets/css/pages/legal.css).
"""
import html
import json
import os
import re
import sys
from html.parser import HTMLParser

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}


# ---------------------------------------------------------------- a tiny DOM
class Node:
    __slots__ = ("tag", "attrs", "children", "parent")

    def __init__(self, tag, attrs=None, parent=None):
        self.tag, self.attrs, self.children, self.parent = tag, dict(attrs or {}), [], parent

    @property
    def cls(self):
        return (self.attrs.get("class") or "").split()

    def has(self, c):
        return c in self.cls

    def iter(self):
        for c in self.children:
            if isinstance(c, Node):
                yield c
                yield from c.iter()

    def find(self, pred):
        return next((n for n in self.iter() if pred(n)), None)

    def find_all(self, pred):
        return [n for n in self.iter() if pred(n)]

    def text(self):
        out = []
        for c in self.children:
            if isinstance(c, str):
                out.append(c)
            elif c.tag == "br":
                out.append(" ")
            elif c.tag not in ("svg", "script", "style"):
                out.append(c.text())
        return "".join(out)


class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root")
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur)
        self.cur.children.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, attrs, self.cur))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


def parse(path):
    p = Parser()
    p.feed(open(path, encoding="utf-8").read())
    return p.root


# ---------------------------------------------------------------- text rules
def name(s):
    """The visible product name is Khelu; ids and URLs are never passed through here."""
    return re.sub(r"Kheelu", "Khelu", s)


def esc(s):
    return html.escape(name(s), quote=False)


def href(h):
    return re.sub(r"^https://betastore\.kheelona\.com", "https://store.kheelona.com", h)


def norm_ws(s):
    return re.sub(r"\s+", " ", s).strip()


# ---------------------------------------------------------------- body conversion
BLOCK = {"p", "h2", "h3", "h4", "ul", "ol", "li", "div", "table", "thead", "tbody", "tr", "section", "address"}


def inline(n):
    """Inline children of n, converted."""
    return "".join(conv(c) for c in n.children)


def conv(n, h2_id=None, th_labels=None):
    if isinstance(n, str):
        return esc(n)
    t, a = n.tag, n.attrs
    if t in ("svg", "script", "style", "img") or t == "#comment":
        return ""
    if t == "br":
        return "<br>"
    if t == "span":
        if n.has("ks-nowrap"):
            return f'<span class="nw">{inline(n)}</span>'
        if n.has("ks-doc__n"):
            return f'<span class="n">{inline(n)}</span>'
        return inline(n)
    if t == "a":
        attrs = f' href="{html.escape(href(a.get("href", "")))}"'
        if a.get("data-ph-capture-attribute-cta"):
            attrs += f' data-ph-capture-attribute-cta="{html.escape(a["data-ph-capture-attribute-cta"])}"'
        if a.get("aria-label"):
            attrs += f' aria-label="{html.escape(name(a["aria-label"]))}"'
        if a.get("href", "").startswith("http"):
            attrs += ' rel="noopener"'
        cls = " class=\"nw\"" if n.has("ks-nowrap") else ""
        return f"<a{cls}{attrs}>{inline(n)}</a>"
    if t in ("strong", "b", "em", "i", "code", "small"):
        return f"<{t}>{inline(n)}</{t}>"
    if t == "h2":
        hid = h2_id or a.get("id", "")
        body = inline(n)
        # "1. When your Khelu ships." → number in its own span, as privacy and terms already have
        body = re.sub(r"^(\d+)\.\s+", r'<span class="n">\1.</span> ', body)
        return f'\n<h2 id="{hid}">{body}</h2>'
    if t in ("h3", "h4"):
        hid = f' id="{a["id"]}"' if a.get("id") else ""
        return f"\n<{t}{hid}>{inline(n)}</{t}>"
    if t == "p":
        pid = f' id="{a["id"]}"' if a.get("id") else ""
        if n.has("ks-doc__group"):
            return f'\n<p class="doc-part">{inline(n)}</p>'
        if n.has("ks-doc__answer"):
            return f'\n<p class="doc-answer"{pid}>{inline(n)}</p>'
        if n.has("ks-doc__callout"):
            return f'\n<p class="callout tint-butter doc-flag"{pid}>{inline(n)}</p>'
        return f"\n<p{pid}>{inline(n)}</p>"
    if t in ("ul", "ol"):
        if n.has("ks-recips"):
            return ""  # the same rows follow as a table; shown once (see the module docstring)
        cls = ' class="doc-steps"' if n.has("ks-doc__steps") else ""
        items = "".join(conv(c) for c in n.children if isinstance(c, Node))
        return f"\n<{t}{cls}>{items}\n</{t}>"
    if t == "li":
        return f"\n  <li>{inline(n).strip()}</li>"
    if t == "div":
        if n.has("ks-doc__card"):
            return '\n<div class="callout doc-card">' + "".join(conv(c) for c in n.children) + "\n</div>"
        if n.has("ks-tools"):
            return '\n<div class="tools">' + "".join(conv(c) for c in n.children) + "\n</div>"
        if n.has("ks-tool"):
            return '\n<div class="tool">' + "".join(conv(c) for c in n.children) + "\n</div>"
        if n.has("kh-compare-wrap"):
            label = html.escape(name(a.get("aria-label", "")))
            return f'\n<div class="tablewrap" tabindex="0" role="region" aria-label="{label}">' + "".join(conv(c) for c in n.children) + "\n</div>"
        return "".join(conv(c) for c in n.children)
    if t == "table":
        heads = [norm_ws(th.text()) for th in n.find_all(lambda x: x.tag == "th" and x.attrs.get("scope") == "col")]
        rows = "".join(conv(c, th_labels=heads) for c in n.children if isinstance(c, Node))
        return f'\n<table class="cardtable">{rows}\n</table>'
    if t in ("thead", "tbody"):
        return f"\n<{t}>" + "".join(conv(c, th_labels=th_labels) for c in n.children if isinstance(c, Node)) + f"\n</{t}>"
    if t == "tr":
        cells, i = [], 0
        for c in n.children:
            if not isinstance(c, Node):
                continue
            lab = th_labels[i] if th_labels and i < len(th_labels) else ""
            scope = f' scope="{c.attrs["scope"]}"' if c.attrs.get("scope") else ""
            dl = f' data-label="{html.escape(lab)}"' if c.tag == "td" and lab else ""
            cells.append(f"<{c.tag}{scope}{dl}>{inline(c)}</{c.tag}>")
            i += 1
        return "\n  <tr>" + "".join(cells) + "</tr>"
    if t == "section":
        sid = a.get("id")
        out = []
        for c in n.children:
            if isinstance(c, Node) and c.tag == "h2" and sid:
                out.append(conv(c, h2_id=sid))  # the anchor other pages link to (#training, #contact…) sits on the heading
            else:
                out.append(conv(c))
        return "".join(out)
    return inline(n)


# ---------------------------------------------------------------- page pieces
ICONS = {
    "truck": '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
    "pin": '<path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    "box": '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    "rupee": '<path d="M7 4h11M7 9h11M7 4h3a5 5 0 0 1 0 10H7l8 7"/>',
    "undo": '<path d="M4 10h11a5 5 0 0 1 0 10H9"/><path d="m8 6-4 4 4 4"/>',
    "calendar": '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/><path d="m9 15 2 2 4-4"/>',
    "clock": '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    "wrench": '<path d="M14.5 6.5a4 4 0 0 0 5 5l-8 8a2.1 2.1 0 0 1-3-3l8-8a4 4 0 0 0-2-2z"/>',
    "shield": '<path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
    "ban": '<circle cx="12" cy="12" r="8.5"/><path d="m6 6 12 12"/>',
    "tag": '<path d="M3.5 12.5 12 4h7.5v7.5L11 20z"/><circle cx="15.5" cy="8" r="1.3"/>',
    "mic": '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    "cloud": '<path d="M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z"/>',
    "spark": '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    "chat": '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    "chart": '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
    "card": '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h3"/>',
    "reply": '<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
}
WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.66 15l-1.3 4.74 4.86-1.27A10 10 0 1 0 12 2zm5.47 13.9c-.23.65-1.35 1.24-1.86 1.3-.48.06-1.08.09-1.75-.11a15.9 15.9 0 0 1-1.58-.59 12.4 12.4 0 0 1-4.74-4.19c-.36-.48-1.2-1.6-1.2-3.05s.76-2.17 1.03-2.46a1.08 1.08 0 0 1 .79-.37h.57c.18 0 .43-.07.67.51l.88 2.12c.07.15.12.32.02.51-.1.2-.15.32-.29.49l-.44.51c-.15.15-.3.3-.13.6.17.29.77 1.27 1.65 2.06 1.13 1.01 2.09 1.32 2.38 1.47.3.15.47.12.64-.07.17-.2.74-.86.94-1.16.2-.29.39-.24.66-.15.27.1 1.72.81 2.01.96.3.15.49.22.56.34.07.12.07.7-.16 1.34z"/></svg>'
INFO = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.1"/></svg>'
TINTS = ["peach", "sky", "butter", "mint", "pink", "lilac"]

# Per page: the hero's highlight shade, the eyebrow when the beta shows none, the tint of Khelu's bubble, and one icon
# per short-version card (in the beta's order).
PAGES = {
    "privacy": {"mark": "mint", "eyebrow": None, "bub": "mint", "start": 0,
                "icons": ["tag", "mic", "cloud", "spark", "chat", "chart", "card", "reply"]},
    "terms": {"mark": "butter", "eyebrow": None, "bub": "butter", "start": 2, "icons": []},
    "refund": {"mark": "peach", "eyebrow": "Legal", "bub": "peach", "start": 4,
               "icons": ["undo", "calendar", "clock", "wrench", "shield", "ban"]},
    "shipping": {"mark": "sky", "eyebrow": "Legal", "bub": "sky", "start": 1,
                 "icons": ["truck", "pin", "box", "rupee", "undo"]},
}


def ico(name_):
    return f'<span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24">{ICONS[name_]}</svg></span>'


def heading_html(h, mark):
    """An h1/h2's words, with the beta's hand-lettered words (.kh-hand) as a pastel highlight."""
    out = []
    for c in h.children:
        if isinstance(c, str):
            out.append(esc(c))
        elif c.tag == "span" and c.has("kh-hand"):
            out.append(f'<span class="mark mark--{mark}">{inline(c)}</span>')
        else:
            out.append(conv(c))
    return "".join(out)


def khelu(bubble_html, bub):
    say = ""
    if bubble_html:
        say = f'\n      <div class="legal-say bubble bubble--kheelu bub--{bub}"><small>Khelu</small><span>{bubble_html}</span></div>'
    return f"""    <div class="ph__visual legal-visual reveal" data-tilt>
      <div class="kheelu" data-kheelu>
        <div class="kheelu__shadow" aria-hidden="true"></div>
        <div class="kheelu__body">
          <img class="kheelu__img" src="/assets/img/kheelu-800.webp" srcset="/assets/img/kheelu-480.webp 480w, /assets/img/kheelu-800.webp 800w" sizes="(max-width: 600px) 46vw, 17rem" width="800" height="976" alt="" fetchpriority="high">
          <span class="kheelu__eye kheelu__eye--l" aria-hidden="true"><i class="kheelu__glint"></i><i class="kheelu__lid"></i></span>
          <span class="kheelu__eye kheelu__eye--r" aria-hidden="true"><i class="kheelu__glint"></i><i class="kheelu__lid"></i></span>
        </div>
      </div>{say}
    </div>"""


def build_page(slug, src):
    cfg = PAGES[slug]
    raw = open(src, encoding="utf-8").read()
    root = parse(src)
    head = root.find(lambda n: n.tag == "head")
    main = root.find(lambda n: n.tag == "main")
    if not main:
        sys.exit(f"{src}: no <main>")

    title = norm_ws(head.find(lambda n: n.tag == "title").text())
    desc = head.find(lambda n: n.tag == "meta" and n.attrs.get("name") == "description").attrs["content"]
    ld = [norm_ws(n.text()) for n in root.find_all(lambda n: n.tag == "script" and n.attrs.get("type") == "application/ld+json")]
    for j in ld:
        json.loads(j)  # must be valid JSON
    ld_html = "".join(f'<script type="application/ld+json">{name(j)}</script>' for j in ld)

    # ---- hero
    hero = main.find(lambda n: n.tag == "section" and n.has("ks-hero"))
    draft = hero.find(lambda n: n.has("ks-draft"))
    eyebrow = hero.find(lambda n: n.has("kh-eyebrow"))
    h1 = hero.find(lambda n: n.tag == "h1")
    lead = hero.find(lambda n: n.has("kh-heading__lead"))
    updated = hero.find(lambda n: n.has("ks-updated"))
    sticker = hero.find(lambda n: n.has("kh-sticker"))
    eb = esc(norm_ws(eyebrow.text())) if eyebrow else cfg["eyebrow"]
    hero_html = f"""<div class="readbar" aria-hidden="true"></div>
<section class="ph legal-hero">
  <div class="ph__glow" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="wrap ph__grid">
    <div>
      {f'<p class="legal-draft reveal">{INFO}<span>{esc(norm_ws(draft.text()))}</span></p>' if draft else ''}
      <p class="eyebrow">{eb}</p>
      <h1 class="display" data-split>{heading_html(h1, cfg["mark"])}</h1>
      <p class="lead reveal">{inline(lead)}</p>
      <p class="updated reveal">{esc(norm_ws(updated.text()))}</p>
    </div>
{khelu(esc(norm_ws(sticker.text())) if sticker else "", cfg["bub"])}
  </div>
</section>"""

    # ---- the short version
    summ = main.find(lambda n: n.tag == "section" and n.has("ks-doc-summary"))
    sh2 = summ.find(lambda n: n.tag == "h2")
    nxt = TINTS[(TINTS.index(cfg["mark"]) + 2) % 6]  # never the same shade twice in a row
    parts = [f'<section class="page-sec page-sec--soft legal-short" aria-labelledby="short-title">\n  <div class="wrap">\n    <h2 class="h2 shead" id="short-title">{heading_html(sh2, nxt)}</h2>']
    trust = summ.find_all(lambda n: n.has("kh-trust__item"))
    short = summ.find(lambda n: n.has("ks-short"))
    if trust:
        if len(cfg["icons"]) != len(trust):
            sys.exit(f"{slug}: {len(trust)} short-version cards but {len(cfg['icons'])} icons configured")
        parts.append(f'    <ul class="shortcards" data-n="{len(trust)}" data-stagger>')
        for i, it in enumerate(trust):
            h3 = it.find(lambda n: n.tag == "h3")
            p = it.find(lambda n: n.has("kh-trust__body"))
            tint = TINTS[(cfg["start"] + i) % 6]
            parts.append(f'      <li class="shortcard tint-{tint}">{ico(cfg["icons"][i])}<h3>{inline(h3)}</h3><p>{inline(p)}</p></li>')
        parts.append("    </ul>")
    elif short:
        parts.append('    <ol class="shortlist" data-stagger>')
        for i, li in enumerate(c for c in short.children if isinstance(c, Node)):
            tint = TINTS[(cfg["start"] + i) % 6]
            parts.append(f'      <li class="tint-{tint}">{inline(li).strip()}</li>')
        parts.append("    </ol>")
    else:
        sys.exit(f"{slug}: no short version found")
    help_ = summ.find(lambda n: n.tag == "p" and n.has("ks-help"))
    if help_:
        parts.append(f'    <p class="callout legal-help reveal">{WA}<span>{inline(help_).strip()}</span></p>')
    parts.append("  </div>\n</section>")
    short_html = "\n".join(parts)

    # ---- table of contents
    nav = main.find(lambda n: n.tag == "nav" and n.has("ks-toc"))
    toc_title = esc(norm_ws(nav.find(lambda n: n.tag == "h2").text()))
    toc = [f'  <nav class="toc" aria-label="{toc_title}">\n    <details class="toc__box" open>\n      <summary>{toc_title}</summary>']
    for c in nav.children:
        if not isinstance(c, Node):
            continue
        if c.tag == "h3":
            toc.append(f'      <p class="toc__group">{esc(norm_ws(c.text()))}</p>')
        elif c.tag == "ol":
            toc.append("      <ol>")
            for li in c.find_all(lambda n: n.tag == "a"):
                spans = [s for s in li.children if isinstance(s, Node) and s.tag == "span"]
                num, label = esc(norm_ws(spans[0].text())), esc(norm_ws(spans[1].text()))
                toc.append(f'        <li><a href="{html.escape(li.attrs["href"])}"><span class="toc__n">{num}</span> {label}</a></li>')
            toc.append("      </ol>")
    toc.append("    </details>\n  </nav>")
    toc_html = "\n".join(toc)

    # ---- the document
    body = main.find(lambda n: n.has("ks-doc__body"))
    body_html = "".join(conv(c) for c in body.children).strip()
    body_html = re.sub(r"\n{2,}", "\n", body_html)
    doc_html = f"""<section class="page-sec legal-doc">
  <div class="wrap doc">
{toc_html}
  <article class="prose legal-prose" data-read>
{body_html}
  </article>
  </div>
</section>"""

    # ---- the close
    close = main.find(lambda n: n.has("ks-doc-close"))
    ch2 = close.find(lambda n: n.tag == "h2")
    clead = close.find(lambda n: n.has("kh-heading__lead"))
    btns = close.find_all(lambda n: n.tag == "a" and n.has("kh-btn"))
    also = close.find(lambda n: n.has("ks-also"))
    chelp = close.find(lambda n: n.tag == "p" and n.has("ks-help"))
    acts = []
    for b in btns:
        primary = b.has("kh-btn--secondary")
        cta = f' data-ph-capture-attribute-cta="{html.escape(b.attrs["data-ph-capture-attribute-cta"])}"' if b.attrs.get("data-ph-capture-attribute-cta") else ""
        arrow = ' <span class="arrow" aria-hidden="true">→</span>' if primary else ""
        acts.append(f'<a class="btn {"btn--primary" if primary else "btn--ghost"}" data-magnetic href="{html.escape(href(b.attrs["href"]))}"{cta}>{esc(norm_ws(b.text()))}{arrow}</a>')
    copy = []
    if ch2:
        copy.append(f'<h2 class="h2">{heading_html(ch2, cfg["mark"])}</h2>')
    if clead:
        copy.append(f'<p class="lead">{inline(clead)}</p>')
    copy.append(f'<div class="closer__actions">{"".join(acts)}</div>')
    if also:
        lab = also.find(lambda n: n.has("ks-also__label"))
        links = "".join(f'<li><a href="{html.escape(a.attrs["href"])}">{esc(norm_ws(a.text()))}</a></li>' for a in also.find_all(lambda n: n.tag == "a"))
        copy.append(f'<div class="legal-also"><p>{esc(norm_ws(lab.text()))}</p><ul class="pills">{links}</ul></div>')
    if chelp:
        copy.append(f'<p class="closer__help legal-wa">{WA}<span>{inline(chelp).strip()}</span></p>')
    slim = "" if ch2 else " legal-close--slim"  # privacy and terms close with links only, no heading
    # Khelu sits beside a closing heading; the slim close leaves him to the footer, just below.
    art = "" if slim else """      <div class="closer__art" data-tilt>
        <div class="kheelu" data-kheelu>
          <div class="kheelu__shadow" aria-hidden="true"></div>
          <div class="kheelu__body">
            <img class="kheelu__img" src="/assets/img/kheelu-480.webp" width="480" height="586" loading="lazy" decoding="async" alt="">
            <span class="kheelu__eye kheelu__eye--l" aria-hidden="true"><i class="kheelu__glint"></i><i class="kheelu__lid"></i></span>
            <span class="kheelu__eye kheelu__eye--r" aria-hidden="true"><i class="kheelu__glint"></i><i class="kheelu__lid"></i></span>
          </div>
        </div>
      </div>"""
    close_html = f"""<section class="closer legal-close{slim}">
  <div class="wrap">
    <div class="closer__card reveal">
      <div>
        {chr(10).join("        " + c if i else c for i, c in enumerate(copy))}
      </div>
{art}
    </div>
  </div>
</section>"""

    meta = {"path": f"/{slug}", "title": name(title), "description": name(desc), "css": ["legal"], "js": ["legal"]}
    header = (
        "<!--page\n" + json.dumps(meta, ensure_ascii=False) + "\n-->\n"
        f"<!-- Generated by tools/import-legal.py from the beta page ({slug}.html, betawebsite.kheelona.com/{slug}). "
        "Re-run the importer rather than editing the legal text here. -->\n"
    )
    out = f"{header}<head-extra>{ld_html}</head-extra>\n{hero_html}\n\n{short_html}\n\n{doc_html}\n\n{close_html}\n"
    leftover = re.findall(r"Kheelu(?![a-z])", re.sub(r'(href|id|src|srcset|class)="[^"]*"', "", out.split("</head-extra>", 1)[1]))
    if leftover:
        sys.exit(f"{slug}: visible 'Kheelu' left in the output")
    return out


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    beta_dir, pages_dir = sys.argv[1], sys.argv[2]
    for slug in sys.argv[3:] or list(PAGES):
        out = build_page(slug, os.path.join(beta_dir, f"{slug}.html"))
        dest = os.path.join(pages_dir, f"{slug}.html")
        open(dest, "w", encoding="utf-8").write(out)
        print(f"{slug}: {dest}")
