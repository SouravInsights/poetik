import fs from "node:fs";
import { join } from "node:path";

export async function GET() {
  const papersDir = join(process.cwd(), "public", "papers");
  const modernDir = join(process.cwd(), "public", "modern-backgrounds");
  const videosDir = join(process.cwd(), "public", "bg-videos");
  const doodlesDir = join(process.cwd(), "public", "doodles");

  try {
    const listDir = (dir: string, prefix: string, extensions = /\.(jpg|jpeg|png|webp|svg)$/i) => {
      if (!fs.existsSync(dir)) return [];
      return fs.readdirSync(dir)
        .filter(f => f.match(extensions))
        .map(name => ({
          name,
          path: `/${prefix}/${name}`,
          category: prefix
        }));
    };

    const papers = listDir(papersDir, "papers");
    const modern = listDir(modernDir, "modern-backgrounds");
    const videos = listDir(videosDir, "bg-videos", /\.(mp4|mov|webm)$/i);
    const doodles = listDir(doodlesDir, "doodles").map(d => d.name);

    return Response.json({ 
      papers: [...papers, ...modern],
      videos,
      doodles 
    });
  } catch (error) {
    return Response.json({ papers: [], videos: [], doodles: [] });
  }
}
