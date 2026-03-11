'use client';
import Image from 'next/image';
import { T } from '../tokens';
import { Chip } from '../Atoms';
import { ME, images, profilePhoto } from '@/constants';

const CHIPS = ['ASP.NET Core', 'React', 'SQL Server', 'Azure', 'Healthcare IT', 'SaaS Builder', 'BI / Analytics'];

export default function AboutWindow({ dark }: { dark: boolean }) {
  const tk = T(dark);

  return (
    <div style={{ padding: '22px 24px', color: tk.text }}>
      {/* Header: avatar + name */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
        <div style={{
          width: 76, height: 76, borderRadius: 20, flexShrink: 0, overflow: 'hidden',
          border: '2px solid rgba(212,148,58,.28)',
          boxShadow: '0 6px 24px rgba(212,148,58,.22)',
          position: 'relative',
        }}>
          <Image
            src={profilePhoto}
            alt="Tomy Romero"
            fill
            style={{ objectFit: 'cover' }}
            sizes="76px"
          />
        </div>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-serif), serif', fontSize: 24, fontWeight: 400,
            letterSpacing: '-.4px', color: tk.text, lineHeight: 1.15,
          }}>
            {ME.name}
          </h1>
          <div style={{ color: tk.accent, fontSize: 13.5, fontWeight: 500, marginTop: 4 }}>{ME.title}</div>
          <div style={{ color: tk.textMuted, fontSize: 12.5, marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="9" height="12" viewBox="0 0 9 12" fill={tk.accent} style={{ flexShrink: 0 }}>
              <path d="M4.5 0C2 0 0 2 0 4.5c0 3.5 4.5 7.5 4.5 7.5S9 8 9 4.5C9 2 7 0 4.5 0zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
            </svg>
            {ME.location}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={{
        background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
        borderRadius: 12, padding: '14px 16px',
        fontSize: 13.5, lineHeight: 1.74, color: tk.textSub, marginBottom: 18,
      }}>
        {ME.bio}
      </div>

      {/* Tech chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 18 }}>
        {CHIPS.map(t => <Chip key={t} amber dark={dark}>{t}</Chip>)}
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 18 }}>
        {([
          ['⑂  GitHub',   ME.github],
          ['🔗  LinkedIn', ME.linkedin],
          ['🌐  Portfolio', ME.portfolio],
        ] as [string, string][]).map(([l, h]) => (
          <a
            key={l} href={h} target="_blank" rel="noopener noreferrer"
            style={{
              padding: '7px 16px', borderRadius: 9, fontSize: 12.5,
              fontFamily: 'var(--font-mono), monospace',
              background: tk.accentBg, border: `1px solid ${tk.accentBorder}`,
              color: tk.accent, textDecoration: 'none', fontWeight: 500,
              transition: 'opacity .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {l}
          </a>
        ))}
      </div>

      {/* Open to work badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(52,199,89,.1)', border: '1px solid rgba(52,199,89,.24)',
        padding: '7px 16px', borderRadius: 22, marginBottom: 22,
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%', background: '#34c759',
          boxShadow: '0 0 6px #34c759', animation: 'pulse 2s infinite',
        }} />
        <span style={{ fontSize: 12.5, color: '#34c759', fontFamily: 'var(--font-mono), monospace' }}>
          Open to opportunities
        </span>
      </div>

      {/* Photos strip */}
      <div style={{
        fontSize: 10.5, fontFamily: 'var(--font-mono), monospace',
        color: tk.accent, textTransform: 'uppercase', letterSpacing: '1.1px', marginBottom: 10,
      }}>
        Photos
      </div>
      <div style={{
        display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6,
        scrollbarWidth: 'thin',
        scrollbarColor: `${dark ? 'rgba(255,255,255,.16)' : 'rgba(0,0,0,.16)'} transparent`,
      }}>
        {images.map((item, i) => (
          <div key={i} style={{ position: 'relative', flexShrink: 0, width: 120, height: 84, borderRadius: 10, overflow: 'hidden', border: `1px solid ${tk.cardBorder}` }}>
            <Image
              src={item.img}
              alt={item.alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="120px"
              title={item.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
