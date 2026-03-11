'use client';
import { useState } from 'react';
import { T } from './tokens';
import type { Win, WinAction } from './winTypes';

const DOCK_ITEMS = [
  { id: 'about',      label: 'About',      icon: '👤', bg: 'linear-gradient(145deg,#1a4a82,#2870bc)' },
  { id: 'projects',   label: 'Projects',   icon: '🗂️', bg: 'linear-gradient(145deg,#662e14,#b45218)' },
  { id: 'experience', label: 'Experience', icon: '💼', bg: 'linear-gradient(145deg,#124824,#208040)' },
  { id: 'skills',     label: 'Skills',     icon: '⚡', bg: 'linear-gradient(145deg,#484810,#7a7c1a)' },
  { id: 'contact',    label: 'Contact',    icon: '✉️', bg: 'linear-gradient(145deg,#441244,#742474)' },
];

interface Props {
  wins: Win[];
  dark: boolean;
  dispatch: React.Dispatch<WinAction>;
}

export default function Dock({ wins, dark, dispatch }: Props) {
  const tk = T(dark);
  const [hov, setHov] = useState<string | null>(null);
  const [trHov, setTrHov] = useState(false);
  const [trOver, setTrOver] = useState(false);
  const [trAnim, setTrAnim] = useState(false);
  const minimized = wins.filter(w => w.isMin);

  const click = (id: string) => {
    const w = wins.find(x => x.id === id);
    if (!w) return;
    if (w.isMin) dispatch({ type: 'RESTORE', id });
    else if (w.isOpen) dispatch({ type: 'FOCUS', id });
    else dispatch({ type: 'OPEN', id });
  };

  const drop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('windowId');
    if (id) { dispatch({ type: 'CLOSE', id }); setTrAnim(true); setTimeout(() => setTrAnim(false), 700); }
    setTrOver(false);
  };

  const DockIcon = ({ id, label, icon, bg, isMin = false }: {
    id: string; label: string; icon: string; bg: string; isMin?: boolean;
  }) => {
    const w = wins.find(x => x.id === id);
    const isOpen = w?.isOpen && !w?.isMin;
    const hovKey = isMin ? id + '-min' : id;
    const isH = hov === hovKey;
    const sz = isMin ? 46 : 54;
    return (
      <div
        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        onMouseEnter={() => setHov(hovKey)}
        onMouseLeave={() => setHov(null)}
      >
        {isH && (
          <div style={{
            position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
            transform: 'translateX(-50%)', padding: '4px 11px', borderRadius: 7,
            background: 'rgba(20,20,24,.92)', color: '#f2f2f7', fontSize: 12,
            whiteSpace: 'nowrap', fontFamily: 'var(--font-sans), sans-serif',
            backdropFilter: 'blur(12px)', boxShadow: '0 2px 12px rgba(0,0,0,.32)',
            animation: 'fadeIn .1s ease', pointerEvents: 'none',
          }}>
            {label}
          </div>
        )}
        <button
          onClick={() => click(id)}
          style={{
            width: sz, height: sz,
            borderRadius: Math.round(sz * .24),
            background: bg, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: isMin ? 21 : 26,
            transform: `scale(${isH ? 1.28 : 1}) translateY(${isH ? -10 : 0}px)`,
            transition: 'transform .2s cubic-bezier(.16,1,.3,1)',
            boxShadow: isH ? '0 8px 24px rgba(0,0,0,.32)' : '0 2px 8px rgba(0,0,0,.18)',
            cursor: 'default',
          }}
        >
          {icon}
        </button>
        <div style={{
          width: 4, height: 4, borderRadius: '50%', marginTop: 4,
          background: isOpen ? (dark ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.5)') : 'transparent',
          opacity: isOpen ? 1 : 0, transition: 'opacity .2s',
        }} />
      </div>
    );
  };

  return (
    <div
      className="mac-dock"
      style={{
        position: 'fixed', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 6, padding: '7px 11px', borderRadius: 20,
        background: tk.dockBg,
        backdropFilter: 'blur(40px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
        border: `1px solid ${tk.dockBorder}`,
        boxShadow: '0 4px 32px rgba(0,0,0,.18),0 1px 4px rgba(0,0,0,.1)',
        zIndex: 9995,
      }}
    >
      {DOCK_ITEMS.map(item => (
        <DockIcon key={item.id} {...item} />
      ))}

      {/* Minimized windows section */}
      {minimized.length > 0 && (
        <>
          <div style={{ width: 1, height: 38, background: tk.dockBorder, margin: '0 4px', alignSelf: 'center' }} />
          {minimized.map(w => {
            const def = DOCK_ITEMS.find(d => d.id === w.id);
            return def ? <DockIcon key={w.id + '-min'} {...def} isMin /> : null;
          })}
        </>
      )}

      {/* Separator */}
      <div style={{ width: 1, height: 38, background: tk.dockBorder, margin: '0 4px', alignSelf: 'center' }} />

      {/* Trash */}
      <div
        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        onMouseEnter={() => setTrHov(true)}
        onMouseLeave={() => { setTrHov(false); setTrOver(false); }}
        onDragOver={e => { e.preventDefault(); setTrOver(true); }}
        onDragLeave={() => setTrOver(false)}
        onDrop={drop}
      >
        {(trHov || trOver) && (
          <div style={{
            position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
            transform: 'translateX(-50%)', padding: '4px 11px', borderRadius: 7,
            background: 'rgba(20,20,24,.92)', color: '#f2f2f7', fontSize: 12,
            whiteSpace: 'nowrap', fontFamily: 'var(--font-sans), sans-serif',
            pointerEvents: 'none',
          }}>
            {trOver ? 'Drop to close' : 'Trash'}
          </div>
        )}
        <div style={{
          width: 54, height: 54, borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
          background: trOver ? 'linear-gradient(145deg,#8a1800,#e84040)' : 'linear-gradient(145deg,#555,#888)',
          transform: `scale(${(trHov || trOver) ? 1.28 : 1}) translateY(${(trHov || trOver) ? -10 : 0}px)`,
          transition: 'transform .2s cubic-bezier(.16,1,.3,1), background .18s',
          boxShadow: trOver ? '0 0 24px rgba(232,64,64,.48)' : '0 2px 8px rgba(0,0,0,.18)',
          animation: trAnim ? 'trashShake .55s ease' : 'none',
          cursor: 'default',
        }}>
          {trOver ? '🔥' : '🗑️'}
        </div>
        <div style={{ width: 4, height: 4, opacity: 0, marginTop: 4 }} />
      </div>
    </div>
  );
}
