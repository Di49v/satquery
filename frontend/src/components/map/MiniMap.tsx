'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useGeoStore } from '@/lib/store/useGeoStore';

// 1. Define the props the component is allowed to accept
interface MiniMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
}

function MiniMapSync({ lat, lng, zoom }: { lat: number, lng: number, zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], Math.max(zoom - 4, 2));
  }, [lat, lng, zoom, map]);
  return null;
}

// 2. Pass the props interface into the component
export default function MiniMap(props: MiniMapProps) {
  const geoStore = useGeoStore();

  // 3. Prefer passed props, otherwise fallback to the global Zustand store
  const lat = props.lat ?? geoStore.lat;
  const lng = props.lng ?? geoStore.lng;
  const zoom = props.zoom ?? geoStore.zoom;

  // FIX: Freeze the initial props. React-Leaflet crashes if these change on the MapContainer.
  const [initial] = useState({ lat, lng, zoom: Math.max(zoom - 4, 2) });
  const [isMounted, setIsMounted] = useState(false);

  // Prevents Next.js SSR mismatch and strict-mode double mount errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <MapContainer 
      // The unique key forces React to create a fresh DOM node for Leaflet
      key={`minimap-${initial.lat}-${initial.lng}`} 
      center={[initial.lat, initial.lng]} 
      zoom={initial.zoom} 
      zoomControl={false} 
      dragging={false} 
      scrollWheelZoom={false} 
      doubleClickZoom={false} 
      className="w-full h-full bg-[#1a1a1a] z-0"
    >
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      <MiniMapSync lat={lat} lng={lng} zoom={zoom} />
    </MapContainer>
  );
}