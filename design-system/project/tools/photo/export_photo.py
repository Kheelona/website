#!/usr/bin/env python3
"""Export a picked cast photo into the Photo library format.

1. Trims a thin dark film edge if the model added one (it happened on four of
   the 25 library photos). The crop keeps the exact aspect ratio and the photo
   is scaled back to its original size, so every 4:5 photo stays 1856x2304.
2. Writes NAME.jpg (full size, JPEG quality 90, progressive) and
   NAME-web.webp (1500px on the long edge, quality 82) into the output folder.

usage:  python3 export_photo.py MASTER.png NAME [--out DIR] [--no-trim]
        NAME is <child>-<nn>-<scene>, for example tara-06-sorting-socks
needs:  pip install pillow numpy
"""
import argparse, os
import numpy as np
from PIL import Image, ImageOps


def film_edges(img):
    """Pixels to trim per side (top, bottom, left, right). A film edge is a run of
    lines from the border that are mostly near-black; dark scene content is not."""
    g = np.asarray(img.convert("L"), np.float32)
    h, w = g.shape
    sides = {"top": g, "bottom": g[::-1], "left": g.T, "right": g.T[::-1]}
    out = {}
    for side, arr in sides.items():
        cap = int(0.02 * arr.shape[0])  # never more than 2% of that dimension
        n = 0
        while n < cap and (arr[n] < 40).mean() >= 0.6 and arr[n].mean() < 30:
            n += 1
        out[side] = n + 6 if n else 0  # +6px covers the soft inner edge of the frame
    return out


def trim(img, t):
    W, H = img.size
    l, r, tp, b = t["left"], W - t["right"], t["top"], H - t["bottom"]
    cw, ch = r - l, b - tp
    if cw / ch > W / H:  # too wide: narrow it, centred
        nw = round(ch * W / H); l += (cw - nw) // 2; r = l + nw
    else:                # too tall: shorten it, centred
        nh = round(cw * H / W); tp += (ch - nh) // 2; b = tp + nh
    return img.crop((l, tp, r, b)).resize((W, H), Image.LANCZOS)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("master")
    ap.add_argument("name")
    here = os.path.dirname(os.path.abspath(__file__))
    ap.add_argument("--out", default=os.path.normpath(os.path.join(here, "..", "..", "assets", "Photo library")))
    ap.add_argument("--no-trim", action="store_true")
    a = ap.parse_args()
    img = ImageOps.exif_transpose(Image.open(a.master)).convert("RGB")
    if not a.no_trim:
        t = film_edges(img)
        if any(t.values()):
            print("trimming film edge (px):", t)
            img = trim(img, t)
        else:
            print("no film edge found")
    os.makedirs(a.out, exist_ok=True)
    jpg = os.path.join(a.out, a.name + ".jpg")
    img.save(jpg, "JPEG", quality=90, optimize=True, progressive=True, subsampling="4:2:0")
    w, h = img.size
    s = 1500 / max(w, h)
    web = os.path.join(a.out, a.name + "-web.webp")
    img.resize((round(w * s), round(h * s)), Image.LANCZOS).save(web, "WEBP", quality=82, method=6)
    print(f"{jpg}  {w}x{h}  {os.path.getsize(jpg) // 1024} KB")
    print(f"{web}  {round(w * s)}x{round(h * s)}  {os.path.getsize(web) // 1024} KB")


if __name__ == "__main__":
    main()
