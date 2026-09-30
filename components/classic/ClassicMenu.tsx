'use client';
import { useEffect, useRef, useState } from 'react';
import { APP_BG, appGlyph } from '@/components/mac/appIcons';
import { Link } from '@/components/nav';
import { SECTIONS } from './shared';
import s from './classic.module.css';

export default function ClassicMenu({ base, resume }: { base: string; resume: { href: string; filename: string } }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const shut = () => setOpen(false);
    // The scrim is inside wrap and closes the menu with its own click
    const away = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) shut(); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') shut(); };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    document.addEventListener('scroll', shut, true);
    return () => {
      document.removeEventListener('pointerdown', away);
      document.removeEventListener('keydown', esc);
      document.removeEventListener('scroll', shut, true);
    };
  }, [open]);

  const close = () => setOpen(false);
  return (
    <div ref={wrap} className={s.menuWrap}>
      <button
        className={s.round} onClick={() => setOpen(o => !o)}
        aria-label="Menu" aria-expanded={open} aria-controls="classic-menu"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && <div className={s.scrim} onClick={close} aria-hidden="true" />}
      {open && (
        <nav id="classic-menu" aria-label="Menu" className={s.menu}>
          {SECTIONS.map(x => (
            <Link key={x.id} href={`${base}#${x.id}`} onClick={close} aria-current={base && x.id === 'projects' ? 'true' : undefined}>
              <span aria-hidden="true" className={s.menuIcon} style={{ background: APP_BG[x.app] }}>{appGlyph(x.app, 'cm', .5)}</span>
              {x.label}
            </Link>
          ))}
          <a href={resume.href} download={resume.filename} onClick={close}>
            <span aria-hidden="true" className={s.menuIcon} style={{ background: APP_BG.resume }}>{appGlyph('resume', 'cm', .5)}</span>
            Resume
          </a>
          <Link href="/" className={s.phoneOnly}>
            <span aria-hidden="true" className={`${s.menuIcon} ${s.menuPhone}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="6.5" y="2.5" width="11" height="19" rx="2.8" /><path d="M10.5 18.5h3" strokeLinecap="round" />
              </svg>
            </span>
            iPhone view
          </Link>
        </nav>
      )}
    </div>
  );
}
