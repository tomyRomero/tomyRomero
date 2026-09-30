'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { projectDetails, projects } from '@/constants';
import { MoonIcon, SunIcon, SearchIcon, GitHubIcon } from '@/components/mac/Icons';
import { T } from '@/components/mac/tokens';
import { ChevronLeft, ArrowUpRight } from '@/components/mac/Native';
import Showcase, { PLATFORM } from '@/components/ProjectShowcase';
import { hasAppHistory, useNavigate } from '@/components/nav';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function ProjectPage({ params }: { params: { title: string } }) {
  const router = useRouter();
  const go = useNavigate();
  const [dark, setDark] = useState(false);
  const [tucked, setTucked] = useState(false);
  // Don't save until the stored value has been read
  const [prefsReady, setPrefsReady] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Before paint, so arriving in dark mode doesn't flash light
  useIsoLayoutEffect(() => {
    const saved = localStorage.getItem('dark');
    if (saved !== null) setDark(saved === 'true');
    else setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    setPrefsReady(true);
  }, []);
  useEffect(() => { if (prefsReady) localStorage.setItem('dark', String(dark)); }, [dark, prefsReady]);

  const name = decodeURIComponent(params.title);
  const detail = projectDetails.find(p => p.title === name);
  const summary = projects.find(p => p.title === name);
  const tk = T(dark);
  const bg = dark ? '#000000' : '#f2f2f7';

  const toggleDark = () => {
    document.documentElement.classList.add('theme-transition');
    setDark(d => !d);
    setTimeout(() => document.documentElement.classList.remove('theme-transition'), 350);
  };
  const back = () => {
    if (hasAppHistory() || (document.referrer.startsWith(window.location.origin) && window.history.length > 1)) router.back();
    else go('/');
  };

  if (!detail || !summary) {
    return (
      <div style={{
        minHeight: '100dvh', background: bg, color: tk.label,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <div style={{ color: tk.accent }}><SearchIcon s={36} /></div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Project not found</div>
        <button onClick={() => go('/')} style={{
          padding: '10px 22px', borderRadius: 12, fontSize: 14, fontWeight: 600, background: tk.select, color: '#fff',
        }}>
          Back to the portfolio
        </button>
      </div>
    );
  }

  return (
    <div
      onScroll={e => {
        const t = e.currentTarget.scrollTop > (titleRef.current?.offsetTop ?? 80);
        if (t !== tucked) setTucked(t);
      }}
      style={{ position: 'fixed', inset: 0, overflowY: 'auto', background: bg, color: tk.label, userSelect: 'text', colorScheme: dark ? 'dark' : 'light' }}
    >
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100, paddingTop: 'env(safe-area-inset-top, 0px)',
        background: dark ? 'rgba(22,22,24,.82)' : 'rgba(250,250,252,.82)',
        backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        borderBottom: `.5px solid ${tucked ? (dark ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.14)') : 'transparent'}`,
        transition: 'border-color .18s',
      }}>
        <div style={{ maxWidth: 960, height: 48, margin: '0 auto', padding: '0 8px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
          <button onClick={back} style={{ justifySelf: 'start', display: 'inline-flex', alignItems: 'center', gap: 2, height: 36, padding: '0 8px', fontSize: 16, color: tk.accent }}>
            <ChevronLeft s={20} />Portfolio
          </button>
          <span style={{ fontSize: 16, fontWeight: 600, opacity: tucked ? 1 : 0, transition: 'opacity .18s' }}>{detail.title}</span>
          <button
            onClick={toggleDark}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              justifySelf: 'end', width: 36, height: 36, borderRadius: '50%', color: tk.label2,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.05)',
            }}
          >
            {dark ? <SunIcon s={17} /> : <MoonIcon s={17} />}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', paddingBottom: 'calc(40px + env(safe-area-inset-bottom, 0px))' }}>
        <header className="pp-head" style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: tk.label2 }}>
              {PLATFORM[summary.platform]} · {detail.year}
            </div>
            <h1 ref={titleRef} className="pp-title" style={{ marginTop: 4, fontWeight: 700, letterSpacing: '-1px', lineHeight: 1.05 }}>{detail.title}</h1>
            <p style={{ marginTop: 6, fontSize: 17, color: tk.label2 }}>{detail.type}</p>
          </div>
          <div className="pp-actions" style={{ display: 'flex', gap: 8 }}>
            {detail.githubrepo && (
              <a href={detail.githubrepo} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                height: 44, padding: '0 18px', borderRadius: 12, fontSize: 15, fontWeight: 600, background: tk.select, color: '#fff',
              }}>
                <GitHubIcon s={17} />View on GitHub
              </a>
            )}
            {detail.isLive && detail.livelink && (
              <a href={detail.livelink} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                height: 44, padding: '0 18px', borderRadius: 12, fontSize: 15, fontWeight: 600,
                background: dark ? '#1c1c1e' : '#fff', color: tk.label,
              }}>
                Live demo <ArrowUpRight s={12} />
              </a>
            )}
          </div>
        </header>

        <div className="pp-card" style={{ background: dark ? '#1c1c1e' : '#fff' }}>
          <Showcase title={detail.title} dark={dark} level={2} animate={false} />
        </div>
      </div>
    </div>
  );
}
