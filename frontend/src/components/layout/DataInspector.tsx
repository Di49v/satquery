'use client';

import { Satellite, Bookmark, RotateCw, Download, LineChart, FileCode } from 'lucide-react';

export default function DataInspector() {
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
          <span className="text-sm font-semibold text-gov-blue">Amritsar, Punjab</span>
        </div>
        
        <div className="mb-3 flex justify-between items-center bg-white p-1.5 border border-slate-300 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Target ID:</span>
          <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">TRK-A9X2</span>
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
          <div className="w-full h-32 bg-slate-800 border-2 border-slate-400 shadow-inner flex items-center justify-center text-slate-500 text-[10px]">
            [ Preview Canvas ]
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
              <td className="border border-slate-300 px-2 py-1.5 font-bold text-gov-blue">TERRESTRIAL</td>
            </tr>
            <tr>
              <td className="border border-slate-300 px-2 py-1.5 text-slate-600 font-medium">Est. Elevation</td>
              <td className="border border-slate-300 px-2 py-1.5 font-mono">232m (MSL)</td>
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
          <button className="text-left text-xs font-bold text-purple-700 hover:text-purple-900 transition flex items-center">
            <LineChart className="w-3 h-3 mr-1.5" /> Plot Regional Telemetry (Live)
          </button>
          <button className="text-left text-xs font-semibold text-gov-accent hover:text-blue-800 transition flex items-center">
            <FileCode className="w-3 h-3 mr-1.5" /> Export Metadata XML
          </button>
        </div>

        {/* Audit Log */}
        <div className="mt-4 pt-3 border-t border-slate-300">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Session Audit Log</p>
          <div className="h-20 bg-slate-900 text-green-400 font-mono text-[9px] p-1.5 overflow-y-auto border border-slate-700">
            &gt; SysInit: GovRS Kernel Booted<br/>
            &gt; [18:22:14] Authentication Bypassed (Guest)<br/>
            &gt; [18:22:15] Optical Base Layer Initialized<br/>
          </div>
        </div>

      </div>
    </aside>
  );
}