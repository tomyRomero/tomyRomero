'use client';
import { useState, useEffect } from 'react';
import { T } from '../tokens';
import { WidgetFrame, S } from './WidgetFrame';

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Today's date, rolling over at midnight
function useToday() {
  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const t = setTimeout(() => setToday(new Date()), midnight + 500);
    return () => clearTimeout(t);
  }, [today]);
  return today;
}

export default function CalendarWidget({ dark, onPress }: { dark: boolean; onPress: () => void }) {
  const tk = T(dark);
  const today = useToday();
  const y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  // Apple's red, a shade deeper where white text sits on it or it sits on light glass
  const red  = dark ? '#ff453a' : '#d70015';
  const ring = dark ? '#e0241b' : '#d70015';
  const month = today.toLocaleDateString('en-US', { month: 'long' });
  const full = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const rows = cells.length / 7;

  return (
    <WidgetFrame dark={dark} w={S} h={S} label={`Calendar: ${full}. Open Calendar`} onPress={onPress}>
      <div style={{ height: '100%', padding: '13px 11px 11px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: red, padding: '0 4px' }}>
          {month}
        </div>
        <div style={{
          flex: 1, marginTop: 6, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          gridTemplateRows: `12px repeat(${rows}, 1fr)`, alignItems: 'center', justifyItems: 'center',
        }}>
          {DOW.map((l, i) => (
            <span key={i} style={{ fontSize: 8.5, fontWeight: 700, color: tk.textMuted }}>{l}</span>
          ))}
          {cells.map((n, i) => (
            <span key={i} style={{
              width: 18, height: 18, borderRadius: '50%',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: n === d ? 700 : 500, fontVariantNumeric: 'tabular-nums',
              background: n === d ? ring : 'transparent',
              color: n === d ? '#fff' : i % 7 === 0 || i % 7 === 6 ? tk.textMuted : tk.text,
            }}>
              {n}
            </span>
          ))}
        </div>
      </div>
    </WidgetFrame>
  );
}
