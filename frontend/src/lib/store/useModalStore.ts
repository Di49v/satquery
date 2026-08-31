import { create } from 'zustand';

interface ModalState {
  activeModal: 'sql' | 'compare' | 'analysis' | null;
  analysisPayload: { source: 'map' | 'sql'; data: any[] } | null;
  openModal: (modal: 'sql' | 'compare' | 'analysis', payload?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  analysisPayload: null,
  openModal: (modal, payload = null) => set({ 
    activeModal: modal, 
    ...(modal === 'analysis' && { analysisPayload: payload }) 
  }),
  closeModal: () => set({ activeModal: null, analysisPayload: null }),
}));