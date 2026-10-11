#!/usr/bin/env python3
"""Build tokens.css from tokens.json, for using the Kheelona tokens outside the
design-system page (websites, emails, prototypes, decks made in code).

Writes CSS custom properties for both themes (Day = data-theme="light", the
default; Bedtime = data-theme="dark"), the kh-* type classes, and @font-face
rules that point at fonts/ next to tokens.css. Run it again whenever
tokens.json changes.

usage:  python3 tools/tokens/build_tokens_css.py [tokens.json] [tokens.css]
        (defaults: the design system's tokens.json -> tokens.css beside it)
"""
import json, os, re, sys
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.normpath(os.path.join(here, "..", ".."))
src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, "tokens.json")
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(root, "tokens.css")
t = json.load(open(src))
themes = [th["id"] for th in t["color"]["themes"]]
first = themes[0]

def val(v):
    if isinstance(v, str) and v.startswith("{") and v.endswith("}"):
        return f"var(--{v[1:-1]})"
    return v

def per_theme(tok, theme):
    v = tok["value"]
    if isinstance(v, dict):
        return v.get(theme, v.get(first))
    return v

lines = ["/* Kheelona — generated from tokens.json (for use outside the design-system page; regenerate when tokens.json changes) */"]
# first theme
decl = []
for fam in ("color", "shadow"):
    for tok in t.get(fam, {}).get("tokens", []):
        decl.append(f"  --{tok['name']}: {val(per_theme(tok, first))};")
lines.append(f':root, [data-theme="{first}"] {{\n' + "\n".join(decl) + "\n}")
for th in themes[1:]:
    decl = []
    for fam in ("color", "shadow"):
        for tok in t.get(fam, {}).get("tokens", []):
            v = tok["value"]
            is_alias = isinstance(v, str) and v.startswith("{")
            if isinstance(v, dict) and th in v:
                decl.append(f"  --{tok['name']}: {val(v[th])};")
            elif is_alias or (isinstance(v, dict) and any(isinstance(x, str) and x.startswith('{') for x in v.values())):
                decl.append(f"  --{tok['name']}: {val(per_theme(tok, th))};")
    lines.append(f'[data-theme="{th}"] {{\n' + "\n".join(decl) + "\n}")
decl = []
for fam, toks in t.items():
    if fam in ("name", "version", "color", "type", "shadow"):
        continue
    if isinstance(toks, dict) and "tokens" in toks:
        for tok in toks["tokens"]:
            decl.append(f"  --{tok['name']}: {tok['value']};")
for k, stack in t["type"]["families"].items():
    decl.append(f"  --font-{k}: {stack};")
lines.append(":root {\n" + "\n".join(decl) + "\n}")
for g in t["type"]["groups"]:
    for s in g["styles"]:
        fam = s.get("family", g["family"])
        props = [f"font-family: var(--font-{fam})", f"font-size: {s['fontSize']}", f"line-height: {s['lineHeight']}", f"font-weight: {s['fontWeight']}"]
        if "letterSpacing" in s:
            props.append(f"letter-spacing: {s['letterSpacing']}")
        lines.append(f".{s['name']} {{ " + "; ".join(props) + "; }")
for f in t["type"]["fonts"]:
    lines.append(f'@font-face {{ font-family: "{f["family"]}"; src: url("{f["file"]}") format("woff2"); font-weight: {f["weight"]}; font-style: {f.get("style","normal")}; font-display: swap; }}')
open(out, "w").write("\n".join(lines) + "\n")
print("wrote", out)
