import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt    = 'Tomy Romero Seas — Software Engineer';
export const size   = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(145deg,#060b1a 0%,#0d1226 55%,#12091e 100%)',
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Gold bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 8,
          background: 'linear-gradient(90deg,#D4943A,#f5c87a,#D4943A)',
        }} />

        {/* Corner URL */}
        <div style={{
          position: 'absolute', bottom: 36, right: 52,
          fontSize: 18, color: 'rgba(242,242,247,.28)',
          letterSpacing: '.5px',
        }}>
          tomyromero.vercel.app
        </div>

        {/* Avatar */}
        <div style={{
          width: 108, height: 108, borderRadius: 26,
          background: 'linear-gradient(135deg,#D4943A 0%,#7a4c10 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, color: '#fff', fontWeight: 700,
          marginBottom: 32,
          boxShadow: '0 12px 40px rgba(212,148,58,.45)',
        }}>
          TR
        </div>

        {/* Name */}
        <div style={{
          fontSize: 62, fontWeight: 700, color: '#f2f2f7',
          letterSpacing: '-2px', marginBottom: 14, lineHeight: 1,
        }}>
          Tomy Romero Seas
        </div>

        {/* Role */}
        <div style={{
          fontSize: 26, color: '#D4943A', fontWeight: 500, marginBottom: 28,
        }}>
          Software Engineer 1 · MEDsys Software Solutions
        </div>

        {/* Tech pills row */}
        <div style={{ display: 'flex', gap: 12 }}>
          {['ASP.NET Core', 'React', 'SQL Server', 'TypeScript', 'Azure'].map(t => (
            <div key={t} style={{
              padding: '8px 18px', borderRadius: 100,
              background: 'rgba(212,148,58,.12)',
              border: '1px solid rgba(212,148,58,.30)',
              color: '#D4943A', fontSize: 16, fontWeight: 500,
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
            background: '#34c759', boxShadow: '0 0 8px #34c759',
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
