import ResortMap from '../components/ResortMap';

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">🗺️ Carte des stations</h2>
      <ResortMap />
    </div>
  );
}
