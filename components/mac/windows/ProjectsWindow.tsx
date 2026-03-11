'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { T } from '../tokens';
import { Chip, WinTitle, Bullet, Label } from '../Atoms';
import { projects, projectDetails } from '@/constants';

const STATUS_BADGE: Record<string, { bg: string; txt: string; lbl: string }> = {
  shipped:      { bg: 'rgba(52,199,89,.12)',  txt: '#1da044', lbl: 'Shipped ✓' },
  'in-progress':{ bg: 'rgba(255,159,10,.12)', txt: '#d07a00', lbl: 'In Progress' },
  ongoing:      { bg: 'rgba(212,148,58,.14)', txt: '#D4943A', lbl: 'Ongoing ⚡' },
  archived:     { bg: 'rgba(120,120,128,.1)', txt: '#888',    lbl: 'Archived' },
};

// ── Lightbox (portal — same pattern as AboutWindow) ───────────────────────────
function Lightbox({ imgs, startIdx, onClose }: {
  imgs: string[]; startIdx: number; onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIdx);
  const closeRef = useRef(onClose); closeRef.current = onClose;
  const prev = useCallback(() => setIdx(i => (i - 1 + imgs.length) % imgs.length), [imgs.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % imgs.length), [imgs.length]);
  const prevRef = useRef(prev); prevRef.current = prev;
  const nextRef = useRef(next); nextRef.current = next;

  useEffect(() => {
    document.body.classList.add('lb-open');
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     closeRef.current();
      if (e.key === 'ArrowRight') nextRef.current();
      if (e.key === 'ArrowLeft')  prevRef.current();
    };
    window.addEventListener('keydown', h);
    return () => { document.body.classList.remove('lb-open'); window.removeEventListener('keydown', h); };
  }, []);

  return createPortal(
    <div
      onClick={onClose}
      onMouseDown={e => e.stopPropagation()}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,.90)', backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeSlideIn .18s ease',
      }}
    >
      {/* Image */}
      <div
        style={{ position: 'relative', width: '82vw', height: '78vh', flexShrink: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <Image
          src={imgs[idx]} alt={`screenshot ${idx + 1}`}
          fill style={{ objectFit: 'contain', borderRadius: 10 }} sizes="82vw"
        />
      </div>

      {/* Counter */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(8px)',
        color: 'rgba(255,255,255,.80)', fontSize: 12, padding: '4px 14px',
        borderRadius: 20, fontFamily: 'var(--font-mono),monospace',
        border: '1px solid rgba(255,255,255,.12)',
      }}>
        {idx + 1} / {imgs.length}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 20, right: 24,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)',
          color: '#fff', cursor: 'pointer', fontSize: 18, lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.26)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.14)')}
      >
        ✕
      </button>

      {/* Prev / Next */}
      {imgs.length > 1 && (
        <>
          {[
            { label: '‹', pos: { left: 20 }, action: prev },
            { label: '›', pos: { right: 20 }, action: next },
          ].map(({ label, pos, action }) => (
            <button
              key={label}
              onClick={e => { e.stopPropagation(); action(); }}
              style={{
                position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                ...pos,
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)',
                color: '#fff', cursor: 'pointer', fontSize: 24, lineHeight: 1,
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

// ── Animated image carousel ───────────────────────────────────────────────────
function ImageCarousel({ imgs, dark }: { imgs: string[]; dark: boolean }) {
  const tk  = T(dark);
  const [idx, setIdx]         = useState(0);
  const [dir, setDir]         = useState<'right' | 'left'>('right');
  const [animKey, setAnimKey] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const go = useCallback((newIdx: number, direction: 'right' | 'left') => {
    setDir(direction);
    setAnimKey(k => k + 1);
    setIdx(newIdx);
  }, []);

  const prev = () => go((idx - 1 + imgs.length) % imgs.length, 'left');
  const next = () => go((idx + 1) % imgs.length, 'right');

  if (!imgs.length) return null;

  const navBtn = (label: string, onClick: () => void, side: 'left' | 'right') => (
    <button
      onClick={onClick}
      style={{
        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        [side]: 8,
        width: 32, height: 32, borderRadius: '50%',
        background: 'rgba(0,0,0,.42)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,.22)',
        color: '#fff', cursor: 'pointer', fontSize: 20, lineHeight: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background .15s, transform .15s',
        zIndex: 2,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,.66)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,.42)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
    >
      {label}
    </button>
  );

  return (
    <>
      {lightbox && <Lightbox imgs={imgs} startIdx={idx} onClose={() => setLightbox(false)} />}

      <div style={{ position: 'relative', width: '100%', marginBottom: 14 }}>
        {/* Main image frame */}
        <div style={{
          width: '100%', aspectRatio: '16/9', borderRadius: 10, overflow: 'hidden',
          background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
          position: 'relative',
        }}>
          {/* Animated slide wrapper */}
          <div
            key={animKey}
            style={{
              position: 'absolute', inset: 0,
              animation: `${dir === 'right' ? 'slideInFromRight' : 'slideInFromLeft'} .28s cubic-bezier(.22,1,.36,1)`,
            }}
          >
            <Image
              src={imgs[idx]} alt={`screenshot ${idx + 1}`}
              fill style={{ objectFit: 'contain' }} sizes="520px"
            />
          </div>

          {/* Fullscreen button */}
          <button
            onClick={() => setLightbox(true)}
            title="View fullscreen"
            style={{
              position: 'absolute', top: 8, right: 8, zIndex: 3,
              width: 30, height: 30, borderRadius: 8,
              background: 'rgba(0,0,0,.48)', backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,.22)',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,.72)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,.48)')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
            </svg>
          </button>

          {/* Prev / Next arrows */}
          {imgs.length > 1 && (
            <>
              {navBtn('‹', prev, 'left')}
              {navBtn('›', next, 'right')}
            </>
          )}
        </div>

        {/* Dot indicators */}
        {imgs.length > 1 && (
          <div style={{
            display: 'flex', gap: 6, justifyContent: 'center',
            marginTop: 10, alignItems: 'center',
          }}>
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > idx ? 'right' : 'left')}
                style={{
                  width: i === idx ? 18 : 6,
                  height: 6, borderRadius: 3, border: 'none',
                  background: i === idx ? tk.accent : (dark ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.20)'),
                  cursor: 'pointer',
                  transition: 'width .22s ease, background .18s',
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ── Project detail ────────────────────────────────────────────────────────────
function ProjectDetail({ title, onBack, dark }: { title: string; onBack: () => void; dark: boolean }) {
  const tk     = T(dark);
  const proj   = projects.find(p => p.title === title);
  const detail = projectDetails.find(d => d.title === title);
  if (!proj || !detail) return null;
  const sc = STATUS_BADGE[proj.status] || STATUS_BADGE.shipped;

  return (
    <div style={{ padding: '18px 22px', animation: 'slideRight .22s ease', color: tk.text }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 13px', borderRadius: 20,
          border: `1px solid ${tk.cardBorder}`, background: tk.cardBg,
          color: tk.text, fontSize: 13, cursor: 'pointer', marginBottom: 18,
          fontFamily: 'var(--font-sans),sans-serif', transition: 'all .15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = tk.accentBorder; e.currentTarget.style.color = tk.accent; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = tk.cardBorder;   e.currentTarget.style.color = tk.text; }}
      >
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
          <path d="M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        All Projects
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 38, lineHeight: 1, flexShrink: 0 }}>{proj.emoji}</span>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-serif),serif', fontSize: 24, fontWeight: 400,
              letterSpacing: '-.4px', color: tk.text, lineHeight: 1.1,
            }}>
              {proj.title}
            </h1>
            <div style={{ fontSize: 13.5, color: tk.textMuted, marginTop: 3 }}>{proj.tagline}</div>
          </div>
        </div>
        <span style={{
          fontSize: 10.5, fontFamily: 'var(--font-mono),monospace',
          padding: '3px 10px', borderRadius: 20,
          background: sc.bg, color: sc.txt, flexShrink: 0, marginTop: 4,
        }}>
          {sc.lbl}
        </span>
      </div>

      {proj.year && (
        <div style={{ fontSize: 11.5, fontFamily: 'var(--font-mono),monospace', color: tk.textMuted, marginBottom: 14 }}>
          📅 {proj.year}
        </div>
      )}

      <p style={{ fontSize: 13.5, color: tk.textSub, lineHeight: 1.74, marginBottom: 18 }}>
        {detail.description}
      </p>

      <ImageCarousel imgs={detail.images} dark={dark} />

      {detail.features && detail.features.length > 0 && (
        <>
          <Label dark={dark}>Key Features</Label>
          <div style={{
            background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
            borderRadius: 12, padding: '14px 16px', marginBottom: 18,
          }}>
            {detail.features.map((f, i) => <Bullet key={i} dark={dark}>{f}</Bullet>)}
          </div>
        </>
      )}

      <Label dark={dark}>Tech Stack</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 22 }}>
        {proj.techStack.split(', ').map(t => <Chip key={t} dark={dark}>{t}</Chip>)}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {detail.githubrepo && (
          <a href={detail.githubrepo} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 10, fontSize: 13.5, fontWeight: 500,
              background: tk.accentBg, border: `1px solid ${tk.accentBorder}`,
              color: tk.accent, textDecoration: 'none', transition: 'opacity .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            ⑂  View on GitHub ↗
          </a>
        )}
        {detail.isLive && detail.livelink && (
          <a href={detail.livelink} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 10, fontSize: 13.5, fontWeight: 500,
              background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
              color: tk.text, textDecoration: 'none', transition: 'opacity .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            🌐 Live Demo ↗
          </a>
        )}
      </div>
    </div>
  );
}

// ── Projects list ─────────────────────────────────────────────────────────────
export default function ProjectsWindow({ dark }: { dark: boolean }) {
  const tk = T(dark);
  const [detail, setDetail] = useState<string | null>(null);

  if (detail) {
    return <ProjectDetail title={detail} onBack={() => setDetail(null)} dark={dark} />;
  }

  return (
    <div style={{ padding: '20px 22px', color: tk.text }}>
      <WinTitle dark={dark}>My <em style={{ color: tk.accent, fontStyle: 'italic' }}>Projects</em></WinTitle>

      {projects.map(p => {
        const sc = STATUS_BADGE[p.status] || STATUS_BADGE.shipped;
        return (
          <div
            key={p.title}
            onClick={() => setDetail(p.title)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 14px', borderRadius: 12, marginBottom: 10,
              background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
              cursor: 'pointer', transition: 'all .18s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = tk.accentBorder;
              el.style.background  = dark ? 'rgba(255,255,255,.07)' : 'rgba(212,148,58,.045)';
              el.style.transform   = 'translateX(3px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = tk.cardBorder;
              el.style.background  = tk.cardBg;
              el.style.transform   = 'none';
            }}
          >
            <div style={{
              width: 56, height: 42, borderRadius: 8, overflow: 'hidden',
              flexShrink: 0, position: 'relative',
              background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
            }}>
              <Image src={p.image} alt={p.title} fill style={{ objectFit: 'cover' }} sizes="56px" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{p.emoji}</span>
                <span style={{ fontFamily: 'var(--font-serif),serif', fontSize: 16, color: tk.text }}>
                  {p.title}
                </span>
                {p.year && (
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono),monospace', color: tk.textMuted }}>
                    {p.year}
                  </span>
                )}
              </div>
              <div style={{
                fontSize: 12.5, color: tk.textMuted, marginTop: 2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {p.tagline}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 7 }}>
                {p.techStack.split(', ').slice(0, 3).map(t => <Chip key={t} dark={dark}>{t}</Chip>)}
                {p.techStack.split(', ').length > 3 && (
                  <span style={{ fontSize: 11, color: tk.textMuted, fontFamily: 'var(--font-mono),monospace', alignSelf: 'center' }}>
                    +{p.techStack.split(', ').length - 3}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              <span style={{
                fontSize: 10.5, fontFamily: 'var(--font-mono),monospace',
                padding: '3px 9px', borderRadius: 20,
                background: sc.bg, color: sc.txt, whiteSpace: 'nowrap',
              }}>
                {sc.lbl}
              </span>
              <svg width="5" height="9" viewBox="0 0 5 9" fill="none" style={{ opacity: .30 }}>
                <path d="M1 1l3.5 3.5L1 8" stroke={tk.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
