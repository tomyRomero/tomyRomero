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
    <h2 style={{
      fontSize: 19, fontWeight: 600,
      letterSpacing: '-.3px', color: tk.text, lineHeight: 1.2,
      marginBottom: 18,
    }}>
      {children}
    </h2>
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
      color: tk.textMuted, textTransform: 'uppercase' as const,
      letterSpacing: '1.2px', marginBottom: 10,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span>{children}</span>
      <div style={{ flex: 1, height: 1, background: tk.divider }} />
    </div>
  );
}

// Typographic replacement for emoji logos: a small rounded tile with a
// monospace mark ("M", "AWS", "UVI", …)
export function Lettermark({ text, dark, size = 34 }: { text: string; dark: boolean; size?: number }) {
  const tk = T(dark);
  return (
    <span style={{
      width: size, height: size, borderRadius: Math.round(size * 0.26),
      background: tk.pillBg, border: `1px solid ${tk.pillBorder}`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: text.length > 2 ? Math.round(size * 0.28) : Math.round(size * 0.36),
      fontWeight: 600, color: tk.textSub, flexShrink: 0,
      fontFamily: 'var(--font-mono), monospace', letterSpacing: '-.2px',
    }}>
      {text}
    </span>
  );
}
