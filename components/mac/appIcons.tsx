// App icons for the dock and the phone home screen. Callers pass an id prefix
// since both layouts can be in the page at once.

export const APP_BG: Record<string, string> = {
  about:      'linear-gradient(160deg,#5FB6F9 0%,#2E7DE9 55%,#1D5FD0 100%)',
  projects:   'linear-gradient(160deg,#57D96D 0%,#2AAE4F 55%,#1E8B3E 100%)',
  experience: 'linear-gradient(160deg,#BB79F2 0%,#8A42D8 55%,#6E2FBF 100%)',
  skills:     'linear-gradient(160deg,#3E4654 0%,#23272f 55%,#15181f 100%)',
  contact:    'linear-gradient(160deg,#FB7A87 0%,#E8404F 55%,#C82737 100%)',
  resume:     'linear-gradient(160deg,#FF7A54 0%,#E8432A 55%,#C22913 100%)',
  photos:     'linear-gradient(160deg,#ffffff 0%,#f4f4f7 60%,#e6e6ec 100%)',
  weather:    'linear-gradient(160deg,#5cb8ff 0%,#2a86e8 55%,#1766cc 100%)',
};

// Photos: the petals use multiply blending
const PETALS = ['#f5a13a', '#f6d046', '#b3d24a', '#5cbf73', '#40a7d9', '#5a72d6', '#9c5ac8', '#ea5470'];

// `k` scales the artwork with the tile (1 = the dock's 64px tile)
export function appGlyph(id: string, p: string, k = 1): React.ReactNode {
  const s = Math.round(33 * k);
  switch (id) {
    case 'about': return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`${p}-ab`} x1="16" y1="3" x2="16" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#d6e8ff" />
          </linearGradient>
        </defs>
        <path d="M3.5 29.5c0-6.9 5.6-12.5 12.5-12.5s12.5 5.6 12.5 12.5" fill={`url(#${p}-ab)`} fillOpacity=".92" />
        <circle cx="16" cy="10.4" r="6.3" fill={`url(#${p}-ab)`} />
        <circle cx="16" cy="10.4" r="6.3" stroke="rgba(15,70,160,.22)" strokeWidth=".8" />
      </svg>
    );
    case 'projects': return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`${p}-pr`} x1="16" y1="11" x2="16" y2="27" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#d9f5e0" />
          </linearGradient>
        </defs>
        <path d="M3 8.6C3 7.2 4.2 6 5.6 6h6.1c.7 0 1.4.28 1.9.78l1.7 1.72h10.1c1.4 0 2.6 1.2 2.6 2.6v1.9H3V8.6z" fill="rgba(255,255,255,.68)" />
        <path d="M3 11.6h26v11.8c0 1.4-1.2 2.6-2.6 2.6H5.6C4.2 26 3 24.8 3 23.4V11.6z" fill={`url(#${p}-pr)`} />
        <path d="M3 11.6h26v1.1H3z" fill="rgba(15,110,55,.12)" />
      </svg>
    );
    case 'experience': return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`${p}-ex`} x1="16" y1="9" x2="16" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#eadffb" />
          </linearGradient>
        </defs>
        <rect x="11.5" y="4.5" width="9" height="5.5" rx="2.2" stroke="rgba(255,255,255,.92)" strokeWidth="2" />
        <rect x="3" y="9" width="26" height="19" rx="3.6" fill={`url(#${p}-ex)`} />
        <path d="M3 16.4h26v2.4H3z" fill="rgba(95,35,190,.14)" />
        <rect x="13.4" y="15.3" width="5.2" height="5.8" rx="1.6" fill="#fff" stroke="rgba(95,35,190,.45)" strokeWidth="1.4" />
      </svg>
    );
    case 'skills': return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`${p}-sk`} x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgba(255,255,255,.16)" />
            <stop offset="1" stopColor="rgba(255,255,255,.05)" />
          </linearGradient>
        </defs>
        <rect x="2.5" y="4.5" width="27" height="23" rx="4" fill={`url(#${p}-sk)`} stroke="rgba(255,255,255,.85)" strokeWidth="1.6" />
        <circle cx="7.2"  cy="9" r="1.1" fill="#ff5f57" />
        <circle cx="10.8" cy="9" r="1.1" fill="#ffbd2e" />
        <circle cx="14.4" cy="9" r="1.1" fill="#28ca41" />
        <path d="M7.5 15.2l4.6 3.6-4.6 3.6" stroke="#8be28f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="15.6" y1="22.4" x2="23.2" y2="22.4" stroke="rgba(255,255,255,.85)" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
    case 'contact': return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`${p}-co`} x1="16" y1="7" x2="16" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#ffe2e6" />
          </linearGradient>
        </defs>
        <rect x="2.5" y="7" width="27" height="18.5" rx="3.2" fill={`url(#${p}-co)`} />
        <path d="M3.6 9.4L16 18.2 28.4 9.4" stroke="rgba(195,30,55,.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2.5" y="7" width="27" height="18.5" rx="3.2" stroke="rgba(195,30,55,.14)" strokeWidth=".8" />
      </svg>
    );
    case 'resume': return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`${p}-rs`} x1="16" y1="3.5" x2="16" y2="28.5" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#ffe1d6" />
          </linearGradient>
        </defs>
        <path d="M9 3.5h10.5L23.5 7.5V28.5H9V3.5z" fill={`url(#${p}-rs)`} />
        <path d="M19.5 3.5L23.5 7.5H19.5V3.5z" fill="rgba(200,60,30,.30)" />
        <line x1="12" y1="14" x2="20.5" y2="14" stroke="rgba(195,50,20,.42)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="12" y1="18" x2="20.5" y2="18" stroke="rgba(195,50,20,.42)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="12" y1="22" x2="17" y2="22" stroke="rgba(195,50,20,.42)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
    case 'photos': return (
      <svg width={Math.round(46 * k)} height={Math.round(46 * k)} viewBox="0 0 32 32" aria-hidden="true">
        {PETALS.map((c, i) => (
          <ellipse key={c} cx="16" cy="9.6" rx="3.9" ry="6.2" fill={c} fillOpacity=".86"
            transform={`rotate(${i * 45} 16 16)`} style={{ mixBlendMode: 'multiply' }} />
        ))}
      </svg>
    );
    case 'weather': return (
      <svg width={Math.round(42 * k)} height={Math.round(42 * k)} viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="12" cy="12.5" r="6.2" fill="#ffd60a" />
        <g fill="#fff">
          <circle cx="13" cy="20.6" r="4.4" /><circle cx="18.6" cy="17.6" r="5.8" /><circle cx="23.6" cy="21.2" r="3.9" />
          <rect x="13" y="19.6" width="10.6" height="5.5" />
        </g>
      </svg>
    );
    default: return null;
  }
}
