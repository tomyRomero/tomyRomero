'use client';
import { useState } from 'react';
import { T } from '../tokens';
import { WinTitle } from '../Atoms';
import { contactDetails, ME } from '@/constants';

const ICONS: Record<string, string> = {
  Email: '✉️', LinkedIn: '🔗', GitHub: '⑂', Location: '📍',
};

export default function ContactWindow({ dark }: { dark: boolean }) {
  const tk = T(dark);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (txt: string, lbl: string) => {
    navigator.clipboard?.writeText(txt);
    setCopied(lbl);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ padding: '22px 24px', color: tk.text }}>
      <WinTitle dark={dark}>Get in <em style={{ color: tk.accent, fontStyle: 'italic' }}>Touch</em></WinTitle>

      {contactDetails.map(item => (
        <div
          key={item.type}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '13px 16px', borderRadius: 12, marginBottom: 9,
            background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
            transition: 'all .17s ease', cursor: 'default',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = tk.accentBorder;
            el.style.transform = 'translateX(4px)';
            const btn = el.querySelector<HTMLButtonElement>('.copy-btn');
            if (btn) btn.style.opacity = '1';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = tk.cardBorder;
            el.style.transform = 'none';
            const btn = el.querySelector<HTMLButtonElement>('.copy-btn');
            if (btn) btn.style.opacity = '0';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ fontSize: 20, width: 26, textAlign: 'center' }}>
              {ICONS[item.type] || '•'}
            </span>
            <div>
              <div style={{
                fontSize: 10.5, fontFamily: 'var(--font-mono), monospace',
                color: tk.textMuted, textTransform: 'uppercase' as const, letterSpacing: '.9px',
              }}>
                {item.type}
              </div>
              {item.href ? (
                <a
                  href={item.href} target={item.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  style={{ fontSize: 13.5, color: tk.accent, textDecoration: 'none', display: 'block', marginTop: 2 }}
                >
                  {item.value}
                </a>
              ) : (
                <div style={{ fontSize: 13.5, color: tk.text, marginTop: 2 }}>{item.value}</div>
              )}
            </div>
          </div>
          {item.cv && (
            <button
              className="copy-btn"
              onClick={() => copy(item.cv!, item.type)}
              style={{
                opacity: 0, padding: '4px 12px', borderRadius: 8,
                fontSize: 11.5, fontFamily: 'var(--font-mono), monospace',
                background: tk.accentBg, border: `1px solid ${tk.accentBorder}`,
                color: tk.accent, cursor: 'default', transition: 'opacity .15s',
              }}
            >
              {copied === item.type ? '✓ Copied' : 'Copy'}
            </button>
          )}
        </div>
      ))}

      {/* Open to opportunities */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 8,
        background: 'rgba(52,199,89,.1)', border: '1px solid rgba(52,199,89,.22)',
        padding: '7px 16px', borderRadius: 22,
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%', background: '#34c759',
          boxShadow: '0 0 7px #34c759', animation: 'pulse 2s infinite',
        }} />
        <span style={{ fontSize: 12.5, color: '#34c759', fontFamily: 'var(--font-mono), monospace' }}>
          Open to opportunities
        </span>
      </div>

      {/* Quick email button */}
      <div style={{ marginTop: 20 }}>
        <a
          href={`mailto:${ME.email}?subject=Portfolio+Hello`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 12, fontSize: 13.5, fontWeight: 500,
            background: tk.accentBg, border: `1px solid ${tk.accentBorder}`,
            color: tk.accent, textDecoration: 'none', transition: 'opacity .15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '.7')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          ✉️  Send me an email ↗
        </a>
      </div>
    </div>
  );
}
