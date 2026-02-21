import type { Resort, WeatherData, DayForecast } from '../types';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchResortWeather(resort: Resort): Promise<{
  currentTemp: number;
  snowDepth: number;
  freshSnow24h: number;
  freshSnow72h: number;
  weatherCode: number;
  windSpeed: number;
  freezingLevel: number;
  forecast: DayForecast[];
}> {
  const avgAltitude = Math.round((resort.altitudeMin + resort.altitudeMax) / 2);

  const params = new URLSearchParams({
    latitude: resort.lat.toString(),
    longitude: resort.lon.toString(),
    elevation: avgAltitude.toString(),
    hourly: 'temperature_2m,snowfall,snow_depth,weathercode,windspeed_10m,windgusts_10m',
    daily: 'temperature_2m_max,temperature_2m_min,snowfall_sum,precipitation_sum,weathercode,windspeed_10m_max,sunrise,sunset',
    timezone: 'Europe/Zurich',
    forecast_days: '7',
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

  const data: WeatherData = await res.json();

  const now = new Date();
  const currentHourIndex = findClosestHourIndex(data.hourly.time, now);

  const currentTemp = data.hourly.temperature_2m[currentHourIndex] ?? 0;
  const snowDepth = (data.hourly.snow_depth[currentHourIndex] ?? 0) * 100; // m -> cm
  const weatherCode = data.hourly.weathercode[currentHourIndex] ?? 0;
  const windSpeed = data.hourly.windspeed_10m[currentHourIndex] ?? 0;

  // Sum snowfall last 24h and 72h
  const freshSnow24h = sumSnowfall(data.hourly.snowfall, data.hourly.time, 24);
  const freshSnow72h = sumSnowfall(data.hourly.snowfall, data.hourly.time, 72);

  // Freezing level approximation
  const freezingLevel = estimateFreezingLevel(currentTemp, avgAltitude);

  const forecast: DayForecast[] = data.daily.time.map((date, i) => ({
    date,
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    snowfall: data.daily.snowfall_sum[i],
    precipitation: data.daily.precipitation_sum[i],
    weatherCode: data.daily.weathercode[i],
    windSpeedMax: data.daily.windspeed_10m_max[i],
  }));

  return { currentTemp, snowDepth, freshSnow24h, freshSnow72h, weatherCode, windSpeed, freezingLevel, forecast };
}

function findClosestHourIndex(times: string[], now: Date): number {
  const nowMs = now.getTime();
  let closest = 0;
  let minDiff = Infinity;
  for (let i = 0; i < times.length; i++) {
    const diff = Math.abs(new Date(times[i]).getTime() - nowMs);
    if (diff < minDiff) {
      minDiff = diff;
      closest = i;
    }
  }
  return closest;
}

function sumSnowfall(snowfall: number[], times: string[], hours: number): number {
  const cutoff = new Date(Date.now() - hours * 3600 * 1000);
  let sum = 0;
  for (let i = 0; i < times.length; i++) {
    if (new Date(times[i]) >= cutoff && new Date(times[i]) <= new Date()) {
      sum += snowfall[i] ?? 0;
    }
  }
  return Math.round(sum * 10) / 10;
}

function estimateFreezingLevel(tempAtAlt: number, altitude: number): number {
  // Rough estimate: temp drops ~6.5°C per 1000m
  if (tempAtAlt <= 0) return Math.max(0, altitude);
  return Math.round(altitude + (tempAtAlt / 6.5) * 1000);
}

/** Map WMO weather codes to French labels and emoji */
export function weatherCodeToLabel(code: number): { label: string; emoji: string } {
  const map: Record<number, { label: string; emoji: string }> = {
    0: { label: 'Ciel dégagé', emoji: '☀️' },
    1: { label: 'Principalement dégagé', emoji: '🌤️' },
    2: { label: 'Partiellement nuageux', emoji: '⛅' },
    3: { label: 'Couvert', emoji: '☁️' },
    45: { label: 'Brouillard', emoji: '🌫️' },
    48: { label: 'Brouillard givrant', emoji: '🌫️' },
    51: { label: 'Bruine légère', emoji: '🌦️' },
    53: { label: 'Bruine modérée', emoji: '🌦️' },
    55: { label: 'Bruine forte', emoji: '🌧️' },
    61: { label: 'Pluie légère', emoji: '🌧️' },
    63: { label: 'Pluie modérée', emoji: '🌧️' },
    65: { label: 'Pluie forte', emoji: '🌧️' },
    66: { label: 'Pluie verglaçante', emoji: '🧊' },
    67: { label: 'Pluie verglaçante forte', emoji: '🧊' },
    71: { label: 'Neige légère', emoji: '🌨️' },
    73: { label: 'Neige modérée', emoji: '❄️' },
    75: { label: 'Neige forte', emoji: '❄️' },
    77: { label: 'Grains de neige', emoji: '❄️' },
    80: { label: 'Averses légères', emoji: '🌦️' },
    81: { label: 'Averses modérées', emoji: '🌧️' },
    82: { label: 'Averses violentes', emoji: '⛈️' },
    85: { label: 'Averses de neige légères', emoji: '🌨️' },
    86: { label: 'Averses de neige fortes', emoji: '❄️' },
    95: { label: 'Orage', emoji: '⛈️' },
    96: { label: 'Orage avec grêle légère', emoji: '⛈️' },
    99: { label: 'Orage avec grêle forte', emoji: '⛈️' },
  };
  return map[code] ?? { label: 'Inconnu', emoji: '❓' };
}
