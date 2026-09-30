'use client';
import { useWeather, useUnits, condition, skyOf, WeatherIcon, ocalaNow } from '@/components/mac/weather';
import s from './classic.module.css';

export default function ClassicWeather() {
  const { wx, failed } = useWeather();
  const u = useUnits();
  const hourNow = +ocalaNow().slice(11, 13);
  const day = wx ? wx.now.isDay : hourNow >= 7 && hourNow < 19;
  const cond = wx ? condition(wx.now.code, wx.now.isDay) : null;
  const today = wx?.days[0];
  const label = wx && cond && today
    ? `Weather in Ocala: ${u.deg(wx.now.temp)}, ${cond.name}. High ${u.deg(today.hi)}, low ${u.deg(today.lo)}.`
    : 'Weather in Ocala';

  return (
    <div className={`${s.tile} ${s.weather}`} role="img" aria-label={label} style={{ background: skyOf(cond?.kind ?? 'clear', day) }}>
      <span className={s.weatherCity} aria-hidden="true">
        Ocala
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3 3 10.5l7.4 2.1L12.5 20z" /></svg>
      </span>
      <span className={s.weatherTemp} aria-hidden="true">{wx ? u.deg(wx.now.temp) : '--°'}</span>
      <span className={s.weatherFoot} aria-hidden="true">
        {wx && <WeatherIcon code={wx.now.code} day={wx.now.isDay} size={22} />}
        <span>{cond?.name ?? (failed ? 'Unavailable' : '')}</span>
        {today && <span>H:{u.deg(today.hi)} L:{u.deg(today.lo)}</span>}
      </span>
    </div>
  );
}
