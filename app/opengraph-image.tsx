import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt    = 'Tomy Romero Seas · Software Engineer';
export const size   = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(160deg, #0a0c11 0%, #12141c 55%, #0b0d13 100%)',
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Single subtle blue wash */}
        <div style={{
          position: 'absolute', top: -120, left: -100,
          width: 520, height: 520, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(70,110,205,.22) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />

        {/* Corner URL */}
        <div style={{
          position: 'absolute', bottom: 36, right: 52,
          fontSize: 18, color: 'rgba(238,240,244,.24)',
          letterSpacing: '.5px',
          fontWeight: 500,
        }}>
          tomyromero.vercel.app
        </div>

        {/* Monogram */}
        <div style={{
          width: 104, height: 104, borderRadius: 26,
          background: '#0A84FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, color: '#fff', fontWeight: 700,
          marginBottom: 32,
          boxShadow: '0 12px 40px rgba(0,0,0,.40)',
        }}>
          TR
        </div>

        {/* Name */}
        <div style={{
          fontSize: 62, fontWeight: 700,
          letterSpacing: '-2px', marginBottom: 14, lineHeight: 1,
          color: '#eef0f4',
        }}>
          Tomy Romero Seas
        </div>

        {/* Role */}
        <div style={{
          fontSize: 26, color: '#78b3ff', fontWeight: 500, marginBottom: 28,
        }}>
          Software Engineer · MEDsys Software Solutions
        </div>

        {/* Tech pills row */}
        <div style={{ display: 'flex', gap: 12 }}>
          {['ASP.NET Core', 'React', 'SQL Server', 'TypeScript', 'Azure'].map(t => (
            <div key={t} style={{
              padding: '8px 18px', borderRadius: 100,
              background: 'rgba(64,140,255,.10)',
              border: '1px solid rgba(100,160,255,.28)',
              color: '#9cc4ff', fontSize: 16, fontWeight: 500,
            }}>
              {t}
            </div>
          ))}
        </div>

        {/* Open-to-work dot */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginTop: 36,
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: '#34c759',
          }} />
          <div style={{ fontSize: 17, color: '#34c759', letterSpacing: '.3px' }}>
            Open to opportunities
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
