import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const BRAND_GUARDIAN = `
  STRICT BRAND GUIDELINES FOR 'POETIK':
  - LOGO MOTIF: The current logo is the word 'poetik' in lowercase Italiana font with a single solid circle (dot) next to it. Any new marks should feel like a natural evolution of this—minimal, geometric, or abstract line-art.
  - PRODUCT TYPE: 'Poetik' is a DESKTOP-FIRST WEB APP, not a mobile app. Avoid 'Download on App Store' buttons. Use 'Begin writing' or 'Enter the Void'.
  - TYPOGRAPHY: Must use or mimic 'Italiana' (high-contrast serif) for headings and 'Cormorant Garamond' for body text. 
  - COLOR PALETTE: Strict adherence to Ebony (#0D0B09) and Cream (#F5F0E8). Accents should be sophisticated sunset gradients (deep violets to soft oranges).
  - UI ELEMENTS: Use glassmorphism, thin lines, and heavy negative space. 
  - AESTHETIC: Atmospheric, editorial, cinematic. Think 'A24 film' meets 'luxury poetry magazine'. 
  - CONSISTENCY: Every generation must feel like it belongs to the same high-end brand family.
`;

export async function POST(req: NextRequest) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "REPLICATE_API_TOKEN is not configured in environment variables." },
      { status: 500 }
    );
  }

  try {
    const { prompt, aspect_ratio = "1:1" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Map requested ratios to model-supported values (1:1, 3:2, 2:3)
    let modelAspectRatio = "1:1";
    if (aspect_ratio === "16:9") modelAspectRatio = "3:2";
    else if (aspect_ratio === "9:16") modelAspectRatio = "2:3";
    else if (["1:1", "3:2", "2:3"].includes(aspect_ratio)) modelAspectRatio = aspect_ratio;

    const enhancedPrompt = `${prompt}\n\n${BRAND_GUARDIAN}`;
    console.log(`Generating image with ratio ${modelAspectRatio} for requested ${aspect_ratio}`);

    // Using the openai/gpt-image-2 model as requested
    const output: any = await replicate.run(
      "openai/gpt-image-2",
      {
        input: {
          prompt: enhancedPrompt,
          aspect_ratio: modelAspectRatio,
          quality: "high"
        },
      }
    );

    console.log("Replicate output type:", typeof output);
    console.log("Is array?", Array.isArray(output));

    let finalOutput = output;

    // Handle case where output is a stream or contains a stream
    if (Array.isArray(output)) {
      const results = [];
      for (const item of output) {
        if (item instanceof ReadableStream || (item && typeof item.getReader === 'function')) {
          console.log("Found ReadableStream in output array, consuming...");
          const reader = item.getReader();
          const chunks = [];
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
          }
          const blob = new Blob(chunks);
          const buffer = Buffer.from(await blob.arrayBuffer());
          const base64 = buffer.toString('base64');
          results.push(`data:image/webp;base64,${base64}`);
        } else {
          results.push(item);
        }
      }
      finalOutput = results;
    } else if (output instanceof ReadableStream || (output && typeof output.getReader === 'function')) {
      console.log("Output is a ReadableStream, consuming...");
      const reader = output.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      const blob = new Blob(chunks);
      const buffer = Buffer.from(await blob.arrayBuffer());
      const base64 = buffer.toString('base64');
      finalOutput = `data:image/webp;base64,${base64}`;
    }

    console.log("Final processed output (sample):", typeof finalOutput === 'string' ? finalOutput.substring(0, 100) : "Array of results");

    return NextResponse.json({ output: finalOutput });
  } catch (error: any) {
    console.error("Replicate error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate image" },
      { status: 500 }
    );
  }
}
