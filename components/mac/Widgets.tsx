'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { T } from './tokens';
import { ME, experiences, projects, yearsExperience } from '@/constants';
import { requestProjectDetail } from './windows/ProjectsWindow';

// ── Analog clock SVG ──────────────────────────────────────────────────────────
function AnalogClock({ dark }: { dark: boolean }) {
  const tk   = T(dark);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h  = now.getHours() % 12;
  const m  = now.getMinutes();
  const s  = now.getSeconds();

  const hourDeg   = h * 30 + m * 0.5;
  const minuteDeg = m * 6  + s * 0.1;
  const secondDeg = s * 6;

  const cx = 75;
  const cy = 75;
  const R  = 66;

  const hourTicks = Array.from({ length: 12 }, (_, i) => {
    const rad = (i * 30) * (Math.PI / 180);
    return {
      x1: cx + (R - 9) * Math.sin(rad),
      y1: cy - (R - 9) * Math.cos(rad),
      x2: cx + R        * Math.sin(rad),
      y2: cy - R        * Math.cos(rad),
    };
  });

  const minTicks = Array.from({ length: 60 }, (_, i) => {
    if (i % 5 === 0) return null;
    const rad = (i * 6) * (Math.PI / 180);
    return {
      x1: cx + (R - 4.5) * Math.sin(rad),
      y1: cy - (R - 4.5) * Math.cos(rad),
      x2: cx + R          * Math.sin(rad),
      y2: cy - R          * Math.cos(rad),
    };
  });

  const hand = (angleDeg: number, length: number) => ({
    x2: cx + length * Math.sin(angleDeg * Math.PI / 180),
    y2: cy - length * Math.cos(angleDeg * Math.PI / 180),
  });

  const faceColor  = dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.028)';
  const tickColor  = dark ? 'rgba(255,255,255,.24)'   : 'rgba(0,0,0,.22)';
  const minColor   = dark ? 'rgba(255,255,255,.10)'   : 'rgba(0,0,0,.10)';
  const handColor  = dark ? '#f0f0f5'                 : '#1a1a1e';

  const { x2: hx, y2: hy } = hand(hourDeg,   42);
  const { x2: mx, y2: my } = hand(minuteDeg, 56);
  const { x2: sx, y2: sy } = hand(secondDeg, 60);

  return (
    <svg
      width="150" height="150"
      viewBox="0 0 150 150"
      style={{ display: 'block', margin: '0 auto' }}
    >
      <circle cx={cx} cy={cy} r={R + 3} fill={faceColor} />
      <circle cx={cx} cy={cy} r={R + 3} fill="none"
        stroke={dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)'} strokeWidth="1" />

      {minTicks.map((t, i) => t && (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={minColor} strokeWidth="1" strokeLinecap="round" />
      ))}

      {hourTicks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={tickColor} strokeWidth="2.2" strokeLinecap="round" />
      ))}

      <line x1={cx} y1={cy} x2={hx} y2={hy}
        stroke={handColor} strokeWidth="3.2" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={mx} y2={my}
        stroke={handColor} strokeWidth="2" strokeLinecap="round" />

      {/* Second hand — accent */}
      <line x1={cx} y1={cy} x2={sx} y2={sy}
        stroke={tk.accent} strokeWidth="1.2" strokeLinecap="round" />
      <line
        x1={cx} y1={cy}
        x2={cx - (sx - cx) * 0.22}
        y2={cy - (sy - cy) * 0.22}
        stroke={tk.accent} strokeWidth="1.2" strokeLinecap="round"
      />

      <circle cx={cx} cy={cy} r="3.5" fill={tk.accent} />
      <circle cx={cx} cy={cy} r="1.5" fill={handColor} />
    </svg>
  );
}

// ── Widgets column ────────────────────────────────────────────────────────────
export default function Widgets({ dark, openCal, onOpen }: {
  dark: boolean; openCal: () => void; onOpen: (id: string) => void;
}) {
  const tk = T(dark);
  const currentRole = experiences[0];
  const featured    = projects[0];

  const open = (id: string) => onOpen(id);

  // Open the Projects window and deep-link into the featured project's
  // detail view. requestProjectDetail stores the target synchronously, so
  // the window picks it up on mount with no timing involved.
  const openFeatured = () => {
    onOpen('projects');
    requestProjectDetail(featured.title);
  };

  const glass: React.CSSProperties = {
    background: tk.winBg,
    backdropFilter: 'blur(32px) saturate(2.0)',
    WebkitBackdropFilter: 'blur(32px) saturate(2.0)',
    border: `1px solid ${tk.border}`,
    borderRadius: 20,
    boxShadow: dark
      ? '0 6px 32px rgba(0,0,0,.22), 0 0 0 0.5px rgba(255,255,255,.04)'
      : '0 6px 28px rgba(0,0,0,.10)',
    fontFamily: 'var(--font-sans), sans-serif',
    overflow: 'hidden',
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: 16,
        top: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 50,
        width: 192,
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* ── Analog clock ──────────────────────────── */}
      <button
        onClick={openCal}
        style={{
          ...glass, padding: '14px 14px 12px',
          cursor: 'pointer', border: `1px solid ${tk.border}`,
          transition: 'all .18s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = tk.accentBorder;
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = tk.border;
          e.currentTarget.style.transform = 'none';
        }}
        title="Open Calendar"
      >
        <AnalogClock dark={dark} />
      </button>

      {/* ── Profile / identity ────────────────────── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => open('about')}
        onKeyDown={e => e.key === 'Enter' && open('about')}
        style={{ ...glass, cursor: 'pointer', transition: 'all .18s' }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = tk.accentBorder;
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = tk.border;
          e.currentTarget.style.transform = 'none';
        }}
      >
        <div style={{ padding: '12px 14px 13px' }}>
          {/* Avatar + name */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: tk.accentGrad2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, color: '#fff', fontWeight: 700, letterSpacing: -0.5,
            }}>
              TR
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: tk.text,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                letterSpacing: '-.2px',
              }}>
                {ME.name}
              </div>
              <div style={{ fontSize: 11, color: tk.textSub, marginTop: 2 }}>
                {currentRole.title}
              </div>
            </div>
          </div>

          {/* Company */}
          <div style={{
            fontSize: 11.5, color: tk.textSub, marginTop: 8,
          }}>
            {currentRole.company}
          </div>

          {/* Location */}
          <div style={{
            fontSize: 11, color: tk.textMuted, marginTop: 4,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <svg width="7" height="9" viewBox="0 0 9 12" fill={tk.accent} style={{ flexShrink: 0, opacity: .75 }}>
              <path d="M4.5 0C2 0 0 2 0 4.5c0 3.5 4.5 7.5 4.5 7.5S9 8 9 4.5C9 2 7 0 4.5 0zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
            </svg>
            {ME.location}
          </div>

          {/* Divider */}
          <div style={{
            height: 1, margin: '10px 0 9px',
            background: `linear-gradient(90deg, ${tk.divider}, transparent)`,
          }} />

          {/* Social buttons */}
          <div style={{ display: 'flex', gap: 6 }}>
            {([['GitHub', ME.github], ['LinkedIn', ME.linkedin]] as [string, string][]).map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, textAlign: 'center',
                  padding: '5px 8px', borderRadius: 8, fontSize: 11,
                  background: tk.pillBg, border: `1px solid ${tk.pillBorder}`,
                  color: tk.textSub, textDecoration: 'none', fontWeight: 500,
                  transition: 'all .15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = tk.accentBorder;
                  e.currentTarget.style.color = tk.accent;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = tk.pillBorder;
                  e.currentTarget.style.color = tk.textSub;
                }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Open to work */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5, marginTop: 9,
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: '#34c759', boxShadow: '0 0 6px #34c759',
              flexShrink: 0, animation: 'pulse 2s infinite',
            }} />
            <span style={{
              fontSize: 11, color: dark ? '#34c759' : '#15803d',
              fontFamily: 'var(--font-mono), monospace',
            }}>
              Open to opportunities
            </span>
          </div>
        </div>
      </div>

      {/* ── Featured project ─────────────────────────────────────────────── */}
      <div
        role="button"
        tabIndex={0}
        onClick={openFeatured}
        onKeyDown={e => e.key === 'Enter' && openFeatured()}
        style={{ ...glass, cursor: 'pointer', transition: 'all .18s' }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = tk.accentBorder;
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = tk.border;
          e.currentTarget.style.transform = 'none';
        }}
      >
        {/* Blurred cover of the same shot behind a contained foreground, so
            portrait app screenshots preview without letterbox bars */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden', background: tk.cardBg }}>
          <Image
            src={featured.image} alt="" aria-hidden fill sizes="192px"
            style={{ objectFit: 'cover', filter: 'blur(16px) saturate(1.3)', transform: 'scale(1.25)', opacity: .8 }}
          />
          <Image
            src={featured.image} alt={featured.title} fill sizes="192px"
            style={{ objectFit: 'contain', padding: 5 }}
          />
        </div>
        <div style={{ padding: '10px 13px 12px' }}>
          <div style={{
            fontSize: 9.5, color: tk.textMuted, fontWeight: 600,
            letterSpacing: '.6px', textTransform: 'uppercase', marginBottom: 4,
          }}>
            Featured Project
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: tk.text }}>{featured.title}</span>
            <span style={{ fontSize: 10, color: tk.textMuted, fontFamily: 'var(--font-mono), monospace' }}>
              {featured.year}
            </span>
          </div>
          <div style={{
            fontSize: 10.5, color: tk.textSub, marginTop: 3, lineHeight: 1.5,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
          }}>
            {featured.tagline}
          </div>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div style={{ ...glass, padding: '12px 14px' }}>
        <div style={{
          fontSize: 10, color: tk.textMuted, marginBottom: 9,
          fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase',
        }}>
          Stats
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[
            { label: 'Projects', value: String(projects.length),    winId: 'projects'   },
            { label: 'Roles',    value: String(experiences.length), winId: 'experience' },
            { label: 'Years',    value: yearsExperience(),          winId: 'about'      },
          ].map(stat => (
            <button
              key={stat.label}
              onClick={() => open(stat.winId)}
              style={{
                background: tk.cardBg, borderRadius: 12,
                border: `1px solid ${tk.border}`,
                padding: '8px 4px', textAlign: 'center',
                cursor: 'pointer', transition: 'all .18s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = tk.accentBorder;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = tk.border;
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{
                fontSize: 20, fontWeight: 700, lineHeight: 1,
                fontFamily: 'var(--font-mono), monospace',
                color: tk.accent,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: 10.5, color: tk.textMuted, marginTop: 3,
                letterSpacing: '.2px',
              }}>
                {stat.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
