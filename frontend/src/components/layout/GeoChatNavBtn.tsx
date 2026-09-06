'use client'; // This tells Next.js this specific button uses browser features

import { MessageSquare } from 'lucide-react';
import { useGeoChatStore } from '@/lib/store/useGeoChatStore';

export default function QuickCommsBtn() {
  const { toggleChat } = useGeoChatStore(); 

  return (
    <button 
      onClick={toggleChat}
      className="w-full hover:bg-slate-700 px-3 py-2 transition text-amber-400 font-bold border border-amber-600/30 bg-amber-900/20 flex items-center cursor-pointer mb-2"
    >
      <MessageSquare className="w-4 h-4 mr-2" /> Quick Assistant
    </button>
  );
}