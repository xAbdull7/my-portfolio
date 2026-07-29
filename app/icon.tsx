import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
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
          fontSize: 280,
          fontWeight: 900,
          fontFamily: 'sans-serif',
          letterSpacing: '-10px',
          boxShadow: 'inset 0 0 100px rgba(255,255,255,0.05)',
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
