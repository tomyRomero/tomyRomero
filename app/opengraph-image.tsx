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
          background: 'linear-gradient(145deg,#020614 0%,#0a0e24 35%,#110a22 65%,#08061a 100%)',
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative gradient blobs */}
        <div style={{
          position: 'absolute', top: -80, left: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(100,20,240,.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, right: -60,
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,180,220,.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />

        {/* Gold gradient bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 6,
          background: 'linear-gradient(90deg,#b8720a,#D4943A,#f5c87a,#D4943A,#b8720a)',
        }} />

        {/* Corner URL */}
        <div style={{
          position: 'absolute', bottom: 36, right: 52,
          fontSize: 18, color: 'rgba(240,240,245,.24)',
          letterSpacing: '.5px',
          fontWeight: 500,
        }}>
          tomyromero.vercel.app
        </div>

        {/* Avatar */}
        <div style={{
          width: 108, height: 108, borderRadius: 26,
          background: 'linear-gradient(135deg,#D4943A 0%,#e8a94e 50%,#7a4c10 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, color: '#fff', fontWeight: 700,
          marginBottom: 32,
          boxShadow: '0 0 40px rgba(212,148,58,.35), 0 12px 40px rgba(212,148,58,.30)',
        }}>
          TR
        </div>

        {/* Name with subtle gradient */}
        <div style={{
          fontSize: 62, fontWeight: 700,
          letterSpacing: '-2px', marginBottom: 14, lineHeight: 1,
          background: 'linear-gradient(135deg, #f0f0f5 0%, #D4943A 100%)',
          backgroundClip: 'text',
          color: 'transparent',
        }}>
          Tomy Romero Seas
        </div>

        {/* Role */}
        <div style={{
          fontSize: 26, color: '#D4943A', fontWeight: 500, marginBottom: 28,
        }}>
          Software Engineer · MEDsys Software Solutions
        </div>

        {/* Tech pills row */}
        <div style={{ display: 'flex', gap: 12 }}>
          {['ASP.NET Core', 'React', 'SQL Server', 'TypeScript', 'Azure'].map(t => (
            <div key={t} style={{
              padding: '8px 18px', borderRadius: 100,
              background: 'rgba(212,148,58,.10)',
              border: '1px solid rgba(212,148,58,.25)',
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
            background: '#34c759', boxShadow: '0 0 10px #34c759',
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
