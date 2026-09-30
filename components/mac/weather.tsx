'use client';
import { useState, useEffect, useSyncExternalStore } from 'react';

// Ocala forecast shared by the widget and the app, via /api/weather (Open-Meteo).
// Refreshes every 20 minutes while visible.

export type Hour = { time: string; temp: number; code: number; isDay: boolean; rain: number };
export type Day  = { date: string; code: number; hi: number; lo: number; rain: number; uv: number; sunrise: string; sunset: string };
export type Wx = {
  now: { temp: number; feels: number; humidity: number; code: number; isDay: boolean; wind: number; windDir: number };
  hours: Hour[];
  days: Day[];
};

export const TZ = 'America/New_York';
export const FORECAST_URL = 'https://forecast.weather.gov/MapClick.php?lat=29.1872&lon=-82.1401';

// Store
type State = { wx: Wx | null; failed: boolean };
let state: State = { wx: null, failed: false };
let inflight: Promise<void> | null = null;
let started = false;
const subs = new Set<() => void>();

export function loadWeather() {
  if (inflight) return inflight;
  inflight = fetch('/api/weather')
    .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((wx: Wx) => { state = { wx, failed: false }; })
    .catch(() => { state = { wx: state.wx, failed: !state.wx }; })
    .finally(() => { inflight = null; subs.forEach(f => f()); });
  return inflight;
}

// now: fetch immediately instead of waiting for idle
export function useWeather(now = false) {
  useEffect(() => {
    if (!started) {
      started = true;
      setTimeout(loadWeather, 1200);
      setInterval(() => { if (!document.hidden) loadWeather(); }, 20 * 60_000);
    }
    if (now && (!state.wx || state.failed)) loadWeather();
  }, [now]);
  return useSyncExternalStore(
    cb => { subs.add(cb); return () => { subs.delete(cb); }; },
    () => state, () => state,
  );
}

// WMO weather codes
export type Kind = 'clear' | 'partly' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';

export function condition(code: number, day: boolean): { name: string; kind: Kind } {
  if (code === 0) return { name: day ? 'Sunny' : 'Clear', kind: 'clear' };
  if (code === 1) return { name: day ? 'Mostly Sunny' : 'Mostly Clear', kind: 'partly' };
  if (code === 2) return { name: 'Partly Cloudy', kind: 'partly' };
  if (code === 3) return { name: 'Cloudy', kind: 'cloudy' };
  if (code === 45 || code === 48) return { name: 'Foggy', kind: 'fog' };
  if (code >= 51 && code <= 57) return { name: code >= 56 ? 'Freezing Drizzle' : 'Drizzle', kind: 'drizzle' };
  if (code === 61) return { name: 'Light Rain', kind: 'rain' };
  if (code === 63) return { name: 'Rain', kind: 'rain' };
  if (code === 65) return { name: 'Heavy Rain', kind: 'rain' };
  if (code === 66 || code === 67) return { name: 'Freezing Rain', kind: 'rain' };
  if (code >= 71 && code <= 77) return { name: code === 75 ? 'Heavy Snow' : code === 71 ? 'Light Snow' : 'Snow', kind: 'snow' };
  if (code >= 80 && code <= 82) return { name: code === 82 ? 'Heavy Showers' : 'Showers', kind: 'rain' };
  if (code === 85 || code === 86) return { name: 'Snow Showers', kind: 'snow' };
  if (code >= 95) return { name: 'Thunderstorms', kind: 'storm' };
  return { name: 'Cloudy', kind: 'cloudy' };
}

// The sky behind the widget and the app: [day, night]
const SKY: Record<'clear' | 'partly' | 'cloudy' | 'wet' | 'snow', [string, string]> = {
  clear:  ['linear-gradient(180deg,#2d7cd6 0%,#5ba6ec 100%)', 'linear-gradient(180deg,#0a1633 0%,#23385f 100%)'],
  partly: ['linear-gradient(180deg,#4284c8 0%,#7aafe0 100%)', 'linear-gradient(180deg,#131d36 0%,#2e3e60 100%)'],
  cloudy: ['linear-gradient(180deg,#687e93 0%,#95a8b9 100%)', 'linear-gradient(180deg,#1b222d 0%,#38424e 100%)'],
  wet:    ['linear-gradient(180deg,#4b5b6d 0%,#738699 100%)', 'linear-gradient(180deg,#151b25 0%,#2e3846 100%)'],
  snow:   ['linear-gradient(180deg,#7a90a8 0%,#b0c0d2 100%)', 'linear-gradient(180deg,#1c2432 0%,#3a4557 100%)'],
};
export function skyOf(kind: Kind, day: boolean) {
  const k = kind === 'fog' ? 'cloudy' : kind === 'drizzle' || kind === 'rain' || kind === 'storm' ? 'wet' : kind;
  return SKY[k][day ? 0 : 1];
}

// A temperature (°F) as a color, cool blue to hot red, for the range bars
const STOPS: [number, number[]][] = [
  [30, [90, 200, 250]], [50, [95, 211, 198]], [65, [165, 220, 90]], [75, [245, 213, 74]], [85, [255, 159, 56]], [98, [255, 91, 58]],
];
export function tempColor(t: number) {
  if (t <= STOPS[0][0]) return `rgb(${STOPS[0][1].join(',')})`;
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, c1] = STOPS[i], [t0, c0] = STOPS[i - 1];
    if (t <= t1) {
      const k = (t - t0) / (t1 - t0);
      return `rgb(${c0.map((c, j) => Math.round(c + (c1[j] - c) * k)).join(',')})`;
    }
  }
  return `rgb(${STOPS[STOPS.length - 1][1].join(',')})`;
}

// Icons
const SUN = '#ffd60a', DROP = '#5ac8fa';

function Cloud({ x = 0, y = 0, fill = '#fff' }: { x?: number; y?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y})`} fill={fill}>
      <circle cx="8.4" cy="14.4" r="3.9" /><circle cx="13.2" cy="11.8" r="5.1" /><circle cx="17.7" cy="14.8" r="3.5" />
      <rect x="8.4" y="13.2" width="9.3" height="5.1" />
    </g>
  );
}
function Sun({ cx = 12, cy = 12, r = 4.4 }: { cx?: number; cy?: number; r?: number }) {
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4, c = Math.cos(a), s = Math.sin(a);
        return <line key={i} x1={cx + c * (r + 2)} y1={cy + s * (r + 2)} x2={cx + c * (r + 4.2)} y2={cy + s * (r + 4.2)}
          stroke={SUN} strokeWidth="1.7" strokeLinecap="round" />;
      })}
      <circle cx={cx} cy={cy} r={r} fill={SUN} />
    </g>
  );
}
const Moon = ({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} fill="#f2f2f7" d="M15.6 3.4a8.6 8.6 0 1 0 5 13.9A7.2 7.2 0 0 1 15.6 3.4z" />
);

export function WeatherIcon({ code, day, size }: { code: number; day: boolean; size: number }) {
  const { kind } = condition(code, day);
  let art: React.ReactNode;
  switch (kind) {
    case 'clear':
      art = day ? <Sun /> : <Moon x={1} y={1} s={.9} />;
      break;
    case 'partly':
      art = <>{day ? <Sun cx={15.5} cy={8} r={3.6} /> : <Moon x={9} y={.4} s={.58} />}<Cloud x={-2} y={2} /></>;
      break;
    case 'fog':
      art = <><Cloud y={-3} /><g stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".85"><path d="M5 19.2h14M7 22h10" /></g></>;
      break;
    case 'drizzle':
    case 'rain':
      art = <><Cloud y={-3.5} />
        <g stroke={DROP} strokeWidth="1.8" strokeLinecap="round">
          {kind === 'rain'
            ? <path d="M9 18.2l-1.2 3M13 18.2l-1.2 3M17 18.2l-1.2 3" />
            : <path d="M9.5 18.6l-.6 1.4M13.5 18.6l-.6 1.4M11.3 21.4l-.6 1.4" />}
        </g></>;
      break;
    case 'snow':
      art = <><Cloud y={-3.5} /><g fill="#fff">{[[9, 19.5], [13, 21.5], [17, 19.5]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.2" />)}</g></>;
      break;
    case 'storm':
      art = <><Cloud y={-3.5} /><path d="M13.4 15.6 10.6 20h2.6l-1.4 3.8 4.2-5.4h-2.7l1.3-2.8z" fill={SUN} /></>;
      break;
    default:
      art = <Cloud y={-1} />;
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>{art}</svg>;
}

// The sun on the horizon, with an arrow for which way it's going
export function SunEventIcon({ rise, size }: { rise: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M6.5 18a5.5 5.5 0 0 1 11 0z" fill={SUN} />
      <path d="M3 18.5h18" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
      <path d={rise ? 'M12 3.5v6M9.4 6 12 3.5 14.6 6' : 'M12 3.5v6M9.4 7 12 9.5 14.6 7'} stroke="#fff" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Units and time format follow the visitor's locale
const FAHRENHEIT = ['US', 'PR', 'GU', 'VI', 'AS', 'MP', 'UM', 'LR', 'MM', 'BS', 'BZ', 'KY', 'PW', 'FM', 'MH'];
function prefs() {
  let f = true, twelve = true;
  try { f = FAHRENHEIT.includes(new Intl.Locale(navigator.language).maximize().region ?? 'US'); } catch {}
  try { twelve = /^h1/.test(new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hourCycle ?? 'h12'); } catch {}
  return { f, twelve };
}
export function useUnits() {
  const [{ f, twelve }] = useState(prefs);
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    f,
    deg: (t: number) => `${Math.round(f ? t : ((t - 32) * 5) / 9)}°`,
    speed: (mph: number) => (f ? `${Math.round(mph)} mph` : `${Math.round(mph * 1.609)} km/h`),
    // "3PM", or "15" on a 24-hour clock
    hour: (time: string) => {
      const h = +time.slice(11, 13);
      return twelve ? `${h % 12 || 12}${h < 12 ? 'AM' : 'PM'}` : pad(h);
    },
    // "7:21AM", or "07:21"
    clock: (time: string) => {
      const h = +time.slice(11, 13), m = time.slice(14, 16);
      return twelve ? `${h % 12 || 12}:${m}${h < 12 ? 'AM' : 'PM'}` : `${pad(h)}:${m}`;
    },
  };
}

// The current time in Ocala, in the forecast's form ("2026-09-30T14:07")
export function ocalaNow() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const g = (t: string) => parts.find(p => p.type === t)?.value ?? '00';
  return `${g('year')}-${g('month')}-${g('day')}T${g('hour')}:${g('minute')}`;
}
export const hourKey = (t: string) => t.slice(0, 13) + ':00';
