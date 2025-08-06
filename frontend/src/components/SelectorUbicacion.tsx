'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}

function EventosMapa({ onChange }: { onChange: Props['onChange'] }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function SelectorUbicacion({ lat, lng, onChange }: Props) {
  const posicion = lat && lng ? { lat, lng } : { lat: 4.711, lng: -74.0721 };

  const icono = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <MapContainer center={posicion} zoom={13} className="h-64 w-full rounded-lg z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
      />
      {lat && lng && <Marker position={posicion} icon={icono} />}
      <EventosMapa onChange={onChange} />
    </MapContainer>
  );
}