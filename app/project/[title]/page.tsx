'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { projectDetails, projects } from '@/constants';

// ── Tokens (mirrors MobileView) ───────────────────────────────────────────────
function useTokens(dark: boolean) {
  return {
    bg:           dark ? '#0a0d14'                         : '#f0ede8',
    text:         dark ? '#f2f2f7'                         : '#1a1a1e',
    textMuted:    dark ? 'rgba(255,255,255,.50)'           : 'rgba(0,0,0,.50)',
    textSub:      dark ? 'rgba(255,255,255,.70)'           : 'rgba(0,0,0,.72)',
    cardBg:       dark ? 'rgba(255,255,255,.06)'           : 'rgba(0,0,0,.04)',
    cardBorder:   dark ? 'rgba(255,255,255,.10)'           : 'rgba(0,0,0,.08)',
    accent:       '#d4943a',
    accentBg:     dark ? 'rgba(212,148,58,.12)'            : 'rgba(212,148,58,.09)',
    accentBorder: dark ? 'rgba(212,148,58,.28)'            : 'rgba(212,148,58,.22)',
    navBg:        dark ? 'rgba(10,13,20,.94)'              : 'rgba(240,237,232,.94)',
    pillBg:       dark ? 'rgba(255,255,255,.08)'           : 'rgba(0,0,0,.05)',
    pillBorder:   dark ? 'rgba(255,255,255,.12)'           : 'rgba(0,0,0,.08)',
  };
}

function SectionLabel({ text, accent }: { text: string; accent: string }) {
  return (
    <div style={{
      fontSize: 11, letterSpacing: '1.3px', textTransform: 'uppercase' as const,
      fontFamily: 'var(--font-mono),monospace', color: accent,
      marginBottom: 14, marginTop: 6,
    }}>
      {text}
    </div>
  );
}

export default function ProjectPage({ params }: { params: { title: string } }) {
  const router = useRouter();
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('dark');
    return saved !== null ? saved === 'true' : false;
  });
  const [imgIdx, setImgIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  // Persist toggle so going back to desktop stays in sync
  useEffect(() => { localStorage.setItem('dark', String(dark)); }, [dark]);

  const decodedTitle = decodeURIComponent(params.title);
  const detail = projectDetails.find(p => p.title === decodedTitle);
  const summary = projects.find(p => p.title === decodedTitle);

  const tk = useTokens(dark);

  if (!detail) {
    return (
      <div style={{
        minHeight: '100dvh', background: tk.bg, color: tk.text,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 16,
        fontFamily: 'var(--font-sans),sans-serif',
      }}>
        <div style={{ fontSize: 40 }}>🔍</div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Project not found</div>
        <button
          onClick={() => router.back()}
          style={{
            padding: '10px 22px', borderRadius: 10, fontSize: 13,
            background: tk.accentBg, border: `1px solid ${tk.accentBorder}`,
            color: tk.accent, cursor: 'pointer',
            fontFamily: 'var(--font-mono),monospace',
          }}
        >
          ← Go back
        </button>
      </div>
    );
  }

  const images = detail.images.filter(Boolean);
  const prev = () => setImgIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setImgIdx(i => (i + 1) % images.length);

  return (
    <div style={{
      position: 'fixed', inset: 0, overflowY: 'auto',
      background: tk.bg, color: tk.text,
      fontFamily: 'var(--font-sans),sans-serif',
      userSelect: 'text',
    }}>

      {/* ── Sticky nav ──────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 20px',
        background: tk.navBg,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${tk.cardBorder}`,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
            borderRadius: 10, padding: '7px 14px', cursor: 'pointer',
            fontSize: 13, color: tk.textSub,
            fontFamily: 'var(--font-sans),sans-serif',
            transition: 'opacity .15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '.70')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <span style={{ fontSize: 15 }}>←</span> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {summary && <span style={{ fontSize: 18 }}>{summary.emoji}</span>}
          <span style={{ fontSize: 15, fontWeight: 600, color: tk.text, letterSpacing: '-.2px' }}>
            {detail.title}
          </span>
        </div>

        <button
          onClick={() => setDark(d => !d)}
          style={{
            background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
            borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
            fontSize: 15, color: tk.text,
          }}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </nav>

      {/* ── Page body ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 540, margin: '0 auto', padding: '0 20px 80px' }}>

        {/* Hero */}
        <div style={{ padding: '32px 0 24px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14,
          }}>
            {summary && (
              <div style={{
                width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                background: tk.accentBg, border: `1px solid ${tk.accentBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
              }}>
                {summary.emoji}
              </div>
            )}
            <div>
              <h1 style={{
                fontFamily: 'var(--font-serif),serif', fontSize: 26, fontWeight: 400,
                letterSpacing: '-.3px', marginBottom: 4, color: tk.text,
              }}>
                {detail.title}
              </h1>
              <div style={{ fontSize: 13, color: tk.accent }}>{detail.type}</div>
            </div>
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
            <span style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 11,
              fontFamily: 'var(--font-mono),monospace',
              background: tk.accentBg, border: `1px solid ${tk.accentBorder}`,
              color: tk.accent,
            }}>
              {detail.year}
            </span>
            <span style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 11,
              fontFamily: 'var(--font-mono),monospace',
              background: detail.isLive
                ? 'rgba(52,199,89,.10)' : tk.pillBg,
              border: `1px solid ${detail.isLive ? 'rgba(52,199,89,.28)' : tk.pillBorder}`,
              color: detail.isLive ? '#34c759' : tk.textMuted,
            }}>
              {detail.isLive ? '● Live' : '⑂ GitHub only'}
            </span>
          </div>
        </div>

        {/* ── Image gallery ────────────────────────────────────────────────── */}
        {images.length > 0 && (
          <>
            <SectionLabel text="Gallery" accent={tk.accent} />
            <div style={{ marginBottom: 28 }}>
              {/* Main image */}
              <div
                onClick={() => setLightbox(true)}
                style={{
                  position: 'relative', width: '100%', aspectRatio: '16/10',
                  borderRadius: 14, overflow: 'hidden',
                  background: dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)',
                  border: `1px solid ${tk.cardBorder}`,
                  cursor: 'zoom-in', marginBottom: 10,
                }}
              >
                <Image
                  src={images[imgIdx]}
                  alt={`${detail.title} screenshot ${imgIdx + 1}`}
                  fill
                  style={{ objectFit: 'contain', padding: 4 }}
                  sizes="540px"
                />
                {/* Counter badge */}
                <div style={{
                  position: 'absolute', bottom: 10, right: 10,
                  background: 'rgba(0,0,0,.60)', backdropFilter: 'blur(8px)',
                  borderRadius: 20, padding: '3px 10px',
                  fontSize: 11, color: 'rgba(255,255,255,.85)',
                  fontFamily: 'var(--font-mono),monospace',
                }}>
                  {imgIdx + 1} / {images.length}
                </div>
              </div>

              {/* Prev / Next + thumbnail strip */}
              {images.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={prev}
                    style={{
                      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                      background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
                      color: tk.textSub, fontSize: 16, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >‹</button>

                  <div style={{
                    flex: 1, display: 'flex', gap: 6, overflowX: 'auto',
                    scrollbarWidth: 'none', paddingBottom: 2,
                  }}>
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        style={{
                          flexShrink: 0, width: 52, height: 36,
                          borderRadius: 7, overflow: 'hidden', padding: 0,
                          border: i === imgIdx
                            ? `2px solid ${tk.accent}`
                            : `1px solid ${tk.cardBorder}`,
                          cursor: 'pointer', position: 'relative',
                          opacity: i === imgIdx ? 1 : 0.55,
                          transition: 'opacity .15s, border-color .15s',
                          background: tk.cardBg,
                        }}
                      >
                        <Image
                          src={img} alt="" fill
                          style={{ objectFit: 'cover' }} sizes="52px"
                        />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={next}
                    style={{
                      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                      background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
                      color: tk.textSub, fontSize: 16, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >›</button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Description ──────────────────────────────────────────────────── */}
        <SectionLabel text="About" accent={tk.accent} />
        <div style={{
          background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
          borderRadius: 14, padding: '16px 18px', marginBottom: 22,
          fontSize: 14, lineHeight: 1.76, color: tk.textSub,
        }}>
          {detail.description}
        </div>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        {detail.features && detail.features.length > 0 && (
          <>
            <SectionLabel text="Features" accent={tk.accent} />
            <div style={{
              background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
              borderRadius: 14, padding: '14px 18px', marginBottom: 22,
            }}>
              {detail.features.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', gap: 10, fontSize: 13.5,
                    color: tk.textSub, lineHeight: 1.65,
                    marginBottom: i < detail.features.length - 1 ? 10 : 0,
                    paddingBottom: i < detail.features.length - 1 ? 10 : 0,
                    borderBottom: i < detail.features.length - 1
                      ? `1px solid ${tk.cardBorder}` : 'none',
                  }}
                >
                  <span style={{ color: tk.accent, flexShrink: 0, marginTop: 3, fontSize: 11 }}>→</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Tech stack ───────────────────────────────────────────────────── */}
        {detail.tools && detail.tools.length > 0 && (
          <>
            <SectionLabel text="Tech Stack" accent={tk.accent} />
            <div style={{
              display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 28,
            }}>
              {detail.tools.map((tool, i) => (
                <div
                  key={i}
                  style={{
                    position: 'relative', width: 36, height: 36,
                    borderRadius: 9,
                    background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
                    overflow: 'hidden', flexShrink: 0,
                  }}
                >
                  <Image src={tool} alt={`tool-${i}`} fill style={{ objectFit: 'contain', padding: 5 }} sizes="36px" />
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Links ────────────────────────────────────────────────────────── */}
        <SectionLabel text="Links" accent={tk.accent} />
        <div style={{ display: 'flex', gap: 10 }}>
          {detail.githubrepo && (
            <a
              href={detail.githubrepo}
              target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, textAlign: 'center' as const,
                padding: '12px 16px', borderRadius: 12, fontSize: 13,
                fontFamily: 'var(--font-mono),monospace',
                background: tk.accentBg, border: `1px solid ${tk.accentBorder}`,
                color: tk.accent, textDecoration: 'none', fontWeight: 500,
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              ⑂  GitHub
            </a>
          )}
          {detail.isLive && detail.livelink && (
            <a
              href={detail.livelink}
              target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, textAlign: 'center' as const,
                padding: '12px 16px', borderRadius: 12, fontSize: 13,
                fontFamily: 'var(--font-mono),monospace',
                background: 'rgba(52,199,89,.10)',
                border: '1px solid rgba(52,199,89,.28)',
                color: '#34c759', textDecoration: 'none', fontWeight: 500,
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              ↗  Live Demo
            </a>
          )}
        </div>
      </div>

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,.92)', backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            style={{ position: 'relative', width: '92vw', height: '80vh' }}
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={images[imgIdx]}
              alt={`${detail.title} screenshot ${imgIdx + 1}`}
              fill style={{ objectFit: 'contain', borderRadius: 10 }}
              sizes="92vw"
            />
            {/* Prev / Next in lightbox */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  style={{
                    position: 'absolute', left: -50, top: '50%', transform: 'translateY(-50%)',
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)',
                    color: '#fff', cursor: 'pointer', fontSize: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >‹</button>
                <button
                  onClick={next}
                  style={{
                    position: 'absolute', right: -50, top: '50%', transform: 'translateY(-50%)',
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)',
                    color: '#fff', cursor: 'pointer', fontSize: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >›</button>
              </>
            )}
          </div>
          <button
            onClick={() => setLightbox(false)}
            style={{
              position: 'absolute', top: 20, right: 20,
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)',
              color: '#fff', cursor: 'pointer', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>
      )}
    </div>
  );
}
