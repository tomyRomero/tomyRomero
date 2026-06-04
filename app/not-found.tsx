'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dark');
    if (saved !== null) setDark(saved === 'true');
  }, []);

  const bg      = dark ? '#020614' : '#f2efe9';
  const text    = dark ? '#f0f0f5' : '#1a1a1e';
  const textSub = dark ? 'rgba(240,240,245,.60)' : 'rgba(26,26,30,.60)';
  const accent  = '#D4943A';
  const cardBg  = dark ? 'rgba(255,255,255,.045)' : 'rgba(0,0,0,.025)';
  const border  = dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)';
  const accentGrad = 'linear-gradient(135deg, #D4943A 0%, #f5c87a 50%, #D4943A 100%)';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans), system-ui, sans-serif',
      textAlign: 'center',
      padding: 24,
    }}>
      {/* Decorative blurred blob */}
      <div style={{
        position: 'absolute',
        width: '40vw', height: '40vw', borderRadius: '50%',
        background: dark
          ? 'radial-gradient(circle, rgba(212,148,58,.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(212,148,58,.08) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* macOS-style window frame */}
      <div style={{
        position: 'relative',
        background: cardBg,
        border: `1px solid ${border}`,
        borderRadius: 20,
        padding: '40px 48px',
        maxWidth: 420,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: dark
          ? '0 24px 64px rgba(0,0,0,.50)'
          : '0 24px 64px rgba(0,0,0,.10)',
        overflow: 'hidden',
      }}>
        {/* Top gradient bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: accentGrad,
          borderRadius: '20px 20px 0 0',
        }} />

        {/* Traffic lights */}
        <div style={{
          position: 'absolute', top: 16, left: 18,
          display: 'flex', gap: 7,
        }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
        </div>

        {/* 404 number with gradient */}
        <div className="grad-text" style={{
          fontSize: 72, fontWeight: 800, lineHeight: 1,
          fontFamily: 'var(--font-mono), monospace',
          background: accentGrad,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 16, marginTop: 8,
        }}>
          404
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif), serif',
          fontSize: 24, fontWeight: 400,
          color: text, letterSpacing: '-.3px',
          marginBottom: 12,
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: 14, color: textSub, lineHeight: 1.7,
          marginBottom: 28, maxWidth: 300, margin: '0 auto 28px',
        }}>
          Looks like this window doesn&apos;t exist. Let&apos;s get you back to the desktop.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', borderRadius: 14,
            fontSize: 14, fontWeight: 600,
            background: 'linear-gradient(135deg, #D4943A 0%, #e8a94e 100%)',
            color: '#fff', textDecoration: 'none',
            boxShadow: '0 0 20px rgba(212,148,58,.18), 0 4px 12px rgba(212,148,58,.12)',
            transition: 'all .18s',
            fontFamily: 'var(--font-sans), sans-serif',
          }}
        >
          ← Back to Desktop
        </Link>

        {/* Keyboard hint */}
        <div style={{
          marginTop: 20, fontSize: 11,
          color: textSub,
          fontFamily: 'var(--font-mono), monospace',
        }}>
          tomyromero.vercel.app
        </div>
      </div>
    </div>
  );
}
