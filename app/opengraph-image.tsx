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
  const bgPath = join(process.cwd(), 'public', 'modern-backgrounds', '10.jpg');
  const bgData = readFileSync(bgPath);
  const bgBase64 = `data:image/jpeg;base64,${bgData.toString('base64')}`;

  let fontItaliana = null;
  let fontJost = null;
  try {
    const [resIta, resJost] = await Promise.all([
      fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/italiana/Italiana-Regular.ttf'),
      fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/jost/static/Jost-Regular.ttf')
    ]);
    if (resIta.ok) fontItaliana = await resIta.arrayBuffer();
    if (resJost.ok) fontJost = await resJost.arrayBuffer();
  } catch (error) {
    console.error("Failed to load fonts:", error);
  }

  const fonts: any[] = [];
  if (fontItaliana) fonts.push({ name: 'Italiana', data: fontItaliana, style: 'normal', weight: 400 });
  if (fontJost) fonts.push({ name: 'Jost', data: fontJost, style: 'normal', weight: 400 });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
          fontFamily: fontJost ? '"Jost"' : 'sans-serif',
          color: '#1A1714',
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

        {/* Content Wrapper */}
        <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.03)' }}>
          
          {/* Left Column: Brand & Copy */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0 80px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span
                style={{
                  fontFamily: fontItaliana ? '"Italiana"' : 'serif',
                  fontSize: 80,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  marginRight: -15, // visually balanced tracking
                }}
              >
                poetik
              </span>
              <div
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: '#1A1714',
                  borderRadius: '50%',
                  marginTop: 12,
                  marginLeft: 15,
                }}
              />
            </div>

            <span
              style={{
                marginTop: 24,
                fontSize: 34,
                lineHeight: 1.4,
                opacity: 0.65,
                maxWidth: 520,
              }}
            >
              A minimal, distraction-free app for writing poetry.
            </span>

            {/* Feature List (Highly Visible now) */}
            <div style={{ display: 'flex', gap: 32, marginTop: 48, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                 <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#1A1714', opacity: 0.4 }} />
                 <span style={{ fontSize: 16, letterSpacing: '0.3em', opacity: 0.8, textTransform: 'uppercase' }}>WRITE</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                 <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#1A1714', opacity: 0.4 }} />
                 <span style={{ fontSize: 16, letterSpacing: '0.3em', opacity: 0.8, textTransform: 'uppercase' }}>STYLE</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                 <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#1A1714', opacity: 0.4 }} />
                 <span style={{ fontSize: 16, letterSpacing: '0.3em', opacity: 0.8, textTransform: 'uppercase' }}>SHARE</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase (Floating Poetry Card) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 120 }}>
            <div
              style={{
                width: 315,
                height: 560, // 9:16 aspect ratio
                borderRadius: 20,
                boxShadow: '0 32px 64px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.4)',
                display: 'flex',
                position: 'relative',
                transform: 'rotate(4deg)', // Subtle tilt makes it feel like an object, reducing dominance
                overflow: 'hidden', // Ensures the nested image respects the card border radius
              }}
            >
              {/* Authentic Canvas Background */}
              <img
                src={bgBase64}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 315,
                  height: 560,
                  objectFit: 'cover',
                }}
              />
              {/* Authentic Export Overlay (20% white for light themes) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 315,
                  height: 560,
                  backgroundColor: 'white',
                  opacity: 0.2,
                }}
              />

              {/* Inner Content Wrapper to safely apply padding without breaking Yoga absolute sizing */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  padding: '0 30px',
                  color: '#1A1714',
                  position: 'relative', // keeps content above absolute backgrounds
                }}
              >
                {/* Text Content */}
                <div
                  style={{
                    fontFamily: fontItaliana ? '"Italiana"' : 'serif',
                    fontSize: 26,
                    textAlign: 'center',
                    lineHeight: 1.6,
                    opacity: 0.85,
                    display: 'flex',
                    flexDirection: 'column',
                    fontStyle: 'italic', // Mimics true export
                    letterSpacing: '0.03em',
                  }}
                >
                  <span>Dil-e-nadaan tujhe</span>
                  <span>hua kya hai?</span>
                  <span style={{ marginTop: 24 }}>Aakhir is dard ki</span>
                  <span>dawa kya hai?</span>
                </div>
                
                {/* Authentically anchored @handle */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: 30,
                    fontSize: 11,
                    letterSpacing: '0.4em',
                    opacity: 0.6, // Boosted opacity for visibility
                    textTransform: 'uppercase',
                    fontWeight: 500,
                  }}
                >
                  @mirzaghalib
                </span>
              </div>
            </div>
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
