'use client';
import { useState, useEffect, useRef } from 'react';
import { T } from './tokens';
import type { Win, WinAction } from './winTypes';

// ── Icons — layered artwork with internal gradients (gradient IDs are
// prefixed per icon; all five render into the same DOM) ───────────────────────
const ICONS: Record<string, React.ReactNode> = {
  about: (
    <svg width="33" height="33" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="dk-ab" x1="16" y1="3" x2="16" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d6e8ff" />
        </linearGradient>
      </defs>
      <path d="M3.5 29.5c0-6.9 5.6-12.5 12.5-12.5s12.5 5.6 12.5 12.5" fill="url(#dk-ab)" fillOpacity=".92" />
      <circle cx="16" cy="10.4" r="6.3" fill="url(#dk-ab)" />
      <circle cx="16" cy="10.4" r="6.3" stroke="rgba(15,70,160,.22)" strokeWidth=".8" />
    </svg>
  ),
  projects: (
    <svg width="33" height="33" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="dk-pr" x1="16" y1="11" x2="16" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d9f5e0" />
        </linearGradient>
      </defs>
      <path d="M3 8.6C3 7.2 4.2 6 5.6 6h6.1c.7 0 1.4.28 1.9.78l1.7 1.72h10.1c1.4 0 2.6 1.2 2.6 2.6v1.9H3V8.6z" fill="rgba(255,255,255,.68)" />
      <path d="M3 11.6h26v11.8c0 1.4-1.2 2.6-2.6 2.6H5.6C4.2 26 3 24.8 3 23.4V11.6z" fill="url(#dk-pr)" />
      <path d="M3 11.6h26v1.1H3z" fill="rgba(15,110,55,.12)" />
    </svg>
  ),
  experience: (
    <svg width="33" height="33" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="dk-ex" x1="16" y1="9" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#eadffb" />
        </linearGradient>
      </defs>
      <rect x="11.5" y="4.5" width="9" height="5.5" rx="2.2" stroke="rgba(255,255,255,.92)" strokeWidth="2" />
      <rect x="3" y="9" width="26" height="19" rx="3.6" fill="url(#dk-ex)" />
      <path d="M3 16.4h26v2.4H3z" fill="rgba(95,35,190,.14)" />
      <rect x="13.4" y="15.3" width="5.2" height="5.8" rx="1.6" fill="#fff" stroke="rgba(95,35,190,.45)" strokeWidth="1.4" />
    </svg>
  ),
  skills: (
    <svg width="33" height="33" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="dk-sk" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgba(255,255,255,.16)" />
          <stop offset="1" stopColor="rgba(255,255,255,.05)" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="4.5" width="27" height="23" rx="4" fill="url(#dk-sk)" stroke="rgba(255,255,255,.85)" strokeWidth="1.6" />
      <circle cx="7.2"  cy="9" r="1.1" fill="#ff5f57" />
      <circle cx="10.8" cy="9" r="1.1" fill="#ffbd2e" />
      <circle cx="14.4" cy="9" r="1.1" fill="#28ca41" />
      <path d="M7.5 15.2l4.6 3.6-4.6 3.6" stroke="#8be28f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="15.6" y1="22.4" x2="23.2" y2="22.4" stroke="rgba(255,255,255,.85)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  contact: (
    <svg width="33" height="33" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="dk-co" x1="16" y1="7" x2="16" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffe2e6" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="7" width="27" height="18.5" rx="3.2" fill="url(#dk-co)" />
      <path d="M3.6 9.4L16 18.2 28.4 9.4" stroke="rgba(195,30,55,.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2.5" y="7" width="27" height="18.5" rx="3.2" stroke="rgba(195,30,55,.14)" strokeWidth=".8" />
    </svg>
  ),
};

const TrashSVG = ({ hot }: { hot: boolean }) => {
  const body = hot ? 'rgba(255,230,80,.92)' : 'rgba(255,255,255,.88)';
  const line = hot ? 'rgba(220,38,38,.52)'  : 'rgba(90,100,130,.40)';
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="11" y="4" width="10" height="3.5" rx="1.75" fill={hot ? 'rgba(255,230,80,.80)' : 'rgba(255,255,255,.70)'} />
      <rect x="5"  y="7" width="22" height="2.8" rx="1.4"  fill={body} />
      <path d="M8 9.8h16l-2 18H10L8 9.8z" fill={body} />
      <line x1="16"   y1="12.5" x2="16"   y2="24.5" stroke={line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="12.5" y1="12.5" x2="13"   y2="24.5" stroke={line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="19.5" y1="12.5" x2="19"   y2="24.5" stroke={line} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
};

// ── Dock tiles — Apple-style per-app colors (the one place the app keeps
// its vivid palette; everything else stays quiet) ────────────────────────────
const TRASH_BG = 'linear-gradient(160deg, rgba(88,96,112,.94) 0%, rgba(42,46,58,.96) 100%)';

const DOCK_ITEMS = [
  { id: 'about',      label: 'About Me',   bg: 'linear-gradient(160deg,#5FB6F9 0%,#2E7DE9 55%,#1D5FD0 100%)', glow: 'rgba(46,125,233,.48)' },
  { id: 'projects',   label: 'Projects',   bg: 'linear-gradient(160deg,#57D96D 0%,#2AAE4F 55%,#1E8B3E 100%)', glow: 'rgba(42,174,79,.44)'  },
  { id: 'experience', label: 'Experience', bg: 'linear-gradient(160deg,#BB79F2 0%,#8A42D8 55%,#6E2FBF 100%)', glow: 'rgba(138,66,216,.44)' },
  { id: 'skills',     label: 'Skills',     bg: 'linear-gradient(160deg,#3E4654 0%,#23272f 55%,#15181f 100%)', glow: 'rgba(40,46,58,.55)'   },
  { id: 'contact',    label: 'Contact',    bg: 'linear-gradient(160deg,#FB7A87 0%,#E8404F 55%,#C82737 100%)', glow: 'rgba(232,64,79,.44)'  },
];

const BASE = 64;

// Continuous magnification: scale is a smooth function of the horizontal
// distance between the cursor and each icon's center, like the real dock.
// No discrete per-icon jumps, so nothing snaps or flickers.
function magnify(mx: number | null, el: HTMLElement | null) {
  if (mx === null || !el) return { scale: 1, lift: 0 };
  const r = el.getBoundingClientRect();
  const d = Math.abs(mx - (r.left + r.width / 2));
  const t = Math.max(0, 1 - d / 150);
  const e = t * t * (3 - 2 * t); // smoothstep
  return { scale: 1 + 0.30 * e, lift: -11 * e };
}

// Defined at module scope (NOT inside Dock) so React keeps the same component
// identity across Dock re-renders — otherwise the icon subtree remounts on
// every hover and the transitions snap instead of animating.
function IconBtn({
  id, label, bg, glow, idx, mx, sz = BASE,
  wins, hovIdx, setHovIdx, dark, tk, onClick,
}: {
  id: string; label: string; bg: string; glow: string; idx: number; mx: number | null; sz?: number;
  wins: Win[]; hovIdx: number | null; setHovIdx: (n: number | null) => void;
  dark: boolean; tk: ReturnType<typeof T>; onClick: (id: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const w      = wins.find(x => x.id === id);
  const isOpen = w?.isOpen || w?.isMin;
  const isH    = hovIdx === idx;
  const r      = Math.round(sz * 0.225);
  const { scale, lift } = magnify(mx, wrapRef.current);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column',
        alignItems: 'center', width: sz, flexShrink: 0,
      }}
      onMouseEnter={() => setHovIdx(idx)}
      onMouseLeave={() => setHovIdx(null)}
    >
      {isH && (
        <div style={{
          position: 'absolute', bottom: Math.round(sz * 1.3) + 20, left: '50%',
          transform: 'translateX(-50%)',
          padding: '5px 12px', borderRadius: 8,
          background: dark ? 'rgba(12,13,17,.96)' : 'rgba(10,11,14,.93)',
          color: '#f2f3f6', fontSize: 12, fontWeight: 500,
          whiteSpace: 'nowrap', fontFamily: 'var(--font-sans),sans-serif',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,.10)',
          boxShadow: '0 4px 18px rgba(0,0,0,.44)',
          animation: 'fadeIn .12s ease', pointerEvents: 'none', zIndex: 2,
        }}>
          {label}
          <div style={{
            position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
            borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
            borderTop: `5px solid ${dark ? 'rgba(12,13,17,.96)' : 'rgba(10,11,14,.93)'}`,
          }} />
        </div>
      )}

      <button
        data-dock-id={id}
        onClick={() => onClick(id)}
        aria-label={`Open ${label}`}
        style={{
          width: sz, height: sz, borderRadius: r,
          background: bg,
          border: '1px solid rgba(255,255,255,.16)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `scale(${scale}) translateY(${lift}px)`,
          transformOrigin: 'bottom center',
          // Fast linear follow while the cursor is over the dock; springy
          // settle when it leaves.
          transition: mx !== null
            ? 'transform .08s linear, box-shadow .18s ease'
            : 'transform .30s cubic-bezier(.22,1,.36,1), box-shadow .18s ease',
          boxShadow: isH
            ? `0 16px 44px ${glow}, 0 4px 14px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.28)`
            : `0 4px 12px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.20)`,
          cursor: 'pointer',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Specular sheen */}
        <div style={{
          position: 'absolute', top: 0, left: '-6%', right: '6%', height: '54%',
          background: 'linear-gradient(170deg,rgba(255,255,255,.30) 0%,rgba(255,255,255,.08) 50%,transparent 100%)',
          borderRadius: `${r}px ${r}px 0 0`,
          pointerEvents: 'none',
        }} />
        {/* Bottom depth */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
          background: 'linear-gradient(0deg,rgba(0,0,0,.22) 0%,transparent 100%)',
          borderRadius: `0 0 ${r}px ${r}px`,
          pointerEvents: 'none',
        }} />
        {ICONS[id]}
      </button>

      {/* Running indicator dot */}
      <div style={{
        width: 4, height: 4, borderRadius: '50%', marginTop: 5,
        background: isOpen ? tk.accent : 'transparent',
        opacity: isOpen ? 1 : 0, transition: 'opacity .2s', flexShrink: 0,
      }} />
    </div>
  );
}

interface Props { wins: Win[]; dark: boolean; dispatch: React.Dispatch<WinAction>; }

export default function Dock({ wins, dark, dispatch }: Props) {
  const tk = T(dark);
  const [hovIdx, setHovIdx]     = useState<number | null>(null);
  const [mx, setMx]             = useState<number | null>(null);
  const [trHov, setTrHov]       = useState(false);
  const [trTarget, setTrTarget] = useState(false);
  const [trAnim, setTrAnim]     = useState(false);
  const trashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ near: boolean }>;
      setTrTarget(ce.detail.near);
    };
    window.addEventListener('winNearDock', handler);
    return () => window.removeEventListener('winNearDock', handler);
  }, []);

  // Play the trash "shake" when a window is dropped into the dock to delete it
  useEffect(() => {
    const onShake = () => {
      setTrAnim(true);
      setTimeout(() => setTrAnim(false), 560);
    };
    window.addEventListener('dockTrashShake', onShake);
    return () => window.removeEventListener('dockTrashShake', onShake);
  }, []);

  const click = (id: string) => {
    const w = wins.find(x => x.id === id);
    if (!w) return;
    if (w.isMin) dispatch({ type: 'RESTORE', id });
    else if (w.isOpen) dispatch({ type: 'FOCUS', id });
    else dispatch({ type: 'OPEN', id });
  };

  const isTrashHot = trTarget || trHov;
  const trMag      = magnify(mx, trashRef.current);
  const trScale    = trTarget ? 1.30 : trMag.scale;
  const trLift     = trTarget ? -11  : trMag.lift;
  const r          = Math.round(BASE * 0.225);

  return (
    <nav
      className="mac-dock"
      role="navigation"
      aria-label="Application dock"
      onMouseMove={e => setMx(e.clientX)}
      onMouseLeave={() => { setMx(null); setHovIdx(null); }}
      style={{
        position: 'fixed', bottom: 10, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'flex-end', gap: 26,
        padding: '10px 22px 9px',
        borderRadius: 24,
        background: dark ? 'rgba(12,13,18,.75)' : 'rgba(255,255,255,.65)',
        backdropFilter: 'blur(60px) saturate(2.4)',
        WebkitBackdropFilter: 'blur(60px) saturate(2.4)',
        border: `1px solid ${dark ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.90)'}`,
        boxShadow: dark
          ? '0 8px 52px rgba(0,0,0,.60), inset 0 1px 0 rgba(255,255,255,.08), inset 0 -1px 0 rgba(0,0,0,.22)'
          : '0 8px 52px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.96)',
        zIndex: 9995,
        animation: 'dockSlideUp .5s .15s cubic-bezier(.16,1,.3,1) both',
      }}
    >
      {DOCK_ITEMS.map((item, i) => (
        <IconBtn
          key={item.id} {...item} idx={i} mx={mx}
          wins={wins} hovIdx={hovIdx} setHovIdx={setHovIdx}
          dark={dark} tk={tk} onClick={click}
        />
      ))}

      {/* Divider */}
      <div style={{
        width: 1, height: 44, alignSelf: 'center', margin: '0 2px',
        background: dark
          ? 'linear-gradient(to bottom, transparent, rgba(255,255,255,.18), transparent)'
          : 'linear-gradient(to bottom, transparent, rgba(0,0,0,.16), transparent)',
      }} />

      {/* Trash */}
      <div
        ref={trashRef}
        style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          alignItems: 'center', width: BASE, flexShrink: 0,
        }}
        onMouseEnter={() => setTrHov(true)}
        onMouseLeave={() => setTrHov(false)}
      >
        {isTrashHot && (
          <div style={{
            position: 'absolute', bottom: Math.round(BASE * 1.3) + 20, left: '50%',
            transform: 'translateX(-50%)',
            padding: '5px 11px', borderRadius: 8,
            background: trTarget ? 'rgba(200,30,50,.96)' : (dark ? 'rgba(12,13,17,.96)' : 'rgba(10,11,14,.93)'),
            color: '#f2f3f6', fontSize: 12, fontWeight: 500,
            whiteSpace: 'nowrap', fontFamily: 'var(--font-sans),sans-serif',
            border: '1px solid rgba(255,255,255,.12)',
            boxShadow: '0 4px 18px rgba(0,0,0,.44)', pointerEvents: 'none', zIndex: 2,
          }}>
            {trTarget ? 'Release to Close' : 'Trash · drop a window here to close it'}
            <div style={{
              position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
              borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
              borderTop: `5px solid ${trTarget ? 'rgba(200,30,50,.96)' : (dark ? 'rgba(12,13,17,.96)' : 'rgba(10,11,14,.93)')}`,
            }} />
          </div>
        )}

        <div
          data-dock-trash="true"
          role="button"
          tabIndex={0}
          aria-label="Trash. Drag a window here to close it."
          onClick={() => window.dispatchEvent(new Event('dockTrashShake'))}
          onKeyDown={e => { if (e.key === 'Enter') window.dispatchEvent(new Event('dockTrashShake')); }}
          style={{
          width: BASE, height: BASE, borderRadius: r,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: trTarget
            ? 'linear-gradient(145deg,#7f1d1d 0%,#dc2626 50%,#ef4444 100%)'
            : TRASH_BG,
          border: '1px solid rgba(255,255,255,.14)',
          transform: `scale(${trScale}) translateY(${trLift}px)`,
          transformOrigin: 'bottom center',
          transition: mx !== null && !trTarget
            ? 'transform .08s linear, background .22s ease, box-shadow .18s'
            : 'transform .30s cubic-bezier(.22,1,.36,1), background .22s ease, box-shadow .18s',
          boxShadow: trTarget
            ? '0 16px 40px rgba(220,38,38,.62), inset 0 1px 0 rgba(255,255,255,.22)'
            : isTrashHot
              ? '0 16px 40px rgba(15,25,45,.45), inset 0 1px 0 rgba(255,255,255,.14)'
              : '0 4px 12px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.10)',
          animation: trAnim ? 'trashShake .55s ease' : 'none',
          cursor: 'pointer',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '-6%', right: '6%', height: '54%',
            background: 'linear-gradient(170deg,rgba(255,255,255,.18) 0%,transparent 100%)',
            borderRadius: `${r}px ${r}px 0 0`, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
            background: 'linear-gradient(0deg,rgba(0,0,0,.22) 0%,transparent 100%)',
            borderRadius: `0 0 ${r}px ${r}px`, pointerEvents: 'none',
          }} />
          <TrashSVG hot={trTarget} />
        </div>
        <div style={{ width: 4, height: 4, opacity: 0, marginTop: 5, flexShrink: 0 }} />
      </div>
    </nav>
  );
}
