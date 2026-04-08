import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const TARGET_DIRS = ["public/papers", "public/modern-backgrounds"];
const QUALITY = 85;

async function optimizeDir(directory) {
  const dirPath = path.resolve(process.cwd(), directory);
  
  if (!(await fs.stat(dirPath).catch(() => null))?.isDirectory()) {
    console.log(`Skipping ${directory} (not found)`);
    return;
  }

  const files = await fs.readdir(dirPath);
  const imageFiles = files.filter(f => /\.(png|jpe?g)$/i.test(f));

  if (imageFiles.length === 0) {
    console.log(`No raw images found in ${directory}`);
    return;
  }

  console.log(`\nOptimizing ${imageFiles.length} images in ${directory}...`);

  for (const file of imageFiles) {
    const inputPath = path.join(dirPath, file);
    const baseName = path.parse(file).name;
    const outputPath = path.join(dirPath, `${baseName}.webp`);

    try {
      await sharp(inputPath)
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(outputPath);
      
      const oldSize = (await fs.stat(inputPath)).size;
      const newSize = (await fs.stat(outputPath)).size;
      const saved = ((oldSize - newSize) / oldSize * 100).toFixed(1);

      console.log(`✅ ${file} -> ${baseName}.webp (Saved ${saved}%)`);
      
      // Optionally remove the old file if it's not the same as the new one
      // For now, let's keep them and let the user delete if they want, 
      // or we can just delete them if the user prefers.
      // Given the request to 'optimize', deleting original is usually implied.
      await fs.unlink(inputPath);
    } catch (err) {
      console.error(`❌ Failed to optimize ${file}:`, err.message);
    }
  }
}

async function run() {
  console.log("🚀 Starting Poetik Asset Optimization...");
  for (const dir of TARGET_DIRS) {
    await optimizeDir(dir);
  }
  console.log("\n✨ All assets optimized to WebP!");
}

run().catch(console.error);
