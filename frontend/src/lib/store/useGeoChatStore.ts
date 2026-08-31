import { create } from 'zustand';

export interface GeoMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  lat?: number | null;
  lng?: number | null;
  zoom?: number | null;
  isUser: boolean;
}

interface GeoChatState {
  isOpen: boolean;
  messages: GeoMessage[];
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  addMessage: (msg: Omit<GeoMessage, 'id' | 'timestamp'>) => void;
}

export const useGeoChatStore = create<GeoChatState>((set) => ({
  isOpen: false,
  messages: [
    {
      id: 'msg-init',
      sender: 'GOVRS_BOT',
      text: 'Secure com-link established. Ready for multimodal spatial queries.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: false,
    }
  ],
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  addMessage: (msg) => set((state) => ({
    messages: [
      ...state.messages,
      {
        ...msg,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  }))
}));