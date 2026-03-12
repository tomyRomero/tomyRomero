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
          background: 'linear-gradient(145deg,#060b1a 0%,#0d1226 60%,#12091e 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* Amber glow backdrop */}
        <div style={{
          position: 'absolute',
          width: 280, height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(212,148,58,.22) 0%,transparent 70%)',
          display: 'flex',
        }} />

        {/* TR monogram tile */}
        <div style={{
          width: 320, height: 320,
          borderRadius: 88,
          background: 'linear-gradient(145deg,#1a1206 0%,#2a1a08 50%,#0d0d1a 100%)',
          border: '2px solid rgba(212,148,58,.35)',
          boxShadow: '0 0 60px rgba(212,148,58,.28), inset 0 1px 0 rgba(212,148,58,.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 152, fontWeight: 800,
            fontFamily: 'system-ui, sans-serif',
            background: 'linear-gradient(135deg,#f5c87a 0%,#D4943A 50%,#b8720a 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-6px',
            lineHeight: 1,
          }}>
            TR
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
