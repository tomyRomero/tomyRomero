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

      {/* Contact hero card */}
      <div style={{
        position: 'relative',
        background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
        borderRadius: 16, padding: '18px 20px', marginBottom: 16,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: tk.accentGrad,
        }} />
        <div style={{
          fontSize: 14, color: tk.textSub, lineHeight: 1.7,
        }}>
          I&apos;m always open to discussing new opportunities, interesting projects, or just connecting with fellow developers.
        </div>
      </div>

      {contactDetails.map((item, i) => (
        <div
          key={item.type}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: 14, marginBottom: 9,
            background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
            transition: 'all .18s ease', cursor: 'default',
            animation: `contentFadeIn .4s ${i * 0.06}s ease both`,
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = tk.accentBorder;
            el.style.transform = 'translateX(4px)';
            el.style.boxShadow = tk.accentGlow;
            const btn = el.querySelector<HTMLButtonElement>('.copy-btn');
            if (btn) btn.style.opacity = '1';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = tk.cardBorder;
            el.style.transform = 'none';
            el.style.boxShadow = 'none';
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
                opacity: 0, padding: '5px 14px', borderRadius: 10,
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
        display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 12,
        background: 'rgba(52,199,89,.1)', border: '1px solid rgba(52,199,89,.22)',
        padding: '7px 16px', borderRadius: 22,
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%', background: '#34c759',
          boxShadow: '0 0 8px #34c759', animation: 'pulse 2s infinite',
        }} />
        <span style={{ fontSize: 12.5, color: '#34c759', fontFamily: 'var(--font-mono), monospace' }}>
          Open to opportunities
        </span>
      </div>

      {/* Gradient CTA button */}
      <div style={{ marginTop: 20 }}>
        <a
          href={`mailto:${ME.email}?subject=Portfolio+Hello`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 14, fontSize: 14, fontWeight: 600,
            background: tk.accentGrad2,
            border: 'none',
            color: '#fff', textDecoration: 'none', transition: 'all .18s',
            boxShadow: tk.accentGlow,
            fontFamily: 'var(--font-sans), sans-serif',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 0 28px rgba(212,148,58,.30), 0 6px 16px rgba(212,148,58,.20)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = tk.accentGlow;
          }}
        >
          ✉️  Send me an email
        </a>
      </div>
    </div>
  );
}
