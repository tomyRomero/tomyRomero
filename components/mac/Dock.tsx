'use client';
import { useState, useEffect } from 'react';
import { T } from './tokens';
import type { Win, WinAction } from './winTypes';

// ── Icons ─────────────────────────────────────────────────────────────────────
const ICONS: Record<string, React.ReactNode> = {
  about: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="rgba(255,255,255,.95)">
      <path d="M12 12c2.7 0 4-1.79 4-4s-1.3-4-4-4-4 1.79-4 4 1.3 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  ),
  projects: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="rgba(255,255,255,.95)">
      <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
    </svg>
  ),
  experience: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="rgba(255,255,255,.95)">
      <path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 3.15 16.85 2 15.5 2h-7C7.15 2 6 3.15 6 4.64c0 .48.11.92.18 1.36H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM8 4.64C8 4.25 8.35 4 8.5 4h7c.15 0 .5.25.5.64V6H8V4.64zM20 19H4v-9h16v9z"/>
    </svg>
  ),
  skills: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="rgba(255,255,255,.95)">
      <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
    </svg>
  ),
  contact: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="rgba(255,255,255,.95)">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  ),
};

const TrashSVG = ({ hot }: { hot: boolean }) => hot ? (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="rgba(255,230,80,.96)">
    <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66-1.49-1.46-1.82-3.87-.93-5.72-1 .23-1.83.75-2.54 1.32C8.87 6.4 7.85 10.07 9.07 13.22c.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12-.06-.05-.1-.1-.14-.17C6.87 12.33 6.69 10.28 7.45 8.64c-1.67 1.36-2.58 3.66-2.45 5.83.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.12 6.07-1.6 1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26z"/>
  </svg>
) : (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="rgba(255,255,255,.88)">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

// ── Dock item definitions ─────────────────────────────────────────────────────
const DOCK_ITEMS = [
  { id:'about',      label:'About Me',   bg:'linear-gradient(145deg,#1a46cc 0%,#3b82f6 50%,#6ba5ff 100%)', glow:'rgba(59,130,246,.55)' },
  { id:'projects',   label:'Projects',   bg:'linear-gradient(145deg,#055c40 0%,#059669 50%,#2ed490 100%)', glow:'rgba(5,150,105,.48)' },
  { id:'experience', label:'Experience', bg:'linear-gradient(145deg,#54189a 0%,#7c3aed 50%,#b07cfb 100%)', glow:'rgba(124,58,237,.48)' },
  { id:'skills',     label:'Skills',     bg:'linear-gradient(145deg,#874009 0%,#b45309 50%,#f5a623 100%)', glow:'rgba(180,83,9,.48)' },
  { id:'contact',    label:'Contact',    bg:'linear-gradient(145deg,#8c0f2c 0%,#be123c 50%,#f87291 100%)', glow:'rgba(190,18,60,.48)' },
];

const BASE = 60; // base icon size in px

// Only the hovered icon lifts; neighbors scale from bottom (transformOrigin handles visuals)
function getScale(idx: number, hov: number | null) {
  if (hov === null) return 1;
  const d = Math.abs(idx - hov);
  return d === 0 ? 1.52 : d === 1 ? 1.26 : d === 2 ? 1.08 : 1;
}
function getLift(idx: number, hov: number | null) {
  // ONLY the hovered icon gets a y-lift; neighbors expand from their base via scale
  return hov !== null && idx === hov ? -15 : 0;
}

interface Props { wins: Win[]; dark: boolean; dispatch: React.Dispatch<WinAction>; }

export default function Dock({ wins, dark, dispatch }: Props) {
  const tk = T(dark);
  const [hovIdx, setHovIdx]     = useState<number | null>(null);
  const [trHov, setTrHov]       = useState(false);
  const [trTarget, setTrTarget] = useState(false);   // window dragged near dock
  const [trAnim, setTrAnim]     = useState(false);
  const minimized = wins.filter(w => w.isMin);

  // Listen for window-near-dock events (from WinShell drag)
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

  // Shared icon-button renderer
  const IconBtn = ({
    id, label, bg, glow, idx, sz = BASE, opacity = 1,
  }: {
    id: string; label: string; bg: string; glow: string;
    idx: number; sz?: number; opacity?: number;
  }) => {
    const w      = wins.find(x => x.id === id);
    const isOpen = w?.isOpen && !w?.isMin;
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
        {/* Tooltip */}
        {isH && (
          <div style={{
            position: 'absolute', bottom: sz + 18, left: '50%',
            transform: 'translateX(-50%)',
            padding: '5px 11px', borderRadius: 8,
            background: dark ? 'rgba(16,16,20,.96)' : 'rgba(8,8,10,.93)',
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
              borderTop: `5px solid ${dark ? 'rgba(16,16,20,.96)' : 'rgba(8,8,10,.93)'}`,
            }} />
          </div>
        )}

        <button
          onClick={() => click(id)}
          style={{
            width: sz, height: sz, borderRadius: r,
            background: bg,
            border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `scale(${scale}) translateY(${lift}px)`,
            transformOrigin: 'bottom center',
            transition: 'transform .20s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease',
            boxShadow: isH
              ? `0 16px 40px ${glow}, 0 4px 12px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.26)`
              : `0 4px 12px rgba(0,0,0,.26), inset 0 1px 0 rgba(255,255,255,.18)`,
            cursor: 'pointer',
            position: 'relative', overflow: 'hidden', opacity,
          }}
        >
          {/* Specular sheen — slightly off-center for realism */}
          <div style={{
            position: 'absolute', top: 0, left: '-6%', right: '6%', height: '54%',
            background: 'linear-gradient(170deg,rgba(255,255,255,.26) 0%,rgba(255,255,255,.06) 50%,transparent 100%)',
            borderRadius: `${r}px ${r}px 0 0`,
            pointerEvents: 'none',
          }} />
          {/* Bottom depth */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
            background: 'linear-gradient(0deg,rgba(0,0,0,.20) 0%,transparent 100%)',
            borderRadius: `0 0 ${r}px ${r}px`,
            pointerEvents: 'none',
          }} />
          {ICONS[id]}
        </button>

        {/* Running indicator */}
        <div style={{
          width: 4, height: 4, borderRadius: '50%', marginTop: 5,
          background: isOpen ? (dark ? 'rgba(255,255,255,.80)' : 'rgba(0,0,0,.50)') : 'transparent',
          opacity: isOpen ? 1 : 0, transition: 'opacity .2s', flexShrink: 0,
        }} />
      </div>
    );
  };

  // Trash button
  const isTrashHot = trTarget || trHov;
  const trScale    = isTrashHot ? 1.52 : 1;
  const trLift     = isTrashHot ? -15  : 0;
  const r          = Math.round(BASE * 0.225);

  return (
    <div
      className="mac-dock"
      style={{
        position: 'fixed', bottom: 10, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'flex-end', gap: 10,
        padding: '10px 16px 9px',
        borderRadius: 24,
        background: dark ? 'rgba(16,16,22,.72)' : 'rgba(255,255,255,.62)',
        backdropFilter: 'blur(56px) saturate(2.2)',
        WebkitBackdropFilter: 'blur(56px) saturate(2.2)',
        border: `1px solid ${dark ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.88)'}`,
        boxShadow: dark
          ? '0 8px 48px rgba(0,0,0,.56), inset 0 1px 0 rgba(255,255,255,.07), inset 0 -1px 0 rgba(0,0,0,.20)'
          : '0 8px 48px rgba(0,0,0,.16), inset 0 1px 0 rgba(255,255,255,.95)',
        zIndex: 9995,
      }}
    >
      {DOCK_ITEMS.map((item, i) => (
        <IconBtn key={item.id} {...item} idx={i} />
      ))}

      {/* Minimized section */}
      {minimized.length > 0 && (
        <>
          <div style={{
            width: 1, height: 44, alignSelf: 'center', margin: '0 2px',
            background: dark ? 'rgba(255,255,255,.16)' : 'rgba(0,0,0,.14)',
          }} />
          {minimized.map((w, i) => {
            const def = DOCK_ITEMS.find(d => d.id === w.id);
            return def
              ? <IconBtn key={w.id + '-m'} {...def}
                  idx={DOCK_ITEMS.length + 1 + i}
                  sz={46} opacity={0.75}
                />
              : null;
          })}
        </>
      )}

      {/* Divider */}
      <div style={{
        width: 1, height: 44, alignSelf: 'center', margin: '0 2px',
        background: dark ? 'rgba(255,255,255,.16)' : 'rgba(0,0,0,.14)',
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
            position: 'absolute', bottom: BASE + 18, left: '50%',
            transform: 'translateX(-50%)',
            padding: '5px 11px', borderRadius: 8,
            background: trTarget ? 'rgba(200,30,50,.96)' : (dark ? 'rgba(16,16,20,.96)' : 'rgba(8,8,10,.93)'),
            color: '#f2f2f7', fontSize: 12, fontWeight: 500,
            whiteSpace: 'nowrap', fontFamily: 'var(--font-sans),sans-serif',
            border: '1px solid rgba(255,255,255,.12)',
            boxShadow: '0 4px 18px rgba(0,0,0,.44)', pointerEvents: 'none', zIndex: 2,
          }}>
            {trTarget ? 'Release to Close' : 'Trash'}
            <div style={{
              position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
              borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
              borderTop: `5px solid ${trTarget ? 'rgba(200,30,50,.96)' : (dark ? 'rgba(16,16,20,.96)' : 'rgba(8,8,10,.93)')}`,
            }} />
          </div>
        )}

        <div style={{
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
    </div>
  );
}
