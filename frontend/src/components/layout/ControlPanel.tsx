'use client';

import { useState } from 'react';
import { Sliders, Search, Crosshair, Layers, Bookmark, Microscope, Minus, Plus } from 'lucide-react';

export default function ControlPanel() {
  // Simple state to manage accordions
  const [openSection, setOpenSection] = useState<string | null>('search');

  const toggle = (section: string) => setOpenSection(openSection === section ? null : section);

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
          <button onClick={() => toggle('search')} className="w-full bg-gov-blue text-white text-xs font-semibold py-2 px-3 flex justify-between items-center">
            <span className="flex items-center"><Search className="w-3 h-3 mr-2" /> Find by Name</span>
            {openSection === 'search' ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          </button>
          {openSection === 'search' && (
            <div className="p-2.5">
              <input type="text" placeholder="e.g., Amritsar, New Delhi" className="w-full text-xs p-1.5 border border-slate-300 focus:outline-none focus:border-gov-accent mb-2" />
              <button className="w-full bg-gov-saffron hover:bg-amber-600 text-slate-900 text-xs font-bold py-1.5 transition shadow-sm border border-amber-600">
                Resolve Target
              </button>
            </div>
          )}
        </div>

        {/* Accordion 2: Coordinates */}
        <div className="border border-slate-300 bg-white shadow-sm">
          <button onClick={() => toggle('coords')} className="w-full bg-gov-blue text-white text-xs font-semibold py-2 px-3 flex justify-between items-center">
            <span className="flex items-center"><Crosshair className="w-3 h-3 mr-2" /> Spatial Parameters</span>
            {openSection === 'coords' ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          </button>
          {openSection === 'coords' && (
            <div className="p-2.5 space-y-2">
              <div className="flex items-center justify-between text-xs bg-slate-50 p-1 border border-slate-200">
                <label className="w-16 font-medium text-slate-600">LAT</label>
                <input type="text" readOnly className="w-32 p-1 border border-slate-300 text-right font-mono" placeholder="31.6340" />
              </div>
              <div className="flex items-center justify-between text-xs bg-slate-50 p-1 border border-slate-200">
                <label className="w-16 font-medium text-slate-600">LON</label>
                <input type="text" readOnly className="w-32 p-1 border border-slate-300 text-right font-mono" placeholder="74.8723" />
              </div>
              <button className="w-full mt-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-1.5 transition border border-slate-400">
                Update View
              </button>
            </div>
          )}
        </div>

        {/* Accordion 3: Overlays */}
        <div className="border border-slate-300 bg-white shadow-sm">
          <button onClick={() => toggle('overlays')} className="w-full bg-gov-blue text-white text-xs font-semibold py-2 px-3 flex justify-between items-center">
            <span className="flex items-center"><Layers className="w-3 h-3 mr-2" /> Active Overlays</span>
            {openSection === 'overlays' ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          </button>
          {openSection === 'overlays' && (
            <div className="p-2.5 space-y-1.5 text-xs text-slate-700 flex flex-col">
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-100 p-1 border border-transparent hover:border-slate-200">
                <input type="checkbox" className="form-checkbox h-3.5 w-3.5 text-gov-accent" /> 
                <span className="font-medium">OSM Vector Base</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-100 p-1 border border-transparent hover:border-slate-200">
                <input type="checkbox" defaultChecked className="form-checkbox h-3.5 w-3.5 text-gov-accent" /> 
                <span className="font-medium">High-Res Optical (Esri)</span>
              </label>
              <hr className="border-slate-200 my-1" />
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Live Telemetry</div>
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-100 p-1 border border-transparent hover:border-slate-200">
                <input type="checkbox" className="form-checkbox h-3.5 w-3.5 text-gov-accent" /> 
                <span className="font-medium">MODIS NDVI (Vegetation)</span>
              </label>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
}