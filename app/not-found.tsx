'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dark');
    if (saved !== null) setDark(saved === 'true');
    else setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  const bg      = dark ? '#0a0c11' : '#f4f5f7';
  const text    = dark ? '#eef0f4' : '#1a1c20';
  const textSub = dark ? 'rgba(238,240,244,.60)' : 'rgba(26,28,32,.60)';
  const accent  = dark ? '#78b3ff' : '#0068d6';
  const accentSolid = dark ? '#0A84FF' : '#0071E3';
  const cardBg  = dark ? 'rgba(255,255,255,.045)' : 'rgba(0,0,0,.025)';
  const border  = dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)';

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
          ? 'radial-gradient(circle, rgba(70,110,205,.14) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(96,140,220,.12) 0%, transparent 70%)',
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
        {/* Traffic lights */}
        <div style={{
          position: 'absolute', top: 16, left: 18,
          display: 'flex', gap: 7,
        }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
        </div>

        {/* 404 number */}
        <div style={{
          fontSize: 72, fontWeight: 800, lineHeight: 1,
          fontFamily: 'var(--font-mono), monospace',
          color: accent,
          marginBottom: 16, marginTop: 8,
        }}>
          404
        </div>

        <h1 style={{
          fontSize: 22, fontWeight: 600,
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
            background: accentSolid,
            color: '#fff', textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(0,0,0,.14)',
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
