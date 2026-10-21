/* Team page, fold 1: the three founders at one round table, in real-time 3D (Three.js).
 * Faces are the founders' own photos, cut out on this Mac with Apple's Vision (tools/cutout/cutout.swift), so they are
 * exactly who they are. Scrolling rolls the camera from a wide shot to each founder in turn, where their card opens,
 * then back out. No WebGL, or prefers-reduced-motion → the scene folds away and the founder cards below show instead. */
import * as THREE from "/assets/vendor/three.module.min.js";

const sec = document.querySelector("[data-t3]");
if (sec) start();

function start() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const canvas = sec.querySelector(".t3__canvas");
  const off = () => sec.classList.add("t3-off");
  let renderer = null;
  if (!reduced && window.gsap && window.ScrollTrigger) {
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" }); } catch (e) { renderer = null; }
  }
  if (!renderer) { off(); return; }
  document.documentElement.classList.add("t3-live");

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 12 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe6eeff, 0.55);
  fill.position.set(3, 2.2, -2.5);
  scene.add(fill);

  const mat = (color, rough = 0.8, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, ...extra });
  const shadowed = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };

  /* ---------- Room: floor, a soft rug, a curved back wall with a window glow, two plants ---------- */
  const floor = new THREE.Mesh(new THREE.CircleGeometry(14, 64), mat(0xefe6da, 1));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.95, 96), mat(0xece4f6, 1));
  rug.rotation.x = -Math.PI / 2; rug.position.y = 0.004; rug.receiveShadow = true; scene.add(rug);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 6.5, 7, 96, 1, true, Math.PI * 0.05, Math.PI * 0.9), mat(0xf6efe6, 1, { side: THREE.BackSide }));
  wall.position.set(0, 3.5, -1); wall.rotation.y = Math.PI; scene.add(wall);
  const windowGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.9), new THREE.MeshBasicMaterial({ color: 0xfffbf3, fog: true }));
  windowGlow.position.set(-1.4, 2.0, 5.35); windowGlow.rotation.y = Math.PI; scene.add(windowGlow);
  const winFrame = new THREE.Mesh(new THREE.PlaneGeometry(2.75, 2.05), mat(0xe8dccd, 1));
  winFrame.position.set(-1.4, 2.0, 5.37); winFrame.rotation.y = Math.PI; scene.add(winFrame);
  const art = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.1), mat(0xfde4ee, 1));
  art.position.set(1.9, 1.85, 5.3); art.rotation.y = Math.PI; scene.add(art);
  const plant = (x, z, s) => {
    const g = new THREE.Group();
    g.add(shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.13, 0.36, 32), mat(0xf2cf72, 0.7))));
    g.children[0].position.y = 0.18;
    const leaf = mat(0x8fc9a2, 0.9);
    for (let i = 0; i < 9; i++) {
      const l = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), leaf));
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
  const top = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.045, 96), oak)); top.position.y = TOP - 0.0225; scene.add(top);
  const lip = shadowed(new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.022, 12, 96), oakDark)); lip.rotation.x = Math.PI / 2; lip.position.y = TOP - 0.022; scene.add(lip);
  const stem = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.075, 0.7, 32), oakDark)); stem.position.y = 0.37; scene.add(stem);
  const foot = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.035, 64), oakDark)); foot.position.y = 0.018; scene.add(foot);
  const blob = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d"); const g = x.createRadialGradient(64, 64, 4, 64, 64, 64); g.addColorStop(0, "rgba(70,45,20,0.32)"); g.addColorStop(1, "rgba(70,45,20,0)"); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
  const under = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.3), new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false }));
  under.rotation.x = -Math.PI / 2; under.position.y = 0.006; scene.add(under);

  /* ---------- Pendant lamp ---------- */
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 1.6, 8), mat(0x6e6e73)); cord.position.y = 2.95; scene.add(cord);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.2, 64, 1, true), mat(0xf2cf72, 0.6, { side: THREE.DoubleSide })); shade.position.y = 2.1; scene.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 24, 16), new THREE.MeshBasicMaterial({ color: 0xfff3d6 })); bulb.position.y = 2.02; scene.add(bulb);
  const lamp = new THREE.PointLight(0xffd9a0, 1.6, 4.5, 1.6); lamp.position.y = 1.95; scene.add(lamp);

  /* ---------- Steam for the cups ---------- */
  const puff = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const x = c.getContext("2d"); const g = x.createRadialGradient(32, 32, 2, 32, 32, 32); g.addColorStop(0, "rgba(255,255,255,0.9)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
  const steams = [];
  const cup = (x, z, color) => {
    const g = new THREE.Group();
    const saucer = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.01, 40), mat(0xffffff, 0.35))); saucer.position.y = 0.005; g.add(saucer);
    const body = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.034, 0.075, 40, 1, true), mat(color, 0.35, { side: THREE.DoubleSide }))); body.position.y = 0.048; g.add(body);
    const base = new THREE.Mesh(new THREE.CircleGeometry(0.034, 32), mat(color, 0.35)); base.rotation.x = -Math.PI / 2; base.position.y = 0.011; g.add(base);
    const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.039, 32), mat(0x6b4226, 0.3)); coffee.rotation.x = -Math.PI / 2; coffee.position.y = 0.075; g.add(coffee);
    const handle = shadowed(new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.006, 8, 24), mat(color, 0.35))); handle.position.set(0.047, 0.05, 0); g.add(handle);
    for (let i = 0; i < 3; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puff, transparent: true, depthWrite: false, opacity: 0 })); s.scale.setScalar(0.06); s.position.y = 0.09; g.add(s); steams.push({ s, phase: i / 3 + Math.random() * 0.1 }); }
    g.position.set(x, TOP, z); scene.add(g); return g;
  };

  /* ---------- The founders: a chair in their colour, a body, and their own photo ---------- */
  const deg = (d) => (d * Math.PI) / 180;
  const FOUNDERS = [
    { photo: "/assets/img/team/apoorva-cut.webp", angle: 30, chair: 0xbfe6d2, shirt: 0x19181d, cup: 0xcdeedd },
    { photo: "/assets/img/team/aman-cut.webp", angle: 90, chair: 0xffd6bd, shirt: 0x413c26, cup: 0xffdcc6 },
    { photo: "/assets/img/team/kashyap-cut.webp", angle: 150, chair: 0xc6dff7, shirt: 0xcbbfae, cup: 0xd4e8fb },
  ];
  const SEAT = 1.08, PERSON = 0.99, PHOTO = 0.68;
  const trousers = mat(0x353a48, 0.9), skin = mat(0xc89478, 0.7);
  const loader = new THREE.TextureLoader();
  // A gently curved card reads as a body with depth as the camera moves, where a flat card would read as paper.
  const curved = (() => { const g = new THREE.PlaneGeometry(PHOTO, PHOTO, 24, 1); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i); p.setZ(i, -1.1 * x * x); } p.needsUpdate = true; g.computeVertexNormals(); return g; })();
  const people = [];
  let loaded = 0;
  FOUNDERS.forEach((f, i) => {
    const a = deg(f.angle), cx = Math.cos(a), cz = Math.sin(a);
    // Chair, facing the table.
    const chair = new THREE.Group(); const cm = mat(f.chair, 0.75), leg = mat(0xcbb79b, 0.6);
    const seat = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.05, 0.44), cm)); seat.position.y = 0.46; chair.add(seat);
    const back = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.44, 0.045), cm)); back.position.set(0, 0.72, -0.21); back.rotation.x = -0.08; chair.add(back);
    [[-0.2, -0.18], [0.2, -0.18], [-0.2, 0.18], [0.2, 0.18]].forEach(([x, z]) => { const l = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.013, 0.45, 12), leg)); l.position.set(x, 0.225, z); chair.add(l); });
    // Lap and legs (mostly under the table), facing the table with the chair.
    [-0.1, 0.1].forEach((x) => {
      const thigh = shadowed(new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.3, 6, 16), trousers)); thigh.rotation.x = Math.PI / 2; thigh.position.set(x, 0.55, 0.1); chair.add(thigh);
      const shin = shadowed(new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.36, 6, 16), trousers)); shin.position.set(x, 0.3, 0.3); chair.add(shin);
      const shoe = shadowed(new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.1, 4, 12), mat(0xf4f1ec, 0.6))); shoe.rotation.x = Math.PI / 2; shoe.position.set(x, 0.05, 0.36); chair.add(shoe);
    });
    chair.position.set(cx * SEAT, 0, cz * SEAT); chair.lookAt(0, 0, 0); scene.add(chair);
    // Upper body: turns toward the camera (see `face` below); the shirt continues under the photo down to the seat.
    const body = new THREE.Group();
    // Unlit, like the photo above it, so the shirt runs on without a seam.
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.14), new THREE.MeshBasicMaterial({ color: f.shirt, toneMapped: false })); torso.castShadow = true; torso.position.set(0, 0.6, -0.08); body.add(torso); // behind the photo, filling down to the seat
    const photoMat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.03, toneMapped: false, color: 0xfffaf4, side: THREE.DoubleSide });
    const photo = new THREE.Mesh(curved, photoMat); photo.position.set(0, 0.69 + PHOTO / 2, 0.02); body.add(photo);
    loader.load(f.photo, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); photoMat.map = t; photoMat.needsUpdate = true; if (++loaded === FOUNDERS.length + 1) ready(); });
    body.position.set(cx * PERSON, 0, cz * PERSON); scene.add(body);
    cup(cx * 0.52 + cz * 0.12, cz * 0.52 - cx * 0.12, f.cup);
    people.push({ body, photo, head: new THREE.Vector3(cx * PERSON, 1.1, cz * PERSON), base: Math.atan2(-cx, -cz) });
  });

  /* ---------- Khelu, on the table between them ---------- */
  const kheluMat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.05, toneMapped: false });
  const khelu = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.25 * (586 / 480)), kheluMat);
  const KX = Math.cos(deg(60)) * 0.5, KZ = Math.sin(deg(60)) * 0.5;
  khelu.position.set(KX, TOP + 0.153, KZ); scene.add(khelu);
  loader.load("/assets/img/kheelu-480.webp", (t) => { t.colorSpace = THREE.SRGBColorSpace; kheluMat.map = t; kheluMat.needsUpdate = true; if (++loaded === FOUNDERS.length + 1) ready(); });
  const kheluShadow = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false, opacity: 0.8 }));
  kheluShadow.rotation.x = -Math.PI / 2; kheluShadow.position.set(KX, TOP + 0.002, KZ); scene.add(kheluShadow);

  /* ---------- Camera path: wide → each founder, across the table → wide and high ---------- */
  const portrait = () => canvas.clientWidth / Math.max(1, canvas.clientHeight) < 0.85;
  const shot = (i) => {
    const f = FOUNDERS[i]; const a = deg(f.angle);
    return { az: f.angle + 180, r: portrait() ? 1.05 : 0.95, h: portrait() ? 1.34 : 1.27, tx: Math.cos(a) * PERSON, ty: portrait() ? 0.8 : 1.08, tz: Math.sin(a) * PERSON, side: portrait() ? 0 : 0.2 };
  };
  const WIDE = () => ({ az: 270, r: portrait() ? 5.8 : 3.9, h: portrait() ? 2.4 : 2.25, tx: 0, ty: portrait() ? 1.45 : 0.85, tz: 0.35, side: portrait() ? 0 : 0.78 });
  const END = () => ({ az: 268, r: portrait() ? 6.2 : 4.6, h: 3.1, tx: 0, ty: 0.75, tz: 0.25, side: 0 });
  const cam = { ...WIDE(), roll: 0 };
  const intro = sec.querySelector("[data-t3-intro]"), cards = [...sec.querySelectorAll("[data-t3-card]")], dots = [...sec.querySelectorAll("[data-t3-go]")];

  const tl = gsap.timeline({ paused: true });
  const MOVE = 1.5, HOLD = 1.2;
  tl.to({}, { duration: 0.8 });
  const holds = [];
  FOUNDERS.forEach((_, i) => {
    const s = shot(i);
    tl.to(cam, { ...s, duration: MOVE, ease: "sine.inOut" });
    tl.to(cam, { roll: i % 2 ? -2.2 : 2.2, duration: MOVE / 2, ease: "sine.out" }, `<`).to(cam, { roll: 0, duration: MOVE / 2, ease: "sine.in" }, ">");
    holds.push(tl.duration()); tl.to({}, { duration: HOLD }); holds[i] = [holds[i], tl.duration()];
  });
  tl.to(cam, { ...END(), duration: MOVE, ease: "sine.inOut" });
  const total = tl.duration();
  const WINDOWS = holds.map(([a, b]) => [(a - 0.35) / total, (b + 0.2) / total]);

  let active = -2;
  const setActive = (i) => {
    if (i === active) return; active = i;
    cards.forEach((c, j) => c.classList.toggle("is-on", j === i));
    dots.forEach((d, j) => d.classList.toggle("is-on", j === i));
  };
  ScrollTrigger.create({
    trigger: sec, start: "top top", end: "bottom bottom", scrub: 1.1,
    animation: tl,
    onUpdate: (st) => {
      const p = st.progress;
      intro.style.opacity = String(Math.max(0, 1 - p / 0.07));
      intro.style.transform = `translateY(${-p * 600}px)`;
      sec.style.setProperty("--veil", String(Math.max(0.0, 1 - p / 0.09)));
      setActive(WINDOWS.findIndex(([a, b]) => p >= a && p <= b));
    },
  });
  dots.forEach((d) => d.addEventListener("click", () => {
    const i = +d.dataset.t3Go, [a, b] = WINDOWS[i];
    const y = sec.offsetTop + (sec.offsetHeight - innerHeight) * ((a + b) / 2);
    window.scrollTo({ top: y, behavior: "smooth" });
  }));

  /* ---------- Render loop: only while the scene is on screen ---------- */
  const target = new THREE.Vector3(), pos = new THREE.Vector3(), fwd = new THREE.Vector3(), right = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0);
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  if (fine) sec.addEventListener("pointermove", (e) => { pointer.x = e.clientX / innerWidth - 0.5; pointer.y = e.clientY / innerHeight - 0.5; });
  let w = 0, h = 0;
  const size = () => {
    const nw = canvas.clientWidth, nh = canvas.clientHeight; if (nw === w && nh === h) return; w = nw; h = nh;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, portrait() ? 1.5 : 2)); renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.fov = portrait() ? 44 : 30; camera.updateProjectionMatrix();
  };
  const clock = new THREE.Clock();
  let running = false, raf = 0;
  const frame = () => {
    raf = requestAnimationFrame(frame); size();
    const t = clock.getElapsedTime();
    pointer.sx += (pointer.x - pointer.sx) * 0.05; pointer.sy += (pointer.y - pointer.sy) * 0.05;
    const az = deg(cam.az);
    pos.set(Math.cos(az) * cam.r, cam.h, Math.sin(az) * cam.r);
    target.set(cam.tx, cam.ty, cam.tz);
    fwd.subVectors(target, pos).normalize(); right.crossVectors(fwd, UP).normalize();
    target.addScaledVector(right, -cam.side); // the subject sits right of centre; its card sits on the left
    pos.addScaledVector(right, pointer.sx * 0.08); pos.y += -pointer.sy * 0.05;
    camera.position.copy(pos); camera.up.set(Math.sin(deg(cam.roll)), Math.cos(deg(cam.roll)), 0); camera.lookAt(target);
    // Each founder turns most of the way toward the camera and breathes; Khelu always faces the camera.
    people.forEach((p, i) => {
      const toCam = Math.atan2(camera.position.x - p.body.position.x, camera.position.z - p.body.position.z);
      let d = toCam - p.base; d = Math.atan2(Math.sin(d), Math.cos(d));
      p.body.rotation.y = p.base + d * 0.88;
      p.photo.scale.y = 1 + Math.sin(t * 1.5 + i * 1.7) * 0.006; p.photo.position.y = 0.69 + (PHOTO / 2) * p.photo.scale.y;
      p.photo.rotation.z = Math.sin(t * 0.6 + i) * 0.012;
    });
    khelu.lookAt(camera.position.x, khelu.position.y, camera.position.z);
    khelu.position.y = TOP + 0.153 + Math.abs(Math.sin(t * 1.6)) * 0.006;
    steams.forEach(({ s, phase }) => { const k = (t * 0.35 + phase) % 1; s.position.y = 0.09 + k * 0.22; s.position.x = Math.sin(t + phase * 6) * 0.012; s.material.opacity = Math.sin(k * Math.PI) * 0.22; s.scale.setScalar(0.025 + k * 0.045); });
    renderer.render(scene, camera);
  };
  const run = (on) => { if (on === running) return; running = on; if (on) { clock.start(); frame(); } else cancelAnimationFrame(raf); };
  new IntersectionObserver(([e]) => run(e.isIntersecting), { rootMargin: "100px" }).observe(sec);
  document.addEventListener("visibilitychange", () => run(!document.hidden && sec.getBoundingClientRect().bottom > 0 && sec.getBoundingClientRect().top < innerHeight));
  function ready() { sec.classList.add("is-ready"); ScrollTrigger.refresh(); }
  addEventListener("resize", () => { w = 0; });
}
