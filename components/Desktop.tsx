'use client';
import { useState, useEffect, useReducer, useCallback, useMemo, useSyncExternalStore } from 'react';
import dynamic       from 'next/dynamic';
import MobileView    from '@/components/MobileView';
import { WALLPAPERS, type WallpaperVariant } from '@/components/mac/wallpaperList';
import MenuBar       from '@/components/mac/MenuBar';
import WinShell      from '@/components/mac/WinShell';
import Dock          from '@/components/mac/Dock';
import WelcomeToast  from '@/components/mac/WelcomeToast';
import DesktopPhotos from '@/components/mac/DesktopPhotos';
import ResumeDialog  from '@/components/mac/ResumeDialog';
import AboutWindow      from '@/components/mac/windows/AboutWindow';
import ProjectsWindow   from '@/components/mac/windows/ProjectsWindow';
import ExperienceWindow from '@/components/mac/windows/ExperienceWindow';
import SkillsWindow     from '@/components/mac/windows/SkillsWindow';
import ContactWindow    from '@/components/mac/windows/ContactWindow';
import { ABOUT_W, type Win, type WinAction } from '@/components/mac/winTypes';

// Desktop-only chunks
const Wallpaper   = dynamic(() => import('@/components/mac/Wallpaper'), { ssr: false });
const BubbleField = dynamic(() => import('@/components/mac/Wallpaper').then(m => m.BubbleField), { ssr: false });
const Widgets       = dynamic(() => import('@/components/mac/Widgets'), { ssr: false });
const PhotosWindow  = dynamic(() => import('@/components/mac/Widgets').then(m => m.PhotosWindow), { ssr: false });
const WeatherWindow = dynamic(() => import('@/components/mac/Widgets').then(m => m.WeatherWindow), { ssr: false });

// pos: first-open offset from the center of the free desktop area
const WIN_DEFS = [
  { id: 'about',      title: 'About Me',   sz: { w: ABOUT_W, h: 700 }, pos: { x: 0,  y: 0 },  minSz: { w: 420, h: 420 } },
  { id: 'projects',   title: 'Projects',   sz: { w: 980, h: 660 },     pos: { x: -24, y: -12 }, minSz: { w: 620, h: 440 } },
  { id: 'experience', title: 'Experience', sz: { w: 980, h: 620 },     pos: { x: 0,  y: 6 },  minSz: { w: 640, h: 440 } },
  { id: 'skills',     title: 'Skills',     sz: { w: 860, h: 580 },     pos: { x: 24, y: 18 }, minSz: { w: 600, h: 420 } },
  { id: 'contact',    title: 'Contact',    sz: { w: 880, h: 600 },     pos: { x: 48, y: 30 }, minSz: { w: 640, h: 460 } },
  { id: 'photos',     title: 'Photos',     sz: { w: 960, h: 640 },     pos: { x: -12, y: -6 }, minSz: { w: 520, h: 400 } },
  { id: 'weather',    title: 'Weather',    sz: { w: 700, h: 660 },     pos: { x: 12, y: -6 },  minSz: { w: 420, h: 440 } },
];

let ZZ = 200;
const nz = () => ++ZZ;

// Read synchronously on client mounts so back-navigation doesn't flash the desktop
const subscribeResize = (cb: () => void) => {
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
};
// Phones: smallest physical screen side under 500px. Otherwise mobile below
// 768px wide and desktop above 820px, so resizing near the edge doesn't flip.
let mobileLatch = false;
const isMobileSnapshot = () => {
  const phone = Math.min(window.screen.width, window.screen.height) < 500;
  const w = window.innerWidth;
  if (mobileLatch) {
    if (w >= 820 && !phone) mobileLatch = false;
  } else {
    if (w < 768 || phone) mobileLatch = true;
  }
  return mobileLatch;
};
// iPad portrait: no room for the widgets column
const isCompactSnapshot = () => window.innerWidth < 1000;
// Room for pinned polaroids left of the centered About window
const isWideSnapshot = () => window.innerWidth >= 1260;
const serverSnapshot = () => false;
// Unknown on the server: both layouts render and CSS picks one
const unknownSnapshot = () => null;

function initWins(): Win[] {
  return WIN_DEFS.map(d => ({
    ...d,
    isOpen: false, isMin: false, isMax: false,
    defPos: { ...d.pos }, defSz: { ...d.sz },
    z: 10, minning: false, closing: false,
  }));
}

// Keep windows inside the canvas; first open centers left of the widgets
function fitToViewport(w: Win): Pick<Win, 'pos' | 'sz' | 'defPos' | 'defSz' | 'placed'> {
  const vw = window.innerWidth;
  const maxW = vw - 24;
  const maxH = window.innerHeight - 28 - 110;
  const sz  = { w: Math.min(w.sz.w, maxW), h: Math.min(w.sz.h, maxH) };
  let { x, y } = w.pos;
  const first = !w.placed;
  if (first) {
    const zone = vw >= 1000 ? vw - 200 : vw;
    x = Math.round((zone - sz.w) / 2) + w.pos.x;
    y = Math.round((maxH - sz.h) / 2) + w.pos.y;
  }
  const pos = {
    x: Math.max(0, Math.min(x, vw - sz.w - 12)),
    y: Math.max(0, Math.min(y, maxH - sz.h)),
  };
  return first
    ? { pos, sz, defPos: pos, defSz: sz, placed: true }
    : { pos, sz, defPos: w.defPos, defSz: w.defSz, placed: true };
}

function winReducer(s: Win[], a: WinAction): Win[] {
  switch (a.type) {
    case 'OPEN':
      return s.map(w => w.id === a.id
        ? { ...w, ...(w.isOpen ? {} : fitToViewport(w)), isOpen: true, isMin: false, minning: false, closing: false, z: nz() }
        : w);
    case 'CLOSE':
      return s.map(w => w.id === a.id ? { ...w, isOpen: false, isMin: false, isMax: false, minning: false, closing: false } : w);
    case 'CLOSE_START':
      return s.map(w => w.id === a.id ? { ...w, closing: true } : w);
    case 'MIN_START':
      return s.map(w => w.id === a.id ? { ...w, minning: true } : w);
    case 'MIN_DONE':
      return s.map(w => w.id === a.id ? { ...w, isMin: true, minning: false } : w);
    case 'RESTORE':
      return s.map(w => w.id === a.id ? { ...w, isMin: false, minning: false, z: nz() } : w);
    // pos and sz are kept so unzooming restores them
    case 'TOGGLE_MAX':
      return s.map(w => w.id === a.id ? { ...w, isMax: !w.isMax, z: nz() } : w);
    case 'UNZOOM_AT':
      return s.map(w => w.id === a.id ? { ...w, isMax: false, pos: { x: a.x, y: a.y }, z: nz() } : w);
    case 'FOCUS':
      return s.map(w => w.id === a.id ? { ...w, z: nz() } : w);
    case 'MOVE':
      return s.map(w => w.id === a.id ? { ...w, pos: { x: a.x, y: a.y } } : w);
    case 'RESIZE':
      return s.map(w => w.id === a.id ? { ...w, sz: { w: a.w, h: a.h } } : w);
    case 'OPEN_ALL':
      // nz() per window so the counter ends above all of them
      return s.map(w => ({ ...w, ...(w.isOpen ? {} : fitToViewport(w)), isOpen: true, isMin: false, minning: false, z: nz() }));
    case 'CLOSE_ALL':
      return s.map(w => ({ ...w, isOpen: false, isMin: false, isMax: false, minning: false, closing: false }));
    case 'MIN_ALL':
      return s.map(w => w.isOpen && !w.isMin ? { ...w, isMin: true, minning: false } : w);
    case 'OPEN_AT': {
      const newSz = (a.w && a.h) ? { w: a.w, h: a.h } : s.find(w => w.id === a.id)!.sz;
      return s.map(w => w.id === a.id ? {
        ...w, isOpen: true, isMin: false, minning: false, closing: false, z: nz(),
        pos: { x: a.x, y: a.y }, sz: newSz, defPos: { x: a.x, y: a.y }, defSz: newSz, placed: true,
      } : w);
    }
    case 'ARRANGE': {
      const open = s.filter(w => w.isOpen && !w.isMin);
      const cols = Math.ceil(Math.sqrt(open.length));
      const rows = Math.ceil(open.length / cols);
      const cW = Math.floor((window.innerWidth - 32) / cols);
      const rH = Math.floor((window.innerHeight - 140) / rows);
      return s.map(w => {
        const i = open.findIndex(o => o.id === w.id);
        if (i < 0) return w;
        return { ...w, isMax: false, pos: { x: 16 + (i % cols) * cW, y: 20 + Math.floor(i / cols) * rH }, sz: { w: cW - 10, h: rH - 10 } };
      });
    }
    default:
      return s;
  }
}

export default function Desktop() {
  const [dark, setDark]       = useState(false);
  const isMobile  = useSyncExternalStore<boolean | null>(subscribeResize, isMobileSnapshot, unknownSnapshot);
  const isCompact = useSyncExternalStore(subscribeResize, isCompactSnapshot, serverSnapshot);
  const isWide    = useSyncExternalStore(subscribeResize, isWideSnapshot,    serverSnapshot);
  const [wins, dispatch] = useReducer(winReducer, undefined, initWins);
  const [focused, setFocused] = useState<string | null>(null);
  const [calPop, setCalPop]   = useState(false);
  const [wallpaper, setWallpaper] = useState<WallpaperVariant>(WALLPAPERS[0].id);
  // Don't save until the stored values have been read
  const [prefsReady, setPrefsReady] = useState(false);

  // Restore saved settings, falling back to the system theme
  useEffect(() => {
    const wp = localStorage.getItem('wallpaper');
    if (wp && WALLPAPERS.some(w => w.id === wp)) setWallpaper(wp as WallpaperVariant);
    const d = localStorage.getItem('dark');
    if (d !== null) setDark(d === 'true');
    else setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    setPrefsReady(true);
  }, []);
  useEffect(() => { if (prefsReady) localStorage.setItem('wallpaper', wallpaper); }, [wallpaper, prefsReady]);
  useEffect(() => { if (prefsReady) localStorage.setItem('dark', String(dark)); }, [dark, prefsReady]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);

  const focus = useCallback((id: string) => {
    setFocused(id);
    dispatch({ type: 'FOCUS', id });
  }, []);

  // Focus follows the frontmost visible window
  const top = wins.reduce<Win | null>(
    (a, w) => (w.isOpen && !w.isMin && !w.closing && (!a || w.z > a.z) ? w : a), null);
  const topId = top?.id ?? null;
  const topZ  = top?.z ?? 0;
  useEffect(() => { if (topId) setFocused(topId); }, [topId, topZ]);

  const openWin = useCallback((id: string) => {
    dispatch({ type: 'OPEN', id });
    setFocused(id);
  }, []);

  // Open About on first load
  useEffect(() => {
    const t = setTimeout(() => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const zone = vw >= 1000 ? vw - 200 : vw;   // stay clear of the widgets column
      const ww = Math.min(ABOUT_W, vw - 80);
      const wh = Math.min(700, vh - 150);
      const cx = Math.max(40, Math.round((zone - ww) / 2));
      // The canvas starts 28px down, under the menu bar
      const cy = Math.max(8, Math.round((vh - 28 - 100 - wh) / 2));
      dispatch({ type: 'OPEN_AT', id: 'about', x: cx, y: cy, w: ww, h: wh });
      setFocused('about');
    }, 220);
    return () => clearTimeout(t);
  }, []);

  // Shift chords only; ⌘W, ⌘M and ⌘Q belong to the browser
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || !e.shiftKey) return;
      // e.key is uppercase with Shift held
      const k = e.key.toLowerCase();
      if (k === 'o') { e.preventDefault(); dispatch({ type: 'OPEN_ALL' }); }
      if (k === 'a') { e.preventDefault(); dispatch({ type: 'ARRANGE' }); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Memoized so a theme change doesn't remount window content
  const CONTENT = useMemo(() => ({
    about:      <AboutWindow      dark={dark} onOpen={openWin} />,
    projects:   <ProjectsWindow   dark={dark} />,
    experience: <ExperienceWindow dark={dark} />,
    skills:     <SkillsWindow     dark={dark} />,
    contact:    <ContactWindow    dark={dark} />,
    photos:     <PhotosWindow     dark={dark} onOpen={openWin} />,
    weather:    <WeatherWindow />,
  }), [dark, openWin]);

  const toggleDark = useCallback((v: boolean | ((prev: boolean) => boolean)) => {
    document.documentElement.classList.add('theme-transition');
    setDark(v);
    setTimeout(() => document.documentElement.classList.remove('theme-transition'), 350);
  }, []);

  const desktop = (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      {/* Desktop only; phones never load the wallpaper */}
      {isMobile === false && <Wallpaper dark={dark} variant={wallpaper} />}

      <MenuBar
        dark={dark} setDark={toggleDark} wins={wins} dispatch={dispatch}
        calPop={calPop} setCalPop={setCalPop}
        wallpaper={wallpaper} setWallpaper={setWallpaper}
      />

      <div
        // Clicks inside windows bubble here too; only empty desktop clears focus
        data-desktop=""
        onClick={e => { if (e.target === e.currentTarget) setFocused(null); }}
        style={{ position: 'fixed', top: 28, left: 0, right: 0, bottom: 80, zIndex: 1 }}
      >
        {wallpaper === 'bubbles' && <BubbleField dark={dark} />}

        {isWide && <DesktopPhotos dark={dark} />}

        {wins.map(win => (
          <WinShell
            key={win.id}
            win={win}
            dark={dark}
            dispatch={dispatch}
            focused={focused === win.id}
            onFocus={focus}
          >
            {CONTENT[win.id as keyof typeof CONTENT]}
          </WinShell>
        ))}

        {/* Hidden on compact widths; desktop only */}
        {!isCompact && isMobile === false && <Widgets
          dark={dark}
          openCal={() => setCalPop(true)}
          onOpen={(id: string) => {
            const w = wins.find(x => x.id === id);
            if (w?.isMin) dispatch({ type: 'RESTORE', id });
            else dispatch({ type: 'OPEN', id });
            focus(id);
          }}
        />}
      </div>

      <Dock wins={wins} dark={dark} dispatch={dispatch} />

      <WelcomeToast dark={dark} />

      <ResumeDialog dark={dark} />
    </div>
  );

  // The wrappers keep their slots so the chosen layout isn't remounted
  const pending = isMobile === null;
  return (
    <>
      {isMobile !== false && (
        <div className={pending ? 'ssr-mobile' : undefined}>
          <MobileView dark={dark} setDark={(v: boolean) => toggleDark(v)} />
        </div>
      )}
      {isMobile !== true && (
        <div className={pending ? 'ssr-desktop' : undefined}>
          {desktop}
        </div>
      )}
    </>
  );
}
