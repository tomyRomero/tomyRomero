export const T = (dark: boolean) => ({
  dark,
  winBg:        dark ? 'rgba(30,30,32,.92)'    : 'rgba(255,255,255,.88)',
  titleBg:      dark ? 'rgba(44,44,48,.98)'    : 'rgba(248,246,244,.98)',
  menuBg:       dark ? 'rgba(30,30,32,.8)'     : 'rgba(248,246,244,.8)',
  dropBg:       dark ? 'rgba(38,38,42,.99)'    : 'rgba(252,251,249,.99)',
  dockBg:       dark ? 'rgba(20,20,24,.62)'    : 'rgba(255,255,255,.52)',
  cardBg:       dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.033)',
  text:         dark ? '#f2f2f7'               : '#1c1c1e',
  textSub:      dark ? 'rgba(242,242,247,.62)' : 'rgba(28,28,30,.62)',
  textMuted:    dark ? 'rgba(242,242,247,.36)' : 'rgba(28,28,30,.38)',
  border:       dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.09)',
  borderFoc:    dark ? 'rgba(255,255,255,.16)' : 'rgba(0,0,0,.18)',
  cardBorder:   dark ? 'rgba(255,255,255,.09)' : 'rgba(0,0,0,.07)',
  divider:      dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.07)',
  pillBg:       dark ? 'rgba(255,255,255,.09)' : 'rgba(0,0,0,.052)',
  pillBorder:   dark ? 'rgba(255,255,255,.11)' : 'rgba(0,0,0,.086)',
  pillText:     dark ? 'rgba(242,242,247,.65)' : 'rgba(28,28,30,.65)',
  accent:       '#D4943A',
  accentBg:     dark ? 'rgba(212,148,58,.14)'  : 'rgba(212,148,58,.09)',
  accentBorder: dark ? 'rgba(212,148,58,.28)'  : 'rgba(212,148,58,.26)',
  hlColor:      'rgba(0,108,210,1)',
  dockBorder:   dark ? 'rgba(255,255,255,.11)' : 'rgba(0,0,0,.11)',
  shadow:    dark
    ? '0 24px 64px rgba(0,0,0,.58),0 2px 12px rgba(0,0,0,.28)'
    : '0 24px 60px rgba(0,0,0,.13),0 2px 12px rgba(0,0,0,.07)',
  shadowFoc: dark
    ? '0 32px 80px rgba(0,0,0,.68),0 4px 20px rgba(0,0,0,.38)'
    : '0 32px 72px rgba(0,0,0,.18),0 6px 20px rgba(0,0,0,.09)',
});

export type Tk = ReturnType<typeof T>;
