'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { isTallShot } from '@/constants';
import { ALBUMS, albumTint, requestPhoto, rememberShown, type Photo } from '../windows/PhotosWindow';
import { WidgetFrame, S } from './WidgetFrame';

// Cycles through the most colorful shots, never the same project twice in a
// row. Hover pauses, scroll or arrow keys advance, click opens Photos.
const TURN_MS = 7000;

// A random walk through the albums: each step takes a photo from a
// different album than the last, weighted by how many each has left
function tour(): Photo[] {
  const pools = ALBUMS.map(a => {
    const vivid = a.photos.filter(p => p.vivid);
    return [...(vivid.length ? vivid : a.photos)].sort(() => Math.random() - .5);
  });
  const out: Photo[] = [];
  let last = -1;
  while (pools.some(p => p.length)) {
    const open = pools.map((_, i) => i).filter(i => pools[i].length && (i !== last || pools.filter(p => p.length).length === 1));
    let r = Math.random() * open.reduce((n, i) => n + pools[i].length, 0);
    const pick = open.find(i => (r -= pools[i].length) < 0) ?? open[open.length - 1];
    out.push(pools[pick].pop()!);
    last = pick;
  }
  return out;
}

// The tour, starting on `first` (still never one project twice in a row)
function tourFrom(first?: string): Photo[] {
  const t = tour();
  const i = first ? t.findIndex(p => p.src === first) : -1;
  if (i <= 0) return t;
  t.unshift(...t.splice(i, 1));
  const j = t.findIndex((p, k) => k > 1 && p.album !== t[0].album);
  if (t[1].album === t[0].album && j > 0) [t[1], t[j]] = [t[j], t[1]];
  return t;
}

// fluid: fills its cell (the phone's home screen) instead of the desktop size.
// first: the photo to open on (the phone's page already shows it)
export default function PhotosWidget({ dark, onOpen, fluid = false, first: firstSrc }: {
  dark: boolean; onOpen: (id: string) => void; fluid?: boolean; first?: string;
}) {
  const [order] = useState(() => tourFrom(firstSrc));
  const [idx, setIdx] = useState(0);
  const [held, setHeld] = useState(false);
  const wheelAt = useRef(0);
  const layers = useRef<HTMLDivElement>(null);
  const first = useRef(order[0].src);   // the photo shown on load gets loading priority
  const n = order.length;
  const cur = order[idx];
  const turn = (d: number) => setIdx(i => (i + d + n) % n);

  useEffect(() => {
    if (held || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => { if (!document.hidden) turn(1); }, TURN_MS);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [held, idx]);

  // Photos opens on the picture already showing here, then sharpens it
  const open = () => {
    rememberShown(cur.src, layers.current?.querySelector<HTMLImageElement>(`[data-src="${cur.src}"] img`));
    requestPhoto(cur.src);
    onOpen('photos');
  };

  return (
    <WidgetFrame
      dark={dark} w={fluid ? '100%' : S} h={fluid ? '100%' : S} bg={albumTint(cur.album, dark)} onPress={open} onHover={setHeld}
      onKey={e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); turn(1); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); turn(-1); }
      }}
      onWheel={e => {
        if (Math.abs(e.deltaY) < 8 || performance.now() - wheelAt.current < 450) return;
        wheelAt.current = performance.now();
        turn(e.deltaY > 0 ? 1 : -1);
      }}
      label={`Photos: ${cur.album}, ${cur.label}. Open in Photos`}
    >
      {/* The previous photo fades out over the current one; the next preloads underneath */}
      <div ref={layers} style={{ position: 'absolute', inset: 0 }}>
        {[idx - 1, idx, idx + 1].map(i => {
          const p = order[(i + n) % n];
          const on = i === idx;
          return (
            <div key={p.src} data-src={p.src} style={{
              position: 'absolute', inset: 0, background: albumTint(p.album, dark),
              opacity: on ? 1 : 0, transform: on ? 'none' : 'scale(1.04)',
              transition: 'opacity .8s ease, transform 1.2s ease',
            }}>
              <Image
                // a wide shot cropped to the square renders wider than the tile
                src={p.src} alt="" fill sizes={`${Math.ceil(S * Math.max(1, p.w / p.h))}px`} priority={p.src === first.current}
                style={{ objectFit: 'cover', objectPosition: isTallShot(p) ? 'center 22%' : 'center 20%' }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.55) 0%, rgba(0,0,0,.14) 34%, transparent 52%)' }} />
      <div key={cur.src} style={{
        position: 'absolute', left: 13, right: 13, bottom: 11, color: '#fff',
        textShadow: '0 1px 3px rgba(0,0,0,.35)', animation: 'fadeIn .6s ease',
      }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: '-.1px' }}>{cur.album}</div>
        <div style={{ fontSize: 11, fontWeight: 500, opacity: .88, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cur.label}</div>
      </div>
    </WidgetFrame>
  );
}
