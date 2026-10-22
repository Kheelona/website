/* Team page, fold 1: the three founders at one round table, in real-time 3D (Three.js). Loaded by team3d.js (the boot)
 * once the page has loaded; until then a still of this scene (the poster) shows.
 * Faces are the founders' own photos, cut out on this Mac with Apple's Vision (tools/cutout/cutout.swift). Below the
 * chest each photo carries on as the body; that per-pixel work is baked offline into <key>-body.webp
 * (tools/bake-team3d.mjs), so the page does no pixel loops. Scrolling rolls the camera from a wide shot to each
 * founder in turn, where their card opens, then back out.
 * Performance: the set-up runs in short slices (no long task), textures and shaders are prepared before the first
 * frame, the shadow map is drawn once (nothing that casts a shadow moves), phones get fewer segments, a 1024 shadow
 * map and a lower pixel ratio, the pixel ratio drops further if frames run slow, and the loop only runs on screen. */
import * as THREE from "../../vendor/three.module.min.js";

const yieldNow = () => new Promise((r) => (window.scheduler && scheduler.yield ? scheduler.yield().then(r) : setTimeout(r, 0)));

export async function start(sec) {
  const q = new URLSearchParams(location.search);
  const BAKE = q.has("t3bake"), CAPTURE = q.has("t3capture"); // tools/bake-team3d.mjs
  const mark = q.has("t3debug") ? (n) => console.warn(`t3 ${n} ${performance.now() | 0}`) : () => {}; // ?t3debug: set-up timings
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const small = Math.min(innerWidth, innerHeight) < 700 || !fine; // phones and tablets
  const canvas = sec.querySelector(".t3__canvas");
  const off = () => { sec.classList.add("t3-off"); document.documentElement.classList.remove("t3-live"); };
  let renderer = null;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: CAPTURE }); } catch (e) { renderer = null; }
  if (!renderer) { off(); return; }
  mark("renderer"); await yieldNow();

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false; // drawn once when everything is placed: nothing that casts a shadow moves

  const seg = (n) => (small ? Math.max(8, Math.round(n * 0.5)) : n); // fewer segments on phones
  const BG = 0xf7f2ec;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  scene.fog = new THREE.Fog(BG, 7, 16);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 60);

  /* ---------- Light: soft daylight, a warm key from the window side, a warm pendant over the table ---------- */
  scene.add(new THREE.HemisphereLight(0xfffaf2, 0xe7d9c7, 1.5));
  const key = new THREE.DirectionalLight(0xfff0dc, 2.1);
  key.position.set(-2.6, 4.2, -1.6);
  key.castShadow = true;
  const SM = small ? 1024 : 2048;
  key.shadow.mapSize.set(SM, SM);
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 12 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = small ? 2 : 1;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe6eeff, 0.55);
  fill.position.set(3, 2.2, -2.5);
  scene.add(fill);

  const mat = (color, rough = 0.8, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, ...extra });
  const shadowed = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };

  /* ---------- Room: floor, a soft rug, a curved back wall with a window glow, two plants ---------- */
  const floor = new THREE.Mesh(new THREE.CircleGeometry(14, seg(64)), mat(0xefe6da, 1));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.95, seg(96)), mat(0xece4f6, 1));
  rug.rotation.x = -Math.PI / 2; rug.position.y = 0.004; rug.receiveShadow = true; scene.add(rug);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 6.5, 7, seg(96), 1, true, Math.PI * 0.05, Math.PI * 0.9), mat(0xf6efe6, 1, { side: THREE.BackSide }));
  wall.position.set(0, 3.5, -1); wall.rotation.y = Math.PI; scene.add(wall);
  const windowGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.9), new THREE.MeshBasicMaterial({ color: 0xfffbf3, fog: true }));
  windowGlow.position.set(-1.4, 2.0, 5.35); windowGlow.rotation.y = Math.PI; scene.add(windowGlow);
  const winFrame = new THREE.Mesh(new THREE.PlaneGeometry(2.75, 2.05), mat(0xe8dccd, 1));
  winFrame.position.set(-1.4, 2.0, 5.37); winFrame.rotation.y = Math.PI; scene.add(winFrame);
  const art = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.1), mat(0xfde4ee, 1));
  art.position.set(1.9, 1.85, 5.3); art.rotation.y = Math.PI; scene.add(art);
  const leafGeo = new THREE.SphereGeometry(0.11, seg(16), seg(12)), potGeo = new THREE.CylinderGeometry(0.17, 0.13, 0.36, seg(32));
  const plant = (x, z, s) => {
    const g = new THREE.Group();
    g.add(shadowed(new THREE.Mesh(potGeo, mat(0xf2cf72, 0.7))));
    g.children[0].position.y = 0.18;
    const leaf = mat(0x8fc9a2, 0.9);
    for (let i = 0; i < 9; i++) {
      const l = shadowed(new THREE.Mesh(leafGeo, leaf));
      const a = (i / 9) * Math.PI * 2; l.scale.set(0.55, 1.6, 0.3);
      l.position.set(Math.cos(a) * 0.08, 0.55 + (i % 3) * 0.12, Math.sin(a) * 0.08);
      l.rotation.set(Math.sin(a) * 0.5, -a, Math.cos(a) * 0.5); g.add(l);
    }
    g.position.set(x, 0, z); g.scale.setScalar(s); scene.add(g); return g;
  };
  plant(-2.35, 2.1, 1.25); plant(2.5, 2.4, 1.05);

  /* ---------- The round table, with a soft shadow under it ---------- */
  const TOP = 0.745;
  const oak = mat(0xe8d5bb, 0.55), oakDark = mat(0xd8c2a3, 0.6);
  const top = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.045, seg(96)), oak)); top.position.y = TOP - 0.0225; scene.add(top);
  const lip = shadowed(new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.022, seg(12), seg(96)), oakDark)); lip.rotation.x = Math.PI / 2; lip.position.y = TOP - 0.022; scene.add(lip);
  const stem = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.075, 0.7, seg(32)), oakDark)); stem.position.y = 0.37; scene.add(stem);
  const foot = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.035, seg(64)), oakDark)); foot.position.y = 0.018; scene.add(foot);
  // Soft round shadows and steam puffs: a radial fade written straight into a texture (no 2D canvas to start up).
  const radial = (size, [r, g, b], a0) => {
    const d = new Uint8Array(size * size * 4), h = size / 2;
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const t = Math.min(1, Math.max(0, (Math.hypot(x + 0.5 - h, y + 0.5 - h) - size / 32) / (h - size / 32))), i = (y * size + x) * 4;
      d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = Math.round(255 * a0 * (1 - t));
    }
    const tex = new THREE.DataTexture(d, size, size); tex.magFilter = tex.minFilter = THREE.LinearFilter; tex.needsUpdate = true; return tex;
  };
  const blob = radial(128, [70, 45, 20], 0.32);
  const under = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.3), new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false }));
  under.rotation.x = -Math.PI / 2; under.position.y = 0.006; scene.add(under);

  /* ---------- Pendant lamp ---------- */
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 1.6, 8), mat(0x6e6e73)); cord.position.y = 2.95; scene.add(cord);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.2, seg(64), 1, true), mat(0xf2cf72, 0.6, { side: THREE.DoubleSide })); shade.position.y = 2.1; scene.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, seg(24), seg(16)), new THREE.MeshBasicMaterial({ color: 0xfff3d6 })); bulb.position.y = 2.02; scene.add(bulb);
  const lamp = new THREE.PointLight(0xffd9a0, 1.6, 4.5, 1.6); lamp.position.y = 1.95; scene.add(lamp);
  mark("room"); await yieldNow();

  /* ---------- Steam for the cups ---------- */
  const puff = radial(64, [255, 255, 255], 0.9);
  const steams = [];
  const cup = (x, z, color) => {
    const g = new THREE.Group();
    const saucer = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.01, seg(40)), mat(0xffffff, 0.35))); saucer.position.y = 0.005; g.add(saucer);
    const body = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.034, 0.075, seg(40), 1, true), mat(color, 0.35, { side: THREE.DoubleSide }))); body.position.y = 0.048; g.add(body);
    const base = new THREE.Mesh(new THREE.CircleGeometry(0.034, seg(32)), mat(color, 0.35)); base.rotation.x = -Math.PI / 2; base.position.y = 0.011; g.add(base);
    const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.039, seg(32)), mat(0x6b4226, 0.3)); coffee.rotation.x = -Math.PI / 2; coffee.position.y = 0.075; g.add(coffee);
    const handle = shadowed(new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.006, 8, seg(24)), mat(color, 0.35))); handle.position.set(0.047, 0.05, 0); g.add(handle);
    for (let i = 0; i < 3; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puff, transparent: true, depthWrite: false, opacity: 0 })); s.scale.setScalar(0.06); s.position.y = 0.09; g.add(s); steams.push({ s, phase: i / 3 + Math.random() * 0.1 }); }
    g.position.set(x, TOP, z); scene.add(g); return g;
  };

  /* ---------- The founders: a chair in their colour, a body, and their own photo ---------- */
  const deg = (d) => (d * Math.PI) / 180;
  const FOUNDERS = [
    // body: the baked photo body (tools/bake-team3d.mjs); cut: the Vision cut-out it is made from (the fallback).
    { key: "apoorva", angle: 30, chair: 0xbfe6d2, cup: 0xcdeedd, body: "/assets/img/team/apoorva-body.webp", cut: "/assets/img/team/apoorva-cut.webp" },
    { key: "aman", angle: 90, chair: 0xffd6bd, cup: 0xffdcc6, body: "/assets/img/team/aman-body.webp", cut: "/assets/img/team/aman-cut.webp" },
    { key: "kashyap", angle: 150, chair: 0xc6dff7, cup: 0xd4e8fb, body: "/assets/img/team/kashyap-body.webp", cut: "/assets/img/team/kashyap-cut.webp" },
  ];
  const SEAT = 1.08, PERSON = 0.99, PHOTO = 0.68;
  const N = small ? 48 : 72, gauss = (u, v, p, s) => Math.exp(-((u - p[0]) ** 2 + (v - p[1]) ** 2) / (2 * s * s));
  const smooth = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
  const EXT = 190;
  const loadImg = (src) => { const img = new Image(); img.decoding = "async"; img.src = src; return img.decode().then(() => img); };
  // Photos that are drawn into canvases: decoded off the main thread into a bitmap (a decoded <img> is decoded again,
  // on the main thread, the first time it is drawn into a canvas).
  const loadBitmap = (src) => (window.createImageBitmap ? fetch(src).then((r) => (r.ok ? r.blob() : Promise.reject(new Error(src)))).then((b) => createImageBitmap(b)) : loadImg(src));

  /* The body is the photo itself, carried on below the chest: each column keeps its own shirt pixels (mirrored, so
     stripes and knit run on), the body tapers a little to the waist and darkens toward the seat and the sides. Baked
     offline into <key>-body.webp; this runs only to make that file (?t3bake) or if it is missing. */
  const extendBody = (img) => {
    const W = img.naturalWidth || img.width || 480, H = W + EXT;
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(img, 0, 0, W, W);
    const src = x.getImageData(0, 0, W, W).data, out = x.getImageData(0, 0, W, H), o = out.data;
    const at = (X, Y) => (Y * W + X) * 4;
    const row = W - 4; let L = 0, R = W - 1;
    while (L < W - 1 && src[at(L, row) + 3] < 128) L++;
    while (R > 0 && src[at(R, row) + 3] < 128) R--;
    const cx = (L + R) / 2, half = Math.max(10, (R - L) / 2) * 0.93, BAND = 70;
    // The cut-out's last rows are soft (alpha < 250: Vision's matte), so on a dark shirt the background showed through as
    // a thin light line across the chest. The body starts at the last fully opaque row instead, and redraws the soft rows.
    const opaque = (Y) => { let lo = 255; for (let X = Math.round(cx - half * 0.8); X <= Math.round(cx + half * 0.8); X++) lo = Math.min(lo, src[at(X, Y) + 3]); return lo >= 250; };
    let base = W - 1; while (base > W - 16 && !opaque(base)) base--;
    const lead = W - 1 - base;
    for (let y = -lead; y < EXT; y++) {
      const t = Math.max(0, y) / EXT, k = (y + lead) % (BAND * 2), sy = base - (k < BAND ? k : BAND * 2 - 1 - k);
      const taper = 1 - 0.14 * t, dark = 1 - 0.32 * Math.pow(t, 1.25);
      for (let X = 0; X < W; X++) {
        const d = (X - cx) / (half * taper); const ad = Math.abs(d); if (ad > 1.02) continue;
        let sx = Math.min(W - 1, Math.max(0, Math.round(cx + d * half)));
        for (let n = 0; n < 60 && src[at(sx, sy) + 3] < 220; n++) sx += sx < cx ? 1 : -1; // no torn edges
        const side = 1 - 0.2 * Math.pow(ad, 4) * Math.min(1, t * 2.5 + 0.15);
        const f = dark * side, i = at(sx, sy), j = at(X, W + y);
        o[j] = src[i] * f; o[j + 1] = src[i + 1] * f; o[j + 2] = src[i + 2] * f;
        o[j + 3] = 255 * Math.min(1, (1.02 - ad) * 25);
      }
    }
    x.putImageData(out, 0, 0);
    return c;
  };
  // Landmarks are measured on the square cut-out; the body image is taller, so y scales by W / H.
  const toBody = (lm, W, H) => ({ ...lm, ...Object.fromEntries(Object.entries(lm).filter(([, v]) => Array.isArray(v) && Array.isArray(v[0])).map(([k, v]) => [k, v.map(([px, py]) => [px, py * W / H])])), box: [lm.box[0], lm.box[1] * W / H, lm.box[2], lm.box[3] * W / H] });

  /* Legs under the table: unlit and softly shaded (lighter on top), like the photo bodies above them. */
  const limb = (a, b, r, color) => {
    const dir = new THREE.Vector3().subVectors(b, a), len = dir.length();
    const g = new THREE.CapsuleGeometry(r, len, small ? 4 : 8, small ? 12 : 24);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()));
    g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
    const n = g.attributes.normal, cols = new Float32Array(n.count * 3);
    for (let i = 0; i < n.count; i++) { const k = 0.84 + 0.17 * Math.min(1, Math.max(0, 0.5 + 0.6 * n.getY(i) + 0.2 * n.getZ(i))); cols[i * 3] = cols[i * 3 + 1] = cols[i * 3 + 2] = k; }
    g.setAttribute("color", new THREE.BufferAttribute(cols, 3));
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, vertexColors: true, toneMapped: false }));
    m.castShadow = true; return m;
  };

  /* A living portrait: the founder's photo on a mesh with real relief (head, nose, eye sockets, shoulders, from Apple
     Vision's face landmarks), so the head can turn and nod from the neck with true parallax, and eyelids drawn from
     each founder's own eye outline, so they blink. */
  const makePortrait = async (img, lm, material, W, H) => {
    const PH = PHOTO * H / W;
    const geo = new THREE.PlaneGeometry(PHOTO, PH, N, Math.round(N * H / W));
    const pos = geo.attributes.position, uv = geo.attributes.uv;
    const A = 96, AH = Math.round(A * H / W), ac = document.createElement("canvas"); ac.width = A; ac.height = AH;
    // A soft alpha map: drawn at a quarter size and scaled back up (a cheap blur; canvas filters are slow to start).
    const sc = document.createElement("canvas"); sc.width = A / 4; sc.height = Math.round(AH / 4); sc.getContext("2d", { willReadFrequently: true }).drawImage(img, 0, 0, sc.width, sc.height);
    const ax = ac.getContext("2d", { willReadFrequently: true }); ax.imageSmoothingQuality = "high"; ax.drawImage(sc, 0, 0, A, AH);
    const ad = ax.getImageData(0, 0, A, AH).data;
    const alphaAt = (u, v) => ad[(Math.min(AH - 1, Math.max(0, Math.round(v * (AH - 1)))) * A + Math.min(A - 1, Math.max(0, Math.round(u * (A - 1))))) * 4 + 3] / 255;
    const [bx, by, bw, bh] = lm.box;
    const head = { x: bx + bw / 2, y: by + bh * 0.4 }, rx = bw * 0.64, ry = bh * 0.82;
    const chin = Math.max(...lm.contour.map((p) => p[1]));
    const nose = lm.noseCrest.reduce((m, p) => (p[1] > m[1] ? p : m), lm.noseCrest[0]);
    const pupils = [lm.leftPupil[0], lm.rightPupil[0]].filter(Boolean);
    const base = new Float32Array(pos.count * 3), moving = [], weights = [];
    for (let i = 0; i < pos.count; i++) {
      const u = uv.getX(i), v = 1 - uv.getY(i), a = alphaAt(u, v);
      const ex = (u - head.x) / rx, ey = (v - head.y) / ry, e = Math.sqrt(ex * ex + ey * ey);
      let z = 0.04 * a; // shoulders and chest: a soft, rounded body
      if (e < 1) z = Math.max(z, 0.04 + 0.08 * Math.sqrt(1 - e * e)); // the head
      z += 0.026 * gauss(u, v, nose, 0.028) - pupils.reduce((t, p) => t + 0.007 * gauss(u, v, p, 0.02), 0);
      z *= Math.min(1, a * 1.6);
      base[i * 3] = pos.getX(i); base[i * 3 + 1] = pos.getY(i); base[i * 3 + 2] = z;
      // How much of this point moves with the head: all of the head, fading to nothing below the chin.
      const w = smooth(1.35, 0.95, e) * smooth(chin + 0.11 * W / H, chin + 0.01, v);
      if (w >= 0.001) { moving.push(i); weights.push(w); }
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    await yieldNow();
    const mv = Int32Array.from(moving), wt = Float32Array.from(weights), arr = pos.array;
    const pivot = { x: (head.x - 0.5) * PHOTO, y: (0.5 - (chin + 0.06 * W / H)) * PH, z: 0.02 };
    const pose = (yaw, pitch, roll) => {
      for (let k = 0; k < mv.length; k++) {
        const i = mv[k], w = wt[k], ay = yaw * w, ap = pitch * w, ar = roll * w;
        const cy = Math.cos(ay), sy = Math.sin(ay), cp = Math.cos(ap), sp = Math.sin(ap), cr = Math.cos(ar), sr = Math.sin(ar);
        const dx = base[i * 3] - pivot.x, dy = base[i * 3 + 1] - pivot.y, dz = base[i * 3 + 2] - pivot.z;
        const x1 = dx * cy + dz * sy, z1 = -dx * sy + dz * cy;
        const y2 = dy * cp - z1 * sp, z2 = dy * sp + z1 * cp;
        arr[i * 3] = x1 * cr - y2 * sr + pivot.x; arr[i * 3 + 1] = x1 * sr + y2 * cr + pivot.y; arr[i * 3 + 2] = z2 + pivot.z;
      }
      pos.needsUpdate = true;
    };
    // Eyelids: drawn over the photo, inside each eye's own outline, in the skin colour just above the eye.
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const cx2 = cv.getContext("2d", { willReadFrequently: true }); cx2.drawImage(img, 0, 0, W, H);
    const eyes = [lm.leftEye, lm.rightEye].filter((e) => e && e.length).map((pts, k) => {
      const P = pts.map(([x, y]) => [x * W, y * H]);
      const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]);
      const box = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
      const brow = (k ? lm.rightBrow : lm.leftBrow) || [];
      const browY = brow.length ? Math.max(...brow.map((p) => p[1] * H)) : box.y0 - (box.y1 - box.y0);
      const sx = Math.round((box.x0 + box.x1) / 2), sy = Math.round((browY + box.y0) / 2);
      const px = cx2.getImageData(sx - 3, sy - 2, 6, 4).data; let r = 0, g = 0, b = 0, n = 0;
      for (let j = 0; j < px.length; j += 4) { r += px[j]; g += px[j + 1]; b += px[j + 2]; n++; }
      return { P, box, skin: `rgb(${(r / n) | 0},${(g / n) | 0},${(b / n) | 0})` };
    });
    // Only the area around the eyes is redrawn for a blink.
    const ex0 = Math.max(0, Math.floor(Math.min(...eyes.map((e) => e.box.x0)) - 16)), ex1 = Math.min(W, Math.ceil(Math.max(...eyes.map((e) => e.box.x1)) + 16));
    const ey0 = Math.max(0, Math.floor(Math.min(...eyes.map((e) => e.box.y0)) - 24)), ey1 = Math.min(H, Math.ceil(Math.max(...eyes.map((e) => e.box.y1)) + 24));
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    let lidNow = 0;
    const lid = (close) => {
      if (close <= 0.02 && lidNow <= 0.02) return; lidNow = close;
      cx2.clearRect(ex0, ey0, ex1 - ex0, ey1 - ey0); cx2.drawImage(img, ex0, ey0, ex1 - ex0, ey1 - ey0, ex0, ey0, ex1 - ex0, ey1 - ey0);
      if (close > 0.02) eyes.forEach(({ P, box, skin }) => {
        const cxm = (box.x0 + box.x1) / 2, cym = (box.y0 + box.y1) / 2, padY = (box.y1 - box.y0) * 0.35 + 1.5;
        cx2.save(); cx2.beginPath();
        P.forEach(([x, y], j) => { const X = cxm + (x - cxm) * 1.18, Y = cym + (y - cym) * 1.45; j ? cx2.lineTo(X, Y) : cx2.moveTo(X, Y); });
        cx2.closePath(); cx2.clip();
        const t = box.y0 - padY, edge = t + (box.y1 - box.y0 + padY * 2) * close;
        cx2.fillStyle = skin; cx2.fillRect(box.x0 - 6, t, box.x1 - box.x0 + 12, edge - t);
        cx2.strokeStyle = "rgba(45,28,22,0.75)"; cx2.lineWidth = 1.6; cx2.beginPath(); cx2.moveTo(box.x0 - 2, edge - 0.5); cx2.quadraticCurveTo(cxm, edge + 1.5 * close, box.x1 + 2, edge - 0.5); cx2.stroke();
        cx2.restore();
      });
      tex.needsUpdate = true;
    };
    material.map = tex; material.needsUpdate = true;
    return { geo, pose, lid, PH, tex };
  };

  const HOLD_LID = +q.get("t3lid") || 0; // ?t3lid=0.6 holds the eyelids, to check them
  const people = [];
  const LANDMARKS = fetch("/assets/img/team/landmarks.json").then((r) => r.json());
  // Every image starts loading now; they decode off the main thread.
  const bodies = FOUNDERS.map((f) => (BAKE ? Promise.reject() : loadBitmap(f.body)).then((img) => ({ baked: true, img }), () => loadBitmap(f.cut).then((img) => ({ baked: false, img }))));
  const kheluImg = loadImg("/assets/img/kheelu-480.webp");
  const baked = {};

  for (let i = 0; i < FOUNDERS.length; i++) {
    const f = FOUNDERS[i];
    const a = deg(f.angle), cx = Math.cos(a), cz = Math.sin(a);
    // Chair, facing the table.
    const chair = new THREE.Group(); const cm = mat(f.chair, 0.75), leg = mat(0xcbb79b, 0.6);
    const seat = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.05, 0.44), cm)); seat.position.y = 0.46; chair.add(seat);
    const back = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.44, 0.045), cm)); back.position.set(0, 0.72, -0.21); back.rotation.x = -0.08; chair.add(back);
    [[-0.2, -0.18], [0.2, -0.18], [-0.2, 0.18], [0.2, 0.18]].forEach(([x, z]) => { const l = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.013, 0.45, seg(12)), leg)); l.position.set(x, 0.225, z); chair.add(l); });
    // Lap and legs (mostly under the table), facing the table with the chair.
    [-0.1, 0.1].forEach((x) => {
      const V = (px, py, pz) => new THREE.Vector3(px, py, pz);
      chair.add(limb(V(x, 0.46, 0.27), V(x, 0.1, 0.33), 0.06, new THREE.Color(0x2c2e35))); // the lap is hidden behind the body
      chair.add(limb(V(x, 0.045, 0.3), V(x, 0.045, 0.43), 0.045, new THREE.Color(0x3a3b40)));
    });
    chair.position.set(cx * SEAT, 0, cz * SEAT); chair.lookAt(0, 0, 0); scene.add(chair);
    // Upper body: turns toward the camera (see the loop below); the photo is unlit, so the shirt runs on without a seam.
    const body = new THREE.Group();
    const photoMat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.03, toneMapped: false, color: 0xfffaf4, side: THREE.DoubleSide });
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(PHOTO, PHOTO), photoMat);
    body.add(photo);
    const person = { body, photo, portrait: null, blinkAt: 1.5 + i * 1.3 + Math.random() * 2, nod: 0, yawNow: 0, seen: true };
    const [{ baked: isBaked, img }, lmAll] = await Promise.all([bodies[i], LANDMARKS]);
    mark("loaded " + f.key);
    const src = isBaked ? img : extendBody(img);
    if (BAKE) baked[f.key] = src.toDataURL("image/webp", 0.86);
    const W = src.naturalWidth || src.width, H = src.naturalHeight || src.height;
    person.portrait = await makePortrait(src, toBody(lmAll[f.key], W, H), photoMat, W, H);
    mark("portrait " + f.key);
    photo.geometry.dispose(); photo.geometry = person.portrait.geo;
    person.bottom = 0.69 - PHOTO * EXT / W; photo.position.set(0, person.bottom + person.portrait.PH / 2, 0.02);
    photo.geometry.computeBoundingSphere();
    body.position.set(cx * PERSON, 0, cz * PERSON); scene.add(body);
    cup(cx * 0.52 + cz * 0.12, cz * 0.52 - cx * 0.12, f.cup);
    Object.assign(person, { head: new THREE.Vector3(cx * PERSON, 1.1, cz * PERSON), base: Math.atan2(-cx, -cz) }); people.push(person);
    mark("founder " + f.key); await yieldNow();
  }
  if (BAKE) window.__t3bake = baked;

  /* ---------- Khelu, on the table between them ---------- */
  const kheluMat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.05, toneMapped: false });
  const khelu = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.25 * (586 / 480)), kheluMat);
  const KX = Math.cos(deg(60)) * 0.5, KZ = Math.sin(deg(60)) * 0.5;
  khelu.position.set(KX, TOP + 0.153, KZ); scene.add(khelu);
  const kt = new THREE.Texture(await kheluImg); kt.colorSpace = THREE.SRGBColorSpace; kt.needsUpdate = true; kheluMat.map = kt;
  const kheluShadow = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false, opacity: 0.8 }));
  kheluShadow.rotation.x = -Math.PI / 2; kheluShadow.position.set(KX, TOP + 0.002, KZ); scene.add(kheluShadow);

  /* ---------- Camera path: wide → each founder, across the table → wide and high ---------- */
  let w = 0, h = 0;
  const portrait = () => w / Math.max(1, h) < 0.85;
  const shot = (i) => {
    const f = FOUNDERS[i]; const a = deg(f.angle);
    return { az: f.angle + 180, r: portrait() ? 1.05 : 0.95, h: portrait() ? 1.34 : 1.27, tx: Math.cos(a) * PERSON, ty: portrait() ? 0.8 : 1.08, tz: Math.sin(a) * PERSON, side: portrait() ? 0 : 0.2 };
  };
  const WIDE = () => ({ az: 270, r: portrait() ? 5.8 : 3.9, h: portrait() ? 2.4 : 2.25, tx: 0, ty: portrait() ? 1.45 : 0.85, tz: 0.35, side: portrait() ? 0 : 0.78 });
  const END = () => ({ az: 268, r: portrait() ? 6.2 : 4.6, h: 3.1, tx: 0, ty: 0.75, tz: 0.25, side: 0 });
  const stageEl = sec.querySelector(".t3__stage");
  w = canvas.clientWidth; h = canvas.clientHeight;
  const cam = { ...WIDE(), roll: 0 };
  const intro = sec.querySelector("[data-t3-intro]"), cards = [...sec.querySelectorAll("[data-t3-card]")], dots = [...sec.querySelectorAll("[data-t3-go]")];

  const tl = gsap.timeline({ paused: true });
  const MOVE = 1.5, HOLD = 1.2;
  tl.to({}, { duration: 0.8 });
  const holds = [];
  FOUNDERS.forEach((_, i) => {
    tl.to(cam, { ...shot(i), duration: MOVE, ease: "sine.inOut" });
    tl.to(cam, { roll: i % 2 ? -2.2 : 2.2, duration: MOVE / 2, ease: "sine.out" }, `<`).to(cam, { roll: 0, duration: MOVE / 2, ease: "sine.in" }, ">");
    holds.push(tl.duration()); tl.to({}, { duration: HOLD }); holds[i] = [holds[i], tl.duration()];
  });
  tl.to(cam, { ...END(), duration: MOVE, ease: "sine.inOut" });
  const total = tl.duration();
  const WINDOWS = holds.map(([a, b]) => [(a - 0.35) / total, (b + 0.2) / total]);

  let active = -2, rectsUntil = 0;
  const link = sec.querySelector("[data-t3-link]"), path = sec.querySelector("[data-t3-path]"), dotEl = sec.querySelector("[data-t3-dot]"), ringEl = sec.querySelector("[data-t3-ring]");
  const draw = { v: 1 };
  const setActive = (i) => {
    if (i === active) return; active = i; rectsUntil = performance.now() + 1000; // the card moves in for ~0.7 s
    if (i >= 0) { people[i].nod = 1; gsap.fromTo(draw, { v: 1 }, { v: 0, duration: 0.9, delay: 0.25, ease: "power2.out" }); } else draw.v = 1;
    sec.classList.toggle("has-link", i >= 0);
    cards.forEach((c, j) => c.classList.toggle("is-on", j === i));
    dots.forEach((d, j) => d.classList.toggle("is-on", j === i));
  };
  let lastO = -1, lastV = -1;
  ScrollTrigger.create({
    trigger: sec, start: "top top", end: "bottom bottom", scrub: 1.1,
    animation: tl,
    onUpdate: (st) => {
      const p = st.progress, o = Math.max(0, 1 - p / 0.07), v = Math.max(0, 1 - p / 0.09);
      if (o !== lastO || o > 0) { intro.style.opacity = String(o); intro.style.transform = `translate3d(0,${(-p * 600).toFixed(1)}px,0)`; lastO = o; }
      if (v !== lastV) { sec.style.setProperty("--veil", v.toFixed(3)); lastV = v; } // once the intro has gone, no more style writes
      setActive(WINDOWS.findIndex(([a, b]) => p >= a && p <= b));
    },
  });
  dots.forEach((d) => d.addEventListener("click", () => {
    const i = +d.dataset.t3Go, [a, b] = WINDOWS[i];
    const y = sec.offsetTop + (sec.offsetHeight - innerHeight) * ((a + b) / 2);
    window.scrollTo({ top: y, behavior: "smooth" });
  }));

  /* ---------- Size: measured by a ResizeObserver, never read in the loop ---------- */
  // Pixel budget: a phone draws at most ~1.6 MP, a desktop ~4.2 MP (a 4K TV renders below 1× and is upscaled, softly).
  const DPR0 = Math.min(devicePixelRatio || 1, small ? 1.5 : 2), BUDGET = small ? 1.6e6 : 4.2e6;
  let dpr = DPR0, slowCut = 0;
  const size = () => {
    dpr = Math.max(0.5, Math.min(DPR0, Math.sqrt(BUDGET / Math.max(1, w * h))) - slowCut);
    renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h); camera.fov = portrait() ? 44 : 30; camera.updateProjectionMatrix();
  };
  let sized = false;
  new ResizeObserver(([e]) => {
    const nw = Math.round(e.contentRect.width), nh = Math.round(e.contentRect.height);
    if (nw === w && nh === h && sized) return; w = nw; h = nh; sized = true; size(); stageRect = null;
  }).observe(canvas);
  size();

  /* ---------- Render loop: only while the scene is on screen ---------- */
  const target = new THREE.Vector3(), pos = new THREE.Vector3(), fwd = new THREE.Vector3(), right = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0);
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  if (fine) sec.addEventListener("pointermove", (e) => { pointer.x = e.clientX / innerWidth - 0.5; pointer.y = e.clientY / innerHeight - 0.5; }, { passive: true });
  const frustum = new THREE.Frustum(), pv = new THREE.Matrix4(), sphere = new THREE.Sphere();
  const clock = new THREE.Clock();
  let running = false, raf = 0, slow = 0, frames = 0;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const dtRaw = clock.getDelta(), dt = Math.min(0.05, dtRaw); const t = clock.elapsedTime;
    // Keep it smooth: if frames keep running long, render fewer pixels (a quarter step at a time, at most one whole step).
    if (++frames > 30) { slow = slow * 0.95 + (dtRaw > 0.026 ? 1 : 0) * 0.05; if (slow > 0.5 && dpr > 0.75 && slowCut < 1) { slowCut += 0.25; size(); slow = 0; } }
    pointer.sx += (pointer.x - pointer.sx) * 0.05; pointer.sy += (pointer.y - pointer.sy) * 0.05;
    const az = deg(cam.az);
    pos.set(Math.cos(az) * cam.r, cam.h, Math.sin(az) * cam.r);
    target.set(cam.tx, cam.ty, cam.tz);
    fwd.subVectors(target, pos).normalize(); right.crossVectors(fwd, UP).normalize();
    target.addScaledVector(right, -cam.side); // the subject sits right of centre; its card sits on the left
    pos.addScaledVector(right, pointer.sx * 0.08); pos.y += -pointer.sy * 0.05;
    camera.position.copy(pos); camera.up.set(Math.sin(deg(cam.roll)), Math.cos(deg(cam.roll)), 0); camera.lookAt(target);
    camera.updateMatrixWorld(); pv.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); frustum.setFromProjectionMatrix(pv);
    // Each founder turns most of the way toward the camera and breathes; Khelu always faces the camera.
    people.forEach((p, i) => {
      const toCam = Math.atan2(camera.position.x - p.body.position.x, camera.position.z - p.body.position.z);
      let d = toCam - p.base; d = Math.atan2(Math.sin(d), Math.cos(d));
      p.body.rotation.y = p.base + d * 0.88;
      p.photo.scale.y = 1 + Math.sin(t * 1.5 + i * 1.7) * 0.004; p.photo.position.y = p.bottom + (p.portrait.PH / 2) * p.photo.scale.y;
      sphere.copy(p.photo.geometry.boundingSphere).applyMatrix4(p.photo.matrixWorld);
      if (!frustum.intersectsSphere(sphere)) return; // out of shot: no face work this frame
      // Idle: small, slow head turns and tilts. In focus: the founder turns to you and gives a small nod.
      const focus = i === active ? 1 : 0; p.yawNow += ((focus ? -d * 0.12 : 0) - p.yawNow) * 0.05;
      p.nod = Math.max(0, p.nod - dt * 0.9);
      const nod = Math.sin((1 - p.nod) * Math.PI * 2) * p.nod * 0.16;
      p.portrait.pose(Math.sin(t * 0.45 + i * 2.1) * 0.07 + Math.sin(t * 1.1 + i) * 0.02 + p.yawNow, Math.sin(t * 0.6 + i * 1.3) * 0.035 + nod, Math.sin(t * 0.38 + i) * 0.03);
      // Blinks: every 2.5–6 s, about a sixth of a second; sometimes a double blink.
      if (HOLD_LID) p.portrait.lid(HOLD_LID); else if (t >= p.blinkAt) { const k = (t - p.blinkAt) / 0.17; if (k >= 1) { p.portrait.lid(0); p.blinkAt = t + (Math.random() < 0.18 ? 0.25 : 2.5 + Math.random() * 3.5); } else p.portrait.lid(Math.sin(k * Math.PI)); }
    });
    khelu.lookAt(camera.position.x, khelu.position.y, camera.position.z);
    khelu.position.y = TOP + 0.153 + Math.abs(Math.sin(t * 1.6)) * 0.006;
    steams.forEach(({ s, phase }) => { const k = (t * 0.35 + phase) % 1; s.position.y = 0.09 + k * 0.22; s.position.x = Math.sin(t + phase * 6) * 0.012; s.material.opacity = Math.sin(k * Math.PI) * 0.22; s.scale.setScalar(0.025 + k * 0.045); });
    renderer.render(scene, camera);
    if (link) { if (active >= 0) linkTo(people[active]); else if (linkShown) { link.style.setProperty("--dot", "0"); link.style.setProperty("--draw", "1"); linkShown = false; } }
  };
  const anchor = new THREE.Vector3(), sr = { w: 0, h: 0 };
  let stageRect = null, cardRect = null, linkShown = false;
  const linkTo = (p) => {
    // Rects are read only while the card is moving in (or after a resize), not on every frame.
    if (!stageRect || performance.now() < rectsUntil) { stageRect = stageEl.getBoundingClientRect(); cardRect = cards[active].getBoundingClientRect(); }
    const st = stageRect, card = cardRect;
    if (sr.w !== st.width || sr.h !== st.height) { sr.w = st.width; sr.h = st.height; link.setAttribute("viewBox", `0 0 ${sr.w} ${sr.h}`); }
    anchor.set(portrait() ? 0 : -0.19, 0.69 + PHOTO * (portrait() ? 0.32 : 0.2), 0.06); p.body.localToWorld(anchor); anchor.project(camera);
    const ax = ((anchor.x * 0.5 + 0.5) * sr.w).toFixed(1), ay = ((-anchor.y * 0.5 + 0.5) * sr.h).toFixed(1);
    let d;
    if (portrait()) { const ex = card.left - st.left + card.width * 0.5, ey = card.top - st.top - 2; d = `M${ax},${ay} C${ax},${(+ay + ey) / 2} ${ex},${(+ay + ey) / 2} ${ex},${ey}`; }
    else { const ex = card.right - st.left + 2, ey = card.top - st.top + 64, mx = (+ax + ex) / 2; d = `M${ax},${ay} C${mx},${ay} ${mx},${ey} ${ex},${ey}`; }
    path.setAttribute("d", d); dotEl.setAttribute("cx", ax); dotEl.setAttribute("cy", ay); ringEl.setAttribute("cx", ax); ringEl.setAttribute("cy", ay);
    link.style.setProperty("--draw", String(draw.v)); link.style.setProperty("--dot", String(1 - draw.v)); linkShown = true;
  };
  const run = (on) => { if (on === running) return; running = on; if (on) { clock.getDelta(); if (!clock.running) clock.start(); frame(); } else cancelAnimationFrame(raf); };

  /* ---------- Prepare everything before the first frame: textures, shaders, the shadow map ---------- */
  mark("built");
  for (const p of people) { renderer.initTexture(p.portrait.tex); await yieldNow(); }
  renderer.initTexture(kt); mark("textures");
  try { await renderer.compileAsync(scene, camera); } catch (e) { /* older drivers: compiled on the first frame */ }
  mark("compiled"); await yieldNow();
  renderer.shadowMap.needsUpdate = true;
  frame(); cancelAnimationFrame(raf); // one frame (draws the shadow map once)
  mark("first frame");
  if (CAPTURE) window.__t3capture = () => { people.forEach((p) => p.portrait.lid(0)); renderer.render(scene, camera); return canvas.toDataURL("image/webp", 0.9); };

  let onScreen = true;
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; run(onScreen && !document.hidden); }, { rootMargin: "100px" }).observe(sec);
  document.addEventListener("visibilitychange", () => run(onScreen && !document.hidden));
  sec.classList.add("is-ready");
}
