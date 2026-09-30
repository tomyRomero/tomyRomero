'use client';
import { useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { images } from '@/constants';
import { Lightbox } from './windows/AboutWindow';
import { ABOUT_W } from './winTypes';

const PINNED = [
  { idx: 0, tilt: -7 },
  { idx: 2, tilt: 5 },
  { idx: 3, tilt: -4 },
];
const W = 118;

const subscribe = (cb: () => void) => {
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
};
const viewport = () => `${window.innerWidth}x${window.innerHeight}`;

export default function DesktopPhotos({ dark }: { dark: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const [hov, setHov]   = useState<number | null>(null);
  const [vw, vh] = useSyncExternalStore(subscribe, viewport, () => '0x0').split('x').map(Number);

  // Same math Desktop.tsx uses to center About
  const aboutLeft = (vw - 200 - Math.min(ABOUT_W, vw - 80)) / 2;
  const canvasH   = vh - 108;
  const colB      = Math.max(24, Math.min(aboutLeft - W - 36, 140));
  const spots = [
    { left: 28,   top: Math.round(canvasH * 0.06) },
    { left: colB, top: Math.round(canvasH * 0.33) },
    { left: 36,   top: Math.round(canvasH * 0.60) },
  ].slice(0, canvasH < 600 ? 2 : 3);

  return (
    <>
      {open !== null && <Lightbox startIdx={open} onClose={() => setOpen(null)} />}
      {spots.map((spot, i) => {
        const { idx, tilt } = PINNED[i];
        const img = images[idx];
        const isH = hov === i;
        return (
          <div
            key={idx}
            style={{
              position: 'absolute', left: spot.left, top: spot.top,
              zIndex: isH ? 6 : 5,
              animation: `photoIn .6s ${0.3 + i * 0.08}s cubic-bezier(.16,1,.3,1) both`,
            }}
          >
            <button
              onClick={e => { e.stopPropagation(); setOpen(idx); }}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              aria-label={`Open photo: ${img.title}`}
              style={{
                display: 'block', width: W, padding: '7px 7px 24px',
                background: dark ? '#e8e4da' : '#faf8f3',
                border: 'none', borderRadius: 2, cursor: 'pointer',
                transform: `rotate(${isH ? 0 : tilt}deg) scale(${isH ? 1.07 : 1})`,
                transformOrigin: 'center',
                transition: 'transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease',
                boxShadow: isH
                  ? '0 22px 48px rgba(0,0,0,.40), 0 6px 16px rgba(0,0,0,.24)'
                  : `0 6px 18px rgba(0,0,0,${dark ? '.45' : '.22'})`,
              }}
            >
              <div style={{
                position: 'relative', width: '100%', aspectRatio: '1',
                overflow: 'hidden', background: '#d0ccc4',
              }}>
                <Image src={img.img} alt="" fill style={{ objectFit: 'cover' }} sizes="104px" />
              </div>
              <div style={{
                marginTop: 5, fontSize: 10, color: '#555', textAlign: 'center',
                fontFamily: 'var(--font-sans),sans-serif', lineHeight: 1.3,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {img.title}
              </div>
            </button>
          </div>
        );
      })}
    </>
  );
}
