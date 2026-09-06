import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface EvidencePayload {
  type: 'mask' | 'statistics' | 'chart' | 'mixed';
  imageUrl?: string;
  stats?: Record<string, string | number>;
  highlightChange?: string;
}

export interface GeoMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  lat?: number | null;
  lng?: number | null;
  zoom?: number | null;
  isUser: boolean;
  evidence?: EvidencePayload; // Added support for spatial evidence
  trace?: string[];           // Added support for execution trace
}

interface GeoChatState {
  isOpen: boolean;
  sessionId: string | null;
  messages: GeoMessage[];
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  startNewSession: (title?: string) => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  addMessage: (msg: Omit<GeoMessage, 'id' | 'timestamp'>) => Promise<void>;
}

export const useGeoChatStore = create<GeoChatState>((set, get) => ({
  isOpen: false,
  sessionId: null,
  messages: [], // Starts totally empty; no more hardcoded ghost messages!

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  // Starts a fresh database session
 startNewSession: async (title = 'New Analysis Session') => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([{ title }])
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return;
    }

    set({
      sessionId: data.id,
      messages: [] // Completely empty now. No hardcoded greeting.
    });
  },

  // Loads an old session (For your upcoming History Tab)
  loadSession: async (sessionId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    const loadedMessages: GeoMessage[] = data.map((row) => ({
      id: row.id,
      sender: row.sender,
      text: row.text,
      isUser: row.is_user,
      lat: row.lat,
      lng: row.lng,
      zoom: row.zoom,
      evidence: row.evidence,
      trace: row.trace,
      timestamp: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    set({ sessionId, messages: loadedMessages });
  },

  // Adds a message to UI instantly, then saves to Supabase
  addMessage: async (msg) => {
    let { sessionId } = get();

    // Auto-start a DB session if the user types before one exists
    if (!sessionId) {
      await get().startNewSession();
      sessionId = get().sessionId;
    }

    if (!sessionId) return;

    // 1. Optimistic Update (Immediate UI response)
    const tempId = Math.random().toString(36).substring(7);
    const optimisticMsg: GeoMessage = {
      ...msg,
      id: tempId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    set((state) => ({ messages: [...state.messages, optimisticMsg] }));

    // 2. Persist to PostgreSQL
    const { error } = await supabase
      .from('chat_messages')
      .insert([{
        session_id: sessionId,
        sender: msg.sender,
        text: msg.text,
        is_user: msg.isUser,
        lat: msg.lat,
        lng: msg.lng,
        zoom: msg.zoom,
        evidence: msg.evidence,
        trace: msg.trace
      }]);

    if (error) console.error('Failed to save message to Supabase:', error);
  }
}));