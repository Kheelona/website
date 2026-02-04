/**
 * Generate OG image (1200x630) from lifestyle image
 * Run with: node scripts/generate-og-image.js
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_IMAGE = path.join(__dirname, "../public/images/lifestyle/all-colors-group-1.jpg");
const OUTPUT_IMAGE = path.join(__dirname, "../public/images/og-image.jpg");

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

async function generateOGImage() {
  console.log("Generating OG image from:", SOURCE_IMAGE);

  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error("Source image not found:", SOURCE_IMAGE);
    process.exit(1);
  }

  // Get source image metadata
  const metadata = await sharp(SOURCE_IMAGE).metadata();
  console.log(`Source image: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

  // Resize and crop to OG dimensions (1200x630)
  await sharp(SOURCE_IMAGE)
    .resize(OG_WIDTH, OG_HEIGHT, {
      fit: "cover",
      position: "center",
    })
    .jpeg({ quality: 85 })
    .toFile(OUTPUT_IMAGE);

  console.log(`Generated OG image: ${OUTPUT_IMAGE}`);
  console.log(`Dimensions: ${OG_WIDTH}x${OG_HEIGHT}`);

  // Get output file size
  const stats = fs.statSync(OUTPUT_IMAGE);
  console.log(`File size: ${(stats.size / 1024).toFixed(2)} KB`);
}

generateOGImage().catch(console.error);
