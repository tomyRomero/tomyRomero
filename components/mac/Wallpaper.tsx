'use client';

export default function Wallpaper({ dark }: { dark: boolean }) {
  if (dark) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'linear-gradient(165deg,#080c18 0%,#0c1428 35%,#111e38 60%,#0a1220 100%)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: [
            'radial-gradient(1.5px 1.5px at 12% 20%,rgba(248,246,242,.68) 0%,transparent 100%)',
            'radial-gradient(2px 2px at 65% 32%,rgba(212,148,58,.72) 0%,transparent 100%)',
            'radial-gradient(1px 1px at 41% 8%,rgba(248,246,242,.52) 0%,transparent 100%)',
            'radial-gradient(1.5px 1.5px at 51% 48%,rgba(212,148,58,.44) 0%,transparent 100%)',
            'radial-gradient(1px 1px at 81% 13%,rgba(248,246,242,.58) 0%,transparent 100%)',
            'radial-gradient(1px 1px at 25% 66%,rgba(248,246,242,.32) 0%,transparent 100%)',
            'radial-gradient(1px 1px at 75% 72%,rgba(248,246,242,.28) 0%,transparent 100%)',
            'radial-gradient(1px 1px at 89% 40%,rgba(212,148,58,.3) 0%,transparent 100%)',
          ].join(','),
        }} />
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(170deg,#f9ddb8 0%,#f5c27e 6%,#eeaa66 12%,#e88060 19%,#de5c6e 27%,#be4880 38%,#8040a8 50%,#5055b8 60%,#3070cc 70%,#2492d8 80%,#3cb2d8 90%,#58cce4 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          'radial-gradient(ellipse 70% 50% at 24% 68%,rgba(255,196,120,.28) 0%,transparent 55%)',
          'radial-gradient(ellipse 55% 38% at 76% 25%,rgba(192,148,232,.16) 0%,transparent 50%)',
          'radial-gradient(ellipse 40% 30% at 52% 0%,rgba(255,224,160,.18) 0%,transparent 60%)',
        ].join(','),
      }} />
    </div>
  );
}
