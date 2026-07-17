import { ImageResponse } from 'next/og';

export const runtime     = 'edge';
export const size        = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent',
        }}
      >
        {/* Soft blue glow so it reads on both light and dark browser UIs */}
        <div style={{
          position: 'absolute',
          width: 380, height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10,132,255,.22) 0%, rgba(10,132,255,.06) 50%, transparent 72%)',
          display: 'flex',
        }} />

        {/* TR */}
        <span style={{
          fontSize: 210,
          fontWeight: 800,
          fontFamily: 'system-ui, sans-serif',
          color: '#0A84FF',
          letterSpacing: '-10px',
          lineHeight: 1,
        }}>
          TR
        </span>
      </div>
    ),
    { ...size },
  );
}
