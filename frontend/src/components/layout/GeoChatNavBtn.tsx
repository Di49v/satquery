'use client'; // This tells Next.js this specific button uses browser features

import { Satellite } from 'lucide-react';
import { useGeoChatStore } from '@/lib/store/useGeoChatStore';

export default function GeoChatNavBtn() {
  const { toggleChat } = useGeoChatStore(); // Connect to the Zustand store

  return (
    <button 
      onClick={toggleChat}
      className="hover:bg-slate-700 px-3 py-1.5 transition text-amber-400 font-bold border border-amber-600/30 bg-amber-900/20 ml-2 flex items-center cursor-pointer"
    >
      <Satellite className="w-3 h-3 mr-1.5 animate-pulse" /> GeoChat (Live)
    </button>
  );
}