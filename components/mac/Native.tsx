'use client';
import { useEffect, useRef, useState } from 'react';
import { T } from './tokens';
import type { Tint } from '@/constants';
import { tint } from '@/components/projectColors';

// Shared window pieces. Toolbars carry data-drag so WinShell can move the window.

export const TOOLBAR_H = 52;

export { tint } from '@/components/projectColors';

export function Monogram({ text, t, dark, size = 34, round = true }: {
  text: string; t: Tint; dark: boolean; size?: number; round?: boolean;
}) {
  const c = tint(t, dark);
  return (
    <span aria-hidden="true" style={{
      width: size, height: size, flexShrink: 0,
      borderRadius: round ? '50%' : Math.round(size * 0.27),
      background: c.bg, color: c.fg,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * (text.length > 2 ? 0.3 : text.length > 1 ? 0.36 : 0.41)),
      fontWeight: 700, letterSpacing: '-.2px',
    }}>
      {text}
    </span>
  );
}

// Sidebar
export function Sidebar({ dark, width, label, children, footer }: {
  dark: boolean; width: number; label: string; children: React.ReactNode; footer?: React.ReactNode;
}) {
  const tk = T(dark);
  return (
    <nav aria-label={label} style={{
      width, flexShrink: 0, display: 'flex', flexDirection: 'column', minHeight: 0,
      background: tk.sidebar, borderRight: `1px solid ${tk.sidebarLine}`,
    }}>
      {/* Traffic light clearance, also a drag handle */}
      <div data-drag="" style={{ height: TOOLBAR_H, flexShrink: 0 }} />
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 10px 10px', scrollbarWidth: 'none' }}>
        {children}
      </div>
      {footer && <div style={{ padding: '0 10px 12px' }}>{footer}</div>}
    </nav>
  );
}

export function SidebarHeading({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  const tk = T(dark);
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: tk.label2, padding: '10px 10px 5px' }}>
      {children}
    </div>
  );
}

export function SidebarItem({ dark, icon, label, count, selected, onClick, strong }: {
  dark: boolean; icon?: React.ReactNode; label: string; count?: number | string;
  selected?: boolean; onClick: () => void; strong?: boolean;
}) {
  const tk = T(dark);
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-current={selected ? 'true' : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', height: strong ? 34 : 30, display: 'flex', alignItems: 'center', gap: 9,
        padding: strong ? '0 8px' : '0 10px', borderRadius: 7, textAlign: 'left',
        fontSize: 13.5, fontWeight: selected ? 500 : 400,
        background: selected ? (strong ? tk.select : tk.sidebarSel) : hov ? (dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)') : 'transparent',
        color: selected && strong ? '#fff' : tk.label,
        transition: 'background .12s',
      }}
    >
      {icon}
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      {count !== undefined && (
        <span style={{
          fontSize: 12, fontVariantNumeric: 'tabular-nums',
          color: selected && strong ? 'rgba(255,255,255,.85)' : tk.label2,
        }}>
          {count}
        </span>
      )}
    </button>
  );
}

// Toolbar
export function Toolbar({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div data-drag="" style={{
      height: TOOLBAR_H, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 16px', ...style,
    }}>
      {children}
    </div>
  );
}

export function ToolbarButton({ label, onClick, disabled, dark, children }: {
  label: string; onClick?: () => void; disabled?: boolean; dark: boolean; children: React.ReactNode;
}) {
  const tk = T(dark);
  return (
    <button
      aria-label={label} title={label} onClick={onClick} disabled={disabled}
      style={{
        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: disabled ? tk.label3 : tk.label2, transition: 'background .12s, color .12s',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = tk.fill; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </button>
  );
}

// Container width classes; re-renders only when a breakpoint is crossed
export function useWidthClass<T extends HTMLElement>(breaks: number[]) {
  const ref = useRef<T>(null);
  const [cls, setCls] = useState(breaks.length);
  const key = breaks.join(',');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const bs = key.split(',').map(Number);
    const measure = (w: number) => {
      const i = bs.findIndex(b => w < b);
      setCls(i < 0 ? bs.length : i);
    };
    measure(el.clientWidth);
    const ro = new ResizeObserver(([e]) => measure(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [key]);
  return [ref, cls] as const;
}

// Icons
type P = { s?: number };
const line = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const ChevronLeft  = ({ s = 15 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={2.2}><path d="m14.5 6-6 6 6 6" /></svg>;
export const ChevronRight = ({ s = 15 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={2.2}><path d="m9.5 6 6 6-6 6" /></svg>;
export const ChevronUp    = ({ s = 15 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={2.2}><path d="m6 14.5 6-6 6 6" /></svg>;
export const ChevronDown  = ({ s = 15 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={2.2}><path d="m6 9.5 6 6 6-6" /></svg>;
export const ArrowUpRight = ({ s = 11 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={2.4}><path d="M8 16 16 8M9.5 8H16v6.5" /></svg>;
export const Briefcase    = ({ s = 16 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={1.8}><rect x="3" y="7.5" width="18" height="12" rx="2" /><path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M3 13h18" /></svg>;
export const GradCap      = ({ s = 16 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={1.8}><path d="M2.5 9 12 4.5 21.5 9 12 13.5zM6.5 11v4.5c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3V11M21.5 9v5" /></svg>;
export const Ribbon       = ({ s = 16 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={1.8}><circle cx="12" cy="9" r="5.5" /><path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7" /></svg>;
export const Download     = ({ s = 16 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={1.9}><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14" /></svg>;
export const Envelope     = ({ s = 20 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={1.8}><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="m3.8 7 8.2 6 8.2-6" /></svg>;
export const ShareIcon    = ({ s = 17 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={1.8}><path d="M12 3.5v11M8 7.5l4-4 4 4M7 11H6a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 18 11h-1" /></svg>;
export const CheckIcon    = ({ s = 15 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={2.4}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>;
export const PinLine      = ({ s = 12 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={2.2}><path d="M12 21s6.5-5.8 6.5-11a6.5 6.5 0 1 0-13 0c0 5.2 6.5 11 6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>;
export const SearchLine   = ({ s = 14 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={2}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>;
export const SendIcon     = ({ s = 16 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={2}><path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5z" /></svg>;
export const CopyIcon     = ({ s = 13 }: P) => <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" {...line} strokeWidth={2}><rect x="8.5" y="8.5" width="12" height="12" rx="2.5" /><path d="M15.5 8.5V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5" /></svg>;
