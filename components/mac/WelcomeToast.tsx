'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { T } from './tokens';
import { profilePhoto } from '@/constants';

const DURATION = 7000; // ms before auto-dismiss

export default function WelcomeToast({ dark }: { dark: boolean }) {
  const tk = T(dark);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [paused,  setPaused]  = useState(false);
  const [runId,   setRunId]   = useState(0);

  // Auto-dismiss with hover-pause: track how much time is left so pausing
  // the cursor over the card pauses both the timer and the drain bar.
  const timer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remaining = useRef(DURATION);
  const startedAt = useRef(0);

  const armTimer = () => {
    startedAt.current = Date.now();
    timer.current = setTimeout(dismiss, remaining.current);
  };

  useEffect(() => {
    if (!localStorage.getItem('welcomed')) {
      const t = setTimeout(() => { setVisible(true); setRunId(r => r + 1); }, 900);
      return () => clearTimeout(t);
    }
  }, []);

  // Replay on demand (Help menu → Show Welcome Tip), even after first visit
  useEffect(() => {
    const replay = () => {
      if (timer.current) clearTimeout(timer.current);
      remaining.current = DURATION;
      setLeaving(false);
      setPaused(false);
      setVisible(true);
      setRunId(r => r + 1);
    };
    window.addEventListener('welcomeReplay', replay);
    return () => window.removeEventListener('welcomeReplay', replay);
  }, []);

  useEffect(() => {
    if (!visible) return;
    remaining.current = DURATION;
    armTimer();
    return () => { if (timer.current) clearTimeout(timer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, runId]);

  function dismiss() {
    setLeaving(true);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem('welcomed', '1');
    }, 380);
  }

  const pause = () => {
    if (timer.current) clearTimeout(timer.current);
    remaining.current = Math.max(600, remaining.current - (Date.now() - startedAt.current));
    setPaused(true);
  };
  const resume = () => {
    armTimer();
    setPaused(false);
  };

  if (!visible) return null;

  return (
    /* Flex row so the card is centered without messing with translateX in keyframes */
    <div
      style={{
        position: 'fixed',
        bottom: 96,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 9998,
        pointerEvents: 'none',
      }}
    >
      <div
        onMouseEnter={pause}
        onMouseLeave={resume}
        style={{
          width: 310,
          pointerEvents: 'auto',
          animation: `${leaving ? 'welcomeOut' : 'welcomeIn'} ${leaving ? '.38s' : '.52s'} cubic-bezier(.16,1,.3,1) both`,
          borderRadius: 18,
          overflow: 'hidden',
          background: tk.winBg,
          backdropFilter: 'blur(32px) saturate(1.9)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.9)',
          border: `1px solid ${tk.border}`,
          boxShadow: dark
            ? '0 16px 48px rgba(0,0,0,.52), 0 4px 16px rgba(0,0,0,.28)'
            : '0 16px 48px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.10)',
        }}
      >
        <div style={{ padding: '14px 16px 16px' }}>

          {/* Header row */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 11,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Real photo, not a logo — this is a person saying hi */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                overflow: 'hidden', position: 'relative',
                border: `1px solid ${tk.border}`,
              }}>
                <Image src={profilePhoto} alt="Tomy Romero" fill style={{ objectFit: 'cover' }} sizes="28px" />
              </div>
              <span style={{
                fontSize: 13.5, fontWeight: 700, color: tk.text,
                fontFamily: 'var(--font-sans),sans-serif', letterSpacing: '-.2px',
              }}>
                Welcome
              </span>
            </div>

            {/* Close button */}
            <button
              onClick={dismiss}
              style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: dark ? 'rgba(255,255,255,.10)' : 'rgba(0,0,0,.07)',
                border: `1px solid ${tk.border}`,
                color: tk.textMuted, fontSize: 11, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = dark ? 'rgba(255,255,255,.20)' : 'rgba(0,0,0,.13)')}
              onMouseLeave={e => (e.currentTarget.style.background = dark ? 'rgba(255,255,255,.10)' : 'rgba(0,0,0,.07)')}
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: tk.divider, marginBottom: 11 }} />

          {/* Body */}
          <p style={{
            margin: 0, fontSize: 13, lineHeight: 1.68,
            color: tk.textSub, fontFamily: 'var(--font-sans),sans-serif',
          }}>
            Hey there, I&apos;m <span style={{ color: tk.text, fontWeight: 600 }}>Tomy</span>,
            a full-stack software engineer.
          </p>
          <p style={{
            margin: '8px 0 0', fontSize: 12.5, lineHeight: 1.65,
            color: tk.textMuted, fontFamily: 'var(--font-sans),sans-serif',
          }}>
            Each window is a section of my portfolio. Drag them around, use the{' '}
            <span style={{ color: tk.accent, fontWeight: 600 }}>dock below</span>
            {' '}to reopen anything, and try{' '}
            <span style={{
              color: tk.textSub, fontWeight: 600,
              fontFamily: 'var(--font-mono),monospace', fontSize: 11.5,
              background: dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)',
              padding: '1px 5px', borderRadius: 4,
            }}>⌘K</span>
            {' '}to search.
          </p>

          {/* Progress bar — pauses while hovered */}
          <div style={{
            marginTop: 14, height: 3, borderRadius: 99,
            background: dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)',
            overflow: 'hidden',
          }}>
            <div key={runId} style={{
              height: '100%',
              background: tk.accentGrad2,
              borderRadius: 99,
              animation: `drainBar ${DURATION}ms linear both`,
              animationPlayState: paused ? 'paused' : 'running',
            }} />
          </div>
        </div>

        {/* Downward caret pointing at dock */}
        <div style={{
          textAlign: 'center', fontSize: 14, lineHeight: 1,
          color: tk.accent, opacity: .7,
          paddingBottom: 8, marginTop: -4,
          fontFamily: 'system-ui',
        }}>
          ▾
        </div>
      </div>
    </div>
  );
}
