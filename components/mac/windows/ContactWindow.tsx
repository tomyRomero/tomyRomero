'use client';
import { useState } from 'react';
import Image from 'next/image';
import { T } from '../tokens';
import { contactDetails, contactBlurb, ME, profilePhoto } from '@/constants';
import { MailIcon, LinkedInIcon, GitHubIcon, PinIcon } from '../Icons';
import { requestResume } from '../ResumeDialog';
import { copyText } from '@/components/copyText';
import { Toolbar, TOOLBAR_H, useWidthClass, ArrowUpRight, CopyIcon, CheckIcon, Download, SendIcon } from '../Native';

// Send opens the visitor's mail app with the draft filled in (mailto)

const SUBJECT = 'Hello from your portfolio';

const MARKS: Record<string, { icon: React.ReactNode; color: string }> = {
  Email:    { icon: <MailIcon s={16} />,     color: '#0a84ff' },
  LinkedIn: { icon: <LinkedInIcon s={15} />, color: '#0a66c2' },
  GitHub:   { icon: <GitHubIcon s={16} />,   color: '#8e8e93' },
  Location: { icon: <PinIcon s={16} />,      color: '#ff453a' },
};

export default function ContactWindow({ dark }: { dark: boolean }) {
  const tk = T(dark);
  const [ref, wide] = useWidthClass<HTMLDivElement>([820]);
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const copyEmail = () => {
    copyText(ME.email).then(ok => {
      if (!ok) return;
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  const send = () => {
    const q = `subject=${encodeURIComponent(subject.trim() || SUBJECT)}${body.trim() ? `&body=${encodeURIComponent(body)}` : ''}`;
    window.location.href = `mailto:${ME.email}?${q}`;
  };

  const field: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 12, minHeight: 50, borderBottom: `1px solid ${tk.sep}`, fontSize: 14,
  };

  return (
    <div ref={ref} style={{ flex: 1, minWidth: 0, display: 'flex', color: tk.label }}>
      <aside aria-label="Contact card" style={{
        width: wide ? 340 : 290, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: tk.sidebar, borderRight: `1px solid ${tk.sidebarLine}`,
      }}>
        <div data-drag="" style={{ height: TOOLBAR_H, flexShrink: 0 }} />
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 16px 12px', display: 'flex', flexDirection: 'column' }}>
          <div data-drag="" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingBottom: 20 }}>
            <div style={{
              position: 'relative', width: 88, height: 88, borderRadius: '50%', overflow: 'hidden',
              boxShadow: `0 0 0 3px ${dark ? 'rgba(255,255,255,.14)' : '#fff'}, 0 8px 22px rgba(0,0,0,.2)`,
            }}>
              <Image src={profilePhoto} alt="Tomy Romero" fill sizes="88px" style={{ objectFit: 'cover' }} />
            </div>
            <h2 style={{ marginTop: 14, fontSize: 22, fontWeight: 700, letterSpacing: '-.4px' }}>{ME.name}</h2>
            <div style={{ marginTop: 3, fontSize: 14, color: tk.label2 }}>{ME.title}</div>
          </div>

          <div style={{
            borderRadius: 12, overflow: 'hidden',
            background: dark ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.72)',
            boxShadow: `0 0 0 .5px ${dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)'}`,
          }}>
            {contactDetails.map((c, i) => {
              const m = MARKS[c.type];
              const ext = c.href.startsWith('http');
              const inner = (
                <>
                  <span style={{
                    width: 32, height: 32, flexShrink: 0, borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: `${m.color}${dark ? '33' : '1f'}`, color: dark && c.type === 'GitHub' ? '#e5e5ea' : m.color,
                  }}>{m.icon}</span>
                  <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left' }}>
                    <span style={{ fontSize: 12, color: tk.label2 }}>{c.type}</span>
                    <span style={{ fontSize: 14, color: tk.label, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.value}</span>
                  </span>
                </>
              );
              const row: React.CSSProperties = {
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                borderBottom: i < contactDetails.length - 1 ? `1px solid ${tk.sep}` : 'none',
              };
              if (ext) return (
                <a key={c.type} href={c.href} target="_blank" rel="noopener noreferrer" style={{ ...row, transition: 'background .12s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {inner}<span style={{ color: tk.label2, display: 'inline-flex' }}><ArrowUpRight /></span>
                </a>
              );
              return (
                <div key={c.type} style={row}>
                  {inner}
                  {c.type === 'Email' && (
                    <button
                      onClick={copyEmail}
                      aria-label={copied ? 'Email copied' : 'Copy email address'}
                      title={copied ? 'Copied' : 'Copy'}
                      style={{
                        width: 30, height: 30, flexShrink: 0, borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        background: tk.fill, color: copied ? (dark ? '#4ade80' : '#166534') : tk.label2,
                      }}
                    >
                      {copied ? <CheckIcon s={14} /> : <CopyIcon />}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ padding: '0 16px 16px' }}>
          <button
            onClick={requestResume}
            style={{
              width: '100%', height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontSize: 14, fontWeight: 600, color: tk.label,
              background: dark ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.7)',
              boxShadow: `0 0 0 .5px ${dark ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.1)'}`, transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = dark ? 'rgba(255,255,255,.13)' : '#fff')}
            onMouseLeave={e => (e.currentTarget.style.background = dark ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.7)')}
          >
            <Download s={16} />Download resume
          </button>
        </div>
      </aside>

      <form
        aria-label="New message"
        onSubmit={e => { e.preventDefault(); send(); }}
        style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: tk.pane }}
      >
        <Toolbar style={{ padding: '0 18px 0 26px', borderBottom: `1px solid ${tk.sep}` }}>
          <h2 style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>New Message</h2>
          <button type="submit" aria-label="Send" title="Send" style={{
            width: 30, height: 30, borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: tk.accent,
          }}
            onMouseEnter={e => (e.currentTarget.style.background = tk.fill)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <SendIcon s={17} />
          </button>
        </Toolbar>
        <div style={{ padding: '0 26px', display: 'flex', flexDirection: 'column' }}>
          <div style={field}>
            <span style={{ width: 64, color: tk.label2 }}>To:</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, padding: '3px 11px 3px 3px', borderRadius: 20,
              background: tk.accentBg, color: tk.accent, fontWeight: 500, maxWidth: '100%', minWidth: 0,
            }} title={ME.email}>
              <span style={{ position: 'relative', width: 22, height: 22, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                <Image src={profilePhoto} alt="" fill sizes="22px" style={{ objectFit: 'cover' }} />
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ME.name}</span>
            </span>
          </div>
          <label style={field}>
            <span style={{ width: 64, color: tk.label2, flexShrink: 0 }}>Subject:</span>
            <input
              value={subject} onChange={e => setSubject(e.target.value)} placeholder={SUBJECT}
              style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: tk.label }}
            />
          </label>
        </div>
        <textarea
          value={body} onChange={e => setBody(e.target.value)} placeholder={contactBlurb} aria-label="Message"
          style={{
            flex: 1, minHeight: 0, resize: 'none', border: 'none', outline: 'none', background: 'transparent',
            // Lines stay a readable length in a zoomed window
            width: '100%', maxWidth: 760,
            padding: '18px 26px', fontSize: 15, lineHeight: 1.6, color: tk.label,
          }}
        />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px 14px 26px', borderTop: `1px solid ${tk.sep}`,
        }}>
          <span style={{ flex: 1, fontSize: 13, color: tk.label2 }}>Opens in your mail app, ready to send</span>
          <button type="submit" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, height: 36, padding: '0 18px', borderRadius: 10,
            background: tk.select, color: '#fff', fontSize: 14, fontWeight: 600,
            boxShadow: `0 6px 16px ${dark ? 'rgba(10,132,255,.35)' : 'rgba(0,98,204,.28)'}`, transition: 'filter .15s, transform .15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}
          >
            <SendIcon s={15} />Send
          </button>
        </div>
      </form>
    </div>
  );
}
