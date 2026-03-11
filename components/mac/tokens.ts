export const T = (dark: boolean) => ({
  dark,
  winBg:        dark ? 'rgba(22,22,26,0.88)'    : 'rgba(255,255,255,0.82)',
  titleBg:      dark ? 'rgba(30,30,36,0.97)'    : 'rgba(252,251,250,0.97)',
  menuBg:       dark ? 'rgba(18,18,22,0.78)'    : 'rgba(250,249,248,0.80)',
  dropBg:       dark ? 'rgba(28,28,34,0.99)'    : 'rgba(254,253,252,0.99)',
  dockBg:       dark ? 'rgba(18,18,22,0.68)'    : 'rgba(255,255,255,0.58)',
  cardBg:       dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.028)',
  text:         dark ? '#f2f2f7'               : '#1c1c1e',
  textSub:      dark ? 'rgba(242,242,247,.68)' : 'rgba(28,28,30,.68)',
  textMuted:    dark ? 'rgba(242,242,247,.40)' : 'rgba(28,28,30,.40)',
  border:       dark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)',
  borderFoc:    dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.16)',
  cardBorder:   dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.065)',
  divider:      dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.068)',
  pillBg:       dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.048)',
  pillBorder:   dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.082)',
  pillText:     dark ? 'rgba(242,242,247,.68)' : 'rgba(28,28,30,.68)',
  accent:       '#D4943A',
  accentBg:     dark ? 'rgba(212,148,58,.14)'  : 'rgba(212,148,58,.09)',
  accentBorder: dark ? 'rgba(212,148,58,.28)'  : 'rgba(212,148,58,.26)',
  hlColor:      'rgba(0,108,210,1)',
  dockBorder:   dark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.10)',
  // Inset highlight for window title bar
  titleHighlight: dark
    ? 'inset 0 1px 0 rgba(255,255,255,0.05)'
    : 'inset 0 1px 0 rgba(255,255,255,0.90)',
  shadow: dark
    ? '0 24px 64px rgba(0,0,0,.60), 0 4px 16px rgba(0,0,0,.30), 0 0 0 0.5px rgba(255,255,255,.04)'
    : '0 24px 60px rgba(0,0,0,.14), 0 4px 16px rgba(0,0,0,.07)',
  shadowFoc: dark
    ? '0 32px 80px rgba(0,0,0,.70), 0 6px 24px rgba(0,0,0,.40), 0 0 0 0.5px rgba(255,255,255,.07)'
    : '0 32px 72px rgba(0,0,0,.19), 0 8px 24px rgba(0,0,0,.09)',
});

export type Tk = ReturnType<typeof T>;
