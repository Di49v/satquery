import { create } from 'zustand';

export interface Observation {
  id: string;
  sensor: 'Sentinel-2' | 'Sentinel-1' | 'Cartosat-2S' | 'RISAT';
  modality: 'Optical' | 'SAR' | 'Multispectral';
  date: string;
}

interface ObservationState {
  targetCoordinates: { lat: number; lng: number } | null;
  activeObservations: Observation[];
  setTargetCoordinates: (coords: { lat: number; lng: number }) => void;
  addObservation: (obs: Observation) => void;
  removeObservation: (id: string) => void;
  clearContext: () => void;
}

export const useObservationStore = create<ObservationState>((set) => ({
  targetCoordinates: null,
  activeObservations: [],
  setTargetCoordinates: (coords) => set({ targetCoordinates: coords }),
  addObservation: (obs) => set((state) => ({ 
    activeObservations: [...state.activeObservations, obs] 
  })),
  removeObservation: (id) => set((state) => ({
    activeObservations: state.activeObservations.filter(o => o.id !== id)
  })),
  clearContext: () => set({ targetCoordinates: null, activeObservations: [] })
}));