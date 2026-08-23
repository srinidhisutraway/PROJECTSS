import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Clinic } from '../../types';

// Leaflet's default marker icons reference image files in a way that
// breaks under bundlers like Vite unless explicitly re-pointed at CDN
// URLs — this is a well-known Leaflet+bundler quirk, not a bug in our code.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const dermIcon = L.divIcon({
  className: '',
  html: `<div style="background:#B85C6D;width:16px;height:16px;border-radius:50%;border:2.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const userIcon = L.divIcon({
  className: '',
  html: `<div style="background:#1F6F6B;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

interface LeafletMapViewProps {
  center: { lat: number; lng: number };
  clinics: Clinic[];
}

const LeafletMapView: React.FC<LeafletMapViewProps> = ({ center, clinics }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView([center.lat, center.lng], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous markers on re-render (new search results)
    map.eachLayer((layer) => {
      if ((layer as any)._isMediSenseMarker) map.removeLayer(layer);
    });

    const userMarker = L.marker([center.lat, center.lng], { icon: userIcon }).addTo(map);
    (userMarker as any)._isMediSenseMarker = true;
    userMarker.bindPopup('Your location');

    const bounds = L.latLngBounds([[center.lat, center.lng]]);

    clinics.forEach((clinic) => {
      if (!clinic.location) return;
      const marker = L.marker([clinic.location.lat, clinic.location.lng], { icon: dermIcon }).addTo(map);
      (marker as any)._isMediSenseMarker = true;
      marker.bindPopup(
        `<strong>${clinic.name}</strong><br/>${clinic.address || ''}${clinic.distanceKm ? `<br/>${clinic.distanceKm} km away` : ''}`
      );
      bounds.extend([clinic.location.lat, clinic.location.lng]);
    });

    if (clinics.length > 0) map.fitBounds(bounds, { padding: [30, 30] });
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center.lat, center.lng, clinics]);

  return <div ref={containerRef} className="h-[420px] w-full rounded-xl2" />;
};

export default LeafletMapView;
