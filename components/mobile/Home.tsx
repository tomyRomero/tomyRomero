'use client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ME, profilePhoto, projects, totalSkills, yearsExperience, shotsFor, shotLabel, isTallShot } from '@/constants';
import { S } from '@/components/mac/widgets/WidgetFrame';
import { GitHubIcon, LinkedInIcon, MoonIcon, SunIcon, PinIcon } from '@/components/mac/Icons';
import { requestResume } from '@/components/mac/ResumeDialog';
import { APP_BG, appGlyph } from '@/components/mac/appIcons';
import { Link } from '@/components/nav';

export type AppId = 'about' | 'work' | 'experience' | 'contact' | 'skills' | 'photos' | 'weather';
export type Open = (id: AppId, from: HTMLElement | null) => void;

// Live widgets load after the page; their tiles hold the space until then
const WeatherWidget = dynamic(() => import('@/components/mac/Widgets').then(m => m.WeatherWidget), { ssr: false });
const PhotosWidget  = dynamic(() => import('@/components/mac/Widgets').then(m => m.PhotosWidget), { ssr: false });

// The first photo is server-rendered so LCP doesn't wait for the widget chunk
const FIRST = projects.flatMap(p => shotsFor(p.title).map(s => ({ ...s, album: p.title }))).find(s => s.vivid && !isTallShot(s));

const SPLATS: [string, number, string][] = [
  ['40% 24% at 16% 22%', .30, '10,132,255'], ['30% 20% at 86% 12%', .26, '255,55,95'],
  ['36% 24% at 82% 56%', .24, '191,90,242'], ['34% 22% at 18% 70%', .34, '255,214,10'],
  ['40% 20% at 62% 92%', .26, '48,209,88'],  ['26% 18% at 44% 42%', .24, '100,210,255'],
  ['22% 14% at 90% 84%', .26, '255,159,10'],
];
const wallpaper = (dark: boolean) => [
  ...SPLATS.map(([at, a, rgb]) => `radial-gradient(${at}, rgba(${rgb},${dark ? Math.min(a, .3) : a}), transparent 70%)`),
  dark ? '#141416' : '#f7f5f0',
].join(', ');

const labelStyle = (dark: boolean): React.CSSProperties => ({
  fontSize: 12, fontWeight: 500, lineHeight: 1.2, color: dark ? '#f5f5f7' : '#1d1d1f',
  textShadow: dark ? '0 1px 3px rgba(0,0,0,.6)' : '0 1px 2px rgba(255,255,255,.6)', whiteSpace: 'nowrap',
});

function Tile({ bg, glyph, dock = false }: { bg: string; glyph: React.ReactNode; dock?: boolean }) {
  return (
    <span style={{
      position: 'relative', width: 'min(62px, 100%)', aspectRatio: '1', borderRadius: '23%', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg,
      boxShadow: `0 ${dock ? 3 : 5}px ${dock ? 10 : 14}px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.22)`,
    }}>
      <span aria-hidden="true" style={{
        position: 'absolute', top: 0, left: '-6%', right: '6%', height: '54%',
        background: 'linear-gradient(170deg,rgba(255,255,255,.28) 0%,rgba(255,255,255,.06) 50%,transparent 100%)',
      }} />
      <span style={{ position: 'relative', display: 'inline-flex' }}>{glyph}</span>
    </span>
  );
}

const cell: React.CSSProperties = {
  minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
  color: 'inherit', textDecoration: 'none', WebkitTapHighlightColor: 'transparent',
};

export default function Home({ dark, setDark, open, homeRef }: {
  dark: boolean; setDark: (v: boolean) => void; open: Open; homeRef: React.RefObject<HTMLDivElement>;
}) {
  const ink = dark ? '#f5f5f7' : '#1d1d1f';
  const sub = dark ? 'rgba(245,245,247,.72)' : 'rgba(29,29,31,.66)';
  const glass: React.CSSProperties = {
    background: dark ? 'rgba(36,36,40,.56)' : 'rgba(255,255,255,.6)',
    backdropFilter: 'blur(26px) saturate(1.8)', WebkitBackdropFilter: 'blur(26px) saturate(1.8)',
    boxShadow: `0 8px 28px rgba(0,0,0,${dark ? .3 : .1}), inset 0 0 0 .5px rgba(255,255,255,${dark ? .08 : .4})`,
  };
  const chip: React.CSSProperties = {
    padding: '4px 8px', borderRadius: 8, fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap',
    background: dark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.06)', color: ink,
  };
  // Zoom from the tile around the tapped control
  const tap = (id: AppId) => (e: React.MouseEvent<HTMLElement>) => open(id, e.currentTarget);

  return (
    <div ref={homeRef} style={{ position: 'absolute', inset: 0, background: wallpaper(dark) }}>
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', overscrollBehavior: 'contain' }}>
        <h1 className="sr-only">{`${ME.name}, ${ME.title}`}</h1>
        <div className="m-grid" style={{
          maxWidth: 440, margin: '0 auto', boxSizing: 'border-box',
          padding: 'calc(18px + env(safe-area-inset-top, 0px)) var(--m-pad) calc(170px + env(safe-area-inset-bottom, 0px))',
          display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', columnGap: 'var(--m-gap)', rowGap: 18, alignItems: 'start',
        }}>
          <div style={{ ...cell, gridColumn: '1 / -1' }}>
            <div data-app="about" className="m-press" style={{ ...glass, position: 'relative', width: '100%', aspectRatio: '336 / 157', borderRadius: 22 }}>
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: '4.8%', padding: '0 5%' }}>
                <span style={{ position: 'relative', width: '28%', aspectRatio: '1', flexShrink: 0, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 3px rgba(255,255,255,.75)' }}>
                  <Image src={profilePhoto} alt="" fill sizes="104px" priority style={{ objectFit: 'cover' }} />
                </span>
                <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3, color: ink }}>
                  <span style={{ fontSize: 'clamp(16px, 4.9vw, 20px)', fontWeight: 700, letterSpacing: '-.3px', whiteSpace: 'nowrap' }}>{ME.name}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: sub }}>{ME.title}</span>
                  <span style={{ fontSize: 12.5, color: sub, display: 'flex', alignItems: 'center', gap: 4 }}><PinIcon s={11} />{ME.location}</span>
                  <span style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                    <span style={chip}>{yearsExperience()} Years</span>
                    <span style={chip}>{projects.length} Projects</span>
                    <span style={chip}>{totalSkills} Skills</span>
                  </span>
                </span>
              </div>
              <button
                onClick={tap('about')}
                aria-label={`About Me: ${ME.name}, ${ME.title}, ${ME.location}. Open About Me`}
                className="widget-hit" style={{ position: 'absolute', inset: 0, borderRadius: 22 }}
              />
              <button
                onClick={() => setDark(!dark)}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                style={{
                  position: 'absolute', top: 8, right: 8, width: 36, height: 36, borderRadius: '50%', zIndex: 1,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: sub,
                  background: dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.05)',
                }}
              >
                {dark ? <SunIcon s={16} /> : <MoonIcon s={16} />}
              </button>
            </div>
            <span style={labelStyle(dark)}>About Me</span>
          </div>

          <div style={{ ...cell, gridColumn: 'span 2' }}>
            <div data-app="weather" className="m-press" style={{
              width: '100%', aspectRatio: '1', borderRadius: 22, background: 'linear-gradient(180deg,#3d8fe0 0%,#6db3f2 100%)',
            }}>
              <WeatherWidget dark={dark} onOpen={() => open('weather', null)} fluid />
            </div>
            <span style={labelStyle(dark)}>Weather</span>
          </div>
          <div style={{ ...cell, gridColumn: 'span 2' }}>
            <div data-app="photos" className="m-press" style={{ ...glass, position: 'relative', width: '100%', aspectRatio: '1', borderRadius: 22 }}>
              {FIRST && (
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 22, overflow: 'hidden' }}>
                  <Image
                    src={FIRST.src} alt="" fill priority sizes={`${Math.ceil(S * Math.max(1, FIRST.w / FIRST.h))}px`}
                    style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.55) 0%, rgba(0,0,0,.14) 34%, transparent 52%)' }} />
                  <div style={{ position: 'absolute', left: 13, right: 13, bottom: 11, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,.35)' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: '-.1px' }}>{FIRST.album}</div>
                    <div style={{ fontSize: 11, fontWeight: 500, opacity: .88, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shotLabel(FIRST)}</div>
                  </div>
                </div>
              )}
              <PhotosWidget dark={dark} onOpen={() => open('photos', null)} fluid first={FIRST?.src} />
            </div>
            <span style={labelStyle(dark)}>Photos</span>
          </div>

          <button data-app="skills" onClick={tap('skills')} className="m-press" style={cell}>
            <Tile bg={APP_BG.skills} glyph={appGlyph('skills', 'mh', .95)} />
            <span style={labelStyle(dark)}>Skills</span>
          </button>
          <button onClick={() => requestResume()} className="m-press" style={cell}>
            <Tile bg={APP_BG.resume} glyph={appGlyph('resume', 'mh', .95)} />
            <span style={labelStyle(dark)}>Resume</span>
          </button>
          <a href={ME.github} target="_blank" rel="noopener noreferrer" className="m-press" style={cell}>
            <Tile bg="linear-gradient(160deg,#454b55 0%,#24292f 55%,#16191d 100%)" glyph={<span style={{ color: '#fff', display: 'inline-flex' }}><GitHubIcon s={30} /></span>} />
            <span style={labelStyle(dark)}>GitHub</span>
          </a>
          <a href={ME.linkedin} target="_blank" rel="noopener noreferrer" className="m-press" style={cell}>
            <Tile bg="linear-gradient(160deg,#2f8be0 0%,#0a66c2 55%,#07509a 100%)" glyph={<span style={{ color: '#fff', display: 'inline-flex' }}><LinkedInIcon s={27} /></span>} />
            <span style={labelStyle(dark)}>LinkedIn</span>
          </a>
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 'calc(116px + env(safe-area-inset-bottom, 0px))',
        display: 'flex', justifyContent: 'center', pointerEvents: 'none',
      }}>
        <Link href="/classic" className="m-press" style={{
          ...glass, pointerEvents: 'auto', height: 32, padding: '0 14px', borderRadius: 16,
          display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: ink,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="4" y="3" width="16" height="18" rx="3" /><path d="M8 8h8M8 12h8M8 16h5" />
          </svg>
          Classic view
        </Link>
      </div>

      <nav aria-label="Sections" style={{
        position: 'absolute', left: 0, right: 0, bottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
        display: 'flex', justifyContent: 'center', padding: '0 10px', pointerEvents: 'none',
      }}>
        <div style={{
          ...glass, pointerEvents: 'auto', width: '100%', maxWidth: 420, height: 92, boxSizing: 'border-box', borderRadius: 34,
          background: dark ? 'rgba(44,44,50,.46)' : 'rgba(255,255,255,.4)',
          padding: '0 calc(var(--m-pad) - 10px)', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          columnGap: 'var(--m-gap)', alignItems: 'center', justifyItems: 'center',
        }}>
          {([['about', 'About Me', 'about'], ['work', 'Projects', 'projects'], ['experience', 'Experience', 'experience'], ['contact', 'Contact', 'contact']] as const).map(([id, label, art]) => (
            <button key={id} data-app={id} onClick={tap(id)} aria-label={label} className="m-press" style={{ ...cell, width: '100%' }}>
              <Tile bg={APP_BG[art]} glyph={appGlyph(art, 'mh', .95)} dock />
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
