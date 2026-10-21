#!/usr/bin/env python3
"""Generate Khelu's voice lines (tools/voice-lines.json) in the admin dashboard's Achernar voice with Google Cloud
Text-to-Speech's Gemini TTS, then encode them to small AAC files in assets/audio/voice/.

Needs: `gcloud auth login`, the Cloud Text-to-Speech and Vertex AI APIs enabled on the project (only while it runs,
with the owner's OK; disable them after), and ffmpeg.
Usage: python3 tools/make-voice.py [--project PROJECT_ID] [--only id1,id2]
"""
import argparse, base64, json, os, subprocess, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "audio", "voice")


def token():
    return subprocess.check_output(["gcloud", "auth", "print-access-token"], text=True).strip()


def synth(project, tok, voice, style, text):
    body = {
        "input": {"prompt": style, "text": text},
        "voice": {"languageCode": voice["language"], "name": voice["name"], "modelName": voice["model"]},
        "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": 24000},
    }
    req = urllib.request.Request(
        "https://texttospeech.googleapis.com/v1/text:synthesize",
        data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {tok}", "x-goog-user-project": project, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        return base64.b64decode(json.load(r)["audioContent"])  # a complete WAV (LINEAR16 comes with a header)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", default=subprocess.check_output(["gcloud", "config", "get-value", "project"], text=True).strip())
    ap.add_argument("--only", default="")
    a = ap.parse_args()
    cfg = json.load(open(os.path.join(ROOT, "tools", "voice-lines.json")))
    only = set(filter(None, a.only.split(",")))
    os.makedirs(OUT, exist_ok=True)
    tok = token()
    for line in cfg["lines"]:
        if only and line["id"] not in only:
            continue
        wav = synth(a.project, tok, cfg["voice"], cfg["styles"][line["style"]], line["text"])
        src = os.path.join(OUT, line["id"] + ".wav")
        open(src, "wb").write(wav)
        dst = os.path.join(OUT, line["id"] + ".m4a")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-ac", "1", "-ar", "24000", "-c:a", "aac", "-b:a", "64k", dst], check=True)
        os.remove(src)
        print(f"{line['id']}: {os.path.getsize(dst)} bytes")


if __name__ == "__main__":
    sys.exit(main())
