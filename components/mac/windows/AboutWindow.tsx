'use client';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { T } from '../tokens';
import { Chip } from '../Atoms';
import { ME, images, profilePhoto } from '@/constants';

const CHIPS = ['ASP.NET Core', 'React', 'SQL Server', 'Azure', 'Healthcare IT', 'SaaS Builder', 'BI / Analytics'];

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ startIdx, onClose }: { startIdx: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIdx);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);
  const cur  = images[idx];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,.92)', backdropFilter: 'blur(18px)',
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
    </div>
  );
}

// ── Photo Carousel ────────────────────────────────────────────────────────────
function PhotoCarousel({ dark }: { dark: boolean }) {
  const tk = T(dark);
  const [idx, setIdx]         = useState(0);
  const [dir, setDir]         = useState<'right' | 'left'>('right');
  const [animKey, setAnimKey] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const go = useCallback((newIdx: number, direction: 'right' | 'left') => {
    setDir(direction);
    setAnimKey(k => k + 1);
    setIdx(newIdx);
  }, []);

  const prev = () => go((idx - 1 + images.length) % images.length, 'left');
  const next = () => go((idx + 1) % images.length, 'right');
  const cur  = images[idx];

  return (
    <>
      {lightbox && <Lightbox startIdx={idx} onClose={() => setLightbox(false)} />}

      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <span style={{
          fontSize: 10.5, fontFamily: 'var(--font-mono),monospace',
          color: tk.accent, textTransform: 'uppercase', letterSpacing: '1.1px',
        }}>
          Photos
        </span>
        <span style={{
          fontSize: 11.5, fontFamily: 'var(--font-mono),monospace',
          color: tk.textMuted,
        }}>
          {idx + 1} / {images.length}
        </span>
      </div>

      {/* Carousel frame */}
      <div style={{ position: 'relative', width: '100%', marginBottom: 10 }}>
        <div style={{
          width: '100%', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden',
          background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
          position: 'relative',
        }}>
          {/* Animated slide */}
          <div
            key={animKey}
            style={{
              position: 'absolute', inset: 0,
              animation: `${dir === 'right' ? 'slideInFromRight' : 'slideInFromLeft'} .26s cubic-bezier(.22,1,.36,1)`,
            }}
          >
            <Image
              src={cur.img} alt={cur.alt}
              fill style={{ objectFit: 'cover' }} sizes="420px"
            />
            {/* Caption overlay */}
            {cur.title && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '20px 14px 10px',
                background: 'linear-gradient(0deg,rgba(0,0,0,.55) 0%,transparent 100%)',
                color: 'rgba(255,255,255,.90)', fontSize: 12,
                fontFamily: 'var(--font-sans),sans-serif',
              }}>
                {cur.title}
              </div>
            )}
          </div>

          {/* Fullscreen button */}
          <button
            onClick={() => setLightbox(true)}
            title="View fullscreen"
            style={{
              position: 'absolute', top: 8, right: 8, zIndex: 3,
              width: 28, height: 28, borderRadius: 7,
              background: 'rgba(0,0,0,.46)', backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,.22)',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,.70)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,.46)')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
            </svg>
          </button>

          {/* Prev / Next arrows */}
          {images.length > 1 && (
            <>
              {([
                { label: '‹', side: 'left',  action: prev },
                { label: '›', side: 'right', action: next },
              ] as const).map(({ label, side, action }) => (
                <button
                  key={label}
                  onClick={action}
                  style={{
                    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                    [side]: 8, zIndex: 2,
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'rgba(0,0,0,.40)', backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,.20)',
                    color: '#fff', cursor: 'pointer', fontSize: 19,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background .15s, transform .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,.66)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,.40)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                >
                  {label}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div style={{
            display: 'flex', gap: 5, justifyContent: 'center',
            marginTop: 9, alignItems: 'center',
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > idx ? 'right' : 'left')}
                style={{
                  width: i === idx ? 16 : 5, height: 5, borderRadius: 3,
                  border: 'none', padding: 0, cursor: 'pointer',
                  background: i === idx ? tk.accent : (dark ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.20)'),
                  transition: 'width .20s ease, background .18s',
                }}
              />
            ))}
          </div>
        )}
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

      {/* Photo carousel */}
      <PhotoCarousel dark={dark} />
    </div>
  );
}
