'use client';
import { useState, useEffect, useReducer, useCallback, useMemo, useRef } from 'react';
import MobileView    from '@/components/MobileView';
import Wallpaper, { WALLPAPERS, type WallpaperVariant } from '@/components/mac/Wallpaper';
import MenuBar       from '@/components/mac/MenuBar';
import WinShell      from '@/components/mac/WinShell';
import Dock          from '@/components/mac/Dock';
import WelcomeToast  from '@/components/mac/WelcomeToast';
import Widgets       from '@/components/mac/Widgets';
import AboutWindow      from '@/components/mac/windows/AboutWindow';
import ProjectsWindow   from '@/components/mac/windows/ProjectsWindow';
import ExperienceWindow from '@/components/mac/windows/ExperienceWindow';
import SkillsWindow     from '@/components/mac/windows/SkillsWindow';
import ContactWindow    from '@/components/mac/windows/ContactWindow';
import type { Win, WinAction } from '@/components/mac/winTypes';

// ── Window definitions ────────────────────────────────────────────────────────
const WIN_DEFS = [
  { id: 'about',      title: 'About Me',   sz: { w: 560, h: 630 }, pos: { x: 60,  y: 52 } },
  { id: 'projects',   title: 'Projects',   sz: { w: 640, h: 580 }, pos: { x: 250, y: 44 } },
  { id: 'experience', title: 'Experience', sz: { w: 590, h: 560 }, pos: { x: 180, y: 64 } },
  { id: 'skills',     title: 'Skills',     sz: { w: 500, h: 520 }, pos: { x: 110, y: 74 } },
  { id: 'contact',    title: 'Contact',    sz: { w: 440, h: 460 }, pos: { x: 210, y: 84 } },
];

// Module-level z-index counter (intentionally outside React to avoid re-render issues)
let ZZ = 200;
const nz = () => ++ZZ;

function initWins(): Win[] {
  return WIN_DEFS.map(d => ({
    ...d,
    isOpen: false, isMin: false, isMax: false,
    defPos: { ...d.pos }, defSz: { ...d.sz },
    z: 10, minning: false, closing: false,
  }));
}

function winReducer(s: Win[], a: WinAction): Win[] {
  switch (a.type) {
    case 'OPEN':
      return s.map(w => w.id === a.id ? { ...w, isOpen: true, isMin: false, minning: false, closing: false, z: nz() } : w);
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
    case 'TOGGLE_MAX':
      return s.map(w => {
        if (w.id !== a.id) return w;
        return w.isMax
          ? { ...w, isMax: false, pos: { ...w.defPos }, sz: { ...w.defSz }, z: nz() }
          : { ...w, isMax: true, pos: { x: 0, y: 0 }, sz: { w: window.innerWidth, h: window.innerHeight - 108 }, z: nz() };
      });
    case 'FOCUS':
      return s.map(w => w.id === a.id ? { ...w, z: nz() } : w);
    case 'MOVE':
      return s.map(w => w.id === a.id ? { ...w, pos: { x: a.x, y: a.y } } : w);
    case 'RESIZE':
      return s.map(w => w.id === a.id ? { ...w, sz: { w: a.w, h: a.h } } : w);
    case 'OPEN_ALL':
      // Use nz() per window so the module-level counter advances past all assigned
      // z-values; otherwise the next FOCUS/OPEN sits *below* these and click-to-front breaks.
      return s.map(w => ({ ...w, isOpen: true, isMin: false, minning: false, z: nz() }));
    case 'CLOSE_ALL':
      return s.map(w => ({ ...w, isOpen: false, isMin: false, isMax: false, minning: false, closing: false }));
    case 'MIN_ALL':
      return s.map(w => w.isOpen && !w.isMin ? { ...w, isMin: true, minning: false } : w);
    case 'OPEN_AT': {
      const newSz = (a.w && a.h) ? { w: a.w, h: a.h } : s.find(w => w.id === a.id)!.sz;
      return s.map(w => w.id === a.id ? {
        ...w, isOpen: true, isMin: false, minning: false, closing: false, z: nz(),
        pos: { x: a.x, y: a.y }, sz: newSz, defPos: { x: a.x, y: a.y }, defSz: newSz,
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

// ── Desktop App ───────────────────────────────────────────────────────────────
export default function Home() {
  const [dark, setDark]       = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [wins, dispatch] = useReducer(winReducer, undefined, initWins);
  const [focused, setFocused] = useState<string | null>(null);
  const [calPop, setCalPop]   = useState(false);
  const [wallpaper, setWallpaper] = useState<WallpaperVariant>('mesh');

  // Restore + persist wallpaper choice
  useEffect(() => {
    const saved = localStorage.getItem('wallpaper');
    if (saved && WALLPAPERS.some(w => w.id === saved)) setWallpaper(saved as WallpaperVariant);
  }, []);
  useEffect(() => { localStorage.setItem('wallpaper', wallpaper); }, [wallpaper]);

  // Restore + persist dark mode (useEffect avoids SSR hydration mismatch).
  // First visit falls back to the visitor's system theme.
  useEffect(() => {
    const saved = localStorage.getItem('dark');
    if (saved !== null) setDark(saved === 'true');
    else setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);
  useEffect(() => { localStorage.setItem('dark', String(dark)); }, [dark]);

  // Detect mobile viewport (< 768 = phones; ≥ 768 = iPad / desktop — see macOS view with touch support)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const focus = useCallback((id: string) => {
    setFocused(id);
    dispatch({ type: 'FOCUS', id });
  }, []);

  // Calm opening: About plus Projects, side by side with a slight overlap,
  // so a visitor immediately sees who you are and what you've built without
  // the whole desktop erupting. Everything else stays a dock click away.
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => {
      const vw = window.innerWidth, vh = window.innerHeight;

      if (vw < 1150 || vh < 620) {
        const ww = Math.min(560, vw - 80);
        const wh = Math.min(630, vh - 160);
        const cx = Math.max(40, Math.round((vw - ww) / 2));
        const cy = 28 + Math.max(8, Math.round((vh - 28 - 100 - wh) / 2));
        dispatch({ type: 'OPEN_AT', id: 'about', x: cx, y: cy, w: ww, h: wh });
        setFocused('about');
        return;
      }

      const zone = vw - 236;   // keep the widgets column clear
      const aw = Math.min(540, zone - 120), ah = Math.min(600, vh - 170);
      const pw = Math.min(620, zone - 120), ph = Math.min(560, vh - 200);
      const ax = 40, ay = 48;
      const px = Math.max(ax + 150, zone - pw);
      const py = Math.min(ay + 34, Math.max(40, vh - ph - 100));

      dispatch({ type: 'OPEN_AT', id: 'projects', x: px, y: py, w: pw, h: ph });
      setFocused('projects');
      timers.push(setTimeout(() => {
        dispatch({ type: 'OPEN_AT', id: 'about', x: ax, y: ay, w: aw, h: ah });
        setFocused('about');
      }, 200));
    }, 420));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Keyboard shortcuts. Only shift-chords the browser doesn't reserve —
  // ⌘W/⌘⇧W/⌘M/⌘Q belong to the browser and must never be intercepted.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || !e.shiftKey) return;
      // Normalize: with Shift held, e.key is uppercase ('O'/'A'), so compare lowercased
      const k = e.key.toLowerCase();
      if (k === 'o') { e.preventDefault(); dispatch({ type: 'OPEN_ALL' }); }
      if (k === 'a') { e.preventDefault(); dispatch({ type: 'ARRANGE' }); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Memoize window content so it doesn't re-mount on every dark-mode toggle
  const CONTENT = useMemo(() => ({
    about:      <AboutWindow      dark={dark} />,
    projects:   <ProjectsWindow   dark={dark} />,
    experience: <ExperienceWindow dark={dark} />,
    skills:     <SkillsWindow     dark={dark} />,
    contact:    <ContactWindow    dark={dark} />,
  }), [dark]);

  // Dark mode transition: add class briefly on toggle
  const toggleDark = useCallback((v: boolean | ((prev: boolean) => boolean)) => {
    document.documentElement.classList.add('theme-transition');
    setDark(v);
    setTimeout(() => document.documentElement.classList.remove('theme-transition'), 350);
  }, []);

  if (isMobile) return <MobileView dark={dark} setDark={(v: boolean) => toggleDark(v)} />;

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      {/* Wallpaper with intro fade */}
      <div style={{ animation: 'introFade .8s ease both' }}>
        <Wallpaper dark={dark} variant={wallpaper} />
      </div>

      {/* Menu bar */}
      <MenuBar
        dark={dark} setDark={toggleDark} wins={wins} dispatch={dispatch}
        calPop={calPop} setCalPop={setCalPop}
        wallpaper={wallpaper} setWallpaper={setWallpaper}
      />

      {/* Desktop canvas */}
      <div
        onClick={() => setFocused(null)}
        style={{ position: 'fixed', top: 28, left: 0, right: 0, bottom: 80, zIndex: 1 }}
      >
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

        {/* Desktop widgets */}
        <Widgets dark={dark} dispatch={dispatch} openCal={() => setCalPop(true)} />
      </div>

      {/* Dock */}
      <Dock wins={wins} dark={dark} dispatch={dispatch} />

      {/* First-visit welcome tooltip */}
      <WelcomeToast dark={dark} />
    </div>
  );
}
