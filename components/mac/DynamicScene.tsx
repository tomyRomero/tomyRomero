'use client';
import { useCallback, useEffect, useState } from 'react';
import ShaderWallpaper from './wallpapers/ShaderWallpaper';
import { DYNAMIC_FS } from './wallpapers/dynamicShader';
import { hexRGB } from './wallpapers/gl';

// Dynamic wallpaper: the sky follows the local time. The shader
// (wallpapers/dynamicShader.ts) draws it; this SVG is the fallback without WebGL2.
// ?hour=18.5 previews a time of day.

type Key = {
  h: number;
  sky: [string, string, string];            // top, middle, horizon
  hills: [string, string, string, string];  // far → near
  glow: string; glowA: number;              // warm light around the sun
  night: number;                            // star + moon visibility
  cloud: string; cloudA: number;
  sun: string;
  mist: number;                             // valley mist, strongest at dawn
};

const KEYS: Key[] = [
  { h: 0,     sky: ['#070b1f', '#0f1838', '#1d2a55'], hills: ['#1a2449', '#141c3a', '#0f1630', '#0a0f22'], glow: '#3a4a8a', glowA: 0,   night: 1,  cloud: '#5a6690', cloudA: .10, sun: '#fff1d0', mist: .22 },
  { h: 4.75,  sky: ['#0a0f28', '#151f47', '#2a3466'], hills: ['#1f2850', '#172042', '#111834', '#0b1024'], glow: '#6a5a9a', glowA: .1,  night: .95, cloud: '#5a6690', cloudA: .10, sun: '#fff1d0', mist: .3 },
  { h: 5.9,   sky: ['#1b2350', '#3a3f7a', '#9a7aa6'], hills: ['#4a4a7a', '#383a66', '#2a2d52', '#1c1f3d'], glow: '#e89a8a', glowA: .35, night: .5, cloud: '#b8a0c0', cloudA: .30, sun: '#ffd6a0', mist: .62 },
  { h: 6.9,   sky: ['#3d5a9a', '#9a96c4', '#f9bd8e'], hills: ['#9384ab', '#716893', '#514e7a', '#35375c'], glow: '#ffae6e', glowA: 1,   night: 0,  cloud: '#ffd2c0', cloudA: .60, sun: '#ffd79a', mist: .78 },
  { h: 8.5,   sky: ['#5b95d6', '#9cc3e8', '#f1dcc0'], hills: ['#9fb6cc', '#7aa084', '#58905f', '#3d7047'], glow: '#ffe0b0', glowA: .35, night: 0,  cloud: '#ffffff', cloudA: .70, sun: '#fff6df', mist: .5 },
  { h: 12.5,  sky: ['#3f86d8', '#7fb5ea', '#cfe6f7'], hills: ['#a2bdd6', '#78aa84', '#539560', '#377245'], glow: '#fff4d6', glowA: .15, night: 0,  cloud: '#ffffff', cloudA: .80, sun: '#fffaf0', mist: .06 },
  { h: 16,    sky: ['#4a86cf', '#8dbbe6', '#efe0c2'], hills: ['#aebbc8', '#86a67c', '#62935a', '#436e40'], glow: '#ffd9a0', glowA: .35, night: 0,  cloud: '#fffaf2', cloudA: .75, sun: '#fff1d6', mist: .08 },
  { h: 18.4,  sky: ['#3a4f8f', '#b27d9c', '#ffae70'], hills: ['#9c7288', '#7c5a75', '#58445f', '#3b3048'], glow: '#ff8a4c', glowA: 1,   night: 0,  cloud: '#ffbfa6', cloudA: .65, sun: '#ffc27a', mist: .2 },
  { h: 19.5,  sky: ['#1c2250', '#4b3f78', '#b0687a'], hills: ['#4d3f68', '#3a3156', '#2a2544', '#1c1a33'], glow: '#d0607a', glowA: .5,  night: .45, cloud: '#9a7090', cloudA: .30, sun: '#ffb070', mist: .32 },
  { h: 21,    sky: ['#0a1026', '#131d42', '#26306a'], hills: ['#1c2450', '#151c3e', '#10162f', '#0a0f22'], glow: '#3a4a8a', glowA: 0,   night: 1,  cloud: '#5a6690', cloudA: .10, sun: '#fff1d0', mist: .26 },
];

const rgb = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const A = rgb(a), B = rgb(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0'));
  return `#${c.join('')}`;
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function frame(t: number) {
  let i = KEYS.findIndex(k => k.h > t);
  if (i === -1) i = 0;
  const k0 = KEYS[(i - 1 + KEYS.length) % KEYS.length], k1 = KEYS[i];
  const h1 = k1.h <= k0.h ? k1.h + 24 : k1.h;
  const raw = (t - k0.h) / (h1 - k0.h);
  const f = raw * raw * (3 - 2 * raw);   // ease between keyframes
  return {
    sky:    k0.sky.map((c, j) => mix(c, k1.sky[j], f)),
    hills:  k0.hills.map((c, j) => mix(c, k1.hills[j], f)),
    glow:   mix(k0.glow, k1.glow, f),  glowA:  lerp(k0.glowA, k1.glowA, f),
    night:  lerp(k0.night, k1.night, f),
    cloud:  mix(k0.cloud, k1.cloud, f), cloudA: lerp(k0.cloudA, k1.cloudA, f),
    sun:    mix(k0.sun, k1.sun, f),
    mist:   lerp(k0.mist, k1.mist, f),
  };
}

function hourNow() {
  const q = new URLSearchParams(window.location.search).get('hour');
  if (q !== null && !isNaN(Number(q))) return ((Number(q) % 24) + 24) % 24;
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
}

// Deterministic starfield (same on every render)
const STARS = (() => {
  let s = 20240929;
  const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  return Array.from({ length: 90 }, (_, i) => ({
    x: r() * 1440, y: r() * 470, r: .6 + r() * 1.1, tw: i % 3 === 0, d: r() * 6,
  }));
})();

// Clouds drift ±50vw and fade at the ends so the loop doesn't jump
const CLOUDS = [
  { left: '8%',  top: '12%', w: 340, dur: 420, delay: -150 },
  { left: '55%', top: '24%', w: 220, dur: 360, delay: -250 },
  { left: '30%', top: '7%',  w: 260, dur: 480, delay: -90  },
  { left: '78%', top: '33%', w: 180, dur: 300, delay: -200 },
];

const HORIZON = 560;
const HILLS = [
  'M0,560 C180,520 320,530 460,548 C620,568 760,520 920,512 C1080,504 1220,540 1440,528 L1440,900 L0,900Z',
  'M0,640 C140,600 300,590 420,612 C560,638 680,650 820,622 C960,594 1100,580 1240,604 C1340,620 1400,626 1440,618 L1440,900 L0,900Z',
  'M0,720 C160,690 280,668 440,684 C600,700 700,742 880,730 C1040,720 1160,676 1300,672 C1380,670 1420,680 1440,684 L1440,900 L0,900Z',
  'M0,806 C200,776 360,764 520,786 C700,810 860,824 1040,800 C1200,780 1340,774 1440,782 L1440,900 L0,900Z',
];

// Live oak: a broad, billowing crown on a short, thick trunk
function Oak({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <path d="M-5,2 L-4,-24 L-14,-34 L-10,-36 L-1,-28 L4,-38 L8,-36 L4,-24 L5,2Z" />
      <circle cx="-26" cy="-36" r="15" />
      <circle cx="-10" cy="-48" r="19" />
      <circle cx="12"  cy="-50" r="20" />
      <circle cx="30"  cy="-38" r="15" />
      <circle cx="2"   cy="-36" r="18" />
      <circle cx="-38" cy="-30" r="9" />
      <circle cx="42"  cy="-31" r="9" />
    </g>
  );
}

// Sun rises at 6:30 and sets at 19:00; the moon uses the same path.
// Coordinates are in a 1440×900 design space.
function arcs(t: number) {
  const sp = (t - 6.5) / 12.5;
  const sun = { x: 100 + sp * 1240, y: HORIZON - Math.sin(sp * Math.PI) * 430 };
  const mp = (((t - 19.3) % 24) + 24) % 24 / 11.4;
  const moonUp = mp >= 0 && mp <= 1;
  const moon = { x: 100 + mp * 1240, y: HORIZON - Math.sin(mp * Math.PI) * 380 };
  return { sun, moon, moonUp };
}

export default function DynamicScene({ dark }: { dark: boolean }) {
  const [t, setT] = useState(hourNow);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setT(hourNow()), 60_000);
    return () => clearInterval(id);
  }, []);

  const f = frame(t);
  // The shader's y runs up from the bottom and x from the center
  const uniforms = useCallback(() => {
    const { sun, moon, moonUp } = arcs(t);
    return {
      uSkyTop: hexRGB(f.sky[0]), uSkyMid: hexRGB(f.sky[1]), uSkyHor: hexRGB(f.sky[2]),
      uHill0: hexRGB(f.hills[0]), uHill1: hexRGB(f.hills[1]), uHill2: hexRGB(f.hills[2]), uHill3: hexRGB(f.hills[3]),
      uGlow: hexRGB(f.glow), uGlowA: f.glowA,
      uNight: f.night,
      uCloud: hexRGB(f.cloud), uCloudA: f.cloudA,
      uSun: hexRGB(f.sun), uSunPos: [sun.x - 720, 900 - sun.y],
      uMoonPos: [moon.x - 720, 900 - moon.y], uMoonA: moonUp ? Math.min(1, f.night * 1.2) : 0,
      uMist: f.mist,
      uDim: dark ? 1 : 0,
    };
    // f is derived from t
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, dark]);

  return (
    <>
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, ${f.sky[0]} 0%, ${f.sky[1]} 45%, ${f.sky[2]} 68%, ${f.hills[1]} 68%, ${f.hills[3]} 100%)`,
        filter: dark ? 'brightness(.72)' : undefined,
      }} />
      {failed
        ? <DynamicSVG dark={dark} t={t} />
        : <ShaderWallpaper frag={DYNAMIC_FS} uniforms={uniforms} fps={24} maxDpr={1.5} maxPixels={2.6e6} onFail={() => setFailed(true)} />}
    </>
  );
}

function DynamicSVG({ dark, t }: { dark: boolean; t: number }) {
  const f = frame(t);

  const { sun, moon, moonUp } = arcs(t);

  return (
    <>
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true"
      >
        <defs>
          <linearGradient id="dyn-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"   stopColor={f.sky[0]} />
            <stop offset=".45" stopColor={f.sky[1]} />
            <stop offset=".68" stopColor={f.sky[2]} />
          </linearGradient>
          <radialGradient id="dyn-glow" cx={sun.x} cy={HORIZON} r="760" gradientUnits="userSpaceOnUse"
            gradientTransform={`translate(${sun.x} ${HORIZON}) scale(1 .42) translate(${-sun.x} ${-HORIZON})`}>
            <stop offset="0"   stopColor={f.glow} stopOpacity={.85 * f.glowA} />
            <stop offset=".5"  stopColor={f.glow} stopOpacity={.25 * f.glowA} />
            <stop offset="1"   stopColor={f.glow} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dyn-sun">
            <stop offset="0"   stopColor={f.sun} />
            <stop offset=".22" stopColor={f.sun} />
            <stop offset=".3"  stopColor={f.sun} stopOpacity=".35" />
            <stop offset="1"   stopColor={f.sun} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dyn-moon-glow">
            <stop offset="0"  stopColor="#dfe6ff" stopOpacity=".22" />
            <stop offset="1"  stopColor="#dfe6ff" stopOpacity="0" />
          </radialGradient>
          <mask id="dyn-crescent">
            <circle cx={moon.x} cy={moon.y} r="17" fill="#fff" />
            <circle cx={moon.x + 8} cy={moon.y - 5} r="15" fill="#000" />
          </mask>
          {f.hills.map((c, i) => (
            <linearGradient key={i} id={`dyn-hill-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={mix(c, f.sky[2], .22 - i * .05)} />
              <stop offset=".5" stopColor={c} />
            </linearGradient>
          ))}
        </defs>

        <rect width="1440" height="900" fill="url(#dyn-sky)" />

        {f.night > .02 && (
          <g opacity={f.night}>
            {STARS.map((s, i) => (
              <circle
                key={i} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} r={s.r.toFixed(2)} fill="#fff"
                opacity={.35 + s.r * .35}
                style={s.tw ? { animation: `twinkle ${3 + (i % 4)}s ease-in-out ${-s.d}s infinite` } : undefined}
              />
            ))}
          </g>
        )}

        <rect width="1440" height="900" fill="url(#dyn-glow)" />

        <circle cx={sun.x} cy={sun.y} r="120" fill="url(#dyn-sun)" />

        {moonUp && (
          <g opacity={Math.min(1, f.night * 1.2)}>
            <circle cx={moon.x} cy={moon.y} r="70" fill="url(#dyn-moon-glow)" />
            <circle cx={moon.x} cy={moon.y} r="17" fill="#eef1ff" mask="url(#dyn-crescent)" />
          </g>
        )}

        {HILLS.map((d, i) => (
          <g key={i}>
            <path d={d} fill={`url(#dyn-hill-${i})`} />
            {i === 2 && (
              <>
                <Oak x={250}  y={684} s={.72} fill={f.hills[2]} />
                <Oak x={312}  y={678} s={.5}  fill={f.hills[2]} />
                <Oak x={1216} y={678} s={.8}  fill={f.hills[2]} />
              </>
            )}
            {i === 1 && <Oak x={1010} y={596} s={.4} fill={f.hills[1]} />}
          </g>
        ))}
      </svg>

      {f.cloudA > .02 && CLOUDS.map((c, i) => (
        <div key={i} aria-hidden="true" style={{
          position: 'absolute', left: c.left, top: c.top, width: c.w, height: c.w * .34,
          opacity: f.cloudA, pointerEvents: 'none',
        }}>
          <div style={{ position: 'absolute', inset: 0, animation: `cloudDrift ${c.dur}s linear ${c.delay}s infinite` }}>
            {[[0, 30, 60, 70], [22, 0, 50, 100], [52, 18, 48, 82]].map(([l, tp, w, h], k) => (
              <span key={k} style={{
                position: 'absolute', left: `${l}%`, top: `${tp}%`, width: `${w}%`, height: `${h}%`,
                borderRadius: '50%',
                background: `radial-gradient(ellipse at center, ${f.cloud} 0%, ${f.cloud}cc 35%, transparent 70%)`,
                filter: 'blur(6px)',
              }} />
            ))}
          </div>
        </div>
      ))}

      {/* Dim overlay in dark mode */}
      {dark && <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,8,20,.28)', pointerEvents: 'none' }} />}
    </>
  );
}
