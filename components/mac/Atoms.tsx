'use client';
import { T } from './tokens';

export function Chip({ children, amber, dark }: { children: React.ReactNode; amber?: boolean; dark: boolean }) {
  const tk = T(dark);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 12px', borderRadius: 20,
      fontSize: 11, fontFamily: 'var(--font-mono), monospace',
      background: amber ? tk.accentBg : tk.pillBg,
      border: `1px solid ${amber ? tk.accentBorder : tk.pillBorder}`,
      color: amber ? tk.accent : tk.pillText,
      whiteSpace: 'nowrap',
      transition: 'all .18s ease',
      letterSpacing: '.2px',
    }}>
      {children}
    </span>
  );
}

export function WinTitle({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  const tk = T(dark);
  return (
    <div style={{ marginBottom: 22 }}>
      <h2 style={{
        fontFamily: 'var(--font-serif), serif', fontSize: 24, fontWeight: 400,
        letterSpacing: '-.4px', color: tk.text, lineHeight: 1.2,
        marginBottom: 0,
      }}>
        {children}
      </h2>
      {/* Accent underline */}
      <div style={{
        width: 36, height: 2.5, borderRadius: 2,
        background: tk.accentGrad,
        marginTop: 10, opacity: 0.7,
      }} />
    </div>
  );
}

export function Bullet({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  const tk = T(dark);
  return (
    <div style={{ display: 'flex', gap: 10, fontSize: 13.5, color: tk.textSub, lineHeight: 1.68, marginBottom: 7 }}>
      <span style={{
        color: tk.accent, flexShrink: 0, marginTop: 1, fontSize: 12,
        fontWeight: 600,
      }}>
        &rsaquo;
      </span>
      <span>{children}</span>
    </div>
  );
}

export function Label({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  const tk = T(dark);
  return (
    <div style={{
      fontSize: 10.5, fontFamily: 'var(--font-mono), monospace',
      color: tk.accent, textTransform: 'uppercase' as const,
      letterSpacing: '1.2px', marginBottom: 10,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span>{children}</span>
      <div style={{
        flex: 1, height: 1,
        background: `linear-gradient(90deg, ${tk.accentBorder}, transparent)`,
      }} />
    </div>
  );
}
