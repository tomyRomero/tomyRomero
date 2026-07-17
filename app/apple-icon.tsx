import { ImageResponse } from 'next/og';

export const runtime     = 'edge';
export const size        = { width: 180, height: 180 };
export const contentType = 'image/png';

// Apple touch icon — iOS applies its own rounded mask and does not support
// transparency well, so this uses an opaque branded background.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(145deg, #14161c 0%, #08090d 100%)',
        }}
      >
        <span style={{
          fontSize: 96,
          fontWeight: 800,
          fontFamily: 'system-ui, sans-serif',
          color: '#78b3ff',
          letterSpacing: '-5px',
          lineHeight: 1,
        }}>
          TR
        </span>
      </div>
    ),
    { ...size },
  );
}
