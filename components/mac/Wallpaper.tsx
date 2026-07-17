'use client';

// Big Sur-inspired wallpaper: three layered dunes with depth gradients, a
// light-source glow, and slow horizontal drift. Dark mode is deep indigo
// night; light mode is airy daylight blues with a soft sun. All SVG/CSS,
// no image assets.
export default function Wallpaper({ dark }: { dark: boolean }) {
  const g = dark
    ? {
        base:  'linear-gradient(170deg, #05081a 0%, #0a0e2c 50%, #0c102f 100%)',
        glow:  'radial-gradient(circle, rgba(120,150,255,.18) 0%, rgba(120,150,255,.05) 55%, transparent 100%)',
        far:   ['#35479e', '#161d4e'],
        mid:   ['#5340c4', '#1e164e'],
        near:  ['#1e78e0', '#0b2a5c'],
      }
    : {
        base:  'linear-gradient(170deg, #d9e9fb 0%, #ecf3fc 55%, #dfeaf7 100%)',
        glow:  'radial-gradient(circle, rgba(255,244,214,.65) 0%, rgba(255,238,200,.22) 55%, transparent 100%)',
        far:   ['#cadef6', '#a9c2e6'],
        mid:   ['#bcc9f0', '#93a9db'],
        near:  ['#86abe2', '#517cba'],
      };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden',
      background: g.base,
    }}>
      {/* Light source — moonlight / sun, upper right */}
      <div style={{
        position: 'absolute',
        width: '55vw', height: '55vw',
        right: '-12vw', top: '-22vw',
        borderRadius: '50%',
        background: g.glow,
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* Dune layers */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="wp-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={g.far[0]} />
            <stop offset="1" stopColor={g.far[1]} />
          </linearGradient>
          <linearGradient id="wp-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={g.mid[0]} />
            <stop offset="1" stopColor={g.mid[1]} />
          </linearGradient>
          <linearGradient id="wp-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={g.near[0]} />
            <stop offset="1" stopColor={g.near[1]} />
          </linearGradient>
        </defs>

        <g style={{ animation: 'duneA 52s ease-in-out infinite' }}>
          <path
            d="M-80 500 C 200 420, 470 460, 740 525 C 1010 590, 1260 545, 1520 455 L1520 900 L-80 900 Z"
            fill="url(#wp-far)" opacity=".75"
          />
        </g>
        <g style={{ animation: 'duneB 64s ease-in-out infinite' }}>
          <path
            d="M-80 640 C 220 545, 520 690, 830 630 C 1100 578, 1300 690, 1520 625 L1520 900 L-80 900 Z"
            fill="url(#wp-mid)" opacity=".85"
          />
        </g>
        <g style={{ animation: 'duneC 42s ease-in-out infinite' }}>
          <path
            d="M-80 775 C 280 685, 640 815, 960 745 C 1200 693, 1360 785, 1520 750 L1520 900 L-80 900 Z"
            fill="url(#wp-near)" opacity=".95"
          />
        </g>
      </svg>

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
        background: `radial-gradient(ellipse at center, transparent 55%, ${dark ? 'rgba(0,0,0,.42)' : 'rgba(20,30,50,.06)'} 100%)`,
        pointerEvents: 'none',
      }} />
    </div>
  );
}
