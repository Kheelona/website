#!/usr/bin/env python3
"""Remove garbled AI "text" printed on paper (book pages, notebooks, labels)
from a cast photo, without touching anything else.

How it works: finds small dark marks enclosed by bright paper inside the boxes
you give, merges them into one block, refills the block with the page's own
tone and copies real film grain from clean paper nearby, so it doesn't look
smoothed. Page edges, artwork, hands and faces are never changed.

Use it only for paper. Never use it on a face, hands, body or Kheelu.
Always compare before and after at 200% zoom.

usage:  python3 retouch_page_text.py IN.png OUT.png [--low telea|paper] [--sat N] x0 y0 x1 y1 [x0 y0 x1 y1 ...]
        boxes are pixel rectangles around the text on the page (full-size master)
        --low telea   (default) when only paper surrounds the text
        --low paper --sat 45   when dark artwork borders the text on white paper
needs:  pip install opencv-python-headless numpy scipy

Used in Oct 2026 on tara-03 (--low telea 980 1545 1215 1640) and
kabir-04 (--low paper --sat 45 2080 1200 2470 1360 1560 1212 1840 1280).
"""
import sys, cv2, numpy as np
from scipy import ndimage as ndi
a = sys.argv[1:]; opt = {'thr': 165, 'close': 15, 'sat': 255, 'low': 'telea'}; pos = []
i = 0
while i < len(a):
    if a[i].startswith('--'):
        k = a[i][2:]; opt[k] = a[i+1] if k == 'low' else int(a[i+1]); i += 2
    else: pos.append(a[i]); i += 1
src, dst, a = pos[0], pos[1], pos[2:]
boxes = [list(map(int, a[i:i+4])) for i in range(0, len(a), 4)]
img = cv2.imread(src, cv2.IMREAD_COLOR).astype(np.float32)
out = img.copy(); rng = np.random.default_rng(11)
def mblur(x, w, s):
    res = None
    for sg in (s, s * 2.5, s * 6, s * 15):
        num = cv2.GaussianBlur(x * w, (0, 0), sg); den = cv2.GaussianBlur(w, (0, 0), sg)
        v = num / np.maximum(den, 1e-6)
        if res is None: res = v; ok = den > 0.05
        else: res = np.where(ok, res, v); ok |= den > 0.05
    return res
def sizefilter(m, hmax=30, wmax=260):
    lab, n = ndi.label(m); keep = np.zeros(n + 1, bool)
    for k, sl in enumerate(ndi.find_objects(lab), 1):
        if sl is not None and (sl[0].stop - sl[0].start) <= hmax and (sl[1].stop - sl[1].start) <= wmax: keep[k] = True
    return keep[lab]
for x0, y0, x1, y1 in boxes:
    roi = img[y0:y1, x0:x1]; g = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    sat = roi.max(-1) - roi.min(-1)
    paper0 = (g > opt['thr']) & (sat < opt['sat'])
    filled = ndi.binary_fill_holes(paper0)
    interior = ndi.binary_erosion(filled, iterations=4)
    holes = sizefilter(filled & ~paper0)
    if opt['low'] == 'telea':
        sm = cv2.GaussianBlur(g, (0, 0), 6)
        glyph = holes | (interior & ndi.binary_dilation(holes, iterations=5) & ((sm - g) > 5))
    else:
        level = mblur(g, (paper0 & interior).astype(np.float32), 9)
        # faint marks only count inside the text block (convex hull of the dark dots, +10px)
        pts = np.argwhere(holes)[:, ::-1].astype(np.int32)
        hull = np.zeros(g.shape, np.uint8)
        if len(pts) >= 3: cv2.fillConvexPoly(hull, cv2.convexHull(pts), 1)
        hull = ndi.binary_dilation(hull.astype(bool), iterations=10)
        glyph = sizefilter(holes | (interior & hull & ((level - g) > 6)))
    se = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (opt['close'], opt['close']))
    R = cv2.morphologyEx(glyph.astype(np.uint8), cv2.MORPH_CLOSE, se).astype(bool)
    R = ndi.binary_dilation(R, iterations=4) & interior
    if opt['low'] == 'paper': R &= hull
    K = interior & ~ndi.binary_dilation(R, iterations=2)
    base = cv2.GaussianBlur(roi, (0, 0), 2.0)
    if opt['low'] == 'telea':
        low = cv2.inpaint(np.clip(base, 0, 255).astype(np.uint8), R.astype(np.uint8) * 255, 9, cv2.INPAINT_TELEA).astype(np.float32)
        low = np.where(R[..., None], cv2.GaussianBlur(low, (0, 0), 3.0), low)
    else:
        low = np.stack([mblur(base[..., c], K.astype(np.float32), 3) for c in range(3)], -1)
    hp = roi - base
    H, W = g.shape; B = 20
    ok = cv2.erode(K.astype(np.uint8), np.ones((B, B), np.uint8), anchor=(0, 0)).astype(bool)
    cand = np.argwhere(ok[:max(H - B, 1), :max(W - B, 1)])
    grain = np.zeros_like(roi); ys, xs = np.where(R)
    if len(cand) >= 30:
        for by in range(ys.min() // B * B, ys.max() + 1, B):
            for bx in range(xs.min() // B * B, xs.max() + 1, B):
                sy, sx = cand[rng.integers(len(cand))]
                hh, ww = min(B, H - by), min(B, W - bx)
                grain[by:by + hh, bx:bx + ww] = hp[sy:sy + hh, sx:sx + ww]
        how = f"real grain, {len(cand)} source blocks"
    else:
        sd = np.array([hp[..., c][K].std() for c in range(3)])
        n_l = cv2.GaussianBlur(rng.standard_normal(g.shape).astype(np.float32), (0, 0), 0.7); n_l /= n_l.std()
        grain = np.stack([n_l * sd[c] for c in range(3)], -1)
        how = f"synthetic grain sd {sd.round(1)}"
    fill = low + grain
    alpha = cv2.GaussianBlur(R.astype(np.float32), (0, 0), 1.5)
    alpha = np.where(R, np.maximum(alpha, 0.9), alpha * interior)[..., None]
    out[y0:y1, x0:x1] = roi * (1 - alpha) + fill * alpha
    print(f"box {x0},{y0}: glyph px {int(glyph.sum())}, region px {int(R.sum())}, {how}")
cv2.imwrite(dst, np.clip(out, 0, 255).astype(np.uint8))
