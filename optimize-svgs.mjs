import { optimize } from 'svgo';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const publicDir = process.argv[2] || './public';

const svgoConfig = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          cleanupIds: true,
          removeUnknownsAndDefaults: {
            keepRoleAttr: true,
          },
          removeUselessStrokeAndFill: true,
          cleanupNumericValues: {
            floatPrecision: 2,
          },
          convertPathData: {
            floatPrecision: 2,
          },
        },
      },
    },
    { name: 'removeDimensions' },
    { name: 'removeScriptElement' },
    { name: 'removeStyleElement' },
    { name: 'removeComments' },
    { name: 'removeMetadata' },
    { name: 'removeEditorsNSData' },
    { name: 'removeHiddenElems' },
    { name: 'removeEmptyText' },
    { name: 'removeEmptyContainers' },
    { name: 'removeUnusedNS' },
    { name: 'cleanupEnableBackground' },
    { name: 'minifyStyles' },
    { name: 'convertStyleToAttrs' },
    { name: 'convertColors', params: { shorthex: true } },
    { name: 'convertTransform' },
    { name: 'removeNonInheritableGroupAttrs' },
    { name: 'collapseGroups' },
    { name: 'mergePaths', params: { force: true } },
    { name: 'sortAttrs' },
    { name: 'sortDefsChildren' },
  ],
};

console.log(`🎨 Optimizing SVG files in ${publicDir}...`);

try {
  const files = readdirSync(publicDir).filter(f => f.endsWith('.svg'));

  if (files.length === 0) {
    console.log('ℹ️  No SVG files found to optimize');
    process.exit(0);
  }

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const file of files) {
    const filepath = join(publicDir, file);
    const data = readFileSync(filepath, 'utf8');
    const result = optimize(data, { path: filepath, ...svgoConfig });

    const originalSize = Buffer.byteLength(data);
    const optimizedSize = Buffer.byteLength(result.data);
    const saved = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

    totalOriginalSize += originalSize;
    totalOptimizedSize += optimizedSize;

    writeFileSync(filepath, result.data);
    console.log(`✓ ${file}: ${(originalSize / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB (${saved}% saved)`);
  }

  const totalSaved = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);
  console.log(`\n✅ Optimized ${files.length} SVG files`);
  console.log(`📊 Total: ${(totalOriginalSize / 1024).toFixed(1)}KB → ${(totalOptimizedSize / 1024).toFixed(1)}KB (${totalSaved}% saved)`);
} catch (error) {
  console.error('❌ Error optimizing SVGs:', error.message);
  process.exit(1);
}
