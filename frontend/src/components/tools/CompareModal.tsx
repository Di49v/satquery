'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, X, Printer, Camera, Mountain, Map, Leaf, ThermometerSun, Moon } from 'lucide-react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useModalStore } from '@/lib/store/useModalStore';
import { useGeoStore } from '@/lib/store/useGeoStore';

// Helper component to force map updates when coordinates change
function SyncView({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [lat, lng, zoom, map]);
  return null;
}

export default function CompareModal() {
  const { activeModal, closeModal } = useModalStore();
  const { lat, lng, zoom } = useGeoStore();

  // Freeze initial coordinates for the 6 maps to prevent leaflet re-mount bugs
  const [initial] = useState({ lat, lng, zoom: Math.min(zoom, 12) });
  const gibsDate = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  if (activeModal !== 'compare') return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 z-[999] flex justify-center items-center p-6 backdrop-blur-sm">
      <div className="bg-slate-100 shadow-2xl w-full max-w-7xl flex flex-col h-[92vh] border-2 border-slate-500 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b-2 border-slate-400 bg-white shrink-0">
          <div className="flex items-center">
            <div className="bg-gov-blue text-white p-2 mr-3">
              <LayoutGrid className="w-5 h-5"/>
            </div>
            <div>
              <h2 className="text-base font-bold text-gov-blue tracking-wide">MULTISPECTRAL SENSOR COMPARISON MATRIX</h2>
              <p className="text-xs font-mono text-slate-500">
                TARGET LAT: {lat.toFixed(4)} | LON: {lng.toFixed(4)}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handlePrint}
              className="bg-slate-200 hover:bg-slate-300 border border-slate-400 text-slate-800 px-4 py-1.5 text-xs font-bold transition shadow-sm flex items-center"
            >
              <Printer className="w-3.5 h-3.5 mr-1 text-red-600" /> Export PDF
            </button>
            <button 
              onClick={closeModal}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-1.5 text-xs font-bold transition shadow-sm border border-red-900 flex items-center"
            >
              <X className="w-3.5 h-3.5 mr-1" /> Close
            </button>
          </div>
        </div>

        {/* 6-Map Grid Content */}
        <div className="p-4 flex-1 overflow-y-auto bg-slate-200 panel-scroll">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">

            {/* Map 1: Optical */}
            <div className="bg-white border border-slate-400 shadow-sm flex flex-col overflow-hidden min-h-[250px]">
              <div className="px-3 py-1.5 border-b border-slate-300 bg-slate-100 flex justify-between items-center">
                <span className="font-bold text-xs text-slate-800 flex items-center"><Camera className="w-3.5 h-3.5 mr-1 text-slate-500" /> High-Res Optical</span>
                <span className="text-[9px] font-mono font-bold bg-slate-300 px-1 text-slate-700">RGB</span>
              </div>
              <div className="flex-1 relative">
                <MapContainer center={[initial.lat, initial.lng]} zoom={initial.zoom} zoomControl={false} dragging={false} scrollWheelZoom={false} className="w-full h-full bg-black">
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                  <SyncView lat={lat} lng={lng} zoom={Math.min(zoom, 12)} />
                </MapContainer>
              </div>
            </div>

            {/* Map 2: Topo */}
            <div className="bg-white border border-slate-400 shadow-sm flex flex-col overflow-hidden min-h-[250px]">
              <div className="px-3 py-1.5 border-b border-slate-300 bg-slate-100 flex justify-between items-center">
                <span className="font-bold text-xs text-slate-800 flex items-center"><Mountain className="w-3.5 h-3.5 mr-1 text-slate-500" /> Digital Elevation</span>
                <span className="text-[9px] font-mono font-bold bg-slate-300 px-1 text-slate-700">DEM</span>
              </div>
              <div className="flex-1 relative">
                <MapContainer center={[initial.lat, initial.lng]} zoom={initial.zoom} zoomControl={false} dragging={false} scrollWheelZoom={false} className="w-full h-full bg-black">
                  <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
                  <SyncView lat={lat} lng={lng} zoom={Math.min(zoom, 12)} />
                </MapContainer>
              </div>
            </div>

            {/* Map 3: Vector Base (Stadia Light) */}
            <div className="bg-white border border-slate-400 shadow-sm flex flex-col overflow-hidden min-h-[250px]">
              <div className="px-3 py-1.5 border-b border-slate-300 bg-slate-100 flex justify-between items-center">
                <span className="font-bold text-xs text-slate-800 flex items-center"><Map className="w-3.5 h-3.5 mr-1 text-slate-500" /> Vector Base</span>
                <span className="text-[9px] font-mono font-bold bg-slate-300 px-1 text-slate-700">INFRA</span>
              </div>
              <div className="flex-1 relative">
                <MapContainer center={[initial.lat, initial.lng]} zoom={initial.zoom} zoomControl={false} dragging={false} scrollWheelZoom={false} className="w-full h-full bg-black">
                  <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
                  <SyncView lat={lat} lng={lng} zoom={Math.min(zoom, 12)} />
                </MapContainer>
              </div>
            </div>

            {/* Map 4: NDVI */}
            <div className="bg-white border border-slate-400 shadow-sm flex flex-col overflow-hidden min-h-[250px]">
              <div className="px-3 py-1.5 border-b border-slate-300 bg-emerald-50 flex justify-between items-center">
                <span className="font-bold text-xs text-emerald-900 flex items-center"><Leaf className="w-3.5 h-3.5 mr-1 text-emerald-700" /> Vegetation Index</span>
                <span className="text-[9px] font-mono font-bold bg-emerald-200 px-1 text-emerald-800">NDVI</span>
              </div>
              <div className="flex-1 relative">
                <MapContainer center={[initial.lat, initial.lng]} zoom={initial.zoom} zoomControl={false} dragging={false} scrollWheelZoom={false} className="w-full h-full bg-black">
                  <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
                  <TileLayer url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/${gibsDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`} maxNativeZoom={9} opacity={0.8} />
                  <SyncView lat={lat} lng={lng} zoom={Math.min(zoom, 12)} />
                </MapContainer>
              </div>
            </div>

            {/* Map 5: Thermal */}
            <div className="bg-white border border-slate-400 shadow-sm flex flex-col overflow-hidden min-h-[250px]">
              <div className="px-3 py-1.5 border-b border-slate-300 bg-amber-50 flex justify-between items-center">
                <span className="font-bold text-xs text-amber-900 flex items-center"><ThermometerSun className="w-3.5 h-3.5 mr-1 text-amber-700" /> Surface Temp</span>
                <span className="text-[9px] font-mono font-bold bg-amber-200 px-1 text-amber-800">LST</span>
              </div>
              <div className="flex-1 relative">
                <MapContainer center={[initial.lat, initial.lng]} zoom={initial.zoom} zoomControl={false} dragging={false} scrollWheelZoom={false} className="w-full h-full bg-black">
                  <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
                  <TileLayer url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Land_Surface_Temp_Day/default/${gibsDate}/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png`} maxNativeZoom={7} opacity={0.7} />
                  <SyncView lat={lat} lng={lng} zoom={Math.min(zoom, 12)} />
                </MapContainer>
              </div>
            </div>

            {/* Map 6: Night Lights (Stadia Dark) */}
            <div className="bg-white border border-slate-400 shadow-sm flex flex-col overflow-hidden min-h-[250px]">
              <div className="px-3 py-1.5 border-b border-slate-300 bg-indigo-50 flex justify-between items-center">
                <span className="font-bold text-xs text-indigo-900 flex items-center"><Moon className="w-3.5 h-3.5 mr-1 text-indigo-700" /> Socio-Econ (Night)</span>
                <span className="text-[9px] font-mono font-bold bg-indigo-200 px-1 text-indigo-800">VIIRS</span>
              </div>
              <div className="flex-1 relative">
                <MapContainer center={[initial.lat, initial.lng]} zoom={initial.zoom} zoomControl={false} dragging={false} scrollWheelZoom={false} className="w-full h-full bg-black">
                  <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />
                  <TileLayer url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_DayNightBand_ENCC/default/${gibsDate}/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png`} maxNativeZoom={8} />
                  <SyncView lat={lat} lng={lng} zoom={Math.min(zoom, 12)} />
                </MapContainer>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}