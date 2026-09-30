// Proxies Open-Meteo for Ocala; the CDN caches each response for 15 minutes
export const dynamic = 'force-dynamic';

const LAT = 29.1872, LON = -82.1401, TZ = 'America/New_York';
const HOURS = 25;

type Forecast = {
  current: {
    time: string; temperature_2m: number; apparent_temperature: number; relative_humidity_2m: number;
    weather_code: number; is_day: number; wind_speed_10m: number; wind_direction_10m: number;
  };
  hourly: { time: string[]; temperature_2m: number[]; weather_code: number[]; is_day: number[]; precipitation_probability: number[] };
  daily: {
    time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[];
    sunrise: string[]; sunset: string[]; uv_index_max: number[]; precipitation_probability_max: number[];
  };
};

export async function GET() {
  const url = 'https://api.open-meteo.com/v1/forecast'
    + `?latitude=${LAT}&longitude=${LON}&timezone=${encodeURIComponent(TZ)}`
    + '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,is_day,wind_speed_10m,wind_direction_10m'
    + '&hourly=temperature_2m,weather_code,is_day,precipitation_probability'
    + '&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max'
    + '&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=10';
  try {
    const res = await fetch(url, { next: { revalidate: 900 }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`open-meteo ${res.status}`);
    const f: Forecast = await res.json();
    const c = f.current, h = f.hourly, d = f.daily;
    // Times are Ocala's local time; the hours start at the current one
    const from = Math.max(0, h.time.indexOf(c.time.slice(0, 13) + ':00'));
    return Response.json({
      now: {
        temp: c.temperature_2m, feels: c.apparent_temperature, humidity: c.relative_humidity_2m,
        code: c.weather_code, isDay: c.is_day === 1, wind: c.wind_speed_10m, windDir: c.wind_direction_10m,
      },
      hours: h.time.slice(from, from + HOURS).map((time, i) => ({
        time,
        temp: h.temperature_2m[from + i],
        code: h.weather_code[from + i],
        isDay: h.is_day[from + i] === 1,
        rain: h.precipitation_probability[from + i] ?? 0,
      })),
      days: d.time.map((date, i) => ({
        date,
        code: d.weather_code[i],
        hi: d.temperature_2m_max[i],
        lo: d.temperature_2m_min[i],
        rain: d.precipitation_probability_max[i] ?? 0,
        uv: d.uv_index_max[i] ?? 0,
        sunrise: d.sunrise[i],
        sunset: d.sunset[i],
      })),
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600' },
    });
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
