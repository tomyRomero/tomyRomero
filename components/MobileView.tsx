'use client';
import { useState, useEffect, useLayoutEffect, useRef, Fragment } from 'react';
import { flushSync } from 'react-dom';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  ME, images, projects, experiences, education, certifications, skills, contactDetails, contactBlurb,
  profilePhoto, resumeFile, shotsFor, isTallShot, coreStack, skillAnchor,
} from '@/constants';
import { GitHubIcon, LinkedInIcon, MoonIcon, SunIcon, MailIcon, PinIcon } from '@/components/mac/Icons';
import { T } from '@/components/mac/tokens';
import { Monogram, tint, Download, Envelope, PinLine, ChevronLeft, ChevronRight, ChevronDown, ArrowUpRight, CopyIcon, CheckIcon, SendIcon } from '@/components/mac/Native';
import ResumeDialog, { requestResume } from '@/components/mac/ResumeDialog';
import ProjectCover from '@/components/ProjectCover';
import { Browser, Phone } from '@/components/DeviceFrames';
import RoleTimeline, { shortSpan } from '@/components/RoleTimeline';
import { CatIcon } from '@/components/SkillIcon';
import Home, { type AppId } from '@/components/mobile/Home';
import { copyText } from '@/components/copyText';
import { Link } from '@/components/nav';

// Phone layout: a home screen where each section opens as an app. The open
// app is kept in the URL hash, so Back closes it.

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const APPS: Record<AppId, string> = {
  about: 'About Me', work: 'Projects', experience: 'Experience', contact: 'Contact',
  skills: 'Skills', photos: 'Photos', weather: 'Weather',
};
// #work is the original hash; #projects is an alias
function appFromHash(hash: string): AppId | null {
  const h = hash.replace(/^#/, '');
  if (h === 'projects') return 'work';
  return h in APPS ? (h as AppId) : null;
}
const SUBJECT = 'Hello from your portfolio';

const PhotosApp  = dynamic(() => import('@/components/mac/Widgets').then(m => m.PhotosWindow), { ssr: false });
const WeatherApp = dynamic(() => import('@/components/mac/Widgets').then(m => m.WeatherWindow), { ssr: false });

const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const withoutApp = () => {
  const { mApp: _, ...rest } = (window.history.state ?? {}) as Record<string, unknown>;
  return rest;
};

// Transform and opacity only, so the zoom stays on the compositor
function atIcon(r: DOMRect | null): Keyframe {
  const vw = window.innerWidth, vh = window.innerHeight;
  if (!r) return { transform: 'scale(.92)', opacity: 0 };
  return {
    transform: `translate(${r.left + r.width / 2 - vw / 2}px, ${r.top + r.height / 2 - vh / 2}px) scale(${r.width / vw})`,
    opacity: 0,
  };
}
const ZOOM_RADIUS = '44px';
// Outlives the component, so Back from a project page lands where you were
const appScroll: Record<string, number> = {};
const rectOf = (el: HTMLElement | null) => (el?.closest<HTMLElement>('[data-app]') ?? el)?.getBoundingClientRect() ?? null;

export default function MobileView({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const tk = T(dark);
  const [app, setApp] = useState<AppId | null>(null);
  const [loaded, setLoaded] = useState<AppId[]>([]);   // Photos and Weather stay mounted once opened
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const appRef = useRef(app);
  appRef.current = app;
  const layer = useRef<HTMLDivElement>(null);
  const home = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);   // the icon that opened the app
  const pushed = useRef(false);   // whether we pushed a history entry
  const moving = useRef<Animation[]>([]);
  const scrollers = useRef<Record<string, HTMLDivElement | null>>({});
  const saved = useRef(appScroll);

  const iconOf = (id: AppId) => home.current?.querySelector<HTMLElement>(`[data-app="${id}"]`) ?? null;
  const stop = () => {
    moving.current.forEach(a => a.cancel());
    moving.current = [];
    if (layer.current) Object.assign(layer.current.style, { borderRadius: '', transform: '' });
    if (home.current) Object.assign(home.current.style, { transform: '', opacity: '' });
  };
  // Where a home bar drag left the app and home screen, so closing starts there
  const dragged = useRef<Lift | null>(null);
  const keepScroll = () => {
    const id = appRef.current;
    const el = id && scrollers.current[id];
    if (id && el) saved.current[id] = el.scrollTop;
  };

  const show = (id: AppId, from: HTMLElement | null, animate: boolean) => {
    stop();
    opener.current = from;
    flushSync(() => {
      setApp(id);
      setLoaded(l => (l.includes(id) ? l : [...l, id]));
    });
    const r = animate && !still() ? rectOf(from) : null;
    if (animate && !still()) {
      const ease = 'cubic-bezier(.2,.9,.25,1)';
      const a = layer.current!.animate(
        [atIcon(r), { opacity: 1, offset: .3 }, { transform: 'none', opacity: 1 }],
        { duration: 460, easing: ease },
      );
      layer.current!.style.borderRadius = ZOOM_RADIUS;
      a.onfinish = () => { if (layer.current) layer.current.style.borderRadius = ''; };
      moving.current.push(a);
      if (home.current && r) {
        home.current.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
        moving.current.push(home.current.animate([{ transform: 'none' }, { transform: 'scale(1.12)', opacity: .35 }], { duration: 460, easing: ease, fill: 'forwards' }));
      }
    }
    layer.current?.querySelector<HTMLElement>(`#m-${id} [data-home]`)?.focus({ preventScroll: true });
  };

  const hide = () => {
    if (!appRef.current) return;
    keepScroll();
    const from = dragged.current;
    dragged.current = null;
    const back = opener.current?.isConnected ? opener.current : iconOf(appRef.current);
    const done = () => {
      flushSync(() => setApp(null));
      stop();
      back?.focus({ preventScroll: true });
    };
    stop();
    if (still()) { done(); return; }
    const r = rectOf(back);
    const ease = 'cubic-bezier(.4,0,.2,1)';
    const a = layer.current!.animate(
      [from?.app ?? { transform: 'none', opacity: 1 }, { opacity: 1, offset: .65 }, atIcon(r)],
      { duration: 380, easing: ease, fill: 'forwards' },
    );
    layer.current!.style.borderRadius = ZOOM_RADIUS;
    moving.current.push(a);
    if (home.current && r) {
      if (!from) home.current.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
      moving.current.push(home.current.animate([from?.home ?? { transform: 'scale(1.12)', opacity: .35 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: ease }));
    }
    a.onfinish = done;
  };

  // A short drag puts the app back where it was
  const settle = (from: Lift) => {
    stop();
    layer.current!.style.borderRadius = ZOOM_RADIUS;
    const ease = 'cubic-bezier(.2,.9,.3,1.1)';
    const a = layer.current!.animate([from.app, { transform: 'none' }], { duration: 320, easing: ease });
    a.onfinish = () => { if (layer.current) layer.current.style.borderRadius = ''; };
    moving.current.push(a);
    if (home.current) moving.current.push(home.current.animate([from.home, { transform: 'scale(1.12)', opacity: .35 }], { duration: 320, easing: ease, fill: 'forwards' }));
  };

  const open = (id: AppId, from: HTMLElement | null) => {
    if (appRef.current) return;
    window.history.pushState({ ...window.history.state, mApp: id }, '', `#${id}`);
    pushed.current = true;
    show(id, from ?? iconOf(id), true);
  };
  // Switch apps without adding a history entry
  const switchTo = (id: AppId) => {
    if (!appRef.current || appRef.current === id) return;
    keepScroll();
    window.history.replaceState({ ...window.history.state, mApp: id }, '', `#${id}`);
    flushSync(() => {
      setApp(id);
      setLoaded(l => (l.includes(id) ? l : [...l, id]));
    });
    if (!still()) layer.current?.animate([{ opacity: .4 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
    opener.current = iconOf(id);
  };
  const goHome = () => {
    if (pushed.current) { window.history.back(); return; }   // popstate closes it
    window.history.replaceState(withoutApp(), '', window.location.pathname + window.location.search);
    hide();
  };

  // Deep link: put the home screen underneath so Back returns to it
  useIsoLayoutEffect(() => {
    const id = appFromHash(window.location.hash);
    if (!id) return;
    if (window.history.state?.mApp !== id) {
      const base = withoutApp();
      window.history.replaceState(base, '', window.location.pathname + window.location.search);
      window.history.pushState({ ...base, mApp: id }, '', `#${id}`);
    }
    pushed.current = true;
    setApp(id);
    setLoaded([id]);
  }, []);

  // Back and Forward
  useEffect(() => {
    const here = window.location.pathname;
    const onPop = () => {
      if (window.location.pathname !== here) return;
      const id = appFromHash(window.location.hash);
      if (id === appRef.current) return;
      if (!id) { pushed.current = false; hide(); return; }
      pushed.current = window.history.state?.mApp === id;
      if (appRef.current) switchTo(id);
      else show(id, iconOf(id), true);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore each app's scroll position
  useIsoLayoutEffect(() => {
    const el = app && scrollers.current[app];
    if (el) el.scrollTop = saved.current[app] ?? 0;
  }, [app]);
  // Also when leaving for another page
  useIsoLayoutEffect(() => keepScroll, []);

  useEffect(() => {
    if (home.current) home.current.inert = !!app;
  }, [app]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxIdx(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx]);

  const bg = dark ? '#000000' : '#f2f2f7';
  const screen = (id: AppId, title: string | null, children: React.ReactNode) => (
    <Screen
      key={id} id={id} title={title} dark={dark} setDark={setDark} hidden={app !== id} onHome={goHome}
      scrollRef={el => { scrollers.current[id] = el; }}
    >
      {children}
    </Screen>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, overflow: 'hidden', background: dark ? '#141416' : '#f7f5f0', color: tk.label,
      fontFamily: 'var(--font-sans), sans-serif', userSelect: 'text',
    }}>
      <ResumeDialog dark={dark} touch />

      <Home dark={dark} setDark={setDark} open={open} homeRef={home} />

      <div ref={layer} style={{
        position: 'absolute', inset: 0, zIndex: 20, overflow: 'hidden', background: bg,
        visibility: app ? 'visible' : 'hidden',
      }}>
        {screen('about', null, <AboutScreen dark={dark} setDark={setDark} go={switchTo} openPhoto={setLightboxIdx} />)}
        {screen('work', 'Projects', <WorkScreen dark={dark} />)}
        {screen('experience', 'Experience', <ExperienceScreen dark={dark} />)}
        {screen('contact', 'Contact', <ContactScreen dark={dark} />)}
        {screen('skills', 'Skills', <SkillsScreen dark={dark} />)}
        {loaded.includes('photos') && (
          <section id="m-photos" aria-label="Photos" style={{ position: 'absolute', inset: 0, display: app === 'photos' ? 'flex' : 'none', background: tk.pane }}>
            <PhotosApp dark={dark} onOpen={() => {}} nav={<HomeButton onClick={goHome} color={tk.accent} />} />
          </section>
        )}
        {loaded.includes('weather') && (
          <section id="m-weather" aria-label="Weather" style={{ position: 'absolute', inset: 0, display: app === 'weather' ? 'flex' : 'none' }}>
            <WeatherApp nav={
              <div style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}><HomeButton onClick={goHome} color="#fff" /></div>
            } />
          </section>
        )}
      </div>

      {app && (
        <HomeBar
          layer={layer} home={home} light={dark || app === 'weather'}
          onStart={stop} onStay={settle} onGo={from => { dragged.current = from; goHome(); }}
        />
      )}

      {lightboxIdx !== null && (
        <div
          onClick={() => setLightboxIdx(null)}
          role="dialog"
          aria-modal="true"
          aria-label={images[lightboxIdx].title ? `Photo: ${images[lightboxIdx].title}` : 'Photo viewer'}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,.92)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn .18s ease',
          }}
        >
          <div style={{ position: 'relative', width: '90vw', height: '72vh' }} onClick={e => e.stopPropagation()}>
            <Image src={images[lightboxIdx].img} alt={images[lightboxIdx].alt} fill style={{ objectFit: 'contain', borderRadius: 10 }} sizes="90vw" />
          </div>
          <div style={{
            position: 'absolute', bottom: 'calc(28px + env(safe-area-inset-bottom, 0px))', left: 0, right: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
          }} onClick={e => e.stopPropagation()}>
            {(['‹', '›'] as const).map((l, k) => (
              <button
                key={l}
                aria-label={k ? 'Next photo' : 'Previous photo'}
                onClick={() => setLightboxIdx(i => ((i ?? 0) + (k ? 1 : -1) + images.length) % images.length)}
                style={{
                  width: 44, height: 44, borderRadius: '50%', fontSize: 24, color: '#fff',
                  background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >{l}</button>
            ))}
          </div>
          <div style={{
            position: 'absolute', top: 24, left: 20, right: 70, color: 'rgba(255,255,255,.85)', fontSize: 14, fontWeight: 500,
          }}>
            {images[lightboxIdx].title}
          </div>
          <button
            onClick={() => setLightboxIdx(null)}
            aria-label="Close"
            style={{
              position: 'absolute', top: 16, right: 16, width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)', color: '#fff', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>
      )}
    </div>
  );
}

// Scroller with a large title that collapses into the nav bar
function Screen({ id, title, dark, setDark, hidden, scrollRef, onHome, children }: {
  id: AppId; title: string | null; dark: boolean; setDark: (v: boolean) => void; hidden: boolean;
  scrollRef: (el: HTMLDivElement | null) => void; onHome: () => void; children: React.ReactNode;
}) {
  const tk = T(dark);
  const [tucked, setTucked] = useState(false);
  const at = title ? 44 : 250;
  const onPoster = !title && !tucked;
  return (
    <section id={`m-${id}`} aria-label={APPS[id]} style={{ position: 'absolute', inset: 0, display: hidden ? 'none' : 'block' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingTop: 'env(safe-area-inset-top, 0px)', pointerEvents: 'none' }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: dark ? 'rgba(22,22,24,.82)' : 'rgba(250,250,252,.82)',
          backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          borderBottom: `.5px solid ${dark ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.14)'}`,
          opacity: tucked ? 1 : 0, transition: 'opacity .18s ease',
        }} />
        <div style={{ position: 'relative', height: 44, display: 'flex', alignItems: 'center' }}>
          <HomeButton onClick={onHome} color={onPoster ? '#fff' : tk.accent} onPhoto={onPoster} />
          <div aria-hidden="true" style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: 16, fontWeight: 600, whiteSpace: 'nowrap',
            opacity: tucked ? 1 : 0, transition: 'opacity .18s ease',
          }}>
            {title ?? ME.name}
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        onScroll={e => { const t = e.currentTarget.scrollTop > at; if (t !== tucked) setTucked(t); }}
        style={{
          position: 'absolute', inset: 0, overflowY: 'auto', overscrollBehavior: 'contain',
          paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          {title && (
            <div style={{ padding: 'calc(46px + env(safe-area-inset-top, 0px)) 20px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <h2 style={{ flex: 1, fontSize: 34, fontWeight: 700, letterSpacing: '-.8px', lineHeight: 1.15 }}>{title}</h2>
              <ThemeButton dark={dark} setDark={setDark} tint={tk.label2} />
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

type Lift = { app: Keyframe; home: Keyframe };

// The bar along the bottom of an iPhone. Dragging it up shrinks the app under
// the finger; letting go far enough or with a flick sends it home.
function HomeBar({ layer, home, light, onStart, onStay, onGo }: {
  layer: React.RefObject<HTMLDivElement>; home: React.RefObject<HTMLDivElement>; light: boolean;
  onStart: () => void; onStay: (from: Lift) => void; onGo: (from: Lift) => void;
}) {
  const pill = useRef<HTMLSpanElement>(null);

  const down = (e: React.PointerEvent<HTMLDivElement>) => {
    const app = layer.current, hs = home.current, bar = e.currentTarget;
    if (!app || e.button !== 0) return;
    bar.setPointerCapture(e.pointerId);
    onStart();
    app.style.borderRadius = ZOOM_RADIUS;
    const vh = window.innerHeight, y0 = e.clientY;
    let lift = 0, speed = 0, lastY = y0, lastT = e.timeStamp;

    const now = (): Lift => ({
      app: { transform: app.style.transform || 'none', opacity: 1 },
      home: { transform: hs?.style.transform || 'none', opacity: Number(hs?.style.opacity || 1) },
    });
    const move = (m: PointerEvent) => {
      lift = Math.max(0, y0 - m.clientY);
      const p = Math.min(1, lift / (vh * .5));
      app.style.transform = `translateY(${-lift * .3}px) scale(${1 - p * .42})`;
      if (hs) Object.assign(hs.style, { transform: `scale(${1.12 - .12 * p})`, opacity: String(.35 + .65 * p) });
      if (pill.current) pill.current.style.opacity = String(Math.max(0, 1 - p * 3));
      if (m.timeStamp > lastT) speed = (lastY - m.clientY) / (m.timeStamp - lastT);
      lastY = m.clientY; lastT = m.timeStamp;
    };
    const up = () => {
      bar.removeEventListener('pointermove', move);
      bar.removeEventListener('pointerup', up);
      bar.removeEventListener('pointercancel', up);
      if (pill.current) pill.current.style.opacity = '';
      if (!lift) { onStay(now()); return; }
      if (lift > vh * .18 || (speed > .45 && lift > 24)) onGo(now());
      else onStay(now());
    };
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', up);
    bar.addEventListener('pointercancel', up);
  };

  // The Home button in the nav bar does the same for keyboards and screen readers
  return (
    <div aria-hidden="true" onPointerDown={down} style={{
      position: 'absolute', left: '50%', bottom: 0, zIndex: 21, transform: 'translateX(-50%)',
      width: 'min(64%, 260px)', height: 'calc(28px + env(safe-area-inset-bottom, 0px))',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))', touchAction: 'none', cursor: 'grab',
    }}>
      <span ref={pill} style={{
        width: 134, height: 5, borderRadius: 3, transition: 'opacity .2s ease',
        background: light ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.8)',
      }} />
    </div>
  );
}

function HomeButton({ onClick, color, onPhoto = false }: { onClick: () => void; color: string; onPhoto?: boolean }) {
  return (
    <button data-home="" onClick={onClick} className="m-press" style={{
      pointerEvents: 'auto', height: onPhoto ? 34 : 44, marginLeft: onPhoto ? 10 : 2, padding: onPhoto ? '0 13px 0 7px' : '0 10px 0 6px',
      borderRadius: 17, display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 17, color,
      background: onPhoto ? 'rgba(0,0,0,.22)' : 'transparent',
      backdropFilter: onPhoto ? 'blur(14px)' : undefined, WebkitBackdropFilter: onPhoto ? 'blur(14px)' : undefined,
      transition: 'color .18s ease, background .18s ease',
    }}>
      <ChevronLeft s={21} />Home
    </button>
  );
}

function ThemeButton({ dark, setDark, tint: color, onPhoto }: { dark: boolean; setDark: (v: boolean) => void; tint: string; onPhoto?: boolean }) {
  return (
    <button
      onClick={() => setDark(!dark)}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 36, height: 36, marginTop: 4, flexShrink: 0, borderRadius: '50%', color,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: onPhoto ? 'rgba(255,255,255,.2)' : dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.05)',
        backdropFilter: onPhoto ? 'blur(14px)' : undefined, WebkitBackdropFilter: onPhoto ? 'blur(14px)' : undefined,
      }}
    >
      {dark ? <SunIcon s={17} /> : <MoonIcon s={17} />}
    </button>
  );
}

function GroupLabel({ children, dark, action, top }: { children: React.ReactNode; dark: boolean; action?: React.ReactNode; top?: boolean }) {
  const tk = T(dark);
  const H = top ? 'h2' : 'h3';
  return (
    <div style={{
      padding: '24px 32px 7px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      fontSize: 13, color: tk.label2, textTransform: 'uppercase', letterSpacing: '.3px',
    }}>
      <H style={{ fontSize: 13, fontWeight: 400 }}>{children}</H>
      {action}
    </div>
  );
}

const group = (dark: boolean): React.CSSProperties => ({
  margin: '0 16px', borderRadius: 16, overflow: 'hidden', background: dark ? '#1c1c1e' : '#ffffff',
});

function AboutScreen({ dark, setDark, go, openPhoto }: {
  dark: boolean; setDark: (v: boolean) => void; go: (id: AppId) => void; openPhoto: (i: number) => void;
}) {
  const tk = T(dark);
  const [more, setMore] = useState(false);
  // Below the fold, so they load after the page settles
  const [photos, setPhotos] = useState(false);
  useEffect(() => {
    let idle = 0;
    const go = () => { idle = window.setTimeout(() => setPhotos(true), 150); };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => { window.removeEventListener('load', go); clearTimeout(idle); };
  }, []);
  const tile = (primary?: boolean): React.CSSProperties => ({
    height: 72, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
    fontSize: 12.5, fontWeight: primary ? 600 : 500,
    background: primary ? tk.select : dark ? '#2c2c2e' : '#ffffff', color: primary ? '#fff' : tk.accent,
    boxShadow: primary ? `0 10px 24px ${dark ? 'rgba(10,132,255,.3)' : 'rgba(0,98,204,.35)'}` : `0 10px 24px rgba(0,0,0,${dark ? '.4' : '.1'})`,
  });
  // Opens Skills scrolled to the category
  const stack = (c: (typeof coreStack)[number], mid?: boolean) => (
    <button key={c.cat} onClick={() => {
      go('skills');
      requestAnimationFrame(() => document.getElementById(`m-${skillAnchor(c.cat)}`)?.scrollIntoView({ block: 'start' }));
    }} style={{
      padding: '13px 0 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: tk.label,
      borderLeft: mid ? `1px solid ${tk.sep}` : 'none', borderRight: mid ? `1px solid ${tk.sep}` : 'none',
    }}>
      <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.3px', lineHeight: 1.2 }}>{c.name}</span>
      <span style={{ fontSize: 12.5, color: tk.label2 }}>{c.area}</span>
    </button>
  );

  return (
    <>
      <header style={{ position: 'relative', height: 'calc(356px + env(safe-area-inset-top, 0px))', overflow: 'hidden', background: '#3b3a36', color: '#fff' }}>
        {/* Blurred placeholder, no extra request */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, backgroundImage: `url(${profilePhoto.blurDataURL})`, backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(30px) saturate(1.5)', transform: 'scale(1.4)', opacity: .95,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.12) 0%, rgba(0,0,0,.42) 100%)' }} />
        <div style={{ position: 'absolute', top: 'env(safe-area-inset-top, 0px)', right: 16, zIndex: 1 }}>
          <ThemeButton dark={dark} setDark={setDark} tint="#fff" onPhoto />
        </div>
        <div style={{
          position: 'relative', height: '100%', paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 38,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        }}>
          <div style={{ position: 'relative', width: 104, height: 104, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 3px rgba(255,255,255,.9), 0 12px 30px rgba(0,0,0,.35)' }}>
            <Image src={profilePhoto} alt="Tomy Romero" fill sizes="104px" priority style={{ objectFit: 'cover' }} />
          </div>
          <h1 style={{ marginTop: 14, fontSize: 31, fontWeight: 700, letterSpacing: '-.8px', lineHeight: 1.05, textShadow: '0 2px 12px rgba(0,0,0,.25)' }}>{ME.name}</h1>
          <div style={{ marginTop: 5, fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,.92)' }}>{ME.title}</div>
          <div style={{ marginTop: 12, display: 'flex', gap: 7, flexWrap: 'wrap', justifyContent: 'center', padding: '0 16px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px 5px 9px', borderRadius: 20, background: 'rgba(255,255,255,.2)', fontSize: 13, fontWeight: 500 }}>
              <PinLine />{ME.location}
            </span>
          </div>
        </div>
      </header>

      <div style={{ position: 'relative', margin: '-38px 16px 0', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
        <a href={resumeFile.href} onClick={e => { e.preventDefault(); requestResume(); }} style={tile(true)}><Download s={23} />Resume</a>
        <button onClick={() => go('contact')} style={tile()}><Envelope s={23} />Email</button>
        <a href={ME.github} target="_blank" rel="noopener noreferrer" style={tile()}><GitHubIcon s={21} />GitHub</a>
        <a href={ME.linkedin} target="_blank" rel="noopener noreferrer" style={tile()}><LinkedInIcon s={20} />LinkedIn</a>
      </div>

      <div style={{ ...group(dark), marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        {coreStack.map((c, i) => stack(c, i === 1))}
      </div>

      <GroupLabel dark={dark} top>About</GroupLabel>
      <div style={{ ...group(dark), padding: '12px 16px' }}>
        <p className="text-pretty" style={{
          fontSize: 15, lineHeight: 1.47,
          ...(more ? {} : { display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }),
        }}>
          {ME.bio}
        </p>
        <button onClick={() => setMore(m => !m)} aria-expanded={more} style={{ marginTop: 3, fontSize: 15, fontWeight: 600, color: tk.accent }}>
          {more ? 'less' : 'more'}
        </button>
      </div>

      <GroupLabel dark={dark} top action={
        <button onClick={() => openPhoto(0)} style={{ textTransform: 'none', letterSpacing: 0, fontSize: 14, fontWeight: 500, color: tk.accent }}>See all</button>
      }>Photos</GroupLabel>
      {photos ? (
      <div style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '8px 0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, width: 'max-content', padding: '0 22px' }}>
          {images.map((img, i) => {
            const tilt = [-5, 4, -3, 6, -2, 4, -6, 2, -3, 5][i % 10];
            return (
              <button
                key={i}
                aria-label={`Open photo: ${img.title}`}
                onClick={() => openPhoto(i)}
                style={{
                  flexShrink: 0, width: 104, padding: '6px 6px 20px', borderRadius: 2,
                  background: dark ? '#e8e4da' : '#faf8f3',
                  transform: `rotate(${tilt}deg) translateY(${(i % 3) * 3}px)`,
                  boxShadow: `0 6px 16px rgba(0,0,0,${dark ? '.5' : '.16'})`,
                }}
              >
                <span style={{ position: 'relative', display: 'block', width: 92, height: 92, overflow: 'hidden', background: '#d0ccc4' }}>
                  <Image src={img.img} alt="" fill style={{ objectFit: 'cover' }} sizes="92px" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
      ) : <div style={{ height: 144 }} />}

      <div style={{ padding: '26px 20px 0', textAlign: 'center', fontSize: 12, color: tk.label2 }}>
        Built with Next.js · {new Date().getFullYear()} {ME.name}
      </div>
    </>
  );
}

type Filter = 'all' | 'web' | 'mobile';
const PLATFORM = { web: 'Web app', mobile: 'Mobile app' } as const;

function WorkScreen({ dark }: { dark: boolean }) {
  const tk = T(dark);
  const [filter, setFilter] = useState<Filter>('all');
  return (
    <>
      <div style={{ padding: '0 20px', fontSize: 15, color: tk.label2 }}>{projects.length} projects</div>
      <div role="group" aria-label="Filter projects" style={{
        margin: '14px 16px 0', padding: 2, borderRadius: 9, background: dark ? 'rgba(118,118,128,.24)' : 'rgba(118,118,128,.14)',
        display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      }}>
        {(['all', 'web', 'mobile'] as const).map(f => (
          <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)} style={{
            height: 30, borderRadius: 7, fontSize: 13.5, fontWeight: filter === f ? 600 : 500, color: tk.label,
            background: filter === f ? (dark ? '#636366' : '#ffffff') : 'transparent',
            boxShadow: filter === f ? '0 1px 3px rgba(0,0,0,.12)' : 'none', transition: 'background .15s',
          }}>
            {f === 'all' ? 'All' : f === 'web' ? 'Web' : 'Mobile'}
          </button>
        ))}
      </div>
      {/* Filters hide cards instead of unmounting them, so images don't reload */}
      <div style={{ margin: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {projects.map((p, i) => (
          <div key={p.title} style={{ display: filter === 'all' || p.platform === filter ? undefined : 'none' }}>
            <ProjectCard p={p} dark={dark} featured={i === 0 && filter === 'all'} />
          </div>
        ))}
      </div>
    </>
  );
}

function ProjectCard({ p, dark, featured }: { p: (typeof projects)[number]; dark: boolean; featured: boolean }) {
  const mobile = p.platform === 'mobile';
  const shots = shotsFor(p.title);
  const phones = shots.filter(isTallShot);
  const ink = dark ? '#f5f5f7' : '#1d1d1f';
  const tags = p.techStack.split(', ');
  return (
    <Link href={`/project/${encodeURIComponent(p.title)}`} style={{
      position: 'relative', display: 'block', height: mobile ? 432 : 320, borderRadius: 22, overflow: 'hidden', color: ink,
      background: mobile ? (dark ? '#2b2520' : '#f4ede6') : (dark ? '#1f2229' : '#eaeef5'),
      boxShadow: `0 14px 34px rgba(0,0,0,${dark ? '.4' : '.1'})`,
    }}>
      {mobile && <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${dark ? 'rgba(255,220,180,.07)' : 'rgba(120,80,40,.11)'} 1px, transparent 1px)`, backgroundSize: '14px 14px' }} />}
      <div style={{ position: 'relative', padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: mobile ? (dark ? '#e3a56f' : '#93511e') : (dark ? '#8fb3ea' : '#36598f') }}>
          {featured ? `Featured · ${PLATFORM[p.platform]}` : `${PLATFORM[p.platform]} · ${p.year}`}
        </span>
        <span style={{ fontSize: mobile ? 32 : 26, fontWeight: 700, letterSpacing: mobile ? '-.9px' : '-.6px', lineHeight: 1.05 }}>{p.title}</span>
        {mobile && <span style={{ fontSize: 15, color: dark ? '#d6cfc8' : '#4a4038' }}>{p.tagline}</span>}
      </div>

      {mobile && phones[0] ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 142, display: 'flex', justifyContent: 'center' }}>
          {phones[1] && <Phone shot={phones[1]} width={112} sizes="120px" style={{ position: 'absolute', right: '50%', marginRight: 20, top: 28, transform: 'rotate(-9deg)' }} />}
          {phones.length > 2 && <Phone shot={phones[phones.length - 1]} width={112} sizes="120px" style={{ position: 'absolute', left: '50%', marginLeft: 20, top: 28, transform: 'rotate(9deg)' }} />}
          <Phone shot={phones[0]} width={130} sizes="140px" alt={`${p.title} screens`} shadow={dark ? '0 22px 40px rgba(0,0,0,.5)' : '0 22px 40px rgba(80,40,10,.34)'} style={{ position: 'relative' }} />
        </div>
      ) : p.cover ? (
        <div style={{ position: 'absolute', left: 22, right: 22, top: 96 }}>
          <Browser shot={p.cover} label={p.title} dark={dark} aspect="16 / 10" sizes="(max-width: 560px) 90vw, 500px" />
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 22, right: 22, top: 96, height: 180, borderRadius: 10, overflow: 'hidden' }}>
          <ProjectCover title={p.title} shot={null} sizes="400px" dark={dark} size="md" />
        </div>
      )}

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 62, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px',
        background: dark ? 'rgba(30,30,32,.74)' : 'rgba(255,255,255,.74)',
        backdropFilter: 'blur(20px) saturate(1.6)', WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
      }}>
        <span style={{ flex: 1, minWidth: 0, fontSize: 13, color: dark ? '#c7c7cc' : '#4a4a4f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {mobile ? `${tags.slice(0, 2).join(' · ')}${tags.length > 2 ? ` · +${tags.length - 2}` : ''}` : p.tagline}
        </span>
        <span style={{ padding: '7px 16px', borderRadius: 20, background: ink, color: dark ? '#1d1d1f' : '#fff', fontSize: 14, fontWeight: 600 }}>View</span>
      </div>
    </Link>
  );
}

function ExperienceScreen({ dark }: { dark: boolean }) {
  const tk = T(dark);
  const [open, setOpen] = useState<string | null>(null);
  const firstYear = Math.min(...experiences.map(e => Number(e.start.slice(0, 4))));
  return (
    <>
      <div style={{ padding: '0 20px', fontSize: 15, color: tk.label2 }}>{experiences.length} roles · {firstYear} – today</div>
      <div style={{ ...group(dark), marginTop: 14, padding: '12px 16px 10px' }}>
        <RoleTimeline
          dark={dark} selected={open ?? undefined}
          onSelect={c => setOpen(o => (o === c ? null : c))}
          muted={{ text: tk.label2, track: dark ? 'rgba(255,255,255,.12)' : '#e8e8ed', tick: 'transparent', knob: dark ? '#1c1c1e' : '#fff' }}
        />
      </div>

      <GroupLabel dark={dark}>Work</GroupLabel>
      <div style={group(dark)}>
        {experiences.map((e, i) => {
          const on = open === e.company;
          const c = tint(e.tint, dark);
          return (
            <div key={e.company}>
              <button
                onClick={() => setOpen(on ? null : e.company)}
                aria-expanded={on}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px 0', textAlign: 'left', color: tk.label }}
              >
                <Monogram text={e.logo} t={e.tint} dark={dark} size={42} />
                <span style={{
                  flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1, paddingBottom: 12,
                  borderBottom: i < experiences.length - 1 || on ? `1px solid ${tk.sep}` : 'none',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>{e.short}</span>
                    {!e.end && <span style={{ padding: '1px 7px', borderRadius: 10, background: tk.accentBg, color: tk.accent, fontSize: 11.5, fontWeight: 600 }}>Current</span>}
                  </span>
                  <span style={{ fontSize: 14, color: dark ? '#d1d1d6' : '#3a3a3c' }}>{e.title}</span>
                  <span style={{ fontSize: 13, color: tk.label2 }}>{shortSpan(e.start, e.end).replace('now', 'Present')} · {e.location}</span>
                </span>
                <span style={{ color: tk.label3, display: 'inline-flex', transform: on ? 'rotate(180deg)' : 'none', transition: 'transform .2s', marginBottom: 12 }}>
                  <ChevronDown s={14} />
                </span>
              </button>
              {on && (
                <div style={{ padding: '12px 16px 14px 68px', borderBottom: i < experiences.length - 1 ? `1px solid ${tk.sep}` : 'none', animation: 'fadeIn .2s ease' }}>
                  <div style={{ fontSize: 13, color: tk.label2 }}>{e.company}</div>
                  <ul style={{ marginTop: 8, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {e.description.map(d => (
                      <li key={d} style={{ display: 'flex', gap: 9, fontSize: 14, lineHeight: 1.5 }}>
                        <span aria-hidden="true" style={{ width: 5, height: 5, marginTop: 8, flexShrink: 0, borderRadius: '50%', background: c.bar }} />{d}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {e.tech.map(t => <span key={t} style={{ padding: '3px 9px', borderRadius: 7, fontSize: 12.5, fontWeight: 500, background: dark ? '#2c2c2e' : '#f2f2f5' }}>{t}</span>)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <GroupLabel dark={dark}>Education</GroupLabel>
      <div style={group(dark)}>
        {education.map(e => (
          <div key={e.institution} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px' }}>
            <Monogram text={e.logo} t={e.tint} dark={dark} size={42} />
            <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>{e.institution}</span>
              <span style={{ fontSize: 14, color: dark ? '#d1d1d6' : '#3a3a3c' }}>{e.degree} in {e.field}</span>
              <span style={{ fontSize: 13, color: tk.label2 }}>{e.years} · {e.location}</span>
              <span style={{ marginTop: 6, fontSize: 13.5, lineHeight: 1.45, color: tk.label2 }}>{e.bullets.join(' · ')}</span>
            </span>
          </div>
        ))}
      </div>

      <GroupLabel dark={dark}>Certifications</GroupLabel>
      <div style={group(dark)}>
        {certifications.map((c, i) => (
          <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 14, color: tk.label }}>
            <Monogram text={c.logo} t={c.tint} dark={dark} size={30} round={false} />
            <span style={{
              flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px 11px 0',
              borderBottom: i < certifications.length - 1 ? `1px solid ${tk.sep}` : 'none',
            }}>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 15, fontWeight: 500 }}>{c.name}</span>
                <span style={{ fontSize: 13, color: tk.label2 }}>{c.issuer.replace(/ \(AWS\)$/, '')} · {c.issued}</span>
              </span>
              <span style={{ color: tk.label3, display: 'inline-flex' }}><ArrowUpRight s={12} /></span>
            </span>
          </a>
        ))}
      </div>

      <div style={{ ...group(dark), marginTop: 24 }}>
        <button onClick={requestResume} style={{ width: '100%', height: 50, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', fontSize: 15, color: tk.accent }}>
          <Download s={20} /><span style={{ flex: 1, textAlign: 'left' }}>Download resume</span>
          <span style={{ color: tk.label3, display: 'inline-flex' }}><ChevronRight s={14} /></span>
        </button>
      </div>
    </>
  );
}

const ROW_ICON: Record<string, { icon: React.ReactNode; bg: string }> = {
  Email:    { icon: <MailIcon s={16} />,     bg: '#0a7aff' },
  LinkedIn: { icon: <LinkedInIcon s={15} />, bg: '#0a66c2' },
  GitHub:   { icon: <GitHubIcon s={16} />,   bg: '#1d1d1f' },
  Location: { icon: <PinIcon s={16} />,      bg: '#ff3b30' },
};

function ContactScreen({ dark }: { dark: boolean }) {
  const tk = T(dark);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [copied, setCopied] = useState(false);
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const q = `subject=${encodeURIComponent(subject.trim() || SUBJECT)}${body.trim() ? `&body=${encodeURIComponent(body)}` : ''}`;
    window.location.href = `mailto:${ME.email}?${q}`;
  };
  const copy = () => {
    copyText(ME.email).then(ok => {
      if (!ok) return;
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  const line: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, minHeight: 46, marginLeft: 16, paddingRight: 16, borderBottom: `1px solid ${tk.sep}`, fontSize: 15 };

  return (
    <>
      <div style={{ padding: '6px 20px 0' }}>
        <p className="text-pretty" style={{ fontSize: 15, lineHeight: 1.45, color: dark ? '#d1d1d6' : '#3a3a3c' }}>{contactBlurb}</p>
      </div>

      <form aria-label="Email Tomy" onSubmit={send} style={{ ...group(dark), marginTop: 16, display: 'flex', flexDirection: 'column' }}>
        <div style={line}>
          <span style={{ color: tk.label2 }}>To:</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px 3px 3px', borderRadius: 14, background: tk.accentBg, color: tk.accent, fontWeight: 500 }}>
            <span style={{ position: 'relative', width: 22, height: 22, borderRadius: '50%', overflow: 'hidden' }}>
              <Image src={profilePhoto} alt="" fill sizes="22px" style={{ objectFit: 'cover' }} />
            </span>
            {ME.name}
          </span>
        </div>
        <label style={line}>
          <span style={{ color: tk.label2 }}>Subject:</span>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder={SUBJECT}
            style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 16, color: tk.label }} />
        </label>
        <label style={{ display: 'flex', padding: '12px 16px 0' }}>
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write your message" aria-label="Message"
            style={{ flex: 1, height: 110, border: 'none', outline: 'none', resize: 'none', background: 'transparent', fontSize: 16, lineHeight: 1.45, color: tk.label }} />
        </label>
        <div style={{ padding: '10px 12px 12px' }}>
          <button type="submit" style={{
            width: '100%', height: 46, borderRadius: 12, background: tk.select, color: '#fff', fontSize: 16, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: `0 8px 20px ${dark ? 'rgba(10,132,255,.3)' : 'rgba(0,98,204,.3)'}`,
          }}>
            <SendIcon s={17} />Send email
          </button>
        </div>
      </form>

      <div style={{ ...group(dark), marginTop: 16 }}>
        {contactDetails.map((c, i) => {
          const m = ROW_ICON[c.type];
          const last = i === contactDetails.length - 1;
          const label = c.type === 'Email' || c.type === 'Location' ? c.value : c.type;
          const inner = (
            <>
              <span style={{
                width: 30, height: 30, flexShrink: 0, borderRadius: 8, color: '#fff',
                background: dark && c.type === 'GitHub' ? '#3a3a3c' : m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{m.icon}</span>
              <span style={{
                flex: 1, minWidth: 0, minHeight: 50, display: 'flex', alignItems: 'center', gap: 10, paddingRight: 14,
                borderBottom: last ? 'none' : `1px solid ${tk.sep}`, fontSize: 15,
              }}>
                <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                {c.href.startsWith('http') && <span style={{ color: tk.label3, display: 'inline-flex' }}><ArrowUpRight s={12} /></span>}
                {c.type === 'Email' && (
                  <button onClick={copy} aria-label={copied ? 'Email copied' : 'Copy email address'} style={{
                    width: 30, height: 30, flexShrink: 0, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: dark ? '#2c2c2e' : '#f2f2f5', color: copied ? (dark ? '#4ade80' : '#166534') : tk.accent,
                  }}>
                    {copied ? <CheckIcon s={14} /> : <CopyIcon s={13} />}
                  </button>
                )}
              </span>
            </>
          );
          const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 14, color: tk.label };
          return c.href.startsWith('http')
            ? <a key={c.type} href={c.href} target="_blank" rel="noopener noreferrer" style={row}>{inner}</a>
            : <div key={c.type} style={row}>{inner}</div>;
        })}
      </div>

      <div style={{ ...group(dark), marginTop: 16 }}>
        <button onClick={requestResume} style={{ width: '100%', height: 50, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', fontSize: 15, color: tk.accent }}>
          <Download s={20} /><span style={{ flex: 1, textAlign: 'left' }}>Download resume</span>
          <span style={{ color: tk.label3, display: 'inline-flex' }}><ChevronRight s={14} /></span>
        </button>
      </div>
    </>
  );
}

function SkillsScreen({ dark }: { dark: boolean }) {
  const tk = T(dark);
  return (
    <>
      <div style={{ padding: '0 20px', fontSize: 15, color: tk.label2 }}>Core stack: {coreStack.map(c => c.name).join(', ')}</div>
      {Object.entries(skills).map(([cat, items]) => (
        <Fragment key={cat}>
          <div id={`m-${skillAnchor(cat)}`} style={{
            padding: '24px 20px 8px', display: 'flex', alignItems: 'center', gap: 10,
            scrollMarginTop: 'calc(44px + env(safe-area-inset-top, 0px))',
          }}>
            <CatIcon cat={cat} size={28} />
            <h3 style={{ fontSize: 17, fontWeight: 600 }}>{cat}</h3>
            <span style={{ marginLeft: 'auto', fontSize: 14, color: tk.label2 }}>{items.length}</span>
          </div>
          <div style={group(dark)}>
            {items.map((s, i) => (
              <div key={s} style={{
                minHeight: 46, marginLeft: 16, display: 'flex', alignItems: 'center', fontSize: 15,
                borderBottom: i < items.length - 1 ? `1px solid ${tk.sep}` : 'none',
              }}>{s}</div>
            ))}
          </div>
        </Fragment>
      ))}
    </>
  );
}
