'use client';
import { useRef, useEffect, useState } from 'react';
import { T } from './tokens';
import type { Win, WinAction } from './winTypes';

function TrafficLights({ win, dispatch, focused, dark }: {
  win: Win; dispatch: React.Dispatch<WinAction>; focused: boolean; dark: boolean;
}) {
  const [hov, setHov] = useState(false);

  const doMin = () => {
    dispatch({ type: 'MIN_START', id: win.id });
    setTimeout(() => dispatch({ type: 'MIN_DONE', id: win.id }), 280);
  };

  const sp = (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); };

  // Gray when unfocused, colored on hover
  const lit  = focused || hov;
  const gray = dark ? '#58585d' : '#d3d3d8';

  // 20px hit area around the 12px light (same 20px spacing as macOS)
  const btn = (bg: string): React.CSSProperties => ({
    width: 20, height: 20, padding: 0, flexShrink: 0,
    background: 'transparent', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    ['--light' as string]: lit ? bg : gray,
  });
  const light: React.CSSProperties = {
    width: 12, height: 12, borderRadius: '50%', background: 'var(--light)',
    boxShadow: `inset 0 0 0 .5px ${dark ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.14)'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'filter .12s, background .18s',
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <button
        style={btn('#ff5f57')}
        onClick={e => { sp(e); dispatch({ type: 'CLOSE_START', id: win.id }); }}
        onMouseDown={sp}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(.82)')}
        onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
        title="Close"
        aria-label="Close window"
      >
        <span style={light}>{hov && (
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <line x1="1" y1="1" x2="5" y2="5" stroke="rgba(100,0,0,.7)" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="5" y1="1" x2="1" y2="5" stroke="rgba(100,0,0,.7)" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        )}</span>
      </button>
      <button
        style={btn('#ffbd2e')}
        onClick={e => { sp(e); doMin(); }}
        onMouseDown={sp}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(.82)')}
        onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
        title="Minimize"
        aria-label="Minimize window"
      >
        <span style={light}>{hov && (
          <svg width="7" height="2" viewBox="0 0 7 2">
            <line x1=".5" y1="1" x2="6.5" y2="1" stroke="rgba(80,48,0,.65)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        )}</span>
      </button>
      <button
        style={btn('#28ca41')}
        onClick={e => { sp(e); dispatch({ type: 'TOGGLE_MAX', id: win.id }); }}
        onMouseDown={sp}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(.82)')}
        onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
        title={win.isMax ? 'Restore' : 'Maximize'}
        aria-label={win.isMax ? 'Restore window' : 'Maximize window'}
      >
        <span style={light}>{hov && (
          win.isMax
            ? <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M5.5.5H7.5V2.5M2.5 7.5H.5V5.5" stroke="rgba(0,50,0,.65)" strokeWidth="1.2" strokeLinecap="round" /></svg>
            : <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M.5 5V.5H5M3 7.5H7.5V3" stroke="rgba(0,50,0,.65)" strokeWidth="1.2" strokeLinecap="round" /></svg>
        )}</span>
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

// Near the trash icon; its rect is captured at drag start
function isNearTrash(r: DOMRect | null, x: number, y: number) {
  if (!r) return false;
  return x > r.left - 80 && x < r.right + 80 && y > r.top - 130;
}

function captureTrashRect(): DOMRect | null {
  const el = document.querySelector('[data-dock-trash]') as HTMLElement | null;
  return el ? el.getBoundingClientRect() : null;
}

function captureDockTop(): number {
  const el = document.querySelector('.mac-dock') as HTMLElement | null;
  return el ? el.getBoundingClientRect().top : window.innerHeight - 104;
}

// How much of a dragged window must stay on screen
const KEEP_X = 120;
const TITLE_H = 52;

// Presses on [data-drag] move the window unless they hit a control
function isDragZone(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  if (!el?.closest) return false;
  return !!el.closest('[data-drag]')
    && !el.closest('button, a, input, textarea, select, label, [role="button"], [data-tl], [data-no-drag]');
}

// Zoomed: fill the desktop with an even gap
const ZOOM_GAP = 8;
const DOCK_SPACE = 110;

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
  const lastMouse  = useRef({ x: 0, y: 0 });
  const trashRect  = useRef<DOMRect | null>(null);
  const dockTop    = useRef(0);
  // Becomes a drag once it moves
  const pendingUnzoom = useRef<{ x: number; y: number } | null>(null);
  const winRef     = useRef(win);
  winRef.current = win;

  // Transition only while zooming, so browser resizes don't lag
  const [prevMax, setPrevMax] = useState(win.isMax);
  const [zoomAnim, setZoomAnim] = useState(false);
  if (prevMax !== win.isMax) {
    setPrevMax(win.isMax);
    setZoomAnim(true);
  }
  useEffect(() => {
    if (!zoomAnim) return;
    const t = setTimeout(() => setZoomAnim(false), 420);
    return () => clearTimeout(t);
  }, [zoomAnim]);

  // Minimize: fly to the dock icon
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

  // Close: fly to the trash
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

  // Drag and resize
  const minW = win.minSz?.w ?? 320;
  const minH = win.minSz?.h ?? 200;
  useEffect(() => {
    const moving = (on: boolean, grab: boolean) => {
      el.current?.classList.toggle('win-moving', on);
      if (grab) document.documentElement.classList.toggle('win-grabbing', on);
    };

    const applyMove = (clientX: number, clientY: number) => {
      if (!el.current) return;
      const p = pendingUnzoom.current;
      if (p) {
        if (Math.hypot(clientX - p.x, clientY - p.y) < 5) return;
        // Restore size, keeping the grab point under the cursor
        pendingUnzoom.current = null;
        const w = winRef.current;
        const r = el.current.getBoundingClientRect();
        dOff.current = {
          x: Math.round(((p.x - r.left) / r.width) * w.sz.w),
          y: Math.min(p.y - r.top, w.sz.h - 24),
        };
        drag.current = true;
        trashRect.current = captureTrashRect();
        dockTop.current = captureDockTop();
        moving(true, true);
        el.current.style.width  = w.sz.w + 'px';
        el.current.style.height = w.sz.h + 'px';
        const x = Math.round(clientX - dOff.current.x);
        const y = Math.round(Math.max(0, clientY - dOff.current.y - 28));
        dispatch({ type: 'UNZOOM_AT', id: w.id, x, y });
      }
      if (drag.current) {
        lastMouse.current = { x: clientX, y: clientY };
        const w = el.current.offsetWidth;
        const x = clientX - dOff.current.x;
        el.current.style.left = Math.min(window.innerWidth - KEEP_X, Math.max(KEEP_X - w, x)) + 'px';
        // The canvas starts at top: 28. Floor at 0; the ceiling keeps the title bar
        // above the dock.
        const y = clientY - dOff.current.y - 28;
        el.current.style.top  = Math.min(dockTop.current - 28 - TITLE_H, Math.max(0, y)) + 'px';
        window.dispatchEvent(new CustomEvent('winNearDock', { detail: { near: isNearTrash(trashRect.current, clientX, clientY) } }));
      }
      if (rzRight.current) {
        el.current.style.width = Math.max(minW, rzStart.current.w + clientX - rzStart.current.x) + 'px';
      }
      if (rzBottom.current) {
        el.current.style.height = Math.max(minH, rzStart.current.h + clientY - rzStart.current.y) + 'px';
      }
      if (rzLeft.current) {
        const dx   = clientX - rzStart.current.x;
        const newW = Math.max(minW, rzStart.current.w - dx);
        el.current.style.width = newW + 'px';
        el.current.style.left  = (rzStart.current.left + rzStart.current.w - newW) + 'px';
      }
      if (rzTop.current) {
        const dy   = clientY - rzStart.current.y;
        const newH = Math.max(minH, rzStart.current.h - dy);
        el.current.style.height = newH + 'px';
        // Same floor as dragging
        el.current.style.top    = Math.max(0, rzStart.current.top + rzStart.current.h - newH) + 'px';
      }
    };

    const applyUp = () => {
      pendingUnzoom.current = null;
      if (!el.current) return;
      moving(false, drag.current);
      if (drag.current) {
        window.dispatchEvent(new CustomEvent('winNearDock', { detail: { near: false } }));
        const droppedInDock = isNearTrash(trashRect.current, lastMouse.current.x, lastMouse.current.y);
        if (droppedInDock) {
          window.dispatchEvent(new Event('dockTrashShake'));
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

    window.addEventListener('mousemove',     mv);
    window.addEventListener('mouseup',       up);
    window.addEventListener('touchmove',     mvTouch, { passive: false } as AddEventListenerOptions);
    window.addEventListener('touchend',      upTouch);
    return () => {
      window.removeEventListener('mousemove',     mv);
      window.removeEventListener('mouseup',       up);
      window.removeEventListener('touchmove',     mvTouch);
      window.removeEventListener('touchend',      upTouch);
    };
  }, [win.id, dispatch, minW, minH]);

  if (!win.isOpen && !win.minning && !win.closing) return null;
  if (win.isMin && !win.minning) return null;

  const startRz = (e: React.MouseEvent) => {
    if (document.body.classList.contains('lb-open')) return;
    e.preventDefault(); e.stopPropagation();
    el.current?.classList.add('win-moving');
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
    el.current?.classList.add('win-moving');
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

  const beginDrag = (x: number, y: number) => {
    // A zoomed window waits to see whether the press turns into a drag
    if (win.isMax) { pendingUnzoom.current = { x, y }; return; }
    drag.current = true;
    el.current!.classList.add('win-moving');
    document.documentElement.classList.add('win-grabbing');
    trashRect.current = captureTrashRect();
    dockTop.current = captureDockTop();
    const r = el.current!.getBoundingClientRect();
    dOff.current = { x: x - r.left, y: y - r.top };
  };
  const canDrag = (t: EventTarget | null) =>
    !document.body.classList.contains('lb-open') && isDragZone(t);
  const zoomEase = 'cubic-bezier(.2,.85,.25,1)';

  return (
    <section
      ref={el}
      className="mac-window"
      aria-label={win.title}
      onMouseDown={e => {
        onFocus(win.id);
        if (e.button !== 0 || !canDrag(e.target)) return;
        beginDrag(e.clientX, e.clientY);
        e.preventDefault();
      }}
      onTouchStart={e => {
        onFocus(win.id);
        if (!canDrag(e.target)) return;
        beginDrag(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onDoubleClick={e => { if (isDragZone(e.target)) dispatch({ type: 'TOGGLE_MAX', id: win.id }); }}
      style={{
        position: 'absolute',
        left:   win.isMax ? ZOOM_GAP : win.pos.x,
        top:    win.isMax ? ZOOM_GAP : win.pos.y,
        width:  win.isMax ? `calc(100vw - ${ZOOM_GAP * 2}px)` : win.sz.w,
        height: win.isMax ? `calc(100vh - 28px - ${ZOOM_GAP + DOCK_SPACE}px)` : win.sz.h,
        zIndex: win.z,
        display: 'flex', flexDirection: 'column',
        // Each app paints its own panes; the blur shows through its sidebar
        background: dark ? 'rgba(28,28,31,.5)' : 'rgba(250,250,252,.5)',
        backdropFilter: 'blur(50px) saturate(1.9)',
        WebkitBackdropFilter: 'blur(50px) saturate(1.9)',
        border: `1px solid ${focused ? tk.borderFoc : tk.border}`,
        borderRadius: 12,
        boxShadow: focused ? tk.shadowFoc : tk.shadow,
        overflow: 'hidden',
        transition: zoomAnim
          ? `left .36s ${zoomEase}, top .36s ${zoomEase}, width .36s ${zoomEase}, height .36s ${zoomEase}, box-shadow .25s ease, border-color .2s`
          : 'box-shadow .25s ease, border-color .2s',
        fontFamily: 'var(--font-sans), sans-serif',
        pointerEvents: (win.minning || win.closing) ? 'none' : undefined,
        ...anim,
      }}
    >
      <div style={{ flex: 1, minHeight: 0, display: 'flex', position: 'relative' }}>
        {children}
      </div>

      <div data-tl="" style={{ position: 'absolute', left: 14, top: 16, zIndex: 20 }}>
        <TrafficLights win={win} dispatch={dispatch} focused={focused} dark={dark} />
      </div>

      {/* Resize handles */}
      {!win.isMax && (
        <>
          {/* Left edge */}
          <div
            onMouseDown={e => { startRz(e); rzLeft.current = true; }}
            onTouchStart={e => { startRzTouch(e); rzLeft.current = true; }}
            style={{ position: 'absolute', left: 0, top: 14, bottom: 18, width: 6, cursor: 'ew-resize', zIndex: 3 }}
          />
          {/* Right edge */}
          <div
            onMouseDown={e => { startRz(e); rzRight.current = true; }}
            onTouchStart={e => { startRzTouch(e); rzRight.current = true; }}
            style={{ position: 'absolute', right: 0, top: 14, bottom: 18, width: 6, cursor: 'ew-resize', zIndex: 3 }}
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
    </section>
  );
}
