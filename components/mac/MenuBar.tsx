'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { T } from './tokens';
import Image from 'next/image';
import { ME, projects, skills, resumeFile } from '@/constants';
import { requestProjectDetail } from './windows/ProjectsWindow';
import { requestResume } from './ResumeDialog';
import { GitHubIcon, LinkedInIcon, MoonIcon as MoonLine } from './Icons';
import { WALLPAPERS, type WallpaperVariant } from './wallpaperList';
import type { Win, WinAction } from './winTypes';
import { copyText } from '@/components/copyText';
import { Link, useNavigate } from '@/components/nav';

const WIN_TITLES: Record<string, string> = {
  about: 'About Me', projects: 'Projects',
  experience: 'Experience', skills: 'Skills', contact: 'Contact', photos: 'Photos', weather: 'Weather',
};

// Status icons
function WifiIcon({ c }: { c: string }) {
  return (
    <svg width="17" height="13" viewBox="0 0 20 15" fill={c}>
      <circle cx="10" cy="13.5" r="1.6" />
      <path d="M6.7 10.2a4.8 4.8 0 016.6 0l1.35-1.35a6.85 6.85 0 00-9.3 0z" opacity=".78" />
      <path d="M3.3 6.9a9.5 9.5 0 0113.4 0l1.35-1.35a11.5 11.5 0 00-16.1 0z" opacity=".44" />
    </svg>
  );
}

function BatteryIcon({ c }: { c: string }) {
  return (
    <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
      <rect x=".75" y=".75" width="21" height="11.5" rx="2.5" stroke={c} strokeWidth="1.2" />
      <rect x="22" y="3.8" width="3" height="5.4" rx="1.2" fill={c} opacity=".55" />
      <rect x="2.2" y="2.2" width="16" height="8.6" rx="1.5" fill="rgba(52,199,89,.92)" />
    </svg>
  );
}

function SunIcon({ c }: { c: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="2"    x2="12" y2="4.5"  />
      <line x1="12" y1="19.5" x2="12" y2="22"   />
      <line x1="2"  y1="12"   x2="4.5" y2="12"  />
      <line x1="19.5" y1="12" x2="22" y2="12"   />
      <line x1="4.9"  y1="4.9"  x2="6.6"  y2="6.6"  />
      <line x1="17.4" y1="17.4" x2="19.1" y2="19.1" />
      <line x1="4.9"  y1="19.1" x2="6.6"  y2="17.4" />
      <line x1="17.4" y1="6.6"  x2="19.1" y2="4.9"  />
    </svg>
  );
}

function MoonIcon({ c }: { c: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function FullscreenEnterIcon({ c }: { c: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="2" strokeLinecap="round">
      <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
    </svg>
  );
}

function FullscreenExitIcon({ c }: { c: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="2" strokeLinecap="round">
      <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
    </svg>
  );
}

// Spotlight result icons
type Glyph = 'about' | 'projects' | 'experience' | 'skills' | 'contact' | 'photos' | 'weather' | 'email'
  | 'github' | 'linkedin' | 'resume' | 'skill' | 'spark' | 'cup' | 'send' | 'moon' | 'grid';

const GLYPHS: Record<Glyph, React.ReactNode> = {
  about:      <><circle cx="8" cy="5.4" r="2.6" /><path d="M3 14c.6-2.8 2.6-4.2 5-4.2s4.4 1.4 5 4.2" /></>,
  projects:   <path d="M2 4.5c0-.6.4-1 1-1h3.2l1.3 1.4H13c.6 0 1 .4 1 1V12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1z" />,
  experience: <><rect x="2" y="5" width="12" height="8.5" rx="1.5" /><path d="M5.8 5V3.6c0-.4.3-.8.8-.8h2.8c.5 0 .8.4.8.8V5M2 9h12" /></>,
  skills:     <><rect x="2" y="3" width="12" height="10" rx="1.6" /><path d="m4.8 6.6 2 1.6-2 1.6M8.6 10.4h2.8" /></>,
  contact:    <><rect x="2" y="3.6" width="12" height="8.8" rx="1.5" /><path d="m2.6 4.6 5.4 4 5.4-4" /></>,
  photos:     <><rect x="2" y="3" width="12" height="10" rx="1.6" /><path d="m2.6 11.2 3.2-3.2 2.6 2.6 1.8-1.8 3.2 3.2" /><circle cx="10.4" cy="6" r="1" /></>,
  weather:    <><circle cx="6" cy="6" r="2.4" /><path d="M6 1.6v.9M1.6 6h.9M2.9 2.9l.6.6M9.1 2.9l-.6.6" /><path d="M5.5 13.5h6.2a2.4 2.4 0 0 0 .2-4.8 3.4 3.4 0 0 0-6.5.9 2 2 0 0 0 .1 3.9z" /></>,
  email:      <><circle cx="8" cy="8" r="2.4" /><path d="M10.4 8v.9c0 1 .7 1.6 1.5 1.6s1.6-.7 1.6-2.3A5.5 5.5 0 1 0 11 12.6" /></>,
  github:     null,
  linkedin:   null,
  resume:     <><path d="M4 2h5.2L12 4.8V14H4z" /><path d="M9 2v3h3M6 8h4M6 10.6h4" /></>,
  skill:      <path d="M5.8 4.6 2.6 8l3.2 3.4M10.2 4.6 13.4 8l-3.2 3.4" />,
  spark:      <path d="M8 2.5 9.2 6.8 13.5 8 9.2 9.2 8 13.5 6.8 9.2 2.5 8l4.3-1.2z" />,
  cup:        <path d="M3 5.5h8v4.2A3 3 0 0 1 8 12.7H6a3 3 0 0 1-3-3zM11 6.5h.8a1.6 1.6 0 0 1 0 3.2H11M5 2.5v1.3M7.6 2.5v1.3" />,
  send:       <path d="M13.5 2.5 2.5 7.2l4.4 1.9 1.9 4.4zM6.9 9.1l3.3-3.3" />,
  moon:       null,
  grid:       <><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="9" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="2.5" y="9" width="4.5" height="4.5" rx="1" /><rect x="9" y="9" width="4.5" height="4.5" rx="1" /></>,
};

function SpotGlyph({ glyph, img, sel, dark }: { glyph: Glyph; img?: string; sel: boolean; dark: boolean }) {
  const tk = T(dark);
  const brand = glyph === 'github' ? <GitHubIcon s={15} /> : glyph === 'linkedin' ? <LinkedInIcon s={14} /> : glyph === 'moon' ? <MoonLine s={15} /> : null;
  return (
    <span style={{
      position: 'relative', width: 30, height: 30, borderRadius: 8, flexShrink: 0, overflow: 'hidden',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: sel ? 'rgba(255,255,255,.20)' : tk.pillBg,
      border: `1px solid ${sel ? 'rgba(255,255,255,.22)' : tk.pillBorder}`,
      color: sel ? '#fff' : tk.textSub,
    }}>
      {img
        ? <Image src={img} alt="" fill sizes="30px" style={{ objectFit: 'cover', objectPosition: 'top' }} />
        : brand ?? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
            strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {GLYPHS[glyph]}
          </svg>
        )}
    </span>
  );
}

interface Props {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
  wins: Win[];
  dispatch: React.Dispatch<WinAction>;
  calPop: boolean;
  setCalPop: React.Dispatch<React.SetStateAction<boolean>>;
  wallpaper: WallpaperVariant;
  setWallpaper: (w: WallpaperVariant) => void;
}

interface MenuItem {
  label?: string;
  div?: boolean;
  action?: () => void;
  disabled?: boolean;
  shortcut?: string;
  icon?: React.ReactNode;
}

export default function MenuBar({ dark, setDark, wins, dispatch, calPop, setCalPop, wallpaper, setWallpaper }: Props) {
  const tk = T(dark);
  const go = useNavigate();
  const [clock, setClock]         = useState('');
  const [active, setActive]       = useState<string | null>(null);
  const [toast, setToast]         = useState<string | null>(null);
  const [spotlight, setSpotlight]   = useState(false);
  const [spotQ, setSpotQ]           = useState('');
  const [spotSel, setSpotSel]       = useState(0);
  const [isFS, setIsFS]             = useState(false);
  const [wifiPop, setWifiPop]       = useState(false);
  const [batPop, setBatPop]         = useState(false);
  const [calView, setCalView]       = useState(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });

  // Reset to the current month on open
  useEffect(() => {
    if (calPop) {
      const n = new Date();
      setCalView({ year: n.getFullYear(), month: n.getMonth() });
    }
  }, [calPop]);

  // ⌘K and ⌘F open Spotlight (⌃⌘F is left for Full Screen)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const k = e.key.toLowerCase();
      if (k === 'k' || (k === 'f' && !(e.metaKey && e.ctrlKey))) {
        e.preventDefault();
        setSpotlight(s => !s);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Search index
  type SpotItem = {
    category: string; label: string; desc: string; glyph: Glyph;
    img?: string; keywords?: string; action: () => void;
  };
  const done = () => { setSpotlight(false); setSpotQ(''); };
  const openWin = (id: string) => () => { dispatch({ type: 'OPEN', id }); done(); };
  const downloadResume = () => { done(); requestResume(); };

  const resumeItem: SpotItem = { category: 'Files', label: 'Resume', desc: `Download ${resumeFile.filename}`, glyph: 'resume', keywords: 'cv pdf download', action: downloadResume };
  const winItems: SpotItem[] = [
    { category: 'Windows', label: 'About Me',   desc: 'Bio, photos, links', glyph: 'about',      action: openWin('about') },
    { category: 'Windows', label: 'Projects',   desc: 'Shipped work',       glyph: 'projects',   action: openWin('projects') },
    { category: 'Windows', label: 'Experience', desc: 'Work history',       glyph: 'experience', action: openWin('experience') },
    { category: 'Windows', label: 'Skills',     desc: 'Tech stack',         glyph: 'skills',     action: openWin('skills') },
    { category: 'Windows', label: 'Contact',    desc: 'Get in touch',       glyph: 'contact',    action: openWin('contact') },
    { category: 'Windows', label: 'Photos',     desc: 'Project screenshots', glyph: 'photos',    keywords: 'screenshots pictures gallery', action: openWin('photos') },
    { category: 'Windows', label: 'Weather',    desc: 'Ocala forecast',      glyph: 'weather',   keywords: 'temperature forecast rain', action: openWin('weather') },
  ];
  const projectItems: SpotItem[] = projects.map(p => ({
    category: 'Projects', label: p.title, desc: p.tagline, glyph: 'projects' as Glyph, img: p.image ?? undefined,
    keywords: p.techStack,
    action: () => { requestProjectDetail(p.title); dispatch({ type: 'OPEN', id: 'projects' }); done(); },
  }));

  const searchItems: SpotItem[] = [
    resumeItem,
    ...winItems,
    ...projectItems,
    ...Object.entries(skills).flatMap(([cat, items]) =>
      items.map(s => ({ category: 'Skills', label: s, desc: cat, glyph: 'skill' as Glyph, action: openWin('skills') }))
    ),
    { category: 'Links', label: 'GitHub',   desc: ME.github,   glyph: 'github',   action: () => window.open(ME.github,  '_blank') },
    { category: 'Links', label: 'LinkedIn', desc: ME.linkedin, glyph: 'linkedin', action: () => window.open(ME.linkedin, '_blank') },
    { category: 'Links', label: 'Email',    desc: ME.email,    glyph: 'email',    action: () => window.open(`mailto:${ME.email}`) },
    // Easter eggs
    { category: 'Secret', label: 'Hello!',     desc: 'You found a secret! Thanks for exploring ✨',     glyph: 'spark', action: () => { showToast('🎉 You found an easter egg!'); done(); } },
    { category: 'Secret', label: 'Coffee',     desc: 'Fueled by coffee and curiosity ☕',               glyph: 'cup',   action: () => { showToast('☕ Cheers!'); done(); } },
    { category: 'Secret', label: 'Hire Me',    desc: 'I\'d love to work with you!',                     glyph: 'send',  action: openWin('contact') },
    { category: 'Secret', label: 'Dark Mode',  desc: 'Toggle the lights',                               glyph: 'moon',  action: () => { setDark(d => !d); done(); } },
    { category: 'Secret', label: 'Open All',   desc: 'Show everything at once',                         glyph: 'grid',  action: () => { dispatch({ type: 'OPEN_ALL' }); done(); } },
  ];

  // Shown before typing
  const suggestions: SpotItem[] = [
    { ...resumeItem, category: 'Suggested' },
    { ...winItems[1], category: 'Suggested' },
    { ...winItems[4], category: 'Suggested' },
    ...projectItems,
  ];

  const q = spotQ.trim().toLowerCase();
  const matches = searchItems.filter(it =>
    it.label.toLowerCase().includes(q) ||
    it.desc.toLowerCase().includes(q) ||
    it.category.toLowerCase().includes(q) ||
    (it.keywords ?? '').toLowerCase().includes(q)
  );
  // Name matches first, grouped by category in order of best match
  const rank = (it: SpotItem) => {
    const l = it.label.toLowerCase();
    return l.startsWith(q) ? 0 : l.includes(q) ? 1 : 2;
  };
  const best = new Map<string, number>();
  matches.forEach(it => best.set(it.category, Math.min(best.get(it.category) ?? 2, rank(it))));
  const catAt = Array.from(best.keys());
  const spotResults = q
    ? [...matches].sort((a, b) =>
        best.get(a.category)! - best.get(b.category)! ||
        catAt.indexOf(a.category) - catAt.indexOf(b.category) ||
        rank(a) - rank(b))
    : suggestions;

  // Clock
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const mons = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      setClock(`${days[n.getDay()]} ${mons[n.getMonth()]} ${n.getDate()}  ${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = () => setIsFS(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    if (!active && !wifiPop && !batPop && !calPop) return;
    const handler = (e: Event) => {
      const bar = document.querySelector('.mac-menubar');
      if (bar && !bar.contains(e.target as Node)) {
        setActive(null);
        setWifiPop(false);
        setBatPop(false);
        setCalPop(false);
      }
    };
    document.addEventListener('mousedown', handler, true);
    document.addEventListener('touchstart', handler, true);
    return () => {
      document.removeEventListener('mousedown', handler, true);
      document.removeEventListener('touchstart', handler, true);
    };
  }, [active, wifiPop, batPop, calPop]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const copy = (txt: string, lbl: string) =>
    copyText(txt).then(ok => { if (ok) showToast(`✓ ${lbl} copied`); });
  const close = () => { setActive(null); setWifiPop(false); setBatPop(false); setCalPop(false); };

  // Edit menu shortcuts (only ones browsers don't reserve)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || !e.shiftKey) return;
      const k = e.key.toLowerCase();
      if (k === 'e') { e.preventDefault(); copy(ME.email,    'Email'); }
      if (k === 'g') { e.preventDefault(); copy(ME.github,   'GitHub URL'); }
      if (k === 'l') { e.preventDefault(); copy(ME.linkedin, 'LinkedIn URL'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFS = () => {
    if (isFS) { document.exitFullscreen?.(); }
    else      { document.documentElement.requestFullscreen?.(); }
    close();
  };

  const openWins = wins.filter(w => w.isOpen && !w.isMin);

  const MENUS: { id: string; label: string; bold?: boolean; items: MenuItem[] }[] = [
    {
      id: 'apple', label: '⌘', items: [
        { label: 'About This Portfolio', action: () => showToast(`macOS-style Portfolio · Tomy F. Romero · ${new Date().getFullYear()}`) },
        { div: true },
        { label: dark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
          action: () => { setDark(d => !d); close(); } },
        { div: true },
        { label: 'Wallpaper', disabled: true },
        ...WALLPAPERS.map(w => ({
          label: `${wallpaper === w.id ? '✓' : ' '} ${w.label}`,
          action: () => { setWallpaper(w.id); close(); },
        })),
        { div: true },
        { label: 'System Preferences…', disabled: true },
        { div: true },
        { label: 'Sleep',      disabled: true },
        { label: 'Restart…',   disabled: true },
        { label: 'Shut Down…', disabled: true },
      ],
    },
    {
      id: 'tomy', label: 'Tomy', bold: true, items: [
        { label: 'About Tomy F. Romero',
          action: () => { close(); dispatch({ type: 'OPEN', id: 'about' }); } },
        { div: true },
        { label: 'Print / Save as PDF', shortcut: '⌘P', action: () => { close(); window.print(); } },
        { div: true },
        { label: '✓ Open to Opportunities', disabled: true },
        { div: true },
        { label: 'Hide All Windows',
          action: () => { close(); dispatch({ type: 'MIN_ALL' }); } },
        { label: 'Quit',
          action: () => { close(); dispatch({ type: 'CLOSE_ALL' }); } },
      ],
    },
    {
      id: 'file', label: 'File', items: [
        { label: 'Open About…',
          action: () => { close(); dispatch({ type: 'OPEN', id: 'about' }); } },
        { label: 'Open Projects…',
          action: () => { close(); dispatch({ type: 'OPEN', id: 'projects' }); } },
        { label: 'Open Experience…',
          action: () => { close(); dispatch({ type: 'OPEN', id: 'experience' }); } },
        { label: 'Open Skills…',
          action: () => { close(); dispatch({ type: 'OPEN', id: 'skills' }); } },
        { label: 'Open Contact…',
          action: () => { close(); dispatch({ type: 'OPEN', id: 'contact' }); } },
        { div: true },
        { label: 'Print Portfolio',  shortcut: '⌘P',
          action: () => { close(); window.print(); } },
        { div: true },
        { label: 'Close All Windows',
          action: () => { close(); dispatch({ type: 'CLOSE_ALL' }); } },
      ],
    },
    {
      id: 'edit', label: 'Edit', items: [
        { label: 'Copy Email Address', shortcut: '⌘⇧E',
          action: () => copy(ME.email, 'Email') },
        { label: 'Copy GitHub URL',    shortcut: '⌘⇧G',
          action: () => copy(ME.github, 'GitHub URL') },
        { label: 'Copy LinkedIn URL',  shortcut: '⌘⇧L',
          action: () => copy(ME.linkedin, 'LinkedIn URL') },
        { div: true },
        { label: 'Spotlight Search',   shortcut: '⌘K',
          action: () => { setSpotlight(true); close(); } },
      ],
    },
    {
      id: 'view', label: 'View', items: [
        { label: dark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
          action: () => { setDark(d => !d); close(); } },
        { label: 'Classic View',
          action: () => { close(); go('/classic'); } },
        { div: true },
        { label: isFS ? 'Exit Full Screen' : 'Enter Full Screen',
          shortcut: '⌃⌘F', action: toggleFS },
      ],
    },
    {
      id: 'window', label: 'Window', items: [
        { label: 'Minimize All',
          action: () => { close(); dispatch({ type: 'MIN_ALL' }); } },
        { label: 'Arrange in Grid', shortcut: '⌘⇧A',
          action: () => { close(); dispatch({ type: 'ARRANGE' }); } },
        { label: 'Open All',        shortcut: '⌘⇧O',
          action: () => { close(); dispatch({ type: 'OPEN_ALL' }); } },
        ...(openWins.length > 0 ? [{ div: true }] : []),
        ...openWins.map(w => ({
          label: WIN_TITLES[w.id] || w.title,
          action: () => { dispatch({ type: 'FOCUS', id: w.id }); close(); },
        })),
      ],
    },
    {
      id: 'help', label: 'Help', items: [
        { label: 'About This Portfolio',
          action: () => showToast(`macOS-style portfolio built with Next.js · ${new Date().getFullYear()}`) },
        { label: 'Show Welcome Tip',
          action: () => { close(); window.dispatchEvent(new Event('welcomeReplay')); } },
        { div: true },
        { label: 'Traffic Light Guide',
          action: () => showToast('🔴 Close  🟡 Minimize  🟢 Maximize / Restore') },
        { label: 'Drag Title Bar to Move',
          action: () => showToast('Drag any window\'s title bar to reposition it') },
        { label: 'Drag Corner to Resize',
          action: () => showToast('Drag the bottom-right corner of any window to resize') },
        { div: true },
        { label: 'Email Tomy ↗',
          action: () => window.open(`mailto:${ME.email}?subject=Portfolio+Hello`) },
      ],
    },
  ];

  const dc = dark ? 'rgba(255,255,255,.28)' : 'rgba(0,0,0,.28)';
  const ic = dark ? 'rgba(242,242,247,.65)' : 'rgba(28,28,30,.65)';

  return (
    <>
      {/* Spotlight */}
      {spotlight && createPortal(
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 999999,
            background: 'rgba(0,0,0,.01)',
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center', paddingTop: '14vh',
          }}
          onClick={() => { setSpotlight(false); setSpotQ(''); setSpotSel(0); }}
        >
          <div
            style={{
              width: 620, background: tk.dropBg, borderRadius: 16,
              border: `1px solid ${tk.border}`,
              boxShadow: '0 32px 80px rgba(0,0,0,.44)', overflow: 'hidden',
              animation: 'spotlightIn .16s ease',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '13px 18px',
              borderBottom: spotResults.length > 0 ? `1px solid ${tk.divider}` : 'none',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="6.8" cy="6.8" r="5.2" stroke={tk.textMuted} strokeWidth="1.5" />
                <line x1="10.6" y1="10.6" x2="14" y2="14"
                  stroke={tk.textMuted} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                autoFocus
                value={spotQ}
                onChange={e => { setSpotQ(e.target.value); setSpotSel(0); }}
                placeholder="Search projects, skills, windows…"
                onKeyDown={e => {
                  if (e.key === 'Escape') { setSpotlight(false); setSpotQ(''); setSpotSel(0); }
                  if (e.key === 'ArrowDown') { e.preventDefault(); setSpotSel(i => Math.min(i + 1, spotResults.length - 1)); }
                  if (e.key === 'ArrowUp')   { e.preventDefault(); setSpotSel(i => Math.max(i - 1, 0)); }
                  if (e.key === 'Enter' && spotResults[spotSel]) { spotResults[spotSel].action(); setSpotSel(0); }
                }}
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: 17, color: tk.text,
                  fontFamily: 'var(--font-sans), sans-serif', outline: 'none',
                }}
              />
              {spotQ && (
                <button
                  onClick={() => { setSpotQ(''); setSpotSel(0); }}
                  style={{
                    border: 'none', background: dark ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.10)',
                    borderRadius: '50%', width: 20, height: 20, cursor: 'pointer',
                    color: tk.textMuted, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >✕</button>
              )}
            </div>

            {spotResults.length > 0 ? (
              <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                {(Array.from(new Set(spotResults.map(r => r.category)))).map(cat => {
                  const items = spotResults.filter(r => r.category === cat);
                  return (
                    <div key={cat}>
                      <div style={{
                        padding: '8px 18px 4px', fontSize: 11,
                        fontWeight: 600, letterSpacing: '.5px',
                        color: tk.textMuted, textTransform: 'uppercase',
                        fontFamily: 'var(--font-sans), sans-serif',
                      }}>
                        {cat}
                      </div>
                      {items.map(item => {
                        const flatIdx = spotResults.indexOf(item);
                        const isSel   = flatIdx === spotSel;
                        return (
                          <button
                            key={item.category + item.label}
                            onClick={item.action}
                            onMouseEnter={() => setSpotSel(flatIdx)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 12,
                              width: isSel ? 'calc(100% - 12px)' : '100%',
                              padding: '8px 18px', border: 'none', cursor: 'pointer',
                              background: isSel ? tk.hlColor : 'transparent',
                              borderRadius: isSel ? 8 : 0,
                              margin: isSel ? '0 6px' : '0',
                              transition: 'background .1s',
                              fontFamily: 'var(--font-sans), sans-serif',
                              textAlign: 'left' as const,
                            }}
                          >
                            <SpotGlyph glyph={item.glyph} img={item.img} sel={isSel} dark={dark} />
                            <span style={{ flex: 1, minWidth: 0 }}>
                              <span style={{
                                display: 'block', fontSize: 14, fontWeight: 500,
                                color: isSel ? '#fff' : tk.text,
                              }}>
                                {item.label}
                              </span>
                              {item.desc && (
                                <span style={{
                                  display: 'block', fontSize: 12,
                                  color: isSel ? 'rgba(255,255,255,.70)' : tk.textMuted,
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                  {item.desc}
                                </span>
                              )}
                            </span>
                            {isSel && (
                              <kbd style={{
                                fontSize: 11, padding: '2px 7px', borderRadius: 5, flexShrink: 0,
                                background: 'rgba(255,255,255,.20)', color: 'rgba(255,255,255,.80)',
                                border: '1px solid rgba(255,255,255,.22)',
                                fontFamily: 'var(--font-mono), monospace',
                              }}>↵</kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
                <div style={{ height: 6 }} />
              </div>
            ) : (
              <div style={{ padding: '28px 18px', textAlign: 'center', color: tk.textMuted, fontSize: 14 }}>
                No results for <strong style={{ color: tk.text }}>"{spotQ}"</strong>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      <div
        className="mac-menubar"
        onClick={close}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 28,
          zIndex: 9998,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: tk.menuBg,
          backdropFilter: 'blur(36px) saturate(2.0)',
          WebkitBackdropFilter: 'blur(36px) saturate(2.0)',
          borderBottom: `1px solid ${tk.divider}`,
          color: tk.text, fontFamily: 'var(--font-sans), sans-serif',
          animation: 'menuSlideDown .45s .05s cubic-bezier(.16,1,.3,1) both',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {MENUS.map(menu => (
            <div key={menu.id} style={{ position: 'relative', height: '100%' }}>
              <button
                onClick={e => { e.stopPropagation(); setWifiPop(false); setBatPop(false); setCalPop(false); setActive(active === menu.id ? null : menu.id); }}
                style={{
                  height: '100%', padding: '0 10px', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-sans), sans-serif',
                  fontWeight: menu.bold ? 600 : 400,
                  fontSize: menu.id === 'apple' ? 17 : 13,
                  background: active === menu.id ? tk.hlColor : 'transparent',
                  color: active === menu.id ? '#fff' : tk.text,
                  borderRadius: active === menu.id ? 5 : 0,
                  transition: 'background .1s, color .1s',
                }}
              >
                {menu.label}
              </button>

              {active === menu.id && (
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: 'absolute', top: 'calc(100% + 1px)',
                    left: menu.id === 'apple' ? 0 : -2,
                    minWidth: 244, background: tk.dropBg,
                    backdropFilter: 'blur(44px) saturate(2)',
                    WebkitBackdropFilter: 'blur(44px) saturate(2)',
                    border: `1px solid ${tk.divider}`, borderRadius: 9,
                    boxShadow: '0 14px 52px rgba(0,0,0,.26),0 2px 8px rgba(0,0,0,.10)',
                    zIndex: 10000, paddingTop: 4, paddingBottom: 4,
                    animation: 'menuIn .14s ease',
                  }}
                >
                  {menu.items.map((item, i) =>
                    item.div
                      ? <div key={i} style={{ height: 1, background: tk.divider, margin: '3px 0' }} />
                      : (
                        <button
                          key={i}
                          disabled={item.disabled}
                          onClick={() => { if (item.action) { item.action(); setActive(null); } }}
                          onMouseEnter={e => {
                            if (!item.disabled) {
                              e.currentTarget.style.background = tk.hlColor;
                              e.currentTarget.style.color = '#fff';
                            }
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = item.disabled ? dc : tk.text;
                          }}
                          style={{
                            width: 'calc(100% - 10px)', margin: '0 5px',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', padding: '2px 9px',
                            border: 'none', background: 'transparent', borderRadius: 6,
                            cursor: item.disabled ? 'default' : 'pointer',
                            color: item.disabled ? dc : tk.text,
                            fontSize: 13, minHeight: 24,
                            fontFamily: 'var(--font-sans), sans-serif', textAlign: 'left',
                            transition: 'background .08s, color .08s',
                          }}
                        >
                          <span>{item.label}</span>
                          {item.shortcut && (
                            <span style={{
                              fontSize: 11, opacity: .48, marginLeft: 16,
                              fontFamily: 'var(--font-mono), monospace',
                            }}>
                              {item.shortcut}
                            </span>
                          )}
                        </button>
                      )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          paddingRight: 14, height: '100%',
        }}>
          <Link
            href="/classic"
            style={{
              height: 22, padding: '0 8px', marginRight: 4, borderRadius: 5, display: 'flex', alignItems: 'center',
              fontSize: 13, fontWeight: 500, color: tk.text, opacity: .78, whiteSpace: 'nowrap', transition: 'opacity .15s, background .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = tk.pillBg; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '.78'; e.currentTarget.style.background = 'transparent'; }}
          >
            Classic view
          </Link>
          <div style={{ position: 'relative' }}>
            <button
              aria-label="Wi-Fi"
              onClick={e => { e.stopPropagation(); setActive(null); setBatPop(false); setWifiPop(p => !p); }}
              style={{
                display: 'flex', alignItems: 'center', opacity: wifiPop ? 1 : .70,
                padding: '0 4px', border: 'none', background: 'transparent',
                cursor: 'pointer', borderRadius: 4, height: 28,
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => { if (!wifiPop) e.currentTarget.style.opacity = '.70'; }}
            >
              <WifiIcon c={tk.text} />
            </button>
            {wifiPop && (
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                  width: 220, background: tk.dropBg,
                  backdropFilter: 'blur(44px) saturate(2)',
                  WebkitBackdropFilter: 'blur(44px) saturate(2)',
                  border: `1px solid ${tk.divider}`, borderRadius: 12,
                  boxShadow: '0 12px 40px rgba(0,0,0,.26)', zIndex: 10001,
                  padding: '14px 16px', fontFamily: 'var(--font-sans), sans-serif',
                  animation: 'menuIn .14s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: 'linear-gradient(135deg,#34c759,#248a3d)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <WifiIcon c="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: tk.text }}>imaginary.wifi</div>
                    <div style={{ fontSize: 11, color: '#34c759', marginTop: 1 }}>● Connected</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', marginBottom: 8 }}>
                  {[4,7,10,13,10].map((h, i) => (
                    <div key={i} style={{
                      width: 5, height: h, borderRadius: 2,
                      background: i < 4 ? '#34c759' : (dark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.15)'),
                      transition: 'height .3s ease',
                    }} />
                  ))}
                  <span style={{ fontSize: 11, color: tk.textMuted, marginLeft: 6 }}>Excellent</span>
                </div>
                <div style={{ fontSize: 11, color: tk.textMuted, borderTop: `1px solid ${tk.divider}`, paddingTop: 8 }}>
                  📡 Portfolio Network · No password needed
                </div>
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <button
              aria-label="Battery"
              onClick={e => { e.stopPropagation(); setActive(null); setWifiPop(false); setBatPop(p => !p); }}
              style={{
                display: 'flex', alignItems: 'center', opacity: batPop ? 1 : .78,
                padding: '0 4px', border: 'none', background: 'transparent',
                cursor: 'pointer', borderRadius: 4, height: 28,
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => { if (!batPop) e.currentTarget.style.opacity = '.78'; }}
            >
              <BatteryIcon c={tk.text} />
            </button>
            {batPop && (
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                  width: 220, background: tk.dropBg,
                  backdropFilter: 'blur(44px) saturate(2)',
                  WebkitBackdropFilter: 'blur(44px) saturate(2)',
                  border: `1px solid ${tk.divider}`, borderRadius: 12,
                  boxShadow: '0 12px 40px rgba(0,0,0,.26)', zIndex: 10001,
                  padding: '14px 16px', fontFamily: 'var(--font-sans), sans-serif',
                  animation: 'menuIn .14s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: 'linear-gradient(135deg,#248a3d,#34c759)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <BatteryIcon c="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: tk.text }}>100%</div>
                    <div style={{ fontSize: 11, color: '#34c759', marginTop: 1 }}>⚡ Fully Charged</div>
                  </div>
                </div>
                <div style={{
                  height: 8, background: dark ? 'rgba(255,255,255,.10)' : 'rgba(0,0,0,.10)',
                  borderRadius: 4, overflow: 'hidden', marginBottom: 8,
                }}>
                  <div style={{
                    height: '100%', width: '100%', borderRadius: 4,
                    background: 'linear-gradient(90deg,#248a3d,#34c759)',
                    animation: 'pulse 2s ease-in-out infinite',
                  }} />
                </div>
                <div style={{ fontSize: 11, color: tk.textMuted }}>
                  Est. time remaining: ∞ hrs
                </div>
                <div style={{ fontSize: 10.5, color: tk.textMuted, marginTop: 3, borderTop: `1px solid ${tk.divider}`, paddingTop: 7 }}>
                  🔌 Power source: imagination
                </div>
              </div>
            )}
          </div>

          <button
            onClick={e => { e.stopPropagation(); setSpotlight(s => !s); }}
            title="Spotlight  ⌘K"
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              padding: '3px 5px', display: 'flex', alignItems: 'center',
              color: ic, borderRadius: 4,
              transition: 'opacity .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '.85')}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="5.5" cy="5.5" r="4" stroke={ic} strokeWidth="1.5" />
              <line x1="8.5" y1="8.5" x2="11.5" y2="11.5" stroke={ic} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <button
            onClick={e => { e.stopPropagation(); setDark(d => !d); }}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              padding: '3px 5px', display: 'flex', alignItems: 'center',
              color: ic, borderRadius: 4,
              transition: 'opacity .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '.85')}
          >
            {dark ? <SunIcon c={ic} /> : <MoonIcon c={ic} />}
          </button>

          {/* Clock and calendar */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={e => {
                e.stopPropagation();
                setActive(null); setWifiPop(false); setBatPop(false);
                setCalPop(p => !p);
              }}
              style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                fontFamily: 'var(--font-sans), sans-serif',
                fontSize: 12, letterSpacing: '0.01em',
                color: tk.text, opacity: calPop ? 1 : .82,
                fontWeight: 400, paddingLeft: 4, paddingRight: 2,
                height: 28, borderRadius: 4,
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => { if (!calPop) e.currentTarget.style.opacity = '.82'; }}
            >
              {clock}
            </button>

            {calPop && (() => {
              const now    = new Date();
              const todayY = now.getFullYear();
              const todayM = now.getMonth();
              const todayD = now.getDate();
              const isCurrentMonth = calView.year === todayY && calView.month === todayM;

              const MONTH_NAMES = ['January','February','March','April','May','June',
                                   'July','August','September','October','November','December'];
              const DAY_NAMES   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

              const firstDow   = new Date(calView.year, calView.month, 1).getDay();
              const daysInMonth = new Date(calView.year, calView.month + 1, 0).getDate();
              const cells: (number | null)[] = Array(firstDow).fill(null);
              for (let d = 1; d <= daysInMonth; d++) cells.push(d);
              while (cells.length % 7) cells.push(null);

              const hh = String(now.getHours()).padStart(2, '0');
              const mm = String(now.getMinutes()).padStart(2, '0');
              const ss = String(now.getSeconds()).padStart(2, '0');
              const FULL_DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
              const timeStr = `${hh}:${mm}:${ss}`;
              const dateStr = `${FULL_DAYS[now.getDay()]}, ${MONTH_NAMES[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

              return (
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                    width: 264, background: tk.dropBg,
                    backdropFilter: 'blur(44px) saturate(2)',
                    WebkitBackdropFilter: 'blur(44px) saturate(2)',
                    border: `1px solid ${tk.divider}`, borderRadius: 14,
                    boxShadow: '0 16px 48px rgba(0,0,0,.28)', zIndex: 10001,
                    overflow: 'hidden',
                    animation: 'menuIn .14s ease',
                    fontFamily: 'var(--font-sans), sans-serif',
                  }}
                >
                  <div style={{
                    padding: '16px 18px 14px',
                    borderBottom: `1px solid ${tk.divider}`,
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: 34, fontWeight: 200, letterSpacing: '-1px',
                      color: tk.text, fontFamily: 'var(--font-mono), monospace',
                      lineHeight: 1,
                    }}>
                      {timeStr}
                    </div>
                    <div style={{ fontSize: 12, color: tk.textMuted, marginTop: 6 }}>
                      {dateStr}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px 6px',
                  }}>
                    <button
                      onClick={() => setCalView(v => {
                        const d = new Date(v.year, v.month - 1, 1);
                        return { year: d.getFullYear(), month: d.getMonth() };
                      })}
                      style={{
                        width: 26, height: 26, borderRadius: 7, border: 'none',
                        background: tk.cardBg, cursor: 'pointer',
                        color: tk.textSub, fontSize: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >‹</button>
                    <span style={{ fontSize: 13, fontWeight: 600, color: tk.text }}>
                      {MONTH_NAMES[calView.month]} {calView.year}
                    </span>
                    <button
                      onClick={() => setCalView(v => {
                        const d = new Date(v.year, v.month + 1, 1);
                        return { year: d.getFullYear(), month: d.getMonth() };
                      })}
                      style={{
                        width: 26, height: 26, borderRadius: 7, border: 'none',
                        background: tk.cardBg, cursor: 'pointer',
                        color: tk.textSub, fontSize: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >›</button>
                  </div>

                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                    padding: '0 10px', gap: '2px 0',
                  }}>
                    {DAY_NAMES.map(d => (
                      <div key={d} style={{
                        textAlign: 'center', fontSize: 10.5,
                        color: tk.textMuted, fontWeight: 600,
                        letterSpacing: '.3px', paddingBottom: 4,
                        fontFamily: 'var(--font-mono), monospace',
                      }}>
                        {d}
                      </div>
                    ))}

                    {cells.map((day, i) => {
                      const isToday = isCurrentMonth && day === todayD;
                      const isSun   = i % 7 === 0;
                      const isSat   = i % 7 === 6;
                      return (
                        <div key={i} style={{
                          textAlign: 'center', fontSize: 12,
                          padding: '4px 2px',
                          color: isToday
                            ? '#fff'
                            : !day
                              ? 'transparent'
                              : (isSun || isSat)
                                ? tk.textMuted
                                : tk.text,
                          fontWeight: isToday ? 700 : 400,
                          background: isToday ? tk.hlColor : 'transparent',
                          borderRadius: isToday ? '50%' : 0,
                          width: 28, height: 28,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          margin: '0 auto',
                          boxShadow: isToday ? '0 2px 8px rgba(0,108,210,.40)' : 'none',
                        }}>
                          {day ?? ''}
                        </div>
                      );
                    })}
                  </div>

                  {!isCurrentMonth && (
                    <div style={{ padding: '8px 14px 12px' }}>
                      <button
                        onClick={() => {
                          const n = new Date();
                          setCalView({ year: n.getFullYear(), month: n.getMonth() });
                        }}
                        style={{
                          width: '100%', padding: '7px', borderRadius: 8,
                          border: `1px solid ${tk.divider}`,
                          background: 'transparent', cursor: 'pointer',
                          fontSize: 12, color: tk.hlColor, fontWeight: 500,
                          fontFamily: 'var(--font-sans), sans-serif',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = tk.cardBg as string)}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        Today
                      </button>
                    </div>
                  )}
                  {isCurrentMonth && <div style={{ height: 10 }} />}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', top: 38, left: '50%', zIndex: 99998,
          transform: 'translateX(-50%)',
          background: dark ? 'rgba(255,255,255,.94)' : 'rgba(22,22,24,.94)',
          color: dark ? '#1c1c1e' : '#f2f2f7',
          padding: '7px 20px', borderRadius: 11, fontSize: 13,
          backdropFilter: 'blur(20px)',
          fontFamily: 'var(--font-sans), sans-serif',
          boxShadow: '0 4px 24px rgba(0,0,0,.22)',
          whiteSpace: 'nowrap',
          animation: 'toastIn .18s ease',
        }}>
          {toast}
        </div>
      )}
    </>
  );
}
