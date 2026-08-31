'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useGeoStore } from '@/lib/store/useGeoStore';

// Component to sync map movements back to the Zustand store
function MapController() {
  const { setCoordinates, setZoom } = useGeoStore();
  
  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      const center = map.getCenter();
      setCoordinates(center.lat, center.lng);
      setZoom(map.getZoom());
    },
    click: (e) => {
      const map = e.target;
      map.panTo(e.latlng);
      setCoordinates(e.latlng.lat, e.latlng.lng);
    }
  });

  return null;
}

// Component to programmatically move the map when store updates (e.g. from the Control Panel)
function MapFlyTo() {
  const { lat, lng, zoom } = useGeoStore();
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [lat, lng, zoom, map]);

  return null;
}

export default function MapCanvas() {
  const { lat, lng, zoom, activeLayers } = useGeoStore();

  return (
    <MapContainer 
      center={[lat, lng]} 
      zoom={zoom} 
      zoomControl={false} // We will use custom UI for this later
      className="w-full h-full bg-[#1a1a1a] z-0"
    >
      <MapController />
      <MapFlyTo />

      {/* Base Maps */}
      {activeLayers.includes('osm') && (
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
      )}
      
      {activeLayers.includes('optical') && (
        <TileLayer
          attribution='Esri World Imagery'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
      )}

      {/* NASA GIBS Overlays (Mocking the date for now) */}
      {activeLayers.includes('ndvi') && (
        <TileLayer
          attribution='NASA MODIS NDVI'
          url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/2024-01-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`}
          maxZoom={9}
          opacity={0.8}
        />
      )}
    </MapContainer>
  );
}