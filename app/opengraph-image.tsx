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
          color: '#1A1714',
          position: 'relative',
        }}
      >
        {/* Background Image */}
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

        {/* Elegant Inner Frame */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '1120px',  // 1200 - 80
            height: '550px',  // 630 - 80
            margin: '40px',
            border: '1.5px solid rgba(26,23,20,0.15)',
            position: 'relative',
          }}
        >
          {/* Top Logo Area */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span
                style={{
                  fontFamily: fontItaliana ? '"Italiana"' : 'serif',
                  fontSize: 32,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  marginRight: -10,
                }}
              >
                poetik
              </span>
              <div
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: '#1A1714',
                  borderRadius: '50%',
                  marginTop: 6,
                  marginLeft: 5,
                }}
              />
            </div>
          </div>

          {/* Center Hero Statement */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 100px',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontFamily: fontItaliana ? '"Italiana"' : 'serif',
                fontSize: 80,
                lineHeight: 1.3,
                letterSpacing: '0.02em',
                opacity: 0.85,
              }}
            >
              A minimal, distraction-free app for writing poetry.
            </span>
          </div>

          {/* Bottom Footnote Area */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 60px',
              marginBottom: 40,
              opacity: 0.35,
              fontSize: 16,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'sans-serif',
              fontWeight: 500,
            }}
          >
            <span style={{ display: 'flex' }}>WRITE</span>
            <span style={{ display: 'flex' }}>STYLE</span>
            <span style={{ display: 'flex' }}>SHARE</span>
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
