# 3D model handoff: two GLBs for the immersive redesign

Everything you need is in this folder (`3d-handoff/`). Two models power the new immersive site: the **mascot** (rigged, with an idle animation) and the **Lumi plush** (static). You generate them; Claude verifies, compresses, and wires them into the scene.

**Timing:** these are needed for the BUILD, not for picking a wireframe. Review the four directions in `design-concepts/round-2-immersive/` in parallel. Direction 2 ("A Day with Lumi") leans on these models hardest; directions 3 and 4 can ship without them.

**Two routes.** Route A is the proven Tripo pipeline (fast, ~130-200 credits, quality = "stylized approximation"). Route B is commissioning a 3D artist (best ceiling, your timeline). Pick either; the deliverable spec at the bottom is the same.

---

## Route A: Tripo3D web UI (studio.tripo3d.ai, you are logged in; 745 credits left)

### MODEL 1: the mascot (rigged + idle)

**Inputs (in this folder):** `mascot-front.png`, `mascot-side.png`, `mascot-back.png`
These are the exact Janus-fix inputs that produced the good v2 model (single face, wink baked into the front). Do not re-cut them.

Steps, same recipe as the v2 run:
1. New Image-to-3D task, **multi-view**: Front = `mascot-front.png`, Side = `mascot-side.png`, Back = `mascot-back.png`. Match slots by their labels, not their order.
2. Settings: **Smart Mesh ON, Triangle topology, 10,000 polys, 2K texture**.
3. Generate, then check the result from the BACK: one face only, no second face on the back of the head.
4. **Auto-rig** (rig v2.5; if it asks, the "Good for Animals" / Humanoid option), then apply the **idle** animation preset.
5. **Export GLB with the skeleton and the animation track included** (the export that lists "NlaTrack" or similar). Download to `~/Downloads`.

### MODEL 2: the Lumi plush (static, no rig)

**Inputs (in this folder):** `lumi-front.png`, `lumi-left.png`, `lumi-right.png`, `lumi-back.png`
These are your approved Gemini studio cutouts, much better source art than the photos used in the first attempt (the one you judged low quality). That attempt also had only 3 views; this one has all 4.

1. New Image-to-3D task, **multi-view**: fill Front, Left, Right, and Back (use as many view slots as the UI offers; Front + Left + Back if it only takes 3).
2. Settings: **Smart Mesh ON, Triangle topology, 10,000 polys, 2K texture**.
3. **No rig, no animation.** Export GLB. Download to `~/Downloads`.

**Quality gates before you download (either model):**
- Hat ends in a **thin lavender ribbon curling upward**: never a pom-pom, never a bare cone.
- Lumi spine spikes from top: **peach, yellow, light blue, purple, green**.
- Foot pads the same pale blue as the body, never pink.
- One face only (check the back of the head).
- If a result fails, regenerate once before moving on; retry credits are fine (cap ~400 total).

## LIVE SETTINGS ADDENDUM (2026-07-09, from the founder's actual Tripo session)

The founder generated a new high-detail mascot (1.96M faces) plus a segmented variant. The web pipeline from there:
1. **Retopo first** (the raw model is ~65x over the ~30k-face web budget): target ~30,000 faces for the mascot / ~20,000 for Lumi, with texture bake ON (2K). Verify the texture survives before spending more credits.
   - **Observed 2026-07-09:** retopo to 30,192 faces worked, but the baked texture degraded (washed-out glasses, dark patch on the shorts, blotchy antlers). Fix: **Texture tab → Generate Texture** on the retopo'd mesh (20 credits), reference image = `mascot-front.png` (carries the wink + glasses + K mark), style None, 4K (downsized locally for web). Re-check gates after.
2. **Then Animate**: auto-rig + idle preset on the retopo'd mascot (Lumi stays static). Do this only AFTER the texture passes.
3. **Export dialog settings**: format **GLB**, **Pack UV ON** (single texture atlas, fewer draw calls), **Bottom Center Pivot ON** (origin at the feet). Never OBJ/FBX/STL/USD/3MF for the site.
4. The segmented model is an optional side export (same GLB settings): named parts enable procedural ear/tail motion and Direction-4 pop-up assembly tricks, but it is NOT a substitute for the rigged idle GLB.
5. Credits: 625 left as of this session (~120 spent on the new batch). Retopo/rig cost credits: finish the mascot end-to-end and pass the quality check before starting Lumi.

## Route B: commission an artist (alternative)

Hand them the same images in this folder as reference plus this spec:
- Format: **GLB (glTF 2.0 binary)**, PBR textures at 2K max.
- Mascot: up to ~30,000 triangles, **rigged**, one looping **idle** animation clip baked in.
- Lumi plush: up to ~20,000 triangles, static, faithful fabric feel.
- Real proportions and colors exactly per the reference images (the quality gates above apply).

## When you are done

Both files sit in `~/Downloads`. Tell Claude **"models are in"**. The pipeline from there: 8-angle contact-sheet check against the gates above, meshopt compression (the idle clip is verified to survive it), then into `site/public/models/` and the live scene.
