'use client';

// Quiet, professional wallpaper: a near-monochrome base with two large,
// slow-drifting color washes. Light mode is cool porcelain; dark mode is
// graphite with a faint blue cast. All CSS — no image assets.
export default function Wallpaper({ dark }: { dark: boolean }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden',
      background: dark
        ? 'linear-gradient(165deg, #08090d 0%, #0e1016 45%, #0a0b10 100%)'
        : 'linear-gradient(165deg, #eef1f6 0%, #e7ebf2 45%, #ebeef4 100%)',
    }}>
      {/* Primary wash — soft blue, upper left */}
      <div style={{
        position: 'absolute',
        width: '70vw', height: '70vw',
        borderRadius: '50%',
        left: '-20vw', top: '-24vw',
        background: dark
          ? 'radial-gradient(circle, rgba(70,110,205,.20) 0%, rgba(70,110,205,.06) 55%, transparent 100%)'
          : 'radial-gradient(circle, rgba(96,140,220,.20) 0%, rgba(96,140,220,.06) 55%, transparent 100%)',
        filter: 'blur(80px)',
        animation: 'blob1 52s ease-in-out infinite',
      }} />

      {/* Secondary wash — muted slate, lower right */}
      <div style={{
        position: 'absolute',
        width: '60vw', height: '60vw',
        borderRadius: '50%',
        right: '-16vw', bottom: '-18vw',
        background: dark
          ? 'radial-gradient(circle, rgba(96,104,180,.14) 0%, rgba(96,104,180,.05) 55%, transparent 100%)'
          : 'radial-gradient(circle, rgba(150,158,180,.16) 0%, rgba(150,158,180,.05) 55%, transparent 100%)',
        filter: 'blur(90px)',
        animation: 'blob2 64s ease-in-out infinite',
      }} />

      {/* Noise texture */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: dark ? 0.035 : 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '180px 180px',
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 55%, ${dark ? 'rgba(0,0,0,.42)' : 'rgba(20,30,50,.05)'} 100%)`,
        pointerEvents: 'none',
      }} />
    </div>
  );
}
