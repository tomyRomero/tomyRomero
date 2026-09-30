'use client';
import { WidgetFrame, S } from './WidgetFrame';
import { useWeather, useUnits, condition, skyOf, WeatherIcon, ocalaNow } from '../weather';

// fluid: fill the cell (phone home screen) instead of the fixed desktop size
export default function WeatherWidget({ dark, onOpen, fluid = false }: { dark: boolean; onOpen: (id: string) => void; fluid?: boolean }) {
  const { wx, failed } = useWeather();
  const u = useUnits();

  // Before the first answer, the sky matches the time of day in Ocala
  const hourNow = +ocalaNow().slice(11, 13);
  const day = wx ? wx.now.isDay : hourNow >= 7 && hourNow < 19;
  const cond = wx ? condition(wx.now.code, wx.now.isDay) : null;
  const today = wx?.days[0];

  const label = wx && cond && today
    ? `Weather in Ocala: ${u.deg(wx.now.temp)}, ${cond.name}. High ${u.deg(today.hi)}, low ${u.deg(today.lo)}. Open Weather`
    : 'Weather in Ocala. Open Weather';

  return (
    <WidgetFrame dark={dark} w={fluid ? '100%' : S} h={fluid ? '100%' : S} label={label} onPress={() => onOpen('weather')} bg={skyOf(cond?.kind ?? 'clear', day)}>
      <div style={{
        height: '100%', padding: '14px 15px 13px', display: 'flex', flexDirection: 'column', color: '#fff',
        textShadow: '0 1px 2px rgba(0,0,0,.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600 }}>
          Ocala
          <svg width="9" height="9" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M21 3 3 10.5l7.4 2.1L12.5 20z" /></svg>
        </div>
        <div style={{ fontSize: 42, fontWeight: 300, lineHeight: 1.05, letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums' }}>
          {wx ? u.deg(wx.now.temp) : '--°'}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {wx && <WeatherIcon code={wx.now.code} day={wx.now.isDay} size={18} />}
          <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 3 }}>{cond?.name ?? (failed ? 'Unavailable' : '')}</div>
          {today && <div style={{ fontSize: 12.5, fontWeight: 600 }}>H:{u.deg(today.hi)} L:{u.deg(today.lo)}</div>}
        </div>
      </div>
    </WidgetFrame>
  );
}
