'use client';
import { useState, useRef } from 'react';

// Selectable wallpapers, switchable from the ⌘ menu. All CSS/SVG,
// zero image assets. Each has a light and dark treatment.
export type WallpaperVariant = 'splash' | 'bubbles' | 'mesh';

export const WALLPAPERS: { id: WallpaperVariant; label: string }[] = [
  { id: 'splash',  label: 'Splash'  },
  { id: 'bubbles', label: 'Bubbles' },
  { id: 'mesh',    label: 'Mesh'    },
];

const BASES: Record<WallpaperVariant, { dark: string; light: string }> = {
  splash: {
    dark:  'linear-gradient(165deg, #141416 0%, #0e0e10 100%)',
    light: 'linear-gradient(165deg, #f8f8f6 0%, #f1f1ee 100%)',
  },
  bubbles: {
    dark:  'linear-gradient(180deg, #03121e 0%, #072a3f 60%, #0a3a52 100%)',
    light: 'linear-gradient(180deg, #e2f1f8 0%, #cfe7f2 55%, #c0dcEB 100%)',
  },
  mesh: {
    dark:  'linear-gradient(160deg, #070a1e 0%, #0d1130 50%, #0a0d26 100%)',
    light: 'linear-gradient(160deg, #e3ecfa 0%, #eef2fb 50%, #e6eefa 100%)',
  },
};

// Soft radial color spot used by the Mesh wallpaper
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
      {BUBBLES.map((b, i) => {
        // Invisible enlarged hit target (44px minimum) so small bubbles are
        // as easy to pop as big ones
        const hit = Math.max(b.size, 44);
        const pad = (hit - b.size) / 2;
        return (
          <button
            key={`${i}:${gen[i]}`}
            className="wp-bubble"
            tabIndex={-1}
            onClick={e => pop(i, e)}
            style={{
              position: 'absolute',
              left: `calc(${b.left} - ${pad}px)`,
              bottom: -(b.size + 24) - pad,
              width: hit, height: hit,
              borderRadius: '50%',
              padding: 0,
              background: 'transparent',
              border: 'none',
              pointerEvents: 'auto',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0,
              // Popped bubbles respawn quickly instead of waiting a full cycle
              animation: `bubbleRise ${b.dur}s linear ${gen[i] === 0 ? b.delay : 1 + (i % 4)}s infinite`,
              ['--sway' as string]: `${b.sway}px`,
            } as React.CSSProperties}
          >
            <span style={{
              display: 'block',
              width: b.size, height: b.size,
              borderRadius: '50%',
              background: dark
                ? 'radial-gradient(circle at 30% 30%, rgba(255,255,255,.32), rgba(160,220,255,.10) 45%, rgba(160,220,255,.03) 70%, transparent 100%)'
                : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,.85), rgba(120,170,220,.14) 45%, transparent 70%)',
              border: dark
                ? '1px solid rgba(190,230,255,.28)'
                : '1px solid rgba(110,160,210,.30)',
            }} />
          </button>
        );
      })}

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

// ── Splash: a living painting with real splat morphology. Research on drop
// impact (spreading → rim take-off into radial fingers → satellite droplets
// shed beyond finger tips) drives a procedural generator: every splat gets a
// unique seeded silhouette with fingers, satellites aligned to those fingers,
// ballistic ejecta that land and stay, and slow drips. Deterministic PRNG so
// server and client render identical shapes. ─────────────────────────────────

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Catmull-Rom smoothing over a closed ring of points → cubic bezier path.
// Long spokes between short neighbors smooth into finger-like tongues.
function smoothPath(pts: { x: number; y: number }[]) {
  const n = pts.length;
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d + 'Z';
}

function makeSplat(seed: number) {
  const rnd = mulberry32(seed);
  const spokes = 16 + Math.floor(rnd() * 6);
  const base = 34;
  const pts: { x: number; y: number }[] = [];
  const satellites: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < spokes; i++) {
    const ang = (i / spokes) * Math.PI * 2 + (rnd() - 0.5) * 0.28;
    let r = base * (0.72 + rnd() * 0.55);
    if (rnd() < 0.34) {
      // A finger: tongue with satellite droplets shed along its direction.
      // Surface tension rounds real finger ends into clubs, so cap the tip
      // with a droplet circle — no sharp points.
      r = base * (1.55 + rnd() * 1.15);
      satellites.push({
        x: Math.cos(ang) * (r - 2),
        y: Math.sin(ang) * (r - 2),
        r: 5.5 + rnd() * 3,
      });
      const nDrops = 1 + Math.floor(rnd() * 2);
      for (let k = 0; k < nDrops; k++) {
        const dist = r * (1.18 + rnd() * 0.55 + k * 0.3);
        const jitter = (rnd() - 0.5) * 0.18;
        satellites.push({
          x: Math.cos(ang + jitter) * dist,
          y: Math.sin(ang + jitter) * dist,
          r: Math.max(1.6, 6.5 - k * 2 - rnd() * 2),
        });
      }
    }
    pts.push({ x: Math.cos(ang) * r, y: Math.sin(ang) * r });
  }
  return { path: smoothPath(pts), satellites };
}

function makeEjecta(seed: number) {
  const rnd = mulberry32(seed * 31 + 7);
  return Array.from({ length: 5 + Math.floor(rnd() * 3) }, () => {
    const ang = rnd() * Math.PI * 2;
    const dist = 70 + rnd() * 90;
    return {
      ex:   Math.cos(ang) * dist,
      up:   -(24 + rnd() * 50),
      down: 18 + rnd() * 46,
      r:    2.5 + rnd() * 3.2,
    };
  });
}

const SPLATS = [
  { x: 150,  y: 180, rot: -12, s: .52, color: '#0A84FF', cyc: 13, delay: -1,  drip: true  },
  { x: 1290, y: 210, rot: 30,  s: .45, color: '#FF375F', cyc: 15, delay: -6,  drip: false },
  { x: 520,  y: 120, rot: 70,  s: .34, color: '#FFD60A', cyc: 12, delay: -9,  drip: false },
  { x: 1060, y: 140, rot: -35, s: .38, color: '#30D158', cyc: 16, delay: -3,  drip: true  },
  { x: 260,  y: 700, rot: 15,  s: .50, color: '#BF5AF2', cyc: 14, delay: -11, drip: false },
  { x: 760,  y: 240, rot: -60, s: .30, color: '#FF375F', cyc: 17, delay: -13, drip: false },
  { x: 1340, y: 520, rot: 8,   s: .42, color: '#0A84FF', cyc: 12, delay: -5,  drip: true  },
  { x: 640,  y: 760, rot: 40,  s: .46, color: '#FFD60A', cyc: 15, delay: -8,  drip: false },
  { x: 980,  y: 640, rot: -20, s: .36, color: '#64D2FF', cyc: 13, delay: -4,  drip: false },
  { x: 420,  y: 430, rot: 55,  s: .30, color: '#30D158', cyc: 13, delay: -2,  drip: false },
  { x: 1180, y: 780, rot: -45, s: .40, color: '#BF5AF2', cyc: 16, delay: -10, drip: false },
  { x: 90,   y: 470, rot: 25,  s: .33, color: '#FF9F0A', cyc: 14, delay: -7,  drip: true  },
].map((sp, i) => ({
  ...sp,
  ...makeSplat(i * 7919 + 13),
  ejecta: makeEjecta(i * 104729 + 5),
}));

function Splash({ dark }: { dark: boolean }) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"
    >
      {SPLATS.map((sp, i) => (
        <g key={i} transform={`translate(${sp.x} ${sp.y}) scale(${sp.s})`}>
          {/* Falling drop — stretched by drag, accelerating under gravity */}
          <circle
            className="wp-splat-drop"
            r="11" fill={sp.color} opacity="0"
            style={{ animation: `splatDrop ${sp.cyc}s linear ${sp.delay}s infinite` }}
          />
          {/* Impact ripple */}
          <circle
            className="wp-splat-ring"
            r="26" fill="none" stroke={sp.color} strokeWidth="3" opacity="0"
            style={{
              animation: `splatRing ${sp.cyc}s linear ${sp.delay}s infinite`,
              transformBox: 'fill-box', transformOrigin: 'center',
            }}
          />
          {/* Splat body — unique procedural silhouette, squash on impact.
              Rotation on a wrapper so the drip below stays screen-down. */}
          <g transform={`rotate(${sp.rot})`}>
            <g
              className="wp-splat-body"
              fill={sp.color}
              opacity={dark ? .82 : .9}
              style={{
                animation: `splatBody ${sp.cyc}s linear ${sp.delay}s infinite`,
                transformBox: 'fill-box', transformOrigin: 'center',
              }}
            >
              <path d={sp.path} />
              {sp.satellites.map((d, k) => (
                <circle key={k} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={d.r.toFixed(1)} />
              ))}
            </g>
          </g>
          {/* Slow drip running down the canvas */}
          {sp.drip && (
            <g
              className="wp-splat-drip"
              fill={sp.color} opacity={dark ? .8 : .88}
              style={{
                animation: `splatDrip ${sp.cyc}s linear ${sp.delay}s infinite`,
                transformBox: 'fill-box', transformOrigin: 'center top',
              }}
            >
              <rect x="-3.5" y="12" width="7" height="82" rx="3.5" />
              <circle cx="0" cy="98" r="6" />
            </g>
          )}
          {/* Ballistic ejecta: outer element carries horizontal motion, inner
              carries the up-then-down arc — droplets land and stay */}
          {sp.ejecta.map((d, k) => (
            <g
              key={k}
              className="wp-splat-ejx"
              style={{
                animation: `splatEjX ${sp.cyc}s linear ${sp.delay}s infinite`,
                ['--ex' as string]: `${d.ex.toFixed(0)}px`,
              } as React.CSSProperties}
            >
              <circle
                className="wp-splat-ejy"
                r={d.r.toFixed(1)} fill={sp.color} opacity="0"
                style={{
                  animation: `splatEjY ${sp.cyc}s linear ${sp.delay}s infinite`,
                  ['--up' as string]: `${d.up.toFixed(0)}px`,
                  ['--down' as string]: `${d.down.toFixed(0)}px`,
                } as React.CSSProperties}
              />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

const SCENES: Record<WallpaperVariant, (p: { dark: boolean }) => React.ReactNode> = {
  splash: Splash, bubbles: Bubbles, mesh: Mesh,
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
