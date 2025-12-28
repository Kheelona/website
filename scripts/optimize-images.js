#!/usr/bin/env node

/**
 * Image Optimization Script
 *
 * Optimizes lifestyle images for web performance:
 * - Resizes to max 1920px width
 * - Converts to WebP format at 80% quality
 * - Also creates optimized JPG fallback
 * - Backs up originals to /originals subfolder
 *
 * Usage: node scripts/optimize-images.js
 */

const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

const LIFESTYLE_DIR = path.join(__dirname, "../public/images/lifestyle");
const ORIGINALS_DIR = path.join(LIFESTYLE_DIR, "originals");

const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;
const JPG_QUALITY = 85;

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

async function getImageFiles(dir) {
  const files = await fs.readdir(dir);
  return files.filter(
    (file) =>
      !file.startsWith(".") &&
      (file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png"))
  );
}

async function optimizeImage(filename) {
  const inputPath = path.join(LIFESTYLE_DIR, filename);
  const baseName = path.basename(filename, path.extname(filename));

  // Check if already processed (if webp version exists and original is in originals folder)
  const originalBackupPath = path.join(ORIGINALS_DIR, filename);
  try {
    await fs.access(originalBackupPath);
    console.log(`Skipping ${filename} - already processed`);
    return { skipped: true };
  } catch {
    // Not yet processed, continue
  }

  console.log(`\nProcessing: ${filename}`);

  // Get original file size
  const originalStats = await fs.stat(inputPath);
  const originalSizeMB = (originalStats.size / (1024 * 1024)).toFixed(2);

  // Read the image
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  console.log(`  Original: ${metadata.width}x${metadata.height}, ${originalSizeMB}MB`);

  // Back up original
  await fs.copyFile(inputPath, originalBackupPath);
  console.log(`  Backed up original to: originals/${filename}`);

  // Resize and optimize
  const resizedImage = image.resize({
    width: MAX_WIDTH,
    height: undefined, // Maintain aspect ratio
    fit: "inside",
    withoutEnlargement: true,
  });

  // Save as WebP
  const webpPath = path.join(LIFESTYLE_DIR, `${baseName}.webp`);
  await resizedImage.clone().webp({ quality: WEBP_QUALITY }).toFile(webpPath);

  const webpStats = await fs.stat(webpPath);
  const webpSizeKB = (webpStats.size / 1024).toFixed(0);
  console.log(`  Created WebP: ${webpSizeKB}KB`);

  // Save optimized JPG (replacing original)
  const jpgPath = inputPath;
  await resizedImage.jpeg({ quality: JPG_QUALITY, mozjpeg: true }).toFile(jpgPath + ".tmp");

  // Replace original with optimized version
  await fs.rename(jpgPath + ".tmp", jpgPath);

  const jpgStats = await fs.stat(jpgPath);
  const jpgSizeKB = (jpgStats.size / 1024).toFixed(0);
  console.log(`  Optimized JPG: ${jpgSizeKB}KB`);

  // Calculate savings
  const totalSavedMB = (
    originalStats.size / (1024 * 1024) -
    webpStats.size / (1024 * 1024)
  ).toFixed(2);
  const savingsPercent = (
    ((originalStats.size - webpStats.size) / originalStats.size) *
    100
  ).toFixed(1);
  console.log(`  Savings: ${totalSavedMB}MB (${savingsPercent}% reduction)`);

  return {
    filename,
    originalSize: originalStats.size,
    webpSize: webpStats.size,
    jpgSize: jpgStats.size,
  };
}

async function main() {
  console.log("=".repeat(60));
  console.log("Image Optimization Script");
  console.log("=".repeat(60));
  console.log(`\nSource directory: ${LIFESTYLE_DIR}`);
  console.log(`Max width: ${MAX_WIDTH}px`);
  console.log(`WebP quality: ${WEBP_QUALITY}%`);
  console.log(`JPG quality: ${JPG_QUALITY}%`);

  // Ensure originals directory exists
  await ensureDir(ORIGINALS_DIR);

  // Get all image files
  const imageFiles = await getImageFiles(LIFESTYLE_DIR);
  console.log(`\nFound ${imageFiles.length} images to process`);

  let totalOriginal = 0;
  let totalOptimized = 0;
  let processed = 0;

  for (const file of imageFiles) {
    try {
      const result = await optimizeImage(file);
      if (!result.skipped) {
        totalOriginal += result.originalSize;
        totalOptimized += result.webpSize;
        processed++;
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));
  console.log(`Images processed: ${processed}`);

  if (processed > 0) {
    const totalOriginalMB = (totalOriginal / (1024 * 1024)).toFixed(2);
    const totalOptimizedMB = (totalOptimized / (1024 * 1024)).toFixed(2);
    const totalSavedMB = ((totalOriginal - totalOptimized) / (1024 * 1024)).toFixed(2);
    const savingsPercent = (((totalOriginal - totalOptimized) / totalOriginal) * 100).toFixed(1);

    console.log(`Total original size: ${totalOriginalMB}MB`);
    console.log(`Total optimized size: ${totalOptimizedMB}MB`);
    console.log(`Total saved: ${totalSavedMB}MB (${savingsPercent}% reduction)`);
  }

  console.log("\nOriginal files backed up to: originals/");
  console.log("WebP versions created alongside JPG files");
  console.log("\nDone!");
}

main().catch(console.error);
