#!/usr/bin/env node

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, parse } from 'path';

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

const dir = process.argv[2] || './adultna/public';

console.log(`${colors.green}Converting images in: ${dir}${colors.reset}`);
console.log('-----------------------------------');

let total = 0;
let convertedWebp = 0;
let convertedAvif = 0;
let skipped = 0;

function getImageType(filename) {
  if (/feature|preview|icon|logo|button/i.test(filename)) return 'ui';
  if (/auth|screenshot|onboarding|form/i.test(filename)) return 'text';
  return 'photo';
}

function getQuality(imageType) {
  switch (imageType) {
    case 'ui':
      return { webp: 90, avif: 70 };
    case 'text':
      return { webp: 92, avif: 72 };
    default:
      return { webp: 85, avif: 60 };
  }
}

async function getFileSize(filepath) {
  const stats = await stat(filepath);
  return stats.size;
}

async function convertImage(filepath) {
  const { dir: dirname, name, ext } = parse(filepath);
  const imageType = getImageType(name);
  const quality = getQuality(imageType);

  total++;

  console.log(`${colors.yellow}→${colors.reset} Processing ${name}${ext} (${imageType})...`);

  // Resize oversized images first
  const maxDimension = 2048;
  try {
    const metadata = await sharp(filepath).metadata();
    if (metadata.width > maxDimension || metadata.height > maxDimension) {
      console.log(`  ${colors.yellow}↓${colors.reset} Resizing source (${metadata.width}x${metadata.height} → max ${maxDimension}px)`);
      await sharp(filepath)
        .resize(maxDimension, maxDimension, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toFile(filepath + '.tmp');

      // Replace original with resized version
      const { unlink, rename } = await import('fs/promises');
      await unlink(filepath);
      await rename(filepath + '.tmp', filepath);
    }
  } catch (error) {
    console.log(`  ${colors.red}✗${colors.reset} Failed to check/resize source: ${error.message}`);
  }

  // Responsive sizes to generate
  const sizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

  // Generate responsive WebP sizes
  console.log(`  ${colors.yellow}→${colors.reset} Generating WebP responsive sizes...`);
  for (const size of sizes) {
    const webpPath = join(dirname, `${name}-${size}w.webp`);
    try {
      await stat(webpPath);
    } catch {
      try {
        await sharp(filepath)
          .resize(size, null, { withoutEnlargement: true })
          .webp({ quality: quality.webp, effort: 6 })
          .toFile(webpPath);
        convertedWebp++;
      } catch (error) {
        console.log(`    ${colors.red}✗${colors.reset} ${size}w failed: ${error.message}`);
      }
    }
  }

  // Generate full-size WebP
  const webpPath = join(dirname, `${name}.webp`);
  try {
    await stat(webpPath);
    skipped++;
  } catch {
    try {
      await sharp(filepath)
        .webp({ quality: quality.webp, effort: 6 })
        .toFile(webpPath);

      const originalSize = await getFileSize(filepath);
      const webpSize = await getFileSize(webpPath);
      const reduction = Math.round(100 - (webpSize * 100 / originalSize));

      console.log(`  ${colors.green}✓${colors.reset} WebP created (${reduction}% smaller)`);
      convertedWebp++;
    } catch (error) {
      console.log(`  ${colors.red}✗${colors.reset} Failed to create WebP: ${error.message}`);
    }
  }

  // Generate responsive AVIF sizes
  console.log(`  ${colors.yellow}→${colors.reset} Generating AVIF responsive sizes...`);
  for (const size of sizes) {
    const avifPath = join(dirname, `${name}-${size}w.avif`);
    try {
      await stat(avifPath);
    } catch {
      try {
        await sharp(filepath)
          .resize(size, null, { withoutEnlargement: true })
          .avif({ quality: quality.avif, effort: 6 })
          .toFile(avifPath);
        convertedAvif++;
      } catch (error) {
        console.log(`    ${colors.red}✗${colors.reset} ${size}w failed: ${error.message}`);
      }
    }
  }

  // Generate full-size AVIF
  const avifPath = join(dirname, `${name}.avif`);
  try {
    await stat(avifPath);
    skipped++;
  } catch {
    try {
      await sharp(filepath)
        .avif({ quality: quality.avif, effort: 6 })
        .toFile(avifPath);

      const originalSize = await getFileSize(filepath);
      const avifSize = await getFileSize(avifPath);
      const reduction = Math.round(100 - (avifSize * 100 / originalSize));

      console.log(`  ${colors.green}✓${colors.reset} AVIF created (${reduction}% smaller)`);
      convertedAvif++;
    } catch (error) {
      console.log(`  ${colors.red}✗${colors.reset} Failed to create AVIF: ${error.message}`);
    }
  }

  console.log('');
}

async function processDirectory(dirPath) {
  const files = await readdir(dirPath);

  for (const file of files) {
    const filepath = join(dirPath, file);
    const stats = await stat(filepath);

    if (stats.isFile()) {
      const ext = parse(file).ext.toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        await convertImage(filepath);
      }
    }
  }
}

try {
  await processDirectory(dir);

  console.log('-----------------------------------');
  console.log(`${colors.green}Conversion Complete!${colors.reset}`);
  console.log(`Total images found: ${total}`);
  console.log(`WebP created: ${convertedWebp}`);
  console.log(`AVIF created: ${convertedAvif}`);
  console.log(`Already existed (skipped): ${skipped}`);
  console.log('');
  console.log(`${colors.yellow}Next steps:${colors.reset}`);
  console.log('1. Review converted images in the directory');
  console.log('2. Run \'pnpm build\' to include them in the build');
  console.log('3. Deploy using GitHub Actions workflow');
} catch (error) {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
}
