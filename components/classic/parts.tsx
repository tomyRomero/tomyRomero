import Image from 'next/image';
import { ME, profilePhoto, resumeFile, isTallShot, type Tint, type Shot } from '@/constants';
import { APP_BG, appGlyph } from '@/components/mac/appIcons';
import { matColors, TINTS } from '@/components/projectColors';
import { SECTIONS } from './shared';
import ThemeToggle from './ThemeToggle';
import ClassicMenu from './ClassicMenu';
import s from './classic.module.css';

export type Vars = React.CSSProperties & Record<`--${string}`, string>;

const WindowGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="15" rx="3" /><path d="M3 9h18" />
  </svg>
);

// base is '' on the classic page and '/classic' on project pages
export function ClassicBar({ base }: { base: '' | '/classic' }) {
  return (
    <header className={s.bar}>
      <div className={s.barInner}>
        <a href={base || '#top'} className={s.brand}>
          <span className={s.brandPhoto}><Image src={profilePhoto} alt="" fill sizes="30px" style={{ objectFit: 'cover' }} /></span>
          {ME.name}
        </a>
        <nav aria-label="Sections" className={s.links}>
          {SECTIONS.map(x => (
            <a key={x.id} href={`${base}#${x.id}`} aria-current={base && x.id === 'projects' ? 'true' : undefined}>{x.label}</a>
          ))}
        </nav>
        <div className={s.tools}>
          <ThemeToggle />
          {/* In the menu on phones */}
          <a href="/" className={`${s.pill} ${s.deskOnly}`}><WindowGlyph />Mac view</a>
          <a href={resumeFile.href} download={resumeFile.filename} className={`${s.pill} ${s.primary} ${s.deskOnly}`}>Resume</a>
          <ClassicMenu base={base} resume={{ href: resumeFile.href, filename: resumeFile.filename }} />
        </div>
      </div>
    </header>
  );
}

export function ClassicFooter() {
  return (
    <footer className={s.footer}>
      <span>{ME.name} · {ME.location}</span>
      <a href="/">
        <span className={s.deskOnly}>Back to Mac view</span>
        <span className={s.phoneOnly}>Back to iPhone view</span>
      </a>
    </footer>
  );
}

export function Head({ app, title, id }: { app: 'projects' | 'experience' | 'skills'; title: string; id?: string }) {
  return (
    <div className={s.head}>
      <span aria-hidden="true" className={s.appTile} style={{ background: APP_BG[app] }}>{appGlyph(app, 'cl', .66)}</span>
      <h2 id={id}>{title}</h2>
    </div>
  );
}

export function Monogram({ text, t }: { text: string; t: Tint }) {
  const c = TINTS[t];
  const style: Vars = { '--fg': c.fg, '--bg': c.bg, '--fg-d': c.fgDark, '--bg-d': c.bgDark };
  return <span aria-hidden="true" className={s.monogram} style={style}>{text}</span>;
}

// The mat's height is --mat-h, so wide shots scale with it
export function Mat({ title, shot, sizes }: { title: string; shot: Shot | null; sizes: { tall: string; wide: string } }) {
  const [a, b, c, d] = matColors(title);
  const mat: Vars = { '--mat': `linear-gradient(135deg, ${a}, ${b})`, '--mat-d': `linear-gradient(135deg, ${c}, ${d})` };
  const tall = isTallShot(shot ?? undefined);
  return (
    <div className={s.mat} style={mat}>
      {shot && (
        <span className={`${s.shot} ${shot.framed ? s.shotFramed : s.shotFlat}`} style={{
          aspectRatio: `${shot.w} / ${shot.h}`,
          ...(tall ? { height: '86%' } : { width: `min(84%, calc(var(--mat-h) * .86 * ${(shot.w / shot.h).toFixed(3)}))` }),
        }}>
          <Image
            src={shot.src} alt={`${title} screenshot`} fill sizes={tall ? sizes.tall : sizes.wide}
            style={{ objectFit: 'cover', objectPosition: 'top' }}
          />
        </span>
      )}
    </div>
  );
}
