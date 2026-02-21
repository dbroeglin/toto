import type { DayForecast } from '../types';
import { weatherCodeToLabel } from '../services/weather';

interface Props {
  forecast: DayForecast[];
}

const dayName = (dateStr: string): string => {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = (d.getTime() - today.getTime()) / 86400000;
  if (diff < 1) return "Aujourd'hui";
  if (diff < 2) return 'Demain';
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
};

export default function WeatherForecast({ forecast }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="font-bold text-slate-800 mb-3">📅 Prévisions 7 jours</h3>
      <div className="divide-y divide-slate-100">
        {forecast.map((day) => {
          const { emoji, label } = weatherCodeToLabel(day.weatherCode);
          return (
            <div key={day.date} className="flex items-center justify-between py-2.5 text-sm">
              <div className="w-24 font-medium text-slate-700">{dayName(day.date)}</div>
              <div className="flex items-center gap-1.5 w-36">
                <span className="text-lg">{emoji}</span>
                <span className="text-xs text-slate-500 truncate">{label}</span>
              </div>
              <div className="text-right w-20">
                <span className="font-semibold text-slate-700">{Math.round(day.tempMax)}°</span>
                <span className="text-slate-400 ml-1">{Math.round(day.tempMin)}°</span>
              </div>
              <div className="text-right w-20">
                {day.snowfall > 0 && (
                  <span className="text-blue-500 font-medium">❄️ {Math.round(day.snowfall)} cm</span>
                )}
                {day.snowfall === 0 && day.precipitation > 0 && (
                  <span className="text-slate-400">🌧️ {day.precipitation.toFixed(1)} mm</span>
                )}
              </div>
              <div className="text-right w-16 text-xs text-slate-400">
                💨 {Math.round(day.windSpeedMax)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
