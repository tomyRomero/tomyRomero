'use client';
import { Toolbar } from '../Native';
import {
  useWeather, useUnits, loadWeather, condition, skyOf, tempColor, WeatherIcon, SunEventIcon,
  ocalaNow, hourKey, FORECAST_URL, type Wx,
} from '../weather';

const INK_SOFT = 'rgba(255,255,255,.72)';
const RAIN = '#8fd8ff';

function Card({ title, icon, children, style }: {
  title: string; icon?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <section aria-label={title} style={{
      borderRadius: 16, padding: '10px 14px 12px', minWidth: 0,
      background: 'rgba(0,18,48,.16)', border: '1px solid rgba(255,255,255,.08)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', ...style,
    }}>
      <h3 style={{
        display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, letterSpacing: '.3px',
        textTransform: 'uppercase', color: 'rgba(255,255,255,.6)',
        paddingBottom: 8, marginBottom: 10, borderBottom: '1px solid rgba(255,255,255,.16)',
      }}>
        {icon}{title}
      </h3>
      {children}
    </section>
  );
}

// Small line icons for the card headers
const glyph = (d: React.ReactNode) => (
  <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const CLOCK = glyph(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>);
const CAL   = glyph(<><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>);
const THERM = glyph(<path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0z" />);
const SUNG  = glyph(<><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>);
const WIND  = glyph(<path d="M3 8.5h11a3 3 0 1 0-3-3M3 12.5h15a3 3 0 1 1-3 3M3 16.5h7" />);
const DROPG = glyph(<path d="M12 3.5s6 6.6 6 10.8a6 6 0 0 1-12 0c0-4.2 6-10.8 6-10.8z" />);
const HORIZ = glyph(<><path d="M3 18h18M7 18a5 5 0 0 1 10 0M12 4v5M9.5 6.5 12 4l2.5 2.5" /></>);

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const uvLevel = (uv: number) => uv < 3 ? 'Low' : uv < 6 ? 'Moderate' : uv < 8 ? 'High' : uv < 11 ? 'Very High' : 'Extreme';
const dayName = (date: string, i: number) =>
  i === 0 ? 'Today' : new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });

// Dew point (°F) from temperature (°F) and relative humidity
function dewPoint(tF: number, rh: number) {
  const t = ((tF - 32) * 5) / 9, a = 17.62, b = 243.12;
  const g = Math.log(Math.max(rh, 1) / 100) + (a * t) / (b + t);
  return ((b * g) / (a - g)) * 9 / 5 + 32;
}

// Next 24 hours, with sunrise and sunset
type Slot = { key: string; time: string; label: string; icon: React.ReactNode; rain?: number; value: string };

function Hourly({ wx, now }: { wx: Wx; now: string }) {
  const u = useUnits();
  const hours = wx.hours.filter(h => h.time >= hourKey(now)).slice(0, 24);
  if (!hours.length) return null;
  const end = hours[hours.length - 1].time;
  const slots: Slot[] = hours.map((h, i) => ({
    key: h.time, time: h.time,
    label: i === 0 ? 'Now' : u.hour(h.time),
    icon: <WeatherIcon code={i === 0 ? wx.now.code : h.code} day={i === 0 ? wx.now.isDay : h.isDay} size={24} />,
    rain: h.rain >= 30 ? h.rain : undefined,
    value: u.deg(i === 0 ? wx.now.temp : h.temp),
  }));
  for (const d of wx.days.slice(0, 2)) {
    for (const [t, rise] of [[d.sunrise, true], [d.sunset, false]] as const) {
      if (t > now && t < end) {
        slots.push({ key: t, time: t, label: u.clock(t), icon: <SunEventIcon rise={rise} size={24} />, value: rise ? 'Sunrise' : 'Sunset' });
      }
    }
  }
  slots.sort((a, b) => a.time.localeCompare(b.time));
  return (
    <div style={{ display: 'flex', gap: 2, overflowX: 'auto', scrollbarWidth: 'none', margin: '0 -6px', padding: '0 6px' }}>
      {slots.map(s => (
        <div key={s.key} style={{ flex: '0 0 auto', minWidth: 54, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{s.label}</span>
          <span style={{ height: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            {s.icon}
            {s.rain !== undefined && <span style={{ fontSize: 10.5, fontWeight: 700, color: RAIN }}>{s.rain}%</span>}
          </span>
          <span style={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

// Ten-day forecast
function TenDay({ wx }: { wx: Wx }) {
  const u = useUnits();
  const lo = Math.min(...wx.days.map(d => d.lo)), hi = Math.max(...wx.days.map(d => d.hi));
  const span = Math.max(1, hi - lo);
  const at = (t: number) => `${((t - lo) / span) * 100}%`;
  return (
    <div>
      {wx.days.map((d, i) => (
        <div key={d.date} style={{
          display: 'grid', gridTemplateColumns: '58px 34px 40px 1fr 40px', alignItems: 'center', gap: 10,
          height: 44, borderTop: i ? '1px solid rgba(255,255,255,.14)' : 'none',
        }}>
          <span style={{ fontSize: 15.5, fontWeight: 600 }}>{dayName(d.date, i)}</span>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <WeatherIcon code={d.code} day size={22} />
            {d.rain >= 30 && <span style={{ fontSize: 10.5, fontWeight: 700, color: RAIN, marginTop: 1 }}>{d.rain}%</span>}
          </span>
          <span style={{ fontSize: 15.5, fontWeight: 600, color: INK_SOFT, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{u.deg(d.lo)}</span>
          <span style={{ position: 'relative', height: 5, borderRadius: 3, background: 'rgba(0,0,0,.2)' }}>
            <span style={{
              position: 'absolute', top: 0, bottom: 0, left: at(d.lo), width: `calc(${at(d.hi)} - ${at(d.lo)})`, borderRadius: 3,
              background: `linear-gradient(90deg, ${tempColor(d.lo)}, ${tempColor(d.hi)})`,
            }} />
            {i === 0 && (
              <span style={{
                position: 'absolute', top: '50%', left: at(Math.min(Math.max(wx.now.temp, lo), hi)), width: 7, height: 7, borderRadius: '50%',
                transform: 'translate(-50%, -50%)', background: '#fff', boxShadow: '0 0 0 1.5px rgba(0,0,0,.25)',
              }} />
            )}
          </span>
          <span style={{ fontSize: 15.5, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{u.deg(d.hi)}</span>
        </div>
      ))}
    </div>
  );
}

// Detail tiles
function Tile({ title, icon, value, note, children }: {
  title: string; icon: React.ReactNode; value: string; note: string; children?: React.ReactNode;
}) {
  return (
    <Card title={title} icon={icon} style={{ display: 'flex', flexDirection: 'column', minHeight: 150 }}>
      <div style={{ fontSize: 30, fontWeight: 500, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {children}
      <div style={{ marginTop: 'auto', paddingTop: 8, fontSize: 12.5, lineHeight: 1.35, color: 'rgba(255,255,255,.85)' }}>{note}</div>
    </Card>
  );
}

function Details({ wx, now, narrow }: { wx: Wx; now: string; narrow: boolean }) {
  const u = useUnits();
  const n = wx.now, today = wx.days[0], tomorrow = wx.days[1];
  const feelsNote = n.feels > n.temp + 3 ? 'Humidity is making it feel warmer.'
    : n.feels < n.temp - 3 ? 'Wind is making it feel cooler.' : 'Similar to the actual temperature.';
  const uv = Math.round(today.uv);
  // The next sunrise or sunset, and the other one after it
  const events = [today, tomorrow].filter(Boolean).flatMap(d => [
    { t: d.sunrise, name: 'Sunrise' }, { t: d.sunset, name: 'Sunset' },
  ]).filter(e => e.t > now);
  const [next, after] = events;

  return (
    // two across even on a phone
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${narrow ? 146 : 180}px, 1fr))`, gap: 12 }}>
      <Tile title="Feels Like" icon={THERM} value={u.deg(n.feels)} note={feelsNote} />
      <Tile title="UV Index" icon={SUNG} value={String(uv)} note={uv >= 3 ? 'Use sun protection today.' : 'Low for the rest of the day.'}>
        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>{uvLevel(uv)}</div>
        <div style={{ position: 'relative', height: 5, borderRadius: 3, marginTop: 10, background: 'linear-gradient(90deg,#3fc460,#f5d54a,#ff9f38,#ff4d3a,#b04ee0)' }}>
          <span style={{ position: 'absolute', top: '50%', left: `${Math.min(uv / 11, 1) * 100}%`, width: 7, height: 7, borderRadius: '50%', transform: 'translate(-50%,-50%)', background: '#fff', boxShadow: '0 0 0 1.5px rgba(0,0,0,.3)' }} />
        </div>
      </Tile>
      <Tile title="Wind" icon={WIND} value={u.speed(n.wind)}
        note={n.wind < 1 ? 'Calm right now.' : `From the ${COMPASS[Math.round(n.windDir / 45) % 8]}.`} />
      <Tile title="Humidity" icon={DROPG} value={`${Math.round(n.humidity)}%`}
        note={`The dew point is ${u.deg(dewPoint(n.temp, n.humidity))} right now.`} />
      {next && (
        <Tile title={next.name} icon={HORIZ} value={u.clock(next.t)} note={after ? `${after.name}: ${u.clock(after.t)}` : ''} />
      )}
      <Tile title="Chance of Rain" icon={DROPG} value={`${today.rain}%`}
        note={tomorrow ? `${tomorrow.rain}% tomorrow.` : 'Today.'} />
    </div>
  );
}

// nav: phone-only bar that replaces the toolbar
export default function WeatherWindow({ nav }: { nav?: React.ReactNode }) {
  const { wx, failed } = useWeather(true);
  const u = useUnits();
  const now = ocalaNow();
  const hourNow = +now.slice(11, 13);
  const day = wx ? wx.now.isDay : hourNow >= 7 && hourNow < 19;
  const cond = wx ? condition(wx.now.code, wx.now.isDay) : null;
  const today = wx?.days[0];
  const link = { color: '#fff', textDecoration: 'underline', textUnderlineOffset: 2 } as const;

  return (
    <div style={{
      flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', color: '#fff',
      background: skyOf(cond?.kind ?? 'clear', day), textShadow: '0 1px 2px rgba(0,0,0,.08)',
    }}>
      {nav ?? <Toolbar><span /></Toolbar>}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: `0 18px ${nav ? 'calc(24px + env(safe-area-inset-bottom, 0px))' : '18px'}`, ['--thumb' as string]: 'rgba(255,255,255,.55)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <header style={{ textAlign: 'center', padding: '0 0 12px' }}>
            <h2 style={{ fontSize: 28, fontWeight: 500 }}>Ocala</h2>
            <div style={{ fontSize: 84, fontWeight: 200, lineHeight: 1, marginLeft: 24, fontVariantNumeric: 'tabular-nums' }}>
              {wx ? u.deg(wx.now.temp) : '--°'}
            </div>
            <div style={{ fontSize: 19, fontWeight: 500, marginTop: 4 }}>{cond?.name ?? (failed ? 'Unavailable' : ' ')}</div>
            {today && <div style={{ fontSize: 19, fontWeight: 500 }}>H:{u.deg(today.hi)}  L:{u.deg(today.lo)}</div>}
          </header>

          {wx ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeIn .3s ease' }}>
              <Card title="Hourly Forecast" icon={CLOCK}><Hourly wx={wx} now={now} /></Card>
              <Card title="10-Day Forecast" icon={CAL}><TenDay wx={wx} /></Card>
              <Details wx={wx} now={now} narrow={!!nav} />
            </div>
          ) : failed ? (
            <Card title="Forecast">
              <p style={{ fontSize: 14, lineHeight: 1.5 }}>The forecast isn&apos;t loading right now.</p>
              <button onClick={() => loadWeather()} style={{
                marginTop: 10, height: 30, padding: '0 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: 'rgba(255,255,255,.2)', color: '#fff',
              }}>Try Again</button>
            </Card>
          ) : (
            <p style={{ textAlign: 'center', fontSize: 14, color: INK_SOFT }}>Loading the forecast…</p>
          )}

          <p style={{ textAlign: 'center', fontSize: 11.5, color: INK_SOFT, marginTop: 4 }}>
            Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" style={link}>Open-Meteo</a>
            {' · '}
            <a href={FORECAST_URL} target="_blank" rel="noopener noreferrer" style={link}>Full forecast at weather.gov</a>
          </p>
        </div>
      </div>
    </div>
  );
}
