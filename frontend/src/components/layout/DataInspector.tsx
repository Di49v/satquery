'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Satellite, Bookmark, RotateCw, Download, LineChart, FileCode } from 'lucide-react';
import { useAuditStore } from '@/lib/store/useAuditStore';
import { useGeoStore } from '@/lib/store/useGeoStore';
import { useModalStore } from '@/lib/store/useModalStore';

// Dynamically import the minimap to prevent SSR crashes
const MiniMap = dynamic(() => import('@/components/map/MiniMap'), { ssr: false });

export default function DataInspector() {
  const { lat, lng } = useGeoStore();
  const { logs } = useAuditStore();
  const { openModal } = useModalStore();
  
  // State for Reverse Geocoding
  const [regionName, setRegionName] = useState("Acquiring Target...");
  const [terrainType, setTerrainType] = useState("--");

  // Reverse Geocoding Effect (Fires when map moves)
  useEffect(() => {
    const fetchLocation = async () => {
      setRegionName("Querying Live Sensors...");
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
        const data = await res.json();
        
        // Extract a clean name from the response
        const name = data && data.display_name ? data.display_name.split(',').slice(0, 3).join(', ') : "Uncharted/Oceanic Zone";
        setRegionName(name);

        // Simple terrain heuristic
        const isWater = data?.type === "water" || name.toLowerCase().includes("sea") || name.toLowerCase().includes("ocean");
        setTerrainType(isWater ? 'HYDROLOGICAL' : 'TERRESTRIAL');
      } catch (e) {
        setRegionName("Telemetry Link Failed");
      }
    };

    // Debounce the API call so we don't spam it while dragging
    const timer = setTimeout(fetchLocation, 600);
    return () => clearTimeout(timer);
  }, [lat, lng]);

  return (
    <aside className="w-72 bg-slate-50 border-l border-slate-300 flex flex-col z-40 shadow-[-2px_0_5px_rgba(0,0,0,0.05)] shrink-0">
      
      {/* Header */}
      <div className="bg-gov-header text-white p-2 flex justify-between items-center border-b-4 border-gov-saffron">
        <h3 className="font-bold text-xs uppercase tracking-wide flex items-center">
          <Satellite className="w-4 h-4 text-gov-saffron mr-2" /> Data Inspector
        </h3>
      </div>

      {/* Scrollable Content */}
      <div className="p-2.5 flex-1 overflow-y-auto panel-scroll flex flex-col">
        
        {/* Info Blocks */}
        <div className="mb-3 bg-white p-2 border border-slate-300 shadow-sm">
          <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Resolved Region</span><br/>
          <span className="text-sm font-semibold text-gov-blue">{regionName}</span>
        </div>
        
        <div className="mb-3 flex justify-between items-center bg-white p-1.5 border border-slate-300 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Target ID:</span>
          <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
            TRK-{Math.abs(Math.floor(lat * lng * 1000)).toString(16).toUpperCase().substring(0,6)}
          </span>
        </div>

        <button className="w-full mb-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 transition shadow border border-emerald-800 flex items-center justify-center">
          <Bookmark className="w-3 h-3 mr-2" /> Save to Wishlist
        </button>

        {/* Quick Look Preview */}
        <div className="mb-4">
          <div className="flex justify-between items-end mb-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Optical Quick Look</p>
            <button className="text-blue-600 hover:text-blue-800 text-[10px] font-medium flex items-center">
              <RotateCw className="w-2.5 h-2.5 mr-1" /> Sync
            </button>
          </div>
          <div className="w-full h-32 bg-slate-800 border-2 border-slate-400 shadow-inner relative">
             <MiniMap />
             {/* Yellow Targeting Box Overlay */}
             <div className="absolute inset-0 border-[3px] border-amber-500/50 pointer-events-none z-10 m-4"></div>
          </div>
        </div>

        {/* Metrics Table */}
        <div className="flex justify-between items-center mb-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Computed Metrics (Live)</p>
          <span className="text-[9px] bg-red-100 text-red-800 px-1 font-bold border border-red-300">CONFIDENTIAL</span>
        </div>
        <table className="w-full text-xs border-collapse border border-slate-300 mb-4 bg-white shadow-sm">
          <tbody>
            <tr className="bg-slate-50">
              <td className="border border-slate-300 px-2 py-1.5 text-slate-600 font-medium">Terrain Type</td>
              <td className="border border-slate-300 px-2 py-1.5 font-bold text-gov-blue">{terrainType}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 px-2 py-1.5 text-slate-600 font-medium">Est. Elevation</td>
              <td className="border border-slate-300 px-2 py-1.5 font-mono">-- (MSL)</td>
            </tr>
            <tr className="bg-slate-50">
              <td className="border border-slate-300 px-2 py-1.5 text-slate-600 font-medium">Grid Res</td>
              <td className="border border-slate-300 px-2 py-1.5 font-mono">15m / px</td>
            </tr>
          </tbody>
        </table>

        {/* Action Links */}
        <div className="flex flex-col space-y-2 border-t border-slate-300 pt-3 mt-auto">
          <button className="text-left text-xs font-semibold text-gov-accent hover:text-blue-800 transition flex items-center">
            <Download className="w-3 h-3 mr-1.5" /> Download FITS Array (Secure)
          </button>
          <button 
            onClick={() => openModal('analysis')}
            className="text-left text-xs font-bold text-purple-700 hover:text-purple-900 transition flex items-center"
          >
            <LineChart className="w-3 h-3 mr-1.5" /> Plot Regional Telemetry (Live)
          </button>
          <button className="text-left text-xs font-semibold text-gov-accent hover:text-blue-800 transition flex items-center">
            <FileCode className="w-3 h-3 mr-1.5" /> Export Metadata XML
          </button>
        </div>

        {/* Audit Log (Now Fully Dynamic!) */}
        <div className="mt-4 pt-3 border-t border-slate-300">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Session Audit Log</p>
          <div className="h-24 bg-slate-900 text-green-400 font-mono text-[9px] p-2 overflow-y-auto border border-slate-700 custom-scrollbar flex flex-col gap-1">
            {logs.map((log) => (
              <div key={log.id}>
                <span className="text-slate-500 mr-1">[{log.timestamp}]</span>
                <span>&gt; {log.message}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}