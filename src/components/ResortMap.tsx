import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { resorts } from '../data/resorts';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons in Leaflet + Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const GENEVA_CENTER: [number, number] = [46.2044, 6.1432];

export default function ResortMap() {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Invalidate map size on mount (fixes rendering in tabs)
    setTimeout(() => mapRef.current?.invalidateSize(), 100);
  }, []);

  return (
    <div className="h-[500px] md:h-[600px] rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={GENEVA_CENTER}
        zoom={9}
        scrollWheelZoom={true}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {resorts.map((resort) => (
          <Marker key={resort.id} position={[resort.lat, resort.lon]}>
            <Popup>
              <div className="text-center">
                <strong className="text-sm">{resort.name}</strong>
                <br />
                <span className="text-xs text-slate-500">
                  {resort.altitudeMin}m – {resort.altitudeMax}m
                </span>
                <br />
                <Link
                  to={`/station/${resort.id}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Voir détails →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
