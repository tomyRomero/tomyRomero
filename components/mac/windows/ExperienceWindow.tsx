'use client';
import { useState } from 'react';
import { T } from '../tokens';
import { experiences, education, certifications } from '@/constants';
import { requestResume } from '../ResumeDialog';
import RoleTimeline, { shortSpan } from '@/components/RoleTimeline';
import {
  Sidebar, SidebarHeading, SidebarItem, Toolbar, ToolbarButton, Monogram, tint, useWidthClass,
  TOOLBAR_H, ChevronUp, ChevronDown, Briefcase, GradCap, Ribbon, Download, ArrowUpRight,
} from '../Native';

// Styled after Mail: sidebar, message list, reading pane

type Section = 'work' | 'education' | 'certs';

const SECTIONS: { id: Section; label: string; icon: React.ReactNode; count: number }[] = [
  { id: 'work',      label: 'Work',           icon: <Briefcase />, count: experiences.length },
  { id: 'education', label: 'Education',      icon: <GradCap />,   count: education.length },
  { id: 'certs',     label: 'Certifications', icon: <Ribbon />,    count: certifications.length },
];

const firstYear = Math.min(...experiences.map(e => Number(e.start.slice(0, 4))));
const SUBTITLE: Record<Section, string> = {
  work:      `${experiences.length} roles · ${firstYear} – today`,
  education: education.map(e => e.years).join(', '),
  certs:     `${certifications.length} credentials`,
};

type Row = { key: string; mono: string; tint: Parameters<typeof tint>[0]; name: string; meta: string; line2: string; line3?: string; current?: boolean };

function rowsFor(section: Section): Row[] {
  if (section === 'work') return experiences.map(e => ({
    key: e.company, mono: e.logo, tint: e.tint, name: e.company, meta: shortSpan(e.start, e.end),
    line2: e.title, line3: e.description[0], current: !e.end,
  }));
  if (section === 'education') return education.map(e => ({
    key: e.institution, mono: e.logo, tint: e.tint, name: e.institution, meta: e.years,
    line2: `${e.degree} in ${e.field}`, line3: e.bullets.join('. ') + '.',
  }));
  return certifications.map(c => ({
    key: c.name, mono: c.logo, tint: c.tint, name: c.name, meta: c.issued,
    line2: c.issuer,
  }));
}

export default function ExperienceWindow({ dark }: { dark: boolean }) {
  const tk = T(dark);
  // 0: no sidebar, 1: full three panes
  const [ref, wide] = useWidthClass<HTMLDivElement>([860]);
  const [section, setSection] = useState<Section>('work');
  const [picked, setPicked] = useState<Record<Section, number>>({ work: 0, education: 0, certs: 0 });
  const rows = rowsFor(section);
  const sel = picked[section];
  const pick = (i: number) => setPicked(p => ({ ...p, [section]: Math.max(0, Math.min(rows.length - 1, i)) }));

  return (
    <div ref={ref} style={{ flex: 1, minWidth: 0, display: 'flex', color: tk.label }}>
      {wide === 1 && (
        <Sidebar
          dark={dark} width={200} label="Experience sections"
          footer={
            <button
              onClick={requestResume}
              style={{
                width: '100%', height: 32, display: 'flex', alignItems: 'center', gap: 9, padding: '0 10px',
                borderRadius: 8, fontSize: 13, fontWeight: 500, color: tk.label,
                background: dark ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.6)',
                boxShadow: `0 0 0 .5px ${dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.08)'}`,
              }}
            >
              <span style={{ color: tk.accent, display: 'inline-flex' }}><Download /></span>
              Resume (PDF)
            </button>
          }
        >
          <SidebarHeading dark={dark}>Experience</SidebarHeading>
          {SECTIONS.map(s => (
            <SidebarItem
              key={s.id} dark={dark} label={s.label} count={s.count}
              icon={<span style={{ color: tk.accent, display: 'inline-flex' }}>{s.icon}</span>}
              selected={section === s.id} onClick={() => setSection(s.id)}
            />
          ))}
        </Sidebar>
      )}

      {/* Message list */}
      <section aria-label={SECTIONS.find(s => s.id === section)!.label} style={{
        width: wide ? 320 : 290, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: tk.pane, borderRight: `1px solid ${tk.sep}`,
      }}>
        <div data-drag="" style={{
          minHeight: TOOLBAR_H, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: wide ? '0 20px' : '0 16px 0 88px',
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>{SECTIONS.find(s => s.id === section)!.label}</h2>
          <div style={{ fontSize: 11.5, color: tk.label2 }}>{SUBTITLE[section]}</div>
        </div>
        {wide === 0 && (
          <div role="group" aria-label="Section" style={{
            margin: '2px 12px 8px', padding: 2, borderRadius: 8, background: tk.fill,
            display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          }}>
            {SECTIONS.map(s => (
              <button key={s.id} aria-pressed={section === s.id} onClick={() => setSection(s.id)} style={{
                height: 24, borderRadius: 6, fontSize: 12, fontWeight: section === s.id ? 600 : 500,
                background: section === s.id ? (dark ? 'rgba(255,255,255,.16)' : '#fff') : 'transparent',
                boxShadow: section === s.id ? '0 1px 2px rgba(0,0,0,.12)' : 'none', color: tk.label,
              }}>
                {s.id === 'certs' ? 'Certs' : s.label}
              </button>
            ))}
          </div>
        )}
        <div
          role="listbox"
          aria-label={SECTIONS.find(s => s.id === section)!.label}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') { e.preventDefault(); pick(sel + 1); }
            if (e.key === 'ArrowUp')   { e.preventDefault(); pick(sel - 1); }
          }}
          style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 8px 8px', outline: 'none' }}
        >
          {rows.map((r, i) => {
            const on = i === sel;
            const lastBeforeSel = i + 1 === sel || i === rows.length - 1;
            return (
              <div
                key={r.key}
                role="option"
                aria-selected={on}
                onClick={() => pick(i)}
                style={{
                  position: 'relative', display: 'flex', gap: 11, padding: '12px 12px 0 20px',
                  borderRadius: 10, cursor: 'pointer',
                  background: on ? tk.select : 'transparent', color: on ? '#fff' : tk.label,
                  animation: `contentFadeIn .35s ${i * 0.05}s ease both`,
                }}
              >
                {r.current && (
                  <span aria-label="Current" style={{
                    position: 'absolute', left: 7, top: 25, width: 7, height: 7, borderRadius: '50%',
                    background: on ? '#fff' : tk.accent,
                  }} />
                )}
                {on
                  ? <span aria-hidden="true" style={{
                      width: 34, height: 34, flexShrink: 0, borderRadius: section === 'certs' ? 9 : '50%',
                      background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: r.mono.length > 2 ? 11 : r.mono.length > 1 ? 13 : 14, fontWeight: 700,
                    }}>{r.mono}</span>
                  : <Monogram text={r.mono} t={r.tint} dark={dark} size={34} round={section !== 'certs'} />}
                <span style={{
                  flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 13,
                  borderBottom: on || lastBeforeSel ? '1px solid transparent' : `1px solid ${tk.sep}`,
                }}>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 600 }}>
                      {r.name}
                    </span>
                    <span style={{ flexShrink: 0, fontSize: 12, color: on ? 'rgba(255,255,255,.9)' : tk.label2 }}>{r.meta}</span>
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{r.line2}</span>
                  {r.line3 && (
                    <span style={{
                      fontSize: 12.5, lineHeight: 1.45, color: on ? 'rgba(255,255,255,.88)' : tk.label2,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{r.line3}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reading pane */}
      <article style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: tk.pane }}>
        <Toolbar style={{ justifyContent: 'flex-end', gap: 2 }}>
          {wide === 0 && (
            <ToolbarButton dark={dark} label="Download resume" onClick={requestResume}><Download s={16} /></ToolbarButton>
          )}
          <ToolbarButton dark={dark} label="Previous" disabled={sel === 0} onClick={() => pick(sel - 1)}><ChevronUp /></ToolbarButton>
          <ToolbarButton dark={dark} label="Next" disabled={sel === rows.length - 1} onClick={() => pick(sel + 1)}><ChevronDown /></ToolbarButton>
        </Toolbar>
        <div key={section + sel} style={{
          flex: 1, minHeight: 0, overflowY: 'auto', padding: wide ? '4px 34px 30px' : '4px 26px 26px',
          animation: 'fadeIn .2s ease',
        }}>
          {section === 'work' && <RoleDetail i={sel} dark={dark} onSelect={c => pick(experiences.findIndex(e => e.company === c))} />}
          {section === 'education' && <SchoolDetail i={sel} dark={dark} />}
          {section === 'certs' && <CertDetail i={sel} dark={dark} />}
        </div>
      </article>
    </div>
  );
}

// Reading pane
function DetailHeader({ mono, t, title, sub, meta, badge, dark, square }: {
  mono: string; t: Row['tint']; title: string; sub: string; meta: string; badge?: string; dark: boolean; square?: boolean;
}) {
  const tk = T(dark);
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <Monogram text={mono} t={t} dark={dark} size={54} round={!square} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: 23, fontWeight: 700, letterSpacing: '-.5px', lineHeight: 1.15, textWrap: 'balance' }}>{title}</h3>
          {badge && (
            <span style={{ padding: '2px 9px', borderRadius: 10, background: tk.accentBg, color: tk.accent, fontSize: 11.5, fontWeight: 600 }}>
              {badge}
            </span>
          )}
        </div>
        <div style={{ fontSize: 14, color: tk.label, fontWeight: 500 }}>{sub}</div>
        <div style={{ fontSize: 12.5, color: tk.label2 }}>{meta}</div>
      </div>
    </div>
  );
}

function Dots({ items, color, dark }: { items: string[]; color: string; dark: boolean }) {
  const tk = T(dark);
  return (
    <ul style={{ marginTop: 22, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map(b => (
        <li key={b} className="text-pretty" style={{ display: 'flex', gap: 12, fontSize: 14.5, lineHeight: 1.6, color: tk.label, maxWidth: 680 }}>
          <span aria-hidden="true" style={{ width: 6, height: 6, marginTop: 9, flexShrink: 0, borderRadius: '50%', background: color }} />
          {b}
        </li>
      ))}
    </ul>
  );
}

function RoleDetail({ i, dark, onSelect }: { i: number; dark: boolean; onSelect: (company: string) => void }) {
  const tk = T(dark);
  const e = experiences[i];
  const c = tint(e.tint, dark);
  return (
    <>
      <DetailHeader
        dark={dark} mono={e.logo} t={e.tint} title={e.title} sub={e.company}
        meta={`${e.date} · ${e.location}`} badge={e.end ? undefined : 'Current'}
      />
      <div style={{ marginTop: 20, borderRadius: 12, background: tk.paneAlt, padding: '12px 18px' }}>
        <RoleTimeline
          dark={dark} selected={e.company} onSelect={onSelect}
          muted={{ text: tk.label2, track: dark ? 'rgba(255,255,255,.1)' : '#e3e3e8', tick: dark ? 'rgba(255,255,255,.12)' : '#d8d8de', knob: tk.pane }}
        />
      </div>
      <Dots items={e.description} color={c.bar} dark={dark} />
      <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: tk.label2, marginRight: 4 }}>Tech</span>
        {e.tech.map(t => (
          <span key={t} style={{ padding: '4px 10px', borderRadius: 7, background: tk.fill, fontSize: 12.5, fontWeight: 500 }}>{t}</span>
        ))}
      </div>
    </>
  );
}

function SchoolDetail({ i, dark }: { i: number; dark: boolean }) {
  const tk = T(dark);
  const e = education[i];
  return (
    <>
      <DetailHeader
        dark={dark} mono={e.logo} t={e.tint} title={e.institution} sub={`${e.degree} in ${e.field}`}
        meta={`${e.period} · ${e.location}`}
      />
      <Dots items={e.bullets} color={tint(e.tint, dark).bar} dark={dark} />
    </>
  );
}

function CertDetail({ i, dark }: { i: number; dark: boolean }) {
  const tk = T(dark);
  const c = certifications[i];
  return (
    <>
      <DetailHeader
        dark={dark} square mono={c.logo} t={c.tint} title={c.name} sub={c.issuer}
        meta={`Issued ${c.issued}`}
      />
      <div style={{ marginTop: 22, borderRadius: 12, background: tk.paneAlt, padding: '4px 18px' }}>
        {[
          ['Issuer', c.issuer],
          ['Issued', c.issued],
          ...(c.credentialId ? [['Credential ID', c.credentialId]] : []),
        ].map(([k, v], j, all) => (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', fontSize: 13.5,
            borderBottom: j < all.length - 1 ? `1px solid ${tk.sep}` : 'none',
          }}>
            <span style={{ color: tk.label2 }}>{k}</span>
            <span style={{ fontFamily: k === 'Credential ID' ? 'var(--font-mono), monospace' : undefined, textAlign: 'right' }}>{v}</span>
          </div>
        ))}
      </div>
      <a
        href={c.url} target="_blank" rel="noopener noreferrer"
        style={{
          marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 9,
          background: tk.select, color: '#fff', fontSize: 13.5, fontWeight: 600, transition: 'filter .15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
      >
        View credential <ArrowUpRight s={12} />
      </a>
    </>
  );
}
