export const CATS: Record<string, { color: string; grad: [string, string]; icon: React.ReactNode }> = {
  'Languages': {
    color: '#0a84ff', grad: ['#4aa3ff', '#0a6fe0'],
    icon: <path d="M9 4.5c-2 0-2.5 1-2.5 2.5v2.5c0 1.2-.8 2-2 2.5 1.2.5 2 1.3 2 2.5V17c0 1.5.5 2.5 2.5 2.5M15 4.5c2 0 2.5 1 2.5 2.5v2.5c0 1.2.8 2 2 2.5-1.2.5-2 1.3-2 2.5V17c0 1.5-.5 2.5-2.5 2.5" />,
  },
  'Backend': {
    color: '#bf5af2', grad: ['#c77dff', '#9340e6'],
    icon: <><rect x="4" y="4" width="16" height="7" rx="1.5" /><rect x="4" y="13" width="16" height="7" rx="1.5" /><path d="M8 7.5h.01M8 16.5h.01" /></>,
  },
  'Frontend': {
    color: '#ff9f0a', grad: ['#ffb340', '#f08400'],
    icon: <><rect x="3" y="4.5" width="18" height="15" rx="2" /><path d="M3 9h18" /></>,
  },
  'Data & Cloud': {
    color: '#40c8e0', grad: ['#5ed6ea', '#1aa3bb'],
    icon: <><ellipse cx="12" cy="6" rx="7" ry="2.5" /><path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" /></>,
  },
  'Tools': {
    color: '#8e8e93', grad: ['#a1a1a8', '#6d6d73'],
    icon: <path d="M15.2 4.3a4.5 4.5 0 0 0-5.6 5.9L4.5 15.3a2 2 0 0 0 2.8 2.8l5.1-5.1a4.5 4.5 0 0 0 5.9-5.6l-2.6 2.6-2.3-.5-.5-2.3z" />,
  },
};

export function CatIcon({ cat, size }: { cat: string; size: number }) {
  const c = CATS[cat];
  return (
    <span aria-hidden="true" style={{
      width: size, height: size, flexShrink: 0, borderRadius: Math.round(size * 0.26),
      background: `linear-gradient(180deg, ${c.grad[0]}, ${c.grad[1]})`, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: size > 30 ? `0 6px 16px ${c.color}55` : 'inset 0 0 0 .5px rgba(255,255,255,.25)',
    }}>
      <svg width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={size > 30 ? 2 : 2.2} strokeLinecap="round" strokeLinejoin="round">
        {c.icon}
      </svg>
    </span>
  );
}
