'use client';
import { useState, useRef, useCallback } from 'react';
import DynamicScene from './DynamicScene';
import ShaderWallpaper from './wallpapers/ShaderWallpaper';
import { BUBBLES_FS } from './wallpapers/bubblesShader';
import { hexRGB } from './wallpapers/gl';
import SplashPaint from './wallpapers/SplashPaint';

// Dynamic, Bubbles and Splash are WebGL shaders with SVG/CSS fallbacks; Mesh is CSS
import type { WallpaperVariant } from './wallpaperList';
export { WALLPAPERS, type WallpaperVariant } from './wallpaperList';

const BASES: Record<WallpaperVariant, { dark: string; light: string }> = {
  splash: {
    dark:  'linear-gradient(165deg, #141416 0%, #0e0e10 100%)',
    light: 'linear-gradient(165deg, #f8f8f6 0%, #f1f1ee 100%)',
  },
  // Shown until the shader fades in
  bubbles: {
    dark:  'linear-gradient(180deg, #0f4f6e 0%, #0a2f4a 45%, #030e1b 100%)',
    light: 'linear-gradient(180deg, #b8eef5 0%, #4fb8d0 45%, #13628a 100%)',
  },
  mesh: {
    dark:  'linear-gradient(160deg, #070a1e 0%, #0d1130 50%, #0a0d26 100%)',
    light: 'linear-gradient(160deg, #e3ecfa 0%, #eef2fb 50%, #e6eefa 100%)',
  },
  // The scene paints its own sky; this only shows for a frame on load
  dynamic: {
    dark:  'linear-gradient(180deg, #0f1838 0%, #1d2a55 100%)',
    light: 'linear-gradient(180deg, #7fb5ea 0%, #cfe6f7 100%)',
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

// Mesh
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

// Bubbles: the water is a shader; the bubbles are buttons rendered inside the
// window canvas, below windows. Deterministic so SSR and client match.
const BUBBLES = [
  { left: '5%',  size: 48, dur: 14,   delay: 0,    sway: 34  },
  { left: '12%', size: 20, dur: 19,   delay: 3,    sway: -22 },
  { left: '19%', size: 66, dur: 12,   delay: 6.5,  sway: 26  },
  { left: '27%', size: 14, dur: 21,   delay: 1.5,  sway: -16 },
  { left: '34%', size: 36, dur: 16,   delay: 9,    sway: 30  },
  { left: '41%', size: 24, dur: 18,   delay: 4,    sway: -24 },
  { left: '49%', size: 56, dur: 13,   delay: 11,   sway: 20  },
  { left: '56%', size: 12, dur: 22,   delay: 7,    sway: 14  },
  { left: '63%', size: 42, dur: 15,   delay: 2,    sway: -32 },
  { left: '70%', size: 18, dur: 20,   delay: 12.5, sway: 22  },
  { left: '77%', size: 60, dur: 12.5, delay: 5,    sway: -20 },
  { left: '84%', size: 28, dur: 17,   delay: 8,    sway: 28  },
  { left: '91%', size: 44, dur: 14.5, delay: 13,   sway: -26 },
  { left: '96%', size: 16, dur: 21,   delay: 10,   sway: 12  },
];

// Pop: droplets thrown in a ring, plus a few tiny bubbles set free
const POP_DROPS = Array.from({ length: 10 }, (_, k) => {
  const a = (k / 10) * Math.PI * 2 + (k % 2 ? .18 : -.12);
  const r = 34 + (k % 3) * 9;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r, s: 3 + (k % 3) };
});
const POP_MICRO = [{ x: -8, y: -46, s: 5 }, { x: 10, y: -62, s: 4 }, { x: -2, y: -78, s: 3 }, { x: 14, y: -38, s: 3 }];

function BubbleGlass({ size, dark }: { size: number; dark: boolean }) {
  return (
    <span className="wp-bubble-glass" style={{
      position: 'relative', display: 'block', width: size, height: size, borderRadius: '50%',
      background: dark
        ? 'radial-gradient(circle at 50% 55%, rgba(120,210,255,.05) 0%, rgba(120,210,255,.08) 55%, rgba(170,230,255,.32) 84%, rgba(220,245,255,.7) 97%, rgba(220,245,255,0) 100%)'
        : 'radial-gradient(circle at 50% 55%, rgba(255,255,255,.08) 0%, rgba(255,255,255,.1) 55%, rgba(255,255,255,.42) 84%, rgba(255,255,255,.95) 97%, rgba(255,255,255,0) 100%)',
      boxShadow: dark ? '0 0 14px rgba(110,220,255,.18)' : '0 4px 14px rgba(10,70,110,.12)',
    }}>
      <span className="wp-bubble-film" style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'conic-gradient(from 0deg, rgba(255,80,170,.55), rgba(80,200,255,.5), rgba(255,230,90,.5), rgba(90,255,170,.5), rgba(170,110,255,.55), rgba(255,80,170,.55))',
        WebkitMask: 'radial-gradient(circle, transparent 74%, #000 88%, transparent 100%)',
        mask: 'radial-gradient(circle, transparent 74%, #000 88%, transparent 100%)',
        opacity: dark ? .45 : .6,
      }} />
      <span style={{
        position: 'absolute', left: '17%', top: '13%', width: '40%', height: '24%', borderRadius: '50%',
        transform: 'rotate(-32deg)',
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,.95) 0%, rgba(255,255,255,.5) 40%, rgba(255,255,255,0) 72%)',
      }} />
      <span style={{
        position: 'absolute', right: '18%', bottom: '14%', width: '18%', height: '11%', borderRadius: '50%',
        transform: 'rotate(-32deg)',
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,.6), rgba(255,255,255,0) 70%)',
      }} />
    </span>
  );
}

export function BubbleField({ dark }: { dark: boolean }) {
  // Bumping gen[i] remounts a popped bubble at the bottom
  const [gen, setGen] = useState<number[]>(() => BUBBLES.map(() => 0));
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const burstId = useRef(0);

  const pop = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const glass = e.currentTarget.querySelector('.wp-bubble-glass') ?? e.currentTarget;
    const r = glass.getBoundingClientRect();
    const id = ++burstId.current;
    // The canvas starts 28px below the viewport top
    setBursts(b => [...b, { id, x: r.left + r.width / 2, y: r.top - 28 + r.height / 2, size: r.width }]);
    setGen(g => g.map((v, j) => (j === i ? v + 1 : v)));
    setTimeout(() => setBursts(b => b.filter(x => x.id !== id)), 900);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} aria-hidden="true">
      {BUBBLES.map((b, i) => {
        // 44px minimum hit target
        const hit = Math.max(b.size, 44);
        const pad = (hit - b.size) / 2;
        const wobble = 1.1 + (70 - b.size) / 60;
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
              padding: 0, background: 'transparent', border: 'none',
              pointerEvents: 'auto', cursor: 'pointer',
              opacity: 0,
              // Popped bubbles respawn quickly instead of waiting a full cycle
              animation: `bubbleRise ${b.dur}s linear ${gen[i] === 0 ? b.delay : 1 + (i % 4)}s infinite`,
            }}
          >
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%',
              animation: `bubbleSway ${(b.dur / 3).toFixed(2)}s ease-in-out ${-(i % 5)}s infinite alternate`,
              ['--sway' as string]: `${b.sway}px`,
            } as React.CSSProperties}>
              <span style={{
                display: 'block',
                animation: `bubbleWobble ${wobble.toFixed(2)}s ease-in-out ${-(i % 3) * .4}s infinite alternate`,
                ['--wob' as string]: String(Math.min(.07, b.size / 900)),
              } as React.CSSProperties}>
                <BubbleGlass size={b.size} dark={dark} />
              </span>
            </span>
          </button>
        );
      })}

      {bursts.map(b => (
        <div key={b.id} style={{ position: 'absolute', left: b.x, top: b.y, width: 0, height: 0, zIndex: 3 }}>
          <div style={{
            position: 'absolute', left: -b.size / 2, top: -b.size / 2, width: b.size, height: b.size, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,.7), rgba(255,255,255,0) 70%)',
            animation: 'bubbleFlash .22s ease-out both',
          }} />
          <div style={{
            position: 'absolute', left: -b.size / 2, top: -b.size / 2,
            width: b.size, height: b.size, borderRadius: '50%',
            border: dark ? '1.5px solid rgba(200,240,255,.8)' : '1.5px solid rgba(255,255,255,.95)',
            animation: 'bubblePopRing .42s cubic-bezier(.2,.7,.3,1) both',
          }} />
          {POP_DROPS.map((d, k) => (
            <div key={k} style={{
              position: 'absolute', left: -d.s / 2, top: -d.s / 2, width: d.s, height: d.s,
              borderRadius: '50%',
              background: dark ? 'rgba(210,245,255,.9)' : 'rgba(255,255,255,.95)',
              boxShadow: dark ? '0 0 6px rgba(120,220,255,.6)' : '0 1px 3px rgba(10,70,110,.25)',
              animation: `bubblePopDrop .55s cubic-bezier(.15,.8,.3,1) ${k * 8}ms both`,
              ['--dx' as string]: `${(d.x * (b.size / 44)).toFixed(1)}px`,
              ['--dy' as string]: `${(d.y * (b.size / 44)).toFixed(1)}px`,
            } as React.CSSProperties} />
          ))}
          {POP_MICRO.map((m, k) => (
            <div key={`m${k}`} style={{
              position: 'absolute', left: m.x - m.s / 2, top: -m.s / 2, width: m.s, height: m.s, borderRadius: '50%',
              border: dark ? '1px solid rgba(200,240,255,.8)' : '1px solid rgba(255,255,255,.95)',
              animation: `bubbleMicro .85s ease-out ${60 + k * 40}ms both`,
              ['--my' as string]: `${m.y}px`,
            } as React.CSSProperties} />
          ))}
        </div>
      ))}
    </div>
  );
}

const BUBBLE_WATER = {
  light: { uTop: '#b8eef5', uMid: '#4fb8d0', uDeep: '#13628a', uRay: '#ffffff', uSand: '#d9cda4', uGrass: '#1f6b5a', uSnow: '#ffffff' },
  dark:  { uTop: '#0f4f6e', uMid: '#0a2f4a', uDeep: '#030e1b', uRay: '#7fd4ff', uSand: '#1d3140', uGrass: '#0a2a2c', uSnow: '#6ff7ff' },
};

function Bubbles({ dark }: { dark: boolean }) {
  const [failed, setFailed] = useState(false);
  const uniforms = useCallback(() => {
    const pal = BUBBLE_WATER[dark ? 'dark' : 'light'];
    return { ...Object.fromEntries(Object.entries(pal).map(([k, v]) => [k, hexRGB(v)])), uDark: dark ? 1 : 0 };
  }, [dark]);
  if (failed) return null;
  return <ShaderWallpaper frag={BUBBLES_FS} uniforms={uniforms} fps={30} maxDpr={1.25} maxPixels={2.4e6} onFail={() => setFailed(true)} />;
}

// Splash SVG fallback: seeded procedural splats so server and client match

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Catmull-Rom through a closed ring of points, as cubic beziers
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
      // A finger with satellite droplets and a rounded tip
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

// Fallback without WebGL2
function SplashSVG({ dark }: { dark: boolean }) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"
    >
      {SPLATS.map((sp, i) => (
        <g key={i} transform={`translate(${sp.x} ${sp.y}) scale(${sp.s})`}>
          <circle
            className="wp-splat-drop"
            r="11" fill={sp.color} opacity="0"
            style={{ animation: `splatDrop ${sp.cyc}s linear ${sp.delay}s infinite` }}
          />
          <circle
            className="wp-splat-ring"
            r="26" fill="none" stroke={sp.color} strokeWidth="3" opacity="0"
            style={{
              animation: `splatRing ${sp.cyc}s linear ${sp.delay}s infinite`,
              transformBox: 'fill-box', transformOrigin: 'center',
            }}
          />
          {/* Rotation is on a wrapper so the drip stays vertical */}
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
          {/* Outer element moves horizontally, inner does the arc */}
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

// The painting itself is WebGL (wallpapers/SplashPaint.tsx)
function Splash({ dark }: { dark: boolean }) {
  const [failed, setFailed] = useState(false);
  return failed ? <SplashSVG dark={dark} /> : <SplashPaint dark={dark} onFail={() => setFailed(true)} />;
}

const SCENES: Record<WallpaperVariant, (p: { dark: boolean }) => React.ReactNode> = {
  splash: Splash, bubbles: Bubbles, mesh: Mesh, dynamic: DynamicScene,
};

export default function Wallpaper({ dark, variant }: { dark: boolean; variant: WallpaperVariant }) {
  const Scene = SCENES[variant];
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden',
      background: BASES[variant][dark ? 'dark' : 'light'],
      animation: 'introFade .6s ease both',
    }}>
      <Scene dark={dark} />

      <div style={{
        position: 'absolute', inset: 0,
        opacity: dark ? 0.035 : 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '180px 180px',
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 55%, ${dark ? 'rgba(0,0,0,.42)' : 'rgba(20,30,50,.06)'} 100%)`,
        pointerEvents: 'none',
      }} />
    </div>
  );
}
