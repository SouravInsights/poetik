import fs from "node:fs";
import { join } from "node:path";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

// Public CDN base URL for the Cloudflare R2 bucket.
// Set NEXT_PUBLIC_R2_URL in .env.local (and in production env vars).
const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_URL ?? "";

function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

async function listR2Videos(): Promise<{ name: string; path: string; category: string }[]> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME ?? "ambient-assets";

  // If no R2 credentials, fall back to local public/bg-videos/ directory
  if (!client) {
    const localDir = join(process.cwd(), "public", "bg-videos");
    if (!fs.existsSync(localDir)) return [];
    return fs.readdirSync(localDir)
      .filter(f => /\.(mp4|mov|webm)$/i.test(f))
      .map(name => ({ name, path: `/bg-videos/${name}`, category: "bg-videos" }));
  }

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: "bg-videos/",
  });

  const response = await client.send(command);
  const objects = response.Contents ?? [];

  return objects
    .map(obj => obj.Key!)
    .filter(key => /\.(mp4|mov|webm)$/i.test(key))
    .map(key => {
      const name = key.split("/").pop()!;
      return {
        name,
        path: R2_BASE_URL ? `${R2_BASE_URL}/${key}` : `/bg-videos/${name}`,
        category: "bg-videos",
      };
    })
    .sort((a, b) => {
      // Sort numerically by filename (1.mp4, 2.mp4 … 10.mp4, not lexicographic)
      const numA = parseInt(a.name, 10);
      const numB = parseInt(b.name, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.name.localeCompare(b.name);
    });
}

export async function GET() {
  const papersDir = join(process.cwd(), "public", "papers");
  const modernDir = join(process.cwd(), "public", "modern-backgrounds");
  const doodlesDir = join(process.cwd(), "public", "doodles");

  try {
    const listDir = (dir: string, prefix: string, extensions = /\.(jpg|jpeg|png|webp|svg)$/i) => {
      if (!fs.existsSync(dir)) return [];
      return fs.readdirSync(dir)
        .filter(f => f.match(extensions))
        .map(name => ({
          name,
          path: `/${prefix}/${name}`,
          category: prefix,
        }));
    };

    const papers = listDir(papersDir, "papers");
    const modern = listDir(modernDir, "modern-backgrounds");
    const videos = await listR2Videos();
    const doodles = listDir(doodlesDir, "doodles").map(d => d.name);

    return Response.json({
      papers: [...papers, ...modern],
      videos,
      doodles,
    }, {
      headers: {
        // Cache for 5 min in browser, 10 min at CDN — videos/doodles rarely change
        "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    return Response.json({ papers: [], videos: [], doodles: [] });
  }
}

