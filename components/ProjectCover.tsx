'use client';
import Image from 'next/image';
import { isTallShot, type Shot } from '@/constants';
import { hueOf } from '@/components/projectColors';

// Fills its (position: relative) parent; a title card when there's no screenshot
export default function ProjectCover({ title, shot, sizes, dark, pad = 8, size = 'md', priority = false }: {
  title: string;
  shot: Shot | null | undefined;
  sizes: string;
  dark: boolean;
  pad?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  priority?: boolean;
}) {
  if (!shot) return <TitleCard title={title} dark={dark} size={size} />;

  const tall = isTallShot(shot);
  return (
    <>
      {tall && (
        <Image
          src={shot.src} alt="" aria-hidden fill sizes={sizes} priority={priority}
          style={{ objectFit: 'cover', filter: 'blur(16px) saturate(1.3)', transform: 'scale(1.25)', opacity: .8 }}
        />
      )}
      <Image
        src={shot.src} alt={`${title} screenshot`} fill sizes={sizes} priority={priority}
        style={tall ? { objectFit: 'contain', padding: pad } : { objectFit: 'cover', objectPosition: 'top' }}
      />
    </>
  );
}

const FONT = { xs: 13, sm: 15, md: 24, lg: 34 };

function TitleCard({ title, dark, size }: { title: string; dark: boolean; size: keyof typeof FONT }) {
  const hue = hueOf(title);
  const dot = dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)';
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: dark
        ? `radial-gradient(120% 100% at 15% 0%, hsl(${hue} 42% 26%), hsl(${(hue + 40) % 360} 34% 13%))`
        : `radial-gradient(120% 100% at 15% 0%, hsl(${hue} 80% 94%), hsl(${(hue + 40) % 360} 55% 84%))`,
    }}>
      {size !== 'xs' && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(${dot} 1px, transparent 1px)`,
          backgroundSize: '14px 14px',
        }} />
      )}
      <span style={{
        position: 'relative', padding: '0 12%', textAlign: 'center',
        fontSize: FONT[size], fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.1,
        color: dark ? 'rgba(255,255,255,.92)' : `hsl(${hue} 40% 22%)`,
      }}>
        {size === 'xs' ? title.charAt(0) : title}
      </span>
    </div>
  );
}
