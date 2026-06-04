export const T = (dark: boolean) => ({
  dark,
  winBg:        dark ? 'rgba(14,14,20,0.88)'     : 'rgba(255,255,255,0.82)',
  titleBg:      dark ? 'rgba(20,20,28,0.97)'     : 'rgba(252,251,250,0.97)',
  menuBg:       dark ? 'rgba(12,12,18,0.82)'     : 'rgba(250,249,248,0.80)',
  dropBg:       dark ? 'rgba(18,18,26,0.99)'     : 'rgba(254,253,252,0.99)',
  dockBg:       dark ? 'rgba(12,12,18,0.72)'     : 'rgba(255,255,255,0.58)',
  cardBg:       dark ? 'rgba(255,255,255,0.045)'  : 'rgba(0,0,0,0.025)',
  cardHover:    dark ? 'rgba(255,255,255,0.075)'  : 'rgba(212,148,58,0.05)',
  text:         dark ? '#f0f0f5'                  : '#1a1a1e',
  textSub:      dark ? 'rgba(240,240,245,.72)'    : 'rgba(26,26,30,.70)',
  textMuted:    dark ? 'rgba(240,240,245,.55)'    : 'rgba(26,26,30,.62)',
  border:       dark ? 'rgba(255,255,255,0.08)'   : 'rgba(0,0,0,0.07)',
  borderFoc:    dark ? 'rgba(255,255,255,0.18)'   : 'rgba(0,0,0,0.16)',
  cardBorder:   dark ? 'rgba(255,255,255,0.07)'   : 'rgba(0,0,0,0.06)',
  divider:      dark ? 'rgba(255,255,255,0.06)'   : 'rgba(0,0,0,0.06)',
  pillBg:       dark ? 'rgba(255,255,255,0.07)'   : 'rgba(0,0,0,0.04)',
  pillBorder:   dark ? 'rgba(255,255,255,0.10)'   : 'rgba(0,0,0,0.08)',
  pillText:     dark ? 'rgba(240,240,245,.68)'    : 'rgba(26,26,30,.68)',
  accent:       '#D4943A',
  accentLight:  '#f5c87a',
  accentBg:     dark ? 'rgba(212,148,58,.12)'     : 'rgba(212,148,58,.08)',
  accentBorder: dark ? 'rgba(212,148,58,.26)'     : 'rgba(212,148,58,.22)',
  // Gradient accent for premium elements
  accentGrad:   'linear-gradient(135deg, #D4943A 0%, #f5c87a 50%, #D4943A 100%)',
  accentGrad2:  'linear-gradient(135deg, #D4943A 0%, #e8a94e 100%)',
  hlColor:      'rgba(0,108,210,1)',
  dockBorder:   dark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.10)',
  titleHighlight: dark
    ? 'inset 0 1px 0 rgba(255,255,255,0.05)'
    : 'inset 0 1px 0 rgba(255,255,255,0.90)',
  shadow: dark
    ? '0 24px 64px rgba(0,0,0,.65), 0 4px 16px rgba(0,0,0,.35), 0 0 0 0.5px rgba(255,255,255,.04)'
    : '0 24px 60px rgba(0,0,0,.14), 0 4px 16px rgba(0,0,0,.07)',
  shadowFoc: dark
    ? '0 32px 80px rgba(0,0,0,.75), 0 6px 24px rgba(0,0,0,.45), 0 0 0 0.5px rgba(255,255,255,.07)'
    : '0 32px 72px rgba(0,0,0,.19), 0 8px 24px rgba(0,0,0,.09)',
  // Glow effect for accent elements
  accentGlow: dark
    ? '0 0 20px rgba(212,148,58,.18), 0 4px 12px rgba(212,148,58,.12)'
    : '0 0 16px rgba(212,148,58,.12), 0 4px 10px rgba(212,148,58,.08)',
});

export type Tk = ReturnType<typeof T>;
