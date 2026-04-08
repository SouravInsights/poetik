import fs from "node:fs";
import { join } from "node:path";

export async function GET() {
  const papersDir = join(process.cwd(), "public", "papers");
  const modernDir = join(process.cwd(), "public", "modern-backgrounds");
  const doodlesDir = join(process.cwd(), "public", "doodles");

  try {
    const listDir = (dir: string, prefix: string) => {
      if (!fs.existsSync(dir)) return [];
      return fs.readdirSync(dir)
        .filter(f => f.match(/\.(jpg|jpeg|png|webp|svg)$/i))
        .map(name => ({
          name,
          path: `/${prefix}/${name}`,
          category: prefix
        }));
    };

    const papers = listDir(papersDir, "papers");
    const modern = listDir(modernDir, "modern-backgrounds");
    const doodles = listDir(doodlesDir, "doodles").map(d => d.name);

    return Response.json({ 
      papers: [...papers, ...modern], 
      doodles 
    });
  } catch (error) {
    return Response.json({ papers: [], doodles: [] });
  }
}
