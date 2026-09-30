'use client';
import { useState, useEffect, useSyncExternalStore } from 'react';
import { T } from './tokens';
import { WidgetFrame, S, GAP, M } from './widgets/WidgetFrame';
import { WIDGET_ROW } from './winTypes';
import CalendarWidget from './widgets/CalendarWidget';
import WeatherWidget from './widgets/WeatherWidget';
import PhotosWidget from './widgets/PhotosWidget';

// Bundled with the widgets so opening one never waits on a download
export { default as PhotosWindow } from './windows/PhotosWindow';
export { default as WeatherWindow } from './windows/WeatherWindow';
export { WeatherWidget, PhotosWidget };

// Analog clock
// Rounded so server and client sin/cos agree
const r2 = (n: number) => Math.round(n * 100) / 100;

function AnalogClock({ dark }: { dark: boolean }) {
  const tk   = T(dark);
  // Hands render after mount (the server's time isn't the visitor's)
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h  = (now?.getHours() ?? 0) % 12;
  const m  = now?.getMinutes() ?? 0;
  const s  = now?.getSeconds() ?? 0;

  const hourDeg   = h * 30 + m * 0.5;
  const minuteDeg = m * 6  + s * 0.1;
  const secondDeg = s * 6;

  const cx = 75;
  const cy = 75;
  const R  = 66;

  const hourTicks = Array.from({ length: 12 }, (_, i) => {
    const rad = (i * 30) * (Math.PI / 180);
    return {
      x1: r2(cx + (R - 9) * Math.sin(rad)),
      y1: r2(cy - (R - 9) * Math.cos(rad)),
      x2: r2(cx + R        * Math.sin(rad)),
      y2: r2(cy - R        * Math.cos(rad)),
    };
  });

  const minTicks = Array.from({ length: 60 }, (_, i) => {
    if (i % 5 === 0) return null;
    const rad = (i * 6) * (Math.PI / 180);
    return {
      x1: r2(cx + (R - 4.5) * Math.sin(rad)),
      y1: r2(cy - (R - 4.5) * Math.cos(rad)),
      x2: r2(cx + R          * Math.sin(rad)),
      y2: r2(cy - R          * Math.cos(rad)),
    };
  });

  const hand = (angleDeg: number, length: number) => ({
    x2: cx + length * Math.sin(angleDeg * Math.PI / 180),
    y2: cy - length * Math.cos(angleDeg * Math.PI / 180),
  });

  const faceColor  = dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.028)';
  const tickColor  = dark ? 'rgba(255,255,255,.24)'   : 'rgba(0,0,0,.22)';
  const minColor   = dark ? 'rgba(255,255,255,.10)'   : 'rgba(0,0,0,.10)';
  const handColor  = dark ? '#f0f0f5'                 : '#1a1a1e';

  const { x2: hx, y2: hy } = hand(hourDeg,   42);
  const { x2: mx, y2: my } = hand(minuteDeg, 56);
  const { x2: sx, y2: sy } = hand(secondDeg, 60);

  return (
    <svg
      width="150" height="150"
      viewBox="0 0 150 150"
      style={{ display: 'block', margin: '0 auto' }}
    >
      <circle cx={cx} cy={cy} r={R + 3} fill={faceColor} />
      <circle cx={cx} cy={cy} r={R + 3} fill="none"
        stroke={dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)'} strokeWidth="1" />

      {minTicks.map((t, i) => t && (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={minColor} strokeWidth="1" strokeLinecap="round" />
      ))}

      {hourTicks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={tickColor} strokeWidth="2.2" strokeLinecap="round" />
      ))}

      {now && <>
      <line x1={cx} y1={cy} x2={hx} y2={hy}
        stroke={handColor} strokeWidth="3.2" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={mx} y2={my}
        stroke={handColor} strokeWidth="2" strokeLinecap="round" />

      <line x1={cx} y1={cy} x2={sx} y2={sy}
        stroke={tk.accent} strokeWidth="1.2" strokeLinecap="round" />
      <line
        x1={cx} y1={cy}
        x2={cx - (sx - cx) * 0.22}
        y2={cy - (sy - cy) * 0.22}
        stroke={tk.accent} strokeWidth="1.2" strokeLinecap="round"
      />
      </>}

      <circle cx={cx} cy={cy} r="3.5" fill={tk.accent} />
      <circle cx={cx} cy={cy} r="1.5" fill={handColor} />
    </svg>
  );
}

// 2×2 grid at macOS sizes, scaled down on smaller screens
const GRID_H = S * 2 + GAP;
const ROW_W  = S * 4 + GAP * 3;
const MIN_K  = 0.72;

const subscribe = (cb: () => void) => { window.addEventListener('resize', cb); return () => window.removeEventListener('resize', cb); };
const viewport  = () => `${window.innerWidth}x${window.innerHeight}`;

function scaleFor(vw: number, vh: number) {
  const room = vh - 183;                  // under the menu bar, above the dock
  const side = (vw / 2 - 222) / M;        // clear of the centered About window
  return Math.max(MIN_K, Math.min(1, room / GRID_H, side));
}

// row: one line across the top, for portrait tablets
export default function Widgets({ dark, row, openCal, onOpen }: {
  dark: boolean; row?: boolean; openCal: () => void; onOpen: (id: string) => void;
}) {
  const [vw, vh] = useSyncExternalStore(subscribe, viewport, () => '1440x900').split('x').map(Number);
  const k = row ? Math.min(1, (vw - 32) / ROW_W) : scaleFor(vw, vh);
  const place: React.CSSProperties = row
    ? { left: '50%', top: WIDGET_ROW.top, width: ROW_W * k, height: S * k, marginLeft: -ROW_W * k / 2 }
    : { right: 16, top: 40, width: M * k, height: GRID_H * k };

  return (
    <div style={{ position: 'absolute', zIndex: 50, ...place }} onClick={e => e.stopPropagation()}>
      <div style={{
        width: row ? ROW_W : M, display: 'grid', gridTemplateColumns: `repeat(${row ? 4 : 2}, ${S}px)`, gap: GAP,
        transform: k < 1 ? `scale(${k})` : undefined, transformOrigin: 'top left',
      }}>
        <WidgetFrame dark={dark} w={S} h={S} label="Clock. Open Calendar" title="Open Calendar" onPress={openCal}>
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnalogClock dark={dark} />
          </div>
        </WidgetFrame>
        <WeatherWidget dark={dark} onOpen={onOpen} />
        <CalendarWidget dark={dark} onPress={openCal} />
        <PhotosWidget dark={dark} onOpen={onOpen} />
      </div>
    </div>
  );
}
