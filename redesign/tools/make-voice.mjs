#!/usr/bin/env node
/* Generate Khelu's voice lines (tools/voice-lines.json) in the Achernar voice through the Gemini Live model the toys
   speak with: the same engine and setup as the admin dashboard's voice samples (backend-service
   src/services/voiceSample.service.js), so every line sounds like the greeting clip. Encodes each to a small AAC file
   in assets/audio/voice/.

   Needs: GEMINI_API_KEY (the backend's key; read from the environment, else from backend-service/.env), Node 22+, ffmpeg.
   Usage: node tools/make-voice.mjs [--only id1,id2]
   The Live model can stray from the line, so the transcript is checked and a strayed take is retried (3 tries). */
import { readFileSync, writeFileSync, unlinkSync, statSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "assets", "audio", "voice");
const WS = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";

const keyFromEnvFile = () => {
  const f = join(ROOT, "..", "..", "backend-service", ".env");
  if (!existsSync(f)) return "";
  const m = /^GEMINI_API_KEY=(.*)$/m.exec(readFileSync(f, "utf8"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
};
const KEY = process.env.GEMINI_API_KEY || keyFromEnvFile();
if (!KEY) { console.error("GEMINI_API_KEY is not set (environment or backend-service/.env)"); process.exit(1); }

const speak = ({ model, voice, instruction, text }) => new Promise((resolve, reject) => {
  const ws = new WebSocket(`${WS}?key=${KEY}`);
  const chunks = []; let rate = 24000, said = "", done = false;
  const finish = (err, v) => { if (done) return; done = true; clearTimeout(timer); try { ws.close(); } catch {} err ? reject(err) : resolve(v); };
  const timer = setTimeout(() => finish(new Error("timed out")), 120000);
  ws.onopen = () => ws.send(JSON.stringify({ setup: {
    model,
    generationConfig: { responseModalities: ["AUDIO"], thinkingConfig: { thinkingLevel: "minimal" }, speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
    systemInstruction: { parts: [{ text: instruction }] },
    outputAudioTranscription: {},
  } }));
  ws.onmessage = async (ev) => {
    let msg; try { msg = JSON.parse(typeof ev.data === "string" ? ev.data : await ev.data.text()); } catch { return; }
    if (msg.setupComplete) return ws.send(JSON.stringify({ realtimeInput: { text } }));
    const sc = msg.serverContent; if (!sc) return;
    for (const part of sc.modelTurn?.parts || []) {
      const d = part.inlineData; if (!d?.data || !String(d.mimeType || "").startsWith("audio/pcm")) continue;
      const r = /rate=(\d+)/.exec(d.mimeType); if (r) rate = Number(r[1]);
      chunks.push(Buffer.from(d.data, "base64"));
    }
    if (sc.outputTranscription?.text) said += sc.outputTranscription.text;
    if (sc.turnComplete) { const pcm = Buffer.concat(chunks); pcm.length ? finish(null, { pcm, rate, said: said.trim() }) : finish(new Error("no audio")); }
  };
  ws.onerror = (e) => finish(new Error(e?.message || "websocket error"));
  ws.onclose = (e) => finish(new Error(`closed early (${e.code} ${e.reason || ""})`));
});

// Same leniency as the backend's saidTheLine: 80% of the words present, at most 3 extra words.
const words = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
const saidTheLine = (said, line) => { const want = words(line), got = words(said); if (!want.length || !got.length) return false; const have = new Set(got); return want.filter((w) => have.has(w)).length / want.length >= 0.8 && got.length <= want.length + 3; };

const wav = (pcm, rate) => { const h = Buffer.alloc(44); h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8); h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(pcm.length, 40); return Buffer.concat([h, pcm]); };

const cfg = JSON.parse(readFileSync(join(ROOT, "tools", "voice-lines.json"), "utf8"));
const onlyArg = process.argv.indexOf("--only");
const only = new Set(onlyArg > 0 ? process.argv[onlyArg + 1].split(",").filter(Boolean) : []);
let failed = 0;
for (const line of cfg.lines) {
  if (only.size && !only.has(line.id)) continue;
  let take = null;
  for (let i = 1; i <= 3 && !take; i++) {
    try {
      const r = await speak({ model: cfg.voice.model, voice: cfg.voice.name, instruction: cfg.styles[line.style], text: line.text });
      if (saidTheLine(r.said, line.text)) take = r; else console.warn(`${line.id}: try ${i} strayed: "${r.said}"`);
    } catch (e) { console.warn(`${line.id}: try ${i} failed: ${e.message}`); }
  }
  if (!take) { console.error(`${line.id}: no good take, kept the old file`); failed++; continue; }
  const src = join(OUT, `${line.id}.wav`), dst = join(OUT, `${line.id}.m4a`);
  writeFileSync(src, wav(take.pcm, take.rate));
  // Trim the silence the Live model leaves at the start and end.
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", src, "-af", "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse", "-ac", "1", "-ar", "24000", "-c:a", "aac", "-b:a", "64k", dst]);
  unlinkSync(src);
  console.log(`${line.id}: ${statSync(dst).size} bytes`);
}
process.exit(failed ? 1 : 0);
