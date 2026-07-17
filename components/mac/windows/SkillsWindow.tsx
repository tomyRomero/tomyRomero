'use client';
import { T } from '../tokens';
import { WinTitle } from '../Atoms';
import { skills } from '@/constants';

const CATEGORY_ICONS: Record<string, string> = {
  'Languages':    '{ }',
  'Backend':      'API',
  'Frontend':     'UI',
  'Data & Cloud': 'DB',
  'Tools':        'OPS',
};

export default function SkillsWindow({ dark }: { dark: boolean }) {
  const tk = T(dark);
  // One accent across every category — quiet and consistent
  const color = tk.accent;
  const bg    = tk.accentBg;

  return (
    <div style={{ padding: '22px 24px', color: tk.text }}>
      <WinTitle dark={dark}>Skills</WinTitle>

      {Object.entries(skills).map(([cat, items], catIdx) => {
        const icon = CATEGORY_ICONS[cat] || '•';
        return (
          <div
            key={cat}
            style={{
              marginBottom: 18,
              animation: `contentFadeIn .4s ${catIdx * 0.06}s ease both`,
            }}
          >
            {/* Category header with icon */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 9,
              marginBottom: 10,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color,
                fontFamily: 'var(--font-mono), monospace',
                border: `1px solid ${tk.accentBorder}`,
                flexShrink: 0,
              }}>
                {icon}
              </div>
              <span style={{
                fontSize: 12, fontFamily: 'var(--font-mono), monospace',
                color: tk.textSub,
                textTransform: 'uppercase' as const,
                letterSpacing: '1px', fontWeight: 600,
              }}>
                {cat}
              </span>
              <div style={{ flex: 1, height: 1, background: tk.divider }} />
              <span style={{
                fontSize: 10, color: tk.textMuted,
                fontFamily: 'var(--font-mono), monospace',
              }}>
                {items.length}
              </span>
            </div>

            {/* Skill pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, paddingLeft: 37 }}>
              {items.map(s => (
                <span
                  key={s}
                  style={{
                    padding: '5px 14px', borderRadius: 22, fontSize: 12.5,
                    background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
                    color: tk.text, fontFamily: 'var(--font-sans), sans-serif',
                    transition: 'all .18s', cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLSpanElement;
                    el.style.background = bg;
                    el.style.borderColor = tk.accentBorder;
                    el.style.color = color;
                    el.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLSpanElement;
                    el.style.background = tk.cardBg;
                    el.style.borderColor = tk.cardBorder;
                    el.style.color = tk.text;
                    el.style.transform = 'none';
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        );
      })}

      {/* Total skills count */}
      <div style={{
        marginTop: 8, padding: '10px 16px', borderRadius: 12,
        background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <span style={{
          fontSize: 18, fontWeight: 700,
          fontFamily: 'var(--font-mono), monospace',
          color: tk.accent,
        }}>
          {Object.values(skills).flat().length}
        </span>
        <span style={{
          fontSize: 11, color: tk.textMuted,
          fontFamily: 'var(--font-mono), monospace',
          textTransform: 'uppercase', letterSpacing: '.5px',
        }}>
          technologies
        </span>
      </div>
    </div>
  );
}
