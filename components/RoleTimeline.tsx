'use client';
import { experiences } from '@/constants';
import { tint } from '@/components/mac/Native';

// Roles drawn to scale by month

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ym = (s: string) => { const [y, m] = s.split('-').map(Number); return { y, m }; };

// "Jan – Apr 2025", "Dec 2024 – Feb 2025", "2025 – now"
export function shortSpan(start: string, end: string | null) {
  const s = ym(start);
  if (!end) return `${s.y} – now`;
  const e = ym(end);
  return s.y === e.y
    ? `${MON[s.m - 1]} – ${MON[e.m - 1]} ${e.y}`
    : `${MON[s.m - 1]} ${s.y} – ${MON[e.m - 1]} ${e.y}`;
}

// Months since January of the first role's year, oldest first
export function timeline() {
  const now = new Date();
  const first = Math.min(...experiences.map(e => ym(e.start).y));
  const last = now.getFullYear();
  const total = (last - first + 1) * 12;
  const nowAt = (last - first) * 12 + now.getMonth() + now.getDate() / 31;
  const at = (s: string) => { const d = ym(s); return (d.y - first) * 12 + d.m - 1; };
  const roles = [...experiences].sort((a, b) => at(a.start) - at(b.start));
  const bars = roles.map((r, i) => {
    const from = at(r.start);
    const next = roles[i + 1] ? at(roles[i + 1].start) : Infinity;
    const to = Math.min(r.end ? at(r.end) + 1 : nowAt, next);
    return { r, from, to };
  });
  const years = Array.from({ length: last - first + 1 }, (_, i) => first + i);
  return { total, nowAt, bars, years };
}

export default function RoleTimeline({ dark, selected, onSelect, muted }: {
  dark: boolean;
  selected?: string;
  onSelect?: (company: string) => void;
  muted: { text: string; track: string; tick: string; knob: string };
}) {
  const { total, nowAt, bars, years } = timeline();
  const pct = (months: number) => `${(months / total) * 100}%`;
  const current = bars.find(b => !b.r.end);

  return (
    <div style={{ position: 'relative', height: 58 }}>
      {years.map((y, i) => (
        <span key={y}>
          <span style={{
            position: 'absolute', left: pct(i * 12), top: 0,
            fontSize: 10.5, color: muted.text, fontFamily: 'var(--font-mono), monospace',
          }}>{y}</span>
          <span style={{ position: 'absolute', left: pct(i * 12), top: 16, width: 1, height: 22, background: muted.tick }} />
        </span>
      ))}
      <span style={{ position: 'absolute', left: 0, right: 0, top: 26, height: 2, borderRadius: 1, background: muted.track }} />

      {bars.map(({ r, from, to }) => {
        const on = !selected || selected === r.company;
        const c = tint(r.tint, dark);
        const Tag = onSelect ? 'button' : 'span';
        return (
          <Tag
            key={r.company}
            {...(onSelect ? { onClick: () => onSelect(r.company), 'aria-label': `${r.short}, ${shortSpan(r.start, r.end)}` } : {})}
            style={{
              position: 'absolute', left: pct(from), width: `calc(${pct(to - from)} - 2px)`,
              top: on ? 20 : 22, height: on ? 14 : 10, borderRadius: 7, padding: 0,
              background: c.bar, opacity: on ? 1 : .5,
              boxShadow: on ? `0 2px 8px ${c.bar}66` : 'none',
              transition: 'opacity .2s, top .2s, height .2s',
            }}
          />
        );
      })}

      {current && (
        <span aria-hidden="true" style={{
          position: 'absolute', left: pct(nowAt), top: 17, width: 20, height: 20, marginLeft: -12,
          borderRadius: '50%', background: muted.knob, boxShadow: `0 0 0 3px ${tint(current.r.tint, dark).bar}`,
          pointerEvents: 'none',
        }} />
      )}

      {bars.map(({ r, from, to }) => (
        <span key={r.company} style={{
          position: 'absolute', left: pct((from + to) / 2), top: 42, transform: 'translateX(-50%)',
          fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', color: tint(r.tint, dark).fg,
        }}>{r.short}</span>
      ))}
      {current && (
        <span style={{
          position: 'absolute', left: pct(nowAt), top: 42, transform: 'translateX(-50%)',
          fontSize: 11, fontWeight: 600, color: muted.text,
        }}>Now</span>
      )}
    </div>
  );
}
