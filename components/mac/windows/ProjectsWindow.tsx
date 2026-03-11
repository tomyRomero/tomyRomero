'use client';
import { useState } from 'react';
import Image from 'next/image';
import { T } from '../tokens';
import { Chip, WinTitle, Bullet, Label } from '../Atoms';
import { projects, projectDetails } from '@/constants';

const STATUS_BADGE: Record<string, { bg: string; txt: string; lbl: string }> = {
  shipped:     { bg: 'rgba(52,199,89,.12)',  txt: '#1da044', lbl: 'Shipped ✓' },
  'in-progress':{ bg: 'rgba(255,159,10,.12)',txt: '#d07a00', lbl: 'In Progress' },
  ongoing:     { bg: 'rgba(212,148,58,.14)', txt: '#D4943A', lbl: 'Ongoing ⚡' },
  archived:    { bg: 'rgba(120,120,128,.1)', txt: '#888',    lbl: 'Archived' },
};

// ── Simple image carousel ────────────────────────────────────────────────────
function ImageCarousel({ imgs, dark }: { imgs: string[]; dark: boolean }) {
  const tk = T(dark);
  const [idx, setIdx] = useState(0);
  if (!imgs.length) return null;
  const prev = () => setIdx(i => (i - 1 + imgs.length) % imgs.length);
  const next = () => setIdx(i => (i + 1) % imgs.length);

  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: 18 }}>
      <div style={{
        width: '100%', aspectRatio: '16/9', borderRadius: 10, overflow: 'hidden',
        background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
        position: 'relative',
      }}>
        <Image
          src={imgs[idx]}
          alt={`screenshot ${idx + 1}`}
          fill
          style={{ objectFit: 'contain' }}
          sizes="500px"
        />
      </div>
      {imgs.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 10 }}>
          <button
            onClick={prev}
            style={{
              width: 28, height: 28, borderRadius: '50%', border: `1px solid ${tk.cardBorder}`,
              background: tk.cardBg, color: tk.text, cursor: 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = tk.accentBg; e.currentTarget.style.borderColor = tk.accentBorder; }}
            onMouseLeave={e => { e.currentTarget.style.background = tk.cardBg; e.currentTarget.style.borderColor = tk.cardBorder; }}
          >
            ‹
          </button>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono), monospace', color: tk.textMuted }}>
            {idx + 1} / {imgs.length}
          </span>
          <button
            onClick={next}
            style={{
              width: 28, height: 28, borderRadius: '50%', border: `1px solid ${tk.cardBorder}`,
              background: tk.cardBg, color: tk.text, cursor: 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = tk.accentBg; e.currentTarget.style.borderColor = tk.accentBorder; }}
            onMouseLeave={e => { e.currentTarget.style.background = tk.cardBg; e.currentTarget.style.borderColor = tk.cardBorder; }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

// ── Project detail view ───────────────────────────────────────────────────────
function ProjectDetail({ title, onBack, dark }: { title: string; onBack: () => void; dark: boolean }) {
  const tk = T(dark);
  const proj = projects.find(p => p.title === title);
  const detail = projectDetails.find(d => d.title === title);
  if (!proj || !detail) return null;
  const sc = STATUS_BADGE[proj.status] || STATUS_BADGE.shipped;

  return (
    <div style={{ padding: '18px 24px', animation: 'slideRight .2s ease', color: tk.text }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 13px', borderRadius: 20,
          border: `1px solid ${tk.cardBorder}`, background: tk.cardBg,
          color: tk.text, fontSize: 13, cursor: 'default', marginBottom: 18,
          fontFamily: 'var(--font-sans), sans-serif', transition: 'all .15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = tk.accentBorder; e.currentTarget.style.color = tk.accent; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = tk.cardBorder; e.currentTarget.style.color = tk.text; }}
      >
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
          <path d="M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All Projects
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 38, lineHeight: 1, flexShrink: 0 }}>{proj.emoji}</span>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-serif), serif', fontSize: 26, fontWeight: 400,
              letterSpacing: '-.4px', color: tk.text, lineHeight: 1.1,
            }}>
              {proj.title}
            </h1>
            <div style={{ fontSize: 13.5, color: tk.textMuted, marginTop: 3 }}>{proj.tagline}</div>
          </div>
        </div>
        <span style={{
          fontSize: 10.5, fontFamily: 'var(--font-mono), monospace',
          padding: '3px 10px', borderRadius: 20,
          background: sc.bg, color: sc.txt, flexShrink: 0, marginTop: 4,
        }}>
          {sc.lbl}
        </span>
      </div>

      {/* Year */}
      {proj.year && (
        <div style={{ fontSize: 11.5, fontFamily: 'var(--font-mono), monospace', color: tk.textMuted, marginBottom: 14 }}>
          📅 {proj.year}
        </div>
      )}

      {/* Description */}
      <p style={{ fontSize: 13.5, color: tk.textSub, lineHeight: 1.74, marginBottom: 18 }}>
        {detail.description}
      </p>

      {/* Image carousel */}
      <ImageCarousel imgs={detail.images} dark={dark} />

      {/* Features */}
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

      {/* Tech stack */}
      <Label dark={dark}>Tech Stack</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 22 }}>
        {proj.techStack.split(', ').map(t => <Chip key={t} dark={dark}>{t}</Chip>)}
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {detail.githubrepo && (
          <a
            href={detail.githubrepo} target="_blank" rel="noopener noreferrer"
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
          <a
            href={detail.livelink} target="_blank" rel="noopener noreferrer"
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

// ── Projects list view ────────────────────────────────────────────────────────
export default function ProjectsWindow({ dark }: { dark: boolean }) {
  const tk = T(dark);
  const [detail, setDetail] = useState<string | null>(null);

  if (detail) {
    return <ProjectDetail title={detail} onBack={() => setDetail(null)} dark={dark} />;
  }

  return (
    <div style={{ padding: '22px 24px', color: tk.text }}>
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
              cursor: 'default', transition: 'all .17s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = tk.accentBorder;
              el.style.background = dark ? 'rgba(255,255,255,.07)' : 'rgba(212,148,58,.045)';
              el.style.transform = 'translateX(3px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = tk.cardBorder;
              el.style.background = tk.cardBg;
              el.style.transform = 'none';
            }}
          >
            {/* Thumbnail */}
            <div style={{
              width: 56, height: 42, borderRadius: 8, overflow: 'hidden',
              flexShrink: 0, position: 'relative',
              background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
            }}>
              <Image
                src={p.image}
                alt={p.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="56px"
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{p.emoji}</span>
                <span style={{ fontFamily: 'var(--font-serif), serif', fontSize: 16, color: tk.text }}>
                  {p.title}
                </span>
                {p.year && (
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono), monospace', color: tk.textMuted }}>
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
                  <span style={{ fontSize: 11, color: tk.textMuted, fontFamily: 'var(--font-mono), monospace', alignSelf: 'center', paddingLeft: 2 }}>
                    +{p.techStack.split(', ').length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Status + chevron */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              <span style={{
                fontSize: 10.5, fontFamily: 'var(--font-mono), monospace',
                padding: '3px 9px', borderRadius: 20,
                background: sc.bg, color: sc.txt, whiteSpace: 'nowrap',
              }}>
                {sc.lbl}
              </span>
              <svg width="5" height="9" viewBox="0 0 5 9" fill="none" style={{ opacity: .32 }}>
                <path d="M1 1l3.5 3.5L1 8" stroke={tk.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
