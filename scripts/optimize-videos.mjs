/**
 * Video optimization pipeline for the cinematic backgrounds.
 *
 * The R2 bucket is the source of truth (the site streams from R2 at runtime;
 * public/bg-videos/ is only a no-credentials dev fallback). For every video
 * in the bucket under `bg-videos/`:
 *
 *   1. Downloads the original into  video-pipeline/originals/  (skipped if
 *      already cached — the folder doubles as your local masters archive,
 *      and anything already in public/bg-videos/ is copied in first)
 *   2. Transcodes to a web-optimized MP4 in  video-pipeline/optimized/:
 *      - audio stripped (backgrounds are muted)
 *      - H.264 CRF 26, preset slow  (~5-10x smaller, visually identical for ambient loops)
 *      - capped at 1600px wide      (full-screen bg doesn't need 4K masters)
 *      - faststart moov atom        (playback starts before full download)
 *   3. Extracts a tiny WebP poster frame (`<name>-poster.webp`)
 *   4. With `--upload`: pushes video + poster back to R2 (same keys → the big
 *      originals are overwritten in place) with immutable 1-year cache headers.
 *      Uploads are tracked in video-pipeline/uploaded.json, so re-runs only
 *      upload what changed.
 *
 * Everything is resumable: Ctrl+C at any point and re-run the same command —
 * completed downloads/transcodes/uploads are skipped.
 *
 * Usage:
 *   brew install ffmpeg                        # one-time
 *   node scripts/optimize-videos.mjs           # download originals + transcode locally
 *   node scripts/optimize-videos.mjs --upload  # the same, then push results to R2
 *
 * NOTE: --upload needs an R2 API token with **Object Read & Write** on the
 * bucket (R2 dashboard → Manage R2 API Tokens). A read-only token gets you
 * AccessDenied on every upload — downloads/transcodes are still cached, so
 * just swap the token and re-run the same command to do the uploads.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { join, parse } from "node:path";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const run = promisify(execFile);

const WORK_DIR = join(process.cwd(), "video-pipeline");
const ORIG_DIR = join(WORK_DIR, "originals");
const OUT_DIR = join(WORK_DIR, "optimized");
const UPLOAD_MANIFEST = join(WORK_DIR, "uploaded.json");
const PUBLIC_FALLBACK_DIR = join(process.cwd(), "public", "bg-videos");
const R2_PREFIX = "bg-videos";
const SHOULD_UPLOAD = process.argv.includes("--upload");

// ── .env.local (Next only auto-loads this inside the app, not scripts) ──────
if (fs.existsSync(".env.local")) {
  for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

async function checkFfmpeg() {
  try {
    await run("ffmpeg", ["-version"]);
  } catch {
    console.error("❌ ffmpeg not found. Install it first:  brew install ffmpeg");
    process.exit(1);
  }
}

function getR2Client() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.error("❌ Missing R2 credentials in .env.local");
    process.exit(1);
  }
  return {
    client: new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    }),
    bucket: process.env.R2_BUCKET_NAME ?? "ambient-assets",
  };
}

// Seed the originals cache with whatever already lives in public/bg-videos/
// so those files don't need to be re-downloaded from R2.
function seedOriginalsFromPublic() {
  if (!fs.existsSync(PUBLIC_FALLBACK_DIR)) return;
  const localVideos = fs.readdirSync(PUBLIC_FALLBACK_DIR).filter(f => /\.mp4$/i.test(f));
  for (const f of localVideos) {
    const dest = join(ORIG_DIR, f);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(join(PUBLIC_FALLBACK_DIR, f), dest);
      console.log(`📥 seeded ${f} from public/bg-videos/`);
    }
  }
}

async function download(client, bucket, key, dest) {
  const tmp = `${dest}.tmp`;
  const res = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  await pipeline(res.Body, fs.createWriteStream(tmp));
  fs.renameSync(tmp, dest);
}

async function transcode(input, output) {
  const tmp = `${output}.tmp.mp4`;
  await run("ffmpeg", [
    "-y",
    "-i", input,
    "-an",                                            // strip audio — videos play muted
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "26",
    "-vf", "scale='min(1600,iw)':-2",                 // cap width, keep aspect (even height)
    "-pix_fmt", "yuv420p",                            // Safari compatibility
    "-movflags", "+faststart",                        // moov atom first → instant start
    tmp,
  ]);
  fs.renameSync(tmp, output);
}

async function makePoster(input, output) {
  // Some ffmpeg builds (e.g. current Homebrew) ship without a WebP encoder,
  // so extract a lossless PNG frame with ffmpeg and convert with sharp
  // (already a devDependency — used by scripts/optimize-assets.mjs).
  const tmpPng = `${output}.tmp.png`;
  await run("ffmpeg", [
    "-y",
    "-ss", "0.1",
    "-i", input,
    "-frames:v", "1",
    "-vf", "scale=480:-2",
    tmpPng,
  ]);
  const sharp = (await import("sharp")).default;
  await sharp(tmpPng).webp({ quality: 80 }).toFile(output);
  await fs.promises.unlink(tmpPng);
}

async function uploadFile(client, bucket, filePath, key, contentType) {
  const body = fs.createReadStream(filePath);
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    // Immutable content — let Cloudflare's CDN and browsers cache forever.
    CacheControl: "public, max-age=31536000, immutable",
  }));
}

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(UPLOAD_MANIFEST, "utf8"));
  } catch {
    return {};
  }
}

function saveManifest(manifest) {
  fs.writeFileSync(UPLOAD_MANIFEST, JSON.stringify(manifest, null, 2));
}

const mb = bytes => (bytes / 1e6).toFixed(1);

async function main() {
  await checkFfmpeg();
  fs.mkdirSync(ORIG_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const { client, bucket } = getR2Client();
  seedOriginalsFromPublic();

  const res = await client.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: `${R2_PREFIX}/` }));
  const keys = (res.Contents ?? [])
    .map(o => o.Key)
    .filter(k => /\.(mp4|mov|webm)$/i.test(k));

  // Numeric sort for readable logs (1, 2, … 10, not lexicographic)
  keys.sort((a, b) => {
    const na = parseInt(a.split("/").pop(), 10);
    const nb = parseInt(b.split("/").pop(), 10);
    return (!isNaN(na) && !isNaN(nb)) ? na - nb : a.localeCompare(b);
  });

  console.log(`\n🎬 ${keys.length} videos in r2://${bucket}/${R2_PREFIX}/\n`);

  const manifest = loadManifest();
  const failures = [];
  let totalBefore = 0, totalAfter = 0, uploadedCount = 0;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const file = key.split("/").pop();
    const base = parse(file).name;
    const tag = `[${i + 1}/${keys.length}] ${file}`;

    const origPath = join(ORIG_DIR, file);
    const outVideo = join(OUT_DIR, `${base}.mp4`);
    const outPoster = join(OUT_DIR, `${base}-poster.webp`);

    try {
      // 1 — original
      if (!fs.existsSync(origPath)) {
        process.stdout.write(`${tag} downloading… `);
        await download(client, bucket, key, origPath);
        process.stdout.write(`${mb(fs.statSync(origPath).size)}MB\n`);
      }

      // 2 — transcode
      if (!fs.existsSync(outVideo)) {
        process.stdout.write(`${tag} transcoding… `);
        await transcode(origPath, outVideo);
        const before = fs.statSync(origPath).size;
        const after = fs.statSync(outVideo).size;
        process.stdout.write(
          `${mb(after)}MB (was ${mb(before)}MB, −${(((before - after) / before) * 100).toFixed(0)}%)\n`
        );
      }

      // 3 — poster
      if (!fs.existsSync(outPoster)) {
        await makePoster(origPath, outPoster);
      }

      totalBefore += fs.statSync(origPath).size;
      totalAfter += fs.statSync(outVideo).size;

      // 4 — upload (only if outputs changed since the last recorded upload)
      if (SHOULD_UPLOAD) {
        const signature = `${fs.statSync(outVideo).size}:${fs.statSync(outPoster).size}`;
        if (manifest[base] !== signature) {
          await uploadFile(client, bucket, outVideo, `${R2_PREFIX}/${base}.mp4`, "video/mp4");
          await uploadFile(client, bucket, outPoster, `${R2_PREFIX}/${base}-poster.webp`, "image/webp");
          manifest[base] = signature;
          saveManifest(manifest);
          uploadedCount++;
          console.log(`${tag} ☁️  uploaded`);
        }
      }
    } catch (err) {
      failures.push(file);
      console.error(`❌ ${tag} failed: ${err.message}`);
    }
  }

  console.log("\n────────────────────────────────────");
  console.log(`✅ processed ${keys.length - failures.length}/${keys.length} videos`);
  console.log(`📦 total: ${mb(totalBefore)}MB originals → ${mb(totalAfter)}MB optimized ` +
    `(−${totalBefore ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0) : 0}%)`);
  if (SHOULD_UPLOAD) {
    console.log(`☁️  uploaded ${uploadedCount} video+poster pairs (rest were already up to date)`);
  } else {
    console.log(`ℹ️  local only — re-run with --upload to push to R2`);
  }
  if (failures.length) {
    console.log(`⚠️  failed: ${failures.join(", ")} — re-run to retry`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
