import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { resorts } from '../data/resorts';
import { fetchResortWeather, weatherCodeToLabel } from '../services/weather';
import WeatherForecast from '../components/WeatherForecast';
import WebcamViewer from '../components/WebcamViewer';

export default function ResortDetailPage() {
  const { id } = useParams<{ id: string }>();
  const resort = resorts.find((r) => r.id === id);

  const { data, isLoading, error } = useQuery({
    queryKey: ['weather', id],
    queryFn: () => fetchResortWeather(resort!),
    staleTime: 5 * 60 * 1000,
    enabled: !!resort,
  });

  if (!resort) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Station introuvable</h2>
        <Link to="/" className="text-blue-600 hover:underline">← Retour à la liste</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Link to="/" className="text-sm text-blue-600 hover:underline no-underline">
        ← Toutes les stations
      </Link>

      {/* Resort header */}
      <div className="mt-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">{resort.name}</h2>
          <span className="text-xl">{resort.country === 'CH' ? '🇨🇭' : '🇫🇷'}</span>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          <span>⛰️ {resort.altitudeMin}m – {resort.altitudeMax}m</span>
          <span>🎿 {resort.slopesKm} km de pistes</span>
          <span>🚡 {resort.liftsCount} remontées</span>
          <span>📍 {resort.distanceFromGenevaKm} km de Genève</span>
          <a href={resort.website} target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            🌐 Site web
          </a>
        </div>
      </div>

      {/* Current conditions */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-4 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-48 mb-4" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 rounded-lg" />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-4 text-sm">
          Impossible de charger les données météo. Réessayez plus tard.
        </div>
      )}

      {data && (
        <>
          <div className="bg-white rounded-xl shadow-md p-6 mb-4">
            <h3 className="font-bold text-slate-800 mb-4">🌡️ Conditions actuelles</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox
                label="Température"
                value={`${Math.round(data.currentTemp)}°C`}
                icon={weatherCodeToLabel(data.weatherCode).emoji}
                subtitle={weatherCodeToLabel(data.weatherCode).label}
              />
              <StatBox
                label="Enneigement"
                value={`${Math.round(data.snowDepth)} cm`}
                icon="🏔️"
                subtitle="au sol"
                highlight
              />
              <StatBox
                label="Neige fraîche 24h"
                value={`+${data.freshSnow24h} cm`}
                icon="❄️"
                subtitle="dernières 24h"
              />
              <StatBox
                label="Neige fraîche 72h"
                value={`+${data.freshSnow72h} cm`}
                icon="🌨️"
                subtitle="dernières 72h"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <StatBox
                label="Vent"
                value={`${Math.round(data.windSpeed)} km/h`}
                icon="💨"
              />
              <StatBox
                label="Isotherme 0°"
                value={`${data.freezingLevel} m`}
                icon="🌡️"
              />
            </div>
          </div>

          <div className="mb-4">
            <WeatherForecast forecast={data.forecast} />
          </div>
        </>
      )}

      {/* Webcams */}
      <div className="mb-6">
        <WebcamViewer lat={resort.lat} lon={resort.lon} resortName={resort.name} />
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
  subtitle,
  highlight,
}: {
  label: string;
  value: string;
  icon: string;
  subtitle?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg p-3 ${highlight ? 'bg-blue-50' : 'bg-slate-50'}`}>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className={`text-xl font-bold ${highlight ? 'text-blue-600' : 'text-slate-700'}`}>
          {value}
        </span>
      </div>
      {subtitle && <div className="text-[10px] text-slate-400 mt-0.5">{subtitle}</div>}
    </div>
  );
}
