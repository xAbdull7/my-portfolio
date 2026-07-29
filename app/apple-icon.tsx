import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: 100,
          fontWeight: 900,
          fontFamily: 'sans-serif',
          letterSpacing: '-2px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(to bottom right, #ffffff 30%, #a1a1aa 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'flex',
          }}
        >
          A
        </div>
      </div>
    ),
    { ...size }
  );
}
