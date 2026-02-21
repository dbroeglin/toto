import { useQuery } from '@tanstack/react-query';
import { fetchWebcamsNear, isWebcamConfigured } from '../services/webcams';

interface Props {
  lat: number;
  lon: number;
  resortName: string;
}

export default function WebcamViewer({ lat, lon, resortName }: Props) {
  const configured = isWebcamConfigured();

  const { data: webcams, isLoading } = useQuery({
    queryKey: ['webcams', lat, lon],
    queryFn: () => fetchWebcamsNear(lat, lon),
    staleTime: 2 * 60 * 1000, // Refresh every 2 min (tokens expire in 10)
    enabled: configured,
  });

  if (!configured) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="font-bold text-slate-800 mb-2">📷 Webcams</h3>
        <div className="text-sm text-slate-500 bg-amber-50 rounded-lg p-3">
          <p className="font-medium text-amber-700 mb-1">Configuration requise</p>
          <p>
            Ajoutez votre clé API Windy dans le fichier <code className="bg-amber-100 px-1 rounded">.env</code> :
          </p>
          <code className="block mt-1 text-xs bg-amber-100 p-2 rounded">
            VITE_WINDY_API_KEY=votre_clé_ici
          </code>
          <p className="mt-1 text-xs">
            Inscription gratuite sur{' '}
            <a href="https://api.windy.com" target="_blank" rel="noopener" className="text-blue-600 underline">
              api.windy.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="font-bold text-slate-800 mb-3">📷 Webcams</h3>
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-200 rounded-lg aspect-video" />
          ))}
        </div>
      </div>
    );
  }

  if (!webcams || webcams.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="font-bold text-slate-800 mb-2">📷 Webcams</h3>
        <p className="text-sm text-slate-500">Aucune webcam trouvée près de {resortName}.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="font-bold text-slate-800 mb-3">📷 Webcams en direct</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {webcams.map((cam) => (
          <div key={cam.id} className="group relative overflow-hidden rounded-lg">
            <img
              src={cam.image?.current?.preview || cam.image?.current?.thumbnail}
              alt={cam.title}
              loading="lazy"
              className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-white text-xs font-medium truncate">{cam.title}</p>
              {cam.location?.city && (
                <p className="text-white/70 text-[10px]">{cam.location.city}</p>
              )}
            </div>
            {cam.status === 'active' && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
