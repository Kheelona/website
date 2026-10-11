#!/usr/bin/env python3
"""Face check for new Kheelona cast photos.

Compares every face in a photo with the seven cast reference portraits
(assets/Cast/<name>-portrait.jpg) using OpenCV's YuNet face detector and SFace
face recogniser, and prints the cosine similarity to each cast member.

It is a flag, not a verdict. Young children look alike to the model, and it
finds no face when a head is turned or resting on the floor. Always confirm by
eye, side by side with the portrait. See "Making cast photos (step by step)".

In the Photo library (Oct 2026) the kept photos scored 0.42 to 0.93 against
their own child (median 0.67).

usage:   python3 face_check.py PHOTO [PHOTO ...] --child tara [--cast DIR]
needs:   pip install opencv-python-headless numpy
models:  downloaded once to ~/.cache/kheelona-face (about 40 MB)
"""
import argparse, os, sys, urllib.request
import cv2
import numpy as np

CAST = ["myra", "advik", "ira", "tara", "kabir", "meera", "arnab"]
MODELS = {
    "face_detection_yunet_2023mar.onnx": "models/face_detection_yunet/face_detection_yunet_2023mar.onnx",
    "face_recognition_sface_2021dec.onnx": "models/face_recognition_sface/face_recognition_sface_2021dec.onnx",
}
HOSTS = ["https://github.com/opencv/opencv_zoo/raw/main/",
         "https://media.githubusercontent.com/media/opencv/opencv_zoo/main/"]
CACHE = os.path.expanduser("~/.cache/kheelona-face")


def model(name):
    path = os.path.join(CACHE, name)
    if os.path.exists(path) and os.path.getsize(path) > 100_000:
        return path
    os.makedirs(CACHE, exist_ok=True)
    for host in HOSTS:
        try:
            urllib.request.urlretrieve(host + MODELS[name], path)
            if os.path.getsize(path) > 100_000:
                return path
        except Exception as e:  # try the next host
            print(f"  (could not fetch {name} from {host}: {e})", file=sys.stderr)
    sys.exit(f"Could not download {name}. Put it in {CACHE} by hand.")


def load():
    det = cv2.FaceDetectorYN.create(model("face_detection_yunet_2023mar.onnx"), "", (320, 320), 0.6, 0.3, 5000)
    rec = cv2.FaceRecognizerSF.create(model("face_recognition_sface_2021dec.onnx"), "")
    return det, rec


def faces(det, rec, path, max_side=1400):
    img = cv2.imread(path)
    if img is None:
        sys.exit(f"Cannot read {path}")
    s = min(1.0, max_side / max(img.shape[:2]))
    if s < 1:
        img = cv2.resize(img, (int(img.shape[1] * s), int(img.shape[0] * s)), interpolation=cv2.INTER_AREA)
    det.setInputSize((img.shape[1], img.shape[0]))
    _, found = det.detect(img)
    out = []
    for row in (found if found is not None else []):
        feat = rec.feature(rec.alignCrop(img, row))
        out.append({"feat": feat, "width": float(row[2]) / img.shape[1]})
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("photos", nargs="+")
    ap.add_argument("--child", choices=CAST, help="who should be in the photo")
    here = os.path.dirname(os.path.abspath(__file__))
    ap.add_argument("--cast", default=os.path.normpath(os.path.join(here, "..", "..", "assets", "Cast")),
                    help="folder with <name>-portrait.jpg (default: the design system's Cast group)")
    a = ap.parse_args()
    det, rec = load()
    refs = {}
    for name in CAST:
        p = os.path.join(a.cast, f"{name}-portrait.jpg")
        if not os.path.exists(p):
            sys.exit(f"Missing reference portrait {p}")
        fs = sorted(faces(det, rec, p), key=lambda f: -f["width"])
        if not fs:
            sys.exit(f"No face found in reference {p}")
        refs[name] = fs[0]["feat"]
    for photo in a.photos:
        fs = faces(det, rec, photo)
        print(f"\n{os.path.basename(photo)}: {len(fs)} face(s)")
        if not fs:
            print("  no face found: check by eye (turned heads and faces on the floor are often missed)")
            continue
        scored = []
        for f in fs:
            sims = {n: float(rec.match(f["feat"], r, cv2.FaceRecognizerSF_FR_COSINE)) for n, r in refs.items()}
            scored.append((f, sims, sorted(sims.items(), key=lambda kv: -kv[1])))
        # with --child, judge the face that best matches that child; list the others (parents, background)
        if a.child:
            scored.sort(key=lambda t: -t[1][a.child])
        for i, (f, sims, ranked) in enumerate(scored):
            line = "  ".join(f"{n} {v:.2f}" for n, v in ranked[:4])
            if not a.child:
                print(f"  face (width {f['width']:.0%} of frame): {line}")
                continue
            if i > 0:
                print(f"  other face (width {f['width']:.0%}): {line}  (a parent or someone else; check by eye)")
                continue
            own, (top, top_sim) = sims[a.child], ranked[0]
            if top != a.child and top_sim - own >= 0.10:
                verdict = f"looks more like {top}: likely a drifted face, reject unless the eye check clearly disagrees"
            elif own < 0.40:
                verdict = "likely not the same face: reject unless the face is tiny or turned"
            elif own >= 0.55 and top == a.child:
                verdict = "ok"
            else:
                verdict = "look closely, side by side with the portrait"
                if top != a.child:
                    verdict += f" ({top} scores a little higher; the model often mixes up young children)"
            print(f"  {a.child}: {own:.2f}  (best face, width {f['width']:.0%} of frame; top matches: {line})\n    -> {verdict}")

if __name__ == "__main__":
    main()
