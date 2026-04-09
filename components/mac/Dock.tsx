'use client';
import { useState, useEffect } from 'react';
import { T } from './tokens';
import type { Win, WinAction } from './winTypes';

// ── Icons — clear macOS-inspired symbols ──────────────────────────────────────
const ICONS: Record<string, React.ReactNode> = {
  about: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="11" r="6.5" fill="rgba(255,255,255,.96)" />
      <path d="M2 30c0-7.73 6.27-14 14-14s14 6.27 14 14" fill="rgba(255,255,255,.88)" />
    </svg>
  ),
  projects: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M3 9.5c0-1.66 1.34-3 3-3h7.5l2.5 2.5H29c1.1 0 2 .9 2 2v13c0 1.66-1.34 3-3 3H6c-1.66 0-3-1.34-3-3V9.5z"
        fill="rgba(255,255,255,.92)"
      />
      <line x1="9"  y1="18" x2="23" y2="18" stroke="rgba(30,140,90,.45)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="9"  y1="22" x2="18" y2="22" stroke="rgba(30,140,90,.35)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  experience: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="11" y="4" width="10" height="6" rx="2.5" fill="none" stroke="rgba(255,255,255,.88)" strokeWidth="2" />
      <rect x="3" y="10" width="26" height="18" rx="3.5" fill="rgba(255,255,255,.90)" />
      <rect x="3" y="17" width="26" height="4" fill="rgba(90,30,200,.22)" />
      <rect x="13.5" y="16" width="5" height="6" rx="1.5" fill="rgba(255,255,255,.95)" stroke="rgba(90,30,200,.55)" strokeWidth="1.5" />
    </svg>
  ),
  skills: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="4" width="28" height="24" rx="4" fill="rgba(0,0,0,.22)" stroke="rgba(255,255,255,.88)" strokeWidth="2" />
      <path d="M8 13.5l5.5 4.5-5.5 4.5" stroke="rgba(255,255,255,.95)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16.5" y1="22" x2="24" y2="22" stroke="rgba(255,255,255,.78)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  contact: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="8" width="28" height="18" rx="3" fill="rgba(255,255,255,.92)" />
      <path d="M2 11l14 9 14-9" stroke="rgba(180,20,48,.44)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
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

// ── Dock items with refined gradients ─────────────────────────────────────────
const DOCK_ITEMS = [
  { id:'about',      label:'About Me',   bg:'linear-gradient(145deg,#1a3fd4 0%,#3b82f6 50%,#60a5fa 100%)', glow:'rgba(59,130,246,.50)' },
  { id:'projects',   label:'Projects',   bg:'linear-gradient(145deg,#047857 0%,#059669 50%,#34d399 100%)', glow:'rgba(5,150,105,.44)' },
  { id:'experience', label:'Experience', bg:'linear-gradient(145deg,#5b21b6 0%,#7c3aed 50%,#a78bfa 100%)', glow:'rgba(124,58,237,.44)' },
  { id:'skills',     label:'Skills',     bg:'linear-gradient(145deg,#92400e 0%,#d4943a 50%,#f5c87a 100%)', glow:'rgba(212,148,58,.44)' },
  { id:'contact',    label:'Contact',    bg:'linear-gradient(145deg,#9f1239 0%,#e11d48 50%,#fb7185 100%)', glow:'rgba(225,29,72,.44)' },
];

const BASE = 64;

function getScale(idx: number, hov: number | null) {
  return hov !== null && idx === hov ? 1.38 : 1;
}
function getLift(idx: number, hov: number | null) {
  return hov !== null && idx === hov ? -10 : 0;
}

interface Props { wins: Win[]; dark: boolean; dispatch: React.Dispatch<WinAction>; }

export default function Dock({ wins, dark, dispatch }: Props) {
  const tk = T(dark);
  const [hovIdx, setHovIdx]     = useState<number | null>(null);
  const [trHov, setTrHov]       = useState(false);
  const [trTarget, setTrTarget] = useState(false);
  const [trAnim, setTrAnim]     = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ near: boolean }>;
      setTrTarget(ce.detail.near);
    };
    window.addEventListener('winNearDock', handler);
    return () => window.removeEventListener('winNearDock', handler);
  }, []);

  const click = (id: string) => {
    const w = wins.find(x => x.id === id);
    if (!w) return;
    if (w.isMin) dispatch({ type: 'RESTORE', id });
    else if (w.isOpen) dispatch({ type: 'FOCUS', id });
    else dispatch({ type: 'OPEN', id });
  };

  const IconBtn = ({
    id, label, bg, glow, idx, sz = BASE, opacity = 1,
  }: {
    id: string; label: string; bg: string; glow: string;
    idx: number; sz?: number; opacity?: number;
  }) => {
    const w      = wins.find(x => x.id === id);
    const isOpen = w?.isOpen || w?.isMin;
    const scale  = getScale(idx, hovIdx);
    const lift   = getLift(idx, hovIdx);
    const isH    = hovIdx === idx;
    const r      = Math.round(sz * 0.225);

    return (
      <div
        style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          alignItems: 'center', width: sz, flexShrink: 0,
        }}
        onMouseEnter={() => setHovIdx(idx)}
        onMouseLeave={() => setHovIdx(null)}
      >
        {isH && (
          <div style={{
            position: 'absolute', bottom: Math.round(sz * 1.38) + 20, left: '50%',
            transform: 'translateX(-50%)',
            padding: '5px 12px', borderRadius: 8,
            background: dark ? 'rgba(10,10,14,.96)' : 'rgba(8,8,10,.93)',
            color: '#f2f2f7', fontSize: 12, fontWeight: 500,
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
              borderTop: `5px solid ${dark ? 'rgba(10,10,14,.96)' : 'rgba(8,8,10,.93)'}`,
            }} />
          </div>
        )}

        <button
          data-dock-id={id}
          onClick={() => click(id)}
          aria-label={`Open ${label}`}
          style={{
            width: sz, height: sz, borderRadius: r,
            background: bg,
            border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `scale(${scale}) translateY(${lift}px)`,
            transformOrigin: 'bottom center',
            transition: 'transform .20s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease',
            boxShadow: isH
              ? `0 16px 44px ${glow}, 0 4px 14px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.28)`
              : `0 4px 12px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.20)`,
            cursor: 'pointer',
            position: 'relative', overflow: 'hidden', opacity,
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
          boxShadow: isOpen ? `0 0 6px ${tk.accent}` : 'none',
          opacity: isOpen ? 1 : 0, transition: 'opacity .2s', flexShrink: 0,
        }} />
      </div>
    );
  };

  const isTrashHot = trTarget || trHov;
  const trScale    = isTrashHot ? 1.38 : 1;
  const trLift     = isTrashHot ? -10  : 0;
  const r          = Math.round(BASE * 0.225);

  return (
    <nav
      className="mac-dock"
      role="navigation"
      aria-label="Application dock"
      style={{
        position: 'fixed', bottom: 10, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'flex-end', gap: 26,
        padding: '10px 22px 9px',
        borderRadius: 24,
        background: dark ? 'rgba(10,10,16,.75)' : 'rgba(255,255,255,.65)',
        backdropFilter: 'blur(60px) saturate(2.4)',
        WebkitBackdropFilter: 'blur(60px) saturate(2.4)',
        border: `1px solid ${dark ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.90)'}`,
        boxShadow: dark
          ? '0 8px 52px rgba(0,0,0,.60), inset 0 1px 0 rgba(255,255,255,.08), inset 0 -1px 0 rgba(0,0,0,.22)'
          : '0 8px 52px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.96)',
        zIndex: 9995,
      }}
    >
      {DOCK_ITEMS.map((item, i) => (
        <IconBtn key={item.id} {...item} idx={i} />
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
        style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          alignItems: 'center', width: BASE, flexShrink: 0,
        }}
        onMouseEnter={() => setTrHov(true)}
        onMouseLeave={() => setTrHov(false)}
      >
        {isTrashHot && (
          <div style={{
            position: 'absolute', bottom: Math.round(BASE * 1.38) + 20, left: '50%',
            transform: 'translateX(-50%)',
            padding: '5px 11px', borderRadius: 8,
            background: trTarget ? 'rgba(200,30,50,.96)' : (dark ? 'rgba(10,10,14,.96)' : 'rgba(8,8,10,.93)'),
            color: '#f2f2f7', fontSize: 12, fontWeight: 500,
            whiteSpace: 'nowrap', fontFamily: 'var(--font-sans),sans-serif',
            border: '1px solid rgba(255,255,255,.12)',
            boxShadow: '0 4px 18px rgba(0,0,0,.44)', pointerEvents: 'none', zIndex: 2,
          }}>
            {trTarget ? 'Release to Close' : 'Trash'}
            <div style={{
              position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
              borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
              borderTop: `5px solid ${trTarget ? 'rgba(200,30,50,.96)' : (dark ? 'rgba(10,10,14,.96)' : 'rgba(8,8,10,.93)')}`,
            }} />
          </div>
        )}

        <div
          data-dock-trash="true"
          style={{
          width: BASE, height: BASE, borderRadius: r,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: trTarget
            ? 'linear-gradient(145deg,#7f1d1d 0%,#dc2626 50%,#ef4444 100%)'
            : 'linear-gradient(145deg,#1e2532 0%,#374151 50%,#6b7280 100%)',
          transform: `scale(${trScale}) translateY(${trLift}px)`,
          transformOrigin: 'bottom center',
          transition: 'transform .20s cubic-bezier(.34,1.56,.64,1), background .22s ease, box-shadow .18s',
          boxShadow: trTarget
            ? '0 16px 40px rgba(220,38,38,.62), inset 0 1px 0 rgba(255,255,255,.22)'
            : isTrashHot
              ? '0 16px 40px rgba(107,114,128,.40), inset 0 1px 0 rgba(255,255,255,.14)'
              : '0 4px 12px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.10)',
          animation: trAnim ? 'trashShake .55s ease' : 'none',
          cursor: 'default',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '-6%', right: '6%', height: '54%',
            background: 'linear-gradient(170deg,rgba(255,255,255,.22) 0%,transparent 100%)',
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
