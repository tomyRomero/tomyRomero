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
    border: 'none', cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    transition: 'filter .12s, transform .1s',
  });

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 7, paddingLeft: 14, paddingRight: 6 }}
    >
      <button
        style={btn('#ff5f57')}
        onClick={e => { sp(e); dispatch({ type: 'CLOSE_START', id: win.id }); }}
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
  const el         = useRef<HTMLDivElement>(null);
  const drag       = useRef(false);
  const rzRight    = useRef(false);
  const rzBottom   = useRef(false);
  const rzLeft     = useRef(false);
  const rzTop      = useRef(false);
  const dOff       = useRef({ x: 0, y: 0 });
  const rzStart    = useRef({ x: 0, y: 0, w: 0, h: 0, left: 0, top: 0 });
  const lastMouseY = useRef(0);

  const DOCK_ZONE = 110;

  // ── Minimize animation: fly toward dock icon ───────────────────────────────
  useEffect(() => {
    if (!win.minning || !el.current) return;
    const el$ = el.current;
    const wr  = el$.getBoundingClientRect();
    const winCX = wr.left + wr.width  / 2;
    const winCY = wr.top  + wr.height / 2;

    const dockIcon = document.querySelector(`[data-dock-id="${win.id}"]`);
    let tX = window.innerWidth / 2, tY = window.innerHeight - 50;
    if (dockIcon) {
      const ir = dockIcon.getBoundingClientRect();
      tX = ir.left + ir.width  / 2;
      tY = ir.top  + ir.height / 2;
    }

    const a = el$.animate([
      { opacity: 1, transform: 'translate(0, 0) scale(1)' },
      { opacity: 0, transform: `translate(${tX - winCX}px, ${tY - winCY}px) scale(0.04)` },
    ], { duration: 280, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });

    return () => a.cancel();
  }, [win.minning, win.id]);

  // ── Close animation: fly toward trash icon ─────────────────────────────────
  useEffect(() => {
    if (!win.closing || !el.current) return;
    const el$ = el.current;
    const wr  = el$.getBoundingClientRect();
    const winCX = wr.left + wr.width  / 2;
    const winCY = wr.top  + wr.height / 2;

    const trashEl = document.querySelector('[data-dock-trash]');
    let tX = window.innerWidth - 60, tY = window.innerHeight - 50;
    if (trashEl) {
      const ir = trashEl.getBoundingClientRect();
      tX = ir.left + ir.width  / 2;
      tY = ir.top  + ir.height / 2;
    }

    const a = el$.animate([
      { opacity: 1, transform: 'translate(0, 0) scale(1)' },
      { opacity: 0, transform: `translate(${tX - winCX}px, ${tY - winCY}px) scale(0.04)` },
    ], { duration: 300, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });

    a.onfinish = () => dispatch({ type: 'CLOSE', id: win.id });
    return () => a.cancel();
  }, [win.closing, win.id, dispatch]);

  // ── Drag & resize event listeners ─────────────────────────────────────────
  useEffect(() => {
    const applyMove = (clientX: number, clientY: number) => {
      if (!el.current) return;
      if (drag.current) {
        lastMouseY.current = clientY;
        el.current.style.left = Math.max(0, clientX - dOff.current.x) + 'px';
        el.current.style.top  = Math.max(28, clientY - dOff.current.y) + 'px';
        const nearDock = clientY > window.innerHeight - DOCK_ZONE;
        window.dispatchEvent(new CustomEvent('winNearDock', { detail: { near: nearDock } }));
      }
      if (rzRight.current) {
        el.current.style.width = Math.max(320, rzStart.current.w + clientX - rzStart.current.x) + 'px';
      }
      if (rzBottom.current) {
        el.current.style.height = Math.max(200, rzStart.current.h + clientY - rzStart.current.y) + 'px';
      }
      if (rzLeft.current) {
        const dx   = clientX - rzStart.current.x;
        const newW = Math.max(320, rzStart.current.w - dx);
        el.current.style.width = newW + 'px';
        el.current.style.left  = (rzStart.current.left + rzStart.current.w - newW) + 'px';
      }
      if (rzTop.current) {
        const dy   = clientY - rzStart.current.y;
        const newH = Math.max(200, rzStart.current.h - dy);
        el.current.style.height = newH + 'px';
        el.current.style.top    = Math.max(28, rzStart.current.top + rzStart.current.h - newH) + 'px';
      }
    };

    const applyUp = () => {
      if (!el.current) return;
      if (drag.current) {
        window.dispatchEvent(new CustomEvent('winNearDock', { detail: { near: false } }));
        const droppedInDock = lastMouseY.current > window.innerHeight - DOCK_ZONE;
        if (droppedInDock) {
          dispatch({ type: 'CLOSE', id: win.id });
        } else {
          dispatch({ type: 'MOVE', id: win.id, x: parseInt(el.current.style.left) || 0, y: parseInt(el.current.style.top) || 0 });
        }
        drag.current = false;
      }
      if (rzRight.current || rzBottom.current || rzLeft.current || rzTop.current) {
        if (rzLeft.current || rzTop.current) {
          dispatch({ type: 'MOVE', id: win.id, x: parseInt(el.current.style.left) || 0, y: parseInt(el.current.style.top) || 0 });
        }
        dispatch({ type: 'RESIZE', id: win.id, w: el.current.offsetWidth, h: el.current.offsetHeight });
        rzRight.current = false; rzBottom.current = false;
        rzLeft.current  = false; rzTop.current    = false;
      }
    };

    const mv = (e: MouseEvent) => {
      if (document.body.classList.contains('lb-open')) {
        drag.current = false; rzRight.current = false;
        rzBottom.current = false; rzLeft.current = false; rzTop.current = false;
        return;
      }
      applyMove(e.clientX, e.clientY);
    };

    const up = () => applyUp();

    const mvTouch = (e: TouchEvent) => {
      if (!e.touches.length) return;
      if (document.body.classList.contains('lb-open')) {
        drag.current = false; rzRight.current = false;
        rzBottom.current = false; rzLeft.current = false; rzTop.current = false;
        return;
      }
      if (drag.current || rzRight.current || rzBottom.current || rzLeft.current || rzTop.current) {
        e.preventDefault();
      }
      const t = e.touches[0];
      applyMove(t.clientX, t.clientY);
    };

    const upTouch = () => applyUp();

    const resetDrag = () => {
      drag.current    = false;
      rzRight.current = false; rzBottom.current = false;
      rzLeft.current  = false; rzTop.current    = false;
      window.dispatchEvent(new CustomEvent('winNearDock', { detail: { near: false } }));
    };

    window.addEventListener('mousemove',     mv);
    window.addEventListener('mouseup',       up);
    window.addEventListener('touchmove',     mvTouch, { passive: false } as AddEventListenerOptions);
    window.addEventListener('touchend',      upTouch);
    window.addEventListener('lightboxActive', resetDrag);
    return () => {
      window.removeEventListener('mousemove',     mv);
      window.removeEventListener('mouseup',       up);
      window.removeEventListener('touchmove',     mvTouch);
      window.removeEventListener('touchend',      upTouch);
      window.removeEventListener('lightboxActive', resetDrag);
    };
  }, [win.id, dispatch]);

  if (!win.isOpen && !win.minning && !win.closing) return null;
  if (win.isMin && !win.minning) return null;

  const startRz = (e: React.MouseEvent) => {
    if (document.body.classList.contains('lb-open')) return;
    e.preventDefault(); e.stopPropagation();
    rzStart.current = {
      x: e.clientX, y: e.clientY,
      w: el.current!.offsetWidth, h: el.current!.offsetHeight,
      left: parseInt(el.current!.style.left) || win.pos.x,
      top:  parseInt(el.current!.style.top)  || win.pos.y,
    };
    onFocus(win.id);
  };

  const startRzTouch = (e: React.TouchEvent) => {
    if (document.body.classList.contains('lb-open')) return;
    e.preventDefault(); e.stopPropagation();
    const t = e.touches[0];
    rzStart.current = {
      x: t.clientX, y: t.clientY,
      w: el.current!.offsetWidth, h: el.current!.offsetHeight,
      left: parseInt(el.current!.style.left) || win.pos.x,
      top:  parseInt(el.current!.style.top)  || win.pos.y,
    };
    onFocus(win.id);
  };

  const anim: React.CSSProperties = (win.minning || win.closing)
    ? {}
    : { animation: 'winOpen .25s cubic-bezier(.16,1,.3,1)' };

  return (
    <div
      ref={el}
      className="mac-window"
      onMouseDown={() => onFocus(win.id)}
      style={{
        position: 'absolute',
        left: win.pos.x,
        top:  win.pos.y,
        width:  win.isMax ? '100vw'               : win.sz.w,
        height: win.isMax ? 'calc(100vh - 108px)' : win.sz.h,
        zIndex: win.z,
        display: 'flex', flexDirection: 'column',
        background: tk.winBg,
        backdropFilter: 'blur(56px) saturate(2.0)',
        WebkitBackdropFilter: 'blur(56px) saturate(2.0)',
        border: `1px solid ${focused ? tk.borderFoc : tk.border}`,
        borderRadius: win.isMax ? 0 : 14,
        boxShadow: focused ? tk.shadowFoc : tk.shadow,
        overflow: 'hidden',
        transition: 'box-shadow .25s ease, border-color .2s',
        fontFamily: 'var(--font-sans), sans-serif',
        pointerEvents: (win.minning || win.closing) ? 'none' : undefined,
        ...anim,
      }}
    >
      {/* Title bar — drag handle */}
      <div
        onMouseDown={e => {
          if ((e.target as HTMLElement).closest('[data-tl]') || win.isMax) return;
          if (document.body.classList.contains('lb-open')) return;
          drag.current = true;
          const r = el.current!.getBoundingClientRect();
          dOff.current = { x: e.clientX - r.left, y: e.clientY - r.top };
          onFocus(win.id);
          e.preventDefault();
        }}
        onTouchStart={e => {
          if ((e.target as HTMLElement).closest('[data-tl]') || win.isMax) return;
          if (document.body.classList.contains('lb-open')) return;
          drag.current = true;
          const t = e.touches[0];
          const r = el.current!.getBoundingClientRect();
          dOff.current = { x: t.clientX - r.left, y: t.clientY - r.top };
          onFocus(win.id);
        }}
        onDoubleClick={() => dispatch({ type: 'TOGGLE_MAX', id: win.id })}
        style={{
          height: 44, background: tk.titleBg,
          borderBottom: `1px solid ${tk.border}`,
          display: 'flex', alignItems: 'center',
          flexShrink: 0, position: 'relative',
          cursor: win.isMax ? 'default' : 'grab',
          userSelect: 'none',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: tk.titleHighlight,
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

      {/* ── Resize handles (only when not maximized) ── */}
      {!win.isMax && (
        <>
          {/* Left edge */}
          <div
            onMouseDown={e => { startRz(e); rzLeft.current = true; }}
            onTouchStart={e => { startRzTouch(e); rzLeft.current = true; }}
            style={{ position: 'absolute', left: 0, top: 44, bottom: 12, width: 6, cursor: 'ew-resize', zIndex: 3 }}
          />
          {/* Right edge */}
          <div
            onMouseDown={e => { startRz(e); rzRight.current = true; }}
            onTouchStart={e => { startRzTouch(e); rzRight.current = true; }}
            style={{ position: 'absolute', right: 0, top: 44, bottom: 12, width: 6, cursor: 'ew-resize', zIndex: 3 }}
          />
          {/* Bottom edge */}
          <div
            onMouseDown={e => { startRz(e); rzBottom.current = true; }}
            onTouchStart={e => { startRzTouch(e); rzBottom.current = true; }}
            style={{ position: 'absolute', bottom: 0, left: 12, right: 12, height: 6, cursor: 'ns-resize', zIndex: 3 }}
          />
          {/* Top edge */}
          <div
            onMouseDown={e => { startRz(e); rzTop.current = true; }}
            onTouchStart={e => { startRzTouch(e); rzTop.current = true; }}
            style={{ position: 'absolute', top: 0, left: 12, right: 12, height: 4, cursor: 'ns-resize', zIndex: 5 }}
          />
          {/* Top-left corner */}
          <div
            onMouseDown={e => { startRz(e); rzLeft.current = true; rzTop.current = true; }}
            onTouchStart={e => { startRzTouch(e); rzLeft.current = true; rzTop.current = true; }}
            style={{ position: 'absolute', left: 0, top: 0, width: 14, height: 14, cursor: 'nw-resize', zIndex: 6 }}
          />
          {/* Top-right corner */}
          <div
            onMouseDown={e => { startRz(e); rzRight.current = true; rzTop.current = true; }}
            onTouchStart={e => { startRzTouch(e); rzRight.current = true; rzTop.current = true; }}
            style={{ position: 'absolute', right: 0, top: 0, width: 14, height: 14, cursor: 'ne-resize', zIndex: 6 }}
          />
          {/* Bottom-left corner */}
          <div
            onMouseDown={e => { startRz(e); rzLeft.current = true; rzBottom.current = true; }}
            onTouchStart={e => { startRzTouch(e); rzLeft.current = true; rzBottom.current = true; }}
            style={{ position: 'absolute', left: 0, bottom: 0, width: 18, height: 18, cursor: 'sw-resize', zIndex: 4 }}
          />
          {/* Bottom-right corner */}
          <div
            onMouseDown={e => { startRz(e); rzRight.current = true; rzBottom.current = true; }}
            onTouchStart={e => { startRzTouch(e); rzRight.current = true; rzBottom.current = true; }}
            style={{ position: 'absolute', right: 0, bottom: 0, width: 18, height: 18, cursor: 'se-resize', zIndex: 4 }}
          >
            <svg style={{ position: 'absolute', right: 4, bottom: 4 }} width="8" height="8" viewBox="0 0 8 8">
              <path d="M7 1v6H1" stroke={dark ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.18)'}
                strokeWidth="1.2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
