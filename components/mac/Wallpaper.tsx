'use client';

// Four selectable wallpapers, switchable from the ⌘ menu. All CSS/SVG,
// zero image assets. Each has a light and dark treatment.
export type WallpaperVariant = 'mesh' | 'dunes' | 'blobs' | 'quiet';

export const WALLPAPERS: { id: WallpaperVariant; label: string }[] = [
  { id: 'mesh',  label: 'Mesh'  },
  { id: 'dunes', label: 'Dunes' },
  { id: 'blobs', label: 'Blobs' },
  { id: 'quiet', label: 'Quiet' },
];

const BASES: Record<WallpaperVariant, { dark: string; light: string }> = {
  mesh: {
    dark:  'linear-gradient(160deg, #070a1e 0%, #0d1130 50%, #0a0d26 100%)',
    light: 'linear-gradient(160deg, #e3ecfa 0%, #eef2fb 50%, #e6eefa 100%)',
  },
  dunes: {
    dark:  'linear-gradient(170deg, #05081a 0%, #0a0e2c 50%, #0c102f 100%)',
    light: 'linear-gradient(170deg, #d9e9fb 0%, #ecf3fc 55%, #dfeaf7 100%)',
  },
  blobs: {
    dark:  'linear-gradient(145deg, #020614 0%, #0a0e24 35%, #110a22 65%, #08061a 100%)',
    light: 'linear-gradient(145deg, #e2ecf8 0%, #eef0f6 35%, #e7e4f4 65%, #e0ecf0 100%)',
  },
  quiet: {
    dark:  'linear-gradient(165deg, #08090d 0%, #0e1016 45%, #0a0b10 100%)',
    light: 'linear-gradient(165deg, #eef1f6 0%, #e7ebf2 45%, #ebeef4 100%)',
  },
};

// Soft radial color spot used by mesh / blobs / quiet
function Wash({ w, pos, color, blur, anim }: {
  w: string; pos: React.CSSProperties; color: string; blur: number; anim: string;
}) {
  return (
    <div style={{
      position: 'absolute', width: w, height: w, borderRadius: '50%',
      ...pos,
      background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
      filter: `blur(${blur}px)`,
      animation: anim,
    }} />
  );
}

// ── Mesh: Sequoia-style soft color field ─────────────────────────────────────
function Mesh({ dark }: { dark: boolean }) {
  return (
    <>
      <Wash w="62vw" pos={{ left: '-16vw', top: '-18vw' }} blur={95} anim="washA 46s ease-in-out infinite"
        color={dark ? 'rgba(64,110,255,.36)' : 'rgba(120,160,240,.45)'} />
      <Wash w="56vw" pos={{ right: '-14vw', top: '10vh' }} blur={100} anim="washB 58s ease-in-out infinite"
        color={dark ? 'rgba(120,80,255,.28)' : 'rgba(160,150,245,.36)'} />
      <Wash w="48vw" pos={{ left: '16vw', bottom: '-14vh' }} blur={95} anim="washA 64s ease-in-out infinite reverse"
        color={dark ? 'rgba(0,190,230,.22)' : 'rgba(120,200,235,.32)'} />
      <Wash w="34vw" pos={{ left: '36vw', top: '26vh' }} blur={85} anim="washB 52s ease-in-out infinite reverse"
        color={dark ? 'rgba(255,120,190,.10)' : 'rgba(250,180,210,.22)'} />
    </>
  );
}

// ── Dunes: Big Sur-style layered hills ───────────────────────────────────────
function Dunes({ dark }: { dark: boolean }) {
  const far  = dark ? ['#35479e', '#161d4e'] : ['#cadef6', '#a9c2e6'];
  const mid  = dark ? ['#5340c4', '#1e164e'] : ['#bcc9f0', '#93a9db'];
  const near = dark ? ['#1e78e0', '#0b2a5c'] : ['#86abe2', '#517cba'];
  return (
    <>
      <div style={{
        position: 'absolute',
        width: '55vw', height: '55vw',
        right: '-12vw', top: '-22vw',
        borderRadius: '50%',
        background: dark
          ? 'radial-gradient(circle, rgba(120,150,255,.18) 0%, rgba(120,150,255,.05) 55%, transparent 100%)'
          : 'radial-gradient(circle, rgba(255,244,214,.65) 0%, rgba(255,238,200,.22) 55%, transparent 100%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      >
        <defs>
          <linearGradient id="wp-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={far[0]} /><stop offset="1" stopColor={far[1]} />
          </linearGradient>
          <linearGradient id="wp-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={mid[0]} /><stop offset="1" stopColor={mid[1]} />
          </linearGradient>
          <linearGradient id="wp-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={near[0]} /><stop offset="1" stopColor={near[1]} />
          </linearGradient>
        </defs>
        <g style={{ animation: 'duneA 52s ease-in-out infinite' }}>
          <path d="M-80 500 C 200 420, 470 460, 740 525 C 1010 590, 1260 545, 1520 455 L1520 900 L-80 900 Z"
            fill="url(#wp-far)" opacity=".75" />
        </g>
        <g style={{ animation: 'duneB 64s ease-in-out infinite' }}>
          <path d="M-80 640 C 220 545, 520 690, 830 630 C 1100 578, 1300 690, 1520 625 L1520 900 L-80 900 Z"
            fill="url(#wp-mid)" opacity=".85" />
        </g>
        <g style={{ animation: 'duneC 42s ease-in-out infinite' }}>
          <path d="M-80 775 C 280 685, 640 815, 960 745 C 1200 693, 1360 785, 1520 750 L1520 900 L-80 900 Z"
            fill="url(#wp-near)" opacity=".95" />
        </g>
      </svg>
    </>
  );
}

// ── Blobs: the original high-energy look, retuned to the blue system ────────
function Blobs({ dark }: { dark: boolean }) {
  return (
    <>
      <Wash w="65vw" pos={{ left: '-18vw', top: '-14vw' }} blur={80} anim="washA 38s ease-in-out infinite"
        color={dark ? 'rgba(90,40,245,.46)' : 'rgba(100,170,255,.44)'} />
      <Wash w="58vw" pos={{ right: '-12vw', top: '18vh' }} blur={90} anim="washB 46s ease-in-out infinite"
        color={dark ? 'rgba(0,180,220,.38)' : 'rgba(80,200,220,.32)'} />
      <Wash w="54vw" pos={{ left: '18vw', bottom: '-12vh' }} blur={78} anim="washA 42s ease-in-out infinite reverse"
        color={dark ? 'rgba(190,50,225,.32)' : 'rgba(165,145,255,.38)'} />
    </>
  );
}

// ── Quiet: near-monochrome minimal ───────────────────────────────────────────
function Quiet({ dark }: { dark: boolean }) {
  return (
    <>
      <Wash w="70vw" pos={{ left: '-20vw', top: '-24vw' }} blur={80} anim="washB 60s ease-in-out infinite"
        color={dark ? 'rgba(70,110,205,.20)' : 'rgba(96,140,220,.20)'} />
      <Wash w="60vw" pos={{ right: '-16vw', bottom: '-18vw' }} blur={90} anim="washA 70s ease-in-out infinite reverse"
        color={dark ? 'rgba(96,104,180,.14)' : 'rgba(150,158,180,.16)'} />
    </>
  );
}

const SCENES: Record<WallpaperVariant, (p: { dark: boolean }) => React.ReactNode> = {
  mesh: Mesh, dunes: Dunes, blobs: Blobs, quiet: Quiet,
};

export default function Wallpaper({ dark, variant }: { dark: boolean; variant: WallpaperVariant }) {
  const Scene = SCENES[variant];
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden',
      background: BASES[variant][dark ? 'dark' : 'light'],
    }}>
      <Scene dark={dark} />

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
