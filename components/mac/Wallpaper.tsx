'use client';

export default function Wallpaper({ dark }: { dark: boolean }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden',
      background: dark
        ? 'linear-gradient(145deg, #020614 0%, #0a0e24 35%, #110a22 65%, #08061a 100%)'
        : 'linear-gradient(145deg, #e4edf8 0%, #f5ece0 35%, #ece4f2 65%, #e0ecf0 100%)',
    }}>
      {/* Blob 1 — top-left, deeper purple */}
      <div style={{
        position: 'absolute',
        width: '65vw', height: '65vw',
        borderRadius: '50%',
        left: '-18vw', top: '-14vw',
        background: dark
          ? 'radial-gradient(circle, rgba(100,20,240,.48) 0%, rgba(60,10,180,.20) 60%, transparent 100%)'
          : 'radial-gradient(circle, rgba(100,170,255,.42) 0%, rgba(80,140,240,.18) 60%, transparent 100%)',
        filter: 'blur(80px)',
        animation: 'blob1 38s ease-in-out infinite',
      }} />
      {/* Blob 2 — right, teal/cyan */}
      <div style={{
        position: 'absolute',
        width: '58vw', height: '58vw',
        borderRadius: '50%',
        right: '-12vw', top: '18vh',
        background: dark
          ? 'radial-gradient(circle, rgba(0,180,220,.38) 0%, rgba(0,120,180,.16) 60%, transparent 100%)'
          : 'radial-gradient(circle, rgba(255,165,90,.38) 0%, rgba(240,140,60,.16) 60%, transparent 100%)',
        filter: 'blur(90px)',
        animation: 'blob2 46s ease-in-out infinite',
      }} />
      {/* Blob 3 — bottom-center, magenta */}
      <div style={{
        position: 'absolute',
        width: '54vw', height: '54vw',
        borderRadius: '50%',
        left: '18vw', bottom: '-12vh',
        background: dark
          ? 'radial-gradient(circle, rgba(180,40,220,.34) 0%, rgba(140,20,180,.14) 60%, transparent 100%)'
          : 'radial-gradient(circle, rgba(165,145,255,.36) 0%, rgba(140,120,240,.14) 60%, transparent 100%)',
        filter: 'blur(78px)',
        animation: 'blob3 42s ease-in-out infinite',
      }} />
      {/* Blob 4 — center-left, warm accent glow */}
      <div style={{
        position: 'absolute',
        width: '40vw', height: '40vw',
        borderRadius: '50%',
        left: '30vw', top: '30vh',
        background: dark
          ? 'radial-gradient(circle, rgba(212,148,58,.18) 0%, rgba(212,148,58,.06) 50%, transparent 100%)'
          : 'radial-gradient(circle, rgba(212,148,58,.14) 0%, rgba(212,148,58,.04) 50%, transparent 100%)',
        filter: 'blur(70px)',
        animation: 'aurora1 52s ease-in-out infinite',
      }} />
      {/* Noise texture overlay for premium feel */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: dark ? 0.035 : 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '180px 180px',
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }} />
      {/* Subtle vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 50%, ${dark ? 'rgba(0,0,0,.40)' : 'rgba(0,0,0,.06)'} 100%)`,
        pointerEvents: 'none',
      }} />
    </div>
  );
}
