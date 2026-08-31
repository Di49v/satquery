'use client';

import dynamic from 'next/dynamic';
import { useGeoStore } from '@/lib/store/useGeoStore';

// Dynamically import the map, disabling Server-Side Rendering
const MapCanvas = dynamic(() => import('./MapCanvas'), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-mono text-sm bg-black">
      [ INITIALIZING SATELLITE RENDER ENGINE... ]
    </div>
  )
});

export default function MapWrapper() {
  const { lat, lng } = useGeoStore();

  return (
    <div className="w-full h-full bg-black relative overflow-hidden">
      
      {/* The Leaflet Map */}
      <MapCanvas />

      {/* Target Crosshair (Stays perfectly centered) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-[400]">
        <div className="absolute top-[9px] left-0 w-5 h-[2px] bg-green-500/80"></div>
        <div className="absolute top-0 left-[9px] w-[2px] h-5 bg-green-500/80"></div>
      </div>

      {/* Live Coordinate Display */}
      <div className="absolute top-3 left-3 z-[400] bg-white/95 border border-slate-400 px-3 py-1.5 shadow-md pointer-events-none font-mono text-xs flex flex-col">
        <span className="font-bold text-gov-blue border-b border-slate-300 pb-1 mb-1">TARGET COORDS</span>
        <span>Lat: <span className="text-slate-700">{lat.toFixed(5)}</span></span>
        <span>Lon: <span className="text-slate-700">{lng.toFixed(5)}</span></span>
      </div>
      
    </div>
  );
}