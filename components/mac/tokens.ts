export const T = (dark: boolean) => ({
  dark,
  winBg:        dark ? 'rgba(16,17,22,0.88)'      : 'rgba(255,255,255,0.84)',
  menuBg:       dark ? 'rgba(13,14,18,0.82)'      : 'rgba(248,249,251,0.80)',
  dropBg:       dark ? 'rgba(19,20,26,0.99)'      : 'rgba(252,253,254,0.99)',
  dockBg:       dark ? 'rgba(13,14,18,0.72)'      : 'rgba(255,255,255,0.58)',
  cardBg:       dark ? 'rgba(255,255,255,0.045)'  : 'rgba(0,0,0,0.025)',
  cardHover:    dark ? 'rgba(255,255,255,0.075)'  : 'rgba(0,104,214,0.04)',
  text:         dark ? '#eef0f4'                  : '#1a1c20',
  textSub:      dark ? 'rgba(238,240,244,.72)'    : 'rgba(26,28,32,.70)',
  textMuted:    dark ? 'rgba(238,240,244,.55)'    : 'rgba(26,28,32,.62)',
  border:       dark ? 'rgba(255,255,255,0.08)'   : 'rgba(0,0,0,0.07)',
  borderFoc:    dark ? 'rgba(255,255,255,0.18)'   : 'rgba(0,0,0,0.16)',
  cardBorder:   dark ? 'rgba(255,255,255,0.07)'   : 'rgba(0,0,0,0.06)',
  divider:      dark ? 'rgba(255,255,255,0.06)'   : 'rgba(0,0,0,0.06)',
  pillBg:       dark ? 'rgba(255,255,255,0.07)'   : 'rgba(0,0,0,0.04)',
  pillBorder:   dark ? 'rgba(255,255,255,0.10)'   : 'rgba(0,0,0,0.08)',
  pillText:     dark ? 'rgba(238,240,244,.68)'    : 'rgba(26,28,32,.68)',
  // Single flat accent — macOS system blue. No gradients, no glows.
  accent:       dark ? '#78b3ff'                  : '#0068d6',
  accentBg:     dark ? 'rgba(64,140,255,.12)'     : 'rgba(0,104,214,.07)',
  accentBorder: dark ? 'rgba(100,160,255,.30)'    : 'rgba(0,104,214,.22)',
  // Solid fill for primary buttons / filled UI
  accentGrad2:  dark ? '#0A84FF'                  : '#0071E3',
  // System highlight — modern macOS menu/selection blue
  hlColor:      dark ? '#0A84FF' : '#007AFF',
  dockBorder:   dark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.10)',
  shadow: dark
    ? '0 24px 64px rgba(0,0,0,.65), 0 4px 16px rgba(0,0,0,.35), 0 0 0 0.5px rgba(255,255,255,.04)'
    : '0 24px 60px rgba(0,0,0,.14), 0 4px 16px rgba(0,0,0,.07)',
  shadowFoc: dark
    ? '0 32px 80px rgba(0,0,0,.75), 0 6px 24px rgba(0,0,0,.45), 0 0 0 0.5px rgba(255,255,255,.07)'
    : '0 32px 72px rgba(0,0,0,.19), 0 8px 24px rgba(0,0,0,.09)',
});

export type Tk = ReturnType<typeof T>;
