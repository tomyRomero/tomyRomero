'use client';
import { useState, useRef } from 'react';

// Selectable wallpapers, switchable from the ⌘ menu. All CSS/SVG,
// zero image assets. Each has a light and dark treatment.
export type WallpaperVariant = 'mesh' | 'dunes' | 'blobs' | 'quiet' | 'bubbles' | 'splash';

export const WALLPAPERS: { id: WallpaperVariant; label: string }[] = [
  { id: 'mesh',    label: 'Mesh'    },
  { id: 'dunes',   label: 'Dunes'   },
  { id: 'blobs',   label: 'Blobs'   },
  { id: 'quiet',   label: 'Quiet'   },
  { id: 'bubbles', label: 'Bubbles' },
  { id: 'splash',  label: 'Splash'  },
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
  bubbles: {
    dark:  'linear-gradient(180deg, #03121e 0%, #072a3f 60%, #0a3a52 100%)',
    light: 'linear-gradient(180deg, #e2f1f8 0%, #cfe7f2 55%, #c0dcEB 100%)',
  },
  splash: {
    dark:  'linear-gradient(165deg, #141416 0%, #0e0e10 100%)',
    light: 'linear-gradient(165deg, #f8f8f6 0%, #f1f1ee 100%)',
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

// ── Bubbles: interactive field, rendered by the desktop INSIDE the window
// canvas (below windows/widgets) so bubbles are clickable in empty space but
// never intercept clicks on real content. Deterministic config — no
// randomness at render time, so SSR and client match.
const BUBBLES = [
  { left: '6%',  size: 46, dur: 16, delay: 0,    sway: 40  },
  { left: '15%', size: 22, dur: 11, delay: 3,    sway: -30 },
  { left: '24%', size: 64, dur: 20, delay: 6,    sway: 24  },
  { left: '33%', size: 16, dur: 9,  delay: 1.5,  sway: -18 },
  { left: '42%', size: 38, dur: 14, delay: 8,    sway: 34  },
  { left: '52%', size: 26, dur: 12, delay: 4,    sway: -26 },
  { left: '61%', size: 54, dur: 18, delay: 10,   sway: 20  },
  { left: '70%', size: 18, dur: 10, delay: 2,    sway: -36 },
  { left: '78%', size: 42, dur: 15, delay: 7,    sway: 30  },
  { left: '86%', size: 28, dur: 13, delay: 5,    sway: -22 },
  { left: '93%', size: 50, dur: 19, delay: 12,   sway: 18  },
  { left: '48%', size: 12, dur: 8,  delay: 9,    sway: 14  },
];

const POP_DROPS = [
  { x: 40, y: 0 }, { x: 20, y: -34 }, { x: -20, y: -34 },
  { x: -40, y: 0 }, { x: -20, y: 34 }, { x: 20, y: 34 },
];

export function BubbleField({ dark }: { dark: boolean }) {
  // gen[i] bumps on pop → remounts that bubble so it respawns from the bottom
  const [gen, setGen] = useState<number[]>(() => BUBBLES.map(() => 0));
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const burstId = useRef(0);

  const pop = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = ++burstId.current;
    // Canvas-relative coords (the canvas starts 28px below the viewport top)
    setBursts(b => [...b, { id, x: r.left + r.width / 2, y: r.top - 28 + r.height / 2, size: r.width }]);
    setGen(g => g.map((v, j) => (j === i ? v + 1 : v)));
    setTimeout(() => setBursts(b => b.filter(x => x.id !== id)), 650);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} aria-hidden="true">
      {BUBBLES.map((b, i) => (
        <button
          key={`${i}:${gen[i]}`}
          className="wp-bubble"
          tabIndex={-1}
          onClick={e => pop(i, e)}
          style={{
            position: 'absolute',
            left: b.left,
            bottom: -(b.size + 24),
            width: b.size, height: b.size,
            borderRadius: '50%',
            padding: 0,
            pointerEvents: 'auto',
            cursor: 'pointer',
            background: dark
              ? 'radial-gradient(circle at 30% 30%, rgba(255,255,255,.32), rgba(160,220,255,.10) 45%, rgba(160,220,255,.03) 70%, transparent 100%)'
              : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,.85), rgba(120,170,220,.14) 45%, transparent 70%)',
            border: dark
              ? '1px solid rgba(190,230,255,.28)'
              : '1px solid rgba(110,160,210,.30)',
            opacity: 0,
            // Popped bubbles respawn quickly instead of waiting a full cycle
            animation: `bubbleRise ${b.dur}s linear ${gen[i] === 0 ? b.delay : 1 + (i % 4)}s infinite`,
            ['--sway' as string]: `${b.sway}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Pop bursts: expanding ring + droplets flying outward */}
      {bursts.map(b => (
        <div key={b.id} style={{ position: 'absolute', left: b.x, top: b.y, width: 0, height: 0, zIndex: 3 }}>
          <div style={{
            position: 'absolute', left: -b.size / 2, top: -b.size / 2,
            width: b.size, height: b.size, borderRadius: '50%',
            border: dark ? '2px solid rgba(200,235,255,.7)' : '2px solid rgba(90,150,210,.7)',
            animation: 'bubblePopRing .45s ease-out both',
          }} />
          {POP_DROPS.map((d, k) => (
            <div key={k} style={{
              position: 'absolute', left: -3, top: -3, width: 6, height: 6,
              borderRadius: '50%',
              background: dark ? 'rgba(210,240,255,.85)' : 'rgba(110,165,215,.85)',
              animation: 'bubblePopDrop .5s ease-out both',
              ['--dx' as string]: `${d.x * (b.size / 40)}px`,
              ['--dy' as string]: `${d.y * (b.size / 40)}px`,
            } as React.CSSProperties} />
          ))}
        </div>
      ))}
    </div>
  );
}

// The wallpaper layer itself contributes only the ocean gradient; the
// interactive bubbles live in the desktop canvas (see BubbleField above).
function Bubbles() {
  return null;
}

// ── Splash: a living painting. Each splat cycles forever: a drop falls,
// lands with a squash-and-overshoot, ejecta flies out, the splat lingers,
// fades, and repeats. Negative delays desync the cycles so the canvas is
// already partially painted at load with new paint landing continuously. ──
const SPLAT_PATHS = [
  'M-54,-34 C-38,-70 24,-76 52,-46 C88,-58 112,-16 84,8 C104,40 64,74 30,58 C16,88 -36,86 -50,54 C-92,58 -106,12 -76,-6 C-96,-42 -74,-60 -54,-34 Z',
  'M-46,-42 C-18,-64 30,-62 48,-34 C82,-42 96,-4 72,16 C88,48 48,68 22,52 C4,78 -40,70 -44,42 C-80,40 -88,-2 -62,-14 C-78,-44 -64,-54 -46,-42 Z',
  'M-50,-28 C-44,-62 10,-72 40,-52 C74,-64 100,-28 80,-2 C100,26 72,60 40,50 C28,76 -20,80 -38,54 C-72,62 -94,24 -70,2 C-86,-28 -66,-44 -50,-28 Z',
];

const EJECTA = [
  { x: 78, y: -52 }, { x: -84, y: -40 }, { x: 96, y: 24 },
  { x: -70, y: 48 }, { x: 30, y: -90 },
];

const SPLATS = [
  { x: 150,  y: 180, rot: -12, s: .52, color: '#0A84FF', cyc: 13, delay: -1  },
  { x: 1290, y: 210, rot: 30,  s: .45, color: '#FF375F', cyc: 15, delay: -6  },
  { x: 520,  y: 120, rot: 70,  s: .34, color: '#FFD60A', cyc: 12, delay: -9  },
  { x: 1060, y: 140, rot: -35, s: .38, color: '#30D158', cyc: 16, delay: -3  },
  { x: 260,  y: 700, rot: 15,  s: .50, color: '#BF5AF2', cyc: 14, delay: -11 },
  { x: 760,  y: 240, rot: -60, s: .30, color: '#FF375F', cyc: 17, delay: -13 },
  { x: 1340, y: 520, rot: 8,   s: .42, color: '#0A84FF', cyc: 12, delay: -5  },
  { x: 640,  y: 760, rot: 40,  s: .46, color: '#FFD60A', cyc: 15, delay: -8  },
  { x: 980,  y: 640, rot: -20, s: .36, color: '#64D2FF', cyc: 13, delay: -4  },
  { x: 420,  y: 430, rot: 55,  s: .30, color: '#30D158', cyc: 13, delay: -2  },
  { x: 1180, y: 780, rot: -45, s: .40, color: '#BF5AF2', cyc: 16, delay: -10 },
  { x: 90,   y: 470, rot: 25,  s: .33, color: '#FF9F0A', cyc: 14, delay: -7  },
];

function Splash({ dark }: { dark: boolean }) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"
    >
      {SPLATS.map((sp, i) => (
        <g key={i} transform={`translate(${sp.x} ${sp.y}) rotate(${sp.rot}) scale(${sp.s})`}>
          {/* Falling drop — accelerates into the impact point */}
          <circle
            className="wp-splat-drop"
            r="11" fill={sp.color} opacity="0"
            style={{ animation: `splatDrop ${sp.cyc}s linear ${sp.delay}s infinite` }}
          />
          {/* Splat body — squashes on impact, overshoots, settles */}
          <g
            className="wp-splat-body"
            fill={sp.color}
            opacity={dark ? .82 : .9}
            style={{
              animation: `splatBody ${sp.cyc}s linear ${sp.delay}s infinite`,
              transformBox: 'fill-box',
              transformOrigin: 'center',
            }}
          >
            <path d={SPLAT_PATHS[i % SPLAT_PATHS.length]} />
            <circle r="9" cx="118" cy="-40" />
            <circle r="5" cx="-124" cy="30" />
            <circle r="4" cx="70" cy="96" />
            <rect x="-7" y="48" width="14" height="70" rx="7" />
            <circle r="8" cx="0" cy="122" />
          </g>
          {/* Ejecta — droplets thrown out at impact */}
          {EJECTA.map((d, k) => (
            <circle
              key={k}
              className="wp-splat-ej"
              r="5" fill={sp.color} opacity="0"
              style={{
                animation: `splatEject ${sp.cyc}s ease-out ${sp.delay}s infinite`,
                ['--ex' as string]: `${d.x}px`,
                ['--ey' as string]: `${d.y}px`,
              } as React.CSSProperties}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

const SCENES: Record<WallpaperVariant, (p: { dark: boolean }) => React.ReactNode> = {
  mesh: Mesh, dunes: Dunes, blobs: Blobs, quiet: Quiet, bubbles: Bubbles, splash: Splash,
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
