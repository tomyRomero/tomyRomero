'use client';
import { useEffect, useRef, useState } from 'react';
import { T } from './tokens';
import { resumeFile } from '@/constants';

// Confirms before downloading. Triggers call requestResume(); each view mounts
// one <ResumeDialog>.
const EVT = 'resume:request';
export function requestResume() {
  window.dispatchEvent(new Event(EVT));
}

function saveResume() {
  const a = document.createElement('a');
  a.href = resumeFile.href;
  a.download = resumeFile.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function ResumeDialog({ dark, touch = false }: { dark: boolean; touch?: boolean }) {
  const tk = T(dark);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onRequest = () => {
      opener.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    window.addEventListener(EVT, onRequest);
    return () => window.removeEventListener(EVT, onRequest);
  }, []);

  // Real file size via HEAD
  useEffect(() => {
    if (!open || size) return;
    fetch(resumeFile.href, { method: 'HEAD' })
      .then(r => {
        const bytes = Number(r.headers.get('content-length'));
        if (bytes) setSize(`${Math.max(1, Math.round(bytes / 1024))} KB`);
      })
      .catch(() => {});
  }, [open, size]);

  // Default button takes focus; Esc cancels; Tab stays inside the alert
  useEffect(() => {
    if (!open) return;
    // Delay focus so the Enter that opened this doesn't also press Download
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>('[data-default]')?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
      if (e.key === 'Tab' && panel.current) {
        const btns = Array.from(panel.current.querySelectorAll<HTMLElement>('button'));
        const i = btns.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        btns[(i + (e.shiftKey ? btns.length - 1 : 1)) % btns.length]?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      opener.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const close    = () => setOpen(false);
  const download = () => { saveResume(); close(); };
  const view     = () => { window.open(resumeFile.href, '_blank', 'noopener'); close(); };

  const btn: React.CSSProperties = {
    width: '100%', padding: touch ? '12px 14px' : '8px 14px',
    borderRadius: touch ? 12 : 9, fontSize: touch ? 15 : 13.5, fontWeight: 500,
    border: 'none', cursor: 'pointer', transition: 'filter .15s',
  };
  const hover = (e: React.MouseEvent<HTMLButtonElement>, on: boolean) => {
    e.currentTarget.style.filter = on ? (dark ? 'brightness(1.15)' : 'brightness(.95)') : 'none';
  };

  return (
    <div
      onMouseDown={e => { if (e.target === e.currentTarget) close(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        background: dark ? 'rgba(0,0,0,.40)' : 'rgba(0,0,0,.16)',
        animation: 'fadeIn .16s ease',
      }}
    >
      <div
        ref={panel}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="resume-dialog-title"
        aria-describedby="resume-dialog-desc"
        style={{
          width: touch ? 300 : 268, maxWidth: '100%',
          padding: touch ? '26px 18px 18px' : '22px 16px 16px',
          borderRadius: touch ? 18 : 14, textAlign: 'center',
          background: tk.dropBg, border: `1px solid ${tk.borderFoc}`, boxShadow: tk.shadowFoc,
          fontFamily: 'var(--font-sans), sans-serif',
          animation: 'spotlightIn .2s cubic-bezier(.16,1,.3,1)',
        }}
      >
        <span style={{
          width: 54, height: 54, borderRadius: 13, margin: '0 auto',
          background: 'linear-gradient(160deg,#FF7A54 0%,#E8432A 55%,#C22913 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(200,50,20,.26), inset 0 1px 0 rgba(255,255,255,.25)',
        }}>
          <svg width="24" height="29" viewBox="0 0 18 22" fill="none" aria-hidden="true">
            <path d="M2 1.5h9l5 5v14H2z" fill="#fff" fillOpacity=".94" />
            <path d="M11 1.5v5h5" fill="#fff" fillOpacity=".55" />
            <path d="M5 12h8M5 15h8M5 18h5" stroke="#c22913" strokeOpacity=".5" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>

        <div id="resume-dialog-title" style={{
          fontSize: touch ? 17 : 14, fontWeight: 700, color: tk.text, marginTop: 14,
        }}>
          Download resume?
        </div>
        <div id="resume-dialog-desc" style={{
          fontSize: touch ? 13.5 : 12, color: tk.textSub, marginTop: 5, lineHeight: 1.5,
        }}>
          {resumeFile.filename}
          <br />
          PDF{size ? ` · ${size}` : ''}
        </div>

        <div style={{ display: 'grid', gap: 8, marginTop: touch ? 20 : 18 }}>
          <button
            data-default=""
            onClick={download}
            onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}
            style={{ ...btn, background: tk.accentGrad2, color: '#fff', fontWeight: 600 }}
          >
            Download
          </button>
          <button
            onClick={view}
            onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}
            style={{ ...btn, background: tk.pillBg, color: tk.text, boxShadow: `inset 0 0 0 1px ${tk.pillBorder}` }}
          >
            Open in new tab
          </button>
          <button
            onClick={close}
            onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}
            style={{ ...btn, background: tk.pillBg, color: tk.text, boxShadow: `inset 0 0 0 1px ${tk.pillBorder}` }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
