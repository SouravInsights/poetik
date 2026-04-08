import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const alt = 'poetik';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/jpeg';

export default async function Image() {
  // Read the image robustly using Node APIs (removed edge runtime)
  const bgPath = join(process.cwd(), 'public', 'modern-backgrounds', '10.jpg');
  const bgData = readFileSync(bgPath);
  const bgBase64 = `data:image/jpeg;base64,${bgData.toString('base64')}`;

  // Safely load the logo font (Italiana)
  let fontItaliana = null;
  try {
    const res = await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/italiana/Italiana-Regular.ttf');
    if (res.ok) {
      fontItaliana = await res.arrayBuffer();
    }
  } catch (error) {
    console.error("Failed to load font:", error);
  }

  const fonts: any[] = [];
  if (fontItaliana) {
    fonts.push({
      name: 'Italiana',
      data: fontItaliana,
      style: 'normal',
      weight: 400,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1A1714',
          fontFamily: 'sans-serif', // Fallback for the subtext
        }}
      >
        {/* Background Image injected cleanly via base64 */}
        <img
          src={bgBase64}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Inner Content Wrapper */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span
              style={{
                fontFamily: fontItaliana ? '"Italiana"' : 'serif',
                fontSize: 100,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginRight: -10, // visually balanced tracking
              }}
            >
              poetik
            </span>
            <div
              style={{
                width: 14,
                height: 14,
                backgroundColor: '#1A1714',
                borderRadius: '50%',
                marginTop: 15,
                marginLeft: 5,
              }}
            />
          </div>

          {/* Subtitle */}
          <div
            style={{
              marginTop: 10,
              fontSize: 22,
              opacity: 0.5,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: 400,
            }}
          >
            A minimal, distraction-free app for writing poetry.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  );
}
