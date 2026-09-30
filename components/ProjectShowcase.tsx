'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { T } from '@/components/mac/tokens';
import { projects, projectDetails, shotsFor, isTallShot, shotLabel } from '@/constants';
import ProjectCover from '@/components/ProjectCover';
import { Browser, Phone } from '@/components/DeviceFrames';
import { CheckIcon } from '@/components/mac/Native';

type Project = (typeof projects)[number];
export const stackOf = (p: Project) => p.techStack.split(', ');
export const PLATFORM = { web: 'Web app', mobile: 'Mobile app' } as const;
const repoPath = (url: string) => url.replace(/^https:\/\/github\.com\//, '');

export function hasLiveDemo(title: string) {
  const d = projectDetails.find(x => x.title === title);
  return !!(d?.isLive && d.livelink);
}

// Lightbox
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
      <div
        style={{ position: 'relative', width: '82vw', height: '78vh', flexShrink: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <Image
          src={imgs[idx]} alt={`screenshot ${idx + 1}`}
          fill style={{ objectFit: 'contain', borderRadius: 10 }} sizes="82vw"
        />
      </div>

      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(8px)',
        color: 'rgba(255,255,255,.80)', fontSize: 12, padding: '4px 14px',
        borderRadius: 20, fontFamily: 'var(--font-mono),monospace',
        border: '1px solid rgba(255,255,255,.12)',
      }}>
        {idx + 1} / {imgs.length}
      </div>

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

// stacked: single column for narrow windows. level: heading level for the tagline.
export default function Showcase({ title, dark, stacked = false, level = 3, animate = true }: {
  title: string; dark: boolean; stacked?: boolean; level?: 2 | 3; animate?: boolean;
}) {
  const tk = T(dark);
  const p = projects.find(x => x.title === title)!;
  const d = projectDetails.find(x => x.title === title)!;
  const shots = shotsFor(title);
  const [idx, setIdxRaw] = useState(0);
  // No entrance fade; it delays first paint
  const [moved, setMoved] = useState(false);
  const setIdx = (i: number) => { setMoved(true); setIdxRaw(i); };
  const [lightbox, setLightbox] = useState<number | null>(null);
  const H = `h${level}` as 'h2' | 'h3';
  const H2 = `h${level + 1}` as 'h3' | 'h4';
  const cur = shots[idx];
  const tall = isTallShot(cur);
  const phoneShot = shots.find(isTallShot);
  // A web project's first slide shows desktop and phone together
  const pair = !tall && idx === 0 && !!phoneShot;
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    const t = strip?.children[idx] as HTMLElement | undefined;
    if (strip && t) strip.scrollTo({ left: t.offsetLeft - strip.clientWidth / 2 + t.clientWidth / 2, behavior: 'smooth' });
  }, [idx]);

  const facts: [string, React.ReactNode][] = [
    ['Year', d.year],
    ['Screenshots', String(shots.length)],
  ];

  return (
    <div className="showcase" style={{ padding: '0 24px 30px', animation: animate ? 'slideRight .22s ease' : undefined }}>
      {lightbox !== null && <Lightbox imgs={d.images} startIdx={lightbox} onClose={() => setLightbox(null)} />}

      {cur ? (
        <div
          onClick={() => setLightbox(idx)}
          style={{
            position: 'relative', height: 'clamp(280px, 42vh, 440px)', borderRadius: 18, overflow: 'hidden', cursor: 'zoom-in',
            background: dark ? '#232428' : '#eef1f6',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${dark ? 'rgba(255,255,255,.06)' : 'rgba(30,50,90,.09)'} 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />
          {tall ? (
            <div key={idx} style={{ position: 'absolute', inset: '26px 0 0', animation: moved ? 'fadeIn .25s ease' : undefined }}>
              {[idx - 1, idx, idx + 1].map(j => {
                const s = shots[j];
                if (!s || !isTallShot(s)) return null;
                const main = j === idx;
                const place: React.CSSProperties = main
                  ? { left: '50%', transform: 'translateX(-50%)' }
                  : j < idx ? { right: 'calc(50% + 117px)', top: 36 } : { left: 'calc(50% + 117px)', top: 36 };
                return (
                  <div key={j} onClick={main ? undefined : e => { e.stopPropagation(); setIdx(j); }} style={{
                    position: 'absolute', top: 0, ...place, opacity: main ? 1 : .55, cursor: main ? 'zoom-in' : 'pointer',
                    transition: 'opacity .2s',
                  }}>
                    <Phone shot={s} width={main ? 190 : 150} sizes={main ? '200px' : '160px'} priority={main} alt={main ? `${title}: ${shotLabel(s)}` : ''} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div key={idx} style={{ position: 'absolute', left: '7%', right: pair ? '14%' : '7%', top: 34, animation: moved ? 'fadeIn .25s ease' : undefined }}>
              <Browser shot={cur} label={`${title} · ${shotLabel(cur)}`} dark={dark} sizes="(max-width: 1400px) 640px, 820px" priority aspect="16 / 10" />
            </div>
          )}
          {pair && phoneShot && (
            <div style={{ position: 'absolute', right: '5%', bottom: -60, width: 'clamp(110px, 16%, 160px)' }}>
              <Phone shot={phoneShot} width="100%" sizes="160px" priority alt={`${title}: ${shotLabel(phoneShot)}`} shadow="0 18px 40px rgba(0,0,0,.28)" />
            </div>
          )}
          <span style={{
            position: 'absolute', left: 14, bottom: 14, padding: '5px 11px', borderRadius: 9, fontSize: 12.5, fontWeight: 500,
            background: dark ? 'rgba(40,40,44,.85)' : 'rgba(255,255,255,.88)', color: tk.label,
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', boxShadow: `0 0 0 .5px ${tk.sep}`,
          }}>
            {pair ? 'Web and mobile' : shotLabel(cur)} · {idx + 1} of {shots.length}
          </span>
          <button
            onClick={e => { e.stopPropagation(); setLightbox(idx); }}
            aria-label={`View ${shotLabel(cur)} full size`}
            title="View full size"
            style={{
              position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 9,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: tk.label,
              background: dark ? 'rgba(40,40,44,.85)' : 'rgba(255,255,255,.88)', boxShadow: `0 0 0 .5px ${tk.sep}`,
              backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
            </svg>
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative', height: 260, borderRadius: 18, overflow: 'hidden' }}>
          <ProjectCover title={title} shot={null} sizes="600px" dark={dark} size="lg" />
        </div>
      )}

      {shots.length > 1 && (
        <div ref={stripRef} style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto', padding: '3px 3px 8px' }}>
          {shots.map((s, i) => (
            <button
              key={s.src}
              onClick={() => setIdx(i)}
              aria-label={shotLabel(s)}
              aria-current={i === idx}
              style={{
                position: 'relative', flexShrink: 0, width: isTallShot(s) ? 40 : 100, height: 64, borderRadius: 8, overflow: 'hidden',
                background: tk.paneAlt, opacity: i === idx ? 1 : .8,
                boxShadow: i === idx ? `0 0 0 2.5px ${tk.select}` : `0 0 0 .5px ${tk.sep}`,
                transition: 'opacity .15s, box-shadow .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = i === idx ? '1' : '.8')}
            >
              <Image src={s.src} alt="" fill sizes="100px" style={{ objectFit: s.framed ? 'contain' : 'cover', objectPosition: 'top' }} />
            </button>
          ))}
        </div>
      )}

      <div className="showcase-cols" style={{ marginTop: 22, display: 'grid', gridTemplateColumns: stacked ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) 260px', gap: 28, alignItems: 'start' }}>
        <div>
          <H style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.4px', lineHeight: 1.2, textWrap: 'balance' }}>{p.tagline}</H>
          <p className="text-pretty" style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.65, color: tk.label }}>{d.description}</p>
          {d.features.length > 0 && (
            <>
              <H2 style={{ marginTop: 20, fontSize: 14, fontWeight: 600 }}>Key features</H2>
              <ul style={{ marginTop: 10, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px 24px' }}>
                {d.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 9, fontSize: 14, lineHeight: 1.45 }}>
                    <span style={{ color: tk.accent, flexShrink: 0, marginTop: 1 }}><CheckIcon s={15} /></span>{f}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <aside style={{ borderRadius: 16, background: tk.paneAlt, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Fact label="Type" dark={dark}>{d.type}</Fact>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {facts.map(([k, v]) => <Fact key={k} label={k} dark={dark}>{v}</Fact>)}
          </div>
          <Fact label="Stack" dark={dark}>
            <span style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 3 }}>
              {stackOf(p).map(t => (
                <span key={t} style={{ padding: '3px 9px', borderRadius: 7, fontSize: 12.5, fontWeight: 500, background: tk.pane, boxShadow: `0 0 0 .5px ${tk.sep}` }}>{t}</span>
              ))}
            </span>
          </Fact>
          {d.githubrepo && (
            <Fact label="Source" dark={dark}>
              <a href={d.githubrepo} target="_blank" rel="noopener noreferrer" style={{ color: tk.accent, wordBreak: 'break-word' }}>{repoPath(d.githubrepo)}</a>
            </Fact>
          )}
          {d.isLive && d.livelink && (
            <Fact label="Live demo" dark={dark}>
              <a href={d.livelink} target="_blank" rel="noopener noreferrer" style={{ color: tk.accent, wordBreak: 'break-word' }}>{d.livelink.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a>
            </Fact>
          )}
        </aside>
      </div>
    </div>
  );
}

function Fact({ label, dark, children }: { label: string; dark: boolean; children: React.ReactNode }) {
  const tk = T(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 14, color: tk.label }}>
      <span style={{ fontSize: 12.5, color: tk.label2 }}>{label}</span>
      {children}
    </div>
  );
}

