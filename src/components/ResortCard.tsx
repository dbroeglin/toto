import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { Resort } from '../types';
import { fetchResortWeather, weatherCodeToLabel } from '../services/weather';

interface Props {
  resort: Resort;
}

export default function ResortCard({ resort }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weather', resort.id],
    queryFn: () => fetchResortWeather(resort),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const snowColor = (depth: number) => {
    if (depth >= 100) return 'text-blue-600';
    if (depth >= 50) return 'text-sky-500';
    if (depth >= 20) return 'text-cyan-500';
    return 'text-slate-400';
  };

  return (
    <Link
      to={`/station/${resort.id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden no-underline group"
    >
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400" />

      <div className="p-4">
        {/* Resort name & country flag */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors">
            {resort.name}
          </h3>
          <span className="text-sm">{resort.country === 'CH' ? '🇨🇭' : '🇫🇷'}</span>
        </div>

        {/* Altitude info */}
        <div className="text-xs text-slate-500 mb-3">
          ⛰️ {resort.altitudeMin}m – {resort.altitudeMax}m · {resort.slopesKm} km de pistes · {resort.liftsCount} remontées
        </div>

        {isLoading && (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </div>
        )}

        {error && (
          <div className="text-xs text-red-400">Données météo indisponibles</div>
        )}

        {data && (
          <div className="space-y-2">
            {/* Current weather */}
            <div className="flex items-center justify-between">
              <span className="text-2xl">
                {weatherCodeToLabel(data.weatherCode).emoji}
              </span>
              <span className="text-2xl font-bold text-slate-700">
                {Math.round(data.currentTemp)}°C
              </span>
            </div>

            {/* Snow info */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 rounded-lg p-2">
                <div className={`text-lg font-bold ${snowColor(data.snowDepth)}`}>
                  {Math.round(data.snowDepth)}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">cm au sol</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-500">
                  +{data.freshSnow24h}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">cm / 24h</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-400">
                  +{data.freshSnow72h}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">cm / 72h</div>
              </div>
            </div>

            {/* Wind & next days preview */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>💨 {Math.round(data.windSpeed)} km/h</span>
              <span className="flex gap-1">
                {data.forecast.slice(1, 4).map((d) => (
                  <span key={d.date} title={d.date}>
                    {weatherCodeToLabel(d.weatherCode).emoji}
                  </span>
                ))}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
