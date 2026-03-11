'use client';
import { useState } from 'react';
import { T } from './tokens';
import { ME } from '@/constants';

export default function NotifCard({ dark }: { dark: boolean }) {
  const [vis, setVis] = useState(true);
  const tk = T(dark);
  if (!vis) return null;

  return (
    <div
      className="mac-notif"
      style={{
        position: 'fixed', top: 40, right: 16, width: 298, zIndex: 9996,
        background: tk.winBg,
        backdropFilter: 'blur(32px) saturate(1.9)',
        WebkitBackdropFilter: 'blur(32px) saturate(1.9)',
        border: `1px solid ${tk.border}`,
        borderRadius: 17,
        boxShadow: '0 12px 48px rgba(0,0,0,.18)',
        display: 'flex', alignItems: 'center', gap: 13, padding: '13px 15px',
        animation: 'notifIn .5s cubic-bezier(.16,1,.3,1) 1.2s both',
        fontFamily: 'var(--font-sans), sans-serif',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 48, height: 48, borderRadius: 13, flexShrink: 0,
        background: 'linear-gradient(135deg,#D4943A 0%,#7a4c10 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-serif), serif',
        fontSize: 18, color: '#0F1A2E', fontWeight: 'bold', letterSpacing: -1,
      }}>
        TR
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: tk.text }}>{ME.name}</div>
        <div style={{ fontSize: 12, color: tk.textMuted, marginTop: 1 }}>Software Engineer · Founder</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
          {([['GitHub', ME.github], ['LinkedIn', ME.linkedin]] as [string, string][]).map(([l, h]) => (
            <a
              key={l} href={h} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 11.5, color: '#D4943A', textDecoration: 'none', fontWeight: 500 }}
            >
              {l}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%', background: '#34c759',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ fontSize: 11.5, color: '#34c759' }}>Open to opportunities</span>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setVis(false)}
        style={{
          position: 'absolute', top: 8, right: 9, width: 18, height: 18,
          borderRadius: '50%', background: dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.09)',
          border: 'none', cursor: 'pointer', fontSize: 9, color: tk.textMuted,
          display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: .55,
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '.55')}
      >
        ✕
      </button>
    </div>
  );
}
