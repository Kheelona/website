// cutout — offline background removal via Apple Vision subject lift.
// Usage: cutout <input> <output.png> [--pad N] [--no-crop]
// New alpha = Vision foreground mask ∩ existing alpha; output is tight-cropped.
import Foundation
import CoreGraphics
import CoreImage
import ImageIO
import Vision
import UniformTypeIdentifiers

func fail(_ msg: String) -> Never {
    FileHandle.standardError.write(("cutout: " + msg + "\n").data(using: .utf8)!)
    exit(1)
}

var args = Array(CommandLine.arguments.dropFirst())
var pad = 8
var crop = true
if let i = args.firstIndex(of: "--pad"), i + 1 < args.count {
    pad = Int(args[i + 1]) ?? 8
    args.removeSubrange(i...(i + 1))
}
if let i = args.firstIndex(of: "--no-crop") {
    crop = false
    args.remove(at: i)
}
guard args.count == 2 else { fail("usage: cutout <input> <output.png> [--pad N] [--no-crop]") }
let inputURL = URL(fileURLWithPath: args[0])
let outputURL = URL(fileURLWithPath: args[1])

guard let src = CGImageSourceCreateWithURL(inputURL as CFURL, nil),
      let cg = CGImageSourceCreateImageAtIndex(src, 0, [kCGImageSourceShouldCache: true] as CFDictionary)
else { fail("cannot read \(inputURL.path)") }

let handler = VNImageRequestHandler(cgImage: cg, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()
do { try handler.perform([request]) } catch { fail("vision failed: \(error)") }
guard let obs = request.results?.first else { fail("no foreground instances found") }

let maskBuffer: CVPixelBuffer
do {
    maskBuffer = try obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: handler)
} catch { fail("mask generation failed: \(error)") }

let ciMask = CIImage(cvPixelBuffer: maskBuffer)
let ciInput = CIImage(cgImage: cg)
// Scale mask to input extent in case of rounding differences.
let sx = ciInput.extent.width / ciMask.extent.width
let sy = ciInput.extent.height / ciMask.extent.height
let scaledMask = ciMask.transformed(by: CGAffineTransform(scaleX: sx, y: sy))

guard let blend = CIFilter(name: "CIBlendWithMask") else { fail("no CIBlendWithMask") }
blend.setValue(ciInput, forKey: kCIInputImageKey)
blend.setValue(CIImage(color: .clear).cropped(to: ciInput.extent), forKey: kCIInputBackgroundImageKey)
blend.setValue(scaledMask, forKey: kCIInputMaskImageKey)
guard let outCI = blend.outputImage else { fail("blend failed") }

let ctx = CIContext(options: [.workingColorSpace: CGColorSpace(name: CGColorSpace.sRGB)!])
guard let rendered = ctx.createCGImage(outCI, from: ciInput.extent,
                                       format: .RGBA8,
                                       colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
else { fail("render failed") }

// Redraw into a mutable buffer for the cleanup + crop passes.
let w = rendered.width, h = rendered.height
let bpr = w * 4
var pixels = [UInt8](repeating: 0, count: bpr * h)
guard let mctx = CGContext(data: &pixels, width: w, height: h, bitsPerComponent: 8,
                           bytesPerRow: bpr, space: CGColorSpace(name: CGColorSpace.sRGB)!,
                           bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)
else { fail("buffer context failed") }
mctx.draw(rendered, in: CGRect(x: 0, y: 0, width: w, height: h))

// Cleanup: soft shadows and halo fringes survive the Vision mask as
// semi-transparent NEUTRAL light pixels. Erase neutral-light pixels below
// full opacity; opaque whites (logos, laces, teeth) and warm cream fur
// (chromatic) are untouched.
for i in stride(from: 0, to: pixels.count, by: 4) {
    let a = pixels[i + 3]
    if a < 8 || a >= 240 { continue }
    // un-premultiply to judge the true color
    let r = Int(pixels[i]) * 255 / Int(a), g = Int(pixels[i + 1]) * 255 / Int(a), b = Int(pixels[i + 2]) * 255 / Int(a)
    let mx = max(r, g, b), mn = min(r, g, b)
    if mn > 170 && mx - mn < 24 {
        pixels[i] = 0; pixels[i + 1] = 0; pixels[i + 2] = 0; pixels[i + 3] = 0
    }
}

var outCG: CGImage
guard let cleaned = mctx.makeImage() else { fail("cleaned image failed") }
outCG = cleaned

if crop {
    var minX = w, minY = h, maxX = -1, maxY = -1
    for y in 0..<h {
        let row = y * bpr
        for x in 0..<w where pixels[row + x * 4 + 3] > 8 {
            if x < minX { minX = x }
            if x > maxX { maxX = x }
            if y < minY { minY = y }
            if y > maxY { maxY = y }
        }
    }
    guard maxX >= minX, maxY >= minY else { fail("mask is empty") }
    let rect = CGRect(x: max(0, minX - pad), y: max(0, minY - pad),
                      width: min(w, maxX + pad + 1) - max(0, minX - pad),
                      height: min(h, maxY + pad + 1) - max(0, minY - pad))
    guard let cropped = outCG.cropping(to: rect) else { fail("crop failed") }
    outCG = cropped
}

guard let dest = CGImageDestinationCreateWithURL(outputURL as CFURL, UTType.png.identifier as CFString, 1, nil)
else { fail("cannot write \(outputURL.path)") }
CGImageDestinationAddImage(dest, outCG, nil)
guard CGImageDestinationFinalize(dest) else { fail("png write failed") }
print("\(outputURL.lastPathComponent): \(outCG.width)x\(outCG.height)")
