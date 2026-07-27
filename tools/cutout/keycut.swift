// keycut: background removal by region-growing flood fill from the borders.
// Preserves thin colored details (ribbons) that segmentation masks drop.
// Usage: keycut <input> <output.png> [pad]
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let args = Array(CommandLine.arguments.dropFirst())
guard args.count >= 2 else { fputs("usage: keycut <in> <out.png> [pad]\n", stderr); exit(1) }
let pad = args.count > 2 ? Int(args[2]) ?? 24 : 24
let visionPath: String? = args.count > 3 ? args[3] : nil

guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: args[0]) as CFURL, nil),
      let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else { fputs("read fail\n", stderr); exit(1) }
let w = img.width, h = img.height
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
var buf = [UInt8](repeating: 0, count: w * h * 4)
let ctx = CGContext(data: &buf, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                    space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))

@inline(__always) func px(_ x: Int, _ y: Int) -> (Int, Int, Int) {
    let i = (y * w + x) * 4
    return (Int(buf[i]), Int(buf[i+1]), Int(buf[i+2]))
}
@inline(__always) func close(_ a: (Int, Int, Int), _ b: (Int, Int, Int), _ tol: Int) -> Bool {
    return abs(a.0 - b.0) <= tol && abs(a.1 - b.1) <= tol && abs(a.2 - b.2) <= tol
}

var isBg = [Bool](repeating: false, count: w * h)
var queue = [Int]()
// seed: border pixels that are bright and low-chroma
for x in 0..<w { for y in [0, h-1] {
    let p = px(x, y); let mx = max(p.0, p.1, p.2), mn = min(p.0, p.1, p.2)
    if mx > 210 && mx - mn < 26 { let i = y * w + x; if !isBg[i] { isBg[i] = true; queue.append(i) } }
}}
for y in 0..<h { for x in [0, w-1] {
    let p = px(x, y); let mx = max(p.0, p.1, p.2), mn = min(p.0, p.1, p.2)
    if mx > 210 && mx - mn < 26 { let i = y * w + x; if !isBg[i] { isBg[i] = true; queue.append(i) } }
}}
// region growing: neighbor joins bg if close to current bg pixel (follows gradients)
var head = 0
while head < queue.count {
    let i = queue[head]; head += 1
    let x = i % w, y = i / w
    let c = px(x, y)
    for (dx, dy) in [(1,0), (-1,0), (0,1), (0,-1)] {
        let nx = x + dx, ny = y + dy
        guard nx >= 0, nx < w, ny >= 0, ny < h else { continue }
        let ni = ny * w + nx
        if isBg[ni] { continue }
        let np = px(nx, ny)
        let mx = max(np.0, np.1, np.2), mn = min(np.0, np.1, np.2)
        // stay within bright low-chroma territory and change slowly
        if mx > 175 && mx - mn < 30 && close(np, c, 9) { isBg[ni] = true; queue.append(ni) }
    }
}
// optional: below splitY, defer to the Vision cutout's alpha (better body edges)
var visionAlpha: [UInt8]? = nil
if let vp = visionPath,
   let vsrc = CGImageSourceCreateWithURL(URL(fileURLWithPath: vp) as CFURL, nil),
   let vimg = CGImageSourceCreateImageAtIndex(vsrc, 0, nil), vimg.width == w, vimg.height == h {
    var vbuf = [UInt8](repeating: 0, count: w * h * 4)
    let vctx = CGContext(data: &vbuf, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                         space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    vctx.draw(vimg, in: CGRect(x: 0, y: 0, width: w, height: h))
    visionAlpha = (0..<(w*h)).map { vbuf[$0 * 4 + 3] }
}
// union mode: a pixel is background only if BOTH the flood fill and Vision agree
// apply alpha + tight bbox
var minX = w, minY = h, maxX = -1, maxY = -1
for y in 0..<h { for x in 0..<w {
    let i = y * w + x
    var bg = isBg[i]
    if let va = visionAlpha { bg = isBg[i] && va[i] < 16 }
    if bg { let j = i * 4; buf[j] = 0; buf[j+1] = 0; buf[j+2] = 0; buf[j+3] = 0 }
    else if buf[i*4+3] > 0 { minX = min(minX, x); minY = min(minY, y); maxX = max(maxX, x); maxY = max(maxY, y) }
}}
guard maxX >= minX else { fputs("empty\n", stderr); exit(1) }
let rect = CGRect(x: max(0, minX - pad), y: max(0, minY - pad),
                  width: min(w, maxX + pad + 1) - max(0, minX - pad),
                  height: min(h, maxY + pad + 1) - max(0, minY - pad))
let out = ctx.makeImage()!.cropping(to: rect)!
let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: args[1]) as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, out, nil)
CGImageDestinationFinalize(dest)
print("\(args[1]): \(out.width)x\(out.height)")
