import { useState } from 'react';
import { resorts } from '../data/resorts';
import ResortCard from '../components/ResortCard';

type SortOption = 'name' | 'distance' | 'altitude';
type CountryFilter = 'all' | 'CH' | 'FR';

export default function HomePage() {
  const [sort, setSort] = useState<SortOption>('distance');
  const [country, setCountry] = useState<CountryFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = resorts
    .filter((r) => country === 'all' || r.country === country)
    .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'distance') return a.distanceFromGenevaKm - b.distanceFromGenevaKm;
      return b.altitudeMax - a.altitudeMax;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
          ❄️ Conditions de ski autour de Genève
        </h2>
        <p className="text-slate-500 text-sm md:text-base">
          Météo en temps réel, enneigement et webcams pour {resorts.length} stations des Alpes
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="🔍 Rechercher une station..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <div className="flex gap-2">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as CountryFilter)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
          >
            <option value="all">🌍 Tous</option>
            <option value="FR">🇫🇷 France</option>
            <option value="CH">🇨🇭 Suisse</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
          >
            <option value="distance">📍 Distance</option>
            <option value="name">🔤 Nom</option>
            <option value="altitude">⛰️ Altitude</option>
          </select>
        </div>
      </div>

      {/* Resort grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((resort) => (
          <ResortCard key={resort.id} resort={resort} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          Aucune station trouvée pour cette recherche.
        </div>
      )}
    </div>
  );
}
