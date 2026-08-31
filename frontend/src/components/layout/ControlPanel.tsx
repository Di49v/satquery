'use client';

import { useState, useEffect } from 'react';
import { Sliders, Search, Crosshair, Layers, Minus, Plus, Loader2 } from 'lucide-react';
import { useGeoStore } from '@/lib/store/useGeoStore';

export default function ControlPanel() {
  const [openSection, setOpenSection] = useState<string | null>('search');
  
  // Connect to global store
  const { lat, lng, zoom, activeLayers, setCoordinates, setZoom, toggleLayer } = useGeoStore();

  // Local state for inputs (allows typing without forcing immediate map jumps)
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [zoomInput, setZoomInput] = useState('');
  
  // Geocoding Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const toggle = (section: string) => setOpenSection(openSection === section ? null : section);

  // 1. Sync FROM Map TO Inputs
  useEffect(() => {
    setLatInput(lat.toFixed(5));
    setLngInput(lng.toFixed(5));
    setZoomInput(zoom.toString());
  }, [lat, lng, zoom]);

  // 2. Sync FROM Inputs TO Map
  const handleUpdateView = () => {
    const parsedLat = parseFloat(latInput);
    const parsedLng = parseFloat(lngInput);
    const parsedZoom = parseInt(zoomInput, 10);
    
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      setCoordinates(parsedLat, parsedLng);
    }
    if (!isNaN(parsedZoom)) {
      setZoom(parsedZoom);
    }
  };

  // 3. Forward Geocoding (Name -> Coordinates)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat);
        const newLng = parseFloat(data[0].lon);
        setCoordinates(newLat, newLng);
        setZoom(12); // Standard city-level zoom
        setSearchQuery(''); // Clear the box on success
      } else {
        alert("Target not found. Try adding a country or state.");
      }
    } catch (e) {
      console.error("Geocoding failed", e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <aside className="w-72 bg-slate-50 border-r border-slate-300 flex flex-col z-40 shadow-[2px_0_5px_rgba(0,0,0,0.05)] shrink-0">
      
      {/* Panel Header */}
      <div className="p-2.5 border-b border-slate-300 bg-slate-200 flex justify-between items-center">
        <h2 className="font-bold text-gov-blue text-xs uppercase tracking-wider">Control Panel</h2>
        <Sliders className="w-4 h-4 text-slate-500" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto panel-scroll p-2 space-y-2">
        
        {/* Accordion 1: Search */}
        <div className="border border-slate-300 bg-white shadow-sm">
          <button onClick={() => toggle('search')} className="w-full bg-gov-blue text-white text-xs font-semibold py-2 px-3 flex justify-between items-center transition-colors">
            <span className="flex items-center"><Search className="w-3 h-3 mr-2" /> Find by Name</span>
            {openSection === 'search' ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          </button>
          
          {openSection === 'search' && (
            <div className="p-2.5">
              <div className="relative mb-2">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="e.g., Amritsar, New Delhi" 
                  className="w-full text-xs p-1.5 pr-7 border border-slate-300 focus:outline-none focus:border-gov-accent" 
                />
                {isSearching && <Loader2 className="absolute right-1.5 top-1.5 w-3 h-3 animate-spin text-gov-accent" />}
              </div>
              <button 
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full bg-gov-saffron hover:bg-amber-600 text-slate-900 text-xs font-bold py-1.5 transition shadow-sm border border-amber-600 disabled:opacity-50"
              >
                Resolve Target
              </button>
            </div>
          )}
        </div>

        {/* Accordion 2: Coordinates */}
        <div className="border border-slate-300 bg-white shadow-sm">
          <button onClick={() => toggle('coords')} className="w-full bg-gov-blue text-white text-xs font-semibold py-2 px-3 flex justify-between items-center transition-colors">
            <span className="flex items-center"><Crosshair className="w-3 h-3 mr-2" /> Spatial Parameters</span>
            {openSection === 'coords' ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          </button>
          
          {openSection === 'coords' && (
            <div className="p-2.5 space-y-2">
              <div className="flex items-center justify-between text-xs bg-slate-50 p-1 border border-slate-200">
                <label className="w-16 font-medium text-slate-600">LAT (deg)</label>
                <input 
                  type="number" 
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateView()}
                  className="w-32 p-1 border border-slate-300 text-right font-mono focus:outline-none focus:border-gov-accent" 
                />
              </div>
              <div className="flex items-center justify-between text-xs bg-slate-50 p-1 border border-slate-200">
                <label className="w-16 font-medium text-slate-600">LON (deg)</label>
                <input 
                  type="number" 
                  value={lngInput}
                  onChange={(e) => setLngInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateView()}
                  className="w-32 p-1 border border-slate-300 text-right font-mono focus:outline-none focus:border-gov-accent" 
                />
              </div>
              <div className="flex items-center justify-between text-xs bg-slate-50 p-1 border border-slate-200">
                <label className="w-16 font-medium text-slate-600">Scale (z)</label>
                <input 
                  type="number" 
                  value={zoomInput}
                  onChange={(e) => setZoomInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateView()}
                  min="1" max="19"
                  className="w-32 p-1 border border-slate-300 text-right font-mono focus:outline-none focus:border-gov-accent" 
                />
              </div>
              <button 
                onClick={handleUpdateView}
                className="w-full mt-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-1.5 transition border border-slate-400"
              >
                Update View
              </button>
            </div>
          )}
        </div>

        {/* Accordion 3: Overlays */}
        <div className="border border-slate-300 bg-white shadow-sm">
          <button onClick={() => toggle('overlays')} className="w-full bg-gov-blue text-white text-xs font-semibold py-2 px-3 flex justify-between items-center transition-colors">
            <span className="flex items-center"><Layers className="w-3 h-3 mr-2" /> Active Overlays</span>
            {openSection === 'overlays' ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          </button>
          
          {openSection === 'overlays' && (
            <div className="p-2.5 space-y-1.5 text-xs text-slate-700 flex flex-col">
              
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-100 p-1 border border-transparent hover:border-slate-200">
                <input 
                  type="checkbox" 
                  checked={activeLayers.includes('osm')}
                  onChange={() => toggleLayer('osm')}
                  className="form-checkbox h-3.5 w-3.5 text-gov-accent" 
                /> 
                <span className="font-medium">OSM Vector Base</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-100 p-1 border border-transparent hover:border-slate-200">
                <input 
                  type="checkbox" 
                  checked={activeLayers.includes('optical')}
                  onChange={() => toggleLayer('optical')}
                  className="form-checkbox h-3.5 w-3.5 text-gov-accent" 
                /> 
                <span className="font-medium">High-Res Optical (Esri)</span>
              </label>
              
              <hr className="border-slate-200 my-1" />
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Live Telemetry</div>
              
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-100 p-1 border border-transparent hover:border-slate-200">
                <input 
                  type="checkbox" 
                  checked={activeLayers.includes('ndvi')}
                  onChange={() => toggleLayer('ndvi')}
                  className="form-checkbox h-3.5 w-3.5 text-gov-accent" 
                /> 
                <span className="font-medium text-emerald-700">MODIS NDVI (Vegetation)</span>
              </label>

            </div>
          )}
        </div>

      </div>
    </aside>
  );
}