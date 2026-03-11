'use client';

export default function Wallpaper({ dark }: { dark: boolean }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden',
      background: dark
        ? 'linear-gradient(145deg, #060b1a 0%, #0d1226 55%, #12091e 100%)'
        : 'linear-gradient(145deg, #dce8f4 0%, #f0e8de 55%, #e8dff0 100%)',
    }}>
      {/* Blob 1 — top-left */}
      <div style={{
        position: 'absolute',
        width: '62vw', height: '62vw',
        borderRadius: '50%',
        left: '-18vw', top: '-14vw',
        background: dark ? 'rgba(72,18,210,.42)' : 'rgba(120,185,255,.38)',
        filter: 'blur(88px)',
        animation: 'blob1 38s ease-in-out infinite',
      }} />
      {/* Blob 2 — right */}
      <div style={{
        position: 'absolute',
        width: '56vw', height: '56vw',
        borderRadius: '50%',
        right: '-14vw', top: '22vh',
        background: dark ? 'rgba(8,118,148,.34)' : 'rgba(255,178,108,.34)',
        filter: 'blur(96px)',
        animation: 'blob2 46s ease-in-out infinite',
      }} />
      {/* Blob 3 — bottom-center */}
      <div style={{
        position: 'absolute',
        width: '52vw', height: '52vw',
        borderRadius: '50%',
        left: '20vw', bottom: '-14vh',
        background: dark ? 'rgba(136,38,204,.30)' : 'rgba(178,158,255,.32)',
        filter: 'blur(82px)',
        animation: 'blob3 42s ease-in-out infinite',
      }} />
    </div>
  );
}
