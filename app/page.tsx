'use client';
import { useState, useEffect, useReducer, useCallback, useMemo, useRef } from 'react';
import MobileView    from '@/components/MobileView';
import Wallpaper     from '@/components/mac/Wallpaper';
import MenuBar       from '@/components/mac/MenuBar';
import WinShell      from '@/components/mac/WinShell';
import Dock          from '@/components/mac/Dock';
import NotifCard     from '@/components/mac/NotifCard';
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
      return s.map((w, i) => ({ ...w, isOpen: true, isMin: false, minning: false, z: ZZ + i + 1 }));
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

  // Detect mobile viewport
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

  // Open About Me centered on mount
  useEffect(() => {
    const t = setTimeout(() => {
      const ww = Math.min(560, window.innerWidth - 80);
      const wh = Math.min(630, window.innerHeight - 160);
      const cx = Math.max(40, Math.round((window.innerWidth  - ww) / 2));
      const cy = 28 + Math.max(8, Math.round((window.innerHeight - 28 - 100 - wh) / 2));
      dispatch({ type: 'OPEN_AT', id: 'about', x: cx, y: cy, w: ww, h: wh });
      setFocused('about');
    }, 420);
    return () => clearTimeout(t);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.shiftKey && e.key === 'o') { e.preventDefault(); dispatch({ type: 'OPEN_ALL' }); }
      if (e.shiftKey && e.key === 'w') { e.preventDefault(); dispatch({ type: 'CLOSE_ALL' }); }
      if (e.shiftKey && e.key === 'a') { e.preventDefault(); dispatch({ type: 'ARRANGE' }); }
      if (e.key === 'm') { e.preventDefault(); dispatch({ type: 'MIN_ALL' }); }
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

  if (isMobile) return <MobileView dark={dark} setDark={setDark} />;

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      {/* Wallpaper */}
      <Wallpaper dark={dark} />

      {/* Menu bar */}
      <MenuBar dark={dark} setDark={setDark} wins={wins} dispatch={dispatch} />

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
      </div>

      {/* Notification card */}
      <NotifCard dark={dark} />

      {/* Dock */}
      <Dock wins={wins} dark={dark} dispatch={dispatch} />
    </div>
  );
}
