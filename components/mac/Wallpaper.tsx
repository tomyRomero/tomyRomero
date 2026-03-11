'use client';

export default function Wallpaper({ dark }: { dark: boolean }) {
  if (dark) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#030609', overflow: 'hidden' }}>

        {/* Orb 1 — vivid emerald/teal */}
        <div style={{
          position: 'absolute',
          width: '95vw', height: '72vh',
          top: '-18%', left: '-18%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0,214,132,.70) 0%, rgba(0,160,100,.24) 38%, transparent 68%)',
          filter: 'blur(64px)',
          animation: 'aurora1 13s ease-in-out infinite',
          willChange: 'transform, opacity',
        }} />

        {/* Orb 2 — electric violet */}
        <div style={{
          position: 'absolute',
          width: '85vw', height: '66vh',
          top: '10%', right: '-14%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(116,40,250,.62) 0%, rgba(76,20,200,.18) 42%, transparent 70%)',
          filter: 'blur(72px)',
          animation: 'aurora2 19s ease-in-out infinite',
          animationDelay: '-7s',
          willChange: 'transform, opacity',
        }} />

        {/* Orb 3 — sky blue */}
        <div style={{
          position: 'absolute',
          width: '65vw', height: '55vh',
          bottom: '2%', left: '22%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(14,170,255,.52) 0%, rgba(6,120,220,.14) 40%, transparent 68%)',
          filter: 'blur(68px)',
          animation: 'aurora3 25s ease-in-out infinite',
          animationDelay: '-11s',
          willChange: 'transform, opacity',
        }} />

        {/* Orb 4 — hot pink accent */}
        <div style={{
          position: 'absolute',
          width: '55vw', height: '45vh',
          bottom: '12%', right: '8%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(248,40,120,.42) 0%, rgba(200,20,90,.10) 44%, transparent 68%)',
          filter: 'blur(56px)',
          animation: 'aurora1 16s ease-in-out infinite reverse',
          animationDelay: '-5s',
          willChange: 'transform, opacity',
        }} />

        {/* Orb 5 — amber top-center */}
        <div style={{
          position: 'absolute',
          width: '44vw', height: '36vh',
          top: '5%', left: '35%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(255,148,20,.32) 0%, transparent 64%)',
          filter: 'blur(52px)',
          animation: 'auroraPulse 10s ease-in-out infinite',
          animationDelay: '-4s',
          willChange: 'opacity',
        }} />

        {/* Stars */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: [
            'radial-gradient(1.2px 1.2px at  5%  9%,  rgba(255,255,255,.75) 0%,transparent 100%)',
            'radial-gradient(1.5px 1.5px at 19%  4%,  rgba(255,255,255,.58) 0%,transparent 100%)',
            'radial-gradient(1px   1px   at 33% 18%,  rgba(255,255,255,.50) 0%,transparent 100%)',
            'radial-gradient(1.3px 1.3px at 48%  6%,  rgba(255,255,255,.64) 0%,transparent 100%)',
            'radial-gradient(1px   1px   at 62% 22%,  rgba(255,255,255,.42) 0%,transparent 100%)',
            'radial-gradient(1.5px 1.5px at 74%  9%,  rgba(255,255,255,.60) 0%,transparent 100%)',
            'radial-gradient(1px   1px   at 85% 15%,  rgba(255,255,255,.48) 0%,transparent 100%)',
            'radial-gradient(1.2px 1.2px at 94%  4%,  rgba(255,255,255,.54) 0%,transparent 100%)',
            'radial-gradient(1px   1px   at 11% 34%,  rgba(255,255,255,.35) 0%,transparent 100%)',
            'radial-gradient(1.3px 1.3px at 29% 43%,  rgba(255,255,255,.44) 0%,transparent 100%)',
            'radial-gradient(1px   1px   at 57% 39%,  rgba(255,255,255,.31) 0%,transparent 100%)',
            'radial-gradient(1.4px 1.4px at 70% 46%,  rgba(255,255,255,.46) 0%,transparent 100%)',
            'radial-gradient(1px   1px   at 80% 37%,  rgba(255,255,255,.29) 0%,transparent 100%)',
            'radial-gradient(1.2px 1.2px at 92% 31%,  rgba(255,255,255,.40) 0%,transparent 100%)',
          ].join(','),
        }} />
      </div>
    );
  }

  /* Light mode — animated Sonoma-style gradient */
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {/* Base gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(152deg,#fce5b0 0%,#f9be6c 6%,#ef8e60 13%,#e75874 22%,#c43f92 34%,#7c36b8 47%,#4650d4 58%,#2280e4 70%,#18acea 82%,#36caf8 94%,#58dcf8 100%)',
        animation: 'gradientShift 20s ease-in-out infinite',
      }} />
      {/* Floating glow orbs */}
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          'radial-gradient(ellipse 68% 52% at 16% 74%, rgba(255,210,130,.32) 0%, transparent 55%)',
          'radial-gradient(ellipse 50% 40% at 82% 20%, rgba(198,138,252,.20) 0%, transparent 52%)',
          'radial-gradient(ellipse 38% 30% at 50%  0%, rgba(255,230,170,.22) 0%, transparent 58%)',
        ].join(','),
        animation: 'aurora1 18s ease-in-out infinite',
        animationDelay: '-6s',
      }} />
      {/* Bottom highlight */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 110% 40% at 50% 110%, rgba(255,255,255,.12) 0%, transparent 55%)',
      }} />
    </div>
  );
}
