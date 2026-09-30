'use client';
import Image from 'next/image';
import type { Shot } from '@/constants';

// shot.framed images already include the device, so they aren't framed again

export function Phone({ shot, width, alt = '', sizes, priority, shadow = '0 16px 30px rgba(0,0,0,.26)', style }: {
  shot: Shot; width: number | string; alt?: string; sizes: string; priority?: boolean;
  shadow?: string; style?: React.CSSProperties;
}) {
  if (shot.framed) {
    return (
      <div style={{
        position: 'relative', width, aspectRatio: `${shot.w} / ${shot.h}`, flexShrink: 0,
        filter: `drop-shadow(${shadow})`, ...style,
      }}>
        <Image src={shot.src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: 'contain' }} />
      </div>
    );
  }
  return (
    <div style={{
      position: 'relative', width, aspectRatio: '9 / 19.2', flexShrink: 0, borderRadius: '15% / 7%',
      background: '#1c1c1e', padding: '3.6%', boxShadow: `${shadow}, inset 0 0 0 1.5px #3a3a3c`, ...style,
    }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '12% / 5.6%', overflow: 'hidden', background: '#fff' }}>
        <Image src={shot.src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: 'cover', objectPosition: 'top' }} />
        <span style={{
          position: 'absolute', top: '2.2%', left: '50%', width: '30%', height: '3.4%', transform: 'translateX(-50%)',
          borderRadius: 99, background: '#000',
        }} />
      </div>
    </div>
  );
}

export function Browser({ shot, label, dark, sizes, aspect, priority, radius = 10, style }: {
  shot: Shot; label: string; dark: boolean; sizes: string; aspect?: string; priority?: boolean;
  radius?: number; style?: React.CSSProperties;
}) {
  return (
    <div style={{
      borderRadius: radius, overflow: 'hidden', background: dark ? '#26262a' : '#fff',
      boxShadow: dark
        ? '0 0 0 .5px rgba(255,255,255,.12), 0 14px 32px rgba(0,0,0,.45)'
        : '0 0 0 .5px rgba(0,0,0,.1), 0 14px 32px rgba(20,40,80,.14)',
      ...style,
    }}>
      <div style={{
        height: 24, display: 'flex', alignItems: 'center', gap: 5, padding: '0 9px',
        background: dark ? '#303035' : '#f2f2f5', borderBottom: `1px solid ${dark ? 'rgba(0,0,0,.4)' : '#e3e3e8'}`,
      }}>
        {['#ff5f57', '#febc2e', '#28c840'].map(c => <span key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c, flexShrink: 0 }} />)}
        <span style={{
          flex: 1, minWidth: 0, margin: '0 10%', height: 15, borderRadius: 5,
          background: dark ? 'rgba(255,255,255,.08)' : '#e6e6ea', color: dark ? '#b8b8bd' : '#55555a',
          fontSize: 10, lineHeight: '15px', textAlign: 'center',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 6px',
        }}>
          {label}
        </span>
      </div>
      <div style={{ position: 'relative', aspectRatio: aspect ?? `${shot.w} / ${shot.h}`, background: dark ? '#111' : '#fff' }}>
        <Image src={shot.src} alt="" fill sizes={sizes} priority={priority} style={{ objectFit: 'cover', objectPosition: 'top' }} />
      </div>
    </div>
  );
}
