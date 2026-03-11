'use client';
import { useState, useEffect } from 'react';
import { T } from './tokens';
import { ME, projects, skills } from '@/constants';
import type { Win, WinAction } from './winTypes';

const WIN_TITLES: Record<string, string> = {
  about: 'About Me', projects: 'Projects',
  experience: 'Experience', skills: 'Skills', contact: 'Contact',
};

// ── Status bar icon components ────────────────────────────────────────────────
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

// ── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
  wins: Win[];
  dispatch: React.Dispatch<WinAction>;
}

interface MenuItem {
  label?: string;
  div?: boolean;
  action?: () => void;
  disabled?: boolean;
  shortcut?: string;
  icon?: React.ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MenuBar({ dark, setDark, wins, dispatch }: Props) {
  const tk = T(dark);
  const [clock, setClock]         = useState('');
  const [active, setActive]       = useState<string | null>(null);
  const [toast, setToast]         = useState<string | null>(null);
  const [spotlight, setSpotlight]   = useState(false);
  const [spotQ, setSpotQ]           = useState('');
  const [spotSel, setSpotSel]       = useState(0);
  const [isFS, setIsFS]             = useState(false);

  // Build search index (stable — only changes when dispatch changes)
  const searchItems = [
    { category: 'Windows', label: 'About Me',    desc: 'Bio, photos, links',   icon: '👤', action: () => { dispatch({ type: 'OPEN', id: 'about' });      setSpotlight(false); setSpotQ(''); } },
    { category: 'Windows', label: 'Projects',    desc: 'Shipped work',         icon: '📁', action: () => { dispatch({ type: 'OPEN', id: 'projects' });   setSpotlight(false); setSpotQ(''); } },
    { category: 'Windows', label: 'Experience',  desc: 'Work history',         icon: '💼', action: () => { dispatch({ type: 'OPEN', id: 'experience' }); setSpotlight(false); setSpotQ(''); } },
    { category: 'Windows', label: 'Skills',      desc: 'Tech stack',           icon: '⚡', action: () => { dispatch({ type: 'OPEN', id: 'skills' });     setSpotlight(false); setSpotQ(''); } },
    { category: 'Windows', label: 'Contact',     desc: 'Get in touch',         icon: '✉️', action: () => { dispatch({ type: 'OPEN', id: 'contact' });    setSpotlight(false); setSpotQ(''); } },
    ...projects.map(p => ({
      category: 'Projects', label: p.title, desc: p.tagline, icon: p.emoji,
      action: () => { dispatch({ type: 'OPEN', id: 'projects' }); setSpotlight(false); setSpotQ(''); },
    })),
    ...Object.entries(skills).flatMap(([cat, items]) =>
      items.map(s => ({
        category: 'Skills', label: s, desc: cat, icon: '⚙️',
        action: () => { dispatch({ type: 'OPEN', id: 'skills' }); setSpotlight(false); setSpotQ(''); },
      }))
    ),
    { category: 'Links', label: 'GitHub',   desc: ME.github,   icon: '⑂',  action: () => window.open(ME.github,  '_blank') },
    { category: 'Links', label: 'LinkedIn', desc: ME.linkedin, icon: '🔗', action: () => window.open(ME.linkedin, '_blank') },
    { category: 'Links', label: 'Email',    desc: ME.email,    icon: '📧', action: () => window.open(`mailto:${ME.email}`) },
  ];

  const spotResults = spotQ.trim()
    ? searchItems.filter(it =>
        it.label.toLowerCase().includes(spotQ.toLowerCase()) ||
        it.desc?.toLowerCase().includes(spotQ.toLowerCase()) ||
        it.category.toLowerCase().includes(spotQ.toLowerCase())
      )
    : [];

  // Clock ticker
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

  // Track fullscreen state
  useEffect(() => {
    const handler = () => setIsFS(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const copy = (txt: string, lbl: string) =>
    navigator.clipboard?.writeText(txt).then(() => showToast(`✓ ${lbl} copied`));
  const close = () => setActive(null);

  const toggleFS = () => {
    if (isFS) { document.exitFullscreen?.(); }
    else      { document.documentElement.requestFullscreen?.(); }
    close();
  };

  const openWins = wins.filter(w => w.isOpen && !w.isMin);

  const MENUS: { id: string; label: string; bold?: boolean; items: MenuItem[] }[] = [
    {
      id: 'apple', label: '⌘', items: [
        { label: 'About This Portfolio', action: () => showToast('macOS-style Portfolio · Tomy Romero Seas · 2025') },
        { div: true },
        { label: dark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
          action: () => { setDark(d => !d); close(); } },
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
        { label: 'About Tomy Romero Seas',
          action: () => { close(); dispatch({ type: 'OPEN', id: 'about' }); } },
        { div: true },
        { label: 'Print / Save as PDF', shortcut: '⌘P', action: () => { close(); window.print(); } },
        { div: true },
        { label: '✓ Open to Opportunities', disabled: true },
        { div: true },
        { label: 'Hide All Windows', shortcut: '⌘H',
          action: () => { close(); dispatch({ type: 'MIN_ALL' }); } },
        { label: 'Quit',               shortcut: '⌘Q',
          action: () => { close(); dispatch({ type: 'CLOSE_ALL' }); } },
      ],
    },
    {
      id: 'file', label: 'File', items: [
        { label: 'Open About…',      shortcut: '⌘1',
          action: () => { close(); dispatch({ type: 'OPEN', id: 'about' }); } },
        { label: 'Open Projects…',   shortcut: '⌘2',
          action: () => { close(); dispatch({ type: 'OPEN', id: 'projects' }); } },
        { label: 'Open Experience…', shortcut: '⌘3',
          action: () => { close(); dispatch({ type: 'OPEN', id: 'experience' }); } },
        { label: 'Open Skills…',     shortcut: '⌘4',
          action: () => { close(); dispatch({ type: 'OPEN', id: 'skills' }); } },
        { label: 'Open Contact…',    shortcut: '⌘5',
          action: () => { close(); dispatch({ type: 'OPEN', id: 'contact' }); } },
        { div: true },
        { label: 'Print Portfolio',  shortcut: '⌘P',
          action: () => { close(); window.print(); } },
        { div: true },
        { label: 'Close All Windows', shortcut: '⌘W',
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
        { label: 'Spotlight Search',   shortcut: '⌘F',
          action: () => { setSpotlight(true); close(); } },
      ],
    },
    {
      id: 'view', label: 'View', items: [
        { label: dark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
          shortcut: '⌘⇧T',
          action: () => { setDark(d => !d); close(); } },
        { div: true },
        { label: isFS ? 'Exit Full Screen' : 'Enter Full Screen',
          shortcut: '⌃⌘F', action: toggleFS },
      ],
    },
    {
      id: 'window', label: 'Window', items: [
        { label: 'Minimize All',    shortcut: '⌘M',
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
          action: () => showToast('macOS-style portfolio built with Next.js · 2025') },
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
      {/* ── Spotlight overlay ─────────────────────────────────────────────── */}
      {spotlight && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,.40)', backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
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
            {/* Input row */}
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

            {/* Results */}
            {spotResults.length > 0 ? (
              <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                {/* Group by category */}
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
                            key={item.label + item.category}
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
                            <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
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
            ) : spotQ ? (
              <div style={{ padding: '28px 18px', textAlign: 'center', color: tk.textMuted, fontSize: 14 }}>
                No results for <strong style={{ color: tk.text }}>"{spotQ}"</strong>
              </div>
            ) : (
              <div style={{ padding: '14px 18px', color: tk.textMuted, fontSize: 13 }}>
                Search projects, skills, windows, links…
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Menu bar ──────────────────────────────────────────────────────── */}
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
        }}
      >
        {/* Left: menu items */}
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {MENUS.map(menu => (
            <div key={menu.id} style={{ position: 'relative', height: '100%' }}>
              <button
                onClick={e => { e.stopPropagation(); setActive(active === menu.id ? null : menu.id); }}
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
                              e.currentTarget.style.borderRadius = '6px';
                            }
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = item.disabled ? dc : tk.text;
                            e.currentTarget.style.borderRadius = '0';
                          }}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', padding: '1px 14px',
                            border: 'none', background: 'transparent',
                            cursor: item.disabled ? 'default' : 'pointer',
                            color: item.disabled ? dc : tk.text,
                            fontSize: 13, minHeight: 23,
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

        {/* Right: status icons */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          paddingRight: 14, height: '100%',
        }}>
          {/* WiFi */}
          <div style={{ display: 'flex', alignItems: 'center', opacity: .70, padding: '0 2px' }}>
            <WifiIcon c={tk.text} />
          </div>

          {/* Battery */}
          <div style={{ display: 'flex', alignItems: 'center', opacity: .78, padding: '0 2px' }}>
            <BatteryIcon c={tk.text} />
          </div>

          {/* Spotlight */}
          <button
            onClick={e => { e.stopPropagation(); setSpotlight(s => !s); }}
            title="Spotlight  ⌘F"
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

          {/* Dark/Light toggle */}
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

          {/* Clock */}
          <span style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontSize: 12, letterSpacing: '0.01em',
            color: tk.text, opacity: .82,
            fontWeight: 400,
            paddingLeft: 2,
          }}>
            {clock}
          </span>
        </div>
      </div>

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
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
