'use client';
import { useEffect, useRef } from 'react';

// Overlay scrollbars for a window. Native bars are hidden inside windows
// (globals.css) so they take no room; these float over the content while a
// pane is hovered or scrolling, and can be dragged. Color comes from --thumb.

type Axis = 'y' | 'x';
const INSET = 3, SIZE = 7, MIN = 32, LINGER = 800;

const canScroll = (e: Element, a: Axis) => {
  const cs = getComputedStyle(e);
  const o = a === 'y' ? cs.overflowY : cs.overflowX;
  if (o !== 'auto' && o !== 'scroll') return false;
  return a === 'y' ? e.scrollHeight > e.clientHeight + 1 : e.scrollWidth > e.clientWidth + 1;
};

const scrollerAt = (t: Element | null, host: Element, a: Axis) => {
  for (let e = t; e && e !== host; e = e.parentElement) if (canScroll(e, a)) return e as HTMLElement;
  return null;
};

export default function ScrollThumbs({ host }: { host: React.RefObject<HTMLElement> }) {
  const yBar = useRef<HTMLDivElement>(null);
  const xBar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = host.current;
    if (!root) return;
    const bar = { y: yBar.current!, x: xBar.current! };
    const target: Record<Axis, HTMLElement | null> = { y: null, x: null };
    const hovered: Record<Axis, HTMLElement | null> = { y: null, x: null };
    const timer: Record<Axis, number> = { y: 0, x: 0 };
    let dragging: Axis | null = null;
    let frame = 0;

    const metrics = (a: Axis, el: HTMLElement) => {
      const size = a === 'y' ? el.clientHeight : el.clientWidth;
      const full = a === 'y' ? el.scrollHeight : el.scrollWidth;
      const track = size - INSET * 2;
      const len = Math.max(MIN, track * size / full);
      return { track, len, range: full - size };
    };

    const place = (a: Axis, el: HTMLElement) => {
      const r = el.getBoundingClientRect(), h = root.getBoundingClientRect();
      const x0 = r.left - h.left - root.clientLeft + el.clientLeft;
      const y0 = r.top - h.top - root.clientTop + el.clientTop;
      const { track, len, range } = metrics(a, el);
      const at = (track - len) * (a === 'y' ? el.scrollTop : el.scrollLeft) / range;
      const b = bar[a].style;
      if (a === 'y') {
        b.transform = `translate(${x0 + el.clientWidth - SIZE - INSET}px, ${y0 + INSET + at}px)`;
        b.height = `${len}px`;
      } else {
        b.transform = `translate(${x0 + INSET + at}px, ${y0 + el.clientHeight - SIZE - INSET}px)`;
        b.width = `${len}px`;
      }
      b.background = getComputedStyle(el).getPropertyValue('--thumb') || 'rgba(0,0,0,.32)';
    };

    const hide = (a: Axis) => {
      bar[a].style.opacity = '0';
      bar[a].style.pointerEvents = 'none';
    };
    const show = (a: Axis) => {
      clearTimeout(timer[a]);
      const el = target[a];
      if (!el || !canScroll(el, a)) { hide(a); return; }
      place(a, el);
      bar[a].style.opacity = '1';
      bar[a].style.pointerEvents = 'auto';
    };
    const hideSoon = (a: Axis) => {
      clearTimeout(timer[a]);
      timer[a] = window.setTimeout(() => { if (dragging !== a && !hovered[a]) hide(a); }, LINGER);
    };

    const onScroll = (e: Event) => {
      const el = e.target as HTMLElement;
      if (!(el instanceof HTMLElement)) return;
      for (const a of ['y', 'x'] as Axis[]) {
        if (canScroll(el, a)) {
          target[a] = el;
          show(a);
          if (hovered[a] !== el) hideSoon(a);
        } else if (target[a] && target[a] !== el && el.contains(target[a])) {
          // A strip inside a pane that's moving: its thumb would be left behind
          clearTimeout(timer[a]);
          hovered[a] = null;
          hide(a);
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      const t = e.target as Element;
      if (t === bar.y || t === bar.x || dragging) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        for (const a of ['y', 'x'] as Axis[]) {
          const s = scrollerAt(t, root, a);
          if (s !== hovered[a] && hovered[a]) hideSoon(a);
          hovered[a] = s;
          if (s) { target[a] = s; show(a); }
        }
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      for (const a of ['y', 'x'] as Axis[]) { hovered[a] = null; hideSoon(a); }
    };

    const drag = (a: Axis) => (e: PointerEvent) => {
      const el = target[a];
      if (!el || e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      dragging = a;
      bar[a].setPointerCapture(e.pointerId);
      const start = a === 'y' ? e.clientY : e.clientX;
      const from = a === 'y' ? el.scrollTop : el.scrollLeft;
      const { track, len, range } = metrics(a, el);
      const k = range / Math.max(1, track - len);
      const move = (m: PointerEvent) => {
        const v = from + ((a === 'y' ? m.clientY : m.clientX) - start) * k;
        if (a === 'y') el.scrollTop = v; else el.scrollLeft = v;
      };
      const up = () => {
        dragging = null;
        bar[a].removeEventListener('pointermove', move);
        bar[a].removeEventListener('pointerup', up);
        bar[a].removeEventListener('pointercancel', up);
        hideSoon(a);
      };
      bar[a].addEventListener('pointermove', move);
      bar[a].addEventListener('pointerup', up);
      bar[a].addEventListener('pointercancel', up);
    };
    const dragY = drag('y'), dragX = drag('x');

    root.addEventListener('scroll', onScroll, true);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    bar.y.addEventListener('pointerdown', dragY);
    bar.x.addEventListener('pointerdown', dragX);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer.y); clearTimeout(timer.x);
      root.removeEventListener('scroll', onScroll, true);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      bar.y.removeEventListener('pointerdown', dragY);
      bar.x.removeEventListener('pointerdown', dragX);
    };
  }, [host]);

  const base: React.CSSProperties = {
    position: 'absolute', left: 0, top: 0, zIndex: 15, borderRadius: SIZE / 2,
    opacity: 0, pointerEvents: 'none', transition: 'opacity .25s ease', touchAction: 'none',
  };
  return (
    <>
      <div ref={yBar} aria-hidden="true" style={{ ...base, width: SIZE }} />
      <div ref={xBar} aria-hidden="true" style={{ ...base, height: SIZE }} />
    </>
  );
}
