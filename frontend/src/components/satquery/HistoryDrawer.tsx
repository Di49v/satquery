'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useGeoChatStore } from '@/lib/store/useGeoChatStore';
import { Clock, MessageSquare, X, Loader2, Search } from 'lucide-react';

interface Session {
  id: string;
  title: string;
  created_at: string;
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryDrawer({ isOpen, onClose }: HistoryDrawerProps) {
  const { loadSession, sessionId: currentSessionId } = useGeoChatStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

  const fetchSessions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('id, title, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSessions(data);
    }
    setIsLoading(false);
  };

  const handleSelectSession = async (id: string) => {
    await loadSession(id);
    onClose();
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <aside className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-300">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-slate-800 flex items-center tracking-wide">
            <Clock className="w-4 h-4 mr-2 text-blue-600" /> Session History
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search past analyses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center p-6 text-slate-400 text-sm italic">
              No sessions found.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`w-full text-left p-4 rounded border transition-colors flex items-start space-x-3 ${
                    session.id === currentSessionId 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 mt-0.5 ${session.id === currentSessionId ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold text-slate-800 truncate">{session.title}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(session.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}