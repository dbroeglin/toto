export interface Resort {
  id: string;
  name: string;
  country: 'CH' | 'FR';
  region: string;
  lat: number;
  lon: number;
  altitudeMin: number;
  altitudeMax: number;
  slopesKm: number;
  liftsCount: number;
  website: string;
  distanceFromGenevaKm: number;
}

export interface WeatherData {
  hourly: {
    time: string[];
    temperature_2m: number[];
    snowfall: number[];
    snow_depth: number[];
    weathercode: number[];
    windspeed_10m: number[];
    windgusts_10m: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    snowfall_sum: number[];
    precipitation_sum: number[];
    weathercode: number[];
    windspeed_10m_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

export interface Webcam {
  id: string;
  title: string;
  image: {
    current: { preview: string; thumbnail: string };
  };
  location: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
  player?: {
    day: string;
    month: string;
    lifetime: string;
  };
  status: string;
}

export interface ResortWeather {
  resort: Resort;
  currentTemp: number;
  snowDepth: number;
  freshSnow24h: number;
  freshSnow72h: number;
  weatherCode: number;
  windSpeed: number;
  freezingLevel: number;
  forecast: DayForecast[];
}

export interface DayForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  snowfall: number;
  precipitation: number;
  weatherCode: number;
  windSpeedMax: number;
}
