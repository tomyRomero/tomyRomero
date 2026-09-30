'use client';
import { T } from '../tokens';

// macOS widget sizes: small is square, medium is two smalls wide
export const S = 170;
export const GAP = 12;
export const M = S * 2 + GAP;

// The visual is aria-hidden; a transparent button or link on top carries the label
export function WidgetFrame({ dark, label, title, onPress, onKey, onWheel, href, w, h, bg, onHover, children }: {
  dark: boolean;
  label: string;
  title?: string;
  onPress?: () => void;
  onKey?: (e: React.KeyboardEvent) => void;
  onWheel?: (e: React.WheelEvent) => void;
  href?: string;
  w: number | string;
  h: number | string;
  bg?: string;
  onHover?: (on: boolean) => void;
  children: React.ReactNode;
}) {
  const tk = T(dark);
  const cover: React.CSSProperties = { position: 'absolute', inset: 0, zIndex: 1, borderRadius: 22, cursor: 'pointer' };
  const focus = { onFocus: () => onHover?.(true), onBlur: () => onHover?.(false) };

  return (
    <div
      onWheel={onWheel}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        if (!bg) e.currentTarget.style.borderColor = tk.accentBorder;
        onHover?.(true);
      }}
      // pressing sinks the tile a touch, so a click always shows
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(.975)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        if (!bg) e.currentTarget.style.borderColor = tk.border;
        onHover?.(false);
      }}
      style={{
        position: 'relative', width: w, height: h, borderRadius: 22, overflow: 'hidden', color: tk.text,
        background: bg ?? tk.winBg,
        backdropFilter: bg ? undefined : 'blur(32px) saturate(2)',
        WebkitBackdropFilter: bg ? undefined : 'blur(32px) saturate(2)',
        border: `1px solid ${bg ? 'rgba(255,255,255,.14)' : tk.border}`,
        boxShadow: dark
          ? '0 6px 32px rgba(0,0,0,.22), 0 0 0 0.5px rgba(255,255,255,.04)'
          : '0 6px 28px rgba(0,0,0,.10)',
        fontFamily: 'var(--font-sans), sans-serif',
        transition: 'transform .18s ease, border-color .18s ease',
      }}
    >
      <div aria-hidden="true" style={{ height: '100%' }}>{children}</div>
      {href
        ? <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={title} className="widget-hit" style={cover} {...focus} />
        : <button aria-label={label} title={title} onClick={onPress} onKeyDown={onKey} className="widget-hit" style={cover} {...focus} />}
    </div>
  );
}
