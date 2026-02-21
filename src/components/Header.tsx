import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">🏔️</span>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Météo des Neiges
          </h1>
        </Link>
        <nav className="flex gap-4 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition-colors no-underline">
            Stations
          </Link>
          <Link to="/carte" className="hover:text-blue-600 transition-colors no-underline">
            Carte
          </Link>
        </nav>
      </div>
    </header>
  );
}
