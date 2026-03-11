'use client';
import { useState, useEffect } from 'react';
import { T } from './tokens';
import { ME } from '@/constants';
import type { Win, WinAction } from './winTypes';

const WIN_TITLES: Record<string, string> = {
  about: 'About Me', projects: 'Projects',
  experience: 'Experience', skills: 'Skills', contact: 'Contact',
};

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
}

export default function MenuBar({ dark, setDark, wins, dispatch }: Props) {
  const tk = T(dark);
  const [clock, setClock] = useState('');
  const [active, setActive] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [spotlight, setSpotlight] = useState(false);
  const [spotQ, setSpotQ] = useState('');

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const mons = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      setClock(`${days[n.getDay()]} ${mons[n.getMonth()]} ${n.getDate()}  ${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const copy = (txt: string, lbl: string) => navigator.clipboard?.writeText(txt).then(() => showToast(`✓ ${lbl} copied`));
  const close = () => setActive(null);
  const openWins = wins.filter(w => w.isOpen);

  const MENUS: { id: string; label: string; bold?: boolean; items: MenuItem[] }[] = [
    {
      id: 'apple', label: '⌘', items: [
        { label: 'About This Portfolio', action: () => showToast('macOS-style Portfolio · Tomy Romero Seas · 2025') },
        { div: true },
        { label: dark ? 'Light Mode ☀️' : 'Dark Mode 🌙', action: () => setDark(d => !d) },
        { div: true },
        { label: 'System Preferences…', disabled: true },
        { div: true },
        { label: 'Sleep', disabled: true }, { label: 'Restart…', disabled: true }, { label: 'Shut Down…', disabled: true },
      ],
    },
    {
      id: 'tomy', label: 'Tomy', bold: true, items: [
        { label: 'About Tomy Romero Seas', action: () => { close(); dispatch({ type: 'OPEN', id: 'about' }); } },
        { div: true },
        { label: 'Open Portfolio Site ↗', shortcut: '⌘O', action: () => window.open(ME.portfolio, '_blank') },
        { label: 'Print / Save as PDF',   shortcut: '⌘P', action: () => window.print() },
        { div: true },
        { label: '✓ Open to Opportunities', disabled: true },
        { div: true },
        { label: 'Hide Tomy', shortcut: '⌘H', action: () => { close(); dispatch({ type: 'MIN_ALL' }); } },
        { label: 'Quit Tomy', shortcut: '⌘Q', action: () => { close(); dispatch({ type: 'CLOSE_ALL' }); } },
      ],
    },
    {
      id: 'file', label: 'File', items: [
        { label: 'Open About…',      shortcut: '⌘1', action: () => { close(); dispatch({ type: 'OPEN', id: 'about' }); } },
        { label: 'Open Projects…',   shortcut: '⌘2', action: () => { close(); dispatch({ type: 'OPEN', id: 'projects' }); } },
        { label: 'Open Experience…', shortcut: '⌘3', action: () => { close(); dispatch({ type: 'OPEN', id: 'experience' }); } },
        { label: 'Open Contact…',    shortcut: '⌘4', action: () => { close(); dispatch({ type: 'OPEN', id: 'contact' }); } },
        { div: true },
        { label: 'Print Portfolio', shortcut: '⌘P', action: () => window.print() },
        { div: true },
        { label: 'Close All Windows', shortcut: '⌘W', action: () => { close(); dispatch({ type: 'CLOSE_ALL' }); } },
      ],
    },
    {
      id: 'edit', label: 'Edit', items: [
        { label: 'Copy Email Address', shortcut: '⌘⇧E', action: () => copy(ME.email, 'Email') },
        { label: 'Copy GitHub URL',    shortcut: '⌘⇧G', action: () => copy(ME.github, 'GitHub URL') },
        { label: 'Copy LinkedIn URL',  shortcut: '⌘⇧L', action: () => copy(ME.linkedin, 'LinkedIn URL') },
        { div: true },
        { label: 'Search (Spotlight)', shortcut: '⌘F', action: () => { setSpotlight(true); close(); } },
        { div: true },
        { label: 'Select All', shortcut: '⌘A', disabled: true },
      ],
    },
    {
      id: 'view', label: 'View', items: [
        { label: dark ? 'Light Mode ☀️' : 'Dark Mode 🌙', shortcut: '⌘⇧T', action: () => { setDark(d => !d); close(); } },
        { div: true },
        { label: 'Enter Full Screen', shortcut: '⌃⌘F', action: () => document.documentElement.requestFullscreen?.() },
      ],
    },
    {
      id: 'window', label: 'Window', items: [
        { label: 'Minimize All',    shortcut: '⌘M',   action: () => { close(); dispatch({ type: 'MIN_ALL' }); } },
        { label: 'Arrange in Grid', shortcut: '⌘⇧A',  action: () => { close(); dispatch({ type: 'ARRANGE' }); } },
        { label: 'Open All',        shortcut: '⌘⇧O',  action: () => { close(); dispatch({ type: 'OPEN_ALL' }); } },
        ...(openWins.length > 0 ? [{ div: true }] : []),
        ...openWins.map(w => ({ label: WIN_TITLES[w.id] || w.title, action: () => { dispatch({ type: 'FOCUS', id: w.id }); close(); } })),
      ],
    },
    {
      id: 'help', label: 'Help', items: [
        { label: 'About This Portfolio',  action: () => showToast('React portfolio · macOS Sequoia style · 2025') },
        { div: true },
        { label: 'Traffic Light Guide',   action: () => showToast('🔴 Close  🟡 Minimize  🟢 Maximize') },
        { label: 'Drag to Trash',         action: () => showToast('Drag any window to the 🗑️ in the dock to close it') },
        { div: true },
        { label: 'Contact Tomy ↗',        action: () => window.open(`mailto:${ME.email}?subject=Portfolio+Hello`) },
      ],
    },
  ];

  const dc = dark ? 'rgba(255,255,255,.28)' : 'rgba(0,0,0,.28)';

  return (
    <>
      {/* Spotlight overlay */}
      {spotlight && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,.38)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh',
          }}
          onClick={() => { setSpotlight(false); setSpotQ(''); }}
        >
          <div
            style={{
              width: 600, background: tk.dropBg, borderRadius: 16,
              border: `1px solid ${tk.border}`,
              boxShadow: '0 32px 80px rgba(0,0,0,.38)', overflow: 'hidden',
              animation: 'spotlightIn .16s ease',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '13px 18px', borderBottom: `1px solid ${tk.divider}`,
            }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke={tk.textMuted} strokeWidth="1.4" />
                <line x1="10.2" y1="10.2" x2="13.5" y2="13.5" stroke={tk.textMuted} strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input
                autoFocus
                value={spotQ}
                onChange={e => setSpotQ(e.target.value)}
                placeholder="Search portfolio…"
                onKeyDown={e => { if (e.key === 'Escape') { setSpotlight(false); setSpotQ(''); } }}
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: 16, color: tk.text,
                  fontFamily: 'var(--font-sans), sans-serif', outline: 'none',
                }}
              />
            </div>
            <div style={{ padding: '12px 18px', color: tk.textMuted, fontSize: 13 }}>
              {spotQ ? `Searching for "${spotQ}"…` : 'Type to search projects, windows…'}
            </div>
          </div>
        </div>
      )}

      {/* Menu bar */}
      <div
        className="mac-menubar"
        onClick={close}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 28,
          zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: tk.menuBg,
          backdropFilter: 'blur(32px) saturate(1.9)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.9)',
          borderBottom: `1px solid ${tk.divider}`,
          color: tk.text, fontFamily: 'var(--font-sans), sans-serif',
        }}
      >
        {/* Left menus */}
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {MENUS.map(menu => (
            <div key={menu.id} style={{ position: 'relative', height: '100%' }}>
              <button
                onClick={e => { e.stopPropagation(); setActive(active === menu.id ? null : menu.id); }}
                style={{
                  height: '100%', padding: '0 10px', border: 'none', cursor: 'default',
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
                    minWidth: 232, background: tk.dropBg,
                    backdropFilter: 'blur(40px) saturate(2)',
                    WebkitBackdropFilter: 'blur(40px) saturate(2)',
                    border: `1px solid ${tk.divider}`, borderRadius: 9,
                    boxShadow: '0 14px 48px rgba(0,0,0,.24),0 2px 8px rgba(0,0,0,.1)',
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
                            border: 'none', background: 'transparent', cursor: 'default',
                            color: item.disabled ? dc : tk.text,
                            fontSize: 13, minHeight: 23,
                            fontFamily: 'var(--font-sans), sans-serif', textAlign: 'left',
                            transition: 'background .08s, color .08s',
                          }}
                        >
                          <span>{item.label}</span>
                          {item.shortcut && (
                            <span style={{ fontSize: 11, opacity: .5, marginLeft: 16, fontFamily: 'var(--font-mono), monospace' }}>
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

        {/* Right status area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 16, color: tk.text }}>
          <button
            onClick={e => { e.stopPropagation(); setSpotlight(s => !s); }}
            title="Spotlight ⌘F"
            style={{ border: 'none', background: 'transparent', cursor: 'default', padding: '2px 4px', color: tk.textSub, display: 'flex', alignItems: 'center' }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4" />
              <line x1="8.5" y1="8.5" x2="11.5" y2="11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={e => { e.stopPropagation(); setDark(d => !d); }}
            title={dark ? 'Light Mode' : 'Dark Mode'}
            style={{ border: 'none', background: 'transparent', cursor: 'default', fontSize: 13, padding: '2px', color: tk.textSub }}
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <span style={{ opacity: .65, fontSize: 14 }}>🔋</span>
          <span style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 11.5, letterSpacing: .3, opacity: .85,
          }}>
            {clock}
          </span>
        </div>
      </div>

      {/* Toast notification */}
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
