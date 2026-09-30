'use client';
import { useState, useEffect, useRef } from 'react';
import { T } from '../tokens';
import { projects, projectDetails, shotsFor, isTallShot, ME } from '@/constants';
import ProjectCover from '@/components/ProjectCover';
import { Browser, Phone } from '@/components/DeviceFrames';
import Showcase, { hasLiveDemo, stackOf, PLATFORM } from '@/components/ProjectShowcase';
import { GitHubIcon } from '../Icons';
import { copyText } from '@/components/copyText';
import {
  Sidebar, SidebarHeading, SidebarItem, Toolbar, ToolbarButton, useWidthClass,
  ChevronLeft, ChevronRight, ArrowUpRight, CheckIcon, ShareIcon, SearchLine,
} from '../Native';

// Deep link (Spotlight, Photos): pending is read on mount; the event covers an
// open window.
let pendingDetail: string | null = null;
export function requestProjectDetail(title: string) {
  pendingDetail = title;
  window.dispatchEvent(new CustomEvent('openProjectDetail', { detail: { title } }));
}

// Library data
type Filter = 'all' | 'web' | 'mobile';
type Project = (typeof projects)[number];

const FILTERS: { id: Filter; label: string; title: string }[] = [
  { id: 'all',    label: 'All Projects', title: 'All Projects' },
  { id: 'web',    label: 'Web apps',     title: 'Web apps' },
  { id: 'mobile', label: 'Mobile apps',  title: 'Mobile apps' },
];
const countOf = (f: Filter) => projects.filter(p => f === 'all' || p.platform === f).length;
const featured = projects[0];

// Library icons
const GridIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.8" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.8" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.8" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.8" /></svg>;
const WebIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="3" y="4.5" width="18" height="15" rx="2" /><path d="M3 9h18" /></svg>;
const PhoneIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M10.5 18.5h3" strokeLinecap="round" /></svg>;
const ListIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01" /></svg>;
const FILTER_ICON: Record<Filter, React.ReactNode> = { all: <GridIcon />, web: <WebIcon />, mobile: <PhoneIcon /> };

// Covers: web projects in a browser frame, mobile ones as a fan of phones
function PhoneFan({ p, dark, width, sizes }: { p: Project; dark: boolean; width: number; sizes: string }) {
  const shots = shotsFor(p.title).filter(isTallShot);
  const [mid, left, right] = [shots[0], shots[1], shots.length > 2 ? shots[shots.length - 1] : undefined];
  if (!mid) return null;
  const side = Math.round(width * 0.86);
  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      {left && <Phone shot={left} width={side} sizes={sizes} style={{ position: 'absolute', right: '50%', marginRight: width * 0.28, top: width * 0.2, transform: 'rotate(-8deg)' }} />}
      {right && <Phone shot={right} width={side} sizes={sizes} style={{ position: 'absolute', left: '50%', marginLeft: width * 0.28, top: width * 0.2, transform: 'rotate(8deg)' }} />}
      <Phone shot={mid} width={width} sizes={sizes} alt={`${p.title} screens`} shadow={dark ? '0 22px 40px rgba(0,0,0,.5)' : '0 22px 40px rgba(80,40,10,.3)'} style={{ position: 'relative' }} />
    </div>
  );
}

function CardCover({ p, dark }: { p: Project; dark: boolean }) {
  const tk = T(dark);
  if (p.platform === 'mobile') {
    return (
      <div style={{ position: 'relative', aspectRatio: '16 / 10', borderRadius: 10, overflow: 'hidden', background: dark ? '#2b2520' : '#f4ede6' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '10%' }}>
          <PhoneFan p={p} dark={dark} width={86} sizes="90px" />
        </div>
      </div>
    );
  }
  return p.cover
    ? <Browser shot={p.cover} label={p.title} dark={dark} aspect="16 / 10" sizes="(max-width: 1400px) 300px, 380px" />
    : <div style={{ position: 'relative', aspectRatio: '16 / 10', borderRadius: 10, overflow: 'hidden', boxShadow: `0 0 0 .5px ${tk.sep}` }}>
        <ProjectCover title={p.title} shot={null} sizes="300px" dark={dark} />
      </div>;
}

// Featured banner
function Featured({ dark, onOpen, roomy, hidden, animate }: { dark: boolean; onOpen: () => void; roomy: boolean; hidden: boolean; animate: boolean }) {
  const p = featured;
  const detail = projectDetails.find(d => d.title === p.title);
  const ink = dark ? '#f5f5f7' : '#1d1d1f';
  return (
    <div style={{
      position: 'relative', height: 300, borderRadius: 18, overflow: 'hidden',
      background: dark ? '#2b2520' : '#f4ede6', color: ink,
      display: hidden ? 'none' : undefined, animation: animate ? 'contentFadeIn .4s ease both' : undefined,
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${dark ? 'rgba(255,220,180,.07)' : 'rgba(120,80,40,.11)'} 1px, transparent 1px)`, backgroundSize: '14px 14px' }} />
      <div style={{ position: 'relative', height: '100%', maxWidth: roomy ? '56%' : '100%', padding: '30px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.9px', textTransform: 'uppercase', color: dark ? '#e3a56f' : '#93511e' }}>
          Featured · {PLATFORM[p.platform]} · {p.year}
        </div>
        <h3 style={{ marginTop: 6, fontSize: 42, fontWeight: 700, letterSpacing: '-1.4px', lineHeight: 1 }}>{p.title}</h3>
        <p style={{ marginTop: 10, fontSize: 16, lineHeight: 1.4, color: dark ? '#d6cfc8' : '#4a4038', maxWidth: 360 }}>{p.tagline}</p>
        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {stackOf(p).map(t => (
            <span key={t} style={{ padding: '4px 10px', borderRadius: 7, fontSize: 12.5, fontWeight: 500, background: dark ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.8)' }}>{t}</span>
          ))}
        </div>
        <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
          <button onClick={onOpen} style={{
            padding: '9px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600,
            background: ink, color: dark ? '#1d1d1f' : '#fff', transition: 'transform .15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
          >
            Open project
          </button>
          {detail?.githubrepo && (
            <a href={detail.githubrepo} target="_blank" rel="noopener noreferrer" style={{
              padding: '9px 16px', borderRadius: 10, fontSize: 14, fontWeight: 500,
              background: dark ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.85)', color: ink,
            }}>
              GitHub
            </a>
          )}
        </div>
      </div>
      {roomy && (
        <div style={{ position: 'absolute', right: '4%', top: 34, width: '40%' }}>
          <PhoneFan p={p} dark={dark} width={150} sizes="160px" />
        </div>
      )}
    </div>
  );
}

// Grid card and list row
function Card({ p, dark, onOpen, i, hidden, animate }: { p: Project; dark: boolean; onOpen: () => void; i: number; hidden: boolean; animate: boolean }) {
  const tk = T(dark);
  const tags = stackOf(p);
  const shown = tags.slice(0, 3);
  return (
    <button
      onClick={onOpen}
      aria-label={`Open ${p.title}`}
      style={{ textAlign: 'left', display: hidden ? 'none' : 'flex', flexDirection: 'column', gap: 12, animation: animate ? `contentFadeIn .4s ${i * 0.05}s ease both` : undefined }}
      onMouseEnter={e => { (e.currentTarget.firstChild as HTMLElement).style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { (e.currentTarget.firstChild as HTMLElement).style.transform = 'none'; }}
    >
      <div style={{ transition: 'transform .2s cubic-bezier(.2,.8,.3,1)' }}>
        <CardCover p={p} dark={dark} />
      </div>
      <div style={{ padding: '0 2px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: tk.label }}>{p.title}</span>
          <span style={{ fontSize: 13, color: tk.label2 }}>{p.year}</span>
          {hasLiveDemo(p.title) && <LiveBadge dark={dark} />}
        </span>
        <span style={{ fontSize: 13.5, lineHeight: 1.4, color: tk.label }}>{p.tagline}</span>
        <span style={{ fontSize: 12.5, color: tk.label2 }}>
          {shown.join(' · ')}{tags.length > shown.length ? ` · +${tags.length - shown.length}` : ''}
        </span>
      </div>
    </button>
  );
}

function LiveBadge({ dark }: { dark: boolean }) {
  return (
    <span style={{
      marginLeft: 'auto', alignSelf: 'center', flexShrink: 0, fontSize: 11.5, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
      background: 'rgba(52,199,89,.14)', color: dark ? '#34c759' : '#166534',
    }}>Live demo</span>
  );
}

function Row({ p, dark, onOpen, last, hidden }: { p: Project; dark: boolean; onOpen: () => void; last: boolean; hidden: boolean }) {
  const tk = T(dark);
  return (
    <button
      onClick={onOpen}
      style={{ width: '100%', textAlign: 'left', display: hidden ? 'none' : 'flex', alignItems: 'center', gap: 14, padding: '10px 10px', borderRadius: 10, transition: 'background .12s' }}
      onMouseEnter={e => (e.currentTarget.style.background = tk.fill)}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <span style={{ position: 'relative', width: 72, height: 46, flexShrink: 0, borderRadius: 7, overflow: 'hidden', background: tk.paneAlt, boxShadow: `0 0 0 .5px ${tk.sep}` }}>
        <ProjectCover title={p.title} shot={p.cover} sizes="72px" dark={dark} size="xs" pad={3} />
      </span>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 0 }}>
        <span style={{ fontSize: 14.5, fontWeight: 600, color: tk.label }}>{p.title}</span>
        <span style={{ fontSize: 13, color: tk.label2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.tagline}</span>
      </span>
      <span style={{ fontSize: 12.5, color: tk.label2, flexShrink: 0 }}>{PLATFORM[p.platform]}</span>
      <span style={{ fontSize: 12.5, color: tk.label2, flexShrink: 0, width: 36, textAlign: 'right' }}>{p.year}</span>
      <span style={{ color: tk.label3, display: 'inline-flex' }}><ChevronRight s={14} /></span>
      {!last && <span />}
    </button>
  );
}

export default function ProjectsWindow({ dark }: { dark: boolean }) {
  const tk = T(dark);
  // 0: no sidebar, 1: sidebar; the showcase stacks its columns under 900
  const [ref, size] = useWidthClass<HTMLDivElement>([760, 1000]);
  const wide = size >= 1;
  const [filter, setFilter] = useState<Filter>('all');
  const [detail, setDetail] = useState<string | null>(null);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  // Fade in on open only, not on every filter change
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (pendingDetail && projects.some(p => p.title === pendingDetail)) setDetail(pendingDetail);
    pendingDetail = null;
    const h = (e: Event) => {
      const t = (e as CustomEvent<{ title: string }>).detail?.title;
      if (t && projects.some(p => p.title === t)) { pendingDetail = null; setDetail(t); }
    };
    window.addEventListener('openProjectDetail', h);
    return () => window.removeEventListener('openProjectDetail', h);
  }, []);
  useEffect(() => { scroller.current?.scrollTo({ top: 0 }); }, [detail, filter]);

  const q = query.trim().toLowerCase();
  const matches = projects.filter(p =>
    (filter === 'all' || p.platform === filter) &&
    (!q || [p.title, p.tagline, p.techStack, p.description].join(' ').toLowerCase().includes(q)));
  const showFeatured = filter === 'all' && !q && !detail;
  const listed = showFeatured && layout === 'grid' ? matches.filter(p => p !== featured) : matches;
  const cur = detail ? projects.find(p => p.title === detail)! : null;
  const curDetail = detail ? projectDetails.find(d => d.title === detail) : null;

  const copyLink = () => {
    if (!detail) return;
    copyText(`${ME.portfolio}/project/${encodeURIComponent(detail)}`).then(ok => {
      if (!ok) return;
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };
  const pickFilter = (f: Filter) => { setFilter(f); setDetail(null); };

  return (
    <div ref={ref} style={{ flex: 1, minWidth: 0, display: 'flex', color: tk.label }}>
      {wide && (
        <Sidebar
          dark={dark} width={220} label="Library"
          footer={
            <a href={ME.github} target="_blank" rel="noopener noreferrer" style={{
              height: 32, display: 'flex', alignItems: 'center', gap: 9, padding: '0 10px', borderRadius: 8, fontSize: 13, color: tk.label,
            }}
              onMouseEnter={e => (e.currentTarget.style.background = dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <GitHubIcon s={16} /><span style={{ flex: 1 }}>All repos on GitHub</span>
              <span style={{ color: tk.label2, display: 'inline-flex' }}><ArrowUpRight /></span>
            </a>
          }
        >
          <SidebarHeading dark={dark}>Library</SidebarHeading>
          {FILTERS.map(f => (
            <SidebarItem
              key={f.id} dark={dark} label={f.label} count={countOf(f.id)}
              icon={<span style={{ color: tk.accent, display: 'inline-flex' }}>{FILTER_ICON[f.id]}</span>}
              selected={!detail && filter === f.id} onClick={() => pickFilter(f.id)}
            />
          ))}
          <SidebarHeading dark={dark}>Projects</SidebarHeading>
          {projects.map(p => (
            <SidebarItem
              key={p.title} dark={dark} label={p.title} selected={detail === p.title}
              onClick={() => setDetail(p.title)}
              icon={
                <span style={{ position: 'relative', width: 22, height: 22, flexShrink: 0, borderRadius: 5, overflow: 'hidden', background: tk.pane, boxShadow: '0 0 0 .5px rgba(0,0,0,.15)' }}>
                  <ProjectCover title={p.title} shot={p.cover} sizes="24px" dark={dark} size="xs" pad={1} />
                </span>
              }
            />
          ))}
        </Sidebar>
      )}

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: tk.pane }}>
        <Toolbar style={{ padding: wide ? '0 16px 0 22px' : '0 16px 0 88px', gap: 10 }}>
          {detail && cur ? (
            <>
              <ToolbarButton dark={dark} label="Back" onClick={() => setDetail(null)}><ChevronLeft /></ToolbarButton>
              <h2 style={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap' }}>{cur.title}</h2>
              <span style={{ fontSize: 13, color: tk.label2 }}>{cur.year}</span>
              <span style={{ flex: 1 }} />
              {curDetail?.githubrepo && (
                <a href={curDetail.githubrepo} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7, height: 30, padding: '0 13px', borderRadius: 8,
                  background: tk.select, color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', transition: 'filter .15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
                  onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
                >
                  <GitHubIcon s={15} />{size >= 1 ? 'View on GitHub' : 'GitHub'}
                </a>
              )}
              {curDetail?.isLive && curDetail.livelink && (
                <a href={curDetail.livelink} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', borderRadius: 8,
                  background: tk.fill, color: tk.label, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
                }}>Live demo <ArrowUpRight /></a>
              )}
              <ToolbarButton dark={dark} label={copied ? 'Link copied' : 'Copy link to this project'} onClick={copyLink}>
                {copied ? <CheckIcon s={16} /> : <ShareIcon s={16} />}
              </ToolbarButton>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>{FILTERS.find(f => f.id === filter)!.title}</h2>
                <span style={{ fontSize: 11.5, color: tk.label2 }}>{matches.length} project{matches.length === 1 ? '' : 's'}</span>
              </div>
              <span style={{ flex: 1 }} />
              <div role="group" aria-label="View as" style={{ display: 'flex', padding: 2, borderRadius: 8, background: tk.fill }}>
                {(['grid', 'list'] as const).map(l => (
                  <button key={l} aria-label={l === 'grid' ? 'Grid' : 'List'} aria-pressed={layout === l} onClick={() => setLayout(l)} style={{
                    width: 30, height: 24, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: layout === l ? (dark ? 'rgba(255,255,255,.16)' : '#fff') : 'transparent',
                    boxShadow: layout === l ? '0 1px 2px rgba(0,0,0,.12)' : 'none', color: tk.label,
                  }}>
                    {l === 'grid' ? <GridIcon /> : <ListIcon />}
                  </button>
                ))}
              </div>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 6, height: 28, width: size >= 2 ? 220 : 150, padding: '0 9px',
                borderRadius: 8, background: tk.fill, color: tk.label2,
              }}>
                <SearchLine />
                <input
                  type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" aria-label="Search projects"
                  style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: tk.label }}
                />
              </label>
            </>
          )}
        </Toolbar>

        {!wide && !detail && (
          <div role="group" aria-label="Library" style={{
            margin: '0 16px 10px', padding: 2, borderRadius: 8, background: tk.fill,
            display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          }}>
            {FILTERS.map(f => (
              <button key={f.id} aria-pressed={filter === f.id} onClick={() => pickFilter(f.id)} style={{
                height: 24, borderRadius: 6, fontSize: 12, fontWeight: filter === f.id ? 600 : 500, color: tk.label,
                background: filter === f.id ? (dark ? 'rgba(255,255,255,.16)' : '#fff') : 'transparent',
                boxShadow: filter === f.id ? '0 1px 2px rgba(0,0,0,.12)' : 'none',
              }}>
                {f.id === 'all' ? 'All' : f.label.replace(' apps', '')}
              </button>
            ))}
          </div>
        )}

        <div ref={scroller} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {detail ? (
            <Showcase key={detail} title={detail} dark={dark} stacked={size < 2} />
          ) : (
            <div style={{ padding: '4px 24px 28px' }}>
              {/* Filters hide cards instead of unmounting them, so images don't reload */}
              {layout === 'grid' && <Featured dark={dark} roomy={size >= 1} onOpen={() => setDetail(featured.title)} hidden={!showFeatured} animate={!settled} />}
              {showFeatured && layout === 'grid' && (
                <h3 style={{ margin: '26px 2px 12px', fontSize: 17, fontWeight: 600 }}>All projects</h3>
              )}
              {listed.length === 0 ? (
                <div style={{ padding: '60px 0', textAlign: 'center', color: tk.label2, fontSize: 14 }}>
                  No projects match “{query.trim()}”
                </div>
              ) : layout === 'grid' ? (
                // Tracks stretch to fill a wide window; one or two results keep card size
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(220px, ${listed.length < 3 ? '340px' : '1fr'}))`, gap: '24px 20px' }}>
                  {projects.map(p => (
                    <Card key={p.title} p={p} dark={dark} i={Math.max(0, listed.indexOf(p))} onOpen={() => setDetail(p.title)} hidden={!listed.includes(p)} animate={!settled} />
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {projects.map(p => (
                    <Row key={p.title} p={p} dark={dark} last={p === listed[listed.length - 1]} onOpen={() => setDetail(p.title)} hidden={!listed.includes(p)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
