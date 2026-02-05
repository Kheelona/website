/**
 * Generate PWA icons and favicons from the logo
 * Run with: node scripts/generate-icons.js
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_IMAGE = path.join(__dirname, "../public/images/logo.png");
const ICONS_DIR = path.join(__dirname, "../public/icons");

// Icon sizes needed for PWA and favicons
const ICON_SIZES = [16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 384, 512];

// Create icons directory if it doesn't exist
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

async function generateIcons() {
  console.log("Generating icons from:", SOURCE_IMAGE);

  // Check if source exists
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error("Source image not found:", SOURCE_IMAGE);
    console.log("Please provide a logo at public/images/logo.png");
    process.exit(1);
  }

  // Get source image metadata
  const metadata = await sharp(SOURCE_IMAGE).metadata();
  console.log(`Source image: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

  // For the logo which is likely horizontal, we'll create a square version with padding
  const maxDimension = Math.max(metadata.width || 0, metadata.height || 0);

  for (const size of ICON_SIZES) {
    try {
      // Create a square icon with the logo centered
      await sharp(SOURCE_IMAGE)
        .resize(size, size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background
        })
        .png()
        .toFile(path.join(ICONS_DIR, `icon-${size}x${size}.png`));

      console.log(`Generated: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`Failed to generate ${size}x${size}:`, error.message);
    }
  }

  // Generate apple-touch-icon (180x180)
  await sharp(SOURCE_IMAGE)
    .resize(180, 180, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toFile(path.join(ICONS_DIR, "apple-touch-icon.png"));
  console.log("Generated: apple-touch-icon.png");

  // Generate maskable icons (with extra padding for safe zone)
  for (const size of [192, 512]) {
    const padding = Math.floor(size * 0.1); // 10% padding for safe zone
    await sharp(SOURCE_IMAGE)
      .resize(size - padding * 2, size - padding * 2, {
        fit: "contain",
        background: { r: 239, g: 118, b: 47, alpha: 1 }, // Tangerine background
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 239, g: 118, b: 47, alpha: 1 }, // Tangerine background
      })
      .png()
      .toFile(path.join(ICONS_DIR, `icon-maskable-${size}x${size}.png`));
    console.log(`Generated: icon-maskable-${size}x${size}.png`);
  }

  // Generate favicon.ico (multi-size)
  // Note: sharp doesn't support .ico directly, so we create a 32x32 PNG
  // For a proper .ico, you'd need a separate tool

  console.log("\nDone! Icons generated in:", ICONS_DIR);
  console.log(
    "\nNote: For a proper favicon.ico, use an online converter or tool like 'png-to-ico'"
  );
  console.log(
    "You can use https://favicon.io/favicon-converter/ to create favicon.ico from the generated PNGs"
  );
}

generateIcons().catch(console.error);
