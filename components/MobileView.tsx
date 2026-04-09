'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ME, images, projects, experiences, skills, contactDetails, profilePhoto, aboutChips } from '@/constants';

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: 16, marginTop: 6,
    }}>
      <span style={{
        fontSize: 11, letterSpacing: '1.4px', textTransform: 'uppercase',
        fontFamily: 'var(--font-mono),monospace', color: '#d4943a',
        fontWeight: 600,
      }}>
        {text}
      </span>
      <div style={{
        flex: 1, height: 1,
        background: 'linear-gradient(90deg, rgba(212,148,58,.30), transparent)',
      }} />
    </div>
  );
}

// ── Scroll-triggered fade-in hook ─────────────────────────────────────────────
function useScrollFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity .5s ease, transform .5s ease',
  };

  return { ref, style };
}

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, style } = useScrollFadeIn();
  return (
    <div ref={ref} style={{ ...style, transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

export default function MobileView({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const bg          = dark ? '#060a14'                                    : '#f2efe9';
  const text        = dark ? '#f0f0f5'                                    : '#1a1a1e';
  const textMuted   = dark ? 'rgba(255,255,255,.48)'                      : 'rgba(0,0,0,.48)';
  const textSub     = dark ? 'rgba(255,255,255,.72)'                      : 'rgba(0,0,0,.72)';
  const cardBg      = dark ? 'rgba(255,255,255,.05)'                      : 'rgba(0,0,0,.03)';
  const cardBorder  = dark ? 'rgba(255,255,255,.08)'                      : 'rgba(0,0,0,.07)';
  const accent      = '#d4943a';
  const accentBg    = dark ? 'rgba(212,148,58,.12)'                       : 'rgba(212,148,58,.08)';
  const accentBorder= dark ? 'rgba(212,148,58,.26)'                       : 'rgba(212,148,58,.20)';
  const accentGrad  = 'linear-gradient(135deg, #D4943A 0%, #f5c87a 50%, #D4943A 100%)';
  const accentGrad2 = 'linear-gradient(135deg, #D4943A 0%, #e8a94e 100%)';
  const navBg       = dark ? 'rgba(6,10,20,.94)'                          : 'rgba(242,239,233,.94)';

  // Category colors for skills
  const CATEGORY_COLORS: Record<string, [string, string]> = {
    'Languages':    ['#6366f1', dark ? 'rgba(99,102,241,.12)' : 'rgba(99,102,241,.08)'],
    'Backend':      ['#059669', dark ? 'rgba(5,150,105,.12)' : 'rgba(5,150,105,.08)'],
    'Frontend':     ['#3b82f6', dark ? 'rgba(59,130,246,.12)' : 'rgba(59,130,246,.08)'],
    'Data & Cloud': ['#D4943A', dark ? 'rgba(212,148,58,.12)' : 'rgba(212,148,58,.08)'],
    'Tools':        ['#8b5cf6', dark ? 'rgba(139,92,246,.12)' : 'rgba(139,92,246,.08)'],
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, overflowY: 'auto', background: bg,
      color: text, fontFamily: 'var(--font-sans), sans-serif', userSelect: 'text',
    }}>

      {/* ── Sticky nav ─────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '13px 20px',
        background: navBg,
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${cardBorder}`,
      }}>
        <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px' }}>
          <span style={{
            background: accentGrad,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>T</span>
          <span style={{ color: text }}>R</span>
        </span>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <a href={ME.github}   target="_blank" rel="noopener noreferrer"
            style={{ color: textMuted, textDecoration: 'none', fontSize: 13 }}>GitHub</a>
          <a href={ME.linkedin} target="_blank" rel="noopener noreferrer"
            style={{ color: textMuted, textDecoration: 'none', fontSize: 13 }}>LinkedIn</a>
          <button
            onClick={() => setDark(!dark)}
            style={{
              background: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
              fontSize: 15, color: text,
            }}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* ── Page content ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '0 20px 72px' }}>

        {/* Hero */}
        <div style={{ padding: '40px 0 30px', textAlign: 'center' }}>
          <div style={{
            position: 'relative', width: 106, height: 106,
            margin: '0 auto 20px', borderRadius: '50%', overflow: 'hidden',
            border: '3px solid rgba(212,148,58,.30)',
            boxShadow: '0 0 24px rgba(212,148,58,.20), 0 8px 32px rgba(212,148,58,.16)',
          }}>
            <Image src={profilePhoto} alt="Tomy Romero" fill style={{ objectFit: 'cover' }} sizes="106px" />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif),serif', fontSize: 30, fontWeight: 400,
            letterSpacing: '-0.5px', marginBottom: 8,
            background: dark
              ? 'linear-gradient(135deg, #f0f0f5 0%, #d4943a 100%)'
              : 'linear-gradient(135deg, #1a1a1e 0%, #d4943a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {ME.name}
          </h1>
          <div style={{ color: accent, fontSize: 15.5, fontWeight: 500, marginBottom: 7 }}>{ME.title}</div>
          <div style={{
            color: textMuted, fontSize: 13, marginBottom: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}>
            <svg width="9" height="12" viewBox="0 0 9 12" fill={accent} style={{ flexShrink: 0 }}>
              <path d="M4.5 0C2 0 0 2 0 4.5c0 3.5 4.5 7.5 4.5 7.5S9 8 9 4.5C9 2 7 0 4.5 0zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
            </svg>
            {ME.location}
          </div>
          {/* Open to work */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(52,199,89,.10)', border: '1px solid rgba(52,199,89,.22)',
            padding: '7px 16px', borderRadius: 22,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34c759', boxShadow: '0 0 8px #34c759', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 12.5, color: '#34c759', fontFamily: 'var(--font-mono),monospace' }}>
              Open to opportunities
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{
          display: 'flex', gap: 10, marginBottom: 22,
        }}>
          {[
            { label: 'Experience', value: '1+' },
            { label: 'Projects', value: '4' },
            { label: 'Tech Stack', value: '25+' },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: 1, textAlign: 'center', padding: '12px 8px',
              background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 14,
            }}>
              <div style={{
                fontSize: 20, fontWeight: 700, lineHeight: 1,
                fontFamily: 'var(--font-mono),monospace',
                background: accentGrad,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: 10, color: textMuted, marginTop: 5,
                fontFamily: 'var(--font-mono),monospace',
                textTransform: 'uppercase', letterSpacing: '.5px',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div style={{
          background: cardBg, border: `1px solid ${cardBorder}`,
          borderRadius: 16, padding: '18px 20px', marginBottom: 22,
          fontSize: 14, lineHeight: 1.78, color: textSub,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2.5,
            background: accentGrad, borderRadius: '16px 16px 0 0',
          }} />
          {ME.bio}
        </div>

        {/* Tech chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
          {aboutChips.map(chip => (
            <span key={chip} style={{
              padding: '5px 13px', borderRadius: 20, fontSize: 12,
              background: accentBg, border: `1px solid ${accentBorder}`,
              color: accent, fontFamily: 'var(--font-mono),monospace',
              letterSpacing: '.2px',
            }}>
              {chip}
            </span>
          ))}
        </div>

        {/* External links */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 36 }}>
          {([['⑂  GitHub', ME.github], ['🔗  LinkedIn', ME.linkedin]] as [string, string][]).map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
              flex: 1, textAlign: 'center',
              padding: '11px 16px', borderRadius: 12, fontSize: 13,
              fontFamily: 'var(--font-mono),monospace',
              background: accentBg, border: `1px solid ${accentBorder}`,
              color: accent, textDecoration: 'none', fontWeight: 500,
            }}>
              {label}
            </a>
          ))}
        </div>

        {/* ── Projects ───────────────────────────────────────────────────── */}
        <FadeInSection>
        <SectionLabel text="Projects" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
          {projects.map((p, idx) => (
            <a key={p.title} href={`/project/${encodeURIComponent(p.title)}`} style={{
              display: 'block', textDecoration: 'none',
              background: cardBg, border: `1px solid ${idx === 0 ? accentBorder : cardBorder}`,
              borderRadius: 16, padding: '18px 20px',
              position: 'relative', overflow: 'hidden',
            }}>
              {idx === 0 && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: accentGrad,
                }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{p.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: text }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: accent, marginTop: 2 }}>{p.tagline}</div>
                </div>
                <span style={{ fontSize: 20, color: textMuted }}>›</span>
              </div>
              <div style={{ fontSize: 13, color: textSub, lineHeight: 1.64 }}>{p.description}</div>
              <div style={{
                marginTop: 10, fontSize: 11, color: accent, opacity: 0.80,
                fontFamily: 'var(--font-mono),monospace',
              }}>
                {p.techStack}
              </div>
            </a>
          ))}
        </div>
        </FadeInSection>

        {/* ── Experience ─────────────────────────────────────────────────── */}
        <FadeInSection>
        <SectionLabel text="Experience" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
          {experiences.map((exp, i) => (
            <div key={exp.company} style={{
              background: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: 16, padding: '18px 20px',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Left accent bar for current role */}
              {i === 0 && (
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                  background: accentGrad,
                  borderRadius: '16px 0 0 16px',
                }} />
              )}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10, marginLeft: i === 0 ? 4 : 0 }}>
                <span style={{ fontSize: 24, flexShrink: 0, lineHeight: 1 }}>{exp.logo}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: text }}>{exp.title}</div>
                  <div style={{ fontSize: 13, color: accent, marginTop: 2 }}>{exp.company}</div>
                  <div style={{ fontSize: 11.5, color: textMuted, marginTop: 2 }}>
                    {exp.date} · {exp.location}
                  </div>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, color: textSub, fontSize: 12.5, lineHeight: 1.72, marginLeft: i === 0 ? 4 : 0 }}>
                {exp.description.map((d, j) => <li key={j}>{d}</li>)}
              </ul>
              <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6, marginLeft: i === 0 ? 4 : 0 }}>
                {exp.tech.map(t => (
                  <span key={t} style={{
                    padding: '3px 9px', borderRadius: 8, fontSize: 11,
                    background: accentBg, border: `1px solid ${accentBorder}`,
                    color: accent, fontFamily: 'var(--font-mono),monospace',
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        </FadeInSection>

        {/* ── Skills ─────────────────────────────────────────────────────── */}
        <FadeInSection>
        <SectionLabel text="Skills" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
          {Object.entries(skills).map(([cat, items]) => {
            const [color, colorBg] = CATEGORY_COLORS[cat] || [accent, accentBg];
            return (
              <div key={cat} style={{
                background: cardBg, border: `1px solid ${cardBorder}`,
                borderRadius: 14, padding: '14px 18px',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 10,
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: colorBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color,
                    fontFamily: 'var(--font-mono),monospace',
                    border: `1px solid ${color}22`,
                  }}>
                    {items.length}
                  </div>
                  <span style={{
                    fontSize: 11, color, fontFamily: 'var(--font-mono),monospace',
                    textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600,
                  }}>
                    {cat}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {items.map(skill => (
                    <span key={skill} style={{
                      padding: '4px 11px', borderRadius: 8, fontSize: 12,
                      background: dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)',
                      border: `1px solid ${cardBorder}`, color: text,
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        </FadeInSection>

        {/* ── Photos ─────────────────────────────────────────────────────── */}
        <FadeInSection>
        <SectionLabel text="Photos" />
        <div style={{ overflowX: 'auto', marginBottom: 36, paddingBottom: 10, scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,.18) transparent' }}>
          <div style={{ display: 'flex', gap: 20, width: 'max-content', paddingBottom: 4, paddingTop: 12, paddingLeft: 4, paddingRight: 4 }}>
            {images.map((img, i) => {
              const tilt = ([-5, 3, -4, 6, -2, 4, -6, 2, -3, 5][i % 10]);
              return (
                <button
                  key={i}
                  onClick={() => setLightboxIdx(i)}
                  style={{
                    flexShrink: 0, width: 110,
                    padding: '6px 6px 22px',
                    background: dark ? '#e8e4da' : '#faf8f3',
                    border: 'none', borderRadius: 2, cursor: 'pointer',
                    transform: `rotate(${tilt}deg)`,
                    boxShadow: `0 4px ${10 + Math.abs(tilt)}px rgba(0,0,0,.24)`,
                    transition: 'transform .22s ease',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '1', overflow: 'hidden', background: '#d0ccc4' }}>
                    <Image src={img.img} alt={img.alt} fill style={{ objectFit: 'cover' }} sizes="98px" />
                  </div>
                  {img.title && (
                    <div style={{
                      marginTop: 4, fontSize: 9, color: dark ? '#555' : '#444',
                      textAlign: 'center', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {img.title}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        </FadeInSection>

        {/* ── Contact ────────────────────────────────────────────────────── */}
        <FadeInSection>
        <SectionLabel text="Contact" />

        {/* Contact intro */}
        <div style={{
          background: cardBg, border: `1px solid ${cardBorder}`,
          borderRadius: 16, padding: '16px 18px', marginBottom: 12,
          fontSize: 13.5, color: textSub, lineHeight: 1.68,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: accentGrad,
          }} />
          I&apos;m always open to discussing new opportunities, interesting projects, or just connecting with fellow developers.
        </div>

        <div style={{
          background: cardBg, border: `1px solid ${cardBorder}`,
          borderRadius: 16, overflow: 'hidden', marginBottom: 20,
        }}>
          {contactDetails.filter(c => c.href).map((c, i, arr) => (
            <a key={c.type} href={c.href} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px', textDecoration: 'none',
              borderBottom: i < arr.length - 1 ? `1px solid ${cardBorder}` : 'none',
            }}>
              <span style={{
                fontSize: 12.5, color: textMuted, fontFamily: 'var(--font-mono),monospace',
              }}>
                {c.type}
              </span>
              <span style={{ fontSize: 13, color: accent, textAlign: 'right', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.value}
              </span>
            </a>
          ))}
        </div>

        {/* Gradient CTA */}
        <a
          href={`mailto:${ME.email}?subject=Portfolio+Hello`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px 24px', borderRadius: 14, fontSize: 14.5, fontWeight: 600,
            background: accentGrad2,
            color: '#fff', textDecoration: 'none',
            boxShadow: '0 0 20px rgba(212,148,58,.18), 0 4px 12px rgba(212,148,58,.12)',
            marginBottom: 32,
          }}
        >
          ✉️  Send me an email
        </a>

        </FadeInSection>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: 11.5, color: textMuted, paddingBottom: 8 }}>
          Built with Next.js · {new Date().getFullYear()} Tomy Romero Seas
        </div>
      </div>

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      {lightboxIdx !== null && (
        <div
          onClick={() => setLightboxIdx(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,.92)', backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn .18s ease',
          }}
        >
          <div
            style={{ position: 'relative', width: '90vw', height: '80vh' }}
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIdx].img} alt={images[lightboxIdx].alt}
              fill style={{ objectFit: 'contain', borderRadius: 10 }} sizes="90vw"
            />
            {images[lightboxIdx].title && (
              <div style={{
                position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,.55)', color: 'rgba(255,255,255,.85)',
                fontSize: 12, padding: '4px 14px', borderRadius: 18,
                fontFamily: 'var(--font-sans),sans-serif', whiteSpace: 'nowrap',
              }}>
                {images[lightboxIdx].title}
              </div>
            )}
          </div>
          <button
            onClick={() => setLightboxIdx(null)}
            style={{
              position: 'absolute', top: 20, right: 20,
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)',
              color: '#fff', cursor: 'pointer', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
