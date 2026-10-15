// The hero photo's crops as data and geometry (task Q2.1, D064 item 4; assets.md §3): which DS photo, where the boy and
// Kheelu sit in it, and the window each crop cuts. Pure: no file access and no import.meta, so the generator
// (build-hero-crops.mjs), its guard (test/guards/generated-hero-crops.test.ts) and the first-screen spec
// (test/e2e/first-screen.spec.ts, which Playwright loads as CommonJS) all read the same numbers.

/** @typedef {readonly [number, number, number, number]} Share A box as shares of a picture: [left, top, right, bottom]. */
/** @typedef {"child" | "head" | "kheelu"} Subject */
/**
 * @typedef {object} HeroCrop
 * @property {string} path the output, from the repo root
 * @property {number} width the output's width in pixels
 * @property {number} height the output's height in pixels
 * @property {number} top the window's top, a share of the photo's height
 * @property {number} bottom the window's bottom, a share of the photo's height
 * @property {number} [centre] the window's centre, a share of the photo's width
 * @property {number} [right] the window's right edge, a share of the photo's width (instead of `centre`)
 */
/** @typedef {{ readonly width: number, readonly height: number }} Size */

/** The DS master the crops are cut from, under design-system/project/assets. */
export const HERO_SOURCE = "Photo library/kabir-02-block-rocket.jpg";
/** Its size: the subjects below were read on this photo, so another file is refused. @type {Size} */
export const MASTER_SIZE = { width: 2752, height: 1536 };

/**
 * Where the boy and Kheelu are in the photo, as shares of its width and height, [left, top, right, bottom], read by eye
 * on a 25 px grid laid over the 1500 x 837 web file (2026-10-15), each edge rounded outwards: `child` from his left heel
 * to the hands on the tower, hair to knee; `head` his hair, glasses and chin; `kheelu` both ears and both feet.
 * @type {Readonly<Record<Subject, Share>>}
 */
export const SUBJECTS = {
  child: [0.531, 0.126, 0.807, 0.928],
  head: [0.573, 0.126, 0.706, 0.354],
  kheelu: [0.707, 0.659, 0.859, 0.971],
};

/** The DS rule's "off the edge", as a share of the crop: at least 1 % clear of every side. */
export const OFF_THE_EDGE = 0.01;

/**
 * The crops: the output's path and size, and the window cut from the master, its top and bottom as shares of the
 * photo's height (its width follows the output's ratio), placed by its `centre` or its `right` edge (shares of the width).
 * @type {readonly HeroCrop[]}
 */
export const HERO_CROPS = [
  {
    // From 720 px: the full height, centred on the boy and Kheelu, who fill 84 % of it, about 13 % clear on each side.
    path: "src/assets/hero/kabir-02-block-rocket-4x5.jpg",
    width: 1200,
    height: 1500,
    top: 0,
    bottom: 1,
    centre: 0.695,
  },
  {
    // Under 720 px: a band from just above his hair to just under Kheelu's feet, as far right as the photo goes, so
    // Kheelu ends at 82 % of the crop's width, out of the column the WhatsApp bubble rests in (D050), and the crop is
    // short enough for Kheelu to end on the first screen at 390 x 844 and 412 x 915 (D061 item 1).
    path: "src/assets/hero/kabir-02-block-rocket-16x10.jpg",
    width: 1600,
    height: 1000,
    top: 0.095,
    bottom: 0.992,
    right: 1,
  },
];

/**
 * The window a crop cuts from a master of this size, in master pixels.
 * @param {HeroCrop} crop
 * @param {Size} master
 * @returns {{ left: number, top: number, width: number, height: number }}
 */
export function cropWindow(crop, master) {
  const top = Math.round(crop.top * master.height);
  const height = Math.round((crop.bottom - crop.top) * master.height);
  const width = Math.round((height * crop.width) / crop.height);
  const left = crop.right !== undefined ? Math.round(crop.right * master.width) - width : Math.round((crop.centre ?? 0.5) * master.width - width / 2);
  return { left, top, width, height };
}

/**
 * Each subject's box inside a crop, as shares of the crop's width and height, [left, top, right, bottom].
 * @param {HeroCrop} crop
 * @param {Size} master
 * @returns {Record<Subject, Share>}
 */
export function subjectsIn(crop, master) {
  const w = cropWindow(crop, master);
  return /** @type {Record<Subject, Share>} */ (
    Object.fromEntries(
      Object.entries(SUBJECTS).map(([name, [l, t, r, b]]) => [
        name,
        [(l * master.width - w.left) / w.width, (t * master.height - w.top) / w.height, (r * master.width - w.left) / w.width, (b * master.height - w.top) / w.height],
      ]),
    )
  );
}
