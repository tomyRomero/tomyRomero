'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { T, thumbVars } from '../tokens';
import { ME, images, profilePhoto, projects, totalSkills, yearsExperience, resumeFile, experiences, education } from '@/constants';
import { GitHubIcon, LinkedInIcon } from '../Icons';
import { requestResume } from '../ResumeDialog';
import { copyText } from '@/components/copyText';
import { Monogram, TOOLBAR_H, Download, Envelope, ShareIcon, CheckIcon, PinLine } from '../Native';

const TILTS = [-5, 4, -3, 6, -6, 3, -4, 7, -2, 5];

// Lightbox
export function Lightbox({ startIdx, onClose }: { startIdx: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIdx);
  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), []);
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), []);
  const cur  = images[idx];

  const onCloseRef = useRef(onClose); onCloseRef.current = onClose;
  const prevRef    = useRef(prev);    prevRef.current    = prev;
  const nextRef    = useRef(next);    nextRef.current    = next;

  useEffect(() => {
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

      <div style={{
        position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,.50)', color: 'rgba(255,255,255,.70)',
        fontSize: 12, padding: '3px 12px', borderRadius: 20,
        fontFamily: 'var(--font-mono),monospace',
        border: '1px solid rgba(255,255,255,.10)',
      }}>
        {idx + 1} / {images.length}
      </div>

      <div style={{
        position: 'absolute', bottom: 22, right: 24,
        color: 'rgba(255,255,255,.32)', fontSize: 11,
        fontFamily: 'var(--font-mono),monospace',
      }}>
        ← → esc
      </div>

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

// Photo strip
function PhotoStrip({ dark, onOpen }: { dark: boolean; onOpen: (i: number) => void }) {
  const [hov, setHov] = useState<number | null>(null);
  return (
    <div className="hscroll" style={{ ...thumbVars(dark), overflowX: 'auto', padding: '14px 0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, width: 'max-content', padding: '0 26px' }}>
        {images.map((img, i) => {
          const tilt = TILTS[i % TILTS.length];
          const on = hov === i;
          // The entrance runs on a wrapper so its last frame doesn't override the tilt
          return (
            <span key={i} style={{
              flexShrink: 0, position: 'relative', zIndex: on ? 2 : 1,
              animation: `photoIn .5s ${i * 0.05}s cubic-bezier(.16,1,.3,1) both`,
            }}>
              <button
                aria-label={`Open photo: ${img.title}`}
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                onClick={() => onOpen(i)}
                style={{
                  display: 'block', width: 118, padding: '7px 7px 24px',
                  background: dark ? '#e8e4da' : '#faf8f3', borderRadius: 2,
                  transform: `rotate(${on ? 0 : tilt}deg) translateY(${on ? -4 : (i % 3) * 3}px) scale(${on ? 1.08 : 1})`,
                  transition: 'transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease',
                  boxShadow: on
                    ? '0 18px 40px rgba(0,0,0,.3), 0 4px 12px rgba(0,0,0,.18)'
                    : `0 8px 20px rgba(0,0,0,${dark ? '.45' : '.16'})`,
                }}
              >
                <span style={{ position: 'relative', display: 'block', width: 104, height: 104, overflow: 'hidden', background: '#d0ccc4' }}>
                  <Image src={img.img} alt="" fill style={{ objectFit: 'cover' }} sizes="104px" />
                </span>
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function Tile({ label, icon, primary, dark, href, onClick }: {
  label: string; icon: React.ReactNode; primary?: boolean; dark: boolean;
  href?: string; onClick?: (e: React.MouseEvent) => void;
}) {
  const tk = T(dark);
  const style: React.CSSProperties = {
    height: 68, borderRadius: 14,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
    fontSize: 13, fontWeight: primary ? 600 : 500,
    background: primary ? tk.select : dark ? '#2c2c30' : '#ffffff',
    color: primary ? '#fff' : tk.accent,
    boxShadow: primary
      ? `0 10px 24px ${dark ? 'rgba(10,132,255,.3)' : 'rgba(0,98,204,.32)'}`
      : dark ? '0 0 0 .5px rgba(255,255,255,.08), 0 10px 24px rgba(0,0,0,.4)' : '0 0 0 .5px rgba(0,0,0,.08), 0 10px 24px rgba(0,0,0,.1)',
    transition: 'transform .16s ease, filter .16s ease',
  };
  const lift = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.04)'; };
  const drop = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'none'; };
  const ext = href?.startsWith('http');
  return href ? (
    <a href={href} onClick={onClick} style={style} onMouseEnter={lift} onMouseLeave={drop}
      {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {icon}{label}
    </a>
  ) : (
    <button onClick={onClick} style={style} onMouseEnter={lift} onMouseLeave={drop}>{icon}{label}</button>
  );
}

// A labeled row, Contacts style
function CardRow({ label, dark, last, center, children }: {
  label: string; dark: boolean; last?: boolean; center?: boolean; children: React.ReactNode;
}) {
  const tk = T(dark);
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '72px minmax(0, 1fr)', gap: 16, alignItems: center ? 'center' : 'start',
      padding: '12px 2px', borderBottom: last ? 'none' : `1px solid ${tk.sep}`,
    }}>
      <div style={{ fontSize: 12.5, fontWeight: 500, color: tk.label2, textAlign: 'right', paddingTop: center ? 0 : 2 }}>{label}</div>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}

const DEGREE_SHORT: Record<string, string> = { 'Bachelor of Science': 'B.S.' };
const HEADER_H = 272;

export default function AboutWindow({ dark, onOpen }: {
  dark: boolean; onOpen?: (id: string) => void;
}) {
  const tk = T(dark);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  // Load the strip after the window opens
  const [showPhotos, setShowPhotos] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowPhotos(true), 300);
    return () => clearTimeout(t);
  }, []);

  const role = experiences[0];
  const school = education[0];

  const copyLink = () => {
    copyText(ME.portfolio).then(ok => {
      if (!ok) return;
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  const stat = (value: string, label: string, id: string, mid?: boolean) => (
    <button
      onClick={() => onOpen?.(id)}
      style={{
        padding: '14px 0 13px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        borderLeft: mid ? `1px solid ${tk.sep}` : 'none', borderRight: mid ? `1px solid ${tk.sep}` : 'none',
        color: tk.label, transition: 'background .15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.025)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.8px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ fontSize: 12.5, color: tk.label2 }}>{label}</span>
    </button>
  );

  return (
    <div style={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', background: tk.pane }}>
      {lightbox !== null && <Lightbox startIdx={lightbox} onClose={() => setLightbox(null)} />}

      {/* Compact title bar once the header scrolls away */}
      <div data-drag="" aria-hidden={!collapsed} style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: TOOLBAR_H, zIndex: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: dark ? 'rgba(28,28,31,.82)' : 'rgba(255,255,255,.82)',
        backdropFilter: 'blur(20px) saturate(1.8)', WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
        borderBottom: `1px solid ${tk.sep}`,
        fontSize: 13, fontWeight: 600, color: tk.label,
        opacity: collapsed ? 1 : 0, pointerEvents: collapsed ? 'auto' : 'none',
        transition: 'opacity .18s ease',
      }}>
        {ME.name}
      </div>

      <div
        onScroll={e => {
          const c = e.currentTarget.scrollTop > HEADER_H - TOOLBAR_H - 8;
          if (c !== collapsed) setCollapsed(c);
        }}
        style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden' }}
      >
        {/* Header: blurred photo behind the name */}
        <header data-drag="" style={{ position: 'relative', height: HEADER_H, overflow: 'hidden', background: '#3b3a36', color: '#fff' }}>
          {/* Blurred placeholder, no extra request */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, backgroundImage: `url(${profilePhoto.blurDataURL})`, backgroundSize: 'cover', backgroundPosition: 'center',
            filter: 'blur(26px) saturate(1.5)', transform: 'scale(1.35)', opacity: .95,
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.1) 0%, rgba(0,0,0,.4) 100%)' }} />

          <button
            onClick={copyLink}
            aria-label={copied ? 'Link copied' : 'Copy link to this portfolio'}
            title={copied ? 'Link copied' : 'Copy link'}
            style={{
              position: 'absolute', top: 12, right: 14, zIndex: 1,
              height: 28, minWidth: 32, padding: '0 8px', borderRadius: 8,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: 'rgba(255,255,255,.18)', color: '#fff', fontSize: 12.5, fontWeight: 500,
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.28)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.18)')}
          >
            {copied ? <><CheckIcon s={14} />Copied</> : <ShareIcon />}
          </button>

          <div style={{
            position: 'relative', height: '100%', paddingBottom: 30,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              position: 'relative', width: 104, height: 104, borderRadius: '50%', overflow: 'hidden',
              boxShadow: '0 0 0 3px rgba(255,255,255,.9), 0 12px 30px rgba(0,0,0,.35)',
            }}>
              <Image src={profilePhoto} alt="Tomy Romero" fill sizes="104px" priority style={{ objectFit: 'cover' }} />
            </div>
            <h2 style={{ marginTop: 14, fontSize: 30, fontWeight: 700, letterSpacing: '-.7px', lineHeight: 1.05, textShadow: '0 2px 12px rgba(0,0,0,.25)' }}>
              {ME.name}
            </h2>
            <div style={{ marginTop: 5, fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,.92)' }}>{ME.title}</div>
            <div style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px 4px 9px', borderRadius: 20,
                background: 'rgba(255,255,255,.18)', fontSize: 12.5, fontWeight: 500,
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              }}>
                <PinLine />{ME.location}
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px 4px 9px', borderRadius: 20,
                background: 'rgba(24,128,56,.62)', fontSize: 12.5, fontWeight: 600,
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#5ee07c', boxShadow: '0 0 0 3px rgba(94,224,124,.25)', animation: 'pulse 2s infinite' }} />
                Open to opportunities
              </span>
            </div>
          </div>
        </header>

        {/* Readable width when zoomed */}
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ position: 'relative', margin: '-34px 24px 0', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
          <Tile
            primary dark={dark} label="Resume" icon={<Download s={22} />}
            href={resumeFile.href} onClick={e => { e.preventDefault(); requestResume(); }}
          />
          <Tile dark={dark} label="Email" icon={<Envelope s={22} />} onClick={() => onOpen?.('contact')} />
          <Tile dark={dark} label="GitHub" icon={<GitHubIcon s={21} />} href={ME.github} />
          <Tile dark={dark} label="LinkedIn" icon={<LinkedInIcon s={20} />} href={ME.linkedin} />
        </div>

        <div style={{
          margin: '20px 24px 0', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          borderRadius: 14, background: tk.paneAlt, overflow: 'hidden',
        }}>
          {stat(yearsExperience(), 'Years', 'experience')}
          {stat(String(projects.length), 'Projects', 'projects', true)}
          {stat(String(totalSkills), 'Technologies', 'skills')}
        </div>

        <div style={{ margin: '10px 24px 0' }}>
          <CardRow label="note" dark={dark}>
            <p className="text-pretty" style={{ fontSize: 14, lineHeight: 1.6, color: tk.label }}>{ME.bio}</p>
          </CardRow>
          <CardRow label="work" dark={dark} center>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Monogram text={role.logo} t={role.tint} dark={dark} size={30} round={false} />
              <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 14, color: tk.label }}>{role.title}</span>
                <span style={{ fontSize: 12.5, color: tk.label2 }}>{role.company} · {role.date}</span>
              </div>
            </div>
          </CardRow>
          <CardRow label="education" dark={dark} last center>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Monogram text={school.logo} t={school.tint} dark={dark} size={30} round={false} />
              <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 14, color: tk.label }}>{DEGREE_SHORT[school.degree] ?? school.degree} {school.field}</span>
                <span style={{ fontSize: 12.5, color: tk.label2 }}>{school.institution} · {school.years}</span>
              </div>
            </div>
          </CardRow>
        </div>

        <div style={{ margin: '8px 26px 0', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: tk.label }}>Photos</h3>
          <button onClick={() => setLightbox(0)} style={{ fontSize: 12.5, fontWeight: 500, color: tk.accent }}>
            Show all {images.length}
          </button>
        </div>
        {showPhotos ? <PhotoStrip dark={dark} onOpen={setLightbox} /> : <div style={{ height: 196 }} />}
        </div>
      </div>
    </div>
  );
}
