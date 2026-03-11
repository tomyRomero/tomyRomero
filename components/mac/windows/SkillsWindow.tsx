'use client';
import { T } from '../tokens';
import { WinTitle } from '../Atoms';
import { skills } from '@/constants';

export default function SkillsWindow({ dark }: { dark: boolean }) {
  const tk = T(dark);

  return (
    <div style={{ padding: '22px 24px', color: tk.text }}>
      <WinTitle dark={dark}>Tech <em style={{ color: tk.accent, fontStyle: 'italic' }}>Skills</em></WinTitle>

      {Object.entries(skills).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 10.5, fontFamily: 'var(--font-mono), monospace',
            color: tk.accent, textTransform: 'uppercase' as const,
            letterSpacing: '1.2px', marginBottom: 9,
          }}>
            {cat}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {items.map(s => (
              <span
                key={s}
                style={{
                  padding: '5px 13px', borderRadius: 22, fontSize: 12.5,
                  background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
                  color: tk.text, fontFamily: 'var(--font-sans), sans-serif',
                  transition: 'all .16s', cursor: 'default',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLSpanElement;
                  el.style.background = tk.accentBg;
                  el.style.borderColor = tk.accentBorder;
                  el.style.color = tk.accent;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLSpanElement;
                  el.style.background = tk.cardBg;
                  el.style.borderColor = tk.cardBorder;
                  el.style.color = tk.text;
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
