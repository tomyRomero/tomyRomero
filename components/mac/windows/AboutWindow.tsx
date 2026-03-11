'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { T } from '../tokens';
import { Chip } from '../Atoms';
import { ME, images, profilePhoto } from '@/constants';

const CHIPS = ['ASP.NET Core', 'React', 'SQL Server', 'Azure'];
const TILTS = [-7, 4, -5, 8, -3, 6, -8, 3, -4, 7];

// ── Lightbox (portal — renders at body level, no stacking-context issues) ─────
function Lightbox({ startIdx, onClose }: { startIdx: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIdx);
  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), []);
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), []);
  const cur  = images[idx];

  // Stable refs so the keydown closure never goes stale
  const onCloseRef = useRef(onClose); onCloseRef.current = onClose;
  const prevRef    = useRef(prev);    prevRef.current    = prev;
  const nextRef    = useRef(next);    nextRef.current    = next;

  useEffect(() => {
    // Fully block WinShell drag/resize while lightbox is open
    document.body.classList.add('lb-open');

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      onCloseRef.current();
      if (e.key === 'ArrowRight')  nextRef.current();
      if (e.key === 'ArrowLeft')   prevRef.current();
    };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.classList.remove('lb-open');
      window.removeEventListener('keydown', handler);
    };
  }, []);

  return createPortal(
    <div
      onClick={onClose}
      onMouseDown={e => e.stopPropagation()}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,.92)', backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeSlideIn .18s ease',
      }}
    >
      <div
        style={{ position: 'relative', width: '82vw', height: '78vh' }}
        onClick={e => e.stopPropagation()}
      >
        <Image
          src={cur.img} alt={cur.alt}
          fill style={{ objectFit: 'contain', borderRadius: 12 }} sizes="82vw"
        />
        {cur.title && (
          <div style={{
            position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,.58)', backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,.88)', fontSize: 13, padding: '5px 16px',
            borderRadius: 20, fontFamily: 'var(--font-sans),sans-serif',
            border: '1px solid rgba(255,255,255,.12)', whiteSpace: 'nowrap',
          }}>
            {cur.title}
          </div>
        )}
      </div>

      {/* Counter */}
      <div style={{
        position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,.50)', color: 'rgba(255,255,255,.70)',
        fontSize: 12, padding: '3px 12px', borderRadius: 20,
        fontFamily: 'var(--font-mono),monospace',
        border: '1px solid rgba(255,255,255,.10)',
      }}>
        {idx + 1} / {images.length}
      </div>

      {/* Keyboard hint */}
      <div style={{
        position: 'absolute', bottom: 22, right: 24,
        color: 'rgba(255,255,255,.32)', fontSize: 11,
        fontFamily: 'var(--font-mono),monospace',
      }}>
        ← → esc
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 20, right: 24,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)',
          color: '#fff', cursor: 'pointer', fontSize: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.28)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.14)')}
      >
        ✕
      </button>

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          {([
            { label: '‹', side: 'left',  action: prev },
            { label: '›', side: 'right', action: next },
          ] as const).map(({ label, side, action }) => (
            <button
              key={label}
              onClick={e => { e.stopPropagation(); action(); }}
              style={{
                position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                [side]: 20,
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)',
                color: '#fff', cursor: 'pointer', fontSize: 26,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.28)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.14)')}
            >
              {label}
            </button>
          ))}
        </>
      )}
    </div>,
    document.body
  );
}

// ── Tilted Photo Strip ─────────────────────────────────────────────────────────
function TiltedPhotoStrip({ dark }: { dark: boolean }) {
  const tk = T(dark);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [hov, setHov]           = useState<number | null>(null);

  return (
    <>
      {lightbox !== null && <Lightbox startIdx={lightbox} onClose={() => setLightbox(null)} />}

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{
          fontSize: 10.5, fontFamily: 'var(--font-mono),monospace',
          color: tk.accent, textTransform: 'uppercase', letterSpacing: '1.1px',
        }}>
          Photos
        </span>
        <span style={{ fontSize: 11, color: tk.textMuted, fontFamily: 'var(--font-mono),monospace' }}>
          {images.length} shots · scroll →
        </span>
      </div>

      {/* Horizontal scrollable tilted strip */}
      <div
        style={{
          overflowX: 'auto', paddingTop: 20, paddingBottom: 14,
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,0,0,.18) transparent',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 24,
          width: 'max-content', paddingLeft: 8, paddingRight: 8,
        }}>
          {images.map((img, i) => {
            const tilt = TILTS[i % TILTS.length];
            const isH  = hov === i;
            return (
              /* Wrapper div handles entrance animation; button handles hover tilt */
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: isH ? 10 : 1,
                  animation: `photoIn .5s ${i * 0.055}s cubic-bezier(.16,1,.3,1) both`,
                }}
              >
                <button
                  onMouseEnter={() => setHov(i)}
                  onMouseLeave={() => setHov(null)}
                  onClick={() => setLightbox(i)}
                  style={{
                    display: 'block',
                    width: 128,
                    padding: '7px 7px 26px',
                    background: dark ? '#e8e4da' : '#faf8f3',
                    border: 'none',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transform: `rotate(${isH ? 0 : tilt}deg) scale(${isH ? 1.12 : 1})`,
                    transformOrigin: 'bottom center',
                    transition: 'transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease',
                    boxShadow: isH
                      ? '0 22px 52px rgba(0,0,0,.46), 0 6px 18px rgba(0,0,0,.28)'
                      : `0 ${4 + Math.abs(tilt) / 2}px ${10 + Math.abs(tilt) * 1.4}px rgba(0,0,0,${dark ? '.40' : '.24'})`,
                  }}
                >
                  <div style={{
                    position: 'relative', width: '100%', aspectRatio: '1',
                    overflow: 'hidden', background: '#d0ccc4',
                  }}>
                    <Image src={img.img} alt={img.alt} fill style={{ objectFit: 'cover' }} sizes="114px" />
                  </div>
                  {img.title && (
                    <div style={{
                      marginTop: 5, fontSize: 9.5,
                      color: dark ? '#444' : '#555',
                      fontFamily: 'var(--font-sans),sans-serif',
                      textAlign: 'center', lineHeight: 1.3, userSelect: 'none',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {img.title}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ── Main window ───────────────────────────────────────────────────────────────
export default function AboutWindow({ dark }: { dark: boolean }) {
  const tk = T(dark);

  return (
    <div style={{ padding: '22px 24px', color: tk.text }}>
      {/* Header: avatar + name */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
        <div style={{
          width: 76, height: 76, borderRadius: 20, flexShrink: 0, overflow: 'hidden',
          border: '2px solid rgba(212,148,58,.28)',
          boxShadow: '0 6px 24px rgba(212,148,58,.22)',
          position: 'relative',
        }}>
          <Image src={profilePhoto} alt="Tomy Romero" fill style={{ objectFit: 'cover' }} sizes="76px" />
        </div>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-serif),serif', fontSize: 24, fontWeight: 400,
            letterSpacing: '-.4px', color: tk.text, lineHeight: 1.15,
          }}>
            {ME.name}
          </h1>
          <div style={{ color: tk.accent, fontSize: 13.5, fontWeight: 500, marginTop: 4 }}>{ME.title}</div>
          <div style={{ color: tk.textMuted, fontSize: 12.5, marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="9" height="12" viewBox="0 0 9 12" fill={tk.accent} style={{ flexShrink: 0 }}>
              <path d="M4.5 0C2 0 0 2 0 4.5c0 3.5 4.5 7.5 4.5 7.5S9 8 9 4.5C9 2 7 0 4.5 0zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
            </svg>
            {ME.location}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={{
        background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
        borderRadius: 12, padding: '14px 16px',
        fontSize: 13.5, lineHeight: 1.74, color: tk.textSub, marginBottom: 18,
      }}>
        {ME.bio}
      </div>

      {/* Tech chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 18 }}>
        {CHIPS.map(t => <Chip key={t} amber dark={dark}>{t}</Chip>)}
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 18 }}>
        {([
          ['⑂  GitHub',   ME.github],
          ['🔗  LinkedIn', ME.linkedin],
        ] as [string, string][]).map(([l, h]) => (
          <a
            key={l} href={h} target="_blank" rel="noopener noreferrer"
            style={{
              padding: '7px 16px', borderRadius: 9, fontSize: 12.5,
              fontFamily: 'var(--font-mono),monospace',
              background: tk.accentBg, border: `1px solid ${tk.accentBorder}`,
              color: tk.accent, textDecoration: 'none', fontWeight: 500,
              transition: 'opacity .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {l}
          </a>
        ))}
      </div>

      {/* Open to work */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(52,199,89,.10)', border: '1px solid rgba(52,199,89,.24)',
        padding: '7px 16px', borderRadius: 22, marginBottom: 24,
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%', background: '#34c759',
          boxShadow: '0 0 6px #34c759', animation: 'pulse 2s infinite',
        }} />
        <span style={{ fontSize: 12.5, color: '#34c759', fontFamily: 'var(--font-mono),monospace' }}>
          Open to opportunities
        </span>
      </div>

      {/* Tilted photo strip */}
      <TiltedPhotoStrip dark={dark} />
    </div>
  );
}
