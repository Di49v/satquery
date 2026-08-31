'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useGeoStore } from '@/lib/store/useGeoStore';

function MiniMapSync({ lat, lng, zoom }: { lat: number, lng: number, zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], Math.max(zoom - 4, 2));
  }, [lat, lng, zoom, map]);
  return null;
}

export default function MiniMap() {
  const { lat, lng, zoom } = useGeoStore();

  // FIX: Freeze the initial props. React-Leaflet crashes if these change on the MapContainer.
  const [initial] = useState({ lat, lng, zoom: Math.max(zoom - 4, 2) });

  return (
    <MapContainer 
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