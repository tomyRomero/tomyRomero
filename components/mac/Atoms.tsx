'use client';
import { T } from './tokens';

export function Chip({ children, amber, dark }: { children: React.ReactNode; amber?: boolean; dark: boolean }) {
  const tk = T(dark);
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontFamily: 'var(--font-mono), monospace',
      background: amber ? tk.accentBg : tk.pillBg,
      border: `1px solid ${amber ? tk.accentBorder : tk.pillBorder}`,
      color: amber ? tk.accent : tk.pillText,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

export function WinTitle({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  const tk = T(dark);
  return (
    <h2 style={{
      fontFamily: 'var(--font-serif), serif', fontSize: 22, fontWeight: 400,
      letterSpacing: '-.3px', color: tk.text, marginBottom: 18, lineHeight: 1.2,
    }}>
      {children}
    </h2>
  );
}

export function Bullet({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  const tk = T(dark);
  return (
    <div style={{ display: 'flex', gap: 9, fontSize: 13.5, color: tk.textSub, lineHeight: 1.65, marginBottom: 7 }}>
      <span style={{ color: tk.accent, flexShrink: 0, marginTop: 3, fontSize: 11 }}>→</span>
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
      letterSpacing: '1.1px', marginBottom: 10,
    }}>
      {children}
    </div>
  );
}
