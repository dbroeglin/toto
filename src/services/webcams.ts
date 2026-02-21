import type { Webcam } from '../types';

const API_KEY = import.meta.env.VITE_WINDY_API_KEY || '';
const BASE_URL = 'https://api.windy.com/webcams/api/v3/webcams';

export async function fetchWebcamsNear(
  lat: number,
  lon: number,
  radiusKm: number = 15,
  limit: number = 6
): Promise<Webcam[]> {
  if (!API_KEY) {
    console.warn('Windy API key not configured (VITE_WINDY_API_KEY). Webcams disabled.');
    return [];
  }

  const params = new URLSearchParams({
    lang: 'fr',
    limit: limit.toString(),
    offset: '0',
    nearby: `${lat},${lon},${radiusKm}`,
    include: 'images,location,player',
    categories: 'ski',
  });

  try {
    const res = await fetch(`${BASE_URL}?${params}`, {
      headers: { 'x-windy-api-key': API_KEY },
    });

    if (!res.ok) {
      // If ski category returns nothing, try without category filter
      if (res.status === 404) return fetchWebcamsNearNoCategory(lat, lon, radiusKm, limit);
      console.error(`Webcam API error: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return (data.webcams ?? []) as Webcam[];
  } catch (err) {
    console.error('Webcam fetch failed:', err);
    return [];
  }
}

async function fetchWebcamsNearNoCategory(
  lat: number,
  lon: number,
  radiusKm: number,
  limit: number
): Promise<Webcam[]> {
  const params = new URLSearchParams({
    lang: 'fr',
    limit: limit.toString(),
    offset: '0',
    nearby: `${lat},${lon},${radiusKm}`,
    include: 'images,location,player',
  });

  try {
    const res = await fetch(`${BASE_URL}?${params}`, {
      headers: { 'x-windy-api-key': API_KEY },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.webcams ?? []) as Webcam[];
  } catch {
    return [];
  }
}

export function isWebcamConfigured(): boolean {
  return !!API_KEY;
}
