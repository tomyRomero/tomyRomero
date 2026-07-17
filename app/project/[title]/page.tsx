'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { projectDetails, projects } from '@/constants';

function useTokens(dark: boolean) {
  return {
    bg:           dark ? '#060a14'                         : '#f2efe9',
    text:         dark ? '#f0f0f5'                         : '#1a1a1e',
    textMuted:    dark ? 'rgba(255,255,255,.55)'           : 'rgba(0,0,0,.58)',
    textSub:      dark ? 'rgba(255,255,255,.72)'           : 'rgba(0,0,0,.72)',
    cardBg:       dark ? 'rgba(255,255,255,.045)'          : 'rgba(0,0,0,.025)',
    cardBorder:   dark ? 'rgba(255,255,255,.08)'           : 'rgba(0,0,0,.07)',
    accent:       '#d4943a',
    accentBg:     dark ? 'rgba(212,148,58,.12)'            : 'rgba(212,148,58,.08)',
    accentBorder: dark ? 'rgba(212,148,58,.26)'            : 'rgba(212,148,58,.20)',
    accentGrad:   'linear-gradient(135deg, #D4943A 0%, #f5c87a 50%, #D4943A 100%)',
    accentGrad2:  'linear-gradient(135deg, #D4943A 0%, #e8a94e 100%)',
    accentGlow:   dark
      ? '0 0 20px rgba(212,148,58,.18), 0 4px 12px rgba(212,148,58,.12)'
      : '0 0 16px rgba(212,148,58,.12), 0 4px 10px rgba(212,148,58,.08)',
    navBg:        dark ? 'rgba(6,10,20,.94)'               : 'rgba(242,239,233,.94)',
    pillBg:       dark ? 'rgba(255,255,255,.07)'           : 'rgba(0,0,0,.04)',
    pillBorder:   dark ? 'rgba(255,255,255,.10)'           : 'rgba(0,0,0,.08)',
  };
}

function SectionLabel({ text, tk }: { text: string; tk: ReturnType<typeof useTokens> }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: 14, marginTop: 6,
    }}>
      <h2 style={{
        fontSize: 11, letterSpacing: '1.4px', textTransform: 'uppercase' as const,
        fontFamily: 'var(--font-mono),monospace', color: tk.accent,
        fontWeight: 600,
      }}>
        {text}
      </h2>
      <div style={{
        flex: 1, height: 1,
        background: `linear-gradient(90deg, ${tk.accentBorder}, transparent)`,
      }} />
    </div>
  );
}

export default function ProjectPage({ params }: { params: { title: string } }) {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dark');
    if (saved !== null) setDark(saved === 'true');
    else setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);
  useEffect(() => { localStorage.setItem('dark', String(dark)); }, [dark]);

  const decodedTitle = decodeURIComponent(params.title);
  const detail = projectDetails.find(p => p.title === decodedTitle);
  const summary = projects.find(p => p.title === decodedTitle);

  // Dark-mode toggle with the same smooth crossfade the desktop/mobile views use
  const toggleDark = () => {
    document.documentElement.classList.add('theme-transition');
    setDark(d => !d);
    setTimeout(() => document.documentElement.classList.remove('theme-transition'), 350);
  };

  // Keyboard support for the gallery lightbox (Escape closes, arrows navigate)
  const lightboxCount = detail ? detail.images.filter(Boolean).length : 0;
  useEffect(() => {
    if (!lightbox || lightboxCount === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')           setLightbox(false);
      else if (e.key === 'ArrowLeft')   setImgIdx(i => (i - 1 + lightboxCount) % lightboxCount);
      else if (e.key === 'ArrowRight')  setImgIdx(i => (i + 1) % lightboxCount);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, lightboxCount]);

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
            padding: '10px 22px', borderRadius: 12, fontSize: 13,
            background: tk.accentGrad2, border: 'none',
            color: '#fff', cursor: 'pointer',
            fontFamily: 'var(--font-mono),monospace',
            boxShadow: tk.accentGlow,
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
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
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
            transition: 'all .15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = tk.accentBorder;
            e.currentTarget.style.color = tk.accent;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = tk.cardBorder;
            e.currentTarget.style.color = tk.textSub;
          }}
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
          onClick={toggleDark}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
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

        {/* Hero card */}
        <div style={{
          padding: '28px 0 24px',
        }}>
          <div style={{
            position: 'relative',
            background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
            borderRadius: 18, padding: '22px 22px 18px',
            overflow: 'hidden',
          }}>
            {/* Top gradient bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: tk.accentGrad,
              borderRadius: '18px 18px 0 0',
            }} />

            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14,
            }}>
              {summary && (
                <div style={{
                  width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                  background: tk.accentBg, border: `1px solid ${tk.accentBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28,
                  boxShadow: tk.accentGlow,
                }}>
                  {summary.emoji}
                </div>
              )}
              <div>
                <h1 key={dark ? 'd' : 'l'} className="grad-text" style={{
                  fontFamily: 'var(--font-serif),serif', fontSize: 26, fontWeight: 400,
                  letterSpacing: '-.3px', marginBottom: 4,
                  background: dark
                    ? 'linear-gradient(135deg, #f0f0f5 0%, #d4943a 100%)'
                    : 'linear-gradient(135deg, #1a1a1e 0%, #d4943a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
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
                border: `1px solid ${detail.isLive ? 'rgba(52,199,89,.26)' : tk.pillBorder}`,
                color: detail.isLive ? (dark ? '#34c759' : '#15803d') : tk.textMuted,
              }}>
                {detail.isLive ? '● Live' : '⑂ GitHub only'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Image gallery ────────────────────────────────────────────────── */}
        {images.length > 0 && (
          <>
            <SectionLabel text="Gallery" tk={tk} />
            <div style={{ marginBottom: 28 }}>
              {/* Main image */}
              <div
                onClick={() => setLightbox(true)}
                style={{
                  position: 'relative', width: '100%', aspectRatio: '16/10',
                  borderRadius: 16, overflow: 'hidden',
                  background: tk.cardBg,
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
                    aria-label="Previous image"
                    style={{
                      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                      background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
                      color: tk.textSub, fontSize: 16, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all .15s',
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
                        aria-label={`View image ${i + 1}`}
                        style={{
                          flexShrink: 0, width: 52, height: 36,
                          borderRadius: 8, overflow: 'hidden', padding: 0,
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
                    aria-label="Next image"
                    style={{
                      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                      background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
                      color: tk.textSub, fontSize: 16, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all .15s',
                    }}
                  >›</button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Description ──────────────────────────────────────────────────── */}
        <SectionLabel text="About" tk={tk} />
        <div style={{
          background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
          borderRadius: 16, padding: '18px 20px', marginBottom: 22,
          fontSize: 14, lineHeight: 1.78, color: tk.textSub,
        }}>
          {detail.description}
        </div>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        {detail.features && detail.features.length > 0 && (
          <>
            <SectionLabel text="Features" tk={tk} />
            <div style={{
              background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
              borderRadius: 16, padding: '16px 20px', marginBottom: 22,
            }}>
              {detail.features.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', gap: 10, fontSize: 13.5,
                    color: tk.textSub, lineHeight: 1.68,
                    marginBottom: i < detail.features.length - 1 ? 10 : 0,
                    paddingBottom: i < detail.features.length - 1 ? 10 : 0,
                    borderBottom: i < detail.features.length - 1
                      ? `1px solid ${tk.cardBorder}` : 'none',
                  }}
                >
                  <span style={{ color: tk.accent, flexShrink: 0, marginTop: 1, fontSize: 12, fontWeight: 600 }}>&rsaquo;</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Tech stack ───────────────────────────────────────────────────── */}
        {detail.tools && detail.tools.length > 0 && (
          <>
            <SectionLabel text="Tech Stack" tk={tk} />
            <div style={{
              display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 28,
            }}>
              {detail.tools.map((tool, i) => (
                <div
                  key={i}
                  style={{
                    position: 'relative', width: 38, height: 38,
                    borderRadius: 10,
                    background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
                    overflow: 'hidden', flexShrink: 0,
                    transition: 'all .18s',
                  }}
                >
                  <Image src={tool} alt={`tool-${i}`} fill style={{ objectFit: 'contain', padding: 5 }} sizes="38px" />
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Links ────────────────────────────────────────────────────────── */}
        <SectionLabel text="Links" tk={tk} />
        <div style={{ display: 'flex', gap: 10 }}>
          {detail.githubrepo && (
            <a
              href={detail.githubrepo}
              target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, textAlign: 'center' as const,
                padding: '13px 16px', borderRadius: 14, fontSize: 13.5, fontWeight: 600,
                background: tk.accentGrad2,
                border: 'none',
                color: '#fff', textDecoration: 'none',
                boxShadow: tk.accentGlow,
                transition: 'all .18s',
                fontFamily: 'var(--font-mono),monospace',
              }}
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
                padding: '13px 16px', borderRadius: 14, fontSize: 13.5, fontWeight: 500,
                background: 'rgba(52,199,89,.10)',
                border: '1px solid rgba(52,199,89,.24)',
                color: dark ? '#34c759' : '#15803d', textDecoration: 'none',
                transition: 'all .18s',
                fontFamily: 'var(--font-mono),monospace',
              }}
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
          role="dialog"
          aria-modal="true"
          aria-label={`${detail.title} gallery`}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,.92)', backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeSlideIn .18s ease',
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
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous image"
                  style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)',
                    color: '#fff', cursor: 'pointer', fontSize: 22,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.28)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.14)')}
                >‹</button>
                <button
                  onClick={next}
                  aria-label="Next image"
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)',
                    color: '#fff', cursor: 'pointer', fontSize: 22,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.28)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.14)')}
                >›</button>
              </>
            )}
          </div>
          {/* Counter */}
          <div style={{
            position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,.80)', fontSize: 12, padding: '4px 14px',
            borderRadius: 20, fontFamily: 'var(--font-mono),monospace',
            border: '1px solid rgba(255,255,255,.12)',
          }}>
            {imgIdx + 1} / {images.length}
          </div>
          <button
            onClick={() => setLightbox(false)}
            aria-label="Close"
            style={{
              position: 'absolute', top: 20, right: 20,
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)',
              color: '#fff', cursor: 'pointer', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.28)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.14)')}
          >✕</button>
        </div>
      )}
    </div>
  );
}
