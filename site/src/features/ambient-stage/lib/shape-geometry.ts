import * as THREE from "three";
import { SVGLoader } from "three-stdlib";
import { SHAPE_PATHS, type ShapeKind } from "@/lib/shape-paths";

/** Extruded brand-shape geometry, unit-scaled and centered. Cached per kind.
 *  The chunky "toy" look comes from a deep bevel relative to size. */
const cache = new Map<ShapeKind, THREE.ExtrudeGeometry>();

export function getShapeGeometry(kind: ShapeKind): THREE.ExtrudeGeometry {
  const hit = cache.get(kind);
  if (hit) return hit;

  const loader = new SVGLoader();
  const svg = loader.parse(
    `<svg xmlns="http://www.w3.org/2000/svg"><path d="${SHAPE_PATHS[kind]}"/></svg>`,
  );
  const shapes = svg.paths.flatMap((p) =>
    SVGLoader.createShapes(p as unknown as Parameters<typeof SVGLoader.createShapes>[0]),
  );
  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: 10,
    bevelEnabled: true,
    bevelThickness: 4,
    bevelSize: 3,
    bevelSegments: 3,
    curveSegments: 10,
  });
  // normalize: unit height, centered, SVG y-down flipped
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const size = new THREE.Vector3();
  bb.getSize(size);
  const s = 1 / Math.max(size.x, size.y);
  geo.translate(-(bb.min.x + size.x / 2), -(bb.min.y + size.y / 2), -(bb.min.z + size.z / 2));
  geo.scale(s, -s, s);
  geo.computeVertexNormals();
  cache.set(kind, geo);
  return geo;
}
