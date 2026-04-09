'use client';
import { T } from '../tokens';
import { WinTitle } from '../Atoms';
import { skills } from '@/constants';

const CATEGORY_ICONS: Record<string, string> = {
  'Languages':    '{ }',
  'Backend':      'API',
  'Frontend':     'UI',
  'Data & Cloud': '☁',
  'Tools':        '⚙',
};

const CATEGORY_COLORS: Record<string, [string, string]> = {
  'Languages':    ['#6366f1', 'rgba(99,102,241,.14)'],
  'Backend':      ['#059669', 'rgba(5,150,105,.14)'],
  'Frontend':     ['#3b82f6', 'rgba(59,130,246,.14)'],
  'Data & Cloud': ['#D4943A', 'rgba(212,148,58,.14)'],
  'Tools':        ['#8b5cf6', 'rgba(139,92,246,.14)'],
};

export default function SkillsWindow({ dark }: { dark: boolean }) {
  const tk = T(dark);

  return (
    <div style={{ padding: '22px 24px', color: tk.text }}>
      <WinTitle dark={dark}>Tech <em style={{ color: tk.accent, fontStyle: 'italic' }}>Skills</em></WinTitle>

      {Object.entries(skills).map(([cat, items], catIdx) => {
        const [color, bg] = CATEGORY_COLORS[cat] || ['#D4943A', 'rgba(212,148,58,.14)'];
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
                fontSize: 11, fontWeight: 700, color,
                fontFamily: 'var(--font-mono), monospace',
                border: `1px solid ${dark ? `${color}22` : `${color}18`}`,
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
              <div style={{
                flex: 1, height: 1,
                background: `linear-gradient(90deg, ${dark ? `${color}33` : `${color}22`}, transparent)`,
              }} />
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
                    el.style.borderColor = `${color}44`;
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
        <span className="grad-text" style={{
          fontSize: 18, fontWeight: 700,
          fontFamily: 'var(--font-mono), monospace',
          background: tk.accentGrad,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
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
