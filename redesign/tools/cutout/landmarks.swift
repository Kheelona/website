// Face landmarks for the animated founder portraits (eyes, brows, nose, lips, face outline), with Apple Vision, offline.
// Build: swiftc -O tools/cutout/landmarks.swift -o /tmp/landmarks   Use: /tmp/landmarks a.png b.png … > landmarks.json
// Points are normalised to the image, origin TOP-left (x right, y down), so the page can use them as UVs directly.
import Foundation
import Vision
import ImageIO

func pts(_ r: VNFaceLandmarkRegion2D?, _ box: CGRect) -> [[Double]] {
  guard let r = r else { return [] }
  var res: [[Double]] = []
  for p in r.normalizedPoints {
    let x: Double = Double(box.origin.x) + Double(p.x) * Double(box.width)
    let y: Double = Double(box.origin.y) + Double(p.y) * Double(box.height)
    res.append([(x * 10000).rounded() / 10000, ((1 - y) * 10000).rounded() / 10000])
  }
  return res
}
var out: [String: Any] = [:]
for path in CommandLine.arguments.dropFirst() {
  let url = URL(fileURLWithPath: path)
  guard let src = CGImageSourceCreateWithURL(url as CFURL, nil), let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else { continue }
  let req = VNDetectFaceLandmarksRequest()
  try VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
  guard let f = req.results?.first, let l = f.landmarks else { continue }
  let b = f.boundingBox
  let r4: (Double) -> Double = { v in (v * 10000).rounded() / 10000 }
  var face: [String: Any] = [:]
  let box: [Double] = [r4(Double(b.minX)), r4(Double(1 - b.maxY)), r4(Double(b.width)), r4(Double(b.height))]
  face["box"] = box
  face["yaw"] = f.yaw?.doubleValue ?? 0.0
  face["roll"] = f.roll?.doubleValue ?? 0.0
  let regions: [(String, VNFaceLandmarkRegion2D?)] = [
    ("leftEye", l.leftEye), ("rightEye", l.rightEye), ("leftBrow", l.leftEyebrow), ("rightBrow", l.rightEyebrow),
    ("nose", l.nose), ("noseCrest", l.noseCrest), ("outerLips", l.outerLips), ("innerLips", l.innerLips),
    ("contour", l.faceContour), ("leftPupil", l.leftPupil), ("rightPupil", l.rightPupil),
  ]
  for (name, region) in regions { face[name] = pts(region, b) }
  out[url.deletingPathExtension().lastPathComponent] = face
}
let data = try JSONSerialization.data(withJSONObject: out, options: [.sortedKeys])
FileHandle.standardOutput.write(data)
