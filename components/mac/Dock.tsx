'use client';
import { useState, useEffect, useRef } from 'react';
import { T } from './tokens';
import type { Win, WinAction } from './winTypes';
import { requestResume } from './ResumeDialog';
import { APP_BG, appGlyph } from './appIcons';

// Icons
const ICONS: Record<string, React.ReactNode> = Object.fromEntries(
  ['about', 'projects', 'experience', 'skills', 'contact', 'resume', 'photos', 'weather'].map(id => [id, appGlyph(id, 'dk')]),
);

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

// Tile colors
const TRASH_BG = 'linear-gradient(160deg, rgba(88,96,112,.94) 0%, rgba(42,46,58,.96) 100%)';

const DOCK_ITEMS = [
  { id: 'about',      label: 'About Me',   bg: APP_BG.about, glow: 'rgba(46,125,233,.48)' },
  { id: 'projects',   label: 'Projects',   bg: APP_BG.projects, glow: 'rgba(42,174,79,.44)'  },
  { id: 'experience', label: 'Experience', bg: APP_BG.experience, glow: 'rgba(138,66,216,.44)' },
  { id: 'skills',     label: 'Skills',     bg: APP_BG.skills, glow: 'rgba(40,46,58,.55)'   },
  { id: 'contact',    label: 'Contact',    bg: APP_BG.contact, glow: 'rgba(232,64,79,.44)'  },
  { id: 'resume',     label: 'Resume',     bg: APP_BG.resume, glow: 'rgba(232,67,42,.44)'  },
];

// Shown only while running, after a divider
const RUNNING_ITEMS = [
  { id: 'photos',  label: 'Photos',  bg: APP_BG.photos, glow: 'rgba(140,110,220,.36)' },
  { id: 'weather', label: 'Weather', bg: APP_BG.weather, glow: 'rgba(42,134,232,.44)' },
];

const BASE = 64;

// Magnification is a smooth function of cursor distance
function magnify(mx: number | null, el: HTMLElement | null) {
  if (mx === null || !el) return { scale: 1, lift: 0 };
  const r = el.getBoundingClientRect();
  const d = Math.abs(mx - (r.left + r.width / 2));
  const t = Math.max(0, 1 - d / 150);
  const e = t * t * (3 - 2 * t); // smoothstep
  return { scale: 1 + 0.30 * e, lift: -11 * e };
}

// Module scope so the icon keeps its identity across renders
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
      onPointerEnter={e => { if (e.pointerType === 'mouse') setHovIdx(idx); }}
      onPointerLeave={() => setHovIdx(null)}
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
        aria-label={id === 'resume' ? 'Download Resume' : `Open ${label}`}
        style={{
          width: sz, height: sz, borderRadius: r,
          background: bg,
          border: '1px solid rgba(255,255,255,.16)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `scale(${scale}) translateY(${lift}px)`,
          transformOrigin: 'bottom center',
          // Fast follow while hovering, spring back on leave
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
        <div style={{
          position: 'absolute', top: 0, left: '-6%', right: '6%', height: '54%',
          background: 'linear-gradient(170deg,rgba(255,255,255,.30) 0%,rgba(255,255,255,.08) 50%,transparent 100%)',
          borderRadius: `${r}px ${r}px 0 0`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
          background: 'linear-gradient(0deg,rgba(0,0,0,.22) 0%,transparent 100%)',
          borderRadius: `0 0 ${r}px ${r}px`,
          pointerEvents: 'none',
        }} />
        {ICONS[id]}
      </button>

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

  // Shake the trash when a window is dropped on it
  useEffect(() => {
    const onShake = () => {
      setTrAnim(true);
      setTimeout(() => setTrAnim(false), 560);
    };
    window.addEventListener('dockTrashShake', onShake);
    return () => window.removeEventListener('dockTrashShake', onShake);
  }, []);

  const click = (id: string) => {
    if (id === 'resume') { requestResume(); return; }
    const w = wins.find(x => x.id === id);
    if (!w) return;
    if (w.isMin) dispatch({ type: 'RESTORE', id });
    else if (w.isOpen) dispatch({ type: 'FOCUS', id });
    else dispatch({ type: 'OPEN', id });
  };

  const running = RUNNING_ITEMS.filter(item => wins.some(w => w.id === item.id && (w.isOpen || w.isMin)));
  const divider = (
    <div style={{
      width: 1, height: 44, alignSelf: 'center', margin: '0 2px',
      background: dark
        ? 'linear-gradient(to bottom, transparent, rgba(255,255,255,.18), transparent)'
        : 'linear-gradient(to bottom, transparent, rgba(0,0,0,.16), transparent)',
    }} />
  );

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
      // Mouse only: a tap would leave the magnification and label stuck on
      onPointerMove={e => { if (e.pointerType === 'mouse') setMx(e.clientX); }}
      onPointerLeave={() => { setMx(null); setHovIdx(null); }}
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

      {running.length > 0 && <>
        {divider}
        {running.map((item, i) => (
          <div key={item.id} style={{ animation: 'dockIconIn .32s cubic-bezier(.2,1.3,.4,1) both' }}>
            <IconBtn
              {...item} idx={DOCK_ITEMS.length + i} mx={mx}
              wins={wins} hovIdx={hovIdx} setHovIdx={setHovIdx}
              dark={dark} tk={tk} onClick={click}
            />
          </div>
        ))}
      </>}

      {divider}

      <div
        ref={trashRef}
        style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          alignItems: 'center', width: BASE, flexShrink: 0,
        }}
        onPointerEnter={e => { if (e.pointerType === 'mouse') setTrHov(true); }}
        onPointerLeave={() => setTrHov(false)}
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
