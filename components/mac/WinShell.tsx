'use client';
import { useRef, useEffect, useState } from 'react';
import { T } from './tokens';
import type { Win, WinAction } from './winTypes';

function TrafficLights({ win, dispatch }: { win: Win; dispatch: React.Dispatch<WinAction> }) {
  const [hov, setHov] = useState(false);
  const doMin = () => {
    dispatch({ type: 'MIN_START', id: win.id });
    setTimeout(() => dispatch({ type: 'MIN_DONE', id: win.id }), 280);
  };
  const sp = (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); };
  const btn = (bg: string): React.CSSProperties => ({
    width: 13, height: 13, borderRadius: '50%', background: bg,
    border: 'none', cursor: 'default', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    transition: 'filter .12s',
  });

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 7, paddingLeft: 14, paddingRight: 6 }}
    >
      <button
        style={btn('#ff5f57')}
        onClick={e => { sp(e); dispatch({ type: 'CLOSE', id: win.id }); }}
        onMouseDown={sp}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(.82)')}
        onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
        title="Close"
      >
        {hov && (
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <line x1="1" y1="1" x2="5" y2="5" stroke="rgba(100,0,0,.7)" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="5" y1="1" x2="1" y2="5" stroke="rgba(100,0,0,.7)" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        )}
      </button>
      <button
        style={btn('#ffbd2e')}
        onClick={e => { sp(e); doMin(); }}
        onMouseDown={sp}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(.82)')}
        onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
        title="Minimize"
      >
        {hov && (
          <svg width="7" height="2" viewBox="0 0 7 2">
            <line x1=".5" y1="1" x2="6.5" y2="1" stroke="rgba(80,48,0,.65)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        )}
      </button>
      <button
        style={btn('#28ca41')}
        onClick={e => { sp(e); dispatch({ type: 'TOGGLE_MAX', id: win.id }); }}
        onMouseDown={sp}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(.82)')}
        onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
        title={win.isMax ? 'Restore' : 'Maximize'}
      >
        {hov && (
          win.isMax
            ? <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M5.5.5H7.5V2.5M2.5 7.5H.5V5.5" stroke="rgba(0,50,0,.65)" strokeWidth="1.2" strokeLinecap="round" /></svg>
            : <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M.5 5V.5H5M3 7.5H7.5V3" stroke="rgba(0,50,0,.65)" strokeWidth="1.2" strokeLinecap="round" /></svg>
        )}
      </button>
    </div>
  );
}

interface Props {
  win: Win;
  dark: boolean;
  dispatch: React.Dispatch<WinAction>;
  focused: boolean;
  onFocus: (id: string) => void;
  children: React.ReactNode;
}

export default function WinShell({ win, dark, dispatch, focused, onFocus, children }: Props) {
  const tk = T(dark);
  const el = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const rz = useRef(false);
  const dOff = useRef({ x: 0, y: 0 });
  const rzStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    const mv = (e: MouseEvent) => {
      if (drag.current && el.current) {
        el.current.style.left = Math.max(0, e.clientX - dOff.current.x) + 'px';
        el.current.style.top  = Math.max(28, e.clientY - dOff.current.y) + 'px';
      }
      if (rz.current && el.current) {
        el.current.style.width  = Math.max(330, rzStart.current.w + e.clientX - rzStart.current.x) + 'px';
        el.current.style.height = Math.max(200, rzStart.current.h + e.clientY - rzStart.current.y) + 'px';
      }
    };
    const up = () => {
      if (drag.current && el.current) {
        dispatch({ type: 'MOVE', id: win.id, x: parseInt(el.current.style.left), y: parseInt(el.current.style.top) });
        drag.current = false;
      }
      if (rz.current && el.current) {
        dispatch({ type: 'RESIZE', id: win.id, w: parseInt(el.current.style.width), h: parseInt(el.current.style.height) });
        rz.current = false;
      }
    };
    window.addEventListener('mousemove', mv);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up); };
  }, [win.id, dispatch]);

  if (!win.isOpen && !win.minning) return null;

  const anim: React.CSSProperties = win.minning
    ? { animation: 'winMin .28s cubic-bezier(.4,0,1,1) forwards' }
    : { animation: 'winOpen .25s cubic-bezier(.16,1,.3,1)' };

  return (
    <div
      ref={el}
      className="mac-window"
      draggable={!win.isMax}
      onDragStart={e => {
        e.dataTransfer.setData('windowId', win.id);
        const g = document.createElement('div');
        g.style.cssText = 'position:fixed;opacity:0;width:1px;height:1px;';
        document.body.appendChild(g);
        e.dataTransfer.setDragImage(g, 0, 0);
        setTimeout(() => g.remove(), 0);
      }}
      onMouseDown={() => onFocus(win.id)}
      style={{
        position: 'absolute',
        left: win.pos.x,
        top:  win.pos.y,
        width:  win.isMax ? '100vw' : win.sz.w,
        height: win.isMax ? 'calc(100vh - 108px)' : win.sz.h,
        zIndex: win.z,
        display: 'flex', flexDirection: 'column',
        background: tk.winBg,
        backdropFilter: 'blur(44px) saturate(1.85)',
        WebkitBackdropFilter: 'blur(44px) saturate(1.85)',
        border: `1px solid ${focused ? tk.borderFoc : tk.border}`,
        borderRadius: win.isMax ? 0 : 14,
        boxShadow: focused ? tk.shadowFoc : tk.shadow,
        overflow: 'hidden',
        transition: 'box-shadow .2s, border-color .2s',
        fontFamily: 'var(--font-sans), sans-serif',
        ...anim,
      }}
    >
      {/* Title bar */}
      <div
        onMouseDown={e => {
          if ((e.target as HTMLElement).closest('[data-tl]') || win.isMax) return;
          drag.current = true;
          const r = el.current!.getBoundingClientRect();
          dOff.current = { x: e.clientX - r.left, y: e.clientY - r.top };
          onFocus(win.id);
          e.preventDefault();
        }}
        onDoubleClick={() => dispatch({ type: 'TOGGLE_MAX', id: win.id })}
        style={{
          height: 44, background: tk.titleBg,
          borderBottom: `1px solid ${tk.border}`,
          display: 'flex', alignItems: 'center',
          flexShrink: 0, position: 'relative',
          cursor: win.isMax ? 'default' : 'grab',
          userSelect: 'none',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div data-tl="">
          <TrafficLights win={win} dispatch={dispatch} />
        </div>
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          fontSize: 13, fontWeight: 500,
          color: focused ? tk.textSub : tk.textMuted,
          pointerEvents: 'none', whiteSpace: 'nowrap', letterSpacing: .1,
        }}>
          {win.title}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{
        flex: 1, overflowY: 'auto', scrollbarWidth: 'thin',
        scrollbarColor: `${dark ? 'rgba(255,255,255,.16)' : 'rgba(0,0,0,.16)'} transparent`,
      }}>
        {children}
      </div>

      {/* Resize handle */}
      {!win.isMax && (
        <div
          onMouseDown={e => {
            e.preventDefault(); e.stopPropagation();
            rz.current = true;
            rzStart.current = {
              x: e.clientX, y: e.clientY,
              w: el.current!.offsetWidth, h: el.current!.offsetHeight,
            };
            onFocus(win.id);
          }}
          style={{ position: 'absolute', right: 0, bottom: 0, width: 18, height: 18, cursor: 'se-resize', zIndex: 2 }}
        >
          <svg style={{ position: 'absolute', right: 3, bottom: 3 }} width="9" height="9" viewBox="0 0 9 9">
            <path d="M8 1v7H1" stroke={dark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.18)'} strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
}
