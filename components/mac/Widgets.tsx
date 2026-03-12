'use client';
import { useState, useEffect } from 'react';
import { T } from './tokens';
import { ME, experiences, projects } from '@/constants';
import type { WinAction } from './winTypes';

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

  // Hour tick positions (12 marks)
  const hourTicks = Array.from({ length: 12 }, (_, i) => {
    const rad = (i * 30) * (Math.PI / 180);
    return {
      x1: cx + (R - 9) * Math.sin(rad),
      y1: cy - (R - 9) * Math.cos(rad),
      x2: cx + R        * Math.sin(rad),
      y2: cy - R        * Math.cos(rad),
    };
  });

  // Minute tick positions (60 marks, skip every 5th = hour marks)
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

  const faceColor  = dark ? 'rgba(255,255,255,.045)' : 'rgba(0,0,0,.032)';
  const tickColor  = dark ? 'rgba(255,255,255,.22)'   : 'rgba(0,0,0,.20)';
  const minColor   = dark ? 'rgba(255,255,255,.10)'   : 'rgba(0,0,0,.10)';
  const handColor  = dark ? '#f2f2f7'                 : '#1c1c1e';

  const { x2: hx, y2: hy } = hand(hourDeg,   42);
  const { x2: mx, y2: my } = hand(minuteDeg, 56);
  const { x2: sx, y2: sy } = hand(secondDeg, 60);

  return (
    <svg
      width="150" height="150"
      viewBox="0 0 150 150"
      style={{ display: 'block', margin: '0 auto' }}
    >
      {/* Face */}
      <circle cx={cx} cy={cy} r={R + 3} fill={faceColor} />
      <circle cx={cx} cy={cy} r={R + 3} fill="none"
        stroke={dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'} strokeWidth="1" />

      {/* Minute ticks */}
      {minTicks.map((t, i) => t && (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={minColor} strokeWidth="1" strokeLinecap="round" />
      ))}

      {/* Hour ticks */}
      {hourTicks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={tickColor} strokeWidth="2.2" strokeLinecap="round" />
      ))}

      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={hx} y2={hy}
        stroke={handColor} strokeWidth="3.2" strokeLinecap="round" />

      {/* Minute hand */}
      <line x1={cx} y1={cy} x2={mx} y2={my}
        stroke={handColor} strokeWidth="2" strokeLinecap="round" />

      {/* Second hand — amber accent */}
      <line x1={cx} y1={cy} x2={sx} y2={sy}
        stroke="#D4943A" strokeWidth="1.2" strokeLinecap="round" />
      {/* Second hand tail */}
      <line
        x1={cx} y1={cy}
        x2={cx - (sx - cx) * 0.22}
        y2={cy - (sy - cy) * 0.22}
        stroke="#D4943A" strokeWidth="1.2" strokeLinecap="round"
      />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r="3.5" fill="#D4943A" />
      <circle cx={cx} cy={cy} r="1.5" fill={handColor} />
    </svg>
  );
}

// ── Widgets column ────────────────────────────────────────────────────────────
export default function Widgets({ dark, dispatch, openCal }: { dark: boolean; dispatch: React.Dispatch<WinAction>; openCal: () => void }) {
  const tk = T(dark);
  const currentRole = experiences[0];
  const yearsActive = new Date().getFullYear() - 2024;

  const open = (id: string) => dispatch({ type: 'OPEN', id });

  const glass: React.CSSProperties = {
    background: tk.winBg,
    backdropFilter: 'blur(28px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
    border: `1px solid ${tk.border}`,
    borderRadius: 18,
    boxShadow: '0 6px 28px rgba(0,0,0,.14)',
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
        gap: 9,
        zIndex: 50,
        width: 178,
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* ── Analog clock — click opens calendar ──────────────────────────── */}
      <button
        onClick={openCal}
        style={{
          ...glass, padding: '14px 14px 12px',
          cursor: 'pointer', border: `1px solid ${tk.border}`,
          transition: 'opacity .15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '.82')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        title="Open Calendar"
      >
        <AnalogClock dark={dark} />
      </button>

      {/* ── Profile / identity — click opens About Me ────────────────────── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => open('about')}
        onKeyDown={e => e.key === 'Enter' && open('about')}
        style={{ ...glass, cursor: 'pointer', transition: 'opacity .15s' }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '.82')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        {/* Gold accent bar */}
        <div style={{
          height: 3,
          background: 'linear-gradient(90deg,#D4943A 0%,#f5c87a 50%,#D4943A 100%)',
        }} />
        <div style={{ padding: '12px 14px 13px' }}>
          {/* Avatar + name */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg,#D4943A 0%,#7a4c10 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, color: '#fff', fontWeight: 700, letterSpacing: -0.5,
              boxShadow: '0 3px 12px rgba(212,148,58,.38)',
            }}>
              TR
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 12.5, fontWeight: 700, color: tk.text,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                letterSpacing: '-.2px',
              }}>
                {ME.name}
              </div>
              <div style={{ fontSize: 10, color: tk.textSub, marginTop: 2 }}>
                {currentRole.title}
              </div>
            </div>
          </div>

          {/* Company */}
          <div style={{
            fontSize: 11, color: tk.textSub, marginTop: 8,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ fontSize: 13 }}>{currentRole.logo}</span>
            <span>{currentRole.company}</span>
          </div>

          {/* Location */}
          <div style={{
            fontSize: 10.5, color: tk.textMuted, marginTop: 4,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <svg width="7" height="9" viewBox="0 0 9 12" fill={tk.accent} style={{ flexShrink: 0, opacity: .75 }}>
              <path d="M4.5 0C2 0 0 2 0 4.5c0 3.5 4.5 7.5 4.5 7.5S9 8 9 4.5C9 2 7 0 4.5 0zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
            </svg>
            {ME.location}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: tk.divider, margin: '10px 0 9px' }} />

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
                  transition: 'opacity .15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '.65')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
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
              background: '#34c759', boxShadow: '0 0 5px #34c759',
              flexShrink: 0, animation: 'pulse 2s infinite',
            }} />
            <span style={{
              fontSize: 10.5, color: '#34c759',
              fontFamily: 'var(--font-mono), monospace',
            }}>
              Open to opportunities
            </span>
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
            { label: 'Years',    value: `${yearsActive}+`,          winId: 'about'      },
          ].map(stat => (
            <button
              key={stat.label}
              onClick={() => open(stat.winId)}
              style={{
                background: tk.cardBg, borderRadius: 10,
                border: `1px solid ${tk.border}`,
                padding: '8px 4px', textAlign: 'center',
                cursor: 'pointer', transition: 'opacity .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '.70')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <div style={{
                fontSize: 20, fontWeight: 700, color: tk.text,
                lineHeight: 1, fontFamily: 'var(--font-mono), monospace',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: 9.5, color: tk.textMuted, marginTop: 3,
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
