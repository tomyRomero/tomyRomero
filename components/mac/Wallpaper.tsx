'use client';

// Layered animated gradient wallpaper with distinct light / dark palettes.
// Light: warm daylight — azure, peach, and lilac washes over a bright sky base.
// Dark: deep-space indigo with violet / cyan / magenta color fields and a
// faint aurora ribbon. All CSS — no image assets to load.
export default function Wallpaper({ dark }: { dark: boolean }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden',
      background: dark
        ? 'linear-gradient(160deg, #030617 0%, #0a0d2b 34%, #140a30 66%, #060520 100%)'
        : 'linear-gradient(160deg, #d7e6f8 0%, #f6ecdc 36%, #eadef2 68%, #d7e7ee 100%)',
    }}>
      {/* Top light source — moonlight in dark mode, sunlight in light mode */}
      <div style={{
        position: 'absolute',
        width: '90vw', height: '55vw',
        left: '5vw', top: '-30vw',
        borderRadius: '50%',
        background: dark
          ? 'radial-gradient(circle, rgba(130,150,255,.16) 0%, rgba(130,150,255,.05) 55%, transparent 100%)'
          : 'radial-gradient(circle, rgba(255,244,214,.85) 0%, rgba(255,238,200,.30) 55%, transparent 100%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* Blob 1 — top-left */}
      <div style={{
        position: 'absolute',
        width: '65vw', height: '65vw',
        borderRadius: '50%',
        left: '-18vw', top: '-14vw',
        background: dark
          ? 'radial-gradient(circle, rgba(105,40,250,.50) 0%, rgba(60,10,180,.20) 60%, transparent 100%)'
          : 'radial-gradient(circle, rgba(105,168,255,.46) 0%, rgba(80,140,240,.18) 60%, transparent 100%)',
        filter: 'blur(85px)',
        animation: 'blob1 38s ease-in-out infinite',
      }} />

      {/* Blob 2 — right */}
      <div style={{
        position: 'absolute',
        width: '58vw', height: '58vw',
        borderRadius: '50%',
        right: '-12vw', top: '18vh',
        background: dark
          ? 'radial-gradient(circle, rgba(0,195,235,.40) 0%, rgba(0,120,180,.16) 60%, transparent 100%)'
          : 'radial-gradient(circle, rgba(255,168,98,.42) 0%, rgba(240,140,60,.16) 60%, transparent 100%)',
        filter: 'blur(95px)',
        animation: 'blob2 46s ease-in-out infinite',
      }} />

      {/* Blob 3 — bottom-center */}
      <div style={{
        position: 'absolute',
        width: '54vw', height: '54vw',
        borderRadius: '50%',
        left: '18vw', bottom: '-12vh',
        background: dark
          ? 'radial-gradient(circle, rgba(205,55,235,.36) 0%, rgba(140,20,180,.14) 60%, transparent 100%)'
          : 'radial-gradient(circle, rgba(172,150,255,.40) 0%, rgba(140,120,240,.14) 60%, transparent 100%)',
        filter: 'blur(82px)',
        animation: 'blob3 42s ease-in-out infinite',
      }} />

      {/* Blob 4 — center, warm brand-accent glow */}
      <div style={{
        position: 'absolute',
        width: '40vw', height: '40vw',
        borderRadius: '50%',
        left: '30vw', top: '30vh',
        background: dark
          ? 'radial-gradient(circle, rgba(212,148,58,.18) 0%, rgba(212,148,58,.06) 50%, transparent 100%)'
          : 'radial-gradient(circle, rgba(212,148,58,.15) 0%, rgba(212,148,58,.04) 50%, transparent 100%)',
        filter: 'blur(70px)',
        animation: 'aurora1 52s ease-in-out infinite',
      }} />

      {/* Aurora ribbon — diagonal band of color drifting across the upper half */}
      <div style={{
        position: 'absolute',
        width: '130vw', height: '26vh',
        left: '-15vw', top: '16vh',
        transform: 'rotate(-14deg)',
        background: dark
          ? 'linear-gradient(90deg, transparent 0%, rgba(0,210,255,.14) 28%, rgba(150,80,255,.18) 55%, rgba(255,80,220,.10) 78%, transparent 100%)'
          : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.42) 30%, rgba(255,224,178,.36) 60%, transparent 100%)',
        filter: 'blur(48px)',
        animation: 'blob2 58s ease-in-out infinite',
        pointerEvents: 'none',
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
        background: `radial-gradient(ellipse at center, transparent 50%, ${dark ? 'rgba(0,0,0,.42)' : 'rgba(0,0,0,.06)'} 100%)`,
        pointerEvents: 'none',
      }} />
    </div>
  );
}
