'use client';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { T } from '../tokens';
import { projects, shotsFor, shotLabel, isTallShot, type Shot } from '@/constants';
import { albumTint } from '@/components/projectColors';
import { requestProjectDetail } from './ProjectsWindow';
import { useNavigate } from '@/components/nav';
import {
  Sidebar, SidebarHeading, SidebarItem, Toolbar, ToolbarButton, useWidthClass,
  ChevronLeft, ChevronRight,
} from '../Native';

// Project screenshots as a Photos-style library

// Library
export type Photo = Shot & { album: string; year: string; label: string };

export const ALBUMS = projects
  .map(p => ({
    title: p.title,
    year: p.year,
    photos: shotsFor(p.title).map((s): Photo => ({ ...s, album: p.title, year: p.year, label: shotLabel(s) })),
  }))
  .filter(a => a.photos.length > 0);
export const LIBRARY = ALBUMS.flatMap(a => a.photos);

export { albumTint };

// Deep link from the widget: read on mount; the event covers an open window
let pendingPhoto: string | null = null;
export function requestPhoto(src: string) {
  pendingPhoto = src;
  window.dispatchEvent(new CustomEvent('openPhoto', { detail: { src } }));
}

// Small copies already on screen, shown while the full size loads
const onScreen = new Map<string, string>();
export function rememberShown(src: string, img: HTMLImageElement | null | undefined) {
  if (img?.complete && img.currentSrc) onScreen.set(src, img.currentSrc);
}

// Tile size at each zoom step
const TILE = [112, 150, 204];
const PHONE_TILE = 104;   // three across on a phone
const plural = (n: number) => `${n} Photo${n === 1 ? '' : 's'}`;

// Icons
const LibraryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="6" width="14.5" height="13.5" rx="2.2" /><path d="M7 3.5h11.5a2 2 0 0 1 2 2V15" />
    <path d="m3.5 16.5 4-4 3.5 3.5 2.5-2.5 4 4" /><circle cx="12.8" cy="10.2" r="1.3" />
  </svg>
);
const Minus = () => <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 12h12" /></svg>;
const Plus  = () => <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 12h12M12 6v12" /></svg>;
const Expand = () => <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5" /></svg>;
const Shrink = () => <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10h-6V4M4 14h6v6M14 10l6.5-6.5M10 14l-6.5 6.5" /></svg>;

// Tile: the screenshot on the album's colors
function Tile({ p, tile, dark, onOpen }: { p: Photo; tile: number; dark: boolean; onOpen: () => void }) {
  const wide = p.w >= p.h;
  return (
    <button
      data-src={p.src}
      onClick={e => { rememberShown(p.src, e.currentTarget.querySelector('img')); onOpen(); }}
      aria-label={`${p.label}, ${p.album}`}
      className="ph-tile"
      style={{
        position: 'relative', width: '100%', aspectRatio: '1', borderRadius: 12, overflow: 'hidden',
        background: albumTint(p.album, dark), scrollSnapAlign: 'start',
        boxShadow: `inset 0 0 0 .5px ${dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)'}`,
      }}
    >
      <span style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        ...(wide ? { width: '86%' } : { height: p.framed ? '92%' : '86%' }),
        aspectRatio: `${p.w} / ${p.h}`,
        borderRadius: p.framed ? 0 : 5, overflow: p.framed ? 'visible' : 'hidden',
        boxShadow: p.framed ? 'none' : `0 4px 14px rgba(0,0,0,${dark ? .35 : .13}), 0 0 0 .5px rgba(0,0,0,.08)`,
        filter: p.framed ? `drop-shadow(0 6px 10px rgba(0,0,0,${dark ? .45 : .2}))` : undefined,
      }}>
        <Image src={p.src} alt="" fill sizes={`${Math.round(tile * 0.9)}px`} style={{ objectFit: 'cover', objectPosition: 'top' }} />
      </span>
    </button>
  );
}

// Horizontally scrolling row with page buttons
function Carousel({ tile, dark, children }: { tile: number; dark: boolean; children: React.ReactNode }) {
  const tk = T(dark);
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: true });
  const measure = () => {
    const el = ref.current;
    if (el) setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4 });
  };
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [tile]);
  const page = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.85, behavior: 'smooth' });
  const btn = (side: 'left' | 'right') => (
    <button
      aria-label={side === 'left' ? 'Scroll back' : 'Scroll forward'}
      onClick={() => page(side === 'left' ? -1 : 1)}
      className="ph-page"
      style={{
        position: 'absolute', [side]: 8, top: `calc(4px + ${tile / 2}px)`, transform: 'translateY(-50%)', zIndex: 1,
        width: 30, height: 30, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: dark ? 'rgba(60,60,64,.8)' : 'rgba(255,255,255,.9)', color: tk.label,
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: '0 2px 10px rgba(0,0,0,.18)',
      }}
    >
      {side === 'left' ? <ChevronLeft s={14} /> : <ChevronRight s={14} />}
    </button>
  );
  return (
    <div className="ph-row" style={{ position: 'relative' }}>
      <div ref={ref} onScroll={measure} style={{
        display: 'grid', gridAutoFlow: 'column', gridAutoColumns: `${tile}px`, gap: 10,
        overflowX: 'auto', scrollbarWidth: 'none', padding: '4px 20px 8px',
        scrollSnapType: 'x mandatory', scrollPaddingInline: 20,
      }}>
        {children}
      </div>
      {!edge.start && btn('left')}
      {!edge.end && btn('right')}
    </div>
  );
}

// Each image is requested at its displayed size; the on-screen copy stands in
// until it loads.
function Slides({ list, at, inset, shadow, onSharp }: {
  list: Photo[]; at: number; inset: string; shadow: string; onSharp?: () => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [sharp, setSharp] = useState<Record<string, true>>({});
  useLayoutEffect(() => {
    const el = frame.current!;
    // In steps, so dragging a window edge doesn't ask for a new size every pixel
    const measure = () => {
      const w = Math.ceil(el.clientWidth / 64) * 64, h = Math.ceil(el.clientHeight / 64) * 64;
      setBox(b => (b && b.w === w && b.h === h ? b : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const cur = list[at];
  const sharpNow = !!sharp[cur.src];
  const sharpRef = useRef(onSharp); sharpRef.current = onSharp;
  useEffect(() => { if (sharpNow) sharpRef.current?.(); }, [sharpNow]);

  return (
    <div ref={frame} style={{ position: 'absolute', inset, pointerEvents: 'none' }}>
      {box && [at - 1, at, at + 1].filter(i => i >= 0 && i < list.length).map(i => {
        const p = list[i];
        const on = i === at;
        const stand = on && !sharp[p.src] ? onScreen.get(p.src) : undefined;
        return (
          <div key={p.src} aria-hidden={!on} style={{
            position: 'absolute', inset: 0, opacity: on ? 1 : 0, transition: 'opacity .25s ease', filter: shadow,
          }}>
            {stand && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={stand} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
            )}
            <Image
              src={p.src} alt={on ? `${p.album}: ${p.label}` : ''} fill priority={on}
              sizes={`${Math.min(box.w, Math.ceil(box.h * p.w / p.h))}px`}
              onLoad={() => setSharp(s => (s[p.src] ? s : { ...s, [p.src]: true }))}
              style={{ objectFit: 'contain' }}
            />
          </div>
        );
      })}
    </div>
  );
}

function Arrow({ side, to, setAt, dark, big = false }: {
  side: 'left' | 'right'; to: number | null; setAt: (i: number) => void; dark: boolean; big?: boolean;
}) {
  const s = big ? 44 : 34;
  return (
    <button
      aria-label={side === 'left' ? 'Previous photo' : 'Next photo'}
      disabled={to === null}
      onClick={() => to !== null && setAt(to)}
      className="ph-arrow"
      style={{
        position: 'absolute', [side]: big ? 22 : 14, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
        width: s, height: s, borderRadius: '50%',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: dark ? 'rgba(60,60,64,.72)' : 'rgba(255,255,255,.82)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 2px 10px rgba(0,0,0,.18)', color: dark ? '#f5f5f7' : '#1d1d1f',
        opacity: to === null ? 0 : undefined, pointerEvents: to === null ? 'none' : undefined,
      }}
    >
      {side === 'left' ? <ChevronLeft s={big ? 19 : 16} /> : <ChevronRight s={big ? 19 : 16} />}
    </button>
  );
}

// A sideways swipe turns to the next or previous photo
function useSwipe(prev: number | null, next: number | null, setAt: (i: number) => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onTouchStart: (e: React.TouchEvent) => { const t = e.touches[0]; start.current = { x: t.clientX, y: t.clientY }; },
    onTouchEnd: (e: React.TouchEvent) => {
      const s = start.current;
      start.current = null;
      if (!s) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - s.x, dy = t.clientY - s.y;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0 && next !== null) setAt(next);
      if (dx > 0 && prev !== null) setAt(prev);
    },
  };
}

// Viewer. Double-click for full screen.
function Viewer({ list, at, setAt, dark, onClose, onFull, onSharp, compact }: {
  list: Photo[]; at: number; setAt: (i: number) => void; dark: boolean;
  onClose: () => void; onFull: () => void; onSharp: () => void; compact: boolean;
}) {
  const tk = T(dark);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { box.current?.focus({ preventScroll: true }); }, []);
  const prev = at > 0 ? at - 1 : null;
  const next = at < list.length - 1 ? at + 1 : null;
  const swipe = useSwipe(prev, next, setAt);

  return (
    <div
      ref={box}
      tabIndex={-1}
      onKeyDown={e => {
        if (e.key === 'ArrowLeft' && prev !== null) { e.preventDefault(); setAt(prev); }
        if (e.key === 'ArrowRight' && next !== null) { e.preventDefault(); setAt(next); }
        if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      }}
      onDoubleClick={e => { if (!(e.target as HTMLElement).closest('button')) onFull(); }}
      {...swipe}
      className="ph-viewer"
      style={{ position: 'absolute', inset: 0, background: dark ? '#161618' : tk.paneAlt, outline: 'none', animation: 'fadeIn .2s ease' }}
    >
      <Slides list={list} at={at} inset={compact ? '4px 12px 16px' : '8px 64px 20px'} shadow={`drop-shadow(0 4px 18px rgba(0,0,0,${dark ? .5 : .14}))`} onSharp={onSharp} />
      <Arrow side="left" to={prev} setAt={setAt} dark={dark} />
      <Arrow side="right" to={next} setAt={setAt} dark={dark} />
    </div>
  );
}

// Full screen: browser fullscreen where available (not iPad), otherwise fills
// the window. Controls fade when idle.
function FullScreen({ list, at, setAt, onClose }: {
  list: Photo[]; at: number; setAt: (i: number) => void; onClose: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose); closeRef.current = onClose;
  const [idle, setIdle] = useState(false);
  const timer = useRef(0);
  const wake = () => {
    setIdle(false);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setIdle(true), 2200);
  };
  const prev = at > 0 ? at - 1 : null;
  const next = at < list.length - 1 ? at + 1 : null;
  const cur = list[at];
  const swipe = useSwipe(prev, next, setAt);

  useEffect(() => {
    const el = box.current!;
    document.body.classList.add('lb-open');
    el.focus({ preventScroll: true });
    wake();
    let entered = false;
    const onChange = () => {
      if (document.fullscreenElement === el) entered = true;
      else if (entered) closeRef.current();
    };
    document.addEventListener('fullscreenchange', onChange);
    el.requestFullscreen?.().catch(() => {});
    return () => {
      document.body.classList.remove('lb-open');
      document.removeEventListener('fullscreenchange', onChange);
      clearTimeout(timer.current);
      if (document.fullscreenElement === el) document.exitFullscreen().catch(() => {});
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fade: React.CSSProperties = { opacity: idle ? 0 : 1, transition: 'opacity .35s ease' };
  return createPortal(
    <div
      ref={box}
      tabIndex={-1}
      role="dialog"
      aria-label={`${cur.album}: ${cur.label}`}
      onMouseMove={wake}
      onKeyDown={e => {
        wake();
        if (e.key === 'ArrowLeft' && prev !== null) { e.preventDefault(); setAt(prev); }
        if (e.key === 'ArrowRight' && next !== null) { e.preventDefault(); setAt(next); }
        if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      }}
      onDoubleClick={e => { if (!(e.target as HTMLElement).closest('button')) onClose(); }}
      {...swipe}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999, background: '#000', color: '#f5f5f7', outline: 'none',
        cursor: idle ? 'none' : undefined, animation: 'fadeIn .2s ease',
        fontFamily: 'var(--font-sans), sans-serif',
      }}
    >
      <Slides list={list} at={at} inset="56px 84px 40px" shadow="none" />
      <div style={{ ...fade, position: 'absolute', top: 0, left: 0, right: 0, height: 56, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' }}>
        <button onClick={onClose} aria-label="Exit Full Screen" style={{
          width: 34, height: 34, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,.14)', color: '#f5f5f7',
        }}>
          <Shrink />
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cur.label}</span>
          <span style={{ fontSize: 12, color: 'rgba(245,245,247,.62)' }}>{`${cur.album} · ${at + 1} of ${list.length}`}</span>
        </div>
      </div>
      <div style={fade}>
        <Arrow side="left" to={prev} setAt={setAt} dark big />
        <Arrow side="right" to={next} setAt={setAt} dark big />
      </div>
    </div>,
    document.body,
  );
}

// nav: phone-only bar that replaces the window chrome
export default function PhotosWindow({ dark, onOpen, nav }: { dark: boolean; onOpen: (id: string) => void; nav?: React.ReactNode }) {
  const tk = T(dark);
  const go = useNavigate();
  // 0: no sidebar (albums become a row of tabs), 1: sidebar
  const [ref, size] = useWidthClass<HTMLDivElement>([720]);
  const wide = size >= 1;
  // Opened from the widget: start inside the album and hold the grid back until
  // the photo is in
  const [start] = useState(() => LIBRARY.find(x => x.src === pendingPhoto) ?? null);
  const [album, setAlbum] = useState<string | null>(start?.album ?? null);   // null: Library
  const [viewing, setViewing] = useState<string | null>(start?.src ?? null);
  const [gridOn, setGridOn] = useState(!start);
  const [full, setFull] = useState(false);
  const [zoom, setZoom] = useState(1);
  const scroller = useRef<HTMLDivElement>(null);

  const list = album ? ALBUMS.find(a => a.title === album)!.photos : LIBRARY;
  const at = viewing ? list.findIndex(p => p.src === viewing) : -1;
  const cur = at >= 0 ? list[at] : null;

  // The widget again while the window is open
  useEffect(() => {
    pendingPhoto = null;
    const h = (e: Event) => {
      const src = (e as CustomEvent<{ src: string }>).detail?.src;
      const p = src && LIBRARY.find(x => x.src === src);
      pendingPhoto = null;
      if (!p) return;
      setAlbum(p.album);
      setViewing(p.src);
    };
    window.addEventListener('openPhoto', h);
    return () => window.removeEventListener('openPhoto', h);
  }, []);

  const pickAlbum = (a: string | null) => {
    setAlbum(a);
    setViewing(null);
    setFull(false);
    scroller.current?.scrollTo({ top: 0 });
  };
  // Back to the photos with the last one in view, as Photos does
  const closeViewer = () => {
    const src = viewing;
    setViewing(null);
    setFull(false);
    requestAnimationFrame(() => {
      scroller.current?.querySelector<HTMLElement>(`[data-src="${src}"]`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  };
  // The phone has no Projects window: its project pages stand alone
  const openProject = (title: string) => {
    if (nav) { go(`/project/${encodeURIComponent(title)}`); return; }
    requestProjectDetail(title);
    onOpen('projects');
  };

  const tile = nav ? PHONE_TILE : TILE[zoom];
  const albumInfo = ALBUMS.find(a => a.title === album);
  const cover = (a: (typeof ALBUMS)[number]) => a.photos.find(p => p.vivid) ?? a.photos[0];

  const textButton = (label: string, onClick: () => void) => (
    <button onClick={onClick} style={{
      height: 30, padding: '0 12px', borderRadius: 8, flexShrink: 0,
      background: tk.fill, color: tk.label, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
      transition: 'filter .15s',
    }}
      onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(.96)')}
      onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
    >
      {label}
    </button>
  );
  const heading = (title: string, sub: string, onAll?: () => void) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '0 20px 8px' }}>
      <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.3px' }}>{title}</h3>
      <span style={{ fontSize: 13, color: tk.label2 }}>{sub}</span>
      <span style={{ flex: 1 }} />
      {onAll && (
        <button onClick={onAll} style={{ fontSize: 13, fontWeight: 500, color: tk.accent, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          See All <ChevronRight s={12} />
        </button>
      )}
    </div>
  );

  return (
    <div ref={ref} style={{ flex: 1, minWidth: 0, display: 'flex', color: tk.label }}>
      {wide && (
        <Sidebar dark={dark} width={210} label="Photos">
          <SidebarItem
            dark={dark} label="Library" count={LIBRARY.length} selected={album === null}
            icon={<span style={{ color: tk.accent, display: 'inline-flex' }}><LibraryIcon /></span>}
            onClick={() => pickAlbum(null)}
          />
          <SidebarHeading dark={dark}>Albums</SidebarHeading>
          {ALBUMS.map(a => (
            <SidebarItem
              key={a.title} dark={dark} label={a.title} count={a.photos.length} selected={album === a.title}
              onClick={() => pickAlbum(a.title)}
              icon={
                <span style={{ position: 'relative', width: 22, height: 22, flexShrink: 0, borderRadius: 5, overflow: 'hidden', background: tk.paneAlt, boxShadow: '0 0 0 .5px rgba(0,0,0,.15)' }}>
                  <Image src={cover(a).src} alt="" fill sizes="24px" style={{ objectFit: 'cover', objectPosition: 'top' }} />
                </span>
              }
            />
          ))}
        </Sidebar>
      )}

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: tk.pane }}>
        {nav && <div style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>{!cur && nav}</div>}
        <Toolbar style={{ padding: nav ? '0 16px' : wide ? '0 16px 0 22px' : '0 16px 0 88px', gap: 10 }}>
          {cur ? (
            <>
              <ToolbarButton dark={dark} label="Back to photos" onClick={closeViewer}><ChevronLeft /></ToolbarButton>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cur.label}</h2>
                <span style={{ fontSize: 11.5, color: tk.label2, whiteSpace: 'nowrap' }}>
                  {album ? `${cur.year} · ${at + 1} of ${list.length}` : `${cur.album} · ${at + 1} of ${list.length}`}
                </span>
              </div>
              <span style={{ flex: 1 }} />
              {textButton('View Project', () => openProject(cur.album))}
              <ToolbarButton dark={dark} label="Full Screen" onClick={() => setFull(true)}><Expand /></ToolbarButton>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>{album ?? 'Library'}</h2>
                <span style={{ fontSize: 11.5, color: tk.label2 }}>
                  {albumInfo ? `${albumInfo.year} · ${plural(albumInfo.photos.length)}` : plural(LIBRARY.length)}
                </span>
              </div>
              <span style={{ flex: 1 }} />
              {albumInfo && textButton('View Project', () => openProject(albumInfo.title))}
              {!nav && (
                <div role="group" aria-label="Zoom" style={{ display: 'flex', borderRadius: 8, background: tk.fill }}>
                  <ToolbarButton dark={dark} label="Zoom out" disabled={zoom === 0} onClick={() => setZoom(z => Math.max(0, z - 1))}><Minus /></ToolbarButton>
                  <ToolbarButton dark={dark} label="Zoom in" disabled={zoom === TILE.length - 1} onClick={() => setZoom(z => Math.min(TILE.length - 1, z + 1))}><Plus /></ToolbarButton>
                </div>
              )}
            </>
          )}
        </Toolbar>

        {!wide && !cur && (
          <div role="group" aria-label="Albums" style={{ display: 'flex', gap: 6, padding: '0 16px 10px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {[null, ...ALBUMS.map(a => a.title)].map(a => (
              <button key={a ?? 'library'} aria-pressed={album === a} onClick={() => pickAlbum(a)} style={{
                height: 26, padding: '0 11px', borderRadius: 13, flexShrink: 0, fontSize: 12.5,
                fontWeight: album === a ? 600 : 500,
                background: album === a ? tk.select : tk.fill,
                color: album === a ? '#fff' : tk.label,
              }}>
                {a ?? 'Library'}
              </button>
            ))}
          </div>
        )}

        <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
          <div ref={scroller} aria-hidden={!!cur} style={{
            position: 'absolute', inset: 0, overflowY: 'auto', visibility: cur ? 'hidden' : undefined,
            paddingBottom: nav ? 'env(safe-area-inset-bottom, 0px)' : undefined,
          }}>
            {!gridOn && cur ? null : albumInfo ? (
              <div style={{
                display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${tile}px, 1fr))`, gap: 10,
                padding: '6px 20px 24px', animation: 'fadeIn .25s ease',
              }}>
                {list.map(p => <Tile key={p.src} p={p} tile={tile} dark={dark} onOpen={() => setViewing(p.src)} />)}
              </div>
            ) : (
              <div style={{ padding: '8px 0 24px', display: 'flex', flexDirection: 'column', gap: 26, animation: 'fadeIn .25s ease' }}>
                {/* Album covers, then a row from each album */}
                <section aria-label="Albums">
                  {heading('Albums', `${ALBUMS.length}`)}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16, padding: '0 20px' }}>
                    {ALBUMS.map(a => {
                      const c = cover(a);
                      return (
                        <button key={a.title} onClick={() => pickAlbum(a.title)} className="ph-tile" aria-label={`${a.title}, ${plural(a.photos.length)}`}
                          style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
                          <span style={{
                            position: 'relative', width: '100%', aspectRatio: '1', borderRadius: 14, overflow: 'hidden',
                            background: albumTint(a.title, dark), boxShadow: `inset 0 0 0 .5px ${dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)'}`,
                          }}>
                            <Image src={c.src} alt="" fill sizes="240px"
                              style={{ objectFit: 'cover', objectPosition: isTallShot(c) ? 'center 18%' : 'center top' }} />
                          </span>
                          <span style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '0 2px' }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: tk.label }}>{a.title}</span>
                            <span style={{ fontSize: 12.5, color: tk.label2 }}>{a.photos.length}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
                {ALBUMS.map(a => (
                  <section key={a.title} aria-label={a.title}>
                    {heading(a.title, `${a.year} · ${plural(a.photos.length)}`, () => pickAlbum(a.title))}
                    <Carousel tile={tile} dark={dark}>
                      {a.photos.map(p => <Tile key={p.src} p={p} tile={tile} dark={dark} onOpen={() => setViewing(p.src)} />)}
                    </Carousel>
                  </section>
                ))}
              </div>
            )}
          </div>
          {cur && (
            <Viewer
              key={album ?? 'library'} list={list} at={at} setAt={i => setViewing(list[i].src)} dark={dark}
              onClose={closeViewer} onFull={() => setFull(true)} onSharp={() => setGridOn(true)} compact={!!nav}
            />
          )}
          {cur && full && <FullScreen list={list} at={at} setAt={i => setViewing(list[i].src)} onClose={() => setFull(false)} />}
        </div>
      </div>
    </div>
  );
}
