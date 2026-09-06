"use client";

import { useGeoStore } from '@/lib/store/useGeoStore';
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useObservationStore } from '@/lib/store/useObservationStore';
import { useGeoChatStore } from '@/lib/store/useGeoChatStore';
import { MapPin, Upload, Satellite, Send, Loader2, ChevronDown, History } from 'lucide-react';
import ChatMessage from '@/components/satquery/ChatMessage';
import HistoryDrawer from '@/components/satquery/HistoryDrawer';

// Dynamically import the minimap to prevent Next.js SSR crashes
const MiniMap = dynamic(() => import('@/components/map/MiniMap'), { ssr: false });

export default function SatQueryWorkspace() {
  const { activeObservations } = useObservationStore();
  const { lat, lng } = useGeoStore(); // Read directly from your map's global state
  
  // Reading from the global GeoChat store to keep history synced with the popup
  const { messages, addMessage } = useGeoChatStore(); 
  
  const [query, setQuery] = useState('');
  const [visType, setVisType] = useState('Auto');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { sessionId, startNewSession } = useGeoChatStore();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Auto-scroll the stream down when a new message processes
  useEffect(() => {
    if (scrollRef.current && messages.length > 1) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const handleSendMessage = async () => {
    if (!query.trim() || isProcessing) return;

    const userText = query.trim();
    setQuery('');
    
    // 1. Append User Message to Global Store
    addMessage({
      sender: 'USER',
      text: userText,
      isUser: true,
      lat: lat,
      lng: lng,
      zoom: 12,
    });
    
    setIsProcessing(true);

    try {
      // 2. Call the FastAPI Backend
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: userText,
          sender: 'USER',
          lat: lat || 31.6340,
          lng: lng || 74.8723,
          zoom: 12,
          observations: activeObservations,
          preferred_visualization: visType 
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      // 3. Append AI Response to Global Store
      addMessage({
        sender: data.sender || 'GOVRS_AGENT',
        text: data.text,
        isUser: false,
        lat: data.lat,
        lng: data.lng,
        zoom: data.zoom,
        evidence: data.evidence,
        trace: data.trace
      });
      
    } catch (error) {
      console.error('Chat API Error:', error);
      addMessage({
        sender: 'SYSTEM_ERR',
        text: 'Error: Failed to connect to the SatQuery backend.',
        isUser: false,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); }
  };

  return (
    // 'flex-1' ensures it perfectly fills the space provided by layout.tsx
    <main className="flex-1 flex w-full bg-slate-50 text-slate-800 overflow-hidden relative">
      
      {/* LEFT PANEL: Analysis Context (Fixed Width) */}
      <aside className="w-[350px] bg-white border-r border-slate-300 flex flex-col shrink-0 overflow-y-auto shadow-sm z-10">
        <div className="p-5">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Analysis Context</h2>
          
          {/* Mini Map */}
          <div className="h-48 bg-slate-200 rounded overflow-hidden border border-slate-300 relative mb-4 shadow-inner">
             {lat && lng ? (
               <MiniMap lat={lat} lng={lng} zoom={12} />
             ) : (
               <div className="flex items-center justify-center h-full text-slate-400 text-xs font-medium">No AOI Selected</div>
             )}
          </div>

          {/* Coordinates */}
          {lat && lng && (
            <div className="flex items-center text-xs font-mono text-slate-700 bg-slate-100 p-2.5 rounded border border-slate-200 mb-6">
              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
              {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
            </div>
          )}

          {/* Active Observations */}
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-4">Observations Basket</h3>
          <div className="space-y-2.5">
            {activeObservations && activeObservations.length > 0 ? activeObservations.map((obs) => (
              <div key={obs.id} className="flex justify-between items-center p-3 bg-blue-50/50 border border-blue-200 rounded text-xs">
                <span className="font-bold text-blue-900">{obs.sensor}</span>
                <span className="text-slate-500 font-mono">{obs.date}</span>
                <span className="text-[10px] uppercase px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600">{obs.modality}</span>
              </div>
            )) : (
              <div className="text-xs text-slate-500 italic p-5 text-center border border-dashed border-slate-300 rounded bg-slate-50">
                No observations added. Upload or select from Map Feed.
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL: Command & Stream */}
      <section className="flex-1 flex flex-col bg-slate-100/50 relative overflow-hidden">
        
        {/* COMMAND CONSOLE (TOP) */}
        <div className="bg-white border-b border-slate-300 p-6 shrink-0 shadow-sm z-20">
          <div className="max-w-4xl mx-auto flex flex-col gap-3">
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Query Console</span>
              
              <div className="flex items-center space-x-3">
                {/* NEW: History Button */}
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className="flex items-center text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded shadow-sm"
                >
                  <History className="w-3 h-3 mr-2" /> Session History
                </button>

                {/* EXISTING: Multiselect / Output Preferences */}
                <div className="relative">
                  <select 
                    value={visType}
                    onChange={(e) => setVisType(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium rounded pl-3 pr-8 py-1.5 outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                  >
                    <option value="Auto">Auto Visualization</option>
                    <option value="BarChart">Force: Bar Chart</option>
                    <option value="PieChart">Force: Pie Chart</option>
                    <option value="MaskOverlay">Force: Mask Overlay</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded shadow-inner focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              
              {/* Action Tools */}
              <div className="flex items-center pl-3 pr-1 space-x-1 border-r border-slate-300">
                <button className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-200 rounded transition-colors" title="Upload Source"><Upload className="w-4 h-4" /></button>
                <button className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-200 rounded transition-colors" title="Tag Coordinate"><MapPin className="w-4 h-4" /></button>
                <button className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-200 rounded transition-colors" title="Select Sat Data"><Satellite className="w-4 h-4" /></button>
              </div>

            {/* Input Field */}
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                placeholder="Issue analytical command or question..." 
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 disabled:opacity-50 outline-none font-medium"
              />
              
            {/* Submit Button */}
              <button 
                onClick={handleSendMessage}
                disabled={!query.trim() || isProcessing}
                className="bg-blue-700 hover:bg-blue-800 disabled:bg-slate-400 text-white p-2.5 rounded mr-1.5 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ANALYSIS STREAM (MIDDLE - Scrolls down) */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth bg-slate-50/50">
          <div className="max-w-4xl mx-auto flex flex-col justify-start min-h-full">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            
            {isProcessing && (
              <div className="flex justify-start mt-4 mb-8">
                <div className="bg-white border border-slate-300 px-5 py-3 rounded-xl shadow-sm flex items-center space-x-3">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-slate-600 text-xs font-semibold tracking-wide">SatQuery Orchestrator is analyzing inputs...</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </section>
      {/* Mount the drawer hidden; it will slide in when isHistoryOpen is true */}
      <HistoryDrawer 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
      />
    </main>
  );
}