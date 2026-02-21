import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import ResortDetailPage from './pages/ResortDetailPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/toto">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/carte" element={<MapPage />} />
              <Route path="/station/:id" element={<ResortDetailPage />} />
            </Routes>
          </main>
          <footer className="text-center text-xs text-slate-400 py-4">
            Météo des Neiges · Données{' '}
            <a href="https://open-meteo.com" className="underline" target="_blank" rel="noopener">Open-Meteo</a>
            {' '}& <a href="https://api.windy.com" className="underline" target="_blank" rel="noopener">Windy Webcams</a>
          </footer>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

