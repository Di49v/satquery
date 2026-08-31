import { create } from 'zustand';

interface AuditLog {
  id: string;
  timestamp: string;
  message: string;
}

interface AuditState {
  logs: AuditLog[];
  addLog: (message: string) => void;
}

export const useAuditStore = create<AuditState>((set) => ({
  logs: [
    { id: 'init-1', timestamp: new Date().toLocaleTimeString(), message: 'SysInit: GovRS Kernel Booted' },
    { id: 'init-2', timestamp: new Date().toLocaleTimeString(), message: 'Authentication Bypassed (Guest)' }
  ],
  addLog: (message) => set((state) => ({
    // Keep only the latest 50 logs to prevent memory bloat
    logs: [...state.logs, { 
      id: Math.random().toString(36).substring(7), 
      timestamp: new Date().toLocaleTimeString(), 
      message 
    }].slice(-50)
  }))
}));