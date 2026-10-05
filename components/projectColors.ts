import type { Tint } from '@/constants';

// Not a client module, so server components can use these

// A steady hue for any project name
export function hueOf(title: string) {
  let h = 7;
  for (const c of title) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

// Mat colors: [light from, light to, dark from, dark to]. Unlisted projects get
// a pair from their name's hue.
const MAT: Record<string, [string, string, string, string]> = {
  ArtifyMe:        ['#fde9da', '#e8dcf8', '#3b2b2c', '#262040'],
  StoreOperations: ['#f7e4f0', '#dfe4fb', '#2c1530', '#111a33'],
  Sparks:          ['#dde8ff', '#c7d4f4', '#1c2644', '#10162b'],
};
export function matColors(album: string): [string, string, string, string] {
  const h = hueOf(album);
  return MAT[album] ?? [`hsl(${h} 70% 92%)`, `hsl(${h + 35} 55% 84%)`, `hsl(${h} 35% 24%)`, `hsl(${h + 35} 30% 14%)`];
}
export function albumTint(album: string, dark: boolean) {
  const [a, b, c, d] = matColors(album);
  return dark ? `linear-gradient(135deg, ${c}, ${d})` : `linear-gradient(135deg, ${a}, ${b})`;
}

// Organization colors: monogram text and fill, and a bar color
export const TINTS: Record<Tint, { fg: string; bg: string; fgDark: string; bgDark: string; bar: string }> = {
  teal:   { fg: '#0f766e', bg: '#d9f2ef', fgDark: '#5eead4', bgDark: 'rgba(20,184,166,.18)', bar: '#14b8a6' },
  orange: { fg: '#c2410c', bg: '#ffedd5', fgDark: '#fdba74', bgDark: 'rgba(249,115,22,.2)',  bar: '#f97316' },
  violet: { fg: '#6d28d9', bg: '#ede9fe', fgDark: '#c4b5fd', bgDark: 'rgba(139,92,246,.2)',  bar: '#8b5cf6' },
  blue:   { fg: '#1e4fae', bg: '#e0e9fb', fgDark: '#93c5fd', bgDark: 'rgba(59,130,246,.2)',  bar: '#3b82f6' },
  amber:  { fg: '#a16207', bg: '#fef3c7', fgDark: '#fcd34d', bgDark: 'rgba(245,158,11,.18)', bar: '#f59e0b' },
};
export function tint(t: Tint, dark: boolean) {
  const c = TINTS[t];
  return { fg: dark ? c.fgDark : c.fg, bg: dark ? c.bgDark : c.bg, bar: c.bar };
}
