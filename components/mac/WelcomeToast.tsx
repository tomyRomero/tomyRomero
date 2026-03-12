'use client';
import { useState, useEffect } from 'react';
import { T } from './tokens';

const DURATION = 7000; // ms before auto-dismiss

export default function WelcomeToast({ dark }: { dark: boolean }) {
  const tk = T(dark);
  const [visible,  setVisible]  = useState(false);
  const [leaving,  setLeaving]  = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('welcomed')) {
      const t = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(dismiss, DURATION);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function dismiss() {
    setLeaving(true);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem('welcomed', '1');
    }, 380);
  }

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
        {/* Amber accent bar */}
        <div style={{
          height: 3,
          background: 'linear-gradient(90deg,#b8720a 0%,#D4943A 40%,#f5c87a 70%,#D4943A 100%)',
        }} />

        <div style={{ padding: '14px 16px 16px' }}>

          {/* Header row */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 11,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {/* Amber diamond icon */}
              <div style={{
                width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                background: 'linear-gradient(135deg,#D4943A,#7a4c10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, boxShadow: '0 2px 8px rgba(212,148,58,.38)',
              }}>
                ✦
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
            Hey there — I&apos;m <span style={{ color: tk.text, fontWeight: 600 }}>Tomy</span>,
            a full-stack software engineer.
          </p>
          <p style={{
            margin: '8px 0 0', fontSize: 12.5, lineHeight: 1.65,
            color: tk.textMuted, fontFamily: 'var(--font-sans),sans-serif',
          }}>
            Click the{' '}
            <span style={{ color: tk.accent, fontWeight: 600 }}>icons in the dock below</span>
            {' '}to open windows and get to know me. Windows are draggable.
          </p>

          {/* Progress bar */}
          <div style={{
            marginTop: 14, height: 3, borderRadius: 99,
            background: dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg,#b8720a,#D4943A,#f5c87a)',
              borderRadius: 99,
              animation: `drainBar ${DURATION}ms linear both`,
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
