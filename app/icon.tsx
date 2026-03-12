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
        {/* Soft amber glow so it reads on both light and dark browser UIs */}
        <div style={{
          position: 'absolute',
          width: 380, height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,148,58,.22) 0%, rgba(212,148,58,.06) 50%, transparent 72%)',
          display: 'flex',
        }} />

        {/* TR */}
        <span style={{
          fontSize: 210,
          fontWeight: 800,
          fontFamily: 'system-ui, sans-serif',
          color: '#D4943A',
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
