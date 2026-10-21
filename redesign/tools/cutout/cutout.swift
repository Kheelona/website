// Cut a person out of a photo (transparent background) with Apple's Vision framework, on this Mac, offline.
// Build: swiftc -O tools/cutout/cutout.swift -o /tmp/cutout   Use: /tmp/cutout in.jpg out.png
import Foundation
import Vision
import CoreImage
import CoreImage.CIFilterBuiltins
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count == 3 else { FileHandle.standardError.write("usage: cutout in.jpg out.png\n".data(using: .utf8)!); exit(2) }
let inURL = URL(fileURLWithPath: args[1]), outURL = URL(fileURLWithPath: args[2])
guard let src = CGImageSourceCreateWithURL(inURL as CFURL, nil), let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else { exit(3) }

let handler = VNImageRequestHandler(cgImage: cg, options: [:])
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
guard let obs = req.results?.first else { FileHandle.standardError.write("no foreground found\n".data(using: .utf8)!); exit(4) }
// The masked image at full resolution, background transparent.
let buffer = try obs.generateMaskedImage(ofInstances: obs.allInstances, from: handler, croppedToInstancesExtent: false)
let ci = CIImage(cvPixelBuffer: buffer)
let ctx = CIContext()
guard let out = ctx.createCGImage(ci, from: ci.extent) else { exit(5) }
guard let dest = CGImageDestinationCreateWithURL(outURL as CFURL, UTType.png.identifier as CFString, 1, nil) else { exit(6) }
CGImageDestinationAddImage(dest, out, nil)
CGImageDestinationFinalize(dest)
print("ok \(out.width)x\(out.height)")
