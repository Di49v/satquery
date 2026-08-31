import { create } from 'zustand';

interface ModalState {
  activeModal: 'sql' | 'compare' | 'analysis' | null;
  openModal: (modal: 'sql' | 'compare' | 'analysis') => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
}));