'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Radio, Minus, Crosshair, Send, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useGeoChatStore } from '@/lib/store/useGeoChatStore';
import { useGeoStore } from '@/lib/store/useGeoStore';
import { useAuditStore } from '@/lib/store/useAuditStore';

export default function GeoChatPanel() {
  const router = useRouter();
  const { isOpen, messages, toggleChat, addMessage, closeChat } = useGeoChatStore();
  const { lat, lng, zoom, setCoordinates, setZoom } = useGeoStore();
  const { addLog } = useAuditStore();

  const [inputVal, setInputVal] = useState('');
  const [tagLocation, setTagLocation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleMaximize = () => {
    // Route to the full workspace and close the popup
    router.push('/satquery');
    closeChat();
  };

  const handleSendMessage = async () => {
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    
    addMessage({
      sender: 'USER',
      text: userText,
      lat: tagLocation ? lat : null,
      lng: tagLocation ? lng : null,
      zoom: tagLocation ? zoom : null,
      isUser: true,
    });
    
    addLog(`SatQuery Transmitting: "${userText.substring(0, 20)}..."`);
    setInputVal('');

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userText,
          sender: 'USER',
          lat: tagLocation ? lat : null,
          lng: tagLocation ? lng : null,
          zoom: tagLocation ? zoom : null,
        }),
      });

      if (!response.ok) throw new Error('Comms link failed');

      const data = await response.json();

      addMessage({
        sender: data.sender, // Should be GOVRS_AGENT from your backend
        text: data.text,
        lat: data.lat,
        lng: data.lng,
        zoom: data.zoom,
        isUser: false,
      });
      
      addLog(`SatQuery Received: Response from ${data.sender}`);

    } catch (error) {
      console.error("Backend connection error:", error);
      addMessage({
        sender: 'SYSTEM_ERR',
        text: 'Unable to reach MoE backend services. Ensure FastAPI is running.',
        isUser: false,
      });
    }
  };
  
  const handleTargetClick = (targetLat: number, targetLng: number, targetZoom?: number | null) => {
    setCoordinates(targetLat, targetLng);
    if (targetZoom) setZoom(targetZoom);
    addLog(`SatQuery Teleport -> Target: [${targetLat.toFixed(4)}, ${targetLng.toFixed(4)}]`);
  };

  if (!isOpen) return null;

  return (
    <div className="w-84 bg-white border border-slate-400 shadow-2xl flex flex-col h-[460px] max-h-[75vh] z-[450] animate-in fade-in slide-in-from-bottom-3 duration-200">
      
      {/* Header */}
      <div className="bg-gov-header text-white px-3 py-2 flex justify-between items-center border-b-2 border-amber-500">
        <span className="font-bold text-xs uppercase tracking-wide flex items-center">
          <Radio className="w-4 h-4 text-amber-500 mr-2 animate-pulse" /> SatQuery Assistant
        </span>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleMaximize} 
            className="text-slate-400 hover:text-white transition-colors"
            title="Maximize to Workspace"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={toggleChat} 
            className="text-slate-400 hover:text-white transition-colors"
            title="Minimize Comms"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-100 text-xs border-b border-slate-300 panel-scroll">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'} w-full`}
          >
            <span className={`text-[9px] font-bold ${msg.isUser ? 'text-amber-800' : 'text-slate-600'} mb-0.5 uppercase`}>
              {msg.sender} <span className="text-slate-400 font-normal ml-1">{msg.timestamp}</span>
            </span>
            
            <div className={`border p-2 text-slate-800 shadow-sm max-w-[90%] break-words ${
              msg.isUser ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-300'
            }`}>
              
              {/* Markdown Renderer instead of plain <p> */}
              <div className="prose prose-sm prose-slate max-w-none text-xs leading-relaxed overflow-hidden">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
              
              {/* If target location is tagged */}
              {msg.lat != null && msg.lng != null && (
                <div className="mt-2 pt-1.5 border-t border-slate-200">
                  <button 
                    onClick={() => handleTargetClick(msg.lat!, msg.lng!, msg.zoom)}
                    className="text-[9px] font-mono bg-gov-blue text-white px-2 py-1 border border-slate-800 hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-1"
                  >
                    <Crosshair className="w-3 h-3 text-amber-400" />
                    [{msg.lat.toFixed(4)}, {msg.lng.toFixed(4)}]
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Controls */}
      <div className="p-2.5 bg-white flex flex-col space-y-2 border-t border-slate-200">
        <div className="flex justify-between items-center px-1">
          <label className="flex items-center space-x-1.5 cursor-pointer text-[10px] font-bold text-slate-600 hover:text-gov-accent transition-colors">
            <input 
              type="checkbox" 
              checked={tagLocation} 
              onChange={(e) => setTagLocation(e.target.checked)}
              className="form-checkbox h-3.5 w-3.5 text-gov-accent"
            />
            <span>Tag Current Map Target</span>
          </label>
          <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 font-bold">
            ONLINE
          </span>
        </div>

        <div className="flex space-x-2">
          <input 
            type="text" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Broadcast query..." 
            className="flex-1 border border-slate-300 p-1.5 text-xs focus:outline-none focus:border-gov-accent bg-slate-50 focus:bg-white transition-colors"
          />
          <button 
            onClick={handleSendMessage}
            className="bg-amber-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-amber-700 transition-colors border border-amber-800 shadow-sm flex items-center justify-center"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}